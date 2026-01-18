import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto, DefaultCategory, UpdateCategoryDto } from './category.dto';

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
        isDefault: false,
      },
    });
  }

  async findAll(userId: UUID) {
    return this.prisma.category.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
    });
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
}
