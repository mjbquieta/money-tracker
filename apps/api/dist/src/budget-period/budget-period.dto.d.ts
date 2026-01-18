declare class CreateBudgetPeriodDto {
    name?: string;
    startDate: Date;
    endDate: Date;
    income: number;
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
export { CreateBudgetPeriodDto, UpdateBudgetPeriodDto, DuplicateBudgetPeriodDto };
