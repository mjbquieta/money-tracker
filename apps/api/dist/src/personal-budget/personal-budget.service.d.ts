import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePersonalBudgetDto, CreatePersonalBudgetItemDto, UpdatePersonalBudgetDto, UpdatePersonalBudgetItemDto } from './personal-budget.dto';
export declare class PersonalBudgetService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: UUID, payload: CreatePersonalBudgetDto): Promise<({
        items: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            personalBudgetId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
    }) | null>;
    findAll(userId: UUID): Promise<({
        items: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            personalBudgetId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
    })[]>;
    findOne(userId: UUID, personalBudgetId: UUID): Promise<{
        items: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            personalBudgetId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
    }>;
    update(userId: UUID, personalBudgetId: UUID, payload: UpdatePersonalBudgetDto): Promise<{
        items: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            personalBudgetId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
    }>;
    delete(userId: UUID, personalBudgetId: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
    }>;
    addItem(userId: UUID, personalBudgetId: UUID, payload: CreatePersonalBudgetItemDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        amount: number;
        personalBudgetId: string;
    }>;
    updateItem(userId: UUID, personalBudgetId: UUID, itemId: UUID, payload: UpdatePersonalBudgetItemDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        amount: number;
        personalBudgetId: string;
    }>;
    deleteItem(userId: UUID, personalBudgetId: UUID, itemId: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        amount: number;
        personalBudgetId: string;
    }>;
    getSummary(userId: UUID, personalBudgetId: UUID): Promise<{
        total: number;
        itemCount: number;
    }>;
}
