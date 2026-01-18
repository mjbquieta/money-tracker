import { defineStore } from 'pinia';
import type { Expense, CreateExpensePayload, Category, CreateCategoryPayload } from '~/types';

export const useExpenseStore = defineStore('expense', () => {
  const categories = ref<Category[]>([]);
  const loading = ref(false);
  const api = useApi();

  async function fetchCategories() {
    loading.value = true;
    const { data, error } = await api.get<Category[]>('/api/v1/categories');
    loading.value = false;

    if (error) {
      return { success: false, error };
    }

    categories.value = data ?? [];
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

  async function updateExpense(id: string, payload: Partial<CreateExpensePayload>) {
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

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    createExpense,
    updateExpense,
    deleteExpense,
  };
});
