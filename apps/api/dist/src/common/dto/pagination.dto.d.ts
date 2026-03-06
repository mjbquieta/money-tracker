export declare enum SortOrder {
    ASC = "asc",
    DESC = "desc"
}
export declare class PaginationQueryDto {
    limit?: number;
    cursor?: string;
    page?: number;
    sortOrder?: SortOrder;
}
