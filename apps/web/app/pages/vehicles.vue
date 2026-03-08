<script setup lang="ts">
import type { Vehicle, VehicleExpense, VehicleExpenseType } from '~/types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  TruckIcon,
  WrenchScrewdriverIcon,
  DocumentDuplicateIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline';

definePageMeta({
  middleware: 'auth',
});

const router = useRouter();
const authStore = useAuthStore();
const vehicleStore = useVehicleStore();

const showVehicleModal = ref(false);
const showExpenseModal = ref(false);
const showDeleteConfirm = ref(false);
const showExpenseHistory = ref(false);
const showDeleteExpenseConfirm = ref(false);
const editingVehicle = ref<Vehicle | null>(null);
const selectedVehicle = ref<Vehicle | null>(null);
const vehicleToDelete = ref<Vehicle | null>(null);
const detailVehicle = ref<Vehicle | null>(null);
const editingExpense = ref<VehicleExpense | null>(null);
const expenseToDelete = ref<{ vehicleId: string; expenseId: string } | null>(null);
const activeTab = ref<'analytics' | 'vehicles'>('analytics');
const loading = ref(false);
const error = ref<string | null>(null);

const vehicleForm = reactive({
  name: '',
  make: '',
  model: '',
  year: null as number | null,
  licensePlate: '',
  notes: '',
});

const expenseForm = reactive({
  type: 'FUEL' as VehicleExpenseType,
  amount: 0,
  description: '',
  date: '',
  odometer: null as number | null,
  fuelLiters: null as number | null,
  fuelPricePerLiter: null as number | null,
  isFullTank: false,
  notes: '',
});

const expenseTypeLabels: Record<VehicleExpenseType, string> = {
  FUEL: 'Fuel',
  MAINTENANCE: 'Maintenance',
  INSURANCE: 'Insurance',
  PARKING: 'Parking',
  TOLL: 'Toll',
  ACCESSORIES: 'Accessories',
  REGISTRATION: 'Registration',
  WASH: 'Car Wash',
  PARTICIPATION_FEE: 'Participation Fee',
  OTHER: 'Other',
};

const expenseTypeColors: Record<VehicleExpenseType, string> = {
  FUEL: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  MAINTENANCE: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  INSURANCE: 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  PARKING: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  TOLL: 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  ACCESSORIES: 'bg-pink-50 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  REGISTRATION: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  WASH: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
  PARTICIPATION_FEE: 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  OTHER: 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400',
};

onMounted(async () => {
  await Promise.all([
    vehicleStore.fetchVehicles(),
    vehicleStore.fetchSummary(),
    vehicleStore.fetchAnalytics(),
  ]);
});

const currency = computed(() => authStore.user?.settings?.currency || 'USD');

function formatCurrency(amount: number) {
  const currency = authStore.user?.settings?.currency || 'USD';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getVehicleTotal(vehicle: Vehicle) {
  return vehicle.expenses.reduce((sum, e) => sum + e.amount, 0);
}

function resetVehicleForm() {
  vehicleForm.name = '';
  vehicleForm.make = '';
  vehicleForm.model = '';
  vehicleForm.year = null;
  vehicleForm.licensePlate = '';
  vehicleForm.notes = '';
  editingVehicle.value = null;
  error.value = null;
}

function resetExpenseForm() {
  expenseForm.type = 'FUEL';
  expenseForm.amount = 0;
  expenseForm.description = '';
  expenseForm.date = '';
  expenseForm.odometer = null;
  expenseForm.fuelLiters = null;
  expenseForm.fuelPricePerLiter = null;
  expenseForm.isFullTank = false;
  expenseForm.notes = '';
  editingExpense.value = null;
  error.value = null;
}

function openCreateVehicle() {
  resetVehicleForm();
  showVehicleModal.value = true;
}

function openEditVehicle(vehicle: Vehicle) {
  editingVehicle.value = vehicle;
  vehicleForm.name = vehicle.name;
  vehicleForm.make = vehicle.make || '';
  vehicleForm.model = vehicle.model || '';
  vehicleForm.year = vehicle.year;
  vehicleForm.licensePlate = vehicle.licensePlate || '';
  vehicleForm.notes = vehicle.notes || '';
  showVehicleModal.value = true;
}

function openAddExpense(vehicle: Vehicle) {
  selectedVehicle.value = vehicle;
  resetExpenseForm();
  showExpenseModal.value = true;
}

function openEditExpense(vehicle: Vehicle, expense: VehicleExpense) {
  selectedVehicle.value = vehicle;
  editingExpense.value = expense;
  expenseForm.type = expense.type;
  expenseForm.amount = expense.amount;
  expenseForm.description = expense.description || '';
  expenseForm.date = expense.date ? expense.date.split('T')[0] : '';
  expenseForm.odometer = expense.odometer;
  expenseForm.fuelLiters = expense.fuelLiters;
  expenseForm.fuelPricePerLiter = expense.fuelPricePerLiter;
  expenseForm.isFullTank = expense.isFullTank ?? false;
  expenseForm.notes = expense.notes || '';
  showExpenseModal.value = true;
}

function duplicateExpense(vehicle: Vehicle, expense: VehicleExpense) {
  selectedVehicle.value = vehicle;
  editingExpense.value = null;
  expenseForm.type = expense.type;
  expenseForm.amount = expense.amount;
  expenseForm.description = expense.description || '';
  expenseForm.date = new Date().toISOString().split('T')[0];
  expenseForm.odometer = expense.odometer;
  expenseForm.fuelLiters = expense.fuelLiters;
  expenseForm.fuelPricePerLiter = expense.fuelPricePerLiter;
  expenseForm.isFullTank = expense.isFullTank ?? false;
  expenseForm.notes = expense.notes || '';
  error.value = null;
  showExpenseModal.value = true;
}

function confirmDeleteVehicle(vehicle: Vehicle) {
  vehicleToDelete.value = vehicle;
  showDeleteConfirm.value = true;
}

function confirmDeleteExpense(vehicleId: string, expenseId: string) {
  expenseToDelete.value = { vehicleId, expenseId };
  showDeleteExpenseConfirm.value = true;
}

async function openExpenseHistory(vehicle: Vehicle) {
  const { data } = await vehicleStore.fetchVehicle(vehicle.id);
  if (data) {
    detailVehicle.value = data;
    showExpenseHistory.value = true;
  }
}

async function handleVehicleSubmit() {
  error.value = null;
  loading.value = true;

  const payload = {
    name: vehicleForm.name,
    make: vehicleForm.make || undefined,
    model: vehicleForm.model || undefined,
    year: vehicleForm.year || undefined,
    licensePlate: vehicleForm.licensePlate || undefined,
    notes: vehicleForm.notes || undefined,
  };

  const result = editingVehicle.value
    ? await vehicleStore.updateVehicle(editingVehicle.value.id, payload)
    : await vehicleStore.createVehicle(payload);

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string' ? result.error.message : result.error.message[0];
    return;
  }

  showVehicleModal.value = false;
  resetVehicleForm();
  vehicleStore.fetchSummary();
}

async function handleExpenseSubmit() {
  if (!selectedVehicle.value) return;
  error.value = null;
  loading.value = true;

  const payload = {
    type: expenseForm.type,
    amount: expenseForm.amount,
    description: expenseForm.description || undefined,
    date: expenseForm.date || undefined,
    odometer: expenseForm.type !== 'PARTICIPATION_FEE' ? (expenseForm.odometer || undefined) : undefined,
    fuelLiters: expenseForm.type === 'FUEL' ? (expenseForm.fuelLiters || undefined) : undefined,
    fuelPricePerLiter: expenseForm.type === 'FUEL' ? (expenseForm.fuelPricePerLiter || undefined) : undefined,
    isFullTank: expenseForm.type === 'FUEL' ? expenseForm.isFullTank : undefined,
    notes: expenseForm.notes || undefined,
  };

  const result = editingExpense.value
    ? await vehicleStore.updateExpense(selectedVehicle.value.id, editingExpense.value.id, payload)
    : await vehicleStore.addExpense(selectedVehicle.value.id, payload);

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string' ? result.error.message : result.error.message[0];
    return;
  }

  showExpenseModal.value = false;
  resetExpenseForm();
  vehicleStore.fetchSummary();
  vehicleStore.fetchAnalytics();
}

