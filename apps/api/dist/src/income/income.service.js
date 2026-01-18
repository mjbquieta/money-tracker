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
exports.IncomeService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let IncomeService = class IncomeService {
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
        return this.prisma.income.create({
            data: {
                name: payload.name,
                description: payload.description,
                amount: payload.amount,
                budgetPeriodId: payload.budgetPeriodId,
            },
        });
    }
    async findAllByBudgetPeriod(userId, budgetPeriodId) {
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
        return this.prisma.income.findMany({
            where: {
                budgetPeriodId,
                deletedAt: null,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(userId, incomeId) {
        const income = await this.prisma.income.findFirst({
            where: {
                id: incomeId,
                deletedAt: null,
                budgetPeriod: {
                    userId,
                    deletedAt: null,
                },
            },
            include: {
                budgetPeriod: true,
            },
        });
        if (!income) {
            throw new common_1.NotFoundException('Income not found');
        }
        return income;
    }
    async update(userId, incomeId, payload) {
        await this.findOne(userId, incomeId);
        return this.prisma.income.update({
            where: { id: incomeId },
            data: payload,
        });
    }
    async delete(userId, incomeId) {
        await this.findOne(userId, incomeId);
        await this.prisma.income.update({
            where: { id: incomeId },
            data: { deletedAt: new Date() },
        });
        return { success: true };
    }
};
exports.IncomeService = IncomeService;
exports.IncomeService = IncomeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], IncomeService);
//# sourceMappingURL=income.service.js.map