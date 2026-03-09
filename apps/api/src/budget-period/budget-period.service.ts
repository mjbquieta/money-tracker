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
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { buildPrismaArgs, buildPaginatedResponse } from '../common/helpers/pagination.helper';

// Helper type for budget period with incomes
type BudgetPeriodWithIncomes = {
  incomes: { amount: number }[];
};

// Helper function to compute total income from incomes array
function computeIncome(budgetPeriod: BudgetPeriodWithIncomes): number {
  return budgetPeriod.incomes.reduce((sum, inc) => sum + inc.amount, 0);
}

@Injectable()
export class BudgetPeriodService {
  constructor(private readonly prisma: PrismaService) {}

  private async shouldIncludeVehicleExpenses(userId: string): Promise<boolean> {
    const settings = await this.prisma.settings.findUnique({
      where: { userId },
      select: { includeVehicleExpenses: true },
    });
    return settings?.includeVehicleExpenses ?? false;
  }

  private async getVehicleExpensesForDateRange(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    return this.prisma.vehicleExpense.findMany({
      where: {
        deletedAt: null,
        date: { gte: startDate, lte: endDate },
        vehicle: {
          userId,
          deletedAt: null,
        },
      },
      include: {
        vehicle: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  private async getAllVehicleExpenses(userId: string) {
    return this.prisma.vehicleExpense.findMany({
      where: {
        deletedAt: null,
        vehicle: {
          userId,
          deletedAt: null,
        },
      },
      include: {
        vehicle: { select: { id: true, name: true } },
      },
    });
  }

  async create(userId: UUID, payload: CreateBudgetPeriodDto) {
    const startDate = new Date(payload.startDate);
    const endDate = new Date(payload.endDate);

    if (startDate >= endDate) {
      throw new BadRequestException('Start date must be before end date');
    }

    return this.prisma.$transaction(async (tx) => {
      const budgetPeriod = await tx.budgetPeriod.create({
        data: {
          userId,
          name: payload.name,
          startDate,
          endDate,
        },
      });

      // Create income records if provided
      if (payload.incomes && payload.incomes.length > 0) {
        await tx.income.createMany({
          data: payload.incomes.map((inc) => ({
            name: inc.name,
            description: inc.description,
            amount: inc.amount,
            budgetPeriodId: budgetPeriod.id,
          })),
        });
      }

      return tx.budgetPeriod.findUnique({
        where: { id: budgetPeriod.id },
        include: {
          expenses: {
            include: { category: true },
          },
          incomes: {
            where: { deletedAt: null },
          },
        },
      });
    });
  }

  async findAll(userId: UUID, pagination: PaginationQueryDto) {
    const where = {
      userId,
      deletedAt: null,
    };

    const prismaArgs = buildPrismaArgs(pagination);

    const [items, totalCount] = await Promise.all([
      this.prisma.budgetPeriod.findMany({
        where,
        include: {
          expenses: {
            where: { deletedAt: null },
            include: { category: true },
          },
          incomes: {
            where: { deletedAt: null },
          },
        },
        ...prismaArgs,
        orderBy: { startDate: prismaArgs.orderBy.createdAt },
      }),
      this.prisma.budgetPeriod.count({ where }),
    ]);

    return buildPaginatedResponse(items, pagination, totalCount);
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
        incomes: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!budgetPeriod) {
      throw new NotFoundException('Budget period not found');
    }

    // Include vehicle expenses if setting is enabled
    const includeVehicle = await this.shouldIncludeVehicleExpenses(userId);
    if (includeVehicle) {
      const vehicleExpenses = await this.getVehicleExpensesForDateRange(
        userId,
        budgetPeriod.startDate,
        budgetPeriod.endDate,
      );
      return {
        ...budgetPeriod,
        vehicleExpenses: vehicleExpenses.map((ve) => ({
          id: ve.id,
          type: ve.type,
          amount: ve.amount,
          description: ve.description,
          date: ve.date,
          vehicleId: ve.vehicle.id,
          vehicleName: ve.vehicle.name,
          isReadOnly: true as const,
        })),
      };
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
        name: payload.name,
        startDate,
        endDate,
      },
      include: {
        expenses: {
          where: { deletedAt: null },
          include: { category: true },
        },
        incomes: {
          where: { deletedAt: null },
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

      // Duplicate incomes
      if (original.incomes && original.incomes.length > 0) {
        await tx.income.createMany({
          data: original.incomes.map((income) => ({
            name: income.name,
            description: income.description,
            amount: income.amount,
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
          incomes: {
            where: { deletedAt: null },
          },
        },
      });
    });
  }

  async getSummary(userId: UUID, budgetPeriodId: UUID) {
    // Use raw query to avoid triggering findOne's vehicle expense logic
    const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
      where: { id: budgetPeriodId, userId, deletedAt: null },
      include: {
        expenses: {
          where: { deletedAt: null },
          include: { category: true },
        },
        incomes: { where: { deletedAt: null } },
      },
    });

    if (!budgetPeriod) {
      throw new NotFoundException('Budget period not found');
    }

    const totalIncome = computeIncome(budgetPeriod);
    let totalExpenses = budgetPeriod.expenses.reduce(
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

    // Include vehicle expenses if setting is enabled
    let vehicleExpensesTotal = 0;
    const includeVehicle = await this.shouldIncludeVehicleExpenses(userId);
    if (includeVehicle) {
      const vehicleExpenses = await this.getVehicleExpensesForDateRange(
        userId,
        budgetPeriod.startDate,
        budgetPeriod.endDate,
      );
      for (const ve of vehicleExpenses) {
        vehicleExpensesTotal += ve.amount;
        const categoryName = `Vehicle - ${ve.type.charAt(0) + ve.type.slice(1).toLowerCase()}`;
        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = { total: 0, count: 0 };
        }
        expensesByCategory[categoryName].total += ve.amount;
        expensesByCategory[categoryName].count += 1;
      }
      totalExpenses += vehicleExpensesTotal;
    }

    return {
      income: totalIncome,
      totalExpenses,
      remaining: totalIncome - totalExpenses,
      expensesByCategory,
      vehicleExpensesTotal,
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
        incomes: {
          where: { deletedAt: null },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    const totalIncome = budgetPeriods.reduce((sum, bp) => sum + computeIncome(bp), 0);
    const allExpenses = budgetPeriods.flatMap((bp) => bp.expenses);
    let totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

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
      const bpIncome = computeIncome(bp);
      const bpMonths: number[] = [];

      for (let m = 0; m < 12; m++) {
        const monthStart = new Date(year, m, 1);
        const monthEnd = new Date(year, m + 1, 0, 23, 59, 59, 999);
        if (bpStart <= monthEnd && bpEnd >= monthStart) {
          bpMonths.push(m);
        }
      }

      if (bpMonths.length > 0) {
        const incomePerMonth = bpIncome / bpMonths.length;
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

    // Include vehicle expenses if setting is enabled
    const includeVehicle = await this.shouldIncludeVehicleExpenses(userId);
    if (includeVehicle) {
      const vehicleExpenses = await this.getVehicleExpensesForDateRange(
        userId,
        startOfYear,
        endOfYear,
      );
      for (const ve of vehicleExpenses) {
        totalExpenses += ve.amount;
        const categoryName = `Vehicle - ${ve.type.charAt(0) + ve.type.slice(1).toLowerCase()}`;
        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = { total: 0, count: 0 };
        }
        expensesByCategory[categoryName].total += ve.amount;
        expensesByCategory[categoryName].count += 1;

        const veDate = new Date(ve.date);
        if (veDate.getFullYear() === year) {
          monthlyBreakdown[veDate.getMonth()].expenses += ve.amount;
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
        incomes: {
          where: { deletedAt: null },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    const totalIncome = budgetPeriods.reduce((sum, bp) => sum + computeIncome(bp), 0);
    const allExpenses = budgetPeriods.flatMap((bp) => bp.expenses);
    let totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

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

    // Include vehicle expenses if setting is enabled
    const includeVehicle = await this.shouldIncludeVehicleExpenses(userId);
    if (includeVehicle) {
      const vehicleExpenses = await this.getAllVehicleExpenses(userId);
      for (const ve of vehicleExpenses) {
        totalExpenses += ve.amount;
        const categoryName = `Vehicle - ${ve.type.charAt(0) + ve.type.slice(1).toLowerCase()}`;
        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = { total: 0, count: 0 };
        }
        expensesByCategory[categoryName].total += ve.amount;
        expensesByCategory[categoryName].count += 1;
      }
    }

    return {
      totalIncome,
      totalExpenses,
      savings: totalIncome - totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
      expensesByCategory,
      budgetPeriodsCount: budgetPeriods.length,
    };
  }

  async getAverageDailySpending(userId: UUID, budgetPeriodId: UUID) {
    const budgetPeriod = await this.findOne(userId, budgetPeriodId);

    const totalExpenses = budgetPeriod.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const startDate = new Date(budgetPeriod.startDate);
    const endDate = new Date(budgetPeriod.endDate);
    const totalDays = Math.max(
      1,
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
    );

    const dailyAverage = totalExpenses / totalDays;

    // Build daily breakdown
    const dailyBreakdown: { date: string; amount: number }[] = [];
    const expensesByDate = new Map<string, number>();

    for (const expense of budgetPeriod.expenses) {
      const dateKey = new Date(expense.createdAt).toISOString().split('T')[0];
      expensesByDate.set(dateKey, (expensesByDate.get(dateKey) || 0) + expense.amount);
    }

    const current = new Date(startDate);
    while (current <= endDate) {
      const dateKey = current.toISOString().split('T')[0];
      dailyBreakdown.push({
        date: dateKey,
        amount: expensesByDate.get(dateKey) || 0,
      });
      current.setDate(current.getDate() + 1);
    }

    return {
      totalExpenses,
      totalDays,
      dailyAverage,
      dailyBreakdown,
    };
  }

  async getTopExpenses(userId: UUID, budgetPeriodId: UUID, limit = 5) {
    await this.findOne(userId, budgetPeriodId);

    const expenses = await this.prisma.expense.findMany({
      where: {
        budgetPeriodId,
        deletedAt: null,
      },
      include: { category: true },
      orderBy: { amount: 'desc' },
      take: limit,
    });

    return expenses.map((expense) => ({
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      categoryName: expense.category.name,
      createdAt: expense.createdAt,
    }));
  }

  async getCategoryComparison(userId: UUID, budgetPeriodIds: string[]) {
    const periods = await this.prisma.budgetPeriod.findMany({
      where: {
        id: { in: budgetPeriodIds },
        userId,
        deletedAt: null,
      },
      include: {
        expenses: {
          where: { deletedAt: null },
          include: { category: true },
        },
        incomes: {
          where: { deletedAt: null },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    return periods.map((period) => {
      const expensesByCategory = period.expenses.reduce(
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
        budgetPeriodId: period.id,
        name: period.name,
        startDate: period.startDate,
        endDate: period.endDate,
        totalExpenses: period.expenses.reduce((sum, e) => sum + e.amount, 0),
        totalIncome: computeIncome(period),
        expensesByCategory,
      };
    });
  }

  async getYearRangeMetrics(userId: UUID, startYear: number, endYear: number) {
    const startOfRange = new Date(startYear, 0, 1);
    const endOfRange = new Date(endYear, 11, 31, 23, 59, 59, 999);

    const budgetPeriods = await this.prisma.budgetPeriod.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          {
            startDate: { gte: startOfRange, lte: endOfRange },
          },
          {
            endDate: { gte: startOfRange, lte: endOfRange },
          },
          {
            AND: [
              { startDate: { lte: startOfRange } },
              { endDate: { gte: endOfRange } },
            ],
          },
        ],
      },
      include: {
        expenses: {
          where: { deletedAt: null },
          include: { category: true },
        },
        incomes: {
          where: { deletedAt: null },
        },
      },
      orderBy: { startDate: 'asc' },
    });

    const totalIncome = budgetPeriods.reduce((sum, bp) => sum + computeIncome(bp), 0);
    const allExpenses = budgetPeriods.flatMap((bp) => bp.expenses);
    let totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

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

    // Include vehicle expenses if setting is enabled
    const includeVehicle = await this.shouldIncludeVehicleExpenses(userId);
    let vehicleExpensesByMonth: Map<string, number> | undefined;

    if (includeVehicle) {
      const vehicleExpenses = await this.getVehicleExpensesForDateRange(
        userId,
        startOfRange,
        endOfRange,
      );
      vehicleExpensesByMonth = new Map();
      for (const ve of vehicleExpenses) {
        totalExpenses += ve.amount;
        const categoryName = `Vehicle - ${ve.type.charAt(0) + ve.type.slice(1).toLowerCase()}`;
        if (!expensesByCategory[categoryName]) {
          expensesByCategory[categoryName] = { total: 0, count: 0 };
        }
        expensesByCategory[categoryName].total += ve.amount;
        expensesByCategory[categoryName].count += 1;

        const veDate = new Date(ve.date);
        const key = `${veDate.getFullYear()}-${veDate.getMonth()}`;
        vehicleExpensesByMonth.set(key, (vehicleExpensesByMonth.get(key) || 0) + ve.amount);
      }
    }

    // Build yearly breakdown with monthly data for each year in range
    const yearlyBreakdown: Array<{
      year: number;
      totalIncome: number;
      totalExpenses: number;
      savings: number;
      monthlyBreakdown: Array<{ month: number; income: number; expenses: number }>;
    }> = [];

    for (let year = startYear; year <= endYear; year++) {
      const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        income: 0,
        expenses: 0,
      }));

      let yearIncome = 0;
      let yearExpenses = 0;

      for (const bp of budgetPeriods) {
        const bpStart = bp.startDate;
        const bpEnd = bp.endDate;
        const bpIncome = computeIncome(bp);
        const bpMonths: number[] = [];

        for (let m = 0; m < 12; m++) {
          const monthStart = new Date(year, m, 1);
          const monthEnd = new Date(year, m + 1, 0, 23, 59, 59, 999);
          if (bpStart <= monthEnd && bpEnd >= monthStart) {
            bpMonths.push(m);
          }
        }

        if (bpMonths.length > 0) {
          const incomePerMonth = bpIncome / bpMonths.length;
          for (const m of bpMonths) {
            monthlyBreakdown[m].income += incomePerMonth;
            yearIncome += incomePerMonth;
          }
        }

        for (const expense of bp.expenses) {
          const expMonth = bp.startDate.getMonth();
          if (bp.startDate.getFullYear() === year) {
            monthlyBreakdown[expMonth].expenses += expense.amount;
            yearExpenses += expense.amount;
          }
        }
      }

      // Add vehicle expenses to monthly breakdown
      if (vehicleExpensesByMonth) {
        for (let m = 0; m < 12; m++) {
          const key = `${year}-${m}`;
          const veAmount = vehicleExpensesByMonth.get(key) || 0;
          if (veAmount > 0) {
            monthlyBreakdown[m].expenses += veAmount;
            yearExpenses += veAmount;
          }
        }
      }

      yearlyBreakdown.push({
        year,
        totalIncome: yearIncome,
        totalExpenses: yearExpenses,
        savings: yearIncome - yearExpenses,
        monthlyBreakdown,
      });
    }

    return {
      startYear,
      endYear,
      totalIncome,
      totalExpenses,
      savings: totalIncome - totalExpenses,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
      expensesByCategory,
      yearlyBreakdown,
      budgetPeriodsCount: budgetPeriods.length,
    };
  }
}
