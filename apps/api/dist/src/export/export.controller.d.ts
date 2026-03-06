import { Response } from 'express';
import { UUID } from 'crypto';
import { ExportService } from './export.service';
import { ImportExpensesDto } from './export.dto';
export declare class ExportController {
    private readonly exportService;
    constructor(exportService: ExportService);
    exportCsv(userId: UUID, id: UUID, res: Response): Promise<void>;
    importExpenses(userId: UUID, payload: ImportExpensesDto): Promise<{
        importedCount: number;
        categoriesCreated: number;
    }>;
}
