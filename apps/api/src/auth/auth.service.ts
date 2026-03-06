import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UUID } from 'crypto';
import { LoginDto } from './auth.dto';
import { isEmpty } from 'lodash';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
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
}
