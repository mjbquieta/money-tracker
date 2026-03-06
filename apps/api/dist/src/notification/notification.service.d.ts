import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    markAsRead(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<{
        success: boolean;
    }>;
    delete(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    deleteAll(userId: string): Promise<{
        success: boolean;
    }>;
    create(userId: string, type: string, title: string, message: string, data?: Record<string, unknown>): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
}
