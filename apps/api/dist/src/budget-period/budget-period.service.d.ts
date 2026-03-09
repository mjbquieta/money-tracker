import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBudgetPeriodDto, DuplicateBudgetPeriodDto, UpdateBudgetPeriodDto } from './budget-period.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
export declare class BudgetPeriodService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private shouldIncludeVehicleExpenses;
    private getVehicleExpensesForDateRange;
    private getAllVehicleExpenses;
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
                spendingLimit: number | null;
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
            categoryId: string;
            budgetPeriodId: string;
            amount: number;
            expenseGroupId: string | null;
        })[];
        incomes: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            budgetPeriodId: string;
            amount: number;
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
    findAll(userId: UUID, pagination: PaginationQueryDto): Promise<{
        data: ({
            expenses: ({
                category: {
                    id: string;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date | null;
                    deletedAt: Date | null;
                    userId: string;
                    description: string | null;
                    spendingLimit: number | null;
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
                categoryId: string;
                budgetPeriodId: string;
                amount: number;
                expenseGroupId: string | null;
            })[];
            incomes: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                description: string | null;
                budgetPeriodId: string;
                amount: number;
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
        })[];
        pagination: import("../common/interfaces/api-response.interface").PaginationMeta;
    }>;
    findOne(userId: UUID, budgetPeriodId: UUID): Promise<({
        expenses: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                spendingLimit: number | null;
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
            categoryId: string;
            budgetPeriodId: string;
            amount: number;
            expenseGroupId: string | null;
        })[];
        incomes: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            budgetPeriodId: string;
            amount: number;
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
    }) | {
        vehicleExpenses: {
            id: string;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            amount: number;
            description: string | null;
            date: Date;
            vehicleId: string;
            vehicleName: string;
            isReadOnly: true;
        }[];
        expenses: ({
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                description: string | null;
                spendingLimit: number | null;
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
            categoryId: string;
            budgetPeriodId: string;
            amount: number;
            expenseGroupId: string | null;
        })[];
        incomes: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            budgetPeriodId: string;
            amount: number;
        }[];
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
                spendingLimit: number | null;
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
            categoryId: string;
            budgetPeriodId: string;
            amount: number;
            expenseGroupId: string | null;
        })[];
        incomes: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            budgetPeriodId: string;
            amount: number;
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
                spendingLimit: number | null;
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
            categoryId: string;
            budgetPeriodId: string;
            amount: number;
            expenseGroupId: string | null;
        })[];
        incomes: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            budgetPeriodId: string;
            amount: number;
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
        vehicleExpensesTotal: number;
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
    getAverageDailySpending(userId: UUID, budgetPeriodId: UUID): Promise<{
        totalExpenses: number;
        totalDays: number;
        dailyAverage: number;
        dailyBreakdown: {
            date: string;
            amount: number;
        }[];
    }>;
    getTopExpenses(userId: UUID, budgetPeriodId: UUID, limit?: number): Promise<{
        id: string;
        name: string;
        amount: number;
        categoryName: string;
        createdAt: Date;
    }[]>;
    getCategoryComparison(userId: UUID, budgetPeriodIds: string[]): Promise<{
        budgetPeriodId: string;
        name: string | null;
        startDate: Date;
        endDate: Date;
        totalExpenses: number;
        totalIncome: number;
        expensesByCategory: Record<string, {
            total: number;
            count: number;
        }>;
    }[]>;
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
