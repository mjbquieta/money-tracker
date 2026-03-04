"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockPrismaService = createMockPrismaService;
function createMockModel() {
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
function createMockPrismaService() {
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
        twoFactorBackupCode: createMockModel(),
        $transaction: jest.fn((fn) => {
            if (typeof fn === 'function') {
                return fn(createMockPrismaService());
            }
            return Promise.all(fn);
        }),
        $connect: jest.fn(),
        $disconnect: jest.fn(),
    };
}
//# sourceMappingURL=prisma-mock.helper.js.map