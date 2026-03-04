import { PaginationQueryDto } from '../common/dto/pagination.dto';
export declare class ExpenseFilterDto extends PaginationQueryDto {
    search?: string;
    budgetPeriodId?: string;
    categoryId?: string;
    dateFrom?: string;
    dateTo?: string;
    amountMin?: number;
    amountMax?: number;
    tagIds?: string[];
}
