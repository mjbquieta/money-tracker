import { defineStore } from 'pinia';
import type {
  ExpenseGroup,
  CreateExpenseGroupPayload,
  UpdateExpenseGroupPayload,
  AddExpensesToGroupPayload,
  MoveExpensesToGroupPayload,
} from '~/types';

export const useExpenseGroupStore = defineStore('expenseGroup', () => {
  const groups = ref<ExpenseGroup[]>([]);
  const loading = ref(false);
  const api = useApi();

  async function fetchGroups(budgetPeriodId: string) {
    loading.value = true;
    const { data, error } = await api.get<ExpenseGroup[]>(
      `/api/v1/expense-groups?budgetPeriodId=${budgetPeriodId}`,
    );
    loading.value = false;

    if (error) {
      return { success: false, error };
    }

    groups.value = data ?? [];
    return { success: true, error: null };
  }

  async function createGroup(payload: CreateExpenseGroupPayload) {
    const { data, error } = await api.post<ExpenseGroup>('/api/v1/expense-groups', payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      groups.value.unshift(data);
    }
    return { success: true, error: null, data };
  }

  async function updateGroup(id: string, payload: UpdateExpenseGroupPayload) {
    const { data, error } = await api.patch<ExpenseGroup>(`/api/v1/expense-groups/${id}`, payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      const index = groups.value.findIndex((g) => g.id === id);
      if (index !== -1) {
        groups.value[index] = data;
      }
    }
    return { success: true, error: null, data };
  }

  async function deleteGroup(id: string) {
    const { error } = await api.del(`/api/v1/expense-groups/${id}`);

    if (error) {
      return { success: false, error };
    }

    groups.value = groups.value.filter((g) => g.id !== id);
    return { success: true, error: null };
  }

  async function addExpensesToGroup(groupId: string, payload: AddExpensesToGroupPayload) {
    const { data, error } = await api.post<ExpenseGroup>(
      `/api/v1/expense-groups/${groupId}/expenses`,
      payload,
    );

    if (error) {
      return { success: false, error };
    }

    if (data) {
      const index = groups.value.findIndex((g) => g.id === groupId);
      if (index !== -1) {
        groups.value[index] = data;
      }
    }
    return { success: true, error: null, data };
  }

  async function moveExpenses(payload: MoveExpensesToGroupPayload) {
    const { data, error } = await api.post<{ success: boolean; movedCount: number }>(
      '/api/v1/expense-groups/move-expenses',
      payload,
    );

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null, data };
  }

  async function removeExpenseFromGroup(expenseId: string) {
    const { data, error } = await api.del(`/api/v1/expense-groups/expenses/${expenseId}`);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null, data };
  }

  function clearGroups() {
    groups.value = [];
  }

  return {
    groups,
    loading,
    fetchGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    addExpensesToGroup,
    moveExpenses,
    removeExpenseFromGroup,
    clearGroups,
  };
});
