import { UUID } from 'crypto';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    findAll(userId: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        isDefault: boolean;
        defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
    }[]>;
    findOne(userId: UUID, id: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        isDefault: boolean;
        defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
    }>;
    create(userId: UUID, payload: CreateCategoryDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
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
        isDefault: boolean;
        defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
    }>;
}
