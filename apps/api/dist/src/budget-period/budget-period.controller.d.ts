import { UUID } from 'crypto';
import { BudgetPeriodService } from './budget-period.service';
import { CreateBudgetPeriodDto, DuplicateBudgetPeriodDto, UpdateBudgetPeriodDto } from './budget-period.dto';
export declare class BudgetPeriodController {
    private readonly budgetPeriodService;
    constructor(budgetPeriodService: BudgetPeriodService);
    findAll(userId: UUID): Promise<({
        expenses: ({
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                isDefault: boolean;
                defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            categoryId: string;
            budgetPeriodId: string;
        })[];
    } & {
        name: string | null;
        startDate: Date;
        endDate: Date;
        income: number;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    })[]>;
    findOne(userId: UUID, id: UUID): Promise<{
        expenses: ({
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                isDefault: boolean;
                defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            categoryId: string;
            budgetPeriodId: string;
        })[];
    } & {
        name: string | null;
        startDate: Date;
        endDate: Date;
        income: number;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    getYearlyMetrics(userId: UUID, year?: string): Promise<{
        year: number;
        totalIncome: number;
        totalExpenses: number;
        savings: number;
        savingsRate: number;
        expensesByCategory: Record<string, {
            total: number;
            count: number;
        }>;
        monthlyBreakdown: {
            month: number;
            income: number;
            expenses: number;
        }[];
        budgetPeriodsCount: number;
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
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                isDefault: boolean;
                defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            categoryId: string;
            budgetPeriodId: string;
        })[];
    } & {
        name: string | null;
        startDate: Date;
        endDate: Date;
        income: number;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    duplicate(userId: UUID, id: UUID, payload: DuplicateBudgetPeriodDto): Promise<({
        expenses: ({
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                isDefault: boolean;
                defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            categoryId: string;
            budgetPeriodId: string;
        })[];
    } & {
        name: string | null;
        startDate: Date;
        endDate: Date;
        income: number;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }) | null>;
    update(userId: UUID, id: UUID, payload: UpdateBudgetPeriodDto): Promise<{
        expenses: ({
            category: {
                name: string;
                id: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                isDefault: boolean;
                defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            };
        } & {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            categoryId: string;
            budgetPeriodId: string;
        })[];
    } & {
        name: string | null;
        startDate: Date;
        endDate: Date;
        income: number;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    delete(userId: UUID, id: UUID): Promise<{
        name: string | null;
        startDate: Date;
        endDate: Date;
        income: number;
        id: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
}
