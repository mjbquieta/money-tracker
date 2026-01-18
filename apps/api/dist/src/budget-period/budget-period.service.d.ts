import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBudgetPeriodDto, DuplicateBudgetPeriodDto, UpdateBudgetPeriodDto } from './budget-period.dto';
export declare class BudgetPeriodService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findOne(userId: UUID, budgetPeriodId: UUID): Promise<{
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
    update(userId: UUID, budgetPeriodId: UUID, payload: UpdateBudgetPeriodDto): Promise<{
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
    delete(userId: UUID, budgetPeriodId: UUID): Promise<{
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
    duplicate(userId: UUID, budgetPeriodId: UUID, payload: DuplicateBudgetPeriodDto): Promise<({
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
    getSummary(userId: UUID, budgetPeriodId: UUID): Promise<{
        income: number;
        totalExpenses: number;
        remaining: number;
        expensesByCategory: Record<string, {
            total: number;
            count: number;
        }>;
    }>;
    getYearlyMetrics(userId: UUID, year: number): Promise<{
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
}
