import {
  IsString,
  IsOptional,
  IsNumber,
  IsPositive,
  IsDateString,
  IsEnum,
  MaxLength,
  MinLength,
} from 'class-validator';

enum DebtType {
  I_OWE = 'I_OWE',
  OWED_TO_ME = 'OWED_TO_ME',
}

enum DebtStatus {
  ACTIVE = 'ACTIVE',
  SETTLED = 'SETTLED',
  CANCELLED = 'CANCELLED',
}

export class CreateDebtDto {
  @IsEnum(DebtType)
  type: DebtType;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  counterparty: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;
}

export class UpdateDebtDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  counterparty?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(DebtStatus)
  status?: DebtStatus;
}

export class CreateDebtPaymentDto {
  @IsNumber()
  @IsPositive()
  amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  note?: string;
}
