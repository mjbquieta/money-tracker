import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseTemplateDto, UpdateExpenseTemplateDto, CreateExpenseFromTemplateDto } from './expense-template.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
export declare class ExpenseTemplateService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: UUID, payload: CreateExpenseTemplateDto): Promise<{
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
        amount: number;
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
            amount: number;
        })[];
        pagination: import("../common/interfaces/api-response.interface").PaginationMeta;
    }>;
    findOne(userId: UUID, templateId: UUID): Promise<{
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
        amount: number;
    }>;
    update(userId: UUID, templateId: UUID, payload: UpdateExpenseTemplateDto): Promise<{
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
        amount: number;
    }>;
    delete(userId: UUID, templateId: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        categoryId: string;
        amount: number;
    }>;
    createExpenseFromTemplate(userId: UUID, payload: CreateExpenseFromTemplateDto): Promise<{
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
}
