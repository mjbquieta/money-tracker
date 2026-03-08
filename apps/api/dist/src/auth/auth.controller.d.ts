import { Request, Response } from 'express';
import { LoginDto, VerifyTwoFactorDto, DisableTwoFactorDto, TwoFactorAuthenticateDto } from './auth.dto';
import { AuthService } from './auth.service';
import { RefreshTokenService } from './refresh-token.service';
import { TwoFactorService } from './two-factor.service';
export declare class AuthController {
    private readonly authService;
    private readonly refreshTokenService;
    private readonly twoFactorService;
    constructor(authService: AuthService, refreshTokenService: RefreshTokenService, twoFactorService: TwoFactorService);
    login(body: LoginDto, req: Request, res: Response): Promise<{
        requiresTwoFactor: boolean;
        accessToken: string;
        user?: undefined;
        refreshToken?: undefined;
    } | {
        user: import("lodash").Omit<{
            settings: {
                id: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                currency: string;
                includeVehicleExpenses: boolean;
                userId: string;
            } | null;
        } & {
            id: string;
            email: string;
            username: string;
            name: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            password: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            twoFactorSecret: string | null;
            isTwoFactorEnabled: boolean;
        }, "password">;
        accessToken: string;
        requiresTwoFactor?: undefined;
    }>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
    logout(req: Request, res: Response): Promise<{
        message: string;
    }>;
    logoutAll(userId: string, res: Response): Promise<{
        message: string;
    }>;
    getSessions(userId: string, req: Request): Promise<{
        id: string;
        userAgent: string | null;
        ipAddress: string | null;
        lastUsedAt: Date | null;
        createdAt: Date;
        isCurrent: boolean;
    }[]>;
    revokeSession(userId: string, sessionId: string): Promise<{
        message: string;
    }>;
    setupTwoFactor(userId: string): Promise<{
        secret: string;
        qrCodeDataUrl: string;
        otpAuthUrl: string;
    }>;
    verifyTwoFactor(userId: string, body: VerifyTwoFactorDto): Promise<{
        enabled: boolean;
        backupCodes: string[];
    }>;
    disableTwoFactor(userId: string, body: DisableTwoFactorDto): Promise<{
        disabled: boolean;
    }>;
    getBackupCodes(userId: string): Promise<{
        backupCodes: string[];
    }>;
    authenticateTwoFactor(userId: string, body: TwoFactorAuthenticateDto, req: Request, res: Response): Promise<{
        user: import("lodash").Omit<{
            settings: {
                id: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                currency: string;
                includeVehicleExpenses: boolean;
                userId: string;
            } | null;
            categories: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                spendingLimit: number | null;
                isDefault: boolean;
                defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            }[];
        } & {
            id: string;
            email: string;
            username: string;
            name: string | null;
            status: import("@prisma/client").$Enums.UserStatus;
            password: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            twoFactorSecret: string | null;
            isTwoFactorEnabled: boolean;
        }, "password">;
        accessToken: string;
    }>;
}
