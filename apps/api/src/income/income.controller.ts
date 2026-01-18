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
import { IncomeService } from './income.service';
import { CreateIncomeDto, UpdateIncomeDto } from './income.dto';

@Controller('api/v1/incomes')
@UseGuards(AuthGuard)
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  create(@CurrentUser('id') userId: UUID, @Body() payload: CreateIncomeDto) {
    return this.incomeService.create(userId, payload);
  }

  @Get('budget-period/:budgetPeriodId')
  findAllByBudgetPeriod(
    @CurrentUser('id') userId: UUID,
    @Param('budgetPeriodId') budgetPeriodId: UUID,
  ) {
    return this.incomeService.findAllByBudgetPeriod(userId, budgetPeriodId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.incomeService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: UpdateIncomeDto,
  ) {
    return this.incomeService.update(userId, id, payload);
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.incomeService.delete(userId, id);
  }
}
