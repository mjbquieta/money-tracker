import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Parser } from 'json2csv';
import { VehicleExpenseType } from '@prisma/client';

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportBudgetPeriodCsv(userId: UUID, budgetPeriodId: UUID): Promise<string> {
    const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
      where: { id: budgetPeriodId, userId, deletedAt: null },
      include: {
        expenses: {
          where: { deletedAt: null },
          include: { category: true },
          orderBy: { createdAt: 'asc' },
        },
        incomes: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!budgetPeriod) {
      throw new NotFoundException('Budget period not found');
    }

    const rows = budgetPeriod.expenses.map((expense) => ({
      Type: 'Expense',
      Name: expense.name,
      Description: expense.description || '',
      Amount: expense.amount,
      Category: expense.category.name,
      Date: new Date(expense.createdAt).toISOString().split('T')[0],
    }));

    // Add incomes at the end
    for (const income of budgetPeriod.incomes) {
      rows.push({
        Type: 'Income',
        Name: income.name,
        Description: income.description || '',
        Amount: income.amount,
        Category: '',
        Date: new Date(income.createdAt).toISOString().split('T')[0],
      });
    }

    if (rows.length === 0) {
      return 'Type,Name,Description,Amount,Category,Date\n';
    }

    const parser = new Parser({
      fields: ['Type', 'Name', 'Description', 'Amount', 'Category', 'Date'],
    });

    return parser.parse(rows);
  }

  async importExpensesCsv(
    userId: UUID,
    budgetPeriodId: UUID,
    records: Array<{ name: string; description?: string; amount: number; categoryName: string }>,
  ) {
    // Verify budget period exists
    const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
      where: { id: budgetPeriodId, userId, deletedAt: null },
    });

    if (!budgetPeriod) {
      throw new NotFoundException('Budget period not found');
    }

    // Get or create categories by name
    const categoryNames = [...new Set(records.map((r) => r.categoryName))];
    const existingCategories = await this.prisma.category.findMany({
      where: { userId, name: { in: categoryNames }, deletedAt: null },
    });

    const categoryMap = new Map(existingCategories.map((c) => [c.name, c.id]));

    // Create missing categories
    for (const name of categoryNames) {
      if (!categoryMap.has(name)) {
        const newCategory = await this.prisma.category.create({
          data: { name, userId },
        });
        categoryMap.set(name, newCategory.id);
      }
    }

    // Create expenses
    const expenses = await this.prisma.expense.createMany({
      data: records.map((r) => ({
        name: r.name,
        description: r.description || null,
        amount: r.amount,
        categoryId: categoryMap.get(r.categoryName)!,
        budgetPeriodId,
      })),
    });

    return {
      importedCount: expenses.count,
      categoriesCreated: categoryNames.length - existingCategories.length,
    };
  }

  async exportVehicleExpensesCsv(userId: UUID, vehicleId: UUID): Promise<string> {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: vehicleId, userId, deletedAt: null },
      include: {
        expenses: {
          where: { deletedAt: null },
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const fields = ['Type', 'Amount', 'Description', 'Date', 'Odometer', 'FuelLiters', 'FuelPricePerLiter', 'IsFullTank', 'Notes'];

    const rows = vehicle.expenses.map((e) => ({
      Type: e.type,
      Amount: e.amount,
      Description: e.description || '',
      Date: new Date(e.date).toISOString().split('T')[0],
      Odometer: e.odometer ?? '',
      FuelLiters: e.fuelLiters ?? '',
      FuelPricePerLiter: e.fuelPricePerLiter ?? '',
      IsFullTank: e.isFullTank != null ? String(e.isFullTank) : '',
      Notes: e.notes || '',
    }));

    if (rows.length === 0) {
      return fields.join(',') + '\n';
    }

    const parser = new Parser({ fields });
    return parser.parse(rows);
  }

  private readonly VALID_VEHICLE_EXPENSE_TYPES = new Set(Object.values(VehicleExpenseType));

  async importVehicleExpensesCsv(
    userId: UUID,
    vehicleId: UUID,
    records: Array<{
      type: string;
      amount: number;
      description?: string;
      date?: string;
      odometer?: number;
      fuelLiters?: number;
      fuelPricePerLiter?: number;
      isFullTank?: boolean;
      notes?: string;
    }>,
  ) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: vehicleId, userId, deletedAt: null },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Validate types
    for (const record of records) {
      if (!this.VALID_VEHICLE_EXPENSE_TYPES.has(record.type as VehicleExpenseType)) {
        throw new BadRequestException(
          `Invalid expense type: "${record.type}". Valid types: ${[...this.VALID_VEHICLE_EXPENSE_TYPES].join(', ')}`,
        );
      }
    }

    const result = await this.prisma.vehicleExpense.createMany({
      data: records.map((r) => ({
        type: r.type as VehicleExpenseType,
        amount: r.amount,
        description: r.description || null,
        date: r.date ? new Date(r.date) : new Date(),
        odometer: r.odometer ?? null,
        fuelLiters: r.fuelLiters ?? null,
        fuelPricePerLiter: r.fuelPricePerLiter ?? null,
        isFullTank: r.isFullTank ?? null,
        notes: r.notes || null,
        vehicleId,
      })),
    });

    return {
      importedCount: result.count,
    };
  }
}
