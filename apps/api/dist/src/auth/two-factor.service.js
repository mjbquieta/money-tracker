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
exports.TwoFactorService = void 0;
const common_1 = require("@nestjs/common");
const otplib_1 = require("otplib");
const crypto_1 = require("crypto");
const QRCode = __importStar(require("qrcode"));
const prisma_service_1 = require("../prisma/prisma.service");
let TwoFactorService = class TwoFactorService {
    prisma;
    APP_NAME = 'Prospera';
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateSecret(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { email: true, isTwoFactorEnabled: true },
        });
        if (user?.isTwoFactorEnabled) {
            throw new common_1.BadRequestException('Two-factor authentication is already enabled');
        }
        const secret = (0, otplib_1.generateSecret)();
        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorSecret: secret },
        });
        const otpAuthUrl = (0, otplib_1.generateURI)({
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
    async verifyAndEnable(userId, code) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { twoFactorSecret: true, isTwoFactorEnabled: true },
        });
        if (!user?.twoFactorSecret) {
            throw new common_1.BadRequestException('Two-factor setup not initiated');
        }
        if (user.isTwoFactorEnabled) {
            throw new common_1.BadRequestException('Two-factor authentication is already enabled');
        }
        const result = (0, otplib_1.verifySync)({
            token: code,
            secret: user.twoFactorSecret,
        });
        const isValid = result.valid;
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { isTwoFactorEnabled: true },
        });
        const backupCodes = await this.generateBackupCodes(userId);
        return { enabled: true, backupCodes };
    }
    async disable(userId, password, code) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { password: true, twoFactorSecret: true, isTwoFactorEnabled: true },
        });
        if (!user?.isTwoFactorEnabled || !user.twoFactorSecret) {
            throw new common_1.BadRequestException('Two-factor authentication is not enabled');
        }
        const bcrypt = await Promise.resolve().then(() => __importStar(require('bcrypt')));
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        const result = (0, otplib_1.verifySync)({
            token: code,
            secret: user.twoFactorSecret,
        });
        const isValid = result.valid;
        if (!isValid) {
            throw new common_1.BadRequestException('Invalid verification code');
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
    async authenticate(userId, code, isBackupCode = false) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { twoFactorSecret: true, isTwoFactorEnabled: true },
        });
        if (!user?.isTwoFactorEnabled || !user.twoFactorSecret) {
            throw new common_1.BadRequestException('Two-factor authentication is not enabled');
        }
        if (isBackupCode) {
            return this.verifyBackupCode(userId, code);
        }
        const result = (0, otplib_1.verifySync)({
            token: code,
            secret: user.twoFactorSecret,
        });
        const isValid = result.valid;
        if (!isValid) {
            throw new common_1.UnauthorizedException('Invalid verification code');
        }
        return true;
    }
    async generateBackupCodes(userId) {
        await this.prisma.twoFactorBackupCode.deleteMany({
            where: { userId },
        });
        const codes = [];
        const codeRecords = [];
        for (let i = 0; i < 10; i++) {
            const code = (0, crypto_1.randomBytes)(4).toString('hex');
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
    async verifyBackupCode(userId, code) {
        const codeHash = this.hashCode(code);
        const backupCode = await this.prisma.twoFactorBackupCode.findFirst({
            where: {
                userId,
                codeHash,
                isUsed: false,
            },
        });
        if (!backupCode) {
            throw new common_1.UnauthorizedException('Invalid backup code');
        }
        await this.prisma.twoFactorBackupCode.update({
            where: { id: backupCode.id },
            data: { isUsed: true, usedAt: new Date() },
        });
        return true;
    }
    hashCode(code) {
        return (0, crypto_1.createHash)('sha256').update(code).digest('hex');
    }
};
exports.TwoFactorService = TwoFactorService;
exports.TwoFactorService = TwoFactorService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TwoFactorService);
//# sourceMappingURL=two-factor.service.js.map