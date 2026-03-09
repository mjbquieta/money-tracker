import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsDateString,
  IsEnum,
  IsInt,
  IsBoolean,
  MaxLength,
  MinLength,
  Min,
} from 'class-validator';

enum VehicleExpenseType {
  FUEL = 'FUEL',
  MAINTENANCE = 'MAINTENANCE',
  INSURANCE = 'INSURANCE',
  PARKING = 'PARKING',
  TOLL = 'TOLL',
  ACCESSORIES = 'ACCESSORIES',
  REGISTRATION = 'REGISTRATION',
  WASH = 'WASH',
  PARTICIPATION_FEE = 'PARTICIPATION_FEE',
  OTHER = 'OTHER',
}

export class CreateVehicleDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  make?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  model?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  licensePlate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  make?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  model?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  year?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  licensePlate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class CreateVehicleExpenseDto {
  @IsEnum(VehicleExpenseType)
  type: VehicleExpenseType;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  odometer?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  fuelLiters?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  fuelPricePerLiter?: number;

  @IsOptional()
  @IsBoolean()
  isFullTank?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class UpdateVehicleExpenseDto {
  @IsOptional()
  @IsEnum(VehicleExpenseType)
  type?: VehicleExpenseType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  odometer?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  fuelLiters?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  fuelPricePerLiter?: number;

  @IsOptional()
  @IsBoolean()
  isFullTank?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
