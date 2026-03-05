declare enum DebtType {
    I_OWE = "I_OWE",
    OWED_TO_ME = "OWED_TO_ME"
}
declare enum DebtStatus {
    ACTIVE = "ACTIVE",
    SETTLED = "SETTLED",
    CANCELLED = "CANCELLED"
}
export declare class CreateDebtDto {
    type: DebtType;
    counterparty: string;
    description?: string;
    amount: number;
    dueDate?: string;
}
export declare class UpdateDebtDto {
    counterparty?: string;
    description?: string;
    amount?: number;
    dueDate?: string;
    status?: DebtStatus;
}
export declare class CreateDebtPaymentDto {
    amount: number;
    note?: string;
}
export {};
