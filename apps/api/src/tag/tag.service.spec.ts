import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { UUID, randomUUID } from 'crypto';
import { TagService } from './tag.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../common/testing/prisma-mock.helper';
import { createTestTag, createTestExpense } from '../common/testing/test-factory';

describe('TagService', () => {
  let service: TagService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  const userId = randomUUID() as UUID;

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const tag = createTestTag({ userId });
      prisma.tag.findFirst.mockResolvedValue(null);
      prisma.tag.create.mockResolvedValue(tag);

      const result = await service.create(userId, {
        name: 'Groceries',
        color: '#22C55E',
      });

      expect(result).toEqual(tag);
      expect(prisma.tag.create).toHaveBeenCalledWith({
        data: {
          name: 'Groceries',
          color: '#22C55E',
          userId,
        },
      });
    });

    it('should throw ConflictException for duplicate name', async () => {
      prisma.tag.findFirst.mockResolvedValue(createTestTag({ userId }));

      await expect(
        service.create(userId, { name: 'Existing Tag' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all user tags ordered by name', async () => {
      const tags = [
        createTestTag({ userId, name: 'Alpha' }),
        createTestTag({ userId, name: 'Beta' }),
      ];
      prisma.tag.findMany.mockResolvedValue(tags);

      const result = await service.findAll(userId);

      expect(result).toEqual(tags);
      expect(prisma.tag.findMany).toHaveBeenCalledWith({
        where: { userId, deletedAt: null },
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a tag', async () => {
      const tag = createTestTag({ userId });
      prisma.tag.findFirst.mockResolvedValue(tag);

      const result = await service.findOne(userId, tag.id as UUID);
      expect(result).toEqual(tag);
    });

    it('should throw NotFoundException if tag not found', async () => {
      prisma.tag.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne(userId, randomUUID() as UUID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const tag = createTestTag({ userId });
      const updatedTag = { ...tag, name: 'Updated', color: '#EF4444' };

      prisma.tag.findFirst
        .mockResolvedValueOnce(tag) // findOne check
        .mockResolvedValueOnce(null); // duplicate check
      prisma.tag.update.mockResolvedValue(updatedTag);

      const result = await service.update(userId, tag.id as UUID, {
        name: 'Updated',
        color: '#EF4444',
      });

      expect(result).toEqual(updatedTag);
    });

    it('should throw ConflictException if new name conflicts', async () => {
      const tag = createTestTag({ userId, name: 'Original' });
      const existingTag = createTestTag({ userId, name: 'Taken' });

      prisma.tag.findFirst
        .mockResolvedValueOnce(tag) // findOne check
        .mockResolvedValueOnce(existingTag); // duplicate check

      await expect(
        service.update(userId, tag.id as UUID, { name: 'Taken' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('delete', () => {
    it('should soft delete a tag', async () => {
      const tag = createTestTag({ userId });
      prisma.tag.findFirst.mockResolvedValue(tag);
      prisma.tag.update.mockResolvedValue({ ...tag, deletedAt: new Date() });

      await service.delete(userId, tag.id as UUID);

      expect(prisma.tag.update).toHaveBeenCalledWith({
        where: { id: tag.id },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException for non-existent tag', async () => {
      prisma.tag.findFirst.mockResolvedValue(null);

      await expect(
        service.delete(userId, randomUUID() as UUID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('tagExpense', () => {
    it('should set tags on an expense', async () => {
      const expense = createTestExpense({ budgetPeriodId: randomUUID() });
      const tag1 = createTestTag({ userId });
      const tag2 = createTestTag({ userId });
      const tagIds = [tag1.id, tag2.id];

      prisma.expense.findFirst.mockResolvedValue(expense);
      prisma.tag.findMany.mockResolvedValue([tag1, tag2]);
      prisma.expenseTag.deleteMany.mockResolvedValue({});
      prisma.expenseTag.create.mockResolvedValue({});
      prisma.expense.findUnique.mockResolvedValue({
        ...expense,
        expenseTags: [
          { id: '1', tag: tag1 },
          { id: '2', tag: tag2 },
        ],
      });

      const result = await service.tagExpense(
        userId,
        expense.id as UUID,
        tagIds,
      );

      expect(result.expenseTags).toHaveLength(2);
      expect(prisma.expenseTag.deleteMany).toHaveBeenCalledWith({
        where: { expenseId: expense.id },
      });
    });

    it('should throw NotFoundException if expense not found', async () => {
      prisma.expense.findFirst.mockResolvedValue(null);

      await expect(
        service.tagExpense(userId, randomUUID() as UUID, ['tag-1']),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if tags not found', async () => {
      const expense = createTestExpense();
      prisma.expense.findFirst.mockResolvedValue(expense);
      prisma.tag.findMany.mockResolvedValue([]); // none found

      await expect(
        service.tagExpense(userId, expense.id as UUID, ['bad-tag-id']),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getExpenseTags', () => {
    it('should return tags for an expense', async () => {
      const tag1 = createTestTag({ userId, name: 'Food' });
      const tag2 = createTestTag({ userId, name: 'Urgent' });
      const expense = {
        ...createTestExpense(),
        expenseTags: [
          { id: '1', tag: tag1 },
          { id: '2', tag: tag2 },
        ],
      };

      prisma.expense.findFirst.mockResolvedValue(expense);

      const result = await service.getExpenseTags(
        userId,
        expense.id as UUID,
      );

      expect(result).toEqual([tag1, tag2]);
    });

    it('should throw NotFoundException if expense not found', async () => {
      prisma.expense.findFirst.mockResolvedValue(null);

      await expect(
        service.getExpenseTags(userId, randomUUID() as UUID),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
