import { PrismaService } from '../../prisma/prisma.service';

type MockPrismaModel = {
  findFirst: jest.Mock;
  findMany: jest.Mock;
  findUnique: jest.Mock;
  create: jest.Mock;
  createMany: jest.Mock;
  update: jest.Mock;
  updateMany: jest.Mock;
  delete: jest.Mock;
  deleteMany: jest.Mock;
  count: jest.Mock;
  aggregate: jest.Mock;
  groupBy: jest.Mock;
};

function createMockModel(): MockPrismaModel {
  return {
    findFirst: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    createMany: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
    delete: jest.fn(),
    deleteMany: jest.fn(),
    count: jest.fn(),
    aggregate: jest.fn(),
    groupBy: jest.fn(),
  };
}

export type MockPrismaService = {
  [K in keyof PrismaService]: K extends '$transaction'
    ? jest.Mock
    : K extends '$connect' | '$disconnect'
      ? jest.Mock
      : MockPrismaModel;
};

export function createMockPrismaService(): MockPrismaService {
  return {
    user: createMockModel(),
    settings: createMockModel(),
    budgetPeriod: createMockModel(),
    income: createMockModel(),
    expense: createMockModel(),
    expenseGroup: createMockModel(),
    category: createMockModel(),
    personalBudget: createMockModel(),
    personalBudgetItem: createMockModel(),
    expenseTemplate: createMockModel(),
    recurringExpense: createMockModel(),
    refreshToken: createMockModel(),
    tag: createMockModel(),
    expenseTag: createMockModel(),
    financialGoal: createMockModel(),
    goalContribution: createMockModel(),
    twoFactorBackupCode: createMockModel(),
    $transaction: jest.fn((fn) => {
      if (typeof fn === 'function') {
        return fn(createMockPrismaService());
      }
      return Promise.all(fn);
    }),
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  } as unknown as MockPrismaService;
}
