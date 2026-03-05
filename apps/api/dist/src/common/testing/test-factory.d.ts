export declare function createTestUser(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    email: string;
    name: string;
    username: string;
    password: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
};
export declare function createTestCategory(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    description: string;
    spendingLimit: null;
    isDefault: boolean;
    defaultCategory: null;
    userId: `${string}-${string}-${string}-${string}-${string}`;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
};
export declare function createTestBudgetPeriod(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    startDate: Date;
    endDate: Date;
    userId: `${string}-${string}-${string}-${string}-${string}`;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
    expenses: never[];
    incomes: never[];
};
export declare function createTestExpense(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    description: string;
    amount: number;
    categoryId: `${string}-${string}-${string}-${string}-${string}`;
    budgetPeriodId: `${string}-${string}-${string}-${string}-${string}`;
    expenseGroupId: null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
};
export declare function createTestExpenseTemplate(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    description: string;
    amount: number;
    categoryId: `${string}-${string}-${string}-${string}-${string}`;
    userId: `${string}-${string}-${string}-${string}-${string}`;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
};
export declare function createTestRecurringExpense(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    description: string;
    amount: number;
    frequency: string;
    startDate: Date;
    endDate: null;
    isActive: boolean;
    lastProcessedDate: null;
    categoryId: `${string}-${string}-${string}-${string}-${string}`;
    userId: `${string}-${string}-${string}-${string}-${string}`;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
};
export declare function createTestRefreshToken(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    tokenHash: string;
    rawToken: `${string}-${string}-${string}-${string}-${string}`;
    userId: `${string}-${string}-${string}-${string}-${string}`;
    userAgent: string;
    ipAddress: string;
    isRevoked: boolean;
    expiresAt: Date;
    lastUsedAt: null;
    createdAt: Date;
};
export declare function createTestTag(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    color: string;
    userId: `${string}-${string}-${string}-${string}-${string}`;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
};
export declare function createTestFinancialGoal(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    description: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: Date;
    status: string;
    userId: `${string}-${string}-${string}-${string}-${string}`;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
    contributions: never[];
    _count: {
        contributions: number;
    };
};
export declare function createTestGoalContribution(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    amount: number;
    note: string;
    goalId: `${string}-${string}-${string}-${string}-${string}`;
    createdAt: Date;
};
export declare function createTestDebt(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    type: string;
    counterparty: string;
    description: string;
    amount: number;
    paidAmount: number;
    dueDate: Date;
    status: string;
    userId: `${string}-${string}-${string}-${string}-${string}`;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
    payments: never[];
    _count: {
        payments: number;
    };
};
export declare function createTestDebtPayment(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    amount: number;
    note: string;
    debtId: `${string}-${string}-${string}-${string}-${string}`;
    createdAt: Date;
};
export declare function createTestIncome(overrides?: Record<string, unknown>): {
    id: `${string}-${string}-${string}-${string}-${string}`;
    name: string;
    description: string;
    amount: number;
    budgetPeriodId: `${string}-${string}-${string}-${string}-${string}`;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: null;
};
