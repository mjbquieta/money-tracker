export interface ApiResponseMeta {
  timestamp: string;
  path?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  hasMore: boolean;
  nextCursor?: string | null;
  page?: number;
  pageSize?: number;
  totalCount?: number;
}

export interface ApiResponse<T = unknown> {
  data: T;
  meta: ApiResponseMeta;
}

export interface ApiErrorResponse {
  error: {
    statusCode: number;
    message: string | string[];
    error?: string;
  };
  meta: ApiResponseMeta;
}
