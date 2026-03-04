import { Prisma } from '@prisma/client';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
export declare class CategoryService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createDefaultCategories(userId: UUID, tx?: Prisma.TransactionClient): Promise<Prisma.BatchPayload>;
    create(userId: UUID, payload: CreateCategoryDto, tx?: Prisma.TransactionClient): Promise<{
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
    }>;
    findAll(userId: UUID, pagination: PaginationQueryDto): Promise<{
        data: {
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
        }[];
        pagination: import("../common/interfaces/api-response.interface").PaginationMeta;
    }>;
    findOne(userId: UUID, categoryId: UUID): Promise<{
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
    }>;
    update(userId: UUID, categoryId: UUID, payload: UpdateCategoryDto): Promise<{
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
    }>;
    delete(userId: UUID, categoryId: UUID): Promise<{
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
    }>;
    getSpendingStatus(userId: UUID, categoryId: UUID, budgetPeriodId: UUID): Promise<{
        categoryId: `${string}-${string}-${string}-${string}-${string}`;
        categoryName: string;
        spendingLimit: number | null;
        totalSpent: number;
        remaining: number | null;
        percentageUsed: number | null;
        isOverLimit: boolean;
        isApproachingLimit: boolean;
        expenseCount: number;
    }>;
    getAllSpendingStatus(userId: UUID, budgetPeriodId: UUID): Promise<{
        categoryId: string;
        categoryName: string;
        spendingLimit: number | null;
        totalSpent: number;
        remaining: number | null;
        percentageUsed: number | null;
        isOverLimit: boolean;
        isApproachingLimit: boolean;
        expenseCount: number;
    }[]>;
}
