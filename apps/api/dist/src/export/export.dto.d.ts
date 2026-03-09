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
export declare class ImportVehicleExpenseRecord {
    type: string;
    amount: number;
    description?: string;
    date?: string;
    odometer?: number;
    fuelLiters?: number;
    fuelPricePerLiter?: number;
    isFullTank?: boolean;
    notes?: string;
}
export declare class ImportVehicleExpensesDto {
    vehicleId: string;
    records: ImportVehicleExpenseRecord[];
}
