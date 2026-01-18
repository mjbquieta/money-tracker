import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { BudgetPeriodService } from './budget-period.service';
import {
  CreateBudgetPeriodDto,
  DuplicateBudgetPeriodDto,
  UpdateBudgetPeriodDto,
} from './budget-period.dto';

@Controller('api/v1/budget-periods')
@UseGuards(AuthGuard)
export class BudgetPeriodController {
  constructor(private readonly budgetPeriodService: BudgetPeriodService) {}

  @Get()
  findAll(@CurrentUser('id') userId: UUID) {
    return this.budgetPeriodService.findAll(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.budgetPeriodService.findOne(userId, id);
  }

  @Get('metrics/yearly')
  getYearlyMetrics(
    @CurrentUser('id') userId: UUID,
    @Query('year') year?: string,
  ) {
    const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.budgetPeriodService.getYearlyMetrics(userId, targetYear);
  }

  @Get('metrics/overall')
  getOverallMetrics(@CurrentUser('id') userId: UUID) {
    return this.budgetPeriodService.getOverallMetrics(userId);
  }

  @Get('metrics/year-range')
  getYearRangeMetrics(
    @CurrentUser('id') userId: UUID,
    @Query('startYear') startYear?: string,
    @Query('endYear') endYear?: string,
  ) {
    const currentYear = new Date().getFullYear();
    const start = startYear ? parseInt(startYear, 10) : currentYear - 1;
    const end = endYear ? parseInt(endYear, 10) : currentYear;
    return this.budgetPeriodService.getYearRangeMetrics(userId, start, end);
  }

  @Get(':id/summary')
  getSummary(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.budgetPeriodService.getSummary(userId, id);
  }

  @Post()
  create(
    @CurrentUser('id') userId: UUID,
    @Body() payload: CreateBudgetPeriodDto,
  ) {
    return this.budgetPeriodService.create(userId, payload);
  }

  @Post(':id/duplicate')
  duplicate(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: DuplicateBudgetPeriodDto,
  ) {
    return this.budgetPeriodService.duplicate(userId, id, payload);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: UpdateBudgetPeriodDto,
  ) {
    return this.budgetPeriodService.update(userId, id, payload);
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.budgetPeriodService.delete(userId, id);
  }
}
