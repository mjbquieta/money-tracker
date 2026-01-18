import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

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
}

export { CreateCategoryDto, UpdateCategoryDto, DefaultCategory };
