import { Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateIncomeDto, UpdateIncomeDto } from './income.dto';

@Injectable()
export class IncomeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: UUID, payload: CreateIncomeDto) {
    // Verify budget period belongs to user
    const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
      where: {
        id: payload.budgetPeriodId,
        userId,
        deletedAt: null,
      },
    });

    if (!budgetPeriod) {
      throw new NotFoundException('Budget period not found');
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

  async findAllByBudgetPeriod(userId: UUID, budgetPeriodId: UUID) {
    // Verify budget period belongs to user
    const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
      where: {
        id: budgetPeriodId,
        userId,
        deletedAt: null,
      },
    });

    if (!budgetPeriod) {
      throw new NotFoundException('Budget period not found');
    }

    return this.prisma.income.findMany({
      where: {
        budgetPeriodId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: UUID, incomeId: UUID) {
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
      throw new NotFoundException('Income not found');
    }

    return income;
  }

  async update(userId: UUID, incomeId: UUID, payload: UpdateIncomeDto) {
    await this.findOne(userId, incomeId);

    return this.prisma.income.update({
      where: { id: incomeId },
      data: payload,
    });
  }

  async delete(userId: UUID, incomeId: UUID) {
    await this.findOne(userId, incomeId);

    await this.prisma.income.update({
      where: { id: incomeId },
      data: { deletedAt: new Date() },
    });

    return { success: true };
  }
}
