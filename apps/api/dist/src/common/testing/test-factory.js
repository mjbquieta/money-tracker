"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestUser = createTestUser;
exports.createTestCategory = createTestCategory;
exports.createTestBudgetPeriod = createTestBudgetPeriod;
exports.createTestExpense = createTestExpense;
exports.createTestExpenseTemplate = createTestExpenseTemplate;
exports.createTestRecurringExpense = createTestRecurringExpense;
exports.createTestIncome = createTestIncome;
const crypto_1 = require("crypto");
function createTestUser(overrides = {}) {
    return {
        id: (0, crypto_1.randomUUID)(),
        email: `user-${Date.now()}@test.com`,
        name: 'Test User',
        username: `testuser_${Date.now()}`,
        password: 'StrongP@ss123',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...overrides,
    };
}
function createTestCategory(overrides = {}) {
    return {
        id: (0, crypto_1.randomUUID)(),
        name: `Category ${Date.now()}`,
        description: 'Test category description',
        spendingLimit: null,
        isDefault: false,
        defaultCategory: null,
        userId: (0, crypto_1.randomUUID)(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...overrides,
    };
}
function createTestBudgetPeriod(overrides = {}) {
    const startDate = new Date('2025-01-01');
    const endDate = new Date('2025-01-31');
    return {
        id: (0, crypto_1.randomUUID)(),
        name: 'January 2025',
        startDate,
        endDate,
        userId: (0, crypto_1.randomUUID)(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        expenses: [],
        incomes: [],
        ...overrides,
    };
}
function createTestExpense(overrides = {}) {
    return {
        id: (0, crypto_1.randomUUID)(),
        name: 'Test Expense',
        description: 'Test expense description',
        amount: 50.0,
        categoryId: (0, crypto_1.randomUUID)(),
        budgetPeriodId: (0, crypto_1.randomUUID)(),
        expenseGroupId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...overrides,
    };
}
function createTestExpenseTemplate(overrides = {}) {
    return {
        id: (0, crypto_1.randomUUID)(),
        name: 'Monthly Rent',
        description: 'Apartment rent payment',
        amount: 1500.0,
        categoryId: (0, crypto_1.randomUUID)(),
        userId: (0, crypto_1.randomUUID)(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...overrides,
    };
}
function createTestRecurringExpense(overrides = {}) {
    return {
        id: (0, crypto_1.randomUUID)(),
        name: 'Monthly Rent',
        description: 'Apartment rent payment',
        amount: 1500.0,
        frequency: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        endDate: null,
        isActive: true,
        lastProcessedDate: null,
        categoryId: (0, crypto_1.randomUUID)(),
        userId: (0, crypto_1.randomUUID)(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...overrides,
    };
}
function createTestIncome(overrides = {}) {
    return {
        id: (0, crypto_1.randomUUID)(),
        name: 'Main Job',
        description: 'Monthly salary',
        amount: 3000.0,
        budgetPeriodId: (0, crypto_1.randomUUID)(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        ...overrides,
    };
}
//# sourceMappingURL=test-factory.js.map