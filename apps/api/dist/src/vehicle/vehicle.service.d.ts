import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVehicleDto, UpdateVehicleDto, CreateVehicleExpenseDto, UpdateVehicleExpenseDto } from './vehicle.dto';
export declare class VehicleService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    createVehicle(userId: UUID, payload: CreateVehicleDto): Promise<{
        expenses: {
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            date: Date;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            notes: string | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        year: number | null;
        notes: string | null;
        make: string | null;
        model: string | null;
        licensePlate: string | null;
    }>;
    findAllVehicles(userId: UUID): Promise<({
        expenses: {
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            date: Date;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            notes: string | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        year: number | null;
        notes: string | null;
        make: string | null;
        model: string | null;
        licensePlate: string | null;
    })[]>;
    findOneVehicle(userId: UUID, vehicleId: UUID): Promise<{
        expenses: {
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            date: Date;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            notes: string | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        year: number | null;
        notes: string | null;
        make: string | null;
        model: string | null;
        licensePlate: string | null;
    }>;
    updateVehicle(userId: UUID, vehicleId: UUID, payload: UpdateVehicleDto): Promise<{
        expenses: {
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            date: Date;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            notes: string | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        year: number | null;
        notes: string | null;
        make: string | null;
        model: string | null;
        licensePlate: string | null;
    }>;
    deleteVehicle(userId: UUID, vehicleId: UUID): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        year: number | null;
        notes: string | null;
        make: string | null;
        model: string | null;
        licensePlate: string | null;
    }>;
    addExpense(userId: UUID, vehicleId: UUID, payload: CreateVehicleExpenseDto): Promise<{
        expenses: {
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            date: Date;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            notes: string | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        year: number | null;
        notes: string | null;
        make: string | null;
        model: string | null;
        licensePlate: string | null;
    }>;
    updateExpense(userId: UUID, vehicleId: UUID, expenseId: UUID, payload: UpdateVehicleExpenseDto): Promise<{
        expenses: {
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            date: Date;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            notes: string | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        year: number | null;
        notes: string | null;
        make: string | null;
        model: string | null;
        licensePlate: string | null;
    }>;
    deleteExpense(userId: UUID, vehicleId: UUID, expenseId: UUID): Promise<{
        expenses: {
            id: string;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            description: string | null;
            amount: number;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            date: Date;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            notes: string | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
        year: number | null;
        notes: string | null;
        make: string | null;
        model: string | null;
        licensePlate: string | null;
    }>;
    getAnalytics(userId: UUID): Promise<{
        fuelConsumption: {
            date: string;
            liters: number;
            amount: number;
            pricePerLiter: number | null;
            odometer: number | null;
            isFullTank: boolean | null;
        }[];
        monthlySpending: {
            total: number;
            count: number;
            month: string;
        }[];
        byType: Record<string, {
            total: number;
            count: number;
        }>;
        fuelStats: {
            totalFills: number;
            avgCostPerFill: number;
            totalLiters: number;
            avgPricePerLiter: number;
        };
        totalExpenses: number;
    }>;
    getSummary(userId: UUID): Promise<{
        totalVehicles: number;
        totalExpenses: number;
        totalSpent: number;
        byType: Record<string, {
            total: number;
            count: number;
        }>;
    }>;
}
