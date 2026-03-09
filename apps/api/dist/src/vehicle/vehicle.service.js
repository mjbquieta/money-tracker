"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VehicleService = class VehicleService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createVehicle(userId, payload) {
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
    async findAllVehicles(userId) {
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
    async findOneVehicle(userId, vehicleId) {
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
            throw new common_1.NotFoundException('Vehicle not found');
        }
        return vehicle;
    }
    async updateVehicle(userId, vehicleId, payload) {
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
    async deleteVehicle(userId, vehicleId) {
        await this.findOneVehicle(userId, vehicleId);
        return this.prisma.vehicle.update({
            where: { id: vehicleId },
            data: { deletedAt: new Date() },
        });
    }
    async addExpense(userId, vehicleId, payload) {
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
    async updateExpense(userId, vehicleId, expenseId, payload) {
        await this.findOneVehicle(userId, vehicleId);
        const expense = await this.prisma.vehicleExpense.findFirst({
            where: { id: expenseId, vehicleId, deletedAt: null },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Vehicle expense not found');
        }
        const data = { ...payload };
        if (payload.date) {
            data.date = new Date(payload.date);
        }
        await this.prisma.vehicleExpense.update({
            where: { id: expenseId },
            data,
        });
        return this.findOneVehicle(userId, vehicleId);
    }
    async deleteExpense(userId, vehicleId, expenseId) {
        await this.findOneVehicle(userId, vehicleId);
        const expense = await this.prisma.vehicleExpense.findFirst({
            where: { id: expenseId, vehicleId, deletedAt: null },
        });
        if (!expense) {
            throw new common_1.NotFoundException('Vehicle expense not found');
        }
        await this.prisma.vehicleExpense.update({
            where: { id: expenseId },
            data: { deletedAt: new Date() },
        });
        return this.findOneVehicle(userId, vehicleId);
    }
    async getAnalytics(userId) {
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
        const fuelExpenses = allExpenses
            .filter((e) => e.type === 'FUEL' && e.fuelLiters)
            .map((e) => ({
            date: e.date.toISOString(),
            liters: e.fuelLiters,
            amount: e.amount,
            pricePerLiter: e.fuelPricePerLiter,
            odometer: e.odometer,
            isFullTank: e.isFullTank,
        }));
        const monthlyMap = {};
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
        const byType = {};
        for (const expense of allExpenses) {
            if (!byType[expense.type]) {
                byType[expense.type] = { total: 0, count: 0 };
            }
            byType[expense.type].total += expense.amount;
            byType[expense.type].count += 1;
        }
        const fuelWithAmount = allExpenses.filter((e) => e.type === 'FUEL');
        const avgFuelCost = fuelWithAmount.length > 0
            ? fuelWithAmount.reduce((sum, e) => sum + e.amount, 0) / fuelWithAmount.length
            : 0;
        const totalFuelLiters = fuelExpenses.reduce((sum, e) => sum + e.liters, 0);
        const fuelWithPrice = fuelExpenses.filter((e) => e.pricePerLiter);
        const avgPricePerLiter = fuelWithPrice.length > 0
            ? fuelWithPrice.reduce((sum, e) => sum + e.pricePerLiter, 0) / fuelWithPrice.length
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
    async getSummary(userId) {
        const vehicles = await this.prisma.vehicle.findMany({
            where: { userId, deletedAt: null },
            include: {
                expenses: { where: { deletedAt: null } },
            },
        });
        const allExpenses = vehicles.flatMap((v) => v.expenses);
        const totalSpent = allExpenses.reduce((sum, e) => sum + e.amount, 0);
        const byType = {};
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
};
exports.VehicleService = VehicleService;
exports.VehicleService = VehicleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VehicleService);
//# sourceMappingURL=vehicle.service.js.map