import { UUID } from 'crypto';
import { BudgetPeriodService } from './budget-period.service';
import { CreateBudgetPeriodDto, DuplicateBudgetPeriodDto, UpdateBudgetPeriodDto } from './budget-period.dto';
export declare class BudgetPeriodController {
    private readonly budgetPeriodService;
    constructor(budgetPeriodService: BudgetPeriodService);
    findAll(userId: UUID): Promise<({
        expenses: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                isDefault: boolean;
                defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            categoryId: string;
            budgetPeriodId: string;
        })[];
    } & {
        id: string;
        name: string | null;
        startDate: Date;
        endDate: Date;
        income: number;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    })[]>;
    findOne(userId: UUID, id: UUID): Promise<{
        expenses: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                isDefault: boolean;
                defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            categoryId: string;
            budgetPeriodId: string;
        })[];
    } & {
        id: string;
        name: string | null;
        startDate: Date;
        endDate: Date;
        income: number;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    getSummary(userId: UUID, id: UUID): Promise<{
        income: number;
        totalExpenses: number;
        remaining: number;
        expensesByCategory: Record<string, {
            total: number;
            count: number;
        }>;
    }>;
    create(userId: UUID, payload: CreateBudgetPeriodDto): Promise<{
        expenses: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                isDefault: boolean;
                defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            categoryId: string;
            budgetPeriodId: string;
        })[];
    } & {
        id: string;
        name: string | null;
        startDate: Date;
        endDate: Date;
        income: number;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    duplicate(userId: UUID, id: UUID, payload: DuplicateBudgetPeriodDto): Promise<({
        expenses: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                isDefault: boolean;
                defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            categoryId: string;
            budgetPeriodId: string;
        })[];
    } & {
        id: string;
        name: string | null;
        startDate: Date;
        endDate: Date;
        income: number;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }) | null>;
    update(userId: UUID, id: UUID, payload: UpdateBudgetPeriodDto): Promise<{
        expenses: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                isDefault: boolean;
                defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            categoryId: string;
            budgetPeriodId: string;
        })[];
    } & {
        id: string;
        name: string | null;
        startDate: Date;
        endDate: Date;
        income: number;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    delete(userId: UUID, id: UUID): Promise<{
        id: string;
        name: string | null;
        startDate: Date;
        endDate: Date;
        income: number;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
}
