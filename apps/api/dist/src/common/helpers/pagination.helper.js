"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPrismaArgs = buildPrismaArgs;
exports.buildPaginatedResponse = buildPaginatedResponse;
function buildPrismaArgs(dto) {
    const limit = dto.limit ?? 20;
    const orderBy = { createdAt: (dto.sortOrder ?? 'desc') };
    if (dto.cursor) {
        return {
            take: limit + 1,
            skip: 1,
            cursor: { id: dto.cursor },
            orderBy,
        };
    }
    if (dto.page) {
        return {
            take: limit + 1,
            skip: (dto.page - 1) * limit,
            orderBy,
        };
    }
    return {
        take: limit + 1,
        orderBy,
    };
}
function buildPaginatedResponse(items, dto, totalCount) {
    const limit = dto.limit ?? 20;
    const hasMore = items.length > limit;
    const data = hasMore ? items.slice(0, limit) : items;
    const lastItem = data[data.length - 1];
    const pagination = {
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
//# sourceMappingURL=pagination.helper.js.map