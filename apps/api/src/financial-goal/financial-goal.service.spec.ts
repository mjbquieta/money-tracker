import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UUID, randomUUID } from 'crypto';
import { FinancialGoalService } from './financial-goal.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../common/testing/prisma-mock.helper';
import {
  createTestFinancialGoal,
  createTestGoalContribution,
} from '../common/testing/test-factory';

describe('FinancialGoalService', () => {
  let service: FinancialGoalService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  const userId = randomUUID() as UUID;

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancialGoalService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<FinancialGoalService>(FinancialGoalService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a financial goal', async () => {
      const goal = createTestFinancialGoal({ userId });
      prisma.financialGoal.create.mockResolvedValue(goal);

      const result = await service.create(userId, {
        name: 'Emergency Fund',
        targetAmount: 10000,
        description: '6 months of expenses',
      });

      expect(result).toEqual(goal);
      expect(prisma.financialGoal.create).toHaveBeenCalledWith({
        data: {
          name: 'Emergency Fund',
          description: '6 months of expenses',
          targetAmount: 10000,
          targetDate: undefined,
          userId,
        },
        include: { contributions: { orderBy: { createdAt: 'desc' }, take: 5 } },
      });
    });

    it('should create a goal with target date', async () => {
      const goal = createTestFinancialGoal({ userId });
      prisma.financialGoal.create.mockResolvedValue(goal);

      await service.create(userId, {
        name: 'Vacation',
        targetAmount: 5000,
        targetDate: '2026-06-01',
      });

      expect(prisma.financialGoal.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            targetDate: new Date('2026-06-01'),
          }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all user goals', async () => {
      const goals = [
        createTestFinancialGoal({ userId, name: 'Goal A' }),
        createTestFinancialGoal({ userId, name: 'Goal B' }),
      ];
      prisma.financialGoal.findMany.mockResolvedValue(goals);

      const result = await service.findAll(userId);

      expect(result).toEqual(goals);
      expect(prisma.financialGoal.findMany).toHaveBeenCalledWith({
        where: { userId, deletedAt: null },
        include: {
          contributions: { orderBy: { createdAt: 'desc' }, take: 5 },
          _count: { select: { contributions: true } },
        },
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      });
    });
  });

  describe('findOne', () => {
    it('should return a goal', async () => {
      const goal = createTestFinancialGoal({ userId });
      prisma.financialGoal.findFirst.mockResolvedValue(goal);

      const result = await service.findOne(userId, goal.id as UUID);
      expect(result).toEqual(goal);
    });

    it('should throw NotFoundException if goal not found', async () => {
      prisma.financialGoal.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne(userId, randomUUID() as UUID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a goal', async () => {
      const goal = createTestFinancialGoal({ userId });
      const updated = { ...goal, name: 'Updated Goal' };

      prisma.financialGoal.findFirst.mockResolvedValue(goal);
      prisma.financialGoal.update.mockResolvedValue(updated);

      const result = await service.update(userId, goal.id as UUID, {
        name: 'Updated Goal',
      });

      expect(result).toEqual(updated);
    });

    it('should update status to PAUSED', async () => {
      const goal = createTestFinancialGoal({ userId });
      const paused = { ...goal, status: 'PAUSED' };

      prisma.financialGoal.findFirst.mockResolvedValue(goal);
      prisma.financialGoal.update.mockResolvedValue(paused);

      const result = await service.update(userId, goal.id as UUID, {
        status: 'PAUSED' as any,
      });

      expect(result.status).toBe('PAUSED');
    });
  });

  describe('delete', () => {
    it('should soft delete a goal', async () => {
      const goal = createTestFinancialGoal({ userId });
      prisma.financialGoal.findFirst.mockResolvedValue(goal);
      prisma.financialGoal.update.mockResolvedValue({ ...goal, deletedAt: new Date() });

      await service.delete(userId, goal.id as UUID);

      expect(prisma.financialGoal.update).toHaveBeenCalledWith({
        where: { id: goal.id },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });

  describe('addContribution', () => {
    it('should add a contribution and update currentAmount', async () => {
      const goal = createTestFinancialGoal({
        userId,
        currentAmount: 2000,
        targetAmount: 10000,
      });
      const contribution = createTestGoalContribution({
        goalId: goal.id,
        amount: 500,
      });
      const updatedGoal = { ...goal, currentAmount: 2500 };

      prisma.financialGoal.findFirst
        .mockResolvedValueOnce(goal) // findOne in addContribution
        .mockResolvedValueOnce(updatedGoal); // findOne at end
      prisma.goalContribution.create.mockResolvedValue(contribution);
      prisma.financialGoal.update.mockResolvedValue(updatedGoal);

      const result = await service.addContribution(userId, goal.id as UUID, {
        amount: 500,
        note: 'Monthly savings',
      });

      expect(result.currentAmount).toBe(2500);
    });

    it('should auto-complete goal when target reached', async () => {
      const goal = createTestFinancialGoal({
        userId,
        currentAmount: 9500,
        targetAmount: 10000,
      });

      prisma.financialGoal.findFirst
        .mockResolvedValueOnce(goal)
        .mockResolvedValueOnce({ ...goal, currentAmount: 10000, status: 'COMPLETED' });
      prisma.goalContribution.create.mockResolvedValue({});
      prisma.financialGoal.update.mockResolvedValue({});

      const result = await service.addContribution(userId, goal.id as UUID, {
        amount: 500,
      });

      expect(result.status).toBe('COMPLETED');
    });

    it('should throw if goal is not active', async () => {
      const goal = createTestFinancialGoal({
        userId,
        status: 'PAUSED',
      });

      prisma.financialGoal.findFirst.mockResolvedValue(goal);

      await expect(
        service.addContribution(userId, goal.id as UUID, { amount: 100 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteContribution', () => {
    it('should delete contribution and reduce currentAmount', async () => {
      const goal = createTestFinancialGoal({
        userId,
        currentAmount: 2500,
        targetAmount: 10000,
      });
      const contribution = createTestGoalContribution({
        goalId: goal.id,
        amount: 500,
      });
      const updatedGoal = { ...goal, currentAmount: 2000 };

      prisma.financialGoal.findFirst
        .mockResolvedValueOnce(goal)
        .mockResolvedValueOnce(updatedGoal);
      prisma.goalContribution.findFirst.mockResolvedValue(contribution);
      prisma.goalContribution.delete.mockResolvedValue({});
      prisma.financialGoal.update.mockResolvedValue(updatedGoal);

      const result = await service.deleteContribution(
        userId,
        goal.id as UUID,
        contribution.id as UUID,
      );

      expect(result.currentAmount).toBe(2000);
    });

    it('should throw if contribution not found', async () => {
      const goal = createTestFinancialGoal({ userId });
      prisma.financialGoal.findFirst.mockResolvedValue(goal);
      prisma.goalContribution.findFirst.mockResolvedValue(null);

      await expect(
        service.deleteContribution(userId, goal.id as UUID, randomUUID() as UUID),
      ).rejects.toThrow(NotFoundException);
    });

    it('should re-activate a completed goal when contribution deleted', async () => {
      const goal = createTestFinancialGoal({
        userId,
        currentAmount: 10000,
        targetAmount: 10000,
        status: 'COMPLETED',
      });
      const contribution = createTestGoalContribution({
        goalId: goal.id,
        amount: 1000,
      });
      const updatedGoal = { ...goal, currentAmount: 9000, status: 'ACTIVE' };

      prisma.financialGoal.findFirst
        .mockResolvedValueOnce(goal)
        .mockResolvedValueOnce(updatedGoal);
      prisma.goalContribution.findFirst.mockResolvedValue(contribution);
      prisma.goalContribution.delete.mockResolvedValue({});
      prisma.financialGoal.update.mockResolvedValue(updatedGoal);

      const result = await service.deleteContribution(
        userId,
        goal.id as UUID,
        contribution.id as UUID,
      );

      expect(result.status).toBe('ACTIVE');
    });
  });

  describe('getSummary', () => {
    it('should return goals summary', async () => {
      const goals = [
        createTestFinancialGoal({ userId, targetAmount: 10000, currentAmount: 5000, status: 'ACTIVE' }),
        createTestFinancialGoal({ userId, targetAmount: 5000, currentAmount: 5000, status: 'COMPLETED' }),
        createTestFinancialGoal({ userId, targetAmount: 3000, currentAmount: 1000, status: 'ACTIVE' }),
      ];
      prisma.financialGoal.findMany.mockResolvedValue(goals);

      const result = await service.getSummary(userId);

      expect(result.totalGoals).toBe(3);
      expect(result.activeGoals).toBe(2);
      expect(result.completedGoals).toBe(1);
      expect(result.totalTargetAmount).toBe(13000); // 10000 + 3000 (active only)
      expect(result.totalCurrentAmount).toBe(6000); // 5000 + 1000 (active only)
      expect(result.overallProgress).toBeCloseTo(46.15, 1);
    });

    it('should handle no goals', async () => {
      prisma.financialGoal.findMany.mockResolvedValue([]);

      const result = await service.getSummary(userId);

      expect(result.totalGoals).toBe(0);
      expect(result.overallProgress).toBe(0);
    });
  });
});
