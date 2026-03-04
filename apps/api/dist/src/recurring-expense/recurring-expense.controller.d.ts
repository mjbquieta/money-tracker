import { UUID } from 'crypto';
import { RecurringExpenseService } from './recurring-expense.service';
import { CreateRecurringExpenseDto, UpdateRecurringExpenseDto, GenerateRecurringExpensesDto } from './recurring-expense.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
export declare class RecurringExpenseController {
    private readonly recurringExpenseService;
    constructor(recurringExpenseService: RecurringExpenseService);
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
    generate(userId: UUID, payload: GenerateRecurringExpensesDto): Promise<{
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
}
