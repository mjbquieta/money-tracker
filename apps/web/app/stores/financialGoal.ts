import { defineStore } from 'pinia';
import type {
  FinancialGoal,
  GoalsSummary,
  CreateFinancialGoalPayload,
  UpdateFinancialGoalPayload,
  CreateGoalContributionPayload,
} from '~/types';

export const useFinancialGoalStore = defineStore('financialGoal', () => {
  const goals = ref<FinancialGoal[]>([]);
  const summary = ref<GoalsSummary | null>(null);
  const loading = ref(false);
  const api = useApi();

  async function fetchGoals() {
    loading.value = true;
    const { data, error } = await api.get<FinancialGoal[]>('/api/v1/financial-goals');
    loading.value = false;

    if (error) {
      return { success: false, error };
    }

    goals.value = data ?? [];
    return { success: true, error: null };
  }

  async function fetchSummary() {
    const { data, error } = await api.get<GoalsSummary>('/api/v1/financial-goals/summary');

    if (error) {
      return { success: false, error };
    }

    summary.value = data ?? null;
    return { success: true, error: null };
  }

  async function fetchGoal(id: string) {
    const { data, error } = await api.get<FinancialGoal>(`/api/v1/financial-goals/${id}`);

    if (error) {
      return { success: false, error, data: null };
    }

    return { success: true, error: null, data };
  }

  async function createGoal(payload: CreateFinancialGoalPayload) {
    const { data, error } = await api.post<FinancialGoal>('/api/v1/financial-goals', payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      goals.value.unshift(data);
    }
    return { success: true, error: null, data };
  }

  async function updateGoal(id: string, payload: UpdateFinancialGoalPayload) {
    const { data, error } = await api.patch<FinancialGoal>(`/api/v1/financial-goals/${id}`, payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      const index = goals.value.findIndex((g) => g.id === id);
      if (index !== -1) goals.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  async function deleteGoal(id: string) {
    const { error } = await api.del(`/api/v1/financial-goals/${id}`);

    if (error) {
      return { success: false, error };
    }

    goals.value = goals.value.filter((g) => g.id !== id);
    return { success: true, error: null };
  }

  async function addContribution(goalId: string, payload: CreateGoalContributionPayload) {
    const { data, error } = await api.post<FinancialGoal>(
      `/api/v1/financial-goals/${goalId}/contributions`,
      payload,
    );

    if (error) {
      return { success: false, error };
    }

    if (data) {
      const index = goals.value.findIndex((g) => g.id === goalId);
      if (index !== -1) goals.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  async function deleteContribution(goalId: string, contributionId: string) {
    const { data, error } = await api.del<FinancialGoal>(
      `/api/v1/financial-goals/${goalId}/contributions/${contributionId}`,
    );

    if (error) {
      return { success: false, error };
    }

    if (data) {
      const index = goals.value.findIndex((g) => g.id === goalId);
      if (index !== -1) goals.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  return {
    goals,
    summary,
    loading,
    fetchGoals,
    fetchSummary,
    fetchGoal,
    createGoal,
    updateGoal,
    deleteGoal,
    addContribution,
    deleteContribution,
  };
});
