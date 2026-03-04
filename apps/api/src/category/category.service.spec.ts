import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { CategoryService } from './category.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../common/testing/prisma-mock.helper';
import { createTestCategory } from '../common/testing/test-factory';

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSpendingStatus', () => {
    const userId = 'user-1' as UUID;
    const categoryId = 'cat-1' as UUID;
    const budgetPeriodId = 'bp-1' as UUID;

    it('should return spending status with limit', async () => {
      const category = createTestCategory({ id: categoryId, userId, spendingLimit: 500 });
      prisma.category.findFirst.mockResolvedValue(category);
      prisma.expense.aggregate.mockResolvedValue({
        _sum: { amount: 350 },
        _count: 5,
      });

      const result = await service.getSpendingStatus(userId, categoryId, budgetPeriodId);

      expect(result.totalSpent).toBe(350);
      expect(result.spendingLimit).toBe(500);
      expect(result.remaining).toBe(150);
      expect(result.percentageUsed).toBe(70);
      expect(result.isOverLimit).toBe(false);
      expect(result.isApproachingLimit).toBe(false);
      expect(result.expenseCount).toBe(5);
    });

    it('should detect approaching limit (>= 80%)', async () => {
      const category = createTestCategory({ id: categoryId, userId, spendingLimit: 100 });
      prisma.category.findFirst.mockResolvedValue(category);
      prisma.expense.aggregate.mockResolvedValue({
        _sum: { amount: 85 },
        _count: 3,
      });

      const result = await service.getSpendingStatus(userId, categoryId, budgetPeriodId);

      expect(result.percentageUsed).toBe(85);
      expect(result.isApproachingLimit).toBe(true);
      expect(result.isOverLimit).toBe(false);
    });

    it('should detect over limit', async () => {
      const category = createTestCategory({ id: categoryId, userId, spendingLimit: 200 });
      prisma.category.findFirst.mockResolvedValue(category);
      prisma.expense.aggregate.mockResolvedValue({
        _sum: { amount: 250 },
        _count: 8,
      });

      const result = await service.getSpendingStatus(userId, categoryId, budgetPeriodId);

      expect(result.percentageUsed).toBe(125);
      expect(result.isOverLimit).toBe(true);
      expect(result.isApproachingLimit).toBe(false);
      expect(result.remaining).toBe(-50);
    });

    it('should handle category without spending limit', async () => {
      const category = createTestCategory({ id: categoryId, userId, spendingLimit: null });
      prisma.category.findFirst.mockResolvedValue(category);
      prisma.expense.aggregate.mockResolvedValue({
        _sum: { amount: 100 },
        _count: 2,
      });

      const result = await service.getSpendingStatus(userId, categoryId, budgetPeriodId);

      expect(result.spendingLimit).toBeNull();
      expect(result.remaining).toBeNull();
      expect(result.percentageUsed).toBeNull();
      expect(result.isOverLimit).toBe(false);
      expect(result.isApproachingLimit).toBe(false);
    });

    it('should throw NotFoundException for invalid category', async () => {
      prisma.category.findFirst.mockResolvedValue(null);

      await expect(
        service.getSpendingStatus(userId, categoryId, budgetPeriodId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllSpendingStatus', () => {
    const userId = 'user-1' as UUID;
    const budgetPeriodId = 'bp-1' as UUID;

    it('should return spending status for all categories', async () => {
      const categories = [
        createTestCategory({ id: 'cat-1', userId, name: 'Food', spendingLimit: 500 }),
        createTestCategory({ id: 'cat-2', userId, name: 'Transport', spendingLimit: null }),
      ];

      prisma.category.findMany.mockResolvedValue(categories);
      prisma.expense.groupBy.mockResolvedValue([
        { categoryId: 'cat-1', _sum: { amount: 300 }, _count: 5 },
      ]);

      const result = await service.getAllSpendingStatus(userId, budgetPeriodId);

      expect(result).toHaveLength(2);
      expect(result[0].categoryName).toBe('Food');
      expect(result[0].totalSpent).toBe(300);
      expect(result[0].percentageUsed).toBe(60);
      expect(result[1].categoryName).toBe('Transport');
      expect(result[1].totalSpent).toBe(0);
      expect(result[1].percentageUsed).toBeNull();
    });
  });
});
