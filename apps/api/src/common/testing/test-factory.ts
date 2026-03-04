import { randomUUID, createHash } from 'crypto';

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
    spendingLimit: null,
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

export function createTestExpenseTemplate(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    name: 'Monthly Rent',
    description: 'Apartment rent payment',
    amount: 1500.0,
    categoryId: randomUUID(),
    userId: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}

export function createTestRecurringExpense(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    name: 'Monthly Rent',
    description: 'Apartment rent payment',
    amount: 1500.0,
    frequency: 'MONTHLY',
    startDate: new Date('2025-01-01'),
    endDate: null,
    isActive: true,
    lastProcessedDate: null,
    categoryId: randomUUID(),
    userId: randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}

export function createTestRefreshToken(overrides: Record<string, unknown> = {}) {
  const rawToken = randomUUID();
  const tokenHash = createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return {
    id: randomUUID(),
    tokenHash,
    rawToken,
    userId: randomUUID(),
    userAgent: 'Mozilla/5.0 Test',
    ipAddress: '127.0.0.1',
    isRevoked: false,
    expiresAt,
    lastUsedAt: null,
    createdAt: new Date(),
    ...overrides,
  };
}

export function createTestTag(overrides: Record<string, unknown> = {}) {
  return {
    id: randomUUID(),
    name: `Tag ${Date.now()}`,
    color: '#6B7280',
    userId: randomUUID(),
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
