import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, DefaultCategory, UpdateCategoryDto } from './category.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { buildPrismaArgs, buildPaginatedResponse } from '../common/helpers/pagination.helper';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async createDefaultCategories(
    userId: UUID,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    const defaultCategories = Object.values(DefaultCategory).map((category) => ({
      userId,
      name: category.charAt(0) + category.slice(1).toLowerCase(), // "BILLS" -> "Bills"
      isDefault: true,
      defaultCategory: category,
    }));

    return client.category.createMany({
      data: defaultCategories,
    });
  }

  async create(
    userId: UUID,
    payload: CreateCategoryDto,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;

    const existing = await client.category.findUnique({
      where: {
        userId_name: {
          userId,
          name: payload.name,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    return client.category.create({
      data: {
        userId,
        name: payload.name,
        description: payload.description,
        spendingLimit: payload.spendingLimit,
        isDefault: false,
      },
    });
  }

  async findAll(userId: UUID, pagination: PaginationQueryDto) {
    const where = {
      userId,
      deletedAt: null,
    };

    const prismaArgs = buildPrismaArgs(pagination);

    const [items, totalCount] = await Promise.all([
      this.prisma.category.findMany({
        where,
        ...prismaArgs,
        orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      }),
      this.prisma.category.count({ where }),
    ]);

    return buildPaginatedResponse(items, pagination, totalCount);
  }

  async findOne(userId: UUID, categoryId: UUID) {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
        deletedAt: null,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(userId: UUID, categoryId: UUID, payload: UpdateCategoryDto) {
    const category = await this.findOne(userId, categoryId);

    if (category.isDefault && payload.name) {
      throw new ConflictException('Cannot rename default categories');
    }

    if (payload.name) {
      const existing = await this.prisma.category.findFirst({
        where: {
          userId,
          name: payload.name,
          id: { not: categoryId },
          deletedAt: null,
        },
      });

      if (existing) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    return this.prisma.category.update({
      where: { id: categoryId },
      data: payload,
    });
  }

  async delete(userId: UUID, categoryId: UUID) {
    const category = await this.findOne(userId, categoryId);

    if (category.isDefault) {
      throw new ConflictException('Cannot delete default categories');
    }

    return this.prisma.category.update({
      where: { id: categoryId },
      data: { deletedAt: new Date() },
    });
  }

  async getSpendingStatus(userId: UUID, categoryId: UUID, budgetPeriodId: UUID) {
    const category = await this.findOne(userId, categoryId);

    const result = await this.prisma.expense.aggregate({
      where: {
        categoryId,
        budgetPeriodId,
        deletedAt: null,
        budgetPeriod: { userId, deletedAt: null },
      },
      _sum: { amount: true },
      _count: true,
    });

    const totalSpent = result._sum.amount || 0;
    const limit = category.spendingLimit;

    return {
      categoryId,
      categoryName: category.name,
      spendingLimit: limit,
      totalSpent,
      remaining: limit ? limit - totalSpent : null,
      percentageUsed: limit ? (totalSpent / limit) * 100 : null,
      isOverLimit: limit ? totalSpent > limit : false,
      isApproachingLimit: limit ? totalSpent >= limit * 0.8 && totalSpent <= limit : false,
      expenseCount: result._count,
    };
  }

  async getAllSpendingStatus(userId: UUID, budgetPeriodId: UUID) {
    const categories = await this.prisma.category.findMany({
      where: { userId, deletedAt: null },
    });

    const expenses = await this.prisma.expense.groupBy({
      by: ['categoryId'],
      where: {
        budgetPeriodId,
        deletedAt: null,
        budgetPeriod: { userId, deletedAt: null },
      },
      _sum: { amount: true },
      _count: true,
    });

    const expenseMap = new Map(expenses.map((e) => [e.categoryId, e]));

    return categories.map((cat) => {
      const data = expenseMap.get(cat.id);
      const totalSpent = data?._sum.amount || 0;
      const limit = cat.spendingLimit;
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        spendingLimit: limit,
        totalSpent,
        remaining: limit ? limit - totalSpent : null,
        percentageUsed: limit ? (totalSpent / limit) * 100 : null,
        isOverLimit: limit ? totalSpent > limit : false,
        isApproachingLimit: limit ? totalSpent >= limit * 0.8 && totalSpent <= limit : false,
        expenseCount: data?._count || 0,
      };
    });
  }
}
