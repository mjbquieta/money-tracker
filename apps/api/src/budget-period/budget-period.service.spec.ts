import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { BudgetPeriodService } from './budget-period.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../common/testing/prisma-mock.helper';
import { createTestBudgetPeriod, createTestExpense, createTestCategory } from '../common/testing/test-factory';

describe('BudgetPeriodService', () => {
  let service: BudgetPeriodService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BudgetPeriodService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<BudgetPeriodService>(BudgetPeriodService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAverageDailySpending', () => {
    it('should calculate daily average spending', async () => {
      const userId = 'user-1' as UUID;
      const category = createTestCategory({ id: 'cat-1' });
      const budgetPeriod = createTestBudgetPeriod({
        id: 'bp-1',
        userId,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-10'),
        expenses: [
          createTestExpense({ amount: 50, createdAt: new Date('2025-01-02'), category }),
          createTestExpense({ amount: 30, createdAt: new Date('2025-01-05'), category }),
        ],
        incomes: [],
      });

      prisma.budgetPeriod.findFirst.mockResolvedValue(budgetPeriod);

      const result = await service.getAverageDailySpending(userId, 'bp-1' as UUID);

      expect(result.totalExpenses).toBe(80);
      expect(result.totalDays).toBe(10);
      expect(result.dailyAverage).toBe(8);
      expect(result.dailyBreakdown).toHaveLength(10);
    });

    it('should return zero average when no expenses', async () => {
      const userId = 'user-1' as UUID;
      const budgetPeriod = createTestBudgetPeriod({
        id: 'bp-1',
        userId,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
        expenses: [],
        incomes: [],
      });

      prisma.budgetPeriod.findFirst.mockResolvedValue(budgetPeriod);

      const result = await service.getAverageDailySpending(userId, 'bp-1' as UUID);

      expect(result.totalExpenses).toBe(0);
      expect(result.dailyAverage).toBe(0);
    });

    it('should throw NotFoundException when budget period not found', async () => {
      const userId = 'user-1' as UUID;
      prisma.budgetPeriod.findFirst.mockResolvedValue(null);

      await expect(
        service.getAverageDailySpending(userId, 'bp-1' as UUID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTopExpenses', () => {
    it('should return top expenses sorted by amount', async () => {
      const userId = 'user-1' as UUID;
      const category = createTestCategory({ id: 'cat-1', name: 'Bills' });
      const budgetPeriod = createTestBudgetPeriod({ id: 'bp-1', userId });
      const expenses = [
        { id: 'e-1', name: 'Rent', amount: 1500, category, createdAt: new Date() },
        { id: 'e-2', name: 'Electric', amount: 200, category, createdAt: new Date() },
        { id: 'e-3', name: 'Water', amount: 50, category, createdAt: new Date() },
      ];

      prisma.budgetPeriod.findFirst.mockResolvedValue(budgetPeriod);
      prisma.expense.findMany.mockResolvedValue(expenses);

      const result = await service.getTopExpenses(userId, 'bp-1' as UUID, 3);

      expect(result).toHaveLength(3);
      expect(result[0].name).toBe('Rent');
      expect(result[0].amount).toBe(1500);
      expect(result[0].categoryName).toBe('Bills');
    });

    it('should respect limit parameter', async () => {
      const userId = 'user-1' as UUID;
      const budgetPeriod = createTestBudgetPeriod({ id: 'bp-1', userId });

      prisma.budgetPeriod.findFirst.mockResolvedValue(budgetPeriod);
      prisma.expense.findMany.mockResolvedValue([]);

      await service.getTopExpenses(userId, 'bp-1' as UUID, 10);

      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ take: 10 }),
      );
    });
  });

  describe('getCategoryComparison', () => {
    it('should return category breakdowns for multiple periods', async () => {
      const userId = 'user-1' as UUID;
      const category = createTestCategory({ id: 'cat-1', name: 'Food' });
      const periods = [
        createTestBudgetPeriod({
          id: 'bp-1',
          userId,
          name: 'January',
          expenses: [
            createTestExpense({ amount: 100, category }),
            createTestExpense({ amount: 50, category }),
          ],
          incomes: [{ amount: 3000 }],
        }),
        createTestBudgetPeriod({
          id: 'bp-2',
          userId,
          name: 'February',
          expenses: [
            createTestExpense({ amount: 200, category }),
          ],
          incomes: [{ amount: 3000 }],
        }),
      ];

      prisma.budgetPeriod.findMany.mockResolvedValue(periods);

      const result = await service.getCategoryComparison(userId, ['bp-1', 'bp-2']);

      expect(result).toHaveLength(2);
      expect(result[0].totalExpenses).toBe(150);
      expect(result[0].expensesByCategory.Food.total).toBe(150);
      expect(result[1].totalExpenses).toBe(200);
    });

    it('should return empty array for no matching periods', async () => {
      const userId = 'user-1' as UUID;
      prisma.budgetPeriod.findMany.mockResolvedValue([]);

      const result = await service.getCategoryComparison(userId, ['bp-1']);

      expect(result).toHaveLength(0);
    });
  });
});
