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
import { RecurringExpenseService } from './recurring-expense.service';
import { CreateRecurringExpenseDto, UpdateRecurringExpenseDto, GenerateRecurringExpensesDto } from './recurring-expense.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Recurring Expenses')
@ApiBearerAuth()
@Controller('api/v1/recurring-expenses')
@UseGuards(AuthGuard)
export class RecurringExpenseController {
  constructor(private readonly recurringExpenseService: RecurringExpenseService) {}

  @Get()
  findAll(
    @CurrentUser('id') userId: UUID,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.recurringExpenseService.findAll(userId, pagination);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.recurringExpenseService.findOne(userId, id);
  }

  @Post()
  create(
    @CurrentUser('id') userId: UUID,
    @Body() payload: CreateRecurringExpenseDto,
  ) {
    return this.recurringExpenseService.create(userId, payload);
  }

  @Post('generate')
  generate(
    @CurrentUser('id') userId: UUID,
    @Body() payload: GenerateRecurringExpensesDto,
  ) {
    return this.recurringExpenseService.generateForBudgetPeriod(userId, payload.budgetPeriodId as UUID);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: UpdateRecurringExpenseDto,
  ) {
    return this.recurringExpenseService.update(userId, id, payload);
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.recurringExpenseService.delete(userId, id);
  }
}
