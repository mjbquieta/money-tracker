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
}
