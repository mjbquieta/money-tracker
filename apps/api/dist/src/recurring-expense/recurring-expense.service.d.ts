import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecurringExpenseDto, UpdateRecurringExpenseDto, RecurrenceFrequency } from './recurring-expense.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
export declare class RecurringExpenseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: UUID, payload: CreateRecurringExpenseDto): Promise<{
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
        userId: string;
        description: string | null;
        categoryId: string;
        startDate: Date;
        endDate: Date | null;
        amount: number;
        frequency: import("@prisma/client").$Enums.RecurrenceFrequency;
        isActive: boolean;
        lastProcessedDate: Date | null;
    }>;
    findAll(userId: UUID, pagination: PaginationQueryDto): Promise<{
        data: ({
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
            userId: string;
            description: string | null;
            categoryId: string;
            startDate: Date;
            endDate: Date | null;
            amount: number;
            frequency: import("@prisma/client").$Enums.RecurrenceFrequency;
            isActive: boolean;
            lastProcessedDate: Date | null;
        })[];
        pagination: import("../common/interfaces/api-response.interface").PaginationMeta;
    }>;
    findOne(userId: UUID, id: UUID): Promise<{
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
        userId: string;
        description: string | null;
        categoryId: string;
        startDate: Date;
        endDate: Date | null;
        amount: number;
        frequency: import("@prisma/client").$Enums.RecurrenceFrequency;
        isActive: boolean;
        lastProcessedDate: Date | null;
    }>;
    update(userId: UUID, id: UUID, payload: UpdateRecurringExpenseDto): Promise<{
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
        userId: string;
        description: string | null;
        categoryId: string;
        startDate: Date;
        endDate: Date | null;
        amount: number;
        frequency: import("@prisma/client").$Enums.RecurrenceFrequency;
        isActive: boolean;
        lastProcessedDate: Date | null;
    }>;
    delete(userId: UUID, id: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        categoryId: string;
        startDate: Date;
        endDate: Date | null;
        amount: number;
        frequency: import("@prisma/client").$Enums.RecurrenceFrequency;
        isActive: boolean;
        lastProcessedDate: Date | null;
    }>;
    generateForBudgetPeriod(userId: UUID, budgetPeriodId: UUID): Promise<{
        generatedCount: number;
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
    }>;
    calculateOccurrences(frequency: RecurrenceFrequency, startDate: Date, endDate: Date | null, periodStart: Date, periodEnd: Date): Date[];
}
