import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UUID } from 'crypto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './settings.dto';

@Controller('api/v1/settings')
@UseGuards(AuthGuard)
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  findByUserId(@CurrentUser('id') userId: UUID) {
    return this.settingsService.findByUserId(userId);
  }

  @Patch()
  update(@CurrentUser('id') userId: UUID, @Body() payload: UpdateSettingsDto) {
    return this.settingsService.update(userId, payload);
  }
}
