import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateFinancialGoalDto,
  UpdateFinancialGoalDto,
  CreateGoalContributionDto,
} from './financial-goal.dto';

@Injectable()
export class FinancialGoalService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: UUID, payload: CreateFinancialGoalDto) {
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

  async findAll(userId: UUID) {
    return this.prisma.financialGoal.findMany({
      where: { userId, deletedAt: null },
      include: {
        contributions: { orderBy: { createdAt: 'desc' }, take: 5 },
        _count: { select: { contributions: true } },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(userId: UUID, goalId: UUID) {
    const goal = await this.prisma.financialGoal.findFirst({
      where: { id: goalId, userId, deletedAt: null },
      include: {
        contributions: { orderBy: { createdAt: 'desc' } },
        _count: { select: { contributions: true } },
      },
    });

    if (!goal) {
      throw new NotFoundException('Financial goal not found');
    }

    return goal;
  }

  async update(userId: UUID, goalId: UUID, payload: UpdateFinancialGoalDto) {
    await this.findOne(userId, goalId);

    const data: any = { ...payload };
    if (payload.targetDate) {
      data.targetDate = new Date(payload.targetDate);
    }

    return this.prisma.financialGoal.update({
      where: { id: goalId },
      data,
      include: { contributions: { orderBy: { createdAt: 'desc' }, take: 5 } },
    });
  }

  async delete(userId: UUID, goalId: UUID) {
    await this.findOne(userId, goalId);

    return this.prisma.financialGoal.update({
      where: { id: goalId },
      data: { deletedAt: new Date() },
    });
  }

  async addContribution(userId: UUID, goalId: UUID, payload: CreateGoalContributionDto) {
    const goal = await this.findOne(userId, goalId);

    if (goal.status !== 'ACTIVE') {
      throw new BadRequestException('Can only add contributions to active goals');
    }

    const newCurrentAmount = goal.currentAmount + payload.amount;

    // Create contribution and update goal in a transaction
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
          // Auto-complete if target reached
          ...(newCurrentAmount >= goal.targetAmount && { status: 'COMPLETED' }),
        },
      }),
    ]);

    // Return the updated goal
    return this.findOne(userId, goalId);
  }

  async deleteContribution(userId: UUID, goalId: UUID, contributionId: UUID) {
    const goal = await this.findOne(userId, goalId);

    const contribution = await this.prisma.goalContribution.findFirst({
      where: { id: contributionId, goalId },
    });

    if (!contribution) {
      throw new NotFoundException('Contribution not found');
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
          // Re-activate if was completed and now below target
          ...(goal.status === 'COMPLETED' && newCurrentAmount < goal.targetAmount && { status: 'ACTIVE' }),
        },
      }),
    ]);

    return this.findOne(userId, goalId);
  }

  async getSummary(userId: UUID) {
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
}
