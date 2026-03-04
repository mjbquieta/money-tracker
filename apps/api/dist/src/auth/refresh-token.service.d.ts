import { PrismaService } from '../prisma/prisma.service';
export declare class RefreshTokenService {
    private readonly prisma;
    private readonly TOKEN_EXPIRY_DAYS;
    constructor(prisma: PrismaService);
    generateRefreshToken(userId: string, userAgent?: string, ipAddress?: string): Promise<string>;
    validateAndRotate(rawToken: string, userAgent?: string, ipAddress?: string): Promise<{
        newRawToken: string;
        userId: string;
    }>;
    revokeByRawToken(rawToken: string): Promise<void>;
    revokeAllUserTokens(userId: string): Promise<void>;
    getActiveSessions(userId: string, currentTokenHash?: string): Promise<{
        id: string;
        userAgent: string | null;
        ipAddress: string | null;
        lastUsedAt: Date | null;
        createdAt: Date;
        isCurrent: boolean;
    }[]>;
    revokeSession(userId: string, sessionId: string): Promise<void>;
    hashToken(rawToken: string): string;
}
