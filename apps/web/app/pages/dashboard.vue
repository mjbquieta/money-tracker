<script setup lang="ts">
import {
  PlusIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  CreditCardIcon,
  WalletIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  ClockIcon,
  TrashIcon,
} from '@heroicons/vue/24/outline';
import type { IncomeItem } from '~/types';

definePageMeta({
  middleware: 'auth',
});

const authStore = useAuthStore();
const budgetStore = useBudgetStore();
const router = useRouter();

const showCreateModal = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const createForm = reactive({
  name: '',
  startDate: '',
  endDate: '',
  incomes: [{ name: '', description: '', amount: 0 }] as IncomeItem[],
});

const totalIncome = computed(() =>
  createForm.incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0)
);

function addIncomeSource() {
  createForm.incomes.push({ name: '', description: '', amount: 0 });
}

function removeIncomeSource(index: number) {
  if (createForm.incomes.length > 1) {
    createForm.incomes.splice(index, 1);
  }
}

onMounted(async () => {
  await Promise.all([
    budgetStore.fetchBudgetPeriods(),
    budgetStore.fetchOverallMetrics(),
  ]);
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatCurrency(amount: number) {
  const currency = authStore.user?.settings?.currency || 'USD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

function getPeriodIncome(period: { incomes?: { amount: number }[] }) {
  return period.incomes?.reduce((sum, inc) => sum + inc.amount, 0) || 0;
}

function resetForm() {
  createForm.name = '';
  createForm.startDate = '';
  createForm.endDate = '';
  createForm.incomes = [{ name: '', description: '', amount: 0 }];
}

async function handleCreate() {
  error.value = null;

  // Validate required fields
  if (!createForm.startDate || !createForm.endDate) {
    error.value = 'Please fill in all required fields.';
    return;
  }

  // Filter out empty income sources and validate
  const validIncomes = createForm.incomes.filter(
    (inc) => inc.name.trim() && inc.amount > 0
  );

  if (validIncomes.length === 0) {
    error.value = 'Please add at least one income source with a name and amount.';
    return;
  }

  if (new Date(createForm.startDate) >= new Date(createForm.endDate)) {
    error.value = 'Start date must be before end date.';
    return;
  }

  loading.value = true;

  const result = await budgetStore.createBudgetPeriod({
    name: createForm.name || undefined,
    startDate: createForm.startDate,
    endDate: createForm.endDate,
    incomes: validIncomes,
  });

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  showCreateModal.value = false;
  resetForm();
}

function viewBudgetPeriod(id: string) {
  router.push(`/budget/${id}`);
}

const metrics = computed(() => budgetStore.overallMetrics);
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Welcome Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-secondary-900">
        Welcome back, {{ authStore.user?.name?.split(' ')[0] }}
      </h1>
      <p class="text-secondary-500 mt-1">Here's an overview of your finances</p>
    </div>

    <!-- Quick Stats Cards -->
    <div v-if="metrics" class="mb-10">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-lg font-semibold text-secondary-800 flex items-center gap-2">
          <SparklesIcon class="w-5 h-5 text-accent-500" />
          Overall Summary
        </h2>
        <NuxtLink
          to="/metrics"
          class="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
        >
          <ChartBarIcon class="w-4 h-4" />
          View Detailed Metrics
        </NuxtLink>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Income Card -->
        <div class="bg-white rounded-xl shadow-card p-5 border border-secondary-100">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon class="w-5 h-5 text-success-600" />
            </div>
            <span class="text-sm font-medium text-secondary-500">Total Income</span>
          </div>
          <p class="text-2xl font-bold text-success-600">{{ formatCurrency(metrics.totalIncome) }}</p>
        </div>

        <!-- Total Expenses Card -->
        <div class="bg-white rounded-xl shadow-card p-5 border border-secondary-100">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-danger-50 rounded-lg flex items-center justify-center">
              <ArrowTrendingDownIcon class="w-5 h-5 text-danger-600" />
            </div>
            <span class="text-sm font-medium text-secondary-500">Total Expenses</span>
          </div>
          <p class="text-2xl font-bold text-danger-600">{{ formatCurrency(metrics.totalExpenses) }}</p>
        </div>

        <!-- Net Savings Card -->
        <div class="bg-white rounded-xl shadow-card p-5 border border-secondary-100">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <WalletIcon class="w-5 h-5 text-primary-600" />
            </div>
            <span class="text-sm font-medium text-secondary-500">Net Savings</span>
          </div>
          <p
            class="text-2xl font-bold"
            :class="metrics.savings >= 0 ? 'text-primary-600' : 'text-danger-600'"
          >
            {{ formatCurrency(metrics.savings) }}
          </p>
        </div>

        <!-- Savings Rate Card with Link -->
        <NuxtLink
          to="/metrics"
          class="bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl shadow-card p-5 text-white hover:from-primary-600 hover:to-primary-800 transition-all group cursor-pointer"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <ChartBarIcon class="w-5 h-5 text-white" />
            </div>
            <span class="text-sm font-medium text-primary-100">Savings Rate</span>
          </div>
          <p class="text-2xl font-bold">{{ metrics.savingsRate.toFixed(1) }}%</p>
          <p class="text-xs text-primary-200 mt-2 group-hover:text-white transition-colors">
            View charts & analytics
          </p>
        </NuxtLink>
      </div>
    </div>

    <!-- Budget Periods Section -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <h2 class="text-lg font-semibold text-secondary-800 flex items-center gap-2">
          <CalendarDaysIcon class="w-5 h-5 text-primary-500" />
          Budget Periods
        </h2>
        <p class="text-secondary-500 text-sm mt-1">Manage your budget periods and track expenses</p>
      </div>
      <button
        class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
        @click="showCreateModal = true"
      >
        <PlusIcon class="w-5 h-5" />
        New Budget Period
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="budgetStore.loading" class="text-center py-16">
      <div class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-secondary-500">Loading your budget periods...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="budgetStore.budgetPeriods.length === 0" class="text-center py-16">
      <div class="bg-white rounded-2xl shadow-card p-10 max-w-md mx-auto border border-secondary-100">
        <div class="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <BanknotesIcon class="w-8 h-8 text-primary-500" />
        </div>
        <h3 class="text-xl font-semibold text-secondary-900 mb-2">No budget periods yet</h3>
        <p class="text-secondary-500 mb-6">Create your first budget period to start tracking your expenses and savings.</p>
        <button
          class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium mx-auto"
          @click="showCreateModal = true"
        >
          <PlusIcon class="w-5 h-5" />
          Create Your First Budget
        </button>
      </div>
    </div>

    <!-- Budget Period Cards -->
    <div v-else class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="period in budgetStore.budgetPeriods"
        :key="period.id"
        class="bg-white rounded-xl shadow-card border border-secondary-100 p-6 cursor-pointer hover:shadow-card-hover hover:border-primary-200 transition-all group"
        @click="viewBudgetPeriod(period.id)"
      >
        <div class="flex justify-between items-start mb-5">
          <div class="flex-1">
            <h3 class="font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors">
              {{ period.name || `${formatDate(period.startDate)} - ${formatDate(period.endDate)}` }}
            </h3>
            <p v-if="period.name" class="text-sm text-secondary-500 flex items-center gap-1 mt-1">
              <ClockIcon class="w-4 h-4" />
              {{ formatDate(period.startDate) }} - {{ formatDate(period.endDate) }}
            </p>
          </div>
          <div class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors">
            <CalendarDaysIcon class="w-5 h-5 text-primary-600" />
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-secondary-500 flex items-center gap-2">
              <ArrowTrendingUpIcon class="w-4 h-4 text-success-500" />
              Income
            </span>
            <span class="font-semibold text-success-600">{{ formatCurrency(getPeriodIncome(period)) }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-secondary-500 flex items-center gap-2">
              <CreditCardIcon class="w-4 h-4 text-danger-500" />
              Expenses
            </span>
            <span class="font-semibold text-danger-600">
              {{ formatCurrency(period.expenses.reduce((sum, e) => sum + e.amount, 0)) }}
            </span>
          </div>

          <div class="border-t border-secondary-100 pt-3 flex justify-between items-center">
            <span class="text-sm font-medium text-secondary-600">Remaining</span>
            <span
              class="font-bold text-lg"
              :class="getPeriodIncome(period) - period.expenses.reduce((sum, e) => sum + e.amount, 0) >= 0
                ? 'text-primary-600'
                : 'text-danger-600'"
            >
              {{ formatCurrency(getPeriodIncome(period) - period.expenses.reduce((sum, e) => sum + e.amount, 0)) }}
            </span>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-secondary-100 flex items-center justify-between">
          <span class="text-xs text-secondary-400">
            {{ period.expenses.length }} expense{{ period.expenses.length === 1 ? '' : 's' }}
          </span>
          <span class="text-xs text-primary-600 font-medium group-hover:text-primary-700">
            View details →
          </span>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showCreateModal = false"
      >
        <div class="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <CalendarDaysIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900">Create Budget Period</h2>
              <p class="text-sm text-secondary-500">Set up a new budget to track</p>
            </div>
          </div>

          <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

          <form @submit.prevent="handleCreate" class="space-y-5">
            <UiBaseInput
              v-model="createForm.name"
              label="Name (Optional)"
              placeholder="e.g., January 2026"
            />

            <div class="grid grid-cols-2 gap-4">
              <UiBaseInput
                v-model="createForm.startDate"
                label="Start Date"
                type="date"
                required
              />
              <UiBaseInput
                v-model="createForm.endDate"
                label="End Date"
                type="date"
                required
              />
            </div>

            <!-- Income Sources -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-secondary-700">Income Sources</label>
                <button
                  type="button"
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  @click="addIncomeSource"
                >
                  <PlusIcon class="w-4 h-4" />
                  Add Source
                </button>
              </div>

              <div
                v-for="(income, index) in createForm.incomes"
                :key="index"
                class="p-4 bg-secondary-50 rounded-lg space-y-3"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-secondary-600">Income #{{ index + 1 }}</span>
                  <button
                    v-if="createForm.incomes.length > 1"
                    type="button"
                    class="text-danger-500 hover:text-danger-600 p-1"
                    @click="removeIncomeSource(index)"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <UiBaseInput
                    v-model="income.name"
                    placeholder="e.g., Main Job"
                    required
                  />
                  <UiBaseInput
                    v-model="income.amount"
                    type="number"
                    :placeholder="`Amount`"
                    required
                  />
                </div>

                <UiBaseInput
                  v-model="income.description"
                  placeholder="Description (optional)"
                />
              </div>

              <!-- Total Income Display -->
              <div class="flex items-center justify-between p-3 bg-primary-50 rounded-lg">
                <span class="text-sm font-medium text-primary-700">Total Income</span>
                <span class="text-lg font-bold text-primary-700">{{ formatCurrency(totalIncome) }}</span>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
                @click="showCreateModal = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium disabled:opacity-50"
                :disabled="loading"
              >
                <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <PlusIcon v-else class="w-5 h-5" />
                Create Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
