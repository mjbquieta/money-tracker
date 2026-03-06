import { PaginationQueryDto } from '../dto/pagination.dto';
import { PaginationMeta } from '../interfaces/api-response.interface';
export interface PrismaPageArgs {
    take: number;
    skip?: number;
    cursor?: {
        id: string;
    };
    orderBy: {
        createdAt: 'asc' | 'desc';
    };
}
export declare function buildPrismaArgs(dto: PaginationQueryDto): PrismaPageArgs;
export declare function buildPaginatedResponse<T extends {
    id: string;
}>(items: T[], dto: PaginationQueryDto, totalCount?: number): {
    data: T[];
    pagination: PaginationMeta;
};
