import { Module } from '@nestjs/common';
import { PersonalBudgetController } from './personal-budget.controller';
import { PersonalBudgetService } from './personal-budget.service';

@Module({
  controllers: [PersonalBudgetController],
  providers: [PersonalBudgetService],
  exports: [PersonalBudgetService],
})
export class PersonalBudgetModule {}
