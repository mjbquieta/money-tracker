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
exports.RecurringExpenseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const recurring_expense_dto_1 = require("./recurring-expense.dto");
const pagination_helper_1 = require("../common/helpers/pagination.helper");
let RecurringExpenseService = class RecurringExpenseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, payload) {
        const category = await this.prisma.category.findFirst({
            where: { id: payload.categoryId, userId, deletedAt: null },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
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
    async findAll(userId, pagination) {
        const where = { userId, deletedAt: null };
        const prismaArgs = (0, pagination_helper_1.buildPrismaArgs)(pagination);
        const [items, totalCount] = await Promise.all([
            this.prisma.recurringExpense.findMany({
                where,
                include: { category: true },
                ...prismaArgs,
            }),
            this.prisma.recurringExpense.count({ where }),
        ]);
        return (0, pagination_helper_1.buildPaginatedResponse)(items, pagination, totalCount);
    }
    async findOne(userId, id) {
        const recurringExpense = await this.prisma.recurringExpense.findFirst({
            where: { id, userId, deletedAt: null },
            include: { category: true },
        });
        if (!recurringExpense) {
            throw new common_1.NotFoundException('Recurring expense not found');
        }
        return recurringExpense;
    }
    async update(userId, id, payload) {
        await this.findOne(userId, id);
        if (payload.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: { id: payload.categoryId, userId, deletedAt: null },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        const data = { ...payload };
        if (payload.startDate)
            data.startDate = new Date(payload.startDate);
        if (payload.endDate)
            data.endDate = new Date(payload.endDate);
        if (payload.endDate === null)
            data.endDate = null;
        return this.prisma.recurringExpense.update({
            where: { id },
            data,
            include: { category: true },
        });
    }
    async delete(userId, id) {
        await this.findOne(userId, id);
        return this.prisma.recurringExpense.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async generateForBudgetPeriod(userId, budgetPeriodId) {
        const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
            where: { id: budgetPeriodId, userId, deletedAt: null },
        });
        if (!budgetPeriod) {
            throw new common_1.NotFoundException('Budget period not found');
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
        const expensesToCreate = [];
        for (const recurring of recurringExpenses) {
            const occurrences = this.calculateOccurrences(recurring.frequency, recurring.startDate, recurring.endDate, budgetPeriod.startDate, budgetPeriod.endDate);
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
        const expenses = await this.prisma.$transaction(expensesToCreate.map((data) => this.prisma.expense.create({
            data,
            include: { category: true },
        })));
        await Promise.all(recurringExpenses.map((r) => this.prisma.recurringExpense.update({
            where: { id: r.id },
            data: { lastProcessedDate: new Date() },
        })));
        return { generatedCount: expenses.length, expenses };
    }
    calculateOccurrences(frequency, startDate, endDate, periodStart, periodEnd) {
        const dates = [];
        const effectiveEnd = endDate && endDate < periodEnd ? endDate : periodEnd;
        let current = new Date(startDate);
        while (current <= effectiveEnd) {
            if (current >= periodStart) {
                dates.push(new Date(current));
            }
            switch (frequency) {
                case recurring_expense_dto_1.RecurrenceFrequency.DAILY:
                    current.setDate(current.getDate() + 1);
                    break;
                case recurring_expense_dto_1.RecurrenceFrequency.WEEKLY:
                    current.setDate(current.getDate() + 7);
                    break;
                case recurring_expense_dto_1.RecurrenceFrequency.BIWEEKLY:
                    current.setDate(current.getDate() + 14);
                    break;
                case recurring_expense_dto_1.RecurrenceFrequency.MONTHLY:
                    current.setMonth(current.getMonth() + 1);
                    break;
                case recurring_expense_dto_1.RecurrenceFrequency.YEARLY:
                    current.setFullYear(current.getFullYear() + 1);
                    break;
            }
        }
        return dates;
    }
};
exports.RecurringExpenseService = RecurringExpenseService;
exports.RecurringExpenseService = RecurringExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RecurringExpenseService);
//# sourceMappingURL=recurring-expense.service.js.map