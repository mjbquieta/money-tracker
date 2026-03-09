import { defineStore } from 'pinia';
import type {
  Vehicle,
  VehicleSummary,
  VehicleAnalytics,
  CreateVehiclePayload,
  UpdateVehiclePayload,
  CreateVehicleExpensePayload,
  UpdateVehicleExpensePayload,
} from '~/types';

export const useVehicleStore = defineStore('vehicle', () => {
  const vehicles = ref<Vehicle[]>([]);
  const summary = ref<VehicleSummary | null>(null);
  const analytics = ref<VehicleAnalytics | null>(null);
  const loading = ref(false);
  const api = useApi();

  async function fetchVehicles() {
    loading.value = true;
    const { data, error } = await api.get<Vehicle[]>('/api/v1/vehicles');
    loading.value = false;

    if (error) return { success: false, error };

    vehicles.value = data ?? [];
    return { success: true, error: null };
  }

  async function fetchSummary() {
    const { data, error } = await api.get<VehicleSummary>('/api/v1/vehicles/summary');
    if (error) return { success: false, error };

    summary.value = data ?? null;
    return { success: true, error: null };
  }

  async function fetchAnalytics() {
    const { data, error } = await api.get<VehicleAnalytics>('/api/v1/vehicles/analytics');
    if (error) return { success: false, error };

    analytics.value = data ?? null;
    return { success: true, error: null };
  }

  async function fetchVehicle(id: string) {
    const { data, error } = await api.get<Vehicle>(`/api/v1/vehicles/${id}`);
    if (error) return { success: false, error, data: null };
    return { success: true, error: null, data };
  }

  async function createVehicle(payload: CreateVehiclePayload) {
    const { data, error } = await api.post<Vehicle>('/api/v1/vehicles', payload);
    if (error) return { success: false, error };

    if (data) vehicles.value.unshift(data);
    return { success: true, error: null, data };
  }

  async function updateVehicle(id: string, payload: UpdateVehiclePayload) {
    const { data, error } = await api.patch<Vehicle>(`/api/v1/vehicles/${id}`, payload);
    if (error) return { success: false, error };

    if (data) {
      const index = vehicles.value.findIndex((v) => v.id === id);
      if (index !== -1) vehicles.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  async function deleteVehicle(id: string) {
    const { error } = await api.del(`/api/v1/vehicles/${id}`);
    if (error) return { success: false, error };

    vehicles.value = vehicles.value.filter((v) => v.id !== id);
    return { success: true, error: null };
  }

  async function addExpense(vehicleId: string, payload: CreateVehicleExpensePayload) {
    const { data, error } = await api.post<Vehicle>(
      `/api/v1/vehicles/${vehicleId}/expenses`,
      payload,
    );
    if (error) return { success: false, error };

    if (data) {
      const index = vehicles.value.findIndex((v) => v.id === vehicleId);
      if (index !== -1) vehicles.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  async function updateExpense(
    vehicleId: string,
    expenseId: string,
    payload: UpdateVehicleExpensePayload,
  ) {
    const { data, error } = await api.patch<Vehicle>(
      `/api/v1/vehicles/${vehicleId}/expenses/${expenseId}`,
      payload,
    );
    if (error) return { success: false, error };

    if (data) {
      const index = vehicles.value.findIndex((v) => v.id === vehicleId);
      if (index !== -1) vehicles.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  async function deleteExpense(vehicleId: string, expenseId: string) {
    const { data, error } = await api.del<Vehicle>(
      `/api/v1/vehicles/${vehicleId}/expenses/${expenseId}`,
    );
    if (error) return { success: false, error };

    if (data) {
      const index = vehicles.value.findIndex((v) => v.id === vehicleId);
      if (index !== -1) vehicles.value[index] = data;
    }
    return { success: true, error: null, data };
  }

  return {
    vehicles,
    summary,
    analytics,
    loading,
    fetchVehicles,
    fetchSummary,
    fetchAnalytics,
    fetchVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    addExpense,
    updateExpense,
    deleteExpense,
  };
});
