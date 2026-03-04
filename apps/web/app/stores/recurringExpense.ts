import { defineStore } from 'pinia';
import type { RecurringExpense, CreateRecurringExpensePayload, UpdateRecurringExpensePayload, GenerateRecurringExpensesResult, PaginationMeta } from '~/types';

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export const useRecurringExpenseStore = defineStore('recurringExpense', () => {
  const items = ref<RecurringExpense[]>([]);
  const loading = ref(false);
  const api = useApi();

  async function fetchAll() {
    loading.value = true;
    const { data, error } = await api.get<PaginatedResponse<RecurringExpense>>('/api/v1/recurring-expenses?limit=100');
    loading.value = false;

    if (error) {
      return { success: false, error };
    }

    items.value = data?.data ?? [];
    return { success: true, error: null };
  }

  async function create(payload: CreateRecurringExpensePayload) {
    const { data, error } = await api.post<RecurringExpense>('/api/v1/recurring-expenses', payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      items.value.push(data);
    }
    return { success: true, error: null, data };
  }

  async function update(id: string, payload: UpdateRecurringExpensePayload) {
    const { data, error } = await api.patch<RecurringExpense>(`/api/v1/recurring-expenses/${id}`, payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      const index = items.value.findIndex((r) => r.id === id);
      if (index !== -1) items.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  async function remove(id: string) {
    const { error } = await api.del(`/api/v1/recurring-expenses/${id}`);

    if (error) {
      return { success: false, error };
    }

    items.value = items.value.filter((r) => r.id !== id);
    return { success: true, error: null };
  }

  async function toggleActive(id: string, isActive: boolean) {
    return update(id, { isActive });
  }

  async function generateForPeriod(budgetPeriodId: string) {
    const { data, error } = await api.post<GenerateRecurringExpensesResult>('/api/v1/recurring-expenses/generate', { budgetPeriodId });

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null, data };
  }

  return {
    items,
    loading,
    fetchAll,
    create,
    update,
    remove,
    toggleActive,
    generateForPeriod,
  };
});
