import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { generateSecret, verifySync, generateURI } from 'otplib';
import { createHash, randomBytes } from 'crypto';
import * as QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TwoFactorService {
  private readonly APP_NAME = 'Prospera';

  constructor(private readonly prisma: PrismaService) {}

  async generateSecret(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, isTwoFactorEnabled: true },
    });

    if (user?.isTwoFactorEnabled) {
      throw new BadRequestException('Two-factor authentication is already enabled');
    }

    const secret = generateSecret();

    // Store secret but don't enable yet
    await this.prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: secret },
    });

    const otpAuthUrl = generateURI({
      label: user?.email || userId,
      issuer: this.APP_NAME,
      secret,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);

    return {
      secret,
      qrCodeDataUrl,
      otpAuthUrl,
    };
  }

  async verifyAndEnable(userId: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, isTwoFactorEnabled: true },
    });

    if (!user?.twoFactorSecret) {
      throw new BadRequestException('Two-factor setup not initiated');
    }

    if (user.isTwoFactorEnabled) {
      throw new BadRequestException('Two-factor authentication is already enabled');
    }

    const result = verifySync({
      token: code,
      secret: user.twoFactorSecret,
    });
    const isValid = result.valid;

    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isTwoFactorEnabled: true },
    });

    // Generate backup codes
    const backupCodes = await this.generateBackupCodes(userId);

    return { enabled: true, backupCodes };
  }

  async disable(userId: string, password: string, code: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { password: true, twoFactorSecret: true, isTwoFactorEnabled: true },
    });

    if (!user?.isTwoFactorEnabled || !user.twoFactorSecret) {
      throw new BadRequestException('Two-factor authentication is not enabled');
    }

    // Verify password
    const bcrypt = await import('bcrypt');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Verify OTP
    const result = verifySync({
      token: code,
      secret: user.twoFactorSecret,
    });
    const isValid = result.valid;

    if (!isValid) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: userId },
        data: { isTwoFactorEnabled: false, twoFactorSecret: null },
      }),
      this.prisma.twoFactorBackupCode.deleteMany({
        where: { userId },
      }),
    ]);

    return { disabled: true };
  }

  async authenticate(userId: string, code: string, isBackupCode = false) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { twoFactorSecret: true, isTwoFactorEnabled: true },
    });

    if (!user?.isTwoFactorEnabled || !user.twoFactorSecret) {
      throw new BadRequestException('Two-factor authentication is not enabled');
    }

    if (isBackupCode) {
      return this.verifyBackupCode(userId, code);
    }

    const result = verifySync({
      token: code,
      secret: user.twoFactorSecret,
    });
    const isValid = result.valid;

    if (!isValid) {
      throw new UnauthorizedException('Invalid verification code');
    }

    return true;
  }

  async generateBackupCodes(userId: string): Promise<string[]> {
    // Delete existing backup codes
    await this.prisma.twoFactorBackupCode.deleteMany({
      where: { userId },
    });

    const codes: string[] = [];
    const codeRecords: { codeHash: string; userId: string }[] = [];

    for (let i = 0; i < 10; i++) {
      const code = randomBytes(4).toString('hex'); // 8-char hex code
      codes.push(code);
      codeRecords.push({
        codeHash: this.hashCode(code),
        userId,
      });
    }

    await this.prisma.twoFactorBackupCode.createMany({
      data: codeRecords,
    });

    return codes;
  }

  private async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const codeHash = this.hashCode(code);

    const backupCode = await this.prisma.twoFactorBackupCode.findFirst({
      where: {
        userId,
        codeHash,
        isUsed: false,
      },
    });

    if (!backupCode) {
      throw new UnauthorizedException('Invalid backup code');
    }

    await this.prisma.twoFactorBackupCode.update({
      where: { id: backupCode.id },
      data: { isUsed: true, usedAt: new Date() },
    });

    return true;
  }

  private hashCode(code: string): string {
    return createHash('sha256').update(code).digest('hex');
  }
}
