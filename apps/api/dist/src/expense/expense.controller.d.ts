import { UUID } from 'crypto';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto, UpdateExpenseDto, CreateBulkExpenseDto } from './expense.dto';
export declare class ExpenseController {
    private readonly expenseService;
    constructor(expenseService: ExpenseService);
    findAll(userId: UUID, budgetPeriodId?: UUID): Promise<({
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDefault: boolean;
            defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            userId: string;
        };
        budgetPeriod: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            userId: string;
            startDate: Date;
            endDate: Date;
            income: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        amount: number;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        categoryId: string;
        budgetPeriodId: string;
    })[]>;
    findOne(userId: UUID, id: UUID): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDefault: boolean;
            defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            userId: string;
        };
        budgetPeriod: {
            id: string;
            name: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            userId: string;
            startDate: Date;
            endDate: Date;
            income: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        amount: number;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        categoryId: string;
        budgetPeriodId: string;
    }>;
    create(userId: UUID, payload: CreateExpenseDto): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDefault: boolean;
            defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            userId: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        amount: number;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        categoryId: string;
        budgetPeriodId: string;
    }>;
    createBulk(userId: UUID, payload: CreateBulkExpenseDto): Promise<({
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDefault: boolean;
            defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            userId: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        amount: number;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        categoryId: string;
        budgetPeriodId: string;
    })[]>;
    update(userId: UUID, id: UUID, payload: UpdateExpenseDto): Promise<{
        category: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            isDefault: boolean;
            defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
            userId: string;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        amount: number;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        categoryId: string;
        budgetPeriodId: string;
    }>;
    delete(userId: UUID, id: UUID): Promise<{
        id: string;
        name: string;
        description: string | null;
        amount: number;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        categoryId: string;
        budgetPeriodId: string;
    }>;
}
