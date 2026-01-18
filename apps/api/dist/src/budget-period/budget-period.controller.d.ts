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
    getYearRangeMetrics(userId: UUID, startYear?: string, endYear?: string): Promise<{
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
            monthlyBreakdown: {
                month: number;
                income: number;
                expenses: number;
            }[];
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
    delete(userId: UUID, id: UUID): Promise<{
        id: string;
        name: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        startDate: Date;
        endDate: Date;
    }>;
}
