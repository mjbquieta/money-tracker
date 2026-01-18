import { Module } from '@nestjs/common';
import { ExpenseGroupController } from './expense-group.controller';
import { ExpenseGroupService } from './expense-group.service';

@Module({
  controllers: [ExpenseGroupController],
  providers: [ExpenseGroupService],
  exports: [ExpenseGroupService],
})
export class ExpenseGroupModule {}
