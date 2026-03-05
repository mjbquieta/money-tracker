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
import { DebtService } from './debt.service';
import { CreateDebtDto, UpdateDebtDto, CreateDebtPaymentDto } from './debt.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Debts')
@ApiBearerAuth()
@Controller('api/v1/debts')
@UseGuards(TwoFactorAuthGuard)
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Get()
  findAll(@CurrentUser('id') userId: UUID) {
    return this.debtService.findAll(userId);
  }

  @Get('summary')
  getSummary(@CurrentUser('id') userId: UUID) {
    return this.debtService.getSummary(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.debtService.findOne(userId, id);
  }

  @Post()
  create(
    @CurrentUser('id') userId: UUID,
    @Body() payload: CreateDebtDto,
  ) {
    return this.debtService.create(userId, payload);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: UpdateDebtDto,
  ) {
    return this.debtService.update(userId, id, payload);
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.debtService.delete(userId, id);
  }

  @Post(':id/payments')
  addPayment(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: CreateDebtPaymentDto,
  ) {
    return this.debtService.addPayment(userId, id, payload);
  }

  @Delete(':id/payments/:paymentId')
  deletePayment(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Param('paymentId') paymentId: UUID,
  ) {
    return this.debtService.deletePayment(userId, id, paymentId);
  }
}
