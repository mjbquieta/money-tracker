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
import { VehicleService } from './vehicle.service';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  CreateVehicleExpenseDto,
  UpdateVehicleExpenseDto,
} from './vehicle.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Vehicles')
@ApiBearerAuth()
@Controller('api/v1/vehicles')
@UseGuards(TwoFactorAuthGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Get()
  findAll(@CurrentUser('id') userId: UUID) {
    return this.vehicleService.findAllVehicles(userId);
  }

  @Get('summary')
  getSummary(@CurrentUser('id') userId: UUID) {
    return this.vehicleService.getSummary(userId);
  }

  @Get('analytics')
  getAnalytics(@CurrentUser('id') userId: UUID) {
    return this.vehicleService.getAnalytics(userId);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.vehicleService.findOneVehicle(userId, id);
  }

  @Post()
  create(
    @CurrentUser('id') userId: UUID,
    @Body() payload: CreateVehicleDto,
  ) {
    return this.vehicleService.createVehicle(userId, payload);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: UpdateVehicleDto,
  ) {
    return this.vehicleService.updateVehicle(userId, id, payload);
  }

  @Delete(':id')
  delete(@CurrentUser('id') userId: UUID, @Param('id') id: UUID) {
    return this.vehicleService.deleteVehicle(userId, id);
  }

  @Post(':id/expenses')
  addExpense(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Body() payload: CreateVehicleExpenseDto,
  ) {
    return this.vehicleService.addExpense(userId, id, payload);
  }

  @Patch(':id/expenses/:expenseId')
  updateExpense(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Param('expenseId') expenseId: UUID,
    @Body() payload: UpdateVehicleExpenseDto,
  ) {
    return this.vehicleService.updateExpense(userId, id, expenseId, payload);
  }

  @Delete(':id/expenses/:expenseId')
  deleteExpense(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Param('expenseId') expenseId: UUID,
  ) {
    return this.vehicleService.deleteExpense(userId, id, expenseId);
  }
}