async function handleDeleteVehicle() {
  if (!vehicleToDelete.value) return;
  loading.value = true;
  const result = await vehicleStore.deleteVehicle(vehicleToDelete.value.id);
  loading.value = false;

  if (result.success) {
    showDeleteConfirm.value = false;
    vehicleToDelete.value = null;
    vehicleStore.fetchSummary();
    vehicleStore.fetchAnalytics();
  }
}

async function handleDeleteExpense() {
  if (!expenseToDelete.value) return;
  loading.value = true;
  const result = await vehicleStore.deleteExpense(
    expenseToDelete.value.vehicleId,
    expenseToDelete.value.expenseId,
  );
  loading.value = false;

  if (result.success) {
    showDeleteExpenseConfirm.value = false;
    expenseToDelete.value = null;
    if (detailVehicle.value && result.data) {
      detailVehicle.value = result.data;
    }
    vehicleStore.fetchSummary();
    vehicleStore.fetchAnalytics();
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <button
          class="p-2 text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
          @click="router.back()"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Vehicles</h1>
          <p class="text-sm text-secondary-500 dark:text-secondary-400">Track your car and vehicle expenses</p>
        </div>
      </div>
      <button
        v-if="activeTab === 'vehicles'"
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
        @click="openCreateVehicle"
      >
        <PlusIcon class="w-5 h-5" />
        <span class="hidden sm:inline">Add Vehicle</span>
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-1 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg mb-8 w-fit">
      <button
        class="px-4 py-2 text-sm font-medium rounded-md transition-all"
        :class="activeTab === 'analytics'
          ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-sm'
          : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200'"
        @click="activeTab = 'analytics'"
      >
        <ChartBarIcon class="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
        Analytics
      </button>
      <button
        class="px-4 py-2 text-sm font-medium rounded-md transition-all"
        :class="activeTab === 'vehicles'
          ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-sm'
          : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200'"
        @click="activeTab = 'vehicles'"
      >
        <TruckIcon class="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
        Vehicles
      </button>
    </div>

    <!-- Analytics Tab -->
    <div v-if="activeTab === 'analytics'">
      <!-- No data state -->
      <div v-if="!vehicleStore.summary || vehicleStore.summary.totalExpenses === 0" class="text-center py-16">
        <div class="w-16 h-16 bg-secondary-50 dark:bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <ChartBarIcon class="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
        </div>
        <p class="text-secondary-500 dark:text-secondary-400 mb-2">No analytics data yet.</p>
        <p class="text-sm text-secondary-400 dark:text-secondary-500">Add vehicles and expenses to see your analytics here.</p>
        <button
          class="mt-4 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium"
          @click="activeTab = 'vehicles'"
        >
          Go to Vehicles
        </button>
      </div>

      <template v-else>
        <!-- Summary Cards -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
            <p class="text-sm text-secondary-500 dark:text-secondary-400">Vehicles</p>
            <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">{{ vehicleStore.summary.totalVehicles }}</p>
          </div>
          <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
            <p class="text-sm text-secondary-500 dark:text-secondary-400">Total Spent</p>
            <p class="text-2xl font-bold text-danger-600 dark:text-danger-400 mt-1">{{ formatCurrency(vehicleStore.summary.totalSpent) }}</p>
          </div>
          <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
            <p class="text-sm text-secondary-500 dark:text-secondary-400">Total Expenses</p>
            <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">{{ vehicleStore.summary.totalExpenses }}</p>
          </div>
          <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
            <p class="text-sm text-secondary-500 dark:text-secondary-400">Top Category</p>
            <p class="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">
              {{ vehicleStore.summary.byType && Object.keys(vehicleStore.summary.byType).length > 0
                ? expenseTypeLabels[Object.entries(vehicleStore.summary.byType).sort((a, b) => b[1].total - a[1].total)[0][0] as VehicleExpenseType] || 'N/A'
                : 'N/A'
              }}
            </p>
          </div>
        </div>

        <!-- Fuel Stats Cards -->
        <div v-if="vehicleStore.analytics?.fuelStats?.totalFills > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
            <p class="text-xs text-secondary-500 dark:text-secondary-400">Total Fills</p>
            <p class="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{{ vehicleStore.analytics!.fuelStats.totalFills }}</p>
          </div>
          <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
            <p class="text-xs text-secondary-500 dark:text-secondary-400">Avg Cost/Fill</p>
            <p class="text-xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">{{ formatCurrency(vehicleStore.analytics!.fuelStats.avgCostPerFill) }}</p>
          </div>
          <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
            <p class="text-xs text-secondary-500 dark:text-secondary-400">Total Liters</p>
            <p class="text-xl font-bold text-primary-600 dark:text-primary-400 mt-1">{{ vehicleStore.analytics!.fuelStats.totalLiters.toLocaleString() }} L</p>
          </div>
          <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
            <p class="text-xs text-secondary-500 dark:text-secondary-400">Avg Price/Liter</p>
            <p class="text-xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">{{ formatCurrency(vehicleStore.analytics!.fuelStats.avgPricePerLiter) }}</p>
          </div>
        </div>

        <!-- Charts Grid -->
        <div v-if="vehicleStore.analytics" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Monthly Spending -->
          <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-5">
            <h3 class="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Monthly Spending</h3>
            <ClientOnly>
              <ChartsVehicleMonthlySpendingChart :data="vehicleStore.analytics.monthlySpending" :currency="currency" />
              <template #fallback>
                <div class="h-64 flex items-center justify-center">
                  <div class="w-6 h-6 border-2 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Spending by Type -->
          <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-5">
            <h3 class="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Spending by Type</h3>
            <ClientOnly>
              <ChartsVehicleSpendingByTypeChart :data="vehicleStore.analytics.byType" :currency="currency" />
              <template #fallback>
                <div class="h-72 flex items-center justify-center">
                  <div class="w-6 h-6 border-2 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Fuel Consumption -->
          <div v-if="vehicleStore.analytics.fuelConsumption.length > 0" class="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-5">
            <h3 class="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Fuel Consumption</h3>
            <ClientOnly>
              <ChartsFuelConsumptionChart :data="vehicleStore.analytics.fuelConsumption" :currency="currency" />
              <template #fallback>
                <div class="h-72 flex items-center justify-center">
                  <div class="w-6 h-6 border-2 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>

        <!-- Analytics Loading -->
        <div v-else class="flex justify-center py-8">
          <div class="w-6 h-6 border-2 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </template>
    </div>

    <!-- Vehicles Tab -->
    <div v-if="activeTab === 'vehicles'">
      <!-- Loading -->
      <div v-if="vehicleStore.loading" class="flex justify-center py-16">
        <div class="w-8 h-8 border-2 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
      </div>

      <!-- Empty State -->
      <div v-else-if="vehicleStore.vehicles.length === 0" class="text-center py-16">
        <div class="w-16 h-16 bg-secondary-50 dark:bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <TruckIcon class="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
        </div>
        <p class="text-secondary-500 dark:text-secondary-400 mb-4">No vehicles added yet.</p>
        <button
          class="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium"
          @click="openCreateVehicle"
        >
          Add Your First Vehicle
        </button>
      </div>

      <!-- Vehicles List -->
      <div v-else class="space-y-6">
        <div
          v-for="vehicle in vehicleStore.vehicles"
          :key="vehicle.id"
        class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 hover:shadow-card transition-all overflow-hidden"
      >
        <div class="p-5">
          <!-- Vehicle Header -->
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <TruckIcon class="w-5 h-5 text-primary-500" />
                <h3 class="font-semibold text-secondary-900 dark:text-secondary-100">{{ vehicle.name }}</h3>
              </div>
              <div class="flex items-center gap-3 mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                <span v-if="vehicle.make || vehicle.model">
                  {{ [vehicle.make, vehicle.model].filter(Boolean).join(' ') }}
                </span>
                <span v-if="vehicle.year">{{ vehicle.year }}</span>
                <span v-if="vehicle.licensePlate" class="font-mono">{{ vehicle.licensePlate }}</span>
              </div>
              <p v-if="vehicle.notes" class="text-sm text-secondary-400 dark:text-secondary-500 mt-1">{{ vehicle.notes }}</p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button
                class="p-2 text-secondary-400 hover:text-success-600 dark:hover:text-success-400 hover:bg-success-50 dark:hover:bg-success-900/50 rounded-lg transition-colors"
                title="Add expense"
                @click="openAddExpense(vehicle)"
              >
                <PlusIcon class="w-4 h-4" />
              </button>
              <button
                class="p-2 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                title="Edit vehicle"
                @click="openEditVehicle(vehicle)"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <button
                class="p-2 text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
                title="Delete vehicle"
                @click="confirmDeleteVehicle(vehicle)"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Recent Expenses -->
          <div v-if="vehicle.expenses.length > 0" class="space-y-2 mb-3">
            <div
              v-for="expense in vehicle.expenses.slice(0, 3)"
              :key="expense.id"
              class="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg"
            >
              <div class="flex items-center gap-3 min-w-0">
                <span :class="expenseTypeColors[expense.type]" class="px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap">
                  {{ expenseTypeLabels[expense.type] }}
                </span>
                <span v-if="expense.type === 'FUEL' && expense.isFullTank" class="px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                  Full Tank
                </span>
                <div class="min-w-0">
                  <span v-if="expense.description" class="text-sm text-secondary-700 dark:text-secondary-300 truncate block">{{ expense.description }}</span>
                  <span class="text-xs text-secondary-400 dark:text-secondary-500">{{ formatDate(expense.date) }}</span>
                  <span v-if="expense.fuelLiters" class="text-xs text-secondary-400 dark:text-secondary-500 ml-2">{{ expense.fuelLiters }}L</span>
                  <span v-if="expense.odometer" class="text-xs text-secondary-400 dark:text-secondary-500 ml-2">{{ expense.odometer.toLocaleString() }} km</span>
                </div>
              </div>
              <div class="flex items-center gap-2 flex-shrink-0">
                <span class="font-medium text-secondary-900 dark:text-secondary-100">{{ formatCurrency(expense.amount) }}</span>
                <button
                  class="p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 rounded transition-colors"
                  title="Duplicate expense"
                  @click="duplicateExpense(vehicle, expense)"
                >
                  <DocumentDuplicateIcon class="w-3.5 h-3.5" />
                </button>
                <button
                  class="p-1 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 rounded transition-colors"
                  title="Edit expense"
                  @click="openEditExpense(vehicle, expense)"
                >
                  <PencilIcon class="w-3.5 h-3.5" />
                </button>
                <button
                  class="p-1 text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 rounded transition-colors"
                  title="Delete expense"
                  @click="confirmDeleteExpense(vehicle.id, expense.id)"
                >
                  <TrashIcon class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
          <div v-else class="p-4 text-center text-sm text-secondary-400 dark:text-secondary-500 bg-secondary-50 dark:bg-secondary-900 rounded-lg mb-3">
            No expenses recorded yet
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between text-sm pt-2 border-t border-secondary-100 dark:border-secondary-700">
            <span class="text-secondary-500 dark:text-secondary-400">
              {{ vehicle._count.expenses }} expense{{ vehicle._count.expenses !== 1 ? 's' : '' }}
            </span>
            <div class="flex items-center gap-4">
              <button
                v-if="vehicle._count.expenses > 3"
                class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                @click="openExpenseHistory(vehicle)"
              >
                View all expenses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <!-- Create/Edit Vehicle Modal -->
    <div v-if="showVehicleModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showVehicleModal = false">
      <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          {{ editingVehicle ? 'Edit Vehicle' : 'Add Vehicle' }}
        </h3>

        <div v-if="error" class="mb-4 p-3 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg text-sm text-danger-700 dark:text-danger-300">
          {{ error }}
        </div>

        <form class="space-y-4" @submit.prevent="handleVehicleSubmit">
          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Vehicle Name</label>
            <input v-model="vehicleForm.name" type="text" required placeholder="e.g., My Toyota Camry" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Make <span class="text-secondary-400">(optional)</span></label>
              <input v-model="vehicleForm.make" type="text" placeholder="e.g., Toyota" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Model <span class="text-secondary-400">(optional)</span></label>
              <input v-model="vehicleForm.model" type="text" placeholder="e.g., Camry" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Year <span class="text-secondary-400">(optional)</span></label>
              <input v-model.number="vehicleForm.year" type="number" min="1900" max="2030" placeholder="e.g., 2022" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">License Plate <span class="text-secondary-400">(optional)</span></label>
              <input v-model="vehicleForm.licensePlate" type="text" placeholder="e.g., ABC 1234" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Notes <span class="text-secondary-400">(optional)</span></label>
            <input v-model="vehicleForm.notes" type="text" placeholder="Any additional notes" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 px-4 py-2 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors" @click="showVehicleModal = false">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium disabled:opacity-50">
              {{ loading ? 'Saving...' : (editingVehicle ? 'Update' : 'Add Vehicle') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Expense Modal -->
    <div v-if="showExpenseModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showExpenseModal = false">
      <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
          {{ editingExpense ? 'Edit Expense' : 'Add Expense' }}
        </h3>
        <p class="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
          {{ selectedVehicle?.name }}
        </p>

        <div v-if="error" class="mb-4 p-3 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg text-sm text-danger-700 dark:text-danger-300">
          {{ error }}
        </div>

        <form class="space-y-4" @submit.prevent="handleExpenseSubmit">
          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Type</label>
            <select v-model="expenseForm.type" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option v-for="(label, key) in expenseTypeLabels" :key="key" :value="key">{{ label }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Amount</label>
              <input v-model.number="expenseForm.amount" type="number" min="0.01" step="0.01" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Date</label>
              <input v-model="expenseForm.date" type="date" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Description <span class="text-secondary-400">(optional)</span></label>
            <input v-model="expenseForm.description" type="text" placeholder="e.g., Shell station refuel" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <!-- Fuel-specific fields -->
          <div v-if="expenseForm.type === 'FUEL'" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Liters <span class="text-secondary-400">(optional)</span></label>
                <input v-model.number="expenseForm.fuelLiters" type="number" min="0" step="0.01" placeholder="e.g., 45.5" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
              <div>
                <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Price/Liter <span class="text-secondary-400">(optional)</span></label>
                <input v-model.number="expenseForm.fuelPricePerLiter" type="number" min="0" step="0.01" placeholder="e.g., 1.85" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
              </div>
            </div>

            <!-- Full Tank Toggle -->
            <div class="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
              <span class="text-sm font-medium text-secondary-700 dark:text-secondary-300">Full Tank</span>
              <button
                type="button"
                :class="expenseForm.isFullTank ? 'bg-primary-500' : 'bg-secondary-300 dark:bg-secondary-600'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-secondary-800"
                @click="expenseForm.isFullTank = !expenseForm.isFullTank"
              >
                <span
                  :class="expenseForm.isFullTank ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                />
              </button>
            </div>
          </div>

          <!-- Odometer (hidden for Participation Fee) -->
          <div v-if="expenseForm.type !== 'PARTICIPATION_FEE'">
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Odometer <span class="text-secondary-400">(optional, km)</span></label>
            <input v-model.number="expenseForm.odometer" type="number" min="0" step="1" placeholder="e.g., 55000" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Notes <span class="text-secondary-400">(optional)</span></label>
            <input v-model="expenseForm.notes" type="text" placeholder="Additional notes" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 px-4 py-2 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors" @click="showExpenseModal = false">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium disabled:opacity-50">
              {{ loading ? 'Saving...' : (editingExpense ? 'Update' : 'Add Expense') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Expense History Modal -->
    <div v-if="showExpenseHistory && detailVehicle" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showExpenseHistory = false">
      <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div class="p-6 pb-4 border-b border-secondary-100 dark:border-secondary-700">
          <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">{{ detailVehicle.name }} - All Expenses</h3>
          <p class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            {{ detailVehicle._count.expenses }} total expenses
          </p>
        </div>
        <div class="flex-1 overflow-y-auto p-6 pt-4">
          <div v-if="detailVehicle.expenses.length === 0" class="text-center py-8 text-secondary-500 dark:text-secondary-400">
            No expenses yet
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="e in detailVehicle.expenses"
              :key="e.id"
              class="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg"
            >
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span :class="expenseTypeColors[e.type]" class="px-2 py-0.5 text-xs font-medium rounded-full">
                    {{ expenseTypeLabels[e.type] }}
                  </span>
                  <span v-if="e.type === 'FUEL' && e.isFullTank" class="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                    Full Tank
                  </span>
                  <span class="font-medium text-secondary-900 dark:text-secondary-100">{{ formatCurrency(e.amount) }}</span>
                </div>
                <p v-if="e.description" class="text-sm text-secondary-500 dark:text-secondary-400 truncate">{{ e.description }}</p>
                <div class="flex items-center gap-3 text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">
                  <span>{{ formatDate(e.date) }}</span>
                  <span v-if="e.fuelLiters">{{ e.fuelLiters }}L</span>
                  <span v-if="e.odometer">{{ e.odometer.toLocaleString() }} km</span>
                </div>
              </div>
              <div class="flex items-center gap-1 flex-shrink-0 ml-2">
                <button
                  class="p-1.5 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                  title="Edit expense"
                  @click="openEditExpense(detailVehicle!, e); showExpenseHistory = false"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  class="p-1.5 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
                  title="Duplicate expense"
                  @click="duplicateExpense(detailVehicle!, e); showExpenseHistory = false"
                >
                  <DocumentDuplicateIcon class="w-4 h-4" />
                </button>
                <button
                  class="p-1.5 text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
                  title="Remove expense"
                  @click="confirmDeleteExpense(detailVehicle!.id, e.id)"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-secondary-100 dark:border-secondary-700">
          <button
            class="w-full px-4 py-2 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
            @click="showExpenseHistory = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Vehicle Confirm Modal -->
    <UiConfirmModal
      :show="showDeleteConfirm"
      title="Delete Vehicle"
      :message="`Are you sure you want to delete '${vehicleToDelete?.name}'? This will also remove all its expense records.`"
      confirm-text="Delete"
      :loading="loading"
      @confirm="handleDeleteVehicle"
      @cancel="showDeleteConfirm = false"
    />

    <!-- Delete Expense Confirm Modal -->
    <UiConfirmModal
      :show="showDeleteExpenseConfirm"
      title="Delete Expense"
      message="Are you sure you want to delete this expense?"
      confirm-text="Delete"
      :loading="loading"
      @confirm="handleDeleteExpense"
      @cancel="showDeleteExpenseConfirm = false"
    />
  </div>
</template>
