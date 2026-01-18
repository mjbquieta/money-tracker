import { defineStore } from 'pinia';
import type { BudgetPeriod, CreateBudgetPeriodPayload, BudgetSummary, YearlyMetrics, OverallMetrics, YearRangeMetrics, Income, CreateIncomePayload, UpdateIncomePayload } from '~/types';

export const useBudgetStore = defineStore('budget', () => {
  const budgetPeriods = ref<BudgetPeriod[]>([]);
  const currentPeriod = ref<BudgetPeriod | null>(null);
  const currentSummary = ref<BudgetSummary | null>(null);
  const yearlyMetrics = ref<YearlyMetrics | null>(null);
  const overallMetrics = ref<OverallMetrics | null>(null);
  const yearRangeMetrics = ref<YearRangeMetrics | null>(null);
  const loading = ref(false);
  const api = useApi();

  async function fetchBudgetPeriods() {
    loading.value = true;
    const { data, error } = await api.get<BudgetPeriod[]>('/api/v1/budget-periods');
    loading.value = false;

    if (error) {
      return { success: false, error };
    }

    budgetPeriods.value = data ?? [];
    return { success: true, error: null };
  }

  async function fetchBudgetPeriod(id: string) {
    loading.value = true;
    const { data, error } = await api.get<BudgetPeriod>(`/api/v1/budget-periods/${id}`);
    loading.value = false;

    if (error) {
      return { success: false, error };
    }

    currentPeriod.value = data;
    return { success: true, error: null };
  }

  async function fetchBudgetSummary(id: string) {
    const { data, error } = await api.get<BudgetSummary>(`/api/v1/budget-periods/${id}/summary`);

    if (error) {
      return { success: false, error };
    }

    currentSummary.value = data;
    return { success: true, error: null };
  }

  async function createBudgetPeriod(payload: CreateBudgetPeriodPayload) {
    const { data, error } = await api.post<BudgetPeriod>('/api/v1/budget-periods', payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      budgetPeriods.value.unshift(data);
    }
    return { success: true, error: null, data };
  }

  async function updateBudgetPeriod(id: string, payload: Partial<CreateBudgetPeriodPayload>) {
    const { data, error } = await api.patch<BudgetPeriod>(`/api/v1/budget-periods/${id}`, payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      const index = budgetPeriods.value.findIndex((p) => p.id === id);
      if (index !== -1) {
        budgetPeriods.value[index] = data;
      }
      if (currentPeriod.value?.id === id) {
        currentPeriod.value = data;
      }
    }
    return { success: true, error: null };
  }

  async function deleteBudgetPeriod(id: string) {
    const { error } = await api.del(`/api/v1/budget-periods/${id}`);

    if (error) {
      return { success: false, error };
    }

    budgetPeriods.value = budgetPeriods.value.filter((p) => p.id !== id);
    if (currentPeriod.value?.id === id) {
      currentPeriod.value = null;
    }
    return { success: true, error: null };
  }

  async function duplicateBudgetPeriod(
    id: string,
    payload: { name?: string; startDate: string; endDate: string; income?: number }
  ) {
    const { data, error } = await api.post<BudgetPeriod>(`/api/v1/budget-periods/${id}/duplicate`, payload);

    if (error) {
      return { success: false, error };
    }

    if (data) {
      budgetPeriods.value.unshift(data);
    }
    return { success: true, error: null, data };
  }

  async function fetchYearlyMetrics(year?: number) {
    const targetYear = year ?? new Date().getFullYear();
    const { data, error } = await api.get<YearlyMetrics>(`/api/v1/budget-periods/metrics/yearly?year=${targetYear}`);

    if (error) {
      return { success: false, error };
    }

    yearlyMetrics.value = data;
    return { success: true, error: null };
  }

  async function fetchOverallMetrics() {
    const { data, error } = await api.get<OverallMetrics>('/api/v1/budget-periods/metrics/overall');

    if (error) {
      return { success: false, error };
    }

    overallMetrics.value = data;
    return { success: true, error: null };
  }

  async function fetchYearRangeMetrics(startYear?: number, endYear?: number) {
    const currentYear = new Date().getFullYear();
    const start = startYear ?? currentYear - 1;
    const end = endYear ?? currentYear;
    const { data, error } = await api.get<YearRangeMetrics>(`/api/v1/budget-periods/metrics/year-range?startYear=${start}&endYear=${end}`);

    if (error) {
      return { success: false, error };
    }

    yearRangeMetrics.value = data;
    return { success: true, error: null };
  }

  async function createIncome(payload: CreateIncomePayload) {
    const { data, error } = await api.post<Income>('/api/v1/incomes', payload);

    if (error) {
      return { success: false, error };
    }

    if (data && currentPeriod.value?.id === payload.budgetPeriodId) {
      currentPeriod.value.incomes.push(data);
      currentPeriod.value.income += data.amount;
    }
    return { success: true, error: null, data };
  }

  async function updateIncome(id: string, payload: UpdateIncomePayload) {
    const { data, error } = await api.patch<Income>(`/api/v1/incomes/${id}`, payload);

    if (error) {
      return { success: false, error };
    }

    if (data && currentPeriod.value) {
      const index = currentPeriod.value.incomes.findIndex((i) => i.id === id);
      if (index !== -1) {
        const oldAmount = currentPeriod.value.incomes[index].amount;
        currentPeriod.value.incomes[index] = data;
        currentPeriod.value.income = currentPeriod.value.income - oldAmount + data.amount;
      }
    }
    return { success: true, error: null, data };
  }

  async function deleteIncome(id: string) {
    const { error } = await api.del(`/api/v1/incomes/${id}`);

    if (error) {
      return { success: false, error };
    }

    if (currentPeriod.value) {
      const income = currentPeriod.value.incomes.find((i) => i.id === id);
      if (income) {
        currentPeriod.value.income -= income.amount;
        currentPeriod.value.incomes = currentPeriod.value.incomes.filter((i) => i.id !== id);
      }
    }
    return { success: true, error: null };
  }

  return {
    budgetPeriods,
    currentPeriod,
    currentSummary,
    yearlyMetrics,
    overallMetrics,
    yearRangeMetrics,
    loading,
    fetchBudgetPeriods,
    fetchBudgetPeriod,
    fetchBudgetSummary,
    createBudgetPeriod,
    updateBudgetPeriod,
    deleteBudgetPeriod,
    duplicateBudgetPeriod,
    fetchYearlyMetrics,
    fetchOverallMetrics,
    fetchYearRangeMetrics,
    createIncome,
    updateIncome,
    deleteIncome,
  };
});
