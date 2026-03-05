import { defineStore } from 'pinia';
import type {
  Debt,
  DebtSummary,
  CreateDebtPayload,
  UpdateDebtPayload,
  CreateDebtPaymentPayload,
} from '~/types';

export const useDebtStore = defineStore('debt', () => {
  const debts = ref<Debt[]>([]);
  const summary = ref<DebtSummary | null>(null);
  const loading = ref(false);
  const api = useApi();

  async function fetchDebts() {
    loading.value = true;
    const { data, error } = await api.get<Debt[]>('/api/v1/debts');
    loading.value = false;

    if (error) return { success: false, error };

    debts.value = data ?? [];
    return { success: true, error: null };
  }

  async function fetchSummary() {
    const { data, error } = await api.get<DebtSummary>('/api/v1/debts/summary');
    if (error) return { success: false, error };

    summary.value = data ?? null;
    return { success: true, error: null };
  }

  async function fetchDebt(id: string) {
    const { data, error } = await api.get<Debt>(`/api/v1/debts/${id}`);
    if (error) return { success: false, error, data: null };
    return { success: true, error: null, data };
  }

  async function createDebt(payload: CreateDebtPayload) {
    const { data, error } = await api.post<Debt>('/api/v1/debts', payload);
    if (error) return { success: false, error };

    if (data) debts.value.unshift(data);
    return { success: true, error: null, data };
  }

  async function updateDebt(id: string, payload: UpdateDebtPayload) {
    const { data, error } = await api.patch<Debt>(`/api/v1/debts/${id}`, payload);
    if (error) return { success: false, error };

    if (data) {
      const index = debts.value.findIndex((d) => d.id === id);
      if (index !== -1) debts.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  async function deleteDebt(id: string) {
    const { error } = await api.del(`/api/v1/debts/${id}`);
    if (error) return { success: false, error };

    debts.value = debts.value.filter((d) => d.id !== id);
    return { success: true, error: null };
  }

  async function addPayment(debtId: string, payload: CreateDebtPaymentPayload) {
    const { data, error } = await api.post<Debt>(
      `/api/v1/debts/${debtId}/payments`,
      payload,
    );
    if (error) return { success: false, error };

    if (data) {
      const index = debts.value.findIndex((d) => d.id === debtId);
      if (index !== -1) debts.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  async function deletePayment(debtId: string, paymentId: string) {
    const { data, error } = await api.del<Debt>(
      `/api/v1/debts/${debtId}/payments/${paymentId}`,
    );
    if (error) return { success: false, error };

    if (data) {
      const index = debts.value.findIndex((d) => d.id === debtId);
      if (index !== -1) debts.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  return {
    debts,
    summary,
    loading,
    fetchDebts,
    fetchSummary,
    fetchDebt,
    createDebt,
    updateDebt,
    deleteDebt,
    addPayment,
    deletePayment,
  };
});
