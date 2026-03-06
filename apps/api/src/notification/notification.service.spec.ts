import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  createMockPrismaService,
  MockPrismaService,
} from '../common/testing/prisma-mock.helper';
import { createTestNotification } from '../common/testing/test-factory';
import { NotFoundException } from '@nestjs/common';

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: MockPrismaService;

  const userId = 'user-123';

  beforeEach(async () => {
    prisma = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  describe('findAll', () => {
    it('should return notifications for user', async () => {
      const notifications = [
        createTestNotification({ userId }),
        createTestNotification({ userId }),
      ];
      (prisma.notification.findMany as jest.Mock).mockResolvedValue(notifications);

      const result = await service.findAll(userId);

      expect(result).toEqual(notifications);
      expect(prisma.notification.findMany).toHaveBeenCalledWith({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50,
      });
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count', async () => {
      (prisma.notification.count as jest.Mock).mockResolvedValue(5);

      const result = await service.getUnreadCount(userId);

      expect(result).toEqual({ count: 5 });
      expect(prisma.notification.count).toHaveBeenCalledWith({
        where: { userId, isRead: false },
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark a notification as read', async () => {
      const notification = createTestNotification({ userId });
      (prisma.notification.findFirst as jest.Mock).mockResolvedValue(notification);
      (prisma.notification.update as jest.Mock).mockResolvedValue({
        ...notification,
        isRead: true,
      });

      const result = await service.markAsRead(userId, notification.id);

      expect(result.isRead).toBe(true);
    });

    it('should throw NotFoundException if notification not found', async () => {
      (prisma.notification.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.markAsRead(userId, 'bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      (prisma.notification.updateMany as jest.Mock).mockResolvedValue({ count: 3 });

      const result = await service.markAllAsRead(userId);

      expect(result).toEqual({ success: true });
      expect(prisma.notification.updateMany).toHaveBeenCalledWith({
        where: { userId, isRead: false },
        data: { isRead: true },
      });
    });
  });

  describe('delete', () => {
    it('should delete a notification', async () => {
      const notification = createTestNotification({ userId });
      (prisma.notification.findFirst as jest.Mock).mockResolvedValue(notification);
      (prisma.notification.delete as jest.Mock).mockResolvedValue(notification);

      const result = await service.delete(userId, notification.id);

      expect(result).toEqual(notification);
    });

    it('should throw NotFoundException if notification not found', async () => {
      (prisma.notification.findFirst as jest.Mock).mockResolvedValue(null);

      await expect(service.delete(userId, 'bad-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteAll', () => {
    it('should delete all user notifications', async () => {
      (prisma.notification.deleteMany as jest.Mock).mockResolvedValue({ count: 5 });

      const result = await service.deleteAll(userId);

      expect(result).toEqual({ success: true });
      expect(prisma.notification.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const notification = createTestNotification({
        userId,
        type: 'BUDGET_LIMIT_EXCEEDED',
        title: 'Budget Alert',
        message: 'You exceeded your food budget',
      });
      (prisma.notification.create as jest.Mock).mockResolvedValue(notification);

      const result = await service.create(
        userId,
        'BUDGET_LIMIT_EXCEEDED',
        'Budget Alert',
        'You exceeded your food budget',
        { categoryId: 'cat-1' },
      );

      expect(result).toEqual(notification);
      expect(prisma.notification.create).toHaveBeenCalledWith({
        data: {
          userId,
          type: 'BUDGET_LIMIT_EXCEEDED',
          title: 'Budget Alert',
          message: 'You exceeded your food budget',
          data: { categoryId: 'cat-1' },
        },
      });
    });
  });
});
