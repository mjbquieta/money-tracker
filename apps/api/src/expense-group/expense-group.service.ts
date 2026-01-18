import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateExpenseGroupDto,
  UpdateExpenseGroupDto,
  AddExpensesToGroupDto,
  MoveExpensesToGroupDto,
} from './expense-group.dto';

@Injectable()
export class ExpenseGroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: UUID, payload: CreateExpenseGroupDto) {
    // Verify the budget period belongs to the user
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

  async findAll(userId: UUID, budgetPeriodId: UUID) {
    // Verify the budget period belongs to the user
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

  async findOne(userId: UUID, groupId: UUID) {
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
      throw new NotFoundException('Expense group not found');
    }

    return group;
  }

  async update(userId: UUID, groupId: UUID, payload: UpdateExpenseGroupDto) {
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

  async delete(userId: UUID, groupId: UUID) {
    await this.findOne(userId, groupId);

    // Remove expenses from the group before deleting
    await this.prisma.expense.updateMany({
      where: { expenseGroupId: groupId },
      data: { expenseGroupId: null },
    });

    return this.prisma.expenseGroup.update({
      where: { id: groupId },
      data: { deletedAt: new Date() },
    });
  }

  async addExpenses(userId: UUID, groupId: UUID, payload: AddExpensesToGroupDto) {
    const group = await this.findOne(userId, groupId);

    // Verify all expenses belong to the same budget period and user
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
      throw new NotFoundException('One or more expenses not found or do not belong to this budget period');
    }

    // Update all expenses to be part of this group
    await this.prisma.expense.updateMany({
      where: { id: { in: payload.expenseIds } },
      data: { expenseGroupId: groupId },
    });

    return this.findOne(userId, groupId);
  }

  async moveExpenses(userId: UUID, payload: MoveExpensesToGroupDto) {
    // If target group is specified, verify it exists and belongs to user
    if (payload.targetGroupId) {
      await this.findOne(userId, payload.targetGroupId as UUID);
    }

    // Get the expenses and verify they belong to the user
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
      throw new NotFoundException('One or more expenses not found');
    }

    // If moving to a group, verify all expenses are from the same budget period as the target group
    if (payload.targetGroupId) {
      const targetGroup = await this.prisma.expenseGroup.findUnique({
        where: { id: payload.targetGroupId },
      });

      const invalidExpenses = expenses.filter(
        (e) => e.budgetPeriodId !== targetGroup?.budgetPeriodId,
      );

      if (invalidExpenses.length > 0) {
        throw new ForbiddenException(
          'All expenses must belong to the same budget period as the target group',
        );
      }
    }

    // Update expenses
    await this.prisma.expense.updateMany({
      where: { id: { in: payload.expenseIds } },
      data: { expenseGroupId: payload.targetGroupId || null },
    });

    return { success: true, movedCount: expenses.length };
  }

  async removeExpenseFromGroup(userId: UUID, expenseId: UUID) {
    // Verify the expense belongs to the user
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
      throw new NotFoundException('Expense not found');
    }

    return this.prisma.expense.update({
      where: { id: expenseId },
      data: { expenseGroupId: null },
      include: { category: true },
    });
  }
}
