import { randomUUID } from 'crypto';

export function createTestUser(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
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

export function createTestCategory(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    name: `Category ${Date.now()}`,
    description: 'Test category description',
    isDefault: false,
    defaultCategory: null,
    userId: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}

export function createTestBudgetPeriod(overrides: Record<string, unknown> = {}) {
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-01-31');

  return {
    id: randomUUID(),
    name: 'January 2025',
    startDate,
    endDate,
    userId: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    expenses: [],
    incomes: [],
    ...overrides,
  };
}

export function createTestExpense(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    name: 'Test Expense',
    description: 'Test expense description',
    amount: 50.0,
    categoryId: randomUUID(),
    budgetPeriodId: randomUUID(),
    expenseGroupId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}

export function createTestIncome(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    name: 'Main Job',
    description: 'Monthly salary',
    amount: 3000.0,
    budgetPeriodId: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}
