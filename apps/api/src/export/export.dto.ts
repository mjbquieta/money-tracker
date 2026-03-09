import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsUUID,
  IsArray,
  ValidateNested,
  MinLength,
  IsBoolean,
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

export class ImportVehicleExpenseRecord {
  @IsString()
  @MinLength(1)
  type: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsNumber()
  odometer?: number;

  @IsOptional()
  @IsNumber()
  fuelLiters?: number;

  @IsOptional()
  @IsNumber()
  fuelPricePerLiter?: number;

  @IsOptional()
  @IsBoolean()
  isFullTank?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class ImportVehicleExpensesDto {
  @IsUUID()
  vehicleId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImportVehicleExpenseRecord)
  records: ImportVehicleExpenseRecord[];
}
