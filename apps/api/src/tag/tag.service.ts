import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTagDto, UpdateTagDto } from './tag.dto';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: UUID, payload: CreateTagDto) {
    // Check for duplicate name
    const existing = await this.prisma.tag.findFirst({
      where: { userId, name: payload.name, deletedAt: null },
    });

    if (existing) {
      throw new ConflictException('A tag with this name already exists');
    }

    return this.prisma.tag.create({
      data: {
        name: payload.name,
        color: payload.color,
        userId,
      },
    });
  }

  async findAll(userId: UUID) {
    return this.prisma.tag.findMany({
      where: { userId, deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(userId: UUID, tagId: UUID) {
    const tag = await this.prisma.tag.findFirst({
      where: { id: tagId, userId, deletedAt: null },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async update(userId: UUID, tagId: UUID, payload: UpdateTagDto) {
    await this.findOne(userId, tagId);

    // Check for duplicate name if name is being changed
    if (payload.name) {
      const existing = await this.prisma.tag.findFirst({
        where: {
          userId,
          name: payload.name,
          id: { not: tagId },
          deletedAt: null,
        },
      });

      if (existing) {
        throw new ConflictException('A tag with this name already exists');
      }
    }

    return this.prisma.tag.update({
      where: { id: tagId },
      data: payload,
    });
  }

  async delete(userId: UUID, tagId: UUID) {
    await this.findOne(userId, tagId);

    return this.prisma.tag.update({
      where: { id: tagId },
      data: { deletedAt: new Date() },
    });
  }

  async tagExpense(userId: UUID, expenseId: UUID, tagIds: string[]) {
    // Verify the expense belongs to the user
    const expense = await this.prisma.expense.findFirst({
      where: {
        id: expenseId,
        deletedAt: null,
        budgetPeriod: { userId, deletedAt: null },
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Verify all tags belong to the user
    const tags = await this.prisma.tag.findMany({
      where: { id: { in: tagIds }, userId, deletedAt: null },
    });

    if (tags.length !== tagIds.length) {
      throw new NotFoundException('One or more tags not found');
    }

    // Remove existing tags and set new ones in a transaction
    await this.prisma.$transaction([
      this.prisma.expenseTag.deleteMany({
        where: { expenseId },
      }),
      ...tagIds.map((tagId) =>
        this.prisma.expenseTag.create({
          data: { expenseId, tagId },
        }),
      ),
    ]);

    return this.prisma.expense.findUnique({
      where: { id: expenseId },
      include: {
        category: true,
        expenseTags: { include: { tag: true } },
      },
    });
  }

  async getExpenseTags(userId: UUID, expenseId: UUID) {
    const expense = await this.prisma.expense.findFirst({
      where: {
        id: expenseId,
        deletedAt: null,
        budgetPeriod: { userId, deletedAt: null },
      },
      include: {
        expenseTags: { include: { tag: true } },
      },
    });

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense.expenseTags.map((et) => et.tag);
  }
}
