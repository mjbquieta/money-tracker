import { UUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class ExportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    exportBudgetPeriodCsv(userId: UUID, budgetPeriodId: UUID): Promise<string>;
    importExpensesCsv(userId: UUID, budgetPeriodId: UUID, records: Array<{
        name: string;
        description?: string;
        amount: number;
        categoryName: string;
    }>): Promise<{
        importedCount: number;
        categoriesCreated: number;
    }>;
    exportVehicleExpensesCsv(userId: UUID, vehicleId: UUID): Promise<string>;
    private readonly VALID_VEHICLE_EXPENSE_TYPES;
    importVehicleExpensesCsv(userId: UUID, vehicleId: UUID, records: Array<{
        type: string;
        amount: number;
        description?: string;
        date?: string;
        odometer?: number;
        fuelLiters?: number;
        fuelPricePerLiter?: number;
        isFullTank?: boolean;
        notes?: string;
    }>): Promise<{
        importedCount: number;
    }>;
}
