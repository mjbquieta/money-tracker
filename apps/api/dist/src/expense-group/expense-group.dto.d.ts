export declare class CreateExpenseGroupDto {
    name: string;
    description?: string;
    budgetPeriodId: string;
}
export declare class UpdateExpenseGroupDto {
    name?: string;
    description?: string;
}
export declare class AddExpensesToGroupDto {
    expenseIds: string[];
}
export declare class MoveExpensesToGroupDto {
    expenseIds: string[];
    targetGroupId?: string | null;
}
