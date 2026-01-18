import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
