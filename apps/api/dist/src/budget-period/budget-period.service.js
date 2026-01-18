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
exports.BudgetPeriodService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BudgetPeriodService = class BudgetPeriodService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, payload) {
        const startDate = new Date(payload.startDate);
        const endDate = new Date(payload.endDate);
        if (startDate >= endDate) {
            throw new common_1.BadRequestException('Start date must be before end date');
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
    async findAll(userId) {
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
    async findOne(userId, budgetPeriodId) {
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
            throw new common_1.NotFoundException('Budget period not found');
        }
        return budgetPeriod;
    }
    async update(userId, budgetPeriodId, payload) {
        await this.findOne(userId, budgetPeriodId);
        const startDate = payload.startDate ? new Date(payload.startDate) : undefined;
        const endDate = payload.endDate ? new Date(payload.endDate) : undefined;
        if (startDate && endDate && startDate >= endDate) {
            throw new common_1.BadRequestException('Start date must be before end date');
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
    async delete(userId, budgetPeriodId) {
        await this.findOne(userId, budgetPeriodId);
        return this.prisma.budgetPeriod.update({
            where: { id: budgetPeriodId },
            data: { deletedAt: new Date() },
        });
    }
    async duplicate(userId, budgetPeriodId, payload) {
        const original = await this.findOne(userId, budgetPeriodId);
        const startDate = new Date(payload.startDate);
        const endDate = new Date(payload.endDate);
        if (startDate >= endDate) {
            throw new common_1.BadRequestException('Start date must be before end date');
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
    async getSummary(userId, budgetPeriodId) {
        const budgetPeriod = await this.findOne(userId, budgetPeriodId);
        const totalExpenses = budgetPeriod.expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const expensesByCategory = budgetPeriod.expenses.reduce((acc, expense) => {
            const categoryName = expense.category.name;
            if (!acc[categoryName]) {
                acc[categoryName] = { total: 0, count: 0 };
            }
            acc[categoryName].total += expense.amount;
            acc[categoryName].count += 1;
            return acc;
        }, {});
        return {
            income: budgetPeriod.income,
            totalExpenses,
            remaining: budgetPeriod.income - totalExpenses,
            expensesByCategory,
        };
    }
};
exports.BudgetPeriodService = BudgetPeriodService;
exports.BudgetPeriodService = BudgetPeriodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BudgetPeriodService);
//# sourceMappingURL=budget-period.service.js.map