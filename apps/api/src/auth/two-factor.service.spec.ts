import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { TwoFactorService } from './two-factor.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../common/testing/prisma-mock.helper';

// Mock otplib
jest.mock('otplib', () => ({
  generateSecret: jest.fn(() => 'MOCK_SECRET_KEY'),
  generateURI: jest.fn(
    (opts: { label: string; issuer: string; secret: string }) =>
      `otpauth://totp/${opts.issuer}:${opts.label}?secret=${opts.secret}&issuer=${opts.issuer}`,
  ),
  verifySync: jest.fn(),
}));

// Mock qrcode
jest.mock('qrcode', () => ({
  toDataURL: jest.fn(() => Promise.resolve('data:image/png;base64,mockqr')),
}));

import { verifySync } from 'otplib';

describe('TwoFactorService', () => {
  let service: TwoFactorService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TwoFactorService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TwoFactorService>(TwoFactorService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateSecret', () => {
    it('should generate a secret and QR code', async () => {
      prisma.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
        isTwoFactorEnabled: false,
      });
      prisma.user.update.mockResolvedValue({});

      const result = await service.generateSecret('user-1');

      expect(result.secret).toBe('MOCK_SECRET_KEY');
      expect(result.qrCodeDataUrl).toBe('data:image/png;base64,mockqr');
      expect(result.otpAuthUrl).toContain('otpauth://totp/');
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { twoFactorSecret: 'MOCK_SECRET_KEY' },
      });
    });

    it('should throw if 2FA is already enabled', async () => {
      prisma.user.findUnique.mockResolvedValue({
        email: 'test@example.com',
        isTwoFactorEnabled: true,
      });

      await expect(service.generateSecret('user-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyAndEnable', () => {
    it('should verify OTP and enable 2FA', async () => {
      prisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET_KEY',
        isTwoFactorEnabled: false,
      });
      (verifySync as jest.Mock).mockReturnValue({ valid: true });
      prisma.user.update.mockResolvedValue({});
      prisma.twoFactorBackupCode.deleteMany.mockResolvedValue({});
      prisma.twoFactorBackupCode.createMany.mockResolvedValue({ count: 10 });

      const result = await service.verifyAndEnable('user-1', '123456');

      expect(result.enabled).toBe(true);
      expect(result.backupCodes).toHaveLength(10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { isTwoFactorEnabled: true },
      });
    });

    it('should throw if setup not initiated', async () => {
      prisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: null,
        isTwoFactorEnabled: false,
      });

      await expect(
        service.verifyAndEnable('user-1', '123456'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if invalid OTP', async () => {
      prisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET_KEY',
        isTwoFactorEnabled: false,
      });
      (verifySync as jest.Mock).mockReturnValue({ valid: false });

      await expect(
        service.verifyAndEnable('user-1', '000000'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw if already enabled', async () => {
      prisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET_KEY',
        isTwoFactorEnabled: true,
      });

      await expect(
        service.verifyAndEnable('user-1', '123456'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('authenticate', () => {
    it('should authenticate with valid OTP', async () => {
      prisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET_KEY',
        isTwoFactorEnabled: true,
      });
      (verifySync as jest.Mock).mockReturnValue({ valid: true });

      const result = await service.authenticate('user-1', '123456');
      expect(result).toBe(true);
    });

    it('should throw on invalid OTP', async () => {
      prisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET_KEY',
        isTwoFactorEnabled: true,
      });
      (verifySync as jest.Mock).mockReturnValue({ valid: false });

      await expect(
        service.authenticate('user-1', '000000'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should authenticate with valid backup code', async () => {
      const rawCode = 'abcd1234';
      const codeHash = createHash('sha256').update(rawCode).digest('hex');

      prisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET_KEY',
        isTwoFactorEnabled: true,
      });
      prisma.twoFactorBackupCode.findFirst.mockResolvedValue({
        id: 'bc-1',
        codeHash,
        isUsed: false,
      });
      prisma.twoFactorBackupCode.update.mockResolvedValue({});

      const result = await service.authenticate('user-1', rawCode, true);
      expect(result).toBe(true);
      expect(prisma.twoFactorBackupCode.update).toHaveBeenCalledWith({
        where: { id: 'bc-1' },
        data: { isUsed: true, usedAt: expect.any(Date) },
      });
    });

    it('should throw on invalid backup code', async () => {
      prisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: 'MOCK_SECRET_KEY',
        isTwoFactorEnabled: true,
      });
      prisma.twoFactorBackupCode.findFirst.mockResolvedValue(null);

      await expect(
        service.authenticate('user-1', 'invalid', true),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw if 2FA not enabled', async () => {
      prisma.user.findUnique.mockResolvedValue({
        twoFactorSecret: null,
        isTwoFactorEnabled: false,
      });

      await expect(
        service.authenticate('user-1', '123456'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('generateBackupCodes', () => {
    it('should generate 10 backup codes and store hashes', async () => {
      prisma.twoFactorBackupCode.deleteMany.mockResolvedValue({});
      prisma.twoFactorBackupCode.createMany.mockResolvedValue({ count: 10 });

      const codes = await service.generateBackupCodes('user-1');

      expect(codes).toHaveLength(10);
      expect(prisma.twoFactorBackupCode.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
      expect(prisma.twoFactorBackupCode.createMany).toHaveBeenCalledWith({
        data: expect.arrayContaining([
          expect.objectContaining({
            codeHash: expect.any(String),
            userId: 'user-1',
          }),
        ]),
      });

      // Each code should be 8 hex characters
      for (const code of codes) {
        expect(code).toMatch(/^[a-f0-9]{8}$/);
      }
    });
  });
});
