import { PrismaService } from '../prisma/prisma.service';
export declare class TwoFactorService {
    private readonly prisma;
    private readonly APP_NAME;
    constructor(prisma: PrismaService);
    generateSecret(userId: string): Promise<{
        secret: string;
        qrCodeDataUrl: string;
        otpAuthUrl: string;
    }>;
    verifyAndEnable(userId: string, code: string): Promise<{
        enabled: boolean;
        backupCodes: string[];
    }>;
    disable(userId: string, password: string, code: string): Promise<{
        disabled: boolean;
    }>;
    authenticate(userId: string, code: string, isBackupCode?: boolean): Promise<boolean>;
    generateBackupCodes(userId: string): Promise<string[]>;
    private verifyBackupCode;
    private hashCode;
}
