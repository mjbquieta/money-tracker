import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { TwoFactorAuthGuard } from '../auth/two-factor-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { TagService } from './tag.service';
import { CreateTagDto, UpdateTagDto, TagExpenseDto } from './tag.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Tags')
@ApiBearerAuth()
@Controller('api/v1/tags')
@UseGuards(TwoFactorAuthGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll(@CurrentUser('id') userId: UUID) {
    return this.tagService.findAll(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.tagService.findOne(userId, id);
  }

  @Post()
  create(@CurrentUser('id') userId: UUID, @Body() payload: CreateTagDto) {
    return this.tagService.create(userId, payload);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: UpdateTagDto,
  ) {
    return this.tagService.update(userId, id, payload);
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.tagService.delete(userId, id);
  }

  @Put('expenses/:expenseId')
  tagExpense(
    @CurrentUser('id') userId: UUID,
    @Param('expenseId') expenseId: UUID,
    @Body() payload: TagExpenseDto,
  ) {
    return this.tagService.tagExpense(userId, expenseId, payload.tagIds);
  }

  @Get('expenses/:expenseId')
  getExpenseTags(
    @CurrentUser('id') userId: UUID,
    @Param('expenseId') expenseId: UUID,
  ) {
    return this.tagService.getExpenseTags(userId, expenseId);
  }
}
