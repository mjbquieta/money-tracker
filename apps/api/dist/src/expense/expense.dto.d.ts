declare class CreateExpenseDto {
    name: string;
    description?: string;
    amount: number;
    categoryId: string;
    budgetPeriodId: string;
    expenseGroupId?: string;
}
declare class UpdateExpenseDto {
    name?: string;
    description?: string;
    amount?: number;
    categoryId?: string;
    expenseGroupId?: string | null;
}
declare class BulkExpenseItemDto {
    name: string;
    description?: string;
    amount: number;
    categoryId: string;
    expenseGroupId?: string;
}
declare class CreateBulkExpenseDto {
    budgetPeriodId: string;
    expenses: BulkExpenseItemDto[];
}
export { CreateExpenseDto, UpdateExpenseDto, CreateBulkExpenseDto, BulkExpenseItemDto };
