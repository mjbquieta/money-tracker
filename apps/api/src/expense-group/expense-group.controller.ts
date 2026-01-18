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
import { ExpenseGroupService } from './expense-group.service';
import {
  CreateExpenseGroupDto,
  UpdateExpenseGroupDto,
  AddExpensesToGroupDto,
  MoveExpensesToGroupDto,
} from './expense-group.dto';

@Controller('api/v1/expense-groups')
@UseGuards(AuthGuard)
export class ExpenseGroupController {
  constructor(private readonly expenseGroupService: ExpenseGroupService) {}

  @Get()
  findAll(
    @CurrentUser('id') userId: UUID,
    @Query('budgetPeriodId') budgetPeriodId: UUID,
  ) {
    return this.expenseGroupService.findAll(userId, budgetPeriodId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.expenseGroupService.findOne(userId, id);
  }

  @Post()
  create(
    @CurrentUser('id') userId: UUID,
    @Body() payload: CreateExpenseGroupDto,
  ) {
    return this.expenseGroupService.create(userId, payload);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: UpdateExpenseGroupDto,
  ) {
    return this.expenseGroupService.update(userId, id, payload);
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.expenseGroupService.delete(userId, id);
  }

  @Post(':id/expenses')
  addExpenses(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: AddExpensesToGroupDto,
  ) {
    return this.expenseGroupService.addExpenses(userId, id, payload);
  }

  @Post('move-expenses')
  moveExpenses(
    @CurrentUser('id') userId: UUID,
    @Body() payload: MoveExpensesToGroupDto,
  ) {
    return this.expenseGroupService.moveExpenses(userId, payload);
  }

  @Delete('expenses/:expenseId')
  removeExpenseFromGroup(
    @CurrentUser('id') userId: UUID,
    @Param('expenseId') expenseId: UUID,
  ) {
    return this.expenseGroupService.removeExpenseFromGroup(userId, expenseId);
  }
}
