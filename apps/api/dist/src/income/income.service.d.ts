import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIncomeDto, UpdateIncomeDto } from './income.dto';
export declare class IncomeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: UUID, payload: CreateIncomeDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        budgetPeriodId: string;
        amount: number;
    }>;
    findAllByBudgetPeriod(userId: UUID, budgetPeriodId: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        budgetPeriodId: string;
        amount: number;
    }[]>;
    findOne(userId: UUID, incomeId: UUID): Promise<{
        budgetPeriod: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            userId: string;
            startDate: Date;
            endDate: Date;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        budgetPeriodId: string;
        amount: number;
    }>;
    update(userId: UUID, incomeId: UUID, payload: UpdateIncomeDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        budgetPeriodId: string;
        amount: number;
    }>;
    delete(userId: UUID, incomeId: UUID): Promise<{
        success: boolean;
    }>;
}
