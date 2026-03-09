"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const crypto_1 = require("crypto");
const lodash_1 = require("lodash");
const bcrypt = __importStar(require("bcrypt"));
const user_service_1 = require("../user/user.service");
const refresh_token_service_1 = require("./refresh-token.service");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    userService;
    jwtService;
    refreshTokenService;
    prisma;
    mailService;
    configService;
    constructor(userService, jwtService, refreshTokenService, prisma, mailService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.prisma = prisma;
        this.mailService = mailService;
        this.configService = configService;
    }
    async login(payload, userAgent, ipAddress) {
        const isEmail = !(0, lodash_1.isEmpty)(payload.email);
        const val = (isEmail ? payload.email : payload.username) || '';
        const user = await this.userService.findByCredentials(val, payload.password, isEmail);
        if (user.isTwoFactorEnabled) {
            const partialToken = this.jwtService.sign({
                sub: user.id,
                email: user.email,
                username: user.username,
                tokenType: 'partial',
            }, { expiresIn: '5m' });
            return {
                requiresTwoFactor: true,
                accessToken: partialToken,
            };
        }
        const tokenPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            tokenType: 'full',
        };
        const refreshToken = await this.refreshTokenService.generateRefreshToken(user.id, userAgent, ipAddress);
        return {
            user,
            accessToken: this.jwtService.sign(tokenPayload),
            refreshToken,
        };
    }
    async refreshTokens(rawRefreshToken, userAgent, ipAddress) {
        const { newRawToken, userId } = await this.refreshTokenService.validateAndRotate(rawRefreshToken, userAgent, ipAddress);
        const user = await this.userService.findOne(userId);
        const tokenPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            tokenType: 'full',
        };
        return {
            accessToken: this.jwtService.sign(tokenPayload),
            refreshToken: newRawToken,
        };
    }
    async logout(rawRefreshToken) {
        await this.refreshTokenService.revokeByRawToken(rawRefreshToken);
    }
    async logoutAll(userId) {
        await this.refreshTokenService.revokeAllUserTokens(userId);
    }
    async completeTwoFactorLogin(userId, userAgent, ipAddress) {
        const user = await this.userService.findOne(userId);
        const tokenPayload = {
            sub: user.id,
            email: user.email,
            username: user.username,
            tokenType: 'full',
        };
        const refreshToken = await this.refreshTokenService.generateRefreshToken(user.id, userAgent, ipAddress);
        return {
            user,
            accessToken: this.jwtService.sign(tokenPayload),
            refreshToken,
        };
    }
    async requestPasswordReset(payload) {
        const user = await this.prisma.user.findUnique({
            where: { email: payload.email, deletedAt: null },
        });
        if (!user) {
            return { message: 'If an account with that email exists, a reset link has been sent.' };
        }
        const rawToken = (0, crypto_1.randomBytes)(32).toString('hex');
        const tokenHash = (0, crypto_1.createHash)('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: tokenHash,
                passwordResetTokenExpiresAt: expiresAt,
            },
        });
        const appUrl = this.configService.get('APP_URL', 'http://localhost:3000');
        const resetUrl = `${appUrl}/auth/reset-password?token=${rawToken}`;
        this.mailService.sendPasswordResetEmail(user.email, user.name ?? user.username, resetUrl);
        return { message: 'If an account with that email exists, a reset link has been sent.' };
    }
    async resetPassword(payload) {
        const tokenHash = (0, crypto_1.createHash)('sha256')
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
            throw new common_1.BadRequestException('Invalid or expired reset token');
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
        await this.refreshTokenService.revokeAllUserTokens(user.id);
        return { message: 'Password has been reset successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        refresh_token_service_1.RefreshTokenService,
        prisma_service_1.PrismaService,
        mail_service_1.MailService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map