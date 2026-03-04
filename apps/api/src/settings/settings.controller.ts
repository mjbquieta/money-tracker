import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { TwoFactorAuthGuard } from '../auth/two-factor-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './settings.dto';

@ApiTags('Settings')
@ApiBearerAuth()
@Controller('api/v1/settings')
@UseGuards(TwoFactorAuthGuard)
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
