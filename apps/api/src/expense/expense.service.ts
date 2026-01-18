import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseDto, UpdateExpenseDto } from './expense.dto';

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

    return this.prisma.expense.create({
      data: {
        name: payload.name,
        description: payload.description,
        amount: payload.amount,
        categoryId: payload.categoryId,
        budgetPeriodId: payload.budgetPeriodId,
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
    await this.findOne(userId, expenseId);

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
}
