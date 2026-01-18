import { UUID } from 'crypto';
import { IncomeService } from './income.service';
import { CreateIncomeDto, UpdateIncomeDto } from './income.dto';
export declare class IncomeController {
    private readonly incomeService;
    constructor(incomeService: IncomeService);
    create(userId: UUID, payload: CreateIncomeDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        amount: number;
        budgetPeriodId: string;
    }>;
    findAllByBudgetPeriod(userId: UUID, budgetPeriodId: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        amount: number;
        budgetPeriodId: string;
    }[]>;
    findOne(userId: UUID, id: UUID): Promise<{
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
        amount: number;
        budgetPeriodId: string;
    }>;
    update(userId: UUID, id: UUID, payload: UpdateIncomeDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        amount: number;
        budgetPeriodId: string;
    }>;
    delete(userId: UUID, id: UUID): Promise<{
        success: boolean;
    }>;
}
