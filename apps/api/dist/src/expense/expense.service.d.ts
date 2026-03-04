import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto, CreateBulkExpenseDto } from './expense.dto';
import { ExpenseFilterDto } from './expense-filter.dto';
export declare class ExpenseService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: UUID, payload: CreateExpenseDto): Promise<{
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
    }>;
    findAll(userId: UUID, filters: ExpenseFilterDto): Promise<{
        data: ({
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
        pagination: import("../common/interfaces/api-response.interface").PaginationMeta;
    }>;
    findOne(userId: UUID, expenseId: UUID): Promise<{
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
    }>;
    update(userId: UUID, expenseId: UUID, payload: UpdateExpenseDto): Promise<{
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
    }>;
    delete(userId: UUID, expenseId: UUID): Promise<{
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
    }>;
    createBulk(userId: UUID, payload: CreateBulkExpenseDto): Promise<({
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
    })[]>;
}
