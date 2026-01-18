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
exports.ExpenseGroupService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpenseGroupService = class ExpenseGroupService {
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
        return this.prisma.expenseGroup.create({
            data: {
                name: payload.name,
                description: payload.description,
                budgetPeriodId: payload.budgetPeriodId,
            },
            include: {
                expenses: {
                    where: { deletedAt: null },
                    include: { category: true },
                },
            },
        });
    }
    async findAll(userId, budgetPeriodId) {
        const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
            where: {
                id: budgetPeriodId,
                userId,
                deletedAt: null,
            },
        });
        if (!budgetPeriod) {
            throw new common_1.NotFoundException('Budget period not found');
        }
        return this.prisma.expenseGroup.findMany({
            where: {
                budgetPeriodId,
                deletedAt: null,
            },
            include: {
                expenses: {
                    where: { deletedAt: null },
                    include: { category: true },
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, groupId) {
        const group = await this.prisma.expenseGroup.findFirst({
            where: {
                id: groupId,
                deletedAt: null,
                budgetPeriod: {
                    userId,
                    deletedAt: null,
                },
            },
            include: {
                expenses: {
                    where: { deletedAt: null },
                    include: { category: true },
                    orderBy: { createdAt: 'desc' },
                },
                budgetPeriod: true,
            },
        });
        if (!group) {
            throw new common_1.NotFoundException('Expense group not found');
        }
        return group;
    }
    async update(userId, groupId, payload) {
        await this.findOne(userId, groupId);
        return this.prisma.expenseGroup.update({
            where: { id: groupId },
            data: payload,
            include: {
                expenses: {
                    where: { deletedAt: null },
                    include: { category: true },
                },
            },
        });
    }
    async delete(userId, groupId) {
        await this.findOne(userId, groupId);
        await this.prisma.expense.updateMany({
            where: { expenseGroupId: groupId },
            data: { expenseGroupId: null },
        });
        return this.prisma.expenseGroup.update({
            where: { id: groupId },
            data: { deletedAt: new Date() },
        });
    }
    async addExpenses(userId, groupId, payload) {
        const group = await this.findOne(userId, groupId);
        const expenses = await this.prisma.expense.findMany({
            where: {
                id: { in: payload.expenseIds },
                budgetPeriodId: group.budgetPeriodId,
                deletedAt: null,
                budgetPeriod: {
                    userId,
                    deletedAt: null,
                },
            },
        });
        if (expenses.length !== payload.expenseIds.length) {
            throw new common_1.NotFoundException('One or more expenses not found or do not belong to this budget period');
        }
        await this.prisma.expense.updateMany({
            where: { id: { in: payload.expenseIds } },
            data: { expenseGroupId: groupId },
        });
        return this.findOne(userId, groupId);
    }
    async moveExpenses(userId, payload) {
        if (payload.targetGroupId) {
            await this.findOne(userId, payload.targetGroupId);
        }
        const expenses = await this.prisma.expense.findMany({
            where: {
                id: { in: payload.expenseIds },
                deletedAt: null,
                budgetPeriod: {
                    userId,
                    deletedAt: null,
                },
            },
        });
        if (expenses.length !== payload.expenseIds.length) {
            throw new common_1.NotFoundException('One or more expenses not found');
        }
        if (payload.targetGroupId) {
            const targetGroup = await this.prisma.expenseGroup.findUnique({
                where: { id: payload.targetGroupId },
            });
            const invalidExpenses = expenses.filter((e) => e.budgetPeriodId !== targetGroup?.budgetPeriodId);
            if (invalidExpenses.length > 0) {
                throw new common_1.ForbiddenException('All expenses must belong to the same budget period as the target group');
            }
        }
        await this.prisma.expense.updateMany({
            where: { id: { in: payload.expenseIds } },
            data: { expenseGroupId: payload.targetGroupId || null },
        });
        return { success: true, movedCount: expenses.length };
    }
    async removeExpenseFromGroup(userId, expenseId) {
        const expense = await this.prisma.expense.findFirst({
            where: {
                id: expenseId,
                deletedAt: null,
                budgetPeriod: {
                    userId,
                    deletedAt: null,
                },
            },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Expense not found');
        }
        return this.prisma.expense.update({
            where: { id: expenseId },
            data: { expenseGroupId: null },
            include: { category: true },
        });
    }
};
exports.ExpenseGroupService = ExpenseGroupService;
exports.ExpenseGroupService = ExpenseGroupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpenseGroupService);
//# sourceMappingURL=expense-group.service.js.map