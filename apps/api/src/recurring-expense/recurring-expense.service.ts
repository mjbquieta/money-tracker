import { Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRecurringExpenseDto, UpdateRecurringExpenseDto, RecurrenceFrequency } from './recurring-expense.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { buildPrismaArgs, buildPaginatedResponse } from '../common/helpers/pagination.helper';

@Injectable()
export class RecurringExpenseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: UUID, payload: CreateRecurringExpenseDto) {
    const category = await this.prisma.category.findFirst({
      where: { id: payload.categoryId, userId, deletedAt: null },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.recurringExpense.create({
      data: {
        name: payload.name,
        description: payload.description,
        amount: payload.amount,
        categoryId: payload.categoryId,
        frequency: payload.frequency,
        startDate: new Date(payload.startDate),
        endDate: payload.endDate ? new Date(payload.endDate) : null,
        userId,
      },
      include: { category: true },
    });
  }

  async findAll(userId: UUID, pagination: PaginationQueryDto) {
    const where = { userId, deletedAt: null };
    const prismaArgs = buildPrismaArgs(pagination);

    const [items, totalCount] = await Promise.all([
      this.prisma.recurringExpense.findMany({
        where,
        include: { category: true },
        ...prismaArgs,
      }),
      this.prisma.recurringExpense.count({ where }),
    ]);

    return buildPaginatedResponse(items, pagination, totalCount);
  }

  async findOne(userId: UUID, id: UUID) {
    const recurringExpense = await this.prisma.recurringExpense.findFirst({
      where: { id, userId, deletedAt: null },
      include: { category: true },
    });

    if (!recurringExpense) {
      throw new NotFoundException('Recurring expense not found');
    }

    return recurringExpense;
  }

  async update(userId: UUID, id: UUID, payload: UpdateRecurringExpenseDto) {
    await this.findOne(userId, id);

    if (payload.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: payload.categoryId, userId, deletedAt: null },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    const data: any = { ...payload };
    if (payload.startDate) data.startDate = new Date(payload.startDate);
    if (payload.endDate) data.endDate = new Date(payload.endDate);
    if (payload.endDate === null) data.endDate = null;

    return this.prisma.recurringExpense.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async delete(userId: UUID, id: UUID) {
    await this.findOne(userId, id);

    return this.prisma.recurringExpense.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async generateForBudgetPeriod(userId: UUID, budgetPeriodId: UUID) {
    const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
      where: { id: budgetPeriodId, userId, deletedAt: null },
    });

    if (!budgetPeriod) {
      throw new NotFoundException('Budget period not found');
    }

    const recurringExpenses = await this.prisma.recurringExpense.findMany({
      where: {
        userId,
        isActive: true,
        deletedAt: null,
        startDate: { lte: budgetPeriod.endDate },
        OR: [
          { endDate: null },
          { endDate: { gte: budgetPeriod.startDate } },
        ],
      },
      include: { category: true },
    });

    const expensesToCreate: {
      name: string;
      description: string | null;
      amount: number;
      categoryId: string;
      budgetPeriodId: string;
    }[] = [];

    for (const recurring of recurringExpenses) {
      const occurrences = this.calculateOccurrences(
        recurring.frequency as RecurrenceFrequency,
        recurring.startDate,
        recurring.endDate,
        budgetPeriod.startDate,
        budgetPeriod.endDate,
      );

      for (const _date of occurrences) {
        expensesToCreate.push({
          name: recurring.name,
          description: recurring.description,
          amount: recurring.amount,
          categoryId: recurring.categoryId,
          budgetPeriodId,
        });
      }
    }

    if (expensesToCreate.length === 0) {
      return { generatedCount: 0, expenses: [] };
    }

    const expenses = await this.prisma.$transaction(
      expensesToCreate.map((data) =>
        this.prisma.expense.create({
          data,
          include: { category: true },
        }),
      ),
    );

    // Update lastProcessedDate for all processed recurring expenses
    await Promise.all(
      recurringExpenses.map((r) =>
        this.prisma.recurringExpense.update({
          where: { id: r.id },
          data: { lastProcessedDate: new Date() },
        }),
      ),
    );

    return { generatedCount: expenses.length, expenses };
  }

  calculateOccurrences(
    frequency: RecurrenceFrequency,
    startDate: Date,
    endDate: Date | null,
    periodStart: Date,
    periodEnd: Date,
  ): Date[] {
    const dates: Date[] = [];
    const effectiveEnd = endDate && endDate < periodEnd ? endDate : periodEnd;
    let current = new Date(startDate);

    while (current <= effectiveEnd) {
      if (current >= periodStart) {
        dates.push(new Date(current));
      }

      switch (frequency) {
        case RecurrenceFrequency.DAILY:
          current.setDate(current.getDate() + 1);
          break;
        case RecurrenceFrequency.WEEKLY:
          current.setDate(current.getDate() + 7);
          break;
        case RecurrenceFrequency.BIWEEKLY:
          current.setDate(current.getDate() + 14);
          break;
        case RecurrenceFrequency.MONTHLY:
          current.setMonth(current.getMonth() + 1);
          break;
        case RecurrenceFrequency.YEARLY:
          current.setFullYear(current.getFullYear() + 1);
          break;
      }
    }

    return dates;
  }
}
