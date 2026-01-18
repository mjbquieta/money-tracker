import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

class IncomeSourceDto {
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;

  @IsNumber()
  amount: number;
}

export { IncomeSourceDto };
