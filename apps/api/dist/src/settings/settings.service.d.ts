import { PrismaService } from 'src/prisma/prisma.service';
import { SettingsDto } from './settings.dto';
import { Prisma } from '@prisma/client';
import { UUID } from 'crypto';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: UUID, payload: SettingsDto, tx?: Prisma.TransactionClient): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        currency: string;
        userId: string;
    }>;
}
