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
import { TwoFactorAuthGuard } from '../auth/two-factor-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { FinancialGoalService } from './financial-goal.service';
import {
  CreateFinancialGoalDto,
  UpdateFinancialGoalDto,
  CreateGoalContributionDto,
} from './financial-goal.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Financial Goals')
@ApiBearerAuth()
@Controller('api/v1/financial-goals')
@UseGuards(TwoFactorAuthGuard)
export class FinancialGoalController {
  constructor(private readonly financialGoalService: FinancialGoalService) {}

  @Get()
  findAll(@CurrentUser('id') userId: UUID) {
    return this.financialGoalService.findAll(userId);
  }

  @Get('summary')
  getSummary(@CurrentUser('id') userId: UUID) {
    return this.financialGoalService.getSummary(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.financialGoalService.findOne(userId, id);
  }

  @Post()
  create(
    @CurrentUser('id') userId: UUID,
    @Body() payload: CreateFinancialGoalDto,
  ) {
    return this.financialGoalService.create(userId, payload);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: UpdateFinancialGoalDto,
  ) {
    return this.financialGoalService.update(userId, id, payload);
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.financialGoalService.delete(userId, id);
  }

  @Post(':id/contributions')
  addContribution(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: CreateGoalContributionDto,
  ) {
    return this.financialGoalService.addContribution(userId, id, payload);
  }

  @Delete(':id/contributions/:contributionId')
  deleteContribution(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Param('contributionId') contributionId: UUID,
  ) {
    return this.financialGoalService.deleteContribution(userId, id, contributionId);
  }
}
