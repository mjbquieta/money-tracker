declare class IncomeItemDto {
    name: string;
    description?: string;
    amount: number;
}
declare class CreateBudgetPeriodDto {
    name?: string;
    startDate: Date;
    endDate: Date;
    income?: number;
    incomes?: IncomeItemDto[];
}
declare class UpdateBudgetPeriodDto {
    name?: string;
    startDate?: Date;
    endDate?: Date;
    income?: number;
}
declare class DuplicateBudgetPeriodDto {
    name?: string;
    startDate: Date;
    endDate: Date;
    income?: number;
}
export { IncomeItemDto, CreateBudgetPeriodDto, UpdateBudgetPeriodDto, DuplicateBudgetPeriodDto, };
