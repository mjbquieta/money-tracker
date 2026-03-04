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
exports.FinancialGoalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FinancialGoalService = class FinancialGoalService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, payload) {
        return this.prisma.financialGoal.create({
            data: {
                name: payload.name,
                description: payload.description,
                targetAmount: payload.targetAmount,
                targetDate: payload.targetDate ? new Date(payload.targetDate) : undefined,
                userId,
            },
            include: { contributions: { orderBy: { createdAt: 'desc' }, take: 5 } },
        });
    }
    async findAll(userId) {
        return this.prisma.financialGoal.findMany({
            where: { userId, deletedAt: null },
            include: {
                contributions: { orderBy: { createdAt: 'desc' }, take: 5 },
                _count: { select: { contributions: true } },
            },
            orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
        });
    }
    async findOne(userId, goalId) {
        const goal = await this.prisma.financialGoal.findFirst({
            where: { id: goalId, userId, deletedAt: null },
            include: {
                contributions: { orderBy: { createdAt: 'desc' } },
                _count: { select: { contributions: true } },
            },
        });
        if (!goal) {
            throw new common_1.NotFoundException('Financial goal not found');
        }
        return goal;
    }
    async update(userId, goalId, payload) {
        await this.findOne(userId, goalId);
        const data = { ...payload };
        if (payload.targetDate) {
            data.targetDate = new Date(payload.targetDate);
        }
        return this.prisma.financialGoal.update({
            where: { id: goalId },
            data,
            include: { contributions: { orderBy: { createdAt: 'desc' }, take: 5 } },
        });
    }
    async delete(userId, goalId) {
        await this.findOne(userId, goalId);
        return this.prisma.financialGoal.update({
            where: { id: goalId },
            data: { deletedAt: new Date() },
        });
    }
    async addContribution(userId, goalId, payload) {
        const goal = await this.findOne(userId, goalId);
        if (goal.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Can only add contributions to active goals');
        }
        const newCurrentAmount = goal.currentAmount + payload.amount;
        const [contribution] = await this.prisma.$transaction([
            this.prisma.goalContribution.create({
                data: {
                    amount: payload.amount,
                    note: payload.note,
                    goalId,
                },
            }),
            this.prisma.financialGoal.update({
                where: { id: goalId },
                data: {
                    currentAmount: newCurrentAmount,
                    ...(newCurrentAmount >= goal.targetAmount && { status: 'COMPLETED' }),
                },
            }),
        ]);
        return this.findOne(userId, goalId);
    }
    async deleteContribution(userId, goalId, contributionId) {
        const goal = await this.findOne(userId, goalId);
        const contribution = await this.prisma.goalContribution.findFirst({
            where: { id: contributionId, goalId },
        });
        if (!contribution) {
            throw new common_1.NotFoundException('Contribution not found');
        }
        const newCurrentAmount = Math.max(0, goal.currentAmount - contribution.amount);
        await this.prisma.$transaction([
            this.prisma.goalContribution.delete({
                where: { id: contributionId },
            }),
            this.prisma.financialGoal.update({
                where: { id: goalId },
                data: {
                    currentAmount: newCurrentAmount,
                    ...(goal.status === 'COMPLETED' && newCurrentAmount < goal.targetAmount && { status: 'ACTIVE' }),
                },
            }),
        ]);
        return this.findOne(userId, goalId);
    }
    async getSummary(userId) {
        const goals = await this.prisma.financialGoal.findMany({
            where: { userId, deletedAt: null },
        });
        const active = goals.filter((g) => g.status === 'ACTIVE');
        const completed = goals.filter((g) => g.status === 'COMPLETED');
        const totalTarget = active.reduce((sum, g) => sum + g.targetAmount, 0);
        const totalCurrent = active.reduce((sum, g) => sum + g.currentAmount, 0);
        return {
            totalGoals: goals.length,
            activeGoals: active.length,
            completedGoals: completed.length,
            totalTargetAmount: totalTarget,
            totalCurrentAmount: totalCurrent,
            overallProgress: totalTarget > 0 ? (totalCurrent / totalTarget) * 100 : 0,
        };
    }
};
exports.FinancialGoalService = FinancialGoalService;
exports.FinancialGoalService = FinancialGoalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinancialGoalService);
//# sourceMappingURL=financial-goal.service.js.map