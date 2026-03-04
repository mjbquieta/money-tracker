import { IsOptional, IsString, IsUUID, IsNumber, IsDateString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationQueryDto } from '../common/dto/pagination.dto';

export class ExpenseFilterDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  budgetPeriodId?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amountMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amountMax?: number;
}
