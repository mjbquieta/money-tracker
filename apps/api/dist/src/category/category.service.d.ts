import { Prisma } from '@prisma/client';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
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
        isDefault: boolean;
        defaultCategory: import("@prisma/client").$Enums.DefaultCategory | null;
    }>;
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
    findOne(userId: UUID, categoryId: UUID): Promise<{
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
    update(userId: UUID, categoryId: UUID, payload: UpdateCategoryDto): Promise<{
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
    delete(userId: UUID, categoryId: UUID): Promise<{
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
