import { Module } from '@nestjs/common';
import { ExpenseTemplateController } from './expense-template.controller';
import { ExpenseTemplateService } from './expense-template.service';

@Module({
  controllers: [ExpenseTemplateController],
  providers: [ExpenseTemplateService],
  exports: [ExpenseTemplateService],
})
export class ExpenseTemplateModule {}
