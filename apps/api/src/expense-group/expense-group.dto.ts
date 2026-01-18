import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateExpenseGroupDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsUUID()
  budgetPeriodId: string;
}

export class UpdateExpenseGroupDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}

export class AddExpensesToGroupDto {
  @IsArray()
  @IsUUID('4', { each: true })
  expenseIds: string[];
}

export class MoveExpensesToGroupDto {
  @IsArray()
  @IsUUID('4', { each: true })
  expenseIds: string[];

  @IsOptional()
  @IsUUID()
  targetGroupId?: string | null; // null means remove from group (ungrouped)
}
