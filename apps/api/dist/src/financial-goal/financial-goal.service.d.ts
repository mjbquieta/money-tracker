import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFinancialGoalDto, UpdateFinancialGoalDto, CreateGoalContributionDto } from './financial-goal.dto';
export declare class FinancialGoalService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    findOne(userId: UUID, goalId: UUID): Promise<{
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
    update(userId: UUID, goalId: UUID, payload: UpdateFinancialGoalDto): Promise<{
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
    delete(userId: UUID, goalId: UUID): Promise<{
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
    addContribution(userId: UUID, goalId: UUID, payload: CreateGoalContributionDto): Promise<{
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
    deleteContribution(userId: UUID, goalId: UUID, contributionId: UUID): Promise<{
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
    getSummary(userId: UUID): Promise<{
        totalGoals: number;
        activeGoals: number;
        completedGoals: number;
        totalTargetAmount: number;
        totalCurrentAmount: number;
        overallProgress: number;
    }>;
}
