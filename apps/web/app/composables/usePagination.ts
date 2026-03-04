import { ref, computed } from 'vue';
import type { PaginationMeta } from '~/types';

interface PaginatedApiResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

interface UsePaginationOptions {
  pageSize?: number;
  mode?: 'cursor' | 'offset';
}

export function usePagination<T extends { id: string }>(
  endpoint: string,
  options: UsePaginationOptions = {},
) {
  const api = useApi();
  const pageSize = options.pageSize ?? 20;
  const mode = options.mode ?? 'cursor';

  const items = ref<T[]>([]) as Ref<T[]>;
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref<PaginationMeta | null>(null);
  const currentPage = ref(1);

  const hasMore = computed(() => pagination.value?.hasMore ?? false);

  function buildQuery(params?: Record<string, string>) {
    const query = new URLSearchParams({
      limit: String(pageSize),
      ...(params || {}),
    });

    if (mode === 'cursor' && pagination.value?.nextCursor) {
      query.set('cursor', pagination.value.nextCursor);
    } else if (mode === 'offset') {
      query.set('page', String(currentPage.value));
    }

    return query.toString();
  }

  async function fetch(params?: Record<string, string>) {
    loading.value = true;
    error.value = null;

    const query = buildQuery(params);
    const { data, error: apiError } = await api.get<PaginatedApiResponse<T>>(
      `${endpoint}?${query}`,
    );

    loading.value = false;

    if (apiError) {
      error.value = Array.isArray(apiError.message)
        ? apiError.message[0]
        : apiError.message;
      return { success: false };
    }

    if (data) {
      items.value = data.data;
      pagination.value = data.pagination;
    }

    return { success: true };
  }

  async function loadMore(params?: Record<string, string>) {
    if (!hasMore.value || loading.value) return;

    if (mode === 'offset') {
      currentPage.value += 1;
    }

    loading.value = true;
    error.value = null;

    const query = buildQuery(params);
    const { data, error: apiError } = await api.get<PaginatedApiResponse<T>>(
      `${endpoint}?${query}`,
    );

    loading.value = false;

    if (apiError) {
      error.value = Array.isArray(apiError.message)
        ? apiError.message[0]
        : apiError.message;
      return;
    }

    if (data) {
      items.value = [...items.value, ...data.data];
      pagination.value = data.pagination;
    }
  }

  function reset() {
    items.value = [];
    pagination.value = null;
    currentPage.value = 1;
    error.value = null;
  }

  async function refresh(params?: Record<string, string>) {
    reset();
    return fetch(params);
  }

  return {
    items,
    loading,
    error,
    pagination,
    hasMore,
    fetch,
    loadMore,
    reset,
    refresh,
  };
}
