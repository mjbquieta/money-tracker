declare enum RecurrenceFrequency {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    BIWEEKLY = "BIWEEKLY",
    MONTHLY = "MONTHLY",
    YEARLY = "YEARLY"
}
declare class CreateRecurringExpenseDto {
    name: string;
    description?: string;
    amount: number;
    categoryId: string;
    frequency: RecurrenceFrequency;
    startDate: string;
    endDate?: string;
}
declare class UpdateRecurringExpenseDto {
    name?: string;
    description?: string;
    amount?: number;
    categoryId?: string;
    frequency?: RecurrenceFrequency;
    startDate?: string;
    endDate?: string | null;
    isActive?: boolean;
}
declare class GenerateRecurringExpensesDto {
    budgetPeriodId: string;
}
export { CreateRecurringExpenseDto, UpdateRecurringExpenseDto, GenerateRecurringExpensesDto, RecurrenceFrequency };
