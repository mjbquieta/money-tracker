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
exports.DebtService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DebtService = class DebtService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, payload) {
        return this.prisma.debt.create({
            data: {
                type: payload.type,
                counterparty: payload.counterparty,
                description: payload.description,
                amount: payload.amount,
                dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
                userId,
            },
            include: { payments: { orderBy: { createdAt: 'desc' }, take: 5 } },
        });
    }
    async findAll(userId) {
        return this.prisma.debt.findMany({
            where: { userId, deletedAt: null },
            include: {
                payments: { orderBy: { createdAt: 'desc' }, take: 5 },
                _count: { select: { payments: true } },
            },
            orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
        });
    }
    async findOne(userId, debtId) {
        const debt = await this.prisma.debt.findFirst({
            where: { id: debtId, userId, deletedAt: null },
            include: {
                payments: { orderBy: { createdAt: 'desc' } },
                _count: { select: { payments: true } },
            },
        });
        if (!debt) {
            throw new common_1.NotFoundException('Debt not found');
        }
        return debt;
    }
    async update(userId, debtId, payload) {
        await this.findOne(userId, debtId);
        const data = { ...payload };
        if (payload.dueDate) {
            data.dueDate = new Date(payload.dueDate);
        }
        return this.prisma.debt.update({
            where: { id: debtId },
            data,
            include: { payments: { orderBy: { createdAt: 'desc' }, take: 5 } },
        });
    }
    async delete(userId, debtId) {
        await this.findOne(userId, debtId);
        return this.prisma.debt.update({
            where: { id: debtId },
            data: { deletedAt: new Date() },
        });
    }
    async addPayment(userId, debtId, payload) {
        const debt = await this.findOne(userId, debtId);
        if (debt.status !== 'ACTIVE') {
            throw new common_1.BadRequestException('Can only add payments to active debts');
        }
        const newPaidAmount = debt.paidAmount + payload.amount;
        await this.prisma.$transaction([
            this.prisma.debtPayment.create({
                data: {
                    amount: payload.amount,
                    note: payload.note,
                    debtId,
                },
            }),
            this.prisma.debt.update({
                where: { id: debtId },
                data: {
                    paidAmount: newPaidAmount,
                    ...(newPaidAmount >= debt.amount && { status: 'SETTLED' }),
                },
            }),
        ]);
        return this.findOne(userId, debtId);
    }
    async deletePayment(userId, debtId, paymentId) {
        const debt = await this.findOne(userId, debtId);
        const payment = await this.prisma.debtPayment.findFirst({
            where: { id: paymentId, debtId },
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const newPaidAmount = Math.max(0, debt.paidAmount - payment.amount);
        await this.prisma.$transaction([
            this.prisma.debtPayment.delete({
                where: { id: paymentId },
            }),
            this.prisma.debt.update({
                where: { id: debtId },
                data: {
                    paidAmount: newPaidAmount,
                    ...(debt.status === 'SETTLED' && newPaidAmount < debt.amount && { status: 'ACTIVE' }),
                },
            }),
        ]);
        return this.findOne(userId, debtId);
    }
    async getSummary(userId) {
        const debts = await this.prisma.debt.findMany({
            where: { userId, deletedAt: null },
        });
        const iOwe = debts.filter((d) => d.type === 'I_OWE');
        const owedToMe = debts.filter((d) => d.type === 'OWED_TO_ME');
        const activeIOwe = iOwe.filter((d) => d.status === 'ACTIVE');
        const activeOwedToMe = owedToMe.filter((d) => d.status === 'ACTIVE');
        return {
            totalDebts: debts.length,
            activeDebts: debts.filter((d) => d.status === 'ACTIVE').length,
            settledDebts: debts.filter((d) => d.status === 'SETTLED').length,
            totalIOwe: activeIOwe.reduce((sum, d) => sum + (d.amount - d.paidAmount), 0),
            totalOwedToMe: activeOwedToMe.reduce((sum, d) => sum + (d.amount - d.paidAmount), 0),
            iOweCount: activeIOwe.length,
            owedToMeCount: activeOwedToMe.length,
        };
    }
};
exports.DebtService = DebtService;
exports.DebtService = DebtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DebtService);
//# sourceMappingURL=debt.service.js.map