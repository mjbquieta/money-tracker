import { IsNumber, IsOptional, IsPositive, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

class CreateExpenseTemplateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsUUID()
  categoryId: string;
}

class UpdateExpenseTemplateDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}

class CreateExpenseFromTemplateDto {
  @IsUUID()
  templateId: string;

  @IsUUID()
  budgetPeriodId: string;

  @IsOptional()
  @IsUUID()
  expenseGroupId?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  amount?: number;

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;
}

export { CreateExpenseTemplateDto, UpdateExpenseTemplateDto, CreateExpenseFromTemplateDto };
