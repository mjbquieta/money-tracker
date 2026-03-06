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
import { TwoFactorAuthGuard } from '../auth/two-factor-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ExpenseTemplateService } from './expense-template.service';
import { CreateExpenseTemplateDto, UpdateExpenseTemplateDto, CreateExpenseFromTemplateDto } from './expense-template.dto';
import { PaginationQueryDto } from '../common/dto/pagination.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Expense Templates')
@ApiBearerAuth()
@Controller('api/v1/expense-templates')
@UseGuards(TwoFactorAuthGuard)
export class ExpenseTemplateController {
  constructor(private readonly expenseTemplateService: ExpenseTemplateService) {}

  @Get()
  findAll(
    @CurrentUser('id') userId: UUID,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.expenseTemplateService.findAll(userId, pagination);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.expenseTemplateService.findOne(userId, id);
  }

  @Post()
  create(
    @CurrentUser('id') userId: UUID,
    @Body() payload: CreateExpenseTemplateDto,
  ) {
    return this.expenseTemplateService.create(userId, payload);
  }

  @Post('create-expense')
  createExpenseFromTemplate(
    @CurrentUser('id') userId: UUID,
    @Body() payload: CreateExpenseFromTemplateDto,
  ) {
    return this.expenseTemplateService.createExpenseFromTemplate(userId, payload);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: UpdateExpenseTemplateDto,
  ) {
    return this.expenseTemplateService.update(userId, id, payload);
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.expenseTemplateService.delete(userId, id);
  }
}
