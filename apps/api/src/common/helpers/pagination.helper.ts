import { PaginationQueryDto } from '../dto/pagination.dto';
import { PaginationMeta } from '../interfaces/api-response.interface';

export interface PrismaPageArgs {
  take: number;
  skip?: number;
  cursor?: { id: string };
  orderBy: { createdAt: 'asc' | 'desc' };
}

export function buildPrismaArgs(dto: PaginationQueryDto): PrismaPageArgs {
  const limit = dto.limit ?? 20;
  const orderBy = { createdAt: (dto.sortOrder ?? 'desc') as 'asc' | 'desc' };

  // Cursor-based pagination
  if (dto.cursor) {
    return {
      take: limit + 1,
      skip: 1,
      cursor: { id: dto.cursor },
      orderBy,
    };
  }

  // Offset-based pagination
  if (dto.page) {
    return {
      take: limit + 1,
      skip: (dto.page - 1) * limit,
      orderBy,
    };
  }

  // Default: first page
  return {
    take: limit + 1,
    orderBy,
  };
}

export function buildPaginatedResponse<T extends { id: string }>(
  items: T[],
  dto: PaginationQueryDto,
  totalCount?: number,
): { data: T[]; pagination: PaginationMeta } {
  const limit = dto.limit ?? 20;
  const hasMore = items.length > limit;
  const data = hasMore ? items.slice(0, limit) : items;
  const lastItem = data[data.length - 1];

  const pagination: PaginationMeta = {
    hasMore,
    nextCursor: hasMore && lastItem ? lastItem.id : null,
    ...(dto.page !== undefined && {
      page: dto.page,
      pageSize: limit,
    }),
    ...(totalCount !== undefined && { totalCount }),
  };

  return { data, pagination };
}
