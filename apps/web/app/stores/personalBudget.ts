import { defineStore } from 'pinia';
import type {
  PersonalBudget,
  PersonalBudgetItem,
  CreatePersonalBudgetPayload,
  UpdatePersonalBudgetPayload,
  CreatePersonalBudgetItemPayload,
  UpdatePersonalBudgetItemPayload,
  PersonalBudgetSummary,
} from '~/types';

export const usePersonalBudgetStore = defineStore('personalBudget', () => {
  const personalBudgets = ref<PersonalBudget[]>([]);
  const currentBudget = ref<PersonalBudget | null>(null);
  const currentSummary = ref<PersonalBudgetSummary | null>(null);
  const loading = ref(false);
  const api = useApi();

  async function fetchPersonalBudgets() {
    loading.value = true;
    const { data, error } = await api.get<PersonalBudget[]>('/api/v1/personal-budgets');
    loading.value = false;

    if (error) {
      return { success: false, error };
    }

    personalBudgets.value = data ?? [];
    return { success: true, error: null };
  }

  async function fetchPersonalBudget(id: string) {
    loading.value = true;
    const { data, error } = await api.get<PersonalBudget>(`/api/v1/personal-budgets/${id}`);
    loading.value = false;

    if (error) {
      return { success: false, error };
    }

    currentBudget.value = data;
    return { success: true, error: null };
  }

  async function fetchSummary(id: string) {
    const { data, error } = await api.get<PersonalBudgetSummary>(`/api/v1/personal-budgets/${id}/summary`);

    if (error) {
      return { success: false, error };
    }

    currentSummary.value = data;
    return { success: true, error: null };
  }

  async function createPersonalBudget(payload: CreatePersonalBudgetPayload) {
    const { data, error } = await api.post<PersonalBudget>('/api/v1/personal-budgets', payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      personalBudgets.value.unshift(data);
    }
    return { success: true, error: null, data };
  }

  async function updatePersonalBudget(id: string, payload: UpdatePersonalBudgetPayload) {
    const { data, error } = await api.patch<PersonalBudget>(`/api/v1/personal-budgets/${id}`, payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      const index = personalBudgets.value.findIndex((b) => b.id === id);
      if (index !== -1) {
        personalBudgets.value[index] = data;
      }
      if (currentBudget.value?.id === id) {
        currentBudget.value = data;
      }
    }
    return { success: true, error: null };
  }

  async function deletePersonalBudget(id: string) {
    const { error } = await api.del(`/api/v1/personal-budgets/${id}`);

    if (error) {
      return { success: false, error };
    }

    personalBudgets.value = personalBudgets.value.filter((b) => b.id !== id);
    if (currentBudget.value?.id === id) {
      currentBudget.value = null;
    }
    return { success: true, error: null };
  }

  async function addItem(budgetId: string, payload: CreatePersonalBudgetItemPayload) {
    const { data, error } = await api.post<PersonalBudgetItem>(`/api/v1/personal-budgets/${budgetId}/items`, payload);

    if (error) {
      return { success: false, error };
    }

    if (data && currentBudget.value?.id === budgetId) {
      currentBudget.value.items.unshift(data);
    }
    return { success: true, error: null, data };
  }

  async function updateItem(budgetId: string, itemId: string, payload: UpdatePersonalBudgetItemPayload) {
    const { data, error } = await api.patch<PersonalBudgetItem>(`/api/v1/personal-budgets/${budgetId}/items/${itemId}`, payload);

    if (error) {
      return { success: false, error };
    }

    if (data && currentBudget.value?.id === budgetId) {
      const index = currentBudget.value.items.findIndex((i) => i.id === itemId);
      if (index !== -1) {
        currentBudget.value.items[index] = data;
      }
    }
    return { success: true, error: null, data };
  }

  async function deleteItem(budgetId: string, itemId: string) {
    const { error } = await api.del(`/api/v1/personal-budgets/${budgetId}/items/${itemId}`);

    if (error) {
      return { success: false, error };
    }

    if (currentBudget.value?.id === budgetId) {
      currentBudget.value.items = currentBudget.value.items.filter((i) => i.id !== itemId);
    }
    return { success: true, error: null };
  }

  // Computed total for current budget
  const currentTotal = computed(() => {
    if (!currentBudget.value) return 0;
    return currentBudget.value.items.reduce((sum, item) => sum + item.amount, 0);
  });

  return {
    personalBudgets,
    currentBudget,
    currentSummary,
    currentTotal,
    loading,
    fetchPersonalBudgets,
    fetchPersonalBudget,
    fetchSummary,
    createPersonalBudget,
    updatePersonalBudget,
    deletePersonalBudget,
    addItem,
    updateItem,
    deleteItem,
  };
});
