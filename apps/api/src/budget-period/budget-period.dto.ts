import { Type } from 'class-transformer';
import {
  IsDate,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';

class CreateBudgetPeriodDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsNumber()
  @IsPositive()
  income: number;
}

class UpdateBudgetPeriodDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  income?: number;
}

class DuplicateBudgetPeriodDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  income?: number;
}

export { CreateBudgetPeriodDto, UpdateBudgetPeriodDto, DuplicateBudgetPeriodDto };
