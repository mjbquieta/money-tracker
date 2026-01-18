import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class IncomeItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @IsPositive()
  amount: number;
}

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

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => IncomeItemDto)
  incomes?: IncomeItemDto[];
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
}

export {
  IncomeItemDto,
  CreateBudgetPeriodDto,
  UpdateBudgetPeriodDto,
  DuplicateBudgetPeriodDto,
};
