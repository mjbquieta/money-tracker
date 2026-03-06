"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const json2csv_1 = require("json2csv");
let ExportService = class ExportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async exportBudgetPeriodCsv(userId, budgetPeriodId) {
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
            throw new common_1.NotFoundException('Budget period not found');
        }
        const rows = budgetPeriod.expenses.map((expense) => ({
            Type: 'Expense',
            Name: expense.name,
            Description: expense.description || '',
            Amount: expense.amount,
            Category: expense.category.name,
            Date: new Date(expense.createdAt).toISOString().split('T')[0],
        }));
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
        const parser = new json2csv_1.Parser({
            fields: ['Type', 'Name', 'Description', 'Amount', 'Category', 'Date'],
        });
        return parser.parse(rows);
    }
    async importExpensesCsv(userId, budgetPeriodId, records) {
        const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
            where: { id: budgetPeriodId, userId, deletedAt: null },
        });
        if (!budgetPeriod) {
            throw new common_1.NotFoundException('Budget period not found');
        }
        const categoryNames = [...new Set(records.map((r) => r.categoryName))];
        const existingCategories = await this.prisma.category.findMany({
            where: { userId, name: { in: categoryNames }, deletedAt: null },
        });
        const categoryMap = new Map(existingCategories.map((c) => [c.name, c.id]));
        for (const name of categoryNames) {
            if (!categoryMap.has(name)) {
                const newCategory = await this.prisma.category.create({
                    data: { name, userId },
                });
                categoryMap.set(name, newCategory.id);
            }
        }
        const expenses = await this.prisma.expense.createMany({
            data: records.map((r) => ({
                name: r.name,
                description: r.description || null,
                amount: r.amount,
                categoryId: categoryMap.get(r.categoryName),
                budgetPeriodId,
            })),
        });
        return {
            importedCount: expenses.count,
            categoriesCreated: categoryNames.length - existingCategories.length,
        };
    }
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportService);
//# sourceMappingURL=export.service.js.map