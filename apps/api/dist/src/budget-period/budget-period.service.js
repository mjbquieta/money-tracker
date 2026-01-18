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
function computeIncome(budgetPeriod) {
    return budgetPeriod.incomes.reduce((sum, inc) => sum + inc.amount, 0);
}
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
        return this.prisma.$transaction(async (tx) => {
            const budgetPeriod = await tx.budgetPeriod.create({
                data: {
                    userId,
                    name: payload.name,
                    startDate,
                    endDate,
                },
            });
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
                incomes: {
                    where: { deletedAt: null },
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
                incomes: {
                    where: { deletedAt: null },
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
    async delete(userId, budgetPeriodId) {
        await this.findOne(userId, budgetPeriodId);
        return this.prisma.budgetPeriod.update({
            where: { id: budgetPeriodId },
            data: { deletedAt: new Date() },
        });
    }
    async duplicate(userId, budgetPeriodId, payload) {
        const original = await this.findOne(userId, budgetPeriodId);
        const originalGroups = await this.prisma.expenseGroup.findMany({
            where: {
                budgetPeriodId,
                deletedAt: null,
            },
        });
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
                },
            });
            const groupIdMapping = {};
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
    async getSummary(userId, budgetPeriodId) {
        const budgetPeriod = await this.findOne(userId, budgetPeriodId);
        const totalIncome = computeIncome(budgetPeriod);
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
            income: totalIncome,
            totalExpenses,
            remaining: totalIncome - totalExpenses,
            expensesByCategory,
        };
    }
    async getYearlyMetrics(userId, year) {
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
        const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const expensesByCategory = allExpenses.reduce((acc, expense) => {
            const categoryName = expense.category.name;
            if (!acc[categoryName]) {
                acc[categoryName] = { total: 0, count: 0 };
            }
            acc[categoryName].total += expense.amount;
            acc[categoryName].count += 1;
            return acc;
        }, {});
        const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            income: 0,
            expenses: 0,
        }));
        for (const bp of budgetPeriods) {
            const bpStart = bp.startDate;
            const bpEnd = bp.endDate;
            const bpIncome = computeIncome(bp);
            const bpMonths = [];
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
    async getOverallMetrics(userId) {
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
        const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const expensesByCategory = allExpenses.reduce((acc, expense) => {
            const categoryName = expense.category.name;
            if (!acc[categoryName]) {
                acc[categoryName] = { total: 0, count: 0 };
            }
            acc[categoryName].total += expense.amount;
            acc[categoryName].count += 1;
            return acc;
        }, {});
        return {
            totalIncome,
            totalExpenses,
            savings: totalIncome - totalExpenses,
            savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
            expensesByCategory,
            budgetPeriodsCount: budgetPeriods.length,
        };
    }
    async getYearRangeMetrics(userId, startYear, endYear) {
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
        const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const expensesByCategory = allExpenses.reduce((acc, expense) => {
            const categoryName = expense.category.name;
            if (!acc[categoryName]) {
                acc[categoryName] = { total: 0, count: 0 };
            }
            acc[categoryName].total += expense.amount;
            acc[categoryName].count += 1;
            return acc;
        }, {});
        const yearlyBreakdown = [];
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
                const bpMonths = [];
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
};
exports.BudgetPeriodService = BudgetPeriodService;
exports.BudgetPeriodService = BudgetPeriodService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BudgetPeriodService);
//# sourceMappingURL=budget-period.service.js.map