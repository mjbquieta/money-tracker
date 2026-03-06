import { UUID } from 'crypto';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
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
    findOne(userId: UUID, id: UUID): Promise<{
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
    getSpendingStatus(userId: UUID, id: UUID, budgetPeriodId: UUID): Promise<{
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
    create(userId: UUID, payload: CreateCategoryDto): Promise<{
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
    update(userId: UUID, id: UUID, payload: UpdateCategoryDto): Promise<{
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
    delete(userId: UUID, id: UUID): Promise<{
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
}
