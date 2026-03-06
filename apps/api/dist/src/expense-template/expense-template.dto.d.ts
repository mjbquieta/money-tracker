declare class CreateExpenseTemplateDto {
    name: string;
    description?: string;
    amount: number;
    categoryId: string;
}
declare class UpdateExpenseTemplateDto {
    name?: string;
    description?: string;
    amount?: number;
    categoryId?: string;
}
declare class CreateExpenseFromTemplateDto {
    templateId: string;
    budgetPeriodId: string;
    expenseGroupId?: string;
    amount?: number;
    name?: string;
}
export { CreateExpenseTemplateDto, UpdateExpenseTemplateDto, CreateExpenseFromTemplateDto };
