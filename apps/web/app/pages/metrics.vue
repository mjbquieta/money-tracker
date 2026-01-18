<script setup lang="ts">
import {
  ArrowLeftIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  WalletIcon,
  CalendarIcon,
  TagIcon,
  TableCellsIcon,
  ChartPieIcon,
  SparklesIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const budgetStore = useBudgetStore();

const currentYear = new Date().getFullYear();
const startYear = ref(currentYear - 1);
const endYear = ref(currentYear);
const loading = ref(true);

const availableYears = computed(() => {
  const years: number[] = [];
  for (let y = currentYear; y >= currentYear - 10; y--) {
    years.push(y);
  }
  return years;
});

const availableEndYears = computed(() => {
  return availableYears.value.filter((y) => y >= startYear.value);
});

const currency = computed(() => authStore.user?.settings?.currency || "USD");

onMounted(async () => {
  loading.value = true;
  await budgetStore.fetchYearRangeMetrics(startYear.value, endYear.value);
  loading.value = false;
});

watch([startYear, endYear], async ([newStart, newEnd]) => {
  if (newEnd < newStart) {
    endYear.value = newStart;
    return;
  }
  loading.value = true;
  await budgetStore.fetchYearRangeMetrics(newStart, newEnd);
  loading.value = false;
});

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.value,
  }).format(amount);
}

const metrics = computed(() => budgetStore.yearRangeMetrics);

const hasData = computed(() => {
  if (!metrics.value) return false;
  return metrics.value.totalIncome > 0 || metrics.value.totalExpenses > 0;
});

const yearRangeLabel = computed(() => {
  if (startYear.value === endYear.value) {
    return String(startYear.value);
  }
  return `${startYear.value} - ${endYear.value}`;
});

const allMonthlyData = computed(() => {
  if (!metrics.value?.yearlyBreakdown) return [];
  const data: Array<{ year: number; month: number; income: number; expenses: number; label: string }> = [];
  for (const yearData of metrics.value.yearlyBreakdown) {
    for (const month of yearData.monthlyBreakdown) {
      data.push({
        year: yearData.year,
        month: month.month,
        income: month.income,
        expenses: month.expenses,
        label: `${monthNames[month.month - 1]} ${yearData.year}`,
      });
    }
  }
  return data;
});

const nonZeroMonthlyData = computed(() => {
  return allMonthlyData.value.filter(
    (m) => m.income > 0 || m.expenses > 0
  );
});

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const categoryColors: Record<string, string> = {
  Bills: "bg-danger-500",
  Food: "bg-warning-500",
  Transport: "bg-primary-500",
  Savings: "bg-success-500",
  Entertainment: "bg-accent-500",
};

