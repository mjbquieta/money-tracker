import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { ExpenseService } from './expense.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../common/testing/prisma-mock.helper';
import { createTestExpense, createTestBudgetPeriod, createTestCategory } from '../common/testing/test-factory';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ExpenseService>(ExpenseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an expense successfully', async () => {
      const userId = 'user-1' as UUID;
      const budgetPeriod = createTestBudgetPeriod({ id: 'bp-1', userId });
      const category = createTestCategory({ id: 'cat-1', userId });
      const expense = createTestExpense({
        budgetPeriodId: 'bp-1',
        categoryId: 'cat-1',
      });

      prisma.budgetPeriod.findFirst.mockResolvedValue(budgetPeriod);
      prisma.category.findFirst.mockResolvedValue(category);
      prisma.expense.create.mockResolvedValue({ ...expense, category });

      const result = await service.create(userId, {
        name: expense.name,
        amount: expense.amount,
        categoryId: 'cat-1',
        budgetPeriodId: 'bp-1',
      });

      expect(result).toBeDefined();
      expect(prisma.expense.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when budget period not found', async () => {
      const userId = 'user-1' as UUID;
      prisma.budgetPeriod.findFirst.mockResolvedValue(null);

      await expect(
        service.create(userId, {
          name: 'Test',
          amount: 100,
          categoryId: 'cat-1',
          budgetPeriodId: 'bp-1',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when category not found', async () => {
      const userId = 'user-1' as UUID;
      const budgetPeriod = createTestBudgetPeriod({ id: 'bp-1', userId });

      prisma.budgetPeriod.findFirst.mockResolvedValue(budgetPeriod);
      prisma.category.findFirst.mockResolvedValue(null);

      await expect(
        service.create(userId, {
          name: 'Test',
          amount: 100,
          categoryId: 'cat-1',
          budgetPeriodId: 'bp-1',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      const userId = 'user-1' as UUID;
      const expense = createTestExpense({ id: 'exp-1' });

      prisma.expense.findFirst.mockResolvedValue(expense);

      const result = await service.findOne(userId, 'exp-1' as UUID);
      expect(result).toEqual(expense);
    });

    it('should throw NotFoundException when expense not found', async () => {
      const userId = 'user-1' as UUID;
      prisma.expense.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne(userId, 'exp-1' as UUID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete an expense', async () => {
      const userId = 'user-1' as UUID;
      const expense = createTestExpense({ id: 'exp-1' });

      prisma.expense.findFirst.mockResolvedValue(expense);
      prisma.expense.update.mockResolvedValue({ ...expense, deletedAt: new Date() });

      const result = await service.delete(userId, 'exp-1' as UUID);
      expect(result.deletedAt).toBeDefined();
      expect(prisma.expense.update).toHaveBeenCalledWith({
        where: { id: 'exp-1' },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated expenses', async () => {
      const userId = 'user-1' as UUID;
      const expenses = [
        createTestExpense({ id: 'exp-1' }),
        createTestExpense({ id: 'exp-2' }),
      ];

      prisma.expense.findMany.mockResolvedValue(expenses);
      prisma.expense.count.mockResolvedValue(2);

      const result = await service.findAll(userId, { limit: 20, sortOrder: 'desc' as any });

      expect(result.data).toHaveLength(2);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.hasMore).toBe(false);
    });
  });
});
