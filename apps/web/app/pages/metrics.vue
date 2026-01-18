<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});

const authStore = useAuthStore();
const budgetStore = useBudgetStore();

const selectedYear = ref(new Date().getFullYear());
const loading = ref(true);

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= currentYear - 5; y--) {
    years.push(y);
  }
  return years;
});

const currency = computed(() => authStore.user?.settings?.currency || 'USD');

onMounted(async () => {
  // Double-check auth on mount
  if (!authStore.isAuthenticated) {
    navigateTo('/auth/login', { replace: true });
    return;
  }

  loading.value = true;
  await budgetStore.fetchYearlyMetrics(selectedYear.value);
  loading.value = false;
});

watch(selectedYear, async (newYear) => {
  loading.value = true;
  await budgetStore.fetchYearlyMetrics(newYear);
  loading.value = false;
});

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.value,
  }).format(amount);
}

const metrics = computed(() => budgetStore.yearlyMetrics);

const hasData = computed(() => {
  if (!metrics.value) return false;
  return metrics.value.totalIncome > 0 || metrics.value.totalExpenses > 0;
});
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <NuxtLink
        to="/dashboard"
        class="text-blue-600 hover:text-blue-800 text-sm mb-4 flex items-center gap-1"
      >
        &larr; Back to Dashboard
      </NuxtLink>

      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Financial Metrics</h1>
          <p class="text-gray-500 mt-1">Track your yearly financial performance</p>
        </div>
        <select
          v-model="selectedYear"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
        >
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-500">Loading metrics...</p>
    </div>

    <div v-else-if="!hasData" class="text-center py-12">
      <div class="bg-gray-50 rounded-lg p-8">
        <h3 class="text-lg font-medium text-gray-900 mb-2">No data for {{ selectedYear }}</h3>
        <p class="text-gray-500 mb-4">Create budget periods to see your financial metrics.</p>
        <NuxtLink to="/dashboard">
          <UiBaseButton>Go to Dashboard</UiBaseButton>
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="metrics" class="space-y-8">
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="bg-white shadow rounded-lg p-6">
          <p class="text-sm text-gray-500 mb-1">Total Income</p>
          <p class="text-2xl font-bold text-green-600">{{ formatCurrency(metrics.totalIncome) }}</p>
          <p class="text-xs text-gray-400 mt-1">{{ metrics.budgetPeriodsCount }} budget period{{ metrics.budgetPeriodsCount === 1 ? '' : 's' }}</p>
        </div>
        <div class="bg-white shadow rounded-lg p-6">
          <p class="text-sm text-gray-500 mb-1">Total Expenses</p>
          <p class="text-2xl font-bold text-red-600">{{ formatCurrency(metrics.totalExpenses) }}</p>
        </div>
        <div class="bg-white shadow rounded-lg p-6">
          <p class="text-sm text-gray-500 mb-1">Net Savings</p>
          <p
            class="text-2xl font-bold"
            :class="metrics.savings >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ formatCurrency(metrics.savings) }}
          </p>
        </div>
        <div class="bg-white shadow rounded-lg p-6">
          <p class="text-sm text-gray-500 mb-1">Savings Rate</p>
          <p
            class="text-2xl font-bold"
            :class="metrics.savingsRate >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ metrics.savingsRate.toFixed(1) }}%
          </p>
          <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-300"
              :class="metrics.savingsRate >= 20 ? 'bg-green-500' : metrics.savingsRate >= 0 ? 'bg-yellow-500' : 'bg-red-500'"
              :style="{ width: `${Math.max(0, Math.min(100, metrics.savingsRate))}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Charts Row 1: Monthly Income vs Expenses -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Monthly Income vs Expenses</h2>
        <ClientOnly>
          <ChartsMonthlyBarChart :data="metrics.monthlyBreakdown" :currency="currency" />
          <template #fallback>
            <div class="h-80 flex items-center justify-center bg-gray-50 rounded">
              <p class="text-gray-500">Loading chart...</p>
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Charts Row 2: Savings Trend and Category Breakdown -->
      <div class="grid md:grid-cols-2 gap-6">
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Savings Trend</h2>
          <ClientOnly>
            <ChartsSavingsLineChart :data="metrics.monthlyBreakdown" :currency="currency" />
            <template #fallback>
              <div class="h-80 flex items-center justify-center bg-gray-50 rounded">
                <p class="text-gray-500">Loading chart...</p>
              </div>
            </template>
          </ClientOnly>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h2>
          <ClientOnly>
            <ChartsCategoryPieChart :data="metrics.expensesByCategory" :currency="currency" />
            <template #fallback>
              <div class="h-80 flex items-center justify-center bg-gray-50 rounded">
                <p class="text-gray-500">Loading chart...</p>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>

      <!-- Monthly Breakdown Table -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Monthly Details</h2>
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 text-sm font-medium text-gray-500">Month</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">Income</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">Expenses</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">Net</th>
                <th class="text-right py-3 px-4 text-sm font-medium text-gray-500">Savings Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(month, index) in metrics.monthlyBreakdown"
                :key="index"
                class="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td class="py-3 px-4 text-sm font-medium text-gray-900">
                  {{ ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][index] }}
                </td>
                <td class="py-3 px-4 text-sm text-right text-green-600">
                  {{ formatCurrency(month.income) }}
                </td>
                <td class="py-3 px-4 text-sm text-right text-red-600">
                  {{ formatCurrency(month.expenses) }}
                </td>
                <td
                  class="py-3 px-4 text-sm text-right font-medium"
                  :class="month.income - month.expenses >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatCurrency(month.income - month.expenses) }}
                </td>
                <td class="py-3 px-4 text-sm text-right text-gray-600">
                  {{ month.income > 0 ? (((month.income - month.expenses) / month.income) * 100).toFixed(1) : '0.0' }}%
                </td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50">
              <tr class="font-semibold">
                <td class="py-3 px-4 text-sm text-gray-900">Total</td>
                <td class="py-3 px-4 text-sm text-right text-green-600">{{ formatCurrency(metrics.totalIncome) }}</td>
                <td class="py-3 px-4 text-sm text-right text-red-600">{{ formatCurrency(metrics.totalExpenses) }}</td>
                <td
                  class="py-3 px-4 text-sm text-right"
                  :class="metrics.savings >= 0 ? 'text-green-600' : 'text-red-600'"
                >
                  {{ formatCurrency(metrics.savings) }}
                </td>
                <td class="py-3 px-4 text-sm text-right text-gray-600">{{ metrics.savingsRate.toFixed(1) }}%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Category Breakdown List -->
      <div v-if="Object.keys(metrics.expensesByCategory).length > 0" class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h2>
        <div class="space-y-4">
          <div
            v-for="(data, category) in metrics.expensesByCategory"
            :key="category"
            class="space-y-2"
          >
            <div class="flex justify-between items-center">
              <div>
                <span class="font-medium text-gray-900">{{ category }}</span>
                <span class="text-sm text-gray-500 ml-2">({{ data.count }} expense{{ data.count === 1 ? '' : 's' }})</span>
              </div>
              <div class="text-right">
                <span class="font-medium text-gray-900">{{ formatCurrency(data.total) }}</span>
                <span class="text-sm text-gray-500 ml-2">
                  ({{ ((data.total / metrics.totalExpenses) * 100).toFixed(1) }}%)
                </span>
              </div>
            </div>
            <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-blue-500 transition-all duration-300"
                :style="{ width: `${(data.total / metrics.totalExpenses) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
