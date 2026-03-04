import { UUID } from 'crypto';
import { TagService } from './tag.service';
import { CreateTagDto, UpdateTagDto, TagExpenseDto } from './tag.dto';
export declare class TagController {
    private readonly tagService;
    constructor(tagService: TagService);
    findAll(userId: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        color: string;
    }[]>;
    findOne(userId: UUID, id: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        color: string;
    }>;
    create(userId: UUID, payload: CreateTagDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        color: string;
    }>;
    update(userId: UUID, id: UUID, payload: UpdateTagDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        color: string;
    }>;
    delete(userId: UUID, id: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        color: string;
    }>;
    tagExpense(userId: UUID, expenseId: UUID, payload: TagExpenseDto): Promise<({
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
        expenseTags: ({
            tag: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date | null;
                deletedAt: Date | null;
                userId: string;
                color: string;
            };
        } & {
            id: string;
            createdAt: Date;
            expenseId: string;
            tagId: string;
        })[];
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
    }) | null>;
    getExpenseTags(userId: UUID, expenseId: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        color: string;
    }[]>;
}
