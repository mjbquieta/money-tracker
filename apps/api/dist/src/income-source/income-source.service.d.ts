import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IncomeSourceDto } from './income-source.dto';
import { Prisma } from '@prisma/client';
export declare class IncomeSourceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: UUID, payload: IncomeSourceDto, tx?: Prisma.TransactionClient): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        amount: number;
        userId: string;
    }>;
}
