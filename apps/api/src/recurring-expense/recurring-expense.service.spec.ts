import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { RecurringExpenseService } from './recurring-expense.service';
import { RecurrenceFrequency } from './recurring-expense.dto';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../common/testing/prisma-mock.helper';
import { createTestRecurringExpense, createTestCategory, createTestBudgetPeriod, createTestExpense } from '../common/testing/test-factory';

describe('RecurringExpenseService', () => {
  let service: RecurringExpenseService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecurringExpenseService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<RecurringExpenseService>(RecurringExpenseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a recurring expense successfully', async () => {
      const userId = 'user-1' as UUID;
      const category = createTestCategory({ id: 'cat-1', userId });
      const recurring = createTestRecurringExpense({ categoryId: 'cat-1', userId });

      prisma.category.findFirst.mockResolvedValue(category);
      prisma.recurringExpense.create.mockResolvedValue({ ...recurring, category });

      const result = await service.create(userId, {
        name: 'Monthly Rent',
        amount: 1500,
        categoryId: 'cat-1',
        frequency: RecurrenceFrequency.MONTHLY,
        startDate: '2025-01-01',
      });

      expect(result).toBeDefined();
      expect(prisma.recurringExpense.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when category not found', async () => {
      const userId = 'user-1' as UUID;
      prisma.category.findFirst.mockResolvedValue(null);

      await expect(
        service.create(userId, {
          name: 'Test',
          amount: 100,
          categoryId: 'cat-1',
          frequency: RecurrenceFrequency.MONTHLY,
          startDate: '2025-01-01',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated recurring expenses', async () => {
      const userId = 'user-1' as UUID;
      const items = [
        createTestRecurringExpense({ id: 'rec-1', userId }),
        createTestRecurringExpense({ id: 'rec-2', userId }),
      ];

      prisma.recurringExpense.findMany.mockResolvedValue(items);
      prisma.recurringExpense.count.mockResolvedValue(2);

      const result = await service.findAll(userId, { limit: 20, sortOrder: 'desc' as any });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.hasMore).toBe(false);
    });
  });

  describe('findOne', () => {
    it('should return a recurring expense', async () => {
      const userId = 'user-1' as UUID;
      const recurring = createTestRecurringExpense({ id: 'rec-1', userId });

      prisma.recurringExpense.findFirst.mockResolvedValue(recurring);

      const result = await service.findOne(userId, 'rec-1' as UUID);
      expect(result).toEqual(recurring);
    });

    it('should throw NotFoundException when not found', async () => {
      const userId = 'user-1' as UUID;
      prisma.recurringExpense.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne(userId, 'rec-1' as UUID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete a recurring expense', async () => {
      const userId = 'user-1' as UUID;
      const recurring = createTestRecurringExpense({ id: 'rec-1', userId });

      prisma.recurringExpense.findFirst.mockResolvedValue(recurring);
      prisma.recurringExpense.update.mockResolvedValue({ ...recurring, deletedAt: new Date() });

      const result = await service.delete(userId, 'rec-1' as UUID);
      expect(result.deletedAt).toBeDefined();
    });
  });

  describe('calculateOccurrences', () => {
    it('should calculate daily occurrences within period', () => {
      const result = service.calculateOccurrences(
        RecurrenceFrequency.DAILY,
        new Date('2025-01-01'),
        null,
        new Date('2025-01-01'),
        new Date('2025-01-05'),
      );

      expect(result).toHaveLength(5);
    });

    it('should calculate weekly occurrences within period', () => {
      const result = service.calculateOccurrences(
        RecurrenceFrequency.WEEKLY,
        new Date('2025-01-01'),
        null,
        new Date('2025-01-01'),
        new Date('2025-01-31'),
      );

      // Jan 1, 8, 15, 22, 29
      expect(result).toHaveLength(5);
    });

    it('should calculate biweekly occurrences within period', () => {
      const result = service.calculateOccurrences(
        RecurrenceFrequency.BIWEEKLY,
        new Date('2025-01-01'),
        null,
        new Date('2025-01-01'),
        new Date('2025-01-31'),
      );

      // Jan 1, 15, 29
      expect(result).toHaveLength(3);
    });

    it('should calculate monthly occurrences within period', () => {
      const result = service.calculateOccurrences(
        RecurrenceFrequency.MONTHLY,
        new Date('2025-01-15'),
        null,
        new Date('2025-01-01'),
        new Date('2025-03-31'),
      );

      // Jan 15, Feb 15, Mar 15
      expect(result).toHaveLength(3);
    });

    it('should calculate yearly occurrences within period', () => {
      const result = service.calculateOccurrences(
        RecurrenceFrequency.YEARLY,
        new Date('2024-06-15'),
        null,
        new Date('2025-01-01'),
        new Date('2026-12-31'),
      );

      // Jun 15 2025, Jun 15 2026
      expect(result).toHaveLength(2);
    });

    it('should respect endDate of recurring expense', () => {
      const result = service.calculateOccurrences(
        RecurrenceFrequency.WEEKLY,
        new Date('2025-01-01'),
        new Date('2025-01-15'), // ends mid-month
        new Date('2025-01-01'),
        new Date('2025-01-31'),
      );

      // Jan 1, 8, 15 (endDate stops further)
      expect(result).toHaveLength(3);
    });

    it('should only include occurrences within period range', () => {
      const result = service.calculateOccurrences(
        RecurrenceFrequency.MONTHLY,
        new Date('2024-06-01'), // started in the past
        null,
        new Date('2025-01-01'),
        new Date('2025-03-31'),
      );

      // Only Jan 1, Feb 1, Mar 1 (within period)
      expect(result).toHaveLength(3);
    });
  });

  describe('generateForBudgetPeriod', () => {
    it('should generate expenses from recurring expenses', async () => {
      const userId = 'user-1' as UUID;
      const budgetPeriod = createTestBudgetPeriod({
        id: 'bp-1',
        userId,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-31'),
      });
      const recurring = createTestRecurringExpense({
        id: 'rec-1',
        userId,
        frequency: 'MONTHLY',
        startDate: new Date('2025-01-01'),
        categoryId: 'cat-1',
      });
      const expense = createTestExpense({ name: recurring.name, amount: recurring.amount });

      prisma.budgetPeriod.findFirst.mockResolvedValue(budgetPeriod);
      prisma.recurringExpense.findMany.mockResolvedValue([recurring]);
      prisma.$transaction.mockResolvedValue([expense]);
      prisma.recurringExpense.update.mockResolvedValue(recurring);

      const result = await service.generateForBudgetPeriod(userId, 'bp-1' as UUID);

      expect(result.generatedCount).toBe(1);
      expect(result.expenses).toHaveLength(1);
    });

    it('should throw NotFoundException when budget period not found', async () => {
      const userId = 'user-1' as UUID;
      prisma.budgetPeriod.findFirst.mockResolvedValue(null);

      await expect(
        service.generateForBudgetPeriod(userId, 'bp-1' as UUID),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return zero when no recurring expenses match', async () => {
      const userId = 'user-1' as UUID;
      const budgetPeriod = createTestBudgetPeriod({ id: 'bp-1', userId });

      prisma.budgetPeriod.findFirst.mockResolvedValue(budgetPeriod);
      prisma.recurringExpense.findMany.mockResolvedValue([]);

      const result = await service.generateForBudgetPeriod(userId, 'bp-1' as UUID);

      expect(result.generatedCount).toBe(0);
      expect(result.expenses).toHaveLength(0);
    });
  });
});
