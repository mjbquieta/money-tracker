import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateBudgetPeriodDto,
  DuplicateBudgetPeriodDto,
  UpdateBudgetPeriodDto,
} from './budget-period.dto';

@Injectable()
export class BudgetPeriodService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: UUID, payload: CreateBudgetPeriodDto) {
    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    return this.prisma.budgetPeriod.create({
      data: {
        userId,
        name: payload.name,
        startDate,
        endDate,
        income: payload.income,
      },
      include: {
        expenses: {
          include: { category: true },
        },
      },
    });
  }

  async findAll(userId: UUID) {
    return this.prisma.budgetPeriod.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        expenses: {
          where: { deletedAt: null },
          include: { category: true },
        },
      },
      orderBy: { startDate: 'desc' },
    });
  }

  async findOne(userId: UUID, budgetPeriodId: UUID) {
    const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
      where: {
        id: budgetPeriodId,
        userId,
        deletedAt: null,
      },
      include: {
        expenses: {
          where: { deletedAt: null },
          include: { category: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!budgetPeriod) {
      throw new NotFoundException('Budget period not found');
    }

    return budgetPeriod;
  }

  async update(userId: UUID, budgetPeriodId: UUID, payload: UpdateBudgetPeriodDto) {
    await this.findOne(userId, budgetPeriodId);

    const startDate = payload.startDate ? new Date(payload.startDate) : undefined;
    const endDate = payload.endDate ? new Date(payload.endDate) : undefined;

    if (startDate && endDate && startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    return this.prisma.budgetPeriod.update({
      where: { id: budgetPeriodId },
      data: {
        ...payload,
        startDate,
        endDate,
      },
      include: {
        expenses: {
          where: { deletedAt: null },
          include: { category: true },
        },
      },
    });
  }

  async delete(userId: UUID, budgetPeriodId: UUID) {
    await this.findOne(userId, budgetPeriodId);

    return this.prisma.budgetPeriod.update({
      where: { id: budgetPeriodId },
      data: { deletedAt: new Date() },
    });
  }

  async duplicate(userId: UUID, budgetPeriodId: UUID, payload: DuplicateBudgetPeriodDto) {
    const original = await this.findOne(userId, budgetPeriodId);

    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    return this.prisma.$transaction(async (tx) => {
      const newBudgetPeriod = await tx.budgetPeriod.create({
        data: {
          userId,
          name: payload.name ?? original.name,
          startDate,
          endDate,
          income: payload.income ?? original.income,
        },
      });

      if (original.expenses.length > 0) {
        await tx.expense.createMany({
          data: original.expenses.map((expense) => ({
            name: expense.name,
            description: expense.description,
            amount: expense.amount,
            categoryId: expense.categoryId,
            budgetPeriodId: newBudgetPeriod.id,
          })),
        });
      }

      return tx.budgetPeriod.findUnique({
        where: { id: newBudgetPeriod.id },
        include: {
          expenses: {
            include: { category: true },
          },
        },
      });
    });
  }

  async getSummary(userId: UUID, budgetPeriodId: UUID) {
    const budgetPeriod = await this.findOne(userId, budgetPeriodId);

    const totalExpenses = budgetPeriod.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const expensesByCategory = budgetPeriod.expenses.reduce(
      (acc, expense) => {
        const categoryName = expense.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = { total: 0, count: 0 };
        }
        acc[categoryName].total += expense.amount;
        acc[categoryName].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    );

    return {
      income: budgetPeriod.income,
      totalExpenses,
      remaining: budgetPeriod.income - totalExpenses,
      expensesByCategory,
    };
  }
}
