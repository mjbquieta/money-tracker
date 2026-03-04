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

    it('should filter by budgetPeriodId', async () => {
      const userId = 'user-1' as UUID;
      prisma.expense.findMany.mockResolvedValue([]);
      prisma.expense.count.mockResolvedValue(0);

      await service.findAll(userId, { budgetPeriodId: 'bp-1', limit: 20, sortOrder: 'desc' as any });

      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ budgetPeriodId: 'bp-1' }),
        }),
      );
    });

    it('should filter by categoryId', async () => {
      const userId = 'user-1' as UUID;
      prisma.expense.findMany.mockResolvedValue([]);
      prisma.expense.count.mockResolvedValue(0);

      await service.findAll(userId, { categoryId: 'cat-1', limit: 20, sortOrder: 'desc' as any });

      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoryId: 'cat-1' }),
        }),
      );
    });

    it('should filter by search term (name contains)', async () => {
      const userId = 'user-1' as UUID;
      prisma.expense.findMany.mockResolvedValue([]);
      prisma.expense.count.mockResolvedValue(0);

      await service.findAll(userId, { search: 'grocery', limit: 20, sortOrder: 'desc' as any });

      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            name: { contains: 'grocery', mode: 'insensitive' },
          }),
        }),
      );
    });

    it('should filter by date range', async () => {
      const userId = 'user-1' as UUID;
      prisma.expense.findMany.mockResolvedValue([]);
      prisma.expense.count.mockResolvedValue(0);

      await service.findAll(userId, {
        dateFrom: '2026-01-01',
        dateTo: '2026-01-31',
        limit: 20,
        sortOrder: 'desc' as any,
      });

      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            createdAt: {
              gte: new Date('2026-01-01'),
              lte: new Date('2026-01-31'),
            },
          }),
        }),
      );
    });

    it('should filter by amount range', async () => {
      const userId = 'user-1' as UUID;
      prisma.expense.findMany.mockResolvedValue([]);
      prisma.expense.count.mockResolvedValue(0);

      await service.findAll(userId, { amountMin: 10, amountMax: 100, limit: 20, sortOrder: 'desc' as any });

      expect(prisma.expense.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            amount: { gte: 10, lte: 100 },
          }),
        }),
      );
    });

    it('should apply multiple filters together', async () => {
      const userId = 'user-1' as UUID;
      prisma.expense.findMany.mockResolvedValue([]);
      prisma.expense.count.mockResolvedValue(0);

      await service.findAll(userId, {
        search: 'food',
        categoryId: 'cat-1',
        amountMin: 5,
        limit: 20,
        sortOrder: 'desc' as any,
      });

      const calledWith = prisma.expense.findMany.mock.calls[0][0];
      expect(calledWith.where.name).toEqual({ contains: 'food', mode: 'insensitive' });
      expect(calledWith.where.categoryId).toBe('cat-1');
      expect(calledWith.where.amount).toEqual({ gte: 5 });
    });
  });
});
