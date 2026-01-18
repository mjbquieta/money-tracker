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

    // Fetch expense groups for the original budget period
    const originalGroups = await this.prisma.expenseGroup.findMany({
      where: {
        budgetPeriodId,
        deletedAt: null,
      },
    });

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

      // Create a mapping from old group IDs to new group IDs
      const groupIdMapping: Record<string, string> = {};

      // Duplicate expense groups
      for (const group of originalGroups) {
        const newGroup = await tx.expenseGroup.create({
          data: {
            name: group.name,
            description: group.description,
            budgetPeriodId: newBudgetPeriod.id,
          },
        });
        groupIdMapping[group.id] = newGroup.id;
      }

      // Duplicate expenses with their group assignments
      if (original.expenses.length > 0) {
        await tx.expense.createMany({
          data: original.expenses.map((expense) => ({
            name: expense.name,
            description: expense.description,
            amount: expense.amount,
            categoryId: expense.categoryId,
            budgetPeriodId: newBudgetPeriod.id,
            expenseGroupId: expense.expenseGroupId
              ? groupIdMapping[expense.expenseGroupId]
              : null,
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

  async getYearlyMetrics(userId: UUID, year: number) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999);

    const budgetPeriods = await this.prisma.budgetPeriod.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          {
            startDate: { gte: startOfYear, lte: endOfYear },
          },
          {
            endDate: { gte: startOfYear, lte: endOfYear },
          },
          {
            AND: [
              { startDate: { lte: startOfYear } },
              { endDate: { gte: endOfYear } },
            ],
          },
        ],
      },
      include: {
        expenses: {
          where: { deletedAt: null },
          include: { category: true },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    const totalIncome = budgetPeriods.reduce((sum, bp) => sum + bp.income, 0);
    const allExpenses = budgetPeriods.flatMap((bp) => bp.expenses);
    const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const expensesByCategory = allExpenses.reduce(
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

    const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      income: 0,
      expenses: 0,
    }));

    for (const bp of budgetPeriods) {
      const bpStart = bp.startDate;
      const bpEnd = bp.endDate;
      const bpMonths: number[] = [];

      for (let m = 0; m < 12; m++) {
        const monthStart = new Date(year, m, 1);
        const monthEnd = new Date(year, m + 1, 0, 23, 59, 59, 999);
        if (bpStart <= monthEnd && bpEnd >= monthStart) {
          bpMonths.push(m);
        }
      }

      if (bpMonths.length > 0) {
        const incomePerMonth = bp.income / bpMonths.length;
        for (const m of bpMonths) {
          monthlyBreakdown[m].income += incomePerMonth;
        }
      }

      for (const expense of bp.expenses) {
        const expMonth = bp.startDate.getMonth();
        if (bp.startDate.getFullYear() === year) {
          monthlyBreakdown[expMonth].expenses += expense.amount;
        }
      }
    }

    return {
      year,
      totalIncome,
      totalExpenses,
      savings: totalIncome - totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
      expensesByCategory,
      monthlyBreakdown,
      budgetPeriodsCount: budgetPeriods.length,
    };
  }

  async getOverallMetrics(userId: UUID) {
    const budgetPeriods = await this.prisma.budgetPeriod.findMany({
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
      orderBy: { startDate: 'asc' },
    });

    const totalIncome = budgetPeriods.reduce((sum, bp) => sum + bp.income, 0);
    const allExpenses = budgetPeriods.flatMap((bp) => bp.expenses);
    const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const expensesByCategory = allExpenses.reduce(
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
      totalIncome,
      totalExpenses,
      savings: totalIncome - totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
      expensesByCategory,
      budgetPeriodsCount: budgetPeriods.length,
    };
  }
}
