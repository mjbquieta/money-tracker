declare enum GoalStatus {
    ACTIVE = "ACTIVE",
    COMPLETED = "COMPLETED",
    PAUSED = "PAUSED",
    CANCELLED = "CANCELLED"
}
export declare class CreateFinancialGoalDto {
    name: string;
    description?: string;
    targetAmount: number;
    targetDate?: string;
}
export declare class UpdateFinancialGoalDto {
    name?: string;
    description?: string;
    targetAmount?: number;
    targetDate?: string;
    status?: GoalStatus;
}
export declare class CreateGoalContributionDto {
    amount: number;
    note?: string;
}
export {};
