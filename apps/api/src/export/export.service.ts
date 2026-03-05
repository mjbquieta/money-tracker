import { Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Parser } from 'json2csv';

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
}
