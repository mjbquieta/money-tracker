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
import { ExpenseService } from './expense.service';
import { CreateExpenseDto, UpdateExpenseDto, CreateBulkExpenseDto } from './expense.dto';

@Controller('api/v1/expenses')
@UseGuards(AuthGuard)
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Get()
  findAll(
    @CurrentUser('id') userId: UUID,
    @Query('budgetPeriodId') budgetPeriodId?: UUID,
  ) {
    return this.expenseService.findAll(userId, budgetPeriodId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.expenseService.findOne(userId, id);
  }

  @Post()
  create(@CurrentUser('id') userId: UUID, @Body() payload: CreateExpenseDto) {
    return this.expenseService.create(userId, payload);
  }

  @Post('bulk')
  createBulk(@CurrentUser('id') userId: UUID, @Body() payload: CreateBulkExpenseDto) {
    return this.expenseService.createBulk(userId, payload);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: UpdateExpenseDto,
  ) {
    return this.expenseService.update(userId, id, payload);
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.expenseService.delete(userId, id);
  }
}
