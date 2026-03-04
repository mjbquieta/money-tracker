import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import {
  LoginDto,
  VerifyTwoFactorDto,
  DisableTwoFactorDto,
  TwoFactorAuthenticateDto,
} from './auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { TwoFactorAuthGuard } from './two-factor-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { RefreshTokenService } from './refresh-token.service';
import { TwoFactorService } from './two-factor.service';
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromCookie,
} from './cookie.helper';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  @Post('login')
  async login(
    @Body(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }))
    body: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const result = await this.authService.login(body, userAgent, ipAddress);

    if ('refreshToken' in result && result.refreshToken) {
      setRefreshTokenCookie(res, result.refreshToken as string);
      const { refreshToken, ...rest } = result;
      return rest;
    }

    // 2FA required — no refresh token cookie
    return result;
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawToken = getRefreshTokenFromCookie(req.cookies);

    if (!rawToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const result = await this.authService.refreshTokens(
      rawToken,
      userAgent,
      ipAddress,
    );

    setRefreshTokenCookie(res, result.refreshToken);

    return { accessToken: result.accessToken };
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawToken = getRefreshTokenFromCookie(req.cookies);

    if (rawToken) {
      await this.authService.logout(rawToken);
    }

    clearRefreshTokenCookie(res);
    return { message: 'Logged out successfully' };
  }

  @Post('logout-all')
  @UseGuards(AuthGuard)
  async logoutAll(
    @CurrentUser('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logoutAll(userId);
    clearRefreshTokenCookie(res);
    return { message: 'All sessions revoked' };
  }

  @Get('sessions')
  @UseGuards(AuthGuard)
  async getSessions(
    @CurrentUser('id') userId: string,
    @Req() req: Request,
  ) {
    const rawToken = getRefreshTokenFromCookie(req.cookies);
    const currentTokenHash = rawToken
      ? this.refreshTokenService.hashToken(rawToken)
      : undefined;

    return this.refreshTokenService.getActiveSessions(userId, currentTokenHash);
  }

  @Delete('sessions/:id')
  @UseGuards(AuthGuard)
  async revokeSession(
    @CurrentUser('id') userId: string,
    @Param('id') sessionId: string,
  ) {
    await this.refreshTokenService.revokeSession(userId, sessionId);
    return { message: 'Session revoked' };
  }

  // --- Two-Factor Authentication ---

  @Post('2fa/setup')
  @UseGuards(AuthGuard)
  async setupTwoFactor(@CurrentUser('id') userId: string) {
    return this.twoFactorService.generateSecret(userId);
  }

  @Post('2fa/verify')
  @UseGuards(AuthGuard)
  async verifyTwoFactor(
    @CurrentUser('id') userId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    body: VerifyTwoFactorDto,
  ) {
    return this.twoFactorService.verifyAndEnable(userId, body.code);
  }

  @Post('2fa/disable')
  @UseGuards(TwoFactorAuthGuard)
  async disableTwoFactor(
    @CurrentUser('id') userId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    body: DisableTwoFactorDto,
  ) {
    return this.twoFactorService.disable(userId, body.password, body.code);
  }

  @Get('2fa/backup-codes')
  @UseGuards(TwoFactorAuthGuard)
  async getBackupCodes(@CurrentUser('id') userId: string) {
    const codes = await this.twoFactorService.generateBackupCodes(userId);
    return { backupCodes: codes };
  }

  @Post('2fa/authenticate')
  @UseGuards(AuthGuard)
  async authenticateTwoFactor(
    @CurrentUser('id') userId: string,
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    body: TwoFactorAuthenticateDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.twoFactorService.authenticate(
      userId,
      body.code,
      body.isBackupCode,
    );

    const userAgent = req.headers['user-agent'];
    const ipAddress = req.ip;

    const result = await this.authService.completeTwoFactorLogin(
      userId,
      userAgent,
      ipAddress,
    );

    setRefreshTokenCookie(res, result.refreshToken);

    return {
      user: result.user,
      accessToken: result.accessToken,
    };
  }
}
