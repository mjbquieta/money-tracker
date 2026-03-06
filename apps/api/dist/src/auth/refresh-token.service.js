"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../prisma/prisma.service");
let RefreshTokenService = class RefreshTokenService {
    prisma;
    TOKEN_EXPIRY_DAYS = 7;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateRefreshToken(userId, userAgent, ipAddress) {
        const rawToken = (0, crypto_1.randomBytes)(64).toString('hex');
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
    async validateAndRotate(rawToken, userAgent, ipAddress) {
        const tokenHash = this.hashToken(rawToken);
        const existingToken = await this.prisma.refreshToken.findFirst({
            where: { tokenHash },
        });
        if (!existingToken) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (existingToken.isRevoked) {
            await this.revokeAllUserTokens(existingToken.userId);
            throw new common_1.UnauthorizedException('Refresh token has been revoked');
        }
        if (existingToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token has expired');
        }
        const newRawToken = (0, crypto_1.randomBytes)(64).toString('hex');
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
    async revokeByRawToken(rawToken) {
        const tokenHash = this.hashToken(rawToken);
        await this.prisma.refreshToken.updateMany({
            where: { tokenHash, isRevoked: false },
            data: { isRevoked: true },
        });
    }
    async revokeAllUserTokens(userId) {
        await this.prisma.refreshToken.updateMany({
            where: { userId, isRevoked: false },
            data: { isRevoked: true },
        });
    }
    async getActiveSessions(userId, currentTokenHash) {
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
    async revokeSession(userId, sessionId) {
        await this.prisma.refreshToken.updateMany({
            where: { id: sessionId, userId, isRevoked: false },
            data: { isRevoked: true },
        });
    }
    hashToken(rawToken) {
        return (0, crypto_1.createHash)('sha256').update(rawToken).digest('hex');
    }
};
exports.RefreshTokenService = RefreshTokenService;
exports.RefreshTokenService = RefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RefreshTokenService);
//# sourceMappingURL=refresh-token.service.js.map