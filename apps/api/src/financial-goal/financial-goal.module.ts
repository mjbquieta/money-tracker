import { Module } from '@nestjs/common';
import { FinancialGoalController } from './financial-goal.controller';
import { FinancialGoalService } from './financial-goal.service';

@Module({
  controllers: [FinancialGoalController],
  providers: [FinancialGoalService],
  exports: [FinancialGoalService],
})
export class FinancialGoalModule {}
