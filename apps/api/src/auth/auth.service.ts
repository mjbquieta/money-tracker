import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UUID, randomBytes, createHash } from 'crypto';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
import { isEmpty } from 'lodash';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from './refresh-token.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  async login(
    payload: LoginDto,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const isEmail = !isEmpty(payload.email);
    const val = (isEmail ? payload.email : payload.username) || '';

    const user = await this.userService.findByCredentials(
      val,
      payload.password,
      isEmail,
    );

    // Check if user has 2FA enabled
    if (user.isTwoFactorEnabled) {
      const partialToken = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
          username: user.username,
          tokenType: 'partial',
        },
        { expiresIn: '5m' },
      );

      return {
        requiresTwoFactor: true,
        accessToken: partialToken,
      };
    }

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      tokenType: 'full' as const,
    };

    const refreshToken = await this.refreshTokenService.generateRefreshToken(
      user.id,
      userAgent,
      ipAddress,
    );

    return {
      user,
      accessToken: this.jwtService.sign(tokenPayload),
      refreshToken,
    };
  }

  async refreshTokens(
    rawRefreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const { newRawToken, userId } =
      await this.refreshTokenService.validateAndRotate(
        rawRefreshToken,
        userAgent,
        ipAddress,
      );

    const user = await this.userService.findOne(userId as UUID);

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      tokenType: 'full' as const,
    };

    return {
      accessToken: this.jwtService.sign(tokenPayload),
      refreshToken: newRawToken,
    };
  }

  async logout(rawRefreshToken: string): Promise<void> {
    await this.refreshTokenService.revokeByRawToken(rawRefreshToken);
  }

  async logoutAll(userId: string): Promise<void> {
    await this.refreshTokenService.revokeAllUserTokens(userId);
  }

  async completeTwoFactorLogin(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ) {
    const user = await this.userService.findOne(userId as UUID);

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      username: user.username,
      tokenType: 'full' as const,
    };

    const refreshToken = await this.refreshTokenService.generateRefreshToken(
      user.id,
      userAgent,
      ipAddress,
    );

    return {
      user,
      accessToken: this.jwtService.sign(tokenPayload),
      refreshToken,
    };
  }

  async requestPasswordReset(payload: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: payload.email, deletedAt: null },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return { message: 'If an account with that email exists, a reset link has been sent.' };
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: tokenHash,
        passwordResetTokenExpiresAt: expiresAt,
      },
    });

    const appUrl = this.configService.get('APP_URL', 'http://localhost:3000');
    const resetUrl = `${appUrl}/auth/reset-password?token=${rawToken}`;

    // Fire-and-forget
    this.mailService.sendPasswordResetEmail(
      user.email,
      user.name ?? user.username,
      resetUrl,
    );

    return { message: 'If an account with that email exists, a reset link has been sent.' };
  }

  async resetPassword(payload: ResetPasswordDto) {
    const tokenHash = createHash('sha256')
      .update(payload.token)
      .digest('hex');

    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: tokenHash,
        passwordResetTokenExpiresAt: { gt: new Date() },
        deletedAt: null,
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const saltRounds = Number(this.configService.get('SALT_ROUNDS', 10));
    const hashedPassword = await bcrypt.hash(payload.newPassword, saltRounds);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null,
      },
    });

    // Revoke all refresh tokens for security
    await this.refreshTokenService.revokeAllUserTokens(user.id);

    return { message: 'Password has been reset successfully' };
  }
}
