export declare class ImportExpenseRecord {
    name: string;
    description?: string;
    amount: number;
    categoryName: string;
}
export declare class ImportExpensesDto {
    budgetPeriodId: string;
    records: ImportExpenseRecord[];
}
