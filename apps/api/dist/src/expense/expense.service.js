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
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpenseService = class ExpenseService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, payload) {
        const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
            where: {
                id: payload.budgetPeriodId,
                userId,
                deletedAt: null,
            },
        });
        if (!budgetPeriod) {
            throw new common_1.NotFoundException('Budget period not found');
        }
        const category = await this.prisma.category.findFirst({
            where: {
                id: payload.categoryId,
                userId,
                deletedAt: null,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (payload.expenseGroupId) {
            const expenseGroup = await this.prisma.expenseGroup.findFirst({
                where: {
                    id: payload.expenseGroupId,
                    budgetPeriodId: payload.budgetPeriodId,
                    deletedAt: null,
                },
            });
            if (!expenseGroup) {
                throw new common_1.NotFoundException('Expense group not found');
            }
        }
        return this.prisma.expense.create({
            data: {
                name: payload.name,
                description: payload.description,
                amount: payload.amount,
                categoryId: payload.categoryId,
                budgetPeriodId: payload.budgetPeriodId,
                expenseGroupId: payload.expenseGroupId,
            },
            include: { category: true },
        });
    }
    async findAll(userId, budgetPeriodId) {
        const where = {
            budgetPeriod: {
                userId,
                deletedAt: null,
            },
            deletedAt: null,
        };
        if (budgetPeriodId) {
            where.budgetPeriodId = budgetPeriodId;
        }
        return this.prisma.expense.findMany({
            where,
            include: {
                category: true,
                budgetPeriod: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, expenseId) {
        const expense = await this.prisma.expense.findFirst({
            where: {
                id: expenseId,
                deletedAt: null,
                budgetPeriod: {
                    userId,
                    deletedAt: null,
                },
            },
            include: {
                category: true,
                budgetPeriod: true,
            },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return expense;
    }
    async update(userId, expenseId, payload) {
        const expense = await this.findOne(userId, expenseId);
        if (payload.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: {
                    id: payload.categoryId,
                    userId,
                    deletedAt: null,
                },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
        }
        if (payload.expenseGroupId) {
            const expenseGroup = await this.prisma.expenseGroup.findFirst({
                where: {
                    id: payload.expenseGroupId,
                    budgetPeriodId: expense.budgetPeriodId,
                    deletedAt: null,
                },
            });
            if (!expenseGroup) {
                throw new common_1.NotFoundException('Expense group not found');
            }
        }
        return this.prisma.expense.update({
            where: { id: expenseId },
            data: payload,
            include: { category: true },
        });
    }
    async delete(userId, expenseId) {
        await this.findOne(userId, expenseId);
        return this.prisma.expense.update({
            where: { id: expenseId },
            data: { deletedAt: new Date() },
        });
    }
    async createBulk(userId, payload) {
        const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
            where: {
                id: payload.budgetPeriodId,
                userId,
                deletedAt: null,
            },
        });
        if (!budgetPeriod) {
            throw new common_1.NotFoundException('Budget period not found');
        }
        const categoryIds = [...new Set(payload.expenses.map((e) => e.categoryId))];
        const categories = await this.prisma.category.findMany({
            where: {
                id: { in: categoryIds },
                userId,
                deletedAt: null,
            },
        });
        if (categories.length !== categoryIds.length) {
            throw new common_1.NotFoundException('One or more categories not found');
        }
        const expenseGroupIds = [
            ...new Set(payload.expenses.map((e) => e.expenseGroupId).filter(Boolean)),
        ];
        if (expenseGroupIds.length > 0) {
            const expenseGroups = await this.prisma.expenseGroup.findMany({
                where: {
                    id: { in: expenseGroupIds },
                    budgetPeriodId: payload.budgetPeriodId,
                    deletedAt: null,
                },
            });
            if (expenseGroups.length !== expenseGroupIds.length) {
                throw new common_1.NotFoundException('One or more expense groups not found');
            }
        }
        const expenses = await this.prisma.$transaction(payload.expenses.map((expense) => this.prisma.expense.create({
            data: {
                name: expense.name,
                description: expense.description,
                amount: expense.amount,
                categoryId: expense.categoryId,
                budgetPeriodId: payload.budgetPeriodId,
                expenseGroupId: expense.expenseGroupId,
            },
            include: { category: true },
        })));
        return expenses;
    }
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpenseService);
//# sourceMappingURL=expense.service.js.map