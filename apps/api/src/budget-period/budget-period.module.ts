import { Module } from '@nestjs/common';
import { BudgetPeriodController } from './budget-period.controller';
import { BudgetPeriodService } from './budget-period.service';

@Module({
  controllers: [BudgetPeriodController],
  providers: [BudgetPeriodService],
  exports: [BudgetPeriodService],
})
export class BudgetPeriodModule {}
