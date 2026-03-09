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
const client_1 = require("@prisma/client");
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
    async exportVehicleExpensesCsv(userId, vehicleId) {
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
            throw new common_1.NotFoundException('Vehicle not found');
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
        const parser = new json2csv_1.Parser({ fields });
        return parser.parse(rows);
    }
    VALID_VEHICLE_EXPENSE_TYPES = new Set(Object.values(client_1.VehicleExpenseType));
    async importVehicleExpensesCsv(userId, vehicleId, records) {
        const vehicle = await this.prisma.vehicle.findFirst({
            where: { id: vehicleId, userId, deletedAt: null },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        for (const record of records) {
            if (!this.VALID_VEHICLE_EXPENSE_TYPES.has(record.type)) {
                throw new common_1.BadRequestException(`Invalid expense type: "${record.type}". Valid types: ${[...this.VALID_VEHICLE_EXPENSE_TYPES].join(', ')}`);
            }
        }
        const result = await this.prisma.vehicleExpense.createMany({
            data: records.map((r) => ({
                type: r.type,
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
};
exports.ExportService = ExportService;
exports.ExportService = ExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExportService);
//# sourceMappingURL=export.service.js.map