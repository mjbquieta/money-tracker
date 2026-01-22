<script setup lang="ts">
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  WalletIcon,
  SparklesIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ChartPieIcon,
  CalendarIcon,
  TagIcon,
  RocketLaunchIcon,
  BanknotesIcon,
  ArrowRightIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const budgetStore = useBudgetStore();
const personalBudgetStore = usePersonalBudgetStore();

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
  await Promise.all([
    budgetStore.fetchYearRangeMetrics(startYear.value, endYear.value),
    budgetStore.fetchOverallMetrics(),
    personalBudgetStore.fetchPersonalBudgets(),
  ]);
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
const overallMetrics = computed(() => budgetStore.overallMetrics);

const hasData = computed(() => {
  if (!metrics.value) return false;
  return metrics.value.totalIncome > 0 || metrics.value.totalExpenses > 0;
});

const budgetPeriodsCount = computed(() => {
  return overallMetrics.value?.budgetPeriodsCount || 0;
});

const personalBudgetsCount = computed(() => {
  return personalBudgetStore.personalBudgets.length;
});

const allMonthlyData = computed(() => {
  if (!metrics.value?.yearlyBreakdown) return [];
  const data: Array<{
    year: number;
    month: number;
    income: number;
    expenses: number;
    label: string;
  }> = [];
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
  return allMonthlyData.value.filter((m) => m.income > 0 || m.expenses > 0);
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

const savingsRateStatus = computed(() => {
  if (!metrics.value) return { color: "secondary", bgClass: "bg-secondary-50", iconClass: "text-secondary-600", valueClass: "text-secondary-900", progressClass: "bg-secondary-500" };

  if (metrics.value.savingsRate >= 20) {
    return { color: "success", bgClass: "bg-success-50", iconClass: "text-success-600", valueClass: "text-success-600", progressClass: "bg-success-500" };
  } else if (metrics.value.savingsRate >= 0) {
    return { color: "warning", bgClass: "bg-warning-50", iconClass: "text-warning-600", valueClass: "text-warning-600", progressClass: "bg-warning-500" };
  } else {
    return { color: "danger", bgClass: "bg-danger-50", iconClass: "text-danger-600", valueClass: "text-danger-600", progressClass: "bg-danger-500" };
  }
});

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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
    <!-- Welcome Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
        Welcome back, {{ authStore.user?.name?.split(" ")[0] }}
      </h1>
      <p class="text-secondary-500 dark:text-secondary-400 mt-1">Here's your financial overview</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading && !hasData" class="text-center py-16">
      <div
        class="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin mx-auto mb-4"
      ></div>
      <p class="text-secondary-500 dark:text-secondary-400">Loading your financial data...</p>
    </div>

    <!-- Empty State (First-Time User) -->
    <div v-else-if="!hasData && budgetPeriodsCount === 0" class="py-8">
      <div
        class="bg-white dark:bg-secondary-800 rounded-2xl shadow-card border border-secondary-100 dark:border-secondary-700 p-8 md:p-12 max-w-2xl mx-auto text-center"
      >
        <div
          class="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/50 dark:to-primary-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6"
        >
          <RocketLaunchIcon class="w-10 h-10 text-primary-600 dark:text-primary-400" />
        </div>

        <h2 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-3">
          Welcome to Prospera!
        </h2>
        <p class="text-secondary-500 dark:text-secondary-400 mb-8 max-w-md mx-auto">
          Your financial dashboard will come to life once you create your first
          budget period. Let's get started!
        </p>

        <!-- Getting Started Steps -->
        <div class="bg-secondary-50 dark:bg-secondary-900 rounded-xl p-6 mb-8 text-left">
          <h3 class="font-semibold text-secondary-900 dark:text-secondary-100 mb-4 text-center">
            How to get started
          </h3>
          <div class="space-y-4">
            <div class="flex gap-4">
              <div
                class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold"
              >
                1
              </div>
              <div>
                <p class="font-medium text-secondary-900 dark:text-secondary-100">
                  Create a Budget Period
                </p>
                <p class="text-sm text-secondary-500 dark:text-secondary-400">
                  A budget period represents a time range (like a month) where you
                  track your income and expenses.
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <div
                class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold"
              >
                2
              </div>
              <div>
                <p class="font-medium text-secondary-900 dark:text-secondary-100">Add Your Income</p>
                <p class="text-sm text-secondary-500 dark:text-secondary-400">
                  Record your earnings from jobs, freelance work, or other
                  sources.
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <div
                class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold"
              >
                3
              </div>
              <div>
                <p class="font-medium text-secondary-900 dark:text-secondary-100">Track Your Expenses</p>
                <p class="text-sm text-secondary-500 dark:text-secondary-400">
                  Log your spending to see where your money goes and find ways to
                  save.
                </p>
              </div>
            </div>
          </div>
        </div>

        <NuxtLink to="/budget-periods">
          <button
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
          >
            Create Your First Budget Period
            <ArrowRightIcon class="w-5 h-5" />
          </button>
        </NuxtLink>

        <div class="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
          <p class="text-sm text-secondary-400 dark:text-secondary-500">
            Looking for simple item lists?
            <NuxtLink
              to="/personal-budgets"
              class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
            >
              Try Personal Budgets
            </NuxtLink>
            for wishlists and savings goals.
          </p>
        </div>
      </div>
    </div>

    <!-- Dashboard with Data -->
    <div v-else class="space-y-8">
      <!-- Info Banner -->
      <UiInfoBanner variant="info" dismissible dismiss-key="dashboard-intro">
        Your financial insights are calculated from your
        <NuxtLink
          to="/budget-periods"
          class="text-primary-700 hover:underline font-medium"
          >Budget Periods</NuxtLink
        >. The more periods you track, the better your insights become.
      </UiInfoBanner>

      <!-- Summary Cards -->
      <div class="overflow-hidden">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2
            class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 flex items-center gap-2"
          >
            <SparklesIcon class="w-5 h-5 text-accent-500" />
            Financial Summary
          </h2>
          <div class="flex items-center gap-2 text-sm">
            <CalendarIcon class="w-4 h-4 text-secondary-400 flex-shrink-0" />
            <select
              v-model="startYear"
              class="px-2 py-1.5 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-secondary-700 dark:text-secondary-300 text-sm min-w-0"
            >
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
            <span class="text-secondary-400">to</span>
            <select
              v-model="endYear"
              class="px-2 py-1.5 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-secondary-700 dark:text-secondary-300 text-sm min-w-0"
            >
              <option
                v-for="year in availableEndYears"
                :key="year"
                :value="year"
              >
                {{ year }}
              </option>
            </select>
          </div>
        </div>

        <div v-if="metrics" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Total Income -->
          <DashboardMetricCard
            :icon="ArrowTrendingUpIcon"
            icon-bg-class="bg-success-50"
            icon-class="text-success-600"
            label="Total Income"
            :value="formatCurrency(metrics.totalIncome)"
            value-class="text-success-600"
            :subtitle="`From ${metrics.budgetPeriodsCount} budget period${metrics.budgetPeriodsCount === 1 ? '' : 's'}`"
          />

          <!-- Total Expenses -->
          <DashboardMetricCard
            :icon="ArrowTrendingDownIcon"
            icon-bg-class="bg-danger-50"
            icon-class="text-danger-600"
            label="Total Expenses"
            :value="formatCurrency(metrics.totalExpenses)"
            value-class="text-danger-600"
          />

          <!-- Net Savings -->
          <DashboardMetricCard
            :icon="WalletIcon"
            icon-bg-class="bg-primary-50"
            icon-class="text-primary-600"
            label="Net Savings"
            :value="formatCurrency(metrics.savings)"
            :value-class="metrics.savings >= 0 ? 'text-primary-600' : 'text-danger-600'"
          />

          <!-- Savings Rate -->
          <DashboardMetricCard
            :icon="SparklesIcon"
            :icon-bg-class="savingsRateStatus.bgClass"
            :icon-class="savingsRateStatus.iconClass"
            label="Savings Rate"
            :value="`${metrics.savingsRate.toFixed(1)}%`"
            :value-class="savingsRateStatus.valueClass"
            :show-progress="true"
            :progress-value="metrics.savingsRate"
            :progress-class="savingsRateStatus.progressClass"
          />
        </div>
      </div>

      <!-- Charts Section -->
      <div v-if="nonZeroMonthlyData.length > 0" class="space-y-6 overflow-hidden">
        <!-- Monthly Income vs Expenses -->
        <div
          class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-6 overflow-hidden"
        >
          <h2
            class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2 flex items-center gap-2"
          >
            <ChartBarIcon class="w-5 h-5 text-primary-500" />
            Monthly Income vs Expenses
          </h2>
          <p class="text-sm text-secondary-500 dark:text-secondary-400 mb-5">
            See how your income compares to expenses each month
          </p>
          <ClientOnly>
            <ChartsMonthlyBarChart
              :data="nonZeroMonthlyData"
              :currency="currency"
            />
            <template #fallback>
              <div
                class="h-80 flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 rounded-xl"
              >
                <div
                  class="w-8 h-8 border-3 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"
                ></div>
              </div>
            </template>
          </ClientOnly>
        </div>

        <!-- Savings Trend and Category Breakdown -->
        <div class="grid lg:grid-cols-2 gap-6">
          <div
            class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-6 overflow-hidden"
          >
            <h2
              class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2 flex items-center gap-2"
            >
              <ArrowTrendingUpIcon class="w-5 h-5 text-primary-500" />
              Savings Trend
            </h2>
            <p class="text-sm text-secondary-500 dark:text-secondary-400 mb-5">
              Track how much you're saving over time
            </p>
            <ClientOnly>
              <ChartsSavingsLineChart
                :data="nonZeroMonthlyData"
                :currency="currency"
              />
              <template #fallback>
                <div
                  class="h-80 flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 rounded-xl"
                >
                  <div
                    class="w-8 h-8 border-3 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"
                  ></div>
                </div>
              </template>
            </ClientOnly>
          </div>

          <div
            class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-6 overflow-hidden"
          >
            <h2
              class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2 flex items-center gap-2"
            >
              <ChartPieIcon class="w-5 h-5 text-primary-500" />
              Expenses by Category
            </h2>
            <p class="text-sm text-secondary-500 dark:text-secondary-400 mb-5">
              Understand where your money goes
            </p>
            <ClientOnly>
              <ChartsCategoryPieChart
                v-if="metrics"
                :data="metrics.expensesByCategory"
                :currency="currency"
              />
              <template #fallback>
                <div
                  class="h-80 flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 rounded-xl"
                >
                  <div
                    class="w-8 h-8 border-3 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"
                  ></div>
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>

        <!-- Category Breakdown Table -->
        <div
          v-if="metrics && Object.keys(metrics.expensesByCategory).length > 0"
          class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-6"
        >
          <h2
            class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-5 flex items-center gap-2"
          >
            <TagIcon class="w-5 h-5 text-primary-500" />
            Category Breakdown
          </h2>
          <div class="space-y-4">
            <div
              v-for="(data, category) in metrics.expensesByCategory"
              :key="category"
              class="space-y-2"
            >
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-secondary-900 dark:text-secondary-100">{{
                    category
                  }}</span>
                  <span class="text-sm text-secondary-400 dark:text-secondary-500"
                    >({{ data.count }} expense{{
                      data.count === 1 ? "" : "s"
                    }})</span
                  >
                </div>
                <div class="text-right">
                  <span class="font-semibold text-secondary-900 dark:text-secondary-100">{{
                    formatCurrency(data.total)
                  }}</span>
                  <span class="text-sm text-primary-600 dark:text-primary-400 ml-2 font-medium">
                    {{ ((data.total / metrics.totalExpenses) * 100).toFixed(1) }}%
                  </span>
                </div>
              </div>
              <div class="h-2 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
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
      </div>

      <!-- Quick Actions -->
      <div>
        <h2
          class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-5 flex items-center gap-2"
        >
          Quick Actions
        </h2>
        <div class="grid sm:grid-cols-2 gap-4">
          <DashboardQuickActionCard
            to="/budget-periods"
            :icon="CalendarDaysIcon"
            label="Budget Periods"
            :count="budgetPeriodsCount"
            count-label="periods"
            description="Manage your income and expenses over time"
          />
          <DashboardQuickActionCard
            to="/personal-budgets"
            :icon="ClipboardDocumentListIcon"
            label="Personal Budgets"
            :count="personalBudgetsCount"
            count-label="budgets"
            description="Wishlists, savings goals, and shopping lists"
          />
        </div>
      </div>
    </div>
  </div>
</template>
