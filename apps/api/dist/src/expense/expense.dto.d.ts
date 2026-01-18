declare class CreateExpenseDto {
    name: string;
    description?: string;
    amount: number;
    categoryId: string;
    budgetPeriodId: string;
}
declare class UpdateExpenseDto {
    name?: string;
    description?: string;
    amount?: number;
    categoryId?: string;
}
export { CreateExpenseDto, UpdateExpenseDto };
