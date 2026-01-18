import { Module } from '@nestjs/common';
import { IncomeSourceService } from './income-source.service';

@Module({
  providers: [IncomeSourceService],
  exports: [IncomeSourceService],
})
export class IncomeSourceModule {}
