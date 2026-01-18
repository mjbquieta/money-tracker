import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBudgetPeriodDto, DuplicateBudgetPeriodDto, UpdateBudgetPeriodDto } from './budget-period.dto';
export declare class BudgetPeriodService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: UUID, payload: CreateBudgetPeriodDto): Promise<({
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
            budgetPeriodId: string;
            categoryId: string;
            expenseGroupId: string | null;
        })[];
        incomes: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            budgetPeriodId: string;
        }[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        startDate: Date;
        endDate: Date;
    }) | null>;
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
            budgetPeriodId: string;
            categoryId: string;
            expenseGroupId: string | null;
        })[];
        incomes: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            budgetPeriodId: string;
        }[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        startDate: Date;
        endDate: Date;
    })[]>;
    findOne(userId: UUID, budgetPeriodId: UUID): Promise<{
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
            budgetPeriodId: string;
            categoryId: string;
            expenseGroupId: string | null;
        })[];
        incomes: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            budgetPeriodId: string;
        }[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        startDate: Date;
        endDate: Date;
    }>;
    update(userId: UUID, budgetPeriodId: UUID, payload: UpdateBudgetPeriodDto): Promise<{
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
            budgetPeriodId: string;
            categoryId: string;
            expenseGroupId: string | null;
        })[];
        incomes: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            budgetPeriodId: string;
        }[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        startDate: Date;
        endDate: Date;
    }>;
    delete(userId: UUID, budgetPeriodId: UUID): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        startDate: Date;
        endDate: Date;
    }>;
    duplicate(userId: UUID, budgetPeriodId: UUID, payload: DuplicateBudgetPeriodDto): Promise<({
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
            budgetPeriodId: string;
            categoryId: string;
            expenseGroupId: string | null;
        })[];
        incomes: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            budgetPeriodId: string;
        }[];
    } & {
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        startDate: Date;
        endDate: Date;
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
    getOverallMetrics(userId: UUID): Promise<{
        totalIncome: number;
        totalExpenses: number;
        savings: number;
        savingsRate: number;
        expensesByCategory: Record<string, {
            total: number;
            count: number;
        }>;
        budgetPeriodsCount: number;
    }>;
    getYearRangeMetrics(userId: UUID, startYear: number, endYear: number): Promise<{
        startYear: number;
        endYear: number;
        totalIncome: number;
        totalExpenses: number;
        savings: number;
        savingsRate: number;
        expensesByCategory: Record<string, {
            total: number;
            count: number;
        }>;
        yearlyBreakdown: {
            year: number;
            totalIncome: number;
            totalExpenses: number;
            savings: number;
            monthlyBreakdown: Array<{
                month: number;
                income: number;
                expenses: number;
            }>;
        }[];
        budgetPeriodsCount: number;
    }>;
}
