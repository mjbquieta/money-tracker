import { UUID } from 'crypto';
import { FinancialGoalService } from './financial-goal.service';
import { CreateFinancialGoalDto, UpdateFinancialGoalDto, CreateGoalContributionDto } from './financial-goal.dto';
export declare class FinancialGoalController {
    private readonly financialGoalService;
    constructor(financialGoalService: FinancialGoalService);
    findAll(userId: UUID): Promise<({
        _count: {
            contributions: number;
        };
        contributions: {
            id: string;
            createdAt: Date;
            amount: number;
            note: string | null;
            goalId: string;
        }[];
    } & {
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.GoalStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        targetAmount: number;
        targetDate: Date | null;
        currentAmount: number;
    })[]>;
    getSummary(userId: UUID): Promise<{
        totalGoals: number;
        activeGoals: number;
        completedGoals: number;
        totalTargetAmount: number;
        totalCurrentAmount: number;
        overallProgress: number;
    }>;
    findOne(userId: UUID, id: UUID): Promise<{
        _count: {
            contributions: number;
        };
        contributions: {
            id: string;
            createdAt: Date;
            amount: number;
            note: string | null;
            goalId: string;
        }[];
    } & {
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.GoalStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        targetAmount: number;
        targetDate: Date | null;
        currentAmount: number;
    }>;
    create(userId: UUID, payload: CreateFinancialGoalDto): Promise<{
        _count: {
            contributions: number;
        };
        contributions: {
            id: string;
            createdAt: Date;
            amount: number;
            note: string | null;
            goalId: string;
        }[];
    } & {
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.GoalStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        targetAmount: number;
        targetDate: Date | null;
        currentAmount: number;
    }>;
    update(userId: UUID, id: UUID, payload: UpdateFinancialGoalDto): Promise<{
        _count: {
            contributions: number;
        };
        contributions: {
            id: string;
            createdAt: Date;
            amount: number;
            note: string | null;
            goalId: string;
        }[];
    } & {
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.GoalStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        targetAmount: number;
        targetDate: Date | null;
        currentAmount: number;
    }>;
    delete(userId: UUID, id: UUID): Promise<{
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.GoalStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        targetAmount: number;
        targetDate: Date | null;
        currentAmount: number;
    }>;
    addContribution(userId: UUID, id: UUID, payload: CreateGoalContributionDto): Promise<{
        _count: {
            contributions: number;
        };
        contributions: {
            id: string;
            createdAt: Date;
            amount: number;
            note: string | null;
            goalId: string;
        }[];
    } & {
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.GoalStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        targetAmount: number;
        targetDate: Date | null;
        currentAmount: number;
    }>;
    deleteContribution(userId: UUID, id: UUID, contributionId: UUID): Promise<{
        _count: {
            contributions: number;
        };
        contributions: {
            id: string;
            createdAt: Date;
            amount: number;
            note: string | null;
            goalId: string;
        }[];
    } & {
        id: string;
        name: string;
        status: import("@prisma/client").$Enums.GoalStatus;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        description: string | null;
        targetAmount: number;
        targetDate: Date | null;
        currentAmount: number;
    }>;
}
