import { Injectable, NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePersonalBudgetDto,
  CreatePersonalBudgetItemDto,
  UpdatePersonalBudgetDto,
  UpdatePersonalBudgetItemDto,
} from './personal-budget.dto';

@Injectable()
export class PersonalBudgetService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: UUID, payload: CreatePersonalBudgetDto) {
    return this.prisma.$transaction(async (tx) => {
      const personalBudget = await tx.personalBudget.create({
        data: {
          userId,
          name: payload.name,
          description: payload.description,
        },
      });

      if (payload.items && payload.items.length > 0) {
        await tx.personalBudgetItem.createMany({
          data: payload.items.map((item) => ({
            name: item.name,
            description: item.description,
            amount: item.amount,
            personalBudgetId: personalBudget.id,
          })),
        });
      }

      return tx.personalBudget.findUnique({
        where: { id: personalBudget.id },
        include: {
          items: {
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });
  }

  async findAll(userId: UUID) {
    return this.prisma.personalBudget.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      include: {
        items: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: UUID, personalBudgetId: UUID) {
    const personalBudget = await this.prisma.personalBudget.findFirst({
      where: {
        id: personalBudgetId,
        userId,
        deletedAt: null,
      },
      include: {
        items: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!personalBudget) {
      throw new NotFoundException('Personal budget not found');
    }

    return personalBudget;
  }

  async update(userId: UUID, personalBudgetId: UUID, payload: UpdatePersonalBudgetDto) {
    await this.findOne(userId, personalBudgetId);

    return this.prisma.personalBudget.update({
      where: { id: personalBudgetId },
      data: {
        name: payload.name,
        description: payload.description,
      },
      include: {
        items: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  async delete(userId: UUID, personalBudgetId: UUID) {
    await this.findOne(userId, personalBudgetId);

    return this.prisma.personalBudget.update({
      where: { id: personalBudgetId },
      data: { deletedAt: new Date() },
    });
  }

  async addItem(userId: UUID, personalBudgetId: UUID, payload: CreatePersonalBudgetItemDto) {
    await this.findOne(userId, personalBudgetId);

    const item = await this.prisma.personalBudgetItem.create({
      data: {
        name: payload.name,
        description: payload.description,
        amount: payload.amount,
        personalBudgetId,
      },
    });

    return item;
  }

  async updateItem(
    userId: UUID,
    personalBudgetId: UUID,
    itemId: UUID,
    payload: UpdatePersonalBudgetItemDto,
  ) {
    await this.findOne(userId, personalBudgetId);

    const item = await this.prisma.personalBudgetItem.findFirst({
      where: {
        id: itemId,
        personalBudgetId,
        deletedAt: null,
      },
    });

    if (!item) {
      throw new NotFoundException('Personal budget item not found');
    }

    return this.prisma.personalBudgetItem.update({
      where: { id: itemId },
      data: {
        name: payload.name,
        description: payload.description,
        amount: payload.amount,
      },
    });
  }

  async deleteItem(userId: UUID, personalBudgetId: UUID, itemId: UUID) {
    await this.findOne(userId, personalBudgetId);

    const item = await this.prisma.personalBudgetItem.findFirst({
      where: {
        id: itemId,
        personalBudgetId,
        deletedAt: null,
      },
    });

    if (!item) {
      throw new NotFoundException('Personal budget item not found');
    }

    return this.prisma.personalBudgetItem.update({
      where: { id: itemId },
      data: { deletedAt: new Date() },
    });
  }

  async getSummary(userId: UUID, personalBudgetId: UUID) {
    const personalBudget = await this.findOne(userId, personalBudgetId);

    const total = personalBudget.items.reduce((sum, item) => sum + item.amount, 0);
    const itemCount = personalBudget.items.length;

    return {
      total,
      itemCount,
    };
  }
}
