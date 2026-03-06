import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { TwoFactorAuthGuard } from '../auth/two-factor-auth.guard';

@Controller('api/v1/notifications')
@UseGuards(TwoFactorAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAll(@Request() req) {
    return this.notificationService.findAll(req.user.userId);
  }

  @Get('unread-count')
  getUnreadCount(@Request() req) {
    return this.notificationService.getUnreadCount(req.user.userId);
  }

  @Patch(':id/read')
  markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationService.markAsRead(req.user.userId, id);
  }

  @Patch('read-all')
  markAllAsRead(@Request() req) {
    return this.notificationService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  delete(@Request() req, @Param('id') id: string) {
    return this.notificationService.delete(req.user.userId, id);
  }

  @Delete()
  deleteAll(@Request() req) {
    return this.notificationService.deleteAll(req.user.userId);
  }
}
