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
import { PersonalBudgetService } from './personal-budget.service';
import {
  CreatePersonalBudgetDto,
  CreatePersonalBudgetItemDto,
  UpdatePersonalBudgetDto,
  UpdatePersonalBudgetItemDto,
} from './personal-budget.dto';

@Controller('api/v1/personal-budgets')
@UseGuards(AuthGuard)
export class PersonalBudgetController {
  constructor(private readonly personalBudgetService: PersonalBudgetService) {}

  @Get()
  findAll(@CurrentUser('id') userId: UUID) {
    return this.personalBudgetService.findAll(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.personalBudgetService.findOne(userId, id);
  }

  @Get(':id/summary')
  getSummary(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.personalBudgetService.getSummary(userId, id);
  }

  @Post()
  create(
    @CurrentUser('id') userId: UUID,
    @Body() payload: CreatePersonalBudgetDto,
  ) {
    return this.personalBudgetService.create(userId, payload);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: UpdatePersonalBudgetDto,
  ) {
    return this.personalBudgetService.update(userId, id, payload);
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.personalBudgetService.delete(userId, id);
  }

  @Post(':id/items')
  addItem(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: CreatePersonalBudgetItemDto,
  ) {
    return this.personalBudgetService.addItem(userId, id, payload);
  }

  @Patch(':id/items/:itemId')
  updateItem(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Param('itemId') itemId: UUID,
    @Body() payload: UpdatePersonalBudgetItemDto,
  ) {
    return this.personalBudgetService.updateItem(userId, id, itemId, payload);
  }

  @Delete(':id/items/:itemId')
  deleteItem(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Param('itemId') itemId: UUID,
  ) {
    return this.personalBudgetService.deleteItem(userId, id, itemId);
  }
}
