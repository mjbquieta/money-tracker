import { NotificationService } from './notification.service';
export declare class NotificationController {
    private readonly notificationService;
    constructor(notificationService: NotificationService);
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    markAsRead(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    markAllAsRead(req: any): Promise<{
        success: boolean;
    }>;
    delete(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        data: import("@prisma/client/runtime/client").JsonValue | null;
        userId: string;
        type: import("@prisma/client").$Enums.NotificationType;
        title: string;
        isRead: boolean;
    }>;
    deleteAll(req: any): Promise<{
        success: boolean;
    }>;
}
