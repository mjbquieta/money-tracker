import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto, CreateBulkExpenseDto } from './expense.dto';

@Injectable()
export class ExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: UUID, payload: CreateExpenseDto) {
    // Verify the budget period belongs to the user
    const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
      where: {
        id: payload.budgetPeriodId,
        userId,
        deletedAt: null,
      },
    });

    if (!budgetPeriod) {
      throw new NotFoundException('Budget period not found');
    }

    // Verify the category belongs to the user
    const category = await this.prisma.category.findFirst({
      where: {
        id: payload.categoryId,
        userId,
        deletedAt: null,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Verify expense group if provided
    if (payload.expenseGroupId) {
      const expenseGroup = await this.prisma.expenseGroup.findFirst({
        where: {
          id: payload.expenseGroupId,
          budgetPeriodId: payload.budgetPeriodId,
          deletedAt: null,
        },
      });

      if (!expenseGroup) {
        throw new NotFoundException('Expense group not found');
      }
    }

    return this.prisma.expense.create({
      data: {
        name: payload.name,
        description: payload.description,
        amount: payload.amount,
        categoryId: payload.categoryId,
        budgetPeriodId: payload.budgetPeriodId,
        expenseGroupId: payload.expenseGroupId,
      },
      include: { category: true },
    });
  }

  async findAll(userId: UUID, budgetPeriodId?: UUID) {
    const where: any = {
      budgetPeriod: {
        userId,
        deletedAt: null,
      },
      deletedAt: null,
    };

    if (budgetPeriodId) {
      where.budgetPeriodId = budgetPeriodId;
    }

    return this.prisma.expense.findMany({
      where,
      include: {
        category: true,
        budgetPeriod: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: UUID, expenseId: UUID) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id: expenseId,
        deletedAt: null,
        budgetPeriod: {
          userId,
          deletedAt: null,
        },
      },
      include: {
        category: true,
        budgetPeriod: true,
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async update(userId: UUID, expenseId: UUID, payload: UpdateExpenseDto) {
    const expense = await this.findOne(userId, expenseId);

    if (payload.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: {
          id: payload.categoryId,
          userId,
          deletedAt: null,
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    // Verify expense group if provided (and not null - null means remove from group)
    if (payload.expenseGroupId) {
      const expenseGroup = await this.prisma.expenseGroup.findFirst({
        where: {
          id: payload.expenseGroupId,
          budgetPeriodId: expense.budgetPeriodId,
          deletedAt: null,
        },
      });

      if (!expenseGroup) {
        throw new NotFoundException('Expense group not found');
      }
    }

    return this.prisma.expense.update({
      where: { id: expenseId },
      data: payload,
      include: { category: true },
    });
  }

  async delete(userId: UUID, expenseId: UUID) {
    await this.findOne(userId, expenseId);

    return this.prisma.expense.update({
      where: { id: expenseId },
      data: { deletedAt: new Date() },
    });
  }

  async createBulk(userId: UUID, payload: CreateBulkExpenseDto) {
    // Verify the budget period belongs to the user
    const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
      where: {
        id: payload.budgetPeriodId,
        userId,
        deletedAt: null,
      },
    });

    if (!budgetPeriod) {
      throw new NotFoundException('Budget period not found');
    }

    // Get all unique category IDs from the expenses
    const categoryIds = [...new Set(payload.expenses.map((e) => e.categoryId))];

    // Verify all categories belong to the user
    const categories = await this.prisma.category.findMany({
      where: {
        id: { in: categoryIds },
        userId,
        deletedAt: null,
      },
    });

    if (categories.length !== categoryIds.length) {
      throw new NotFoundException('One or more categories not found');
    }

    // Get all unique expense group IDs from the expenses (if any)
    const expenseGroupIds = [
      ...new Set(
        payload.expenses.map((e) => e.expenseGroupId).filter(Boolean),
      ),
    ] as string[];

    // Verify all expense groups belong to this budget period
    if (expenseGroupIds.length > 0) {
      const expenseGroups = await this.prisma.expenseGroup.findMany({
        where: {
          id: { in: expenseGroupIds },
          budgetPeriodId: payload.budgetPeriodId,
          deletedAt: null,
        },
      });

      if (expenseGroups.length !== expenseGroupIds.length) {
        throw new NotFoundException('One or more expense groups not found');
      }
    }

    // Create all expenses in a transaction
    const expenses = await this.prisma.$transaction(
      payload.expenses.map((expense) =>
        this.prisma.expense.create({
          data: {
            name: expense.name,
            description: expense.description,
            amount: expense.amount,
            categoryId: expense.categoryId,
            budgetPeriodId: payload.budgetPeriodId,
            expenseGroupId: expense.expenseGroupId,
          },
          include: { category: true },
        }),
      ),
    );

    return expenses;
  }
}
