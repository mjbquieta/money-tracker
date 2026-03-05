import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDebtDto, UpdateDebtDto, CreateDebtPaymentDto } from './debt.dto';

@Injectable()
export class DebtService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: UUID, payload: CreateDebtDto) {
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

  async findAll(userId: UUID) {
    return this.prisma.debt.findMany({
      where: { userId, deletedAt: null },
      include: {
        payments: { orderBy: { createdAt: 'desc' }, take: 5 },
        _count: { select: { payments: true } },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(userId: UUID, debtId: UUID) {
    const debt = await this.prisma.debt.findFirst({
      where: { id: debtId, userId, deletedAt: null },
      include: {
        payments: { orderBy: { createdAt: 'desc' } },
        _count: { select: { payments: true } },
      },
    });

    if (!debt) {
      throw new NotFoundException('Debt not found');
    }

    return debt;
  }

  async update(userId: UUID, debtId: UUID, payload: UpdateDebtDto) {
    await this.findOne(userId, debtId);

    const data: any = { ...payload };
    if (payload.dueDate) {
      data.dueDate = new Date(payload.dueDate);
    }

    return this.prisma.debt.update({
      where: { id: debtId },
      data,
      include: { payments: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });
  }

  async delete(userId: UUID, debtId: UUID) {
    await this.findOne(userId, debtId);

    return this.prisma.debt.update({
      where: { id: debtId },
      data: { deletedAt: new Date() },
    });
  }

  async addPayment(userId: UUID, debtId: UUID, payload: CreateDebtPaymentDto) {
    const debt = await this.findOne(userId, debtId);

    if (debt.status !== 'ACTIVE') {
      throw new BadRequestException('Can only add payments to active debts');
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

  async deletePayment(userId: UUID, debtId: UUID, paymentId: UUID) {
    const debt = await this.findOne(userId, debtId);

    const payment = await this.prisma.debtPayment.findFirst({
      where: { id: paymentId, debtId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
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

  async getSummary(userId: UUID) {
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
}
