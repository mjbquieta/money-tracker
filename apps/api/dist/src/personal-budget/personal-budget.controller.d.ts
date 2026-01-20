import { UUID } from 'crypto';
import { PersonalBudgetService } from './personal-budget.service';
import { CreatePersonalBudgetDto, CreatePersonalBudgetItemDto, UpdatePersonalBudgetDto, UpdatePersonalBudgetItemDto } from './personal-budget.dto';
export declare class PersonalBudgetController {
    private readonly personalBudgetService;
    constructor(personalBudgetService: PersonalBudgetService);
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
    findOne(userId: UUID, id: UUID): Promise<{
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
    getSummary(userId: UUID, id: UUID): Promise<{
        total: number;
        itemCount: number;
    }>;
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
    update(userId: UUID, id: UUID, payload: UpdatePersonalBudgetDto): Promise<{
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
    delete(userId: UUID, id: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
    }>;
    addItem(userId: UUID, id: UUID, payload: CreatePersonalBudgetItemDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        amount: number;
        personalBudgetId: string;
    }>;
    updateItem(userId: UUID, id: UUID, itemId: UUID, payload: UpdatePersonalBudgetItemDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        amount: number;
        personalBudgetId: string;
    }>;
    deleteItem(userId: UUID, id: UUID, itemId: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        description: string | null;
        amount: number;
        personalBudgetId: string;
    }>;
}
