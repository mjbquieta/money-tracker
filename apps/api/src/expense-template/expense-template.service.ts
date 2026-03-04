import { Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateExpenseTemplateDto, UpdateExpenseTemplateDto, CreateExpenseFromTemplateDto } from './expense-template.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { buildPrismaArgs, buildPaginatedResponse } from '../common/helpers/pagination.helper';

@Injectable()
export class ExpenseTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: UUID, payload: CreateExpenseTemplateDto) {
    const category = await this.prisma.category.findFirst({
      where: { id: payload.categoryId, userId, deletedAt: null },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.expenseTemplate.create({
      data: {
        name: payload.name,
        description: payload.description,
        amount: payload.amount,
        categoryId: payload.categoryId,
        userId,
      },
      include: { category: true },
    });
  }

  async findAll(userId: UUID, pagination: PaginationQueryDto) {
    const where = { userId, deletedAt: null };
    const prismaArgs = buildPrismaArgs(pagination);

    const [items, totalCount] = await Promise.all([
      this.prisma.expenseTemplate.findMany({
        where,
        include: { category: true },
        ...prismaArgs,
      }),
      this.prisma.expenseTemplate.count({ where }),
    ]);

    return buildPaginatedResponse(items, pagination, totalCount);
  }

  async findOne(userId: UUID, templateId: UUID) {
    const template = await this.prisma.expenseTemplate.findFirst({
      where: { id: templateId, userId, deletedAt: null },
      include: { category: true },
    });

    if (!template) {
      throw new NotFoundException('Expense template not found');
    }

    return template;
  }

  async update(userId: UUID, templateId: UUID, payload: UpdateExpenseTemplateDto) {
    await this.findOne(userId, templateId);

    if (payload.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: payload.categoryId, userId, deletedAt: null },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.expenseTemplate.update({
      where: { id: templateId },
      data: payload,
      include: { category: true },
    });
  }

  async delete(userId: UUID, templateId: UUID) {
    await this.findOne(userId, templateId);

    return this.prisma.expenseTemplate.update({
      where: { id: templateId },
      data: { deletedAt: new Date() },
    });
  }

  async createExpenseFromTemplate(userId: UUID, payload: CreateExpenseFromTemplateDto) {
    const template = await this.findOne(userId, payload.templateId as UUID);

    const budgetPeriod = await this.prisma.budgetPeriod.findFirst({
      where: { id: payload.budgetPeriodId, userId, deletedAt: null },
    });

    if (!budgetPeriod) {
      throw new NotFoundException('Budget period not found');
    }

    if (payload.expenseGroupId) {
      const group = await this.prisma.expenseGroup.findFirst({
        where: {
          id: payload.expenseGroupId,
          budgetPeriodId: payload.budgetPeriodId,
          deletedAt: null,
        },
      });

      if (!group) {
        throw new NotFoundException('Expense group not found');
      }
    }

    return this.prisma.expense.create({
      data: {
        name: payload.name || template.name,
        description: template.description,
        amount: payload.amount || template.amount,
        categoryId: template.categoryId,
        budgetPeriodId: payload.budgetPeriodId,
        expenseGroupId: payload.expenseGroupId,
      },
      include: { category: true },
    });
  }
}
