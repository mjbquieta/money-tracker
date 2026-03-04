import { defineStore } from 'pinia';
import type { Expense, CreateExpensePayload, UpdateExpensePayload, CreateBulkExpensePayload, Category, CreateCategoryPayload, UpdateCategoryPayload, PaginationMeta, ExpenseFilters, CategorySpendingStatus } from '~/types';

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export const useExpenseStore = defineStore('expense', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const api = useApi();

  async function fetchCategories() {
    loading.value = true;
    const { data, error } = await api.get<PaginatedResponse<Category>>('/api/v1/categories?limit=100');
    loading.value = false;

    if (error) {
      return { success: false, error };
    }

    categories.value = data?.data ?? [];
    return { success: true, error: null };
  }

  async function createCategory(payload: CreateCategoryPayload) {
    const { data, error } = await api.post<Category>('/api/v1/categories', payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      categories.value.push(data);
    }
    return { success: true, error: null, data };
  }

  async function createExpense(payload: CreateExpensePayload) {
    const { data, error } = await api.post<Expense>('/api/v1/expenses', payload);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null, data };
  }

  async function createBulkExpenses(payload: CreateBulkExpensePayload) {
    const { data, error } = await api.post<Expense[]>('/api/v1/expenses/bulk', payload);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null, data };
  }

  async function updateExpense(id: string, payload: UpdateExpensePayload) {
    const { data, error } = await api.patch<Expense>(`/api/v1/expenses/${id}`, payload);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null, data };
  }

  async function deleteExpense(id: string) {
    const { error } = await api.del(`/api/v1/expenses/${id}`);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null };
  }

  async function searchExpenses(filters: ExpenseFilters & { limit?: number; cursor?: string; page?: number }) {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.budgetPeriodId) params.set('budgetPeriodId', filters.budgetPeriodId);
    if (filters.categoryId) params.set('categoryId', filters.categoryId);
    if (filters.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.set('dateTo', filters.dateTo);
    if (filters.amountMin !== undefined) params.set('amountMin', String(filters.amountMin));
    if (filters.amountMax !== undefined) params.set('amountMax', String(filters.amountMax));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.cursor) params.set('cursor', filters.cursor);
    if (filters.page) params.set('page', String(filters.page));

    const { data, error } = await api.get<PaginatedResponse<Expense>>(`/api/v1/expenses?${params}`);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null, data: data?.data ?? [], pagination: data?.pagination };
  }

  async function updateCategory(id: string, payload: UpdateCategoryPayload) {
    const { data, error } = await api.patch<Category>(`/api/v1/categories/${id}`, payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      const index = categories.value.findIndex((c) => c.id === id);
      if (index !== -1) categories.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  async function fetchAllSpendingStatus(budgetPeriodId: string) {
    const { data, error } = await api.get<CategorySpendingStatus[]>(
      `/api/v1/categories/spending-status?budgetPeriodId=${budgetPeriodId}`,
    );

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null, data: data ?? [] };
  }

  async function deleteCategory(id: string) {
    const { error } = await api.del(`/api/v1/categories/${id}`);

    if (error) {
      return { success: false, error };
    }

    categories.value = categories.value.filter((c) => c.id !== id);
    return { success: true, error: null };
  }

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchAllSpendingStatus,
    createExpense,
    createBulkExpenses,
    updateExpense,
    deleteExpense,
    searchExpenses,
  };
});
