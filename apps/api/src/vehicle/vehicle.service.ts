import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateVehicleDto,
  UpdateVehicleDto,
  CreateVehicleExpenseDto,
  UpdateVehicleExpenseDto,
} from './vehicle.dto';

@Injectable()
export class VehicleService {
  constructor(private readonly prisma: PrismaService) {}

  async createVehicle(userId: UUID, payload: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: {
        name: payload.name,
        make: payload.make,
        model: payload.model,
        year: payload.year,
        licensePlate: payload.licensePlate,
        notes: payload.notes,
        userId,
      },
      include: {
        expenses: { orderBy: { date: 'desc' }, take: 5 },
        _count: { select: { expenses: true } },
      },
    });
  }

  async findAllVehicles(userId: UUID) {
    return this.prisma.vehicle.findMany({
      where: { userId, deletedAt: null },
      include: {
        expenses: {
          where: { deletedAt: null },
          orderBy: { date: 'desc' },
          take: 5,
        },
        _count: { select: { expenses: { where: { deletedAt: null } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneVehicle(userId: UUID, vehicleId: UUID) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: { id: vehicleId, userId, deletedAt: null },
      include: {
        expenses: {
          where: { deletedAt: null },
          orderBy: { date: 'desc' },
        },
        _count: { select: { expenses: { where: { deletedAt: null } } } },
      },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    return vehicle;
  }

  async updateVehicle(userId: UUID, vehicleId: UUID, payload: UpdateVehicleDto) {
    await this.findOneVehicle(userId, vehicleId);

    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: payload,
      include: {
        expenses: {
          where: { deletedAt: null },
          orderBy: { date: 'desc' },
          take: 5,
        },
        _count: { select: { expenses: { where: { deletedAt: null } } } },
      },
    });
  }

  async deleteVehicle(userId: UUID, vehicleId: UUID) {
    await this.findOneVehicle(userId, vehicleId);

    return this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { deletedAt: new Date() },
    });
  }

  async addExpense(userId: UUID, vehicleId: UUID, payload: CreateVehicleExpenseDto) {
    await this.findOneVehicle(userId, vehicleId);

    await this.prisma.vehicleExpense.create({
      data: {
        type: payload.type,
        amount: payload.amount,
        description: payload.description,
        date: payload.date ? new Date(payload.date) : new Date(),
        odometer: payload.odometer,
        fuelLiters: payload.fuelLiters,
        fuelPricePerLiter: payload.fuelPricePerLiter,
        isFullTank: payload.isFullTank,
        notes: payload.notes,
        vehicleId,
      },
    });

    return this.findOneVehicle(userId, vehicleId);
  }

  async updateExpense(
    userId: UUID,
    vehicleId: UUID,
    expenseId: UUID,
    payload: UpdateVehicleExpenseDto,
  ) {
    await this.findOneVehicle(userId, vehicleId);

    const expense = await this.prisma.vehicleExpense.findFirst({
      where: { id: expenseId, vehicleId, deletedAt: null },
    });

    if (!expense) {
      throw new NotFoundException('Vehicle expense not found');
    }

    const data: any = { ...payload };
    if (payload.date) {
      data.date = new Date(payload.date);
    }

    await this.prisma.vehicleExpense.update({
      where: { id: expenseId },
      data,
    });

    return this.findOneVehicle(userId, vehicleId);
  }

  async deleteExpense(userId: UUID, vehicleId: UUID, expenseId: UUID) {
    await this.findOneVehicle(userId, vehicleId);

    const expense = await this.prisma.vehicleExpense.findFirst({
      where: { id: expenseId, vehicleId, deletedAt: null },
    });

    if (!expense) {
      throw new NotFoundException('Vehicle expense not found');
    }

    await this.prisma.vehicleExpense.update({
      where: { id: expenseId },
      data: { deletedAt: new Date() },
    });

    return this.findOneVehicle(userId, vehicleId);
  }

  async getAnalytics(userId: UUID) {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { userId, deletedAt: null },
      include: {
        expenses: {
          where: { deletedAt: null },
          orderBy: { date: 'asc' },
        },
      },
    });

    const allExpenses = vehicles.flatMap((v) => v.expenses);

    // Fuel consumption over time (only fuel expenses with liters)
    const fuelExpenses = allExpenses
      .filter((e) => e.type === 'FUEL' && e.fuelLiters)
      .map((e) => ({
        date: e.date.toISOString(),
        liters: e.fuelLiters!,
        amount: e.amount,
        pricePerLiter: e.fuelPricePerLiter,
        odometer: e.odometer,
        isFullTank: e.isFullTank,
      }));

    // Monthly spending trend
    const monthlyMap: Record<string, { total: number; count: number }> = {};
    for (const expense of allExpenses) {
      const key = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthlyMap[key]) {
        monthlyMap[key] = { total: 0, count: 0 };
      }
      monthlyMap[key].total += expense.amount;
      monthlyMap[key].count += 1;
    }

    const monthlySpending = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }));

    // Spending by type
    const byType: Record<string, { total: number; count: number }> = {};
    for (const expense of allExpenses) {
      if (!byType[expense.type]) {
        byType[expense.type] = { total: 0, count: 0 };
      }
      byType[expense.type].total += expense.amount;
      byType[expense.type].count += 1;
    }

    // Average cost per fill
    const fuelWithAmount = allExpenses.filter((e) => e.type === 'FUEL');
    const avgFuelCost = fuelWithAmount.length > 0
      ? fuelWithAmount.reduce((sum, e) => sum + e.amount, 0) / fuelWithAmount.length
      : 0;

    // Total fuel liters
    const totalFuelLiters = fuelExpenses.reduce((sum, e) => sum + e.liters, 0);

    // Average price per liter
    const fuelWithPrice = fuelExpenses.filter((e) => e.pricePerLiter);
    const avgPricePerLiter = fuelWithPrice.length > 0
      ? fuelWithPrice.reduce((sum, e) => sum + e.pricePerLiter!, 0) / fuelWithPrice.length
      : 0;

    return {
      fuelConsumption: fuelExpenses,
      monthlySpending,
      byType,
      fuelStats: {
        totalFills: fuelWithAmount.length,
        avgCostPerFill: Math.round(avgFuelCost * 100) / 100,
        totalLiters: Math.round(totalFuelLiters * 100) / 100,
        avgPricePerLiter: Math.round(avgPricePerLiter * 100) / 100,
      },
      totalExpenses: allExpenses.length,
    };
  }

  async getSummary(userId: UUID) {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { userId, deletedAt: null },
      include: {
        expenses: { where: { deletedAt: null } },
      },
    });

    const allExpenses = vehicles.flatMap((v) => v.expenses);
    const totalSpent = allExpenses.reduce((sum, e) => sum + e.amount, 0);

    const byType: Record<string, { total: number; count: number }> = {};
    for (const expense of allExpenses) {
      if (!byType[expense.type]) {
        byType[expense.type] = { total: 0, count: 0 };
      }
      byType[expense.type].total += expense.amount;
      byType[expense.type].count += 1;
    }

    return {
      totalVehicles: vehicles.length,
      totalExpenses: allExpenses.length,
      totalSpent,
      byType,
    };
  }
}
