import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { ExpenseTemplateService } from './expense-template.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../common/testing/prisma-mock.helper';
import { createTestExpenseTemplate, createTestCategory, createTestBudgetPeriod, createTestExpense } from '../common/testing/test-factory';

describe('ExpenseTemplateService', () => {
  let service: ExpenseTemplateService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpenseTemplateService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ExpenseTemplateService>(ExpenseTemplateService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a template successfully', async () => {
      const userId = 'user-1' as UUID;
      const category = createTestCategory({ id: 'cat-1', userId });
      const template = createTestExpenseTemplate({ categoryId: 'cat-1', userId });

      prisma.category.findFirst.mockResolvedValue(category);
      prisma.expenseTemplate.create.mockResolvedValue({ ...template, category });

      const result = await service.create(userId, {
        name: 'Monthly Rent',
        amount: 1500,
        categoryId: 'cat-1',
      });

      expect(result).toBeDefined();
      expect(prisma.expenseTemplate.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when category not found', async () => {
      const userId = 'user-1' as UUID;
      prisma.category.findFirst.mockResolvedValue(null);

      await expect(
        service.create(userId, { name: 'Test', amount: 100, categoryId: 'cat-1' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return paginated templates', async () => {
      const userId = 'user-1' as UUID;
      const templates = [
        createTestExpenseTemplate({ id: 'tpl-1', userId }),
        createTestExpenseTemplate({ id: 'tpl-2', userId }),
      ];

      prisma.expenseTemplate.findMany.mockResolvedValue(templates);
      prisma.expenseTemplate.count.mockResolvedValue(2);

      const result = await service.findAll(userId, { limit: 20, sortOrder: 'desc' as any });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.hasMore).toBe(false);
    });
  });

  describe('findOne', () => {
    it('should return a template', async () => {
      const userId = 'user-1' as UUID;
      const template = createTestExpenseTemplate({ id: 'tpl-1', userId });

      prisma.expenseTemplate.findFirst.mockResolvedValue(template);

      const result = await service.findOne(userId, 'tpl-1' as UUID);
      expect(result).toEqual(template);
    });

    it('should throw NotFoundException when template not found', async () => {
      const userId = 'user-1' as UUID;
      prisma.expenseTemplate.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne(userId, 'tpl-1' as UUID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should soft delete a template', async () => {
      const userId = 'user-1' as UUID;
      const template = createTestExpenseTemplate({ id: 'tpl-1', userId });

      prisma.expenseTemplate.findFirst.mockResolvedValue(template);
      prisma.expenseTemplate.update.mockResolvedValue({ ...template, deletedAt: new Date() });

      const result = await service.delete(userId, 'tpl-1' as UUID);
      expect(result.deletedAt).toBeDefined();
    });
  });

  describe('createExpenseFromTemplate', () => {
    it('should create expense from template data', async () => {
      const userId = 'user-1' as UUID;
      const template = createTestExpenseTemplate({ id: 'tpl-1', userId, categoryId: 'cat-1' });
      const budgetPeriod = createTestBudgetPeriod({ id: 'bp-1', userId });
      const expense = createTestExpense({ name: template.name, amount: template.amount });

      prisma.expenseTemplate.findFirst.mockResolvedValue(template);
      prisma.budgetPeriod.findFirst.mockResolvedValue(budgetPeriod);
      prisma.expense.create.mockResolvedValue(expense);

      const result = await service.createExpenseFromTemplate(userId, {
        templateId: 'tpl-1',
        budgetPeriodId: 'bp-1',
      });

      expect(result).toBeDefined();
      expect(prisma.expense.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: template.name,
            amount: template.amount,
            categoryId: 'cat-1',
            budgetPeriodId: 'bp-1',
          }),
        }),
      );
    });

    it('should use override values when provided', async () => {
      const userId = 'user-1' as UUID;
      const template = createTestExpenseTemplate({ id: 'tpl-1', userId, categoryId: 'cat-1' });
      const budgetPeriod = createTestBudgetPeriod({ id: 'bp-1', userId });
      const expense = createTestExpense({ name: 'Custom Name', amount: 999 });

      prisma.expenseTemplate.findFirst.mockResolvedValue(template);
      prisma.budgetPeriod.findFirst.mockResolvedValue(budgetPeriod);
      prisma.expense.create.mockResolvedValue(expense);

      await service.createExpenseFromTemplate(userId, {
        templateId: 'tpl-1',
        budgetPeriodId: 'bp-1',
        name: 'Custom Name',
        amount: 999,
      });

      expect(prisma.expense.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Custom Name',
            amount: 999,
          }),
        }),
      );
    });

    it('should throw NotFoundException when budget period not found', async () => {
      const userId = 'user-1' as UUID;
      const template = createTestExpenseTemplate({ id: 'tpl-1', userId });

      prisma.expenseTemplate.findFirst.mockResolvedValue(template);
      prisma.budgetPeriod.findFirst.mockResolvedValue(null);

      await expect(
        service.createExpenseFromTemplate(userId, {
          templateId: 'tpl-1',
          budgetPeriodId: 'bp-1',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