function getCategoryBarColor(category: string) {
  return categoryColors[category] || "bg-secondary-500";
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <button
        class="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm mb-4 group"
        @click="navigateTo('/dashboard')"
      >
        <ArrowLeftIcon
          class="w-4 h-4 group-hover:-translate-x-1 transition-transform"
        />
        Back to Dashboard
      </button>

      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1
            class="text-2xl font-bold text-secondary-900 flex items-center gap-2"
          >
            <ChartBarIcon class="w-7 h-7 text-primary-500" />
            Financial Metrics
          </h1>
          <p class="text-secondary-500 mt-1">
            Track your yearly financial performance
          </p>
        </div>
        <div class="flex items-center gap-2">
          <CalendarIcon class="w-5 h-5 text-secondary-400" />
          <select
            v-model="startYear"
            class="px-3 py-2.5 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium text-secondary-700 shadow-card"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
          <span class="text-secondary-400">to</span>
          <select
            v-model="endYear"
            class="px-3 py-2.5 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-medium text-secondary-700 shadow-card"
          >
            <option v-for="year in availableEndYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div
        class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"
      ></div>
      <p class="text-secondary-500">Loading metrics...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasData" class="text-center py-16">
      <div
        class="bg-white rounded-2xl shadow-card p-10 max-w-md mx-auto border border-secondary-100"
      >
        <div
          class="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center mx-auto mb-5"
        >
          <ChartBarIcon class="w-8 h-8 text-secondary-400" />
        </div>
        <h3 class="text-xl font-semibold text-secondary-900 mb-2">
          No data for {{ yearRangeLabel }}
        </h3>
        <p class="text-secondary-500 mb-6">
          Create budget periods to see your financial metrics.
        </p>
        <NuxtLink to="/dashboard">
          <button
            class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium mx-auto"
          >
            Go to Dashboard
          </button>
        </NuxtLink>
      </div>
    </div>

    <div v-else-if="metrics" class="space-y-8">
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Income -->
        <div
          class="bg-white rounded-xl shadow-card border border-secondary-100 p-5"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center"
            >
              <ArrowTrendingUpIcon class="w-5 h-5 text-success-600" />
            </div>
            <span class="text-sm font-medium text-secondary-500"
              >Total Income</span
            >
          </div>
          <p class="text-2xl font-bold text-success-600">
            {{ formatCurrency(metrics.totalIncome) }}
          </p>
          <p class="text-xs text-secondary-400 mt-2">
            {{ metrics.budgetPeriodsCount }} budget period{{
              metrics.budgetPeriodsCount === 1 ? "" : "s"
            }}
          </p>
        </div>

        <!-- Total Expenses -->
        <div
          class="bg-white rounded-xl shadow-card border border-secondary-100 p-5"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-10 h-10 bg-danger-50 rounded-lg flex items-center justify-center"
            >
              <ArrowTrendingDownIcon class="w-5 h-5 text-danger-600" />
            </div>
            <span class="text-sm font-medium text-secondary-500"
              >Total Expenses</span
            >
          </div>
          <p class="text-2xl font-bold text-danger-600">
            {{ formatCurrency(metrics.totalExpenses) }}
          </p>
        </div>

        <!-- Net Savings -->
        <div
          class="bg-white rounded-xl shadow-card border border-secondary-100 p-5"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center"
            >
              <WalletIcon class="w-5 h-5 text-primary-600" />
            </div>
            <span class="text-sm font-medium text-secondary-500"
              >Net Savings</span
            >
          </div>
          <p
            class="text-2xl font-bold"
            :class="
              metrics.savings >= 0 ? 'text-primary-600' : 'text-danger-600'
            "
          >
            {{ formatCurrency(metrics.savings) }}
          </p>
        </div>

        <!-- Savings Rate -->
        <div
          class="bg-white rounded-xl shadow-card border border-secondary-100 p-5"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="
                metrics.savingsRate >= 20
                  ? 'bg-success-50'
                  : metrics.savingsRate >= 0
                    ? 'bg-warning-50'
                    : 'bg-danger-50'
              "
            >
              <SparklesIcon
                class="w-5 h-5"
                :class="
                  metrics.savingsRate >= 20
                    ? 'text-success-600'
                    : metrics.savingsRate >= 0
                      ? 'text-warning-600'
                      : 'text-danger-600'
                "
              />
            </div>
            <span class="text-sm font-medium text-secondary-500"
              >Savings Rate</span
            >
          </div>
          <p
            class="text-2xl font-bold"
            :class="
              metrics.savingsRate >= 20
                ? 'text-success-600'
                : metrics.savingsRate >= 0
                  ? 'text-warning-600'
                  : 'text-danger-600'
            "
          >
            {{ metrics.savingsRate.toFixed(1) }}%
          </p>
          <div class="mt-3 h-2 bg-secondary-100 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-500"
              :class="
                metrics.savingsRate >= 20
                  ? 'bg-success-500'
                  : metrics.savingsRate >= 0
                    ? 'bg-warning-500'
                    : 'bg-danger-500'
              "
              :style="{
                width: `${Math.max(0, Math.min(100, metrics.savingsRate))}%`,
              }"
            />
          </div>
        </div>
      </div>

      <!-- Monthly Income vs Expenses Chart -->
      <div
        class="bg-white rounded-xl shadow-card border border-secondary-100 p-6"
      >
        <h2
          class="text-lg font-semibold text-secondary-800 mb-5 flex items-center gap-2"
        >
          <ChartBarIcon class="w-5 h-5 text-primary-500" />
          Monthly Income vs Expenses
        </h2>
        <ClientOnly>
          <ChartsMonthlyBarChart
            :data="nonZeroMonthlyData"
            :currency="currency"
          />
          <template #fallback>
            <div
              class="h-80 flex items-center justify-center bg-secondary-50 rounded-xl"
            >
              <div
                class="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"
              ></div>
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Savings Trend and Category Breakdown Charts -->
      <div class="grid lg:grid-cols-2 gap-6">
        <div
          class="bg-white rounded-xl shadow-card border border-secondary-100 p-6"
        >
          <h2
            class="text-lg font-semibold text-secondary-800 mb-5 flex items-center gap-2"
          >
            <ArrowTrendingUpIcon class="w-5 h-5 text-primary-500" />
            Savings Trend
          </h2>
          <ClientOnly>
            <ChartsSavingsLineChart
              :data="nonZeroMonthlyData"
              :currency="currency"
            />
            <template #fallback>
              <div
                class="h-80 flex items-center justify-center bg-secondary-50 rounded-xl"
              >
                <div
                  class="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"
                ></div>
              </div>
            </template>
          </ClientOnly>
        </div>

        <div
          class="bg-white rounded-xl shadow-card border border-secondary-100 p-6"
        >
          <h2
            class="text-lg font-semibold text-secondary-800 mb-5 flex items-center gap-2"
          >
            <ChartPieIcon class="w-5 h-5 text-primary-500" />
            Expenses by Category
          </h2>
          <ClientOnly>
            <ChartsCategoryPieChart
              :data="metrics.expensesByCategory"
              :currency="currency"
            />
            <template #fallback>
              <div
                class="h-80 flex items-center justify-center bg-secondary-50 rounded-xl"
              >
                <div
                  class="w-8 h-8 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin"
                ></div>
              </div>
            </template>
          </ClientOnly>
        </div>
      </div>
      <!-- Category Breakdown -->
      <div
        v-if="Object.keys(metrics.expensesByCategory).length > 0"
        class="bg-white rounded-xl shadow-card border border-secondary-100 p-6"
      >
        <h2
          class="text-lg font-semibold text-secondary-800 mb-5 flex items-center gap-2"
        >
          <TagIcon class="w-5 h-5 text-primary-500" />
          Category Breakdown
        </h2>
        <div class="space-y-5">
          <div
            v-for="(data, category) in metrics.expensesByCategory"
            :key="category"
            class="space-y-2"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span class="font-medium text-secondary-900">{{
                  category
                }}</span>
                <span class="text-sm text-secondary-400"
                  >({{ data.count }} expense{{
                    data.count === 1 ? "" : "s"
                  }})</span
                >
              </div>
              <div class="text-right">
                <span class="font-semibold text-secondary-900">{{
                  formatCurrency(data.total)
                }}</span>
                <span class="text-sm text-primary-600 ml-2 font-medium">
                  {{ ((data.total / metrics.totalExpenses) * 100).toFixed(1) }}%
                </span>
              </div>
            </div>
            <div class="h-3 bg-secondary-100 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-500"
                :class="getCategoryBarColor(String(category))"
                :style="{
                  width: `${(data.total / metrics.totalExpenses) * 100}%`,
                }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Monthly Details Table -->
      <div
        class="bg-white rounded-xl shadow-card border border-secondary-100 p-6"
      >
        <h2
          class="text-lg font-semibold text-secondary-800 mb-5 flex items-center gap-2"
        >
          <TableCellsIcon class="w-5 h-5 text-primary-500" />
          Monthly Details
        </h2>
        <div class="overflow-x-auto rounded-xl border border-secondary-100">
          <table class="min-w-full">
            <thead>
              <tr class="bg-secondary-50">
                <th
                  class="text-left py-4 px-5 text-sm font-semibold text-secondary-600"
                >
                  Month
                </th>
                <th
                  class="text-right py-4 px-5 text-sm font-semibold text-secondary-600"
                >
                  Income
                </th>
                <th
                  class="text-right py-4 px-5 text-sm font-semibold text-secondary-600"
                >
                  Expenses
                </th>
                <th
                  class="text-right py-4 px-5 text-sm font-semibold text-secondary-600"
                >
                  Net
                </th>
                <th
                  class="text-right py-4 px-5 text-sm font-semibold text-secondary-600"
                >
                  Savings Rate
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(month, index) in nonZeroMonthlyData"
                :key="index"
                class="border-t border-secondary-100 hover:bg-secondary-50 transition-colors"
              >
                <td class="py-4 px-5 text-sm font-medium text-secondary-900">
                  {{ month.label }}
                </td>
                <td
                  class="py-4 px-5 text-sm text-right text-success-600 font-medium"
                >
                  {{ formatCurrency(month.income) }}
                </td>
                <td
                  class="py-4 px-5 text-sm text-right text-danger-600 font-medium"
                >
                  {{ formatCurrency(month.expenses) }}
                </td>
                <td
                  class="py-4 px-5 text-sm text-right font-semibold"
                  :class="
                    month.income - month.expenses >= 0
                      ? 'text-primary-600'
                      : 'text-danger-600'
                  "
                >
                  {{ formatCurrency(month.income - month.expenses) }}
                </td>
                <td class="py-4 px-5 text-sm text-right text-secondary-600">
                  {{
                    month.income > 0
                      ? (
                          ((month.income - month.expenses) / month.income) *
                          100
                        ).toFixed(1)
                      : "0.0"
                  }}%
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr class="bg-secondary-50 border-t-2 border-secondary-200">
                <td class="py-4 px-5 text-sm font-bold text-secondary-900">
                  Total
                </td>
                <td
                  class="py-4 px-5 text-sm text-right text-success-600 font-bold"
                >
                  {{ formatCurrency(metrics.totalIncome) }}
                </td>
                <td
                  class="py-4 px-5 text-sm text-right text-danger-600 font-bold"
                >
                  {{ formatCurrency(metrics.totalExpenses) }}
                </td>
                <td
                  class="py-4 px-5 text-sm text-right font-bold"
                  :class="
                    metrics.savings >= 0
                      ? 'text-primary-600'
                      : 'text-danger-600'
                  "
                >
                  {{ formatCurrency(metrics.savings) }}
                </td>
                <td
                  class="py-4 px-5 text-sm text-right text-secondary-700 font-bold"
                >
                  {{ metrics.savingsRate.toFixed(1) }}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
