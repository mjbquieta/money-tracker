import { IsEnum, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

enum DefaultCategory {
  BILLS = 'BILLS',
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  SAVINGS = 'SAVINGS',
  ENTERTAINMENT = 'ENTERTAINMENT',
}

class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  spendingLimit?: number;
}

class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  spendingLimit?: number | null;
}

export { CreateCategoryDto, UpdateCategoryDto, DefaultCategory };
