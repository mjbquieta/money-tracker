import { UUID } from 'crypto';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto, UpdateVehicleDto, CreateVehicleExpenseDto, UpdateVehicleExpenseDto } from './vehicle.dto';
export declare class VehicleController {
    private readonly vehicleService;
    constructor(vehicleService: VehicleService);
    findAll(userId: UUID): Promise<({
        expenses: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            date: Date;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            amount: number;
            description: string | null;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        make: string | null;
        model: string | null;
        year: number | null;
        licensePlate: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    })[]>;
    getSummary(userId: UUID): Promise<{
        totalVehicles: number;
        totalExpenses: number;
        totalSpent: number;
        byType: Record<string, {
            total: number;
            count: number;
        }>;
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
    findOne(userId: UUID, id: UUID): Promise<{
        expenses: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            date: Date;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            amount: number;
            description: string | null;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        make: string | null;
        model: string | null;
        year: number | null;
        licensePlate: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    create(userId: UUID, payload: CreateVehicleDto): Promise<{
        expenses: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            date: Date;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            amount: number;
            description: string | null;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        make: string | null;
        model: string | null;
        year: number | null;
        licensePlate: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    update(userId: UUID, id: UUID, payload: UpdateVehicleDto): Promise<{
        expenses: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            date: Date;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            amount: number;
            description: string | null;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        make: string | null;
        model: string | null;
        year: number | null;
        licensePlate: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    delete(userId: UUID, id: UUID): Promise<{
        id: string;
        name: string;
        make: string | null;
        model: string | null;
        year: number | null;
        licensePlate: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    addExpense(userId: UUID, id: UUID, payload: CreateVehicleExpenseDto): Promise<{
        expenses: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            date: Date;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            amount: number;
            description: string | null;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        make: string | null;
        model: string | null;
        year: number | null;
        licensePlate: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    updateExpense(userId: UUID, id: UUID, expenseId: UUID, payload: UpdateVehicleExpenseDto): Promise<{
        expenses: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            date: Date;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            amount: number;
            description: string | null;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        make: string | null;
        model: string | null;
        year: number | null;
        licensePlate: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
    deleteExpense(userId: UUID, id: UUID, expenseId: UUID): Promise<{
        expenses: {
            id: string;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date | null;
            deletedAt: Date | null;
            date: Date;
            type: import("@prisma/client").$Enums.VehicleExpenseType;
            amount: number;
            description: string | null;
            odometer: number | null;
            fuelLiters: number | null;
            fuelPricePerLiter: number | null;
            isFullTank: boolean | null;
            vehicleId: string;
        }[];
        _count: {
            expenses: number;
        };
    } & {
        id: string;
        name: string;
        make: string | null;
        model: string | null;
        year: number | null;
        licensePlate: string | null;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date | null;
        deletedAt: Date | null;
        userId: string;
    }>;
}
