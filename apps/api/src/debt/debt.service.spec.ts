import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UUID, randomUUID } from 'crypto';
import { DebtService } from './debt.service';
import { PrismaService } from '../prisma/prisma.service';
import { createMockPrismaService } from '../common/testing/prisma-mock.helper';
import {
  createTestDebt,
  createTestDebtPayment,
} from '../common/testing/test-factory';

describe('DebtService', () => {
  let service: DebtService;
  let prisma: ReturnType<typeof createMockPrismaService>;

  const userId = randomUUID() as UUID;

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DebtService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<DebtService>(DebtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a debt', async () => {
      const debt = createTestDebt({ userId });
      prisma.debt.create.mockResolvedValue(debt);

      const result = await service.create(userId, {
        type: 'I_OWE' as any,
        counterparty: 'John Doe',
        amount: 100,
        description: 'Borrowed for lunch',
      });

      expect(result).toEqual(debt);
      expect(prisma.debt.create).toHaveBeenCalledWith({
        data: {
          type: 'I_OWE',
          counterparty: 'John Doe',
          description: 'Borrowed for lunch',
          amount: 100,
          dueDate: undefined,
          userId,
        },
        include: { payments: { orderBy: { createdAt: 'desc' }, take: 5 } },
      });
    });

    it('should create a debt with due date', async () => {
      const debt = createTestDebt({ userId });
      prisma.debt.create.mockResolvedValue(debt);

      await service.create(userId, {
        type: 'OWED_TO_ME' as any,
        counterparty: 'Jane',
        amount: 200,
        dueDate: '2026-06-01',
      });

      expect(prisma.debt.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            dueDate: new Date('2026-06-01'),
          }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all user debts', async () => {
      const debts = [
        createTestDebt({ userId, counterparty: 'Alice' }),
        createTestDebt({ userId, counterparty: 'Bob', type: 'OWED_TO_ME' }),
      ];
      prisma.debt.findMany.mockResolvedValue(debts);

      const result = await service.findAll(userId);

      expect(result).toEqual(debts);
      expect(prisma.debt.findMany).toHaveBeenCalledWith({
        where: { userId, deletedAt: null },
        include: {
          payments: { orderBy: { createdAt: 'desc' }, take: 5 },
          _count: { select: { payments: true } },
        },
        orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      });
    });
  });

  describe('findOne', () => {
    it('should return a debt', async () => {
      const debt = createTestDebt({ userId });
      prisma.debt.findFirst.mockResolvedValue(debt);

      const result = await service.findOne(userId, debt.id as UUID);
      expect(result).toEqual(debt);
    });

    it('should throw NotFoundException if debt not found', async () => {
      prisma.debt.findFirst.mockResolvedValue(null);

      await expect(
        service.findOne(userId, randomUUID() as UUID),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a debt', async () => {
      const debt = createTestDebt({ userId });
      const updated = { ...debt, counterparty: 'Updated Person' };

      prisma.debt.findFirst.mockResolvedValue(debt);
      prisma.debt.update.mockResolvedValue(updated);

      const result = await service.update(userId, debt.id as UUID, {
        counterparty: 'Updated Person',
      });

      expect(result).toEqual(updated);
    });
  });

  describe('delete', () => {
    it('should soft delete a debt', async () => {
      const debt = createTestDebt({ userId });
      prisma.debt.findFirst.mockResolvedValue(debt);
      prisma.debt.update.mockResolvedValue({ ...debt, deletedAt: new Date() });

      await service.delete(userId, debt.id as UUID);

      expect(prisma.debt.update).toHaveBeenCalledWith({
        where: { id: debt.id },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });

  describe('addPayment', () => {
    it('should add a payment and update paidAmount', async () => {
      const debt = createTestDebt({
        userId,
        amount: 1000,
        paidAmount: 200,
      });
      const updatedDebt = { ...debt, paidAmount: 500 };

      prisma.debt.findFirst
        .mockResolvedValueOnce(debt)
        .mockResolvedValueOnce(updatedDebt);
      prisma.debtPayment.create.mockResolvedValue({});
      prisma.debt.update.mockResolvedValue(updatedDebt);

      const result = await service.addPayment(userId, debt.id as UUID, {
        amount: 300,
        note: 'Partial payment',
      });

      expect(result.paidAmount).toBe(500);
    });

    it('should auto-settle when fully paid', async () => {
      const debt = createTestDebt({
        userId,
        amount: 1000,
        paidAmount: 800,
      });

      prisma.debt.findFirst
        .mockResolvedValueOnce(debt)
        .mockResolvedValueOnce({ ...debt, paidAmount: 1000, status: 'SETTLED' });
      prisma.debtPayment.create.mockResolvedValue({});
      prisma.debt.update.mockResolvedValue({});

      const result = await service.addPayment(userId, debt.id as UUID, {
        amount: 200,
      });

      expect(result.status).toBe('SETTLED');
    });

    it('should throw if debt is not active', async () => {
      const debt = createTestDebt({
        userId,
        status: 'SETTLED',
      });

      prisma.debt.findFirst.mockResolvedValue(debt);

      await expect(
        service.addPayment(userId, debt.id as UUID, { amount: 100 }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deletePayment', () => {
    it('should delete payment and reduce paidAmount', async () => {
      const debt = createTestDebt({
        userId,
        amount: 1000,
        paidAmount: 500,
      });
      const payment = createTestDebtPayment({
        debtId: debt.id,
        amount: 200,
      });
      const updatedDebt = { ...debt, paidAmount: 300 };

      prisma.debt.findFirst
        .mockResolvedValueOnce(debt)
        .mockResolvedValueOnce(updatedDebt);
      prisma.debtPayment.findFirst.mockResolvedValue(payment);
      prisma.debtPayment.delete.mockResolvedValue({});
      prisma.debt.update.mockResolvedValue(updatedDebt);

      const result = await service.deletePayment(
        userId,
        debt.id as UUID,
        payment.id as UUID,
      );

      expect(result.paidAmount).toBe(300);
    });

    it('should throw if payment not found', async () => {
      const debt = createTestDebt({ userId });
      prisma.debt.findFirst.mockResolvedValue(debt);
      prisma.debtPayment.findFirst.mockResolvedValue(null);

      await expect(
        service.deletePayment(userId, debt.id as UUID, randomUUID() as UUID),
      ).rejects.toThrow(NotFoundException);
    });

    it('should re-activate a settled debt when payment deleted', async () => {
      const debt = createTestDebt({
        userId,
        amount: 1000,
        paidAmount: 1000,
        status: 'SETTLED',
      });
      const payment = createTestDebtPayment({
        debtId: debt.id,
        amount: 300,
      });
      const updatedDebt = { ...debt, paidAmount: 700, status: 'ACTIVE' };

      prisma.debt.findFirst
        .mockResolvedValueOnce(debt)
        .mockResolvedValueOnce(updatedDebt);
      prisma.debtPayment.findFirst.mockResolvedValue(payment);
      prisma.debtPayment.delete.mockResolvedValue({});
      prisma.debt.update.mockResolvedValue(updatedDebt);

      const result = await service.deletePayment(
        userId,
        debt.id as UUID,
        payment.id as UUID,
      );

      expect(result.status).toBe('ACTIVE');
    });
  });

  describe('getSummary', () => {
    it('should return debt summary', async () => {
      const debts = [
        createTestDebt({ userId, type: 'I_OWE', amount: 500, paidAmount: 200, status: 'ACTIVE' }),
        createTestDebt({ userId, type: 'OWED_TO_ME', amount: 300, paidAmount: 100, status: 'ACTIVE' }),
        createTestDebt({ userId, type: 'I_OWE', amount: 200, paidAmount: 200, status: 'SETTLED' }),
      ];
      prisma.debt.findMany.mockResolvedValue(debts);

      const result = await service.getSummary(userId);

      expect(result.totalDebts).toBe(3);
      expect(result.activeDebts).toBe(2);
      expect(result.settledDebts).toBe(1);
      expect(result.totalIOwe).toBe(300); // 500 - 200
      expect(result.totalOwedToMe).toBe(200); // 300 - 100
      expect(result.iOweCount).toBe(1);
      expect(result.owedToMeCount).toBe(1);
    });

    it('should handle no debts', async () => {
      prisma.debt.findMany.mockResolvedValue([]);

      const result = await service.getSummary(userId);

      expect(result.totalDebts).toBe(0);
      expect(result.totalIOwe).toBe(0);
      expect(result.totalOwedToMe).toBe(0);
    });
  });
});
