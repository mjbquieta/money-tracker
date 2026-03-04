import type { ExpenseFilters } from '~/types';

export function useExpenseFilters() {
  const filters = reactive<ExpenseFilters>({
    search: undefined,
    budgetPeriodId: undefined,
    categoryId: undefined,
    dateFrom: undefined,
    dateTo: undefined,
    amountMin: undefined,
    amountMax: undefined,
  });

  const activeFilterCount = computed(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categoryId) count++;
    if (filters.dateFrom) count++;
    if (filters.dateTo) count++;
    if (filters.amountMin !== undefined) count++;
    if (filters.amountMax !== undefined) count++;
    return count;
  });

  const hasActiveFilters = computed(() => activeFilterCount.value > 0);

  function toQueryParams(): Record<string, string> {
    const params: Record<string, string> = {};
    if (filters.search) params.search = filters.search;
    if (filters.budgetPeriodId) params.budgetPeriodId = filters.budgetPeriodId;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.amountMin !== undefined) params.amountMin = String(filters.amountMin);
    if (filters.amountMax !== undefined) params.amountMax = String(filters.amountMax);
    return params;
  }

  function reset() {
    filters.search = undefined;
    filters.categoryId = undefined;
    filters.dateFrom = undefined;
    filters.dateTo = undefined;
    filters.amountMin = undefined;
    filters.amountMax = undefined;
  }

  return { filters, activeFilterCount, hasActiveFilters, toQueryParams, reset };
}
