import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto } from './auth.dto';
import { UserService } from '../user/user.service';
import { RefreshTokenService } from './refresh-token.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    private readonly refreshTokenService;
    private readonly prisma;
    private readonly mailService;
    private readonly configService;
    constructor(userService: UserService, jwtService: JwtService, refreshTokenService: RefreshTokenService, prisma: PrismaService, mailService: MailService, configService: ConfigService);
    login(payload: LoginDto, userAgent?: string, ipAddress?: string): Promise<{
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
            passwordResetToken: string | null;
            passwordResetTokenExpiresAt: Date | null;
        }, "password">;
        accessToken: string;
        refreshToken: string;
        requiresTwoFactor?: undefined;
    }>;
    refreshTokens(rawRefreshToken: string, userAgent?: string, ipAddress?: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(rawRefreshToken: string): Promise<void>;
    logoutAll(userId: string): Promise<void>;
    completeTwoFactorLogin(userId: string, userAgent?: string, ipAddress?: string): Promise<{
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
            passwordResetToken: string | null;
            passwordResetTokenExpiresAt: Date | null;
        }, "password">;
        accessToken: string;
        refreshToken: string;
    }>;
    requestPasswordReset(payload: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(payload: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
