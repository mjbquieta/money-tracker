import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UUID } from 'crypto';
import { TwoFactorAuthGuard } from '../auth/two-factor-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { ExportService } from './export.service';
import { ImportExpensesDto } from './export.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Export / Import')
@ApiBearerAuth()
@Controller('api/v1')
@UseGuards(TwoFactorAuthGuard)
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('export/budget-periods/:id/csv')
  async exportCsv(
    @CurrentUser('id') userId: UUID,
    @Param('id') id: UUID,
    @Res() res: Response,
  ) {
    const csv = await this.exportService.exportBudgetPeriodCsv(userId, id);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=budget-period-${id}.csv`);
    res.send(csv);
  }

  @Post('import/expenses')
  async importExpenses(
    @CurrentUser('id') userId: UUID,
    @Body() payload: ImportExpensesDto,
  ) {
    return this.exportService.importExpensesCsv(
      userId,
      payload.budgetPeriodId as UUID,
      payload.records,
    );
  }
}
