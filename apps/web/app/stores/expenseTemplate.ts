import { defineStore } from 'pinia';
import type { ExpenseTemplate, CreateExpenseTemplatePayload, UpdateExpenseTemplatePayload, CreateExpenseFromTemplatePayload, Expense, PaginationMeta } from '~/types';

interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

export const useExpenseTemplateStore = defineStore('expenseTemplate', () => {
  const templates = ref<ExpenseTemplate[]>([]);
  const loading = ref(false);
  const api = useApi();

  async function fetchTemplates() {
    loading.value = true;
    const { data, error } = await api.get<PaginatedResponse<ExpenseTemplate>>('/api/v1/expense-templates?limit=100');
    loading.value = false;

    if (error) {
      return { success: false, error };
    }

    templates.value = data?.data ?? [];
    return { success: true, error: null };
  }

  async function createTemplate(payload: CreateExpenseTemplatePayload) {
    const { data, error } = await api.post<ExpenseTemplate>('/api/v1/expense-templates', payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      templates.value.push(data);
    }
    return { success: true, error: null, data };
  }

  async function updateTemplate(id: string, payload: UpdateExpenseTemplatePayload) {
    const { data, error } = await api.patch<ExpenseTemplate>(`/api/v1/expense-templates/${id}`, payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      const index = templates.value.findIndex((t) => t.id === id);
      if (index !== -1) templates.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  async function deleteTemplate(id: string) {
    const { error } = await api.del(`/api/v1/expense-templates/${id}`);

    if (error) {
      return { success: false, error };
    }

    templates.value = templates.value.filter((t) => t.id !== id);
    return { success: true, error: null };
  }

  async function createExpenseFromTemplate(payload: CreateExpenseFromTemplatePayload) {
    const { data, error } = await api.post<Expense>('/api/v1/expense-templates/create-expense', payload);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null, data };
  }

  return {
    templates,
    loading,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createExpenseFromTemplate,
  };
});
