import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';
import { RefreshTokenService } from './refresh-token.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../common/testing/prisma-mock.helper';
import { createTestRefreshToken } from '../common/testing/test-factory';

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshTokenService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RefreshTokenService>(RefreshTokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateRefreshToken', () => {
    it('should generate a token and store its hash', async () => {
      prisma.refreshToken.create.mockResolvedValue({});

      const rawToken = await service.generateRefreshToken(
        'user-1',
        'Mozilla/5.0',
        '127.0.0.1',
      );

      expect(rawToken).toBeDefined();
      expect(typeof rawToken).toBe('string');
      expect(rawToken.length).toBeGreaterThan(0);

      expect(prisma.refreshToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          tokenHash: expect.any(String),
          userId: 'user-1',
          userAgent: 'Mozilla/5.0',
          ipAddress: '127.0.0.1',
          expiresAt: expect.any(Date),
        }),
      });

      // Verify the stored hash matches the raw token
      const storedHash =
        prisma.refreshToken.create.mock.calls[0][0].data.tokenHash;
      const expectedHash = createHash('sha256')
        .update(rawToken)
        .digest('hex');
      expect(storedHash).toBe(expectedHash);
    });
  });

  describe('validateAndRotate', () => {
    it('should validate token and return new token with userId', async () => {
      const testToken = createTestRefreshToken({ userId: 'user-1' });

      prisma.refreshToken.findFirst.mockResolvedValue(testToken);
      prisma.$transaction.mockResolvedValue([{}, {}]);

      const result = await service.validateAndRotate(
        testToken.rawToken,
        'Mozilla/5.0',
        '127.0.0.1',
      );

      expect(result.userId).toBe('user-1');
      expect(result.newRawToken).toBeDefined();
      expect(typeof result.newRawToken).toBe('string');
    });

    it('should throw if token not found', async () => {
      prisma.refreshToken.findFirst.mockResolvedValue(null);

      await expect(
        service.validateAndRotate('invalid-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should revoke all user tokens if token is already revoked (reuse detection)', async () => {
      const revokedToken = createTestRefreshToken({
        userId: 'user-1',
        isRevoked: true,
      });

      prisma.refreshToken.findFirst.mockResolvedValue(revokedToken);
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 3 });

      await expect(
        service.validateAndRotate(revokedToken.rawToken),
      ).rejects.toThrow(UnauthorizedException);

      // Should have revoked all tokens for this user
      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRevoked: false },
        data: { isRevoked: true },
      });
    });

    it('should throw if token is expired', async () => {
      const expiredToken = createTestRefreshToken({
        expiresAt: new Date('2020-01-01'),
      });

      prisma.refreshToken.findFirst.mockResolvedValue(expiredToken);

      await expect(
        service.validateAndRotate(expiredToken.rawToken),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('revokeByRawToken', () => {
    it('should revoke a token by its raw value', async () => {
      const testToken = createTestRefreshToken();
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

      await service.revokeByRawToken(testToken.rawToken);

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { tokenHash: testToken.tokenHash, isRevoked: false },
        data: { isRevoked: true },
      });
    });
  });

  describe('revokeAllUserTokens', () => {
    it('should revoke all tokens for a user', async () => {
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 5 });

      await service.revokeAllUserTokens('user-1');

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { userId: 'user-1', isRevoked: false },
        data: { isRevoked: true },
      });
    });
  });

  describe('getActiveSessions', () => {
    it('should return active sessions with isCurrent flag', async () => {
      const token1 = createTestRefreshToken({ id: 'tok-1', userId: 'user-1' });
      const token2 = createTestRefreshToken({ id: 'tok-2', userId: 'user-1' });

      prisma.refreshToken.findMany.mockResolvedValue([
        {
          id: token1.id,
          userAgent: token1.userAgent,
          ipAddress: token1.ipAddress,
          lastUsedAt: token1.lastUsedAt,
          createdAt: token1.createdAt,
          tokenHash: token1.tokenHash,
        },
        {
          id: token2.id,
          userAgent: token2.userAgent,
          ipAddress: token2.ipAddress,
          lastUsedAt: token2.lastUsedAt,
          createdAt: token2.createdAt,
          tokenHash: token2.tokenHash,
        },
      ]);

      const sessions = await service.getActiveSessions(
        'user-1',
        token1.tokenHash,
      );

      expect(sessions).toHaveLength(2);
      expect(sessions[0].isCurrent).toBe(true);
      expect(sessions[1].isCurrent).toBe(false);
      // Should not expose tokenHash
      expect(sessions[0]).not.toHaveProperty('tokenHash');
    });

    it('should return sessions without current flag when no hash provided', async () => {
      const token = createTestRefreshToken({ userId: 'user-1' });

      prisma.refreshToken.findMany.mockResolvedValue([
        {
          id: token.id,
          userAgent: token.userAgent,
          ipAddress: token.ipAddress,
          lastUsedAt: token.lastUsedAt,
          createdAt: token.createdAt,
          tokenHash: token.tokenHash,
        },
      ]);

      const sessions = await service.getActiveSessions('user-1');

      expect(sessions).toHaveLength(1);
      expect(sessions[0].isCurrent).toBe(false);
    });
  });

  describe('revokeSession', () => {
    it('should revoke a specific session', async () => {
      prisma.refreshToken.updateMany.mockResolvedValue({ count: 1 });

      await service.revokeSession('user-1', 'session-1');

      expect(prisma.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { id: 'session-1', userId: 'user-1', isRevoked: false },
        data: { isRevoked: true },
      });
    });
  });

  describe('hashToken', () => {
    it('should produce consistent SHA-256 hashes', () => {
      const hash1 = service.hashToken('test-token');
      const hash2 = service.hashToken('test-token');
      expect(hash1).toBe(hash2);

      const expected = createHash('sha256')
        .update('test-token')
        .digest('hex');
      expect(hash1).toBe(expected);
    });

    it('should produce different hashes for different tokens', () => {
      const hash1 = service.hashToken('token-a');
      const hash2 = service.hashToken('token-b');
      expect(hash1).not.toBe(hash2);
    });
  });
});
