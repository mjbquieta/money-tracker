import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { UUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RefreshTokenService {
  private readonly TOKEN_EXPIRY_DAYS = 7;

  constructor(private readonly prisma: PrismaService) {}

  async generateRefreshToken(
    userId: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<string> {
    const rawToken = randomBytes(64).toString('hex');
    const tokenHash = this.hashToken(rawToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + this.TOKEN_EXPIRY_DAYS);

    await this.prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        userAgent,
        ipAddress,
        expiresAt,
      },
    });

    return rawToken;
  }

  async validateAndRotate(
    rawToken: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<{ newRawToken: string; userId: string }> {
    const tokenHash = this.hashToken(rawToken);

    const existingToken = await this.prisma.refreshToken.findFirst({
      where: { tokenHash },
    });

    if (!existingToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (existingToken.isRevoked) {
      // Possible token reuse attack — revoke all tokens for this user
      await this.revokeAllUserTokens(existingToken.userId);
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (existingToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Revoke old token and create new one in a transaction
    const newRawToken = randomBytes(64).toString('hex');
    const newTokenHash = this.hashToken(newRawToken);

    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + this.TOKEN_EXPIRY_DAYS);

    await this.prisma.$transaction([
      this.prisma.refreshToken.update({
        where: { id: existingToken.id },
        data: { isRevoked: true },
      }),
      this.prisma.refreshToken.create({
        data: {
          tokenHash: newTokenHash,
          userId: existingToken.userId,
          userAgent,
          ipAddress,
          expiresAt: newExpiresAt,
          lastUsedAt: new Date(),
        },
      }),
    ]);

    return { newRawToken, userId: existingToken.userId };
  }

  async revokeByRawToken(rawToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);

    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async getActiveSessions(userId: string, currentTokenHash?: string) {
    const tokens = await this.prisma.refreshToken.findMany({
      where: {
        userId,
        isRevoked: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userAgent: true,
        ipAddress: true,
        lastUsedAt: true,
        createdAt: true,
        tokenHash: true,
      },
    });

    return tokens.map((token) => ({
      id: token.id,
      userAgent: token.userAgent,
      ipAddress: token.ipAddress,
      lastUsedAt: token.lastUsedAt,
      createdAt: token.createdAt,
      isCurrent: currentTokenHash ? token.tokenHash === currentTokenHash : false,
    }));
  }

  async revokeSession(userId: string, sessionId: string): Promise<void> {
    await this.prisma.refreshToken.updateMany({
      where: { id: sessionId, userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }
}
