declare class IncomeItemDto {
    name: string;
    description?: string;
    amount: number;
}
declare class CreateBudgetPeriodDto {
    name?: string;
    startDate: Date;
    endDate: Date;
    incomes?: IncomeItemDto[];
}
declare class UpdateBudgetPeriodDto {
    name?: string;
    startDate?: Date;
    endDate?: Date;
}
declare class DuplicateBudgetPeriodDto {
    name?: string;
    startDate: Date;
    endDate: Date;
}
export { IncomeItemDto, CreateBudgetPeriodDto, UpdateBudgetPeriodDto, DuplicateBudgetPeriodDto, };
