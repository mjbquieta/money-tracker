import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsUUID,
  IsArray,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ImportExpenseRecord {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsString()
  @MinLength(1)
  categoryName: string;
}

export class ImportExpensesDto {
  @IsUUID()
  budgetPeriodId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportExpenseRecord)
  records: ImportExpenseRecord[];
}
