<script setup lang="ts">
import type { CategoryComparisonPeriod, Expense } from '~/types';
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
  RocketLaunchIcon,
  BanknotesIcon,
  ArrowRightIcon,
  ArrowsRightLeftIcon,
  FlagIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const budgetStore = useBudgetStore();
const personalBudgetStore = usePersonalBudgetStore();
const debtStore = useDebtStore();
const goalStore = useFinancialGoalStore();
const expenseStore = useExpenseStore();

const currentYear = new Date().getFullYear();
const startYear = ref(currentYear - 1);
const endYear = ref(currentYear);
const loading = ref(true);
const recentExpenses = ref<Expense[]>([]);

// Category comparison
const comparisonData = ref<CategoryComparisonPeriod[]>([]);
const comparisonLoading = ref(false);
const selectedComparisonIds = ref<string[]>([]);

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

const { hasCompleted: onboardingCompleted, startTour } = useOnboarding();

onMounted(async () => {
  loading.value = true;
  await Promise.all([
    budgetStore.fetchYearRangeMetrics(startYear.value, endYear.value),
    budgetStore.fetchOverallMetrics(),
    personalBudgetStore.fetchPersonalBudgets(),
    budgetStore.fetchBudgetPeriods(),
    debtStore.fetchSummary(),
    debtStore.fetchDebts(),
    goalStore.fetchSummary(),
    expenseStore.searchExpenses({ limit: 5 }).then((result) => {
      if (result.success && result.data) {
        recentExpenses.value = result.data;
      }
    }),
  ]);
  loading.value = false;

  // Auto-trigger onboarding tour on first visit
  nextTick(() => {
    if (!onboardingCompleted.value) {
      startTour();
    }
  });
});

async function loadCategoryComparison() {
  if (selectedComparisonIds.value.length < 2) {
    comparisonData.value = [];
    return;
  }
  comparisonLoading.value = true;
  const result = await budgetStore.fetchCategoryComparison(selectedComparisonIds.value);
  comparisonLoading.value = false;

  if (result.success && result.data) {
    comparisonData.value = result.data;
  }
}

function toggleComparisonPeriod(id: string) {
  const idx = selectedComparisonIds.value.indexOf(id);
  if (idx >= 0) {
    selectedComparisonIds.value.splice(idx, 1);
  } else {
    selectedComparisonIds.value.push(id);
  }
  loadCategoryComparison();
}

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

function formatCompactCurrency(amount: number) {
  if (amount >= 1000000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.value,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return formatCurrency(amount);
}

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const savingsRateStatus = computed(() => {
  if (!metrics.value) return { color: "secondary", bgClass: "bg-secondary-50 dark:bg-secondary-700", iconClass: "text-secondary-600 dark:text-secondary-400", valueClass: "text-secondary-900 dark:text-secondary-100", progressClass: "bg-secondary-500" };

  if (metrics.value.savingsRate >= 20) {
    return { color: "success", bgClass: "bg-success-50 dark:bg-success-900/30", iconClass: "text-success-600 dark:text-success-400", valueClass: "text-success-600 dark:text-success-400", progressClass: "bg-success-500" };
  } else if (metrics.value.savingsRate >= 0) {
    return { color: "warning", bgClass: "bg-warning-50 dark:bg-warning-900/30", iconClass: "text-warning-600 dark:text-warning-400", valueClass: "text-warning-600 dark:text-warning-400", progressClass: "bg-warning-500" };
  } else {
    return { color: "danger", bgClass: "bg-danger-50 dark:bg-danger-900/30", iconClass: "text-danger-600 dark:text-danger-400", valueClass: "text-danger-600 dark:text-danger-400", progressClass: "bg-danger-500" };
  }
});

// Goals computed
const goalsProgress = computed(() => {
  const s = goalStore.summary;
  if (!s) return null;
  return s;
});

// Debt computed
const debtSummary = computed(() => debtStore.summary);

const netDebtPosition = computed(() => {
  if (!debtSummary.value) return 0;
  return debtSummary.value.totalOwedToMe - debtSummary.value.totalIOwe;
});

// Upcoming debts (due within 7 days)
const upcomingDebts = computed(() => {
  const now = new Date();
  const weekFromNow = new Date(now.getTime() + 7 * 86400000);
  return debtStore.debts.filter((d) => {
    if (d.status !== 'ACTIVE' || !d.dueDate) return false;
    const due = new Date(d.dueDate);
    return due >= now && due <= weekFromNow;
  });
});

// Overdue debts
const overdueDebts = computed(() => {
  const now = new Date();
  return debtStore.debts.filter((d) => {
    if (d.status !== 'ACTIVE' || !d.dueDate) return false;
    return new Date(d.dueDate) < now;
  });
});

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
              <div class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">1</div>
              <div>
                <p class="font-medium text-secondary-900 dark:text-secondary-100">Create a Budget Period</p>
                <p class="text-sm text-secondary-500 dark:text-secondary-400">A budget period represents a time range (like a month) where you track your income and expenses.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">2</div>
              <div>
                <p class="font-medium text-secondary-900 dark:text-secondary-100">Add Your Income</p>
                <p class="text-sm text-secondary-500 dark:text-secondary-400">Record your earnings from jobs, freelance work, or other sources.</p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold">3</div>
              <div>
                <p class="font-medium text-secondary-900 dark:text-secondary-100">Track Your Expenses</p>
                <p class="text-sm text-secondary-500 dark:text-secondary-400">Log your spending to see where your money goes and find ways to save.</p>
              </div>
            </div>
          </div>
        </div>

        <NuxtLink to="/budget-periods">
          <button class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium">
            Create Your First Budget Period
            <ArrowRightIcon class="w-5 h-5" />
          </button>
        </NuxtLink>

        <div class="mt-6 pt-6 border-t border-secondary-200 dark:border-secondary-700">
          <p class="text-sm text-secondary-400 dark:text-secondary-500">
            Looking for simple item lists?
            <NuxtLink to="/personal-budgets" class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
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
        <NuxtLink to="/budget-periods" class="text-primary-700 hover:underline font-medium">Budget Periods</NuxtLink>.
        The more periods you track, the better your insights become.
      </UiInfoBanner>

      <!-- Summary Cards -->
      <div class="overflow-hidden">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2 class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 flex items-center gap-2">
            <SparklesIcon class="w-5 h-5 text-accent-500" />
            Financial Summary
          </h2>
          <div class="flex items-center gap-2 text-sm">
            <CalendarIcon class="w-4 h-4 text-secondary-400 flex-shrink-0" />
            <select
              v-model="startYear"
              class="px-2 py-1.5 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-secondary-700 dark:text-secondary-300 text-sm min-w-0"
            >
              <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
            </select>
            <span class="text-secondary-400">to</span>
            <select
              v-model="endYear"
              class="px-2 py-1.5 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-secondary-700 dark:text-secondary-300 text-sm min-w-0"
            >
              <option v-for="year in availableEndYears" :key="year" :value="year">{{ year }}</option>
            </select>
          </div>
        </div>

        <div v-if="metrics" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardMetricCard
            :icon="ArrowTrendingUpIcon"
            icon-bg-class="bg-success-50 dark:bg-success-900/30"
            icon-class="text-success-600 dark:text-success-400"
            label="Total Income"
            :value="formatCurrency(metrics.totalIncome)"
            value-class="text-success-600 dark:text-success-400"
            :subtitle="`From ${metrics.budgetPeriodsCount} budget period${metrics.budgetPeriodsCount === 1 ? '' : 's'}`"
          />
          <DashboardMetricCard
            :icon="ArrowTrendingDownIcon"
            icon-bg-class="bg-danger-50 dark:bg-danger-900/30"
            icon-class="text-danger-600 dark:text-danger-400"
            label="Total Expenses"
            :value="formatCurrency(metrics.totalExpenses)"
            value-class="text-danger-600 dark:text-danger-400"
          />
          <DashboardMetricCard
            :icon="WalletIcon"
            icon-bg-class="bg-primary-50 dark:bg-primary-900/30"
            icon-class="text-primary-600 dark:text-primary-400"
            label="Net Savings"
            :value="formatCurrency(metrics.savings)"
            :value-class="metrics.savings >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-danger-600 dark:text-danger-400'"
          />
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

      <!-- Debt Alerts -->
      <div v-if="overdueDebts.length > 0 || upcomingDebts.length > 0" class="space-y-3">
        <div
          v-for="debt in overdueDebts"
          :key="'overdue-' + debt.id"
          class="flex items-center gap-3 p-3 bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 rounded-lg"
        >
          <ExclamationTriangleIcon class="w-5 h-5 text-danger-500 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-danger-700 dark:text-danger-300">
              Overdue: {{ debt.counterparty }} - {{ formatCurrency(debt.amount - debt.paidAmount) }} remaining
            </p>
            <p class="text-xs text-danger-500 dark:text-danger-400">
              Due {{ new Date(debt.dueDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
            </p>
          </div>
        </div>
        <div
          v-for="debt in upcomingDebts"
          :key="'upcoming-' + debt.id"
          class="flex items-center gap-3 p-3 bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-lg"
        >
          <ClockIcon class="w-5 h-5 text-warning-500 flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-warning-700 dark:text-warning-300">
              Due soon: {{ debt.counterparty }} - {{ formatCurrency(debt.amount - debt.paidAmount) }} remaining
            </p>
            <p class="text-xs text-warning-500 dark:text-warning-400">
              Due {{ new Date(debt.dueDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Goals & Debts Row -->
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Financial Goals Summary -->
        <NuxtLink
          to="/financial-goals"
          class="block bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-5 hover:shadow-card-hover hover:border-primary-200 dark:hover:border-primary-700 transition-all group"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-secondary-800 dark:text-secondary-200 flex items-center gap-2">
              <FlagIcon class="w-5 h-5 text-primary-500" />
              Financial Goals
            </h3>
            <ArrowRightIcon class="w-4 h-4 text-secondary-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
          </div>

          <div v-if="goalsProgress && goalsProgress.totalGoals > 0">
            <!-- Overall progress bar -->
            <div class="mb-4">
              <div class="flex justify-between text-sm mb-1.5">
                <span class="text-secondary-600 dark:text-secondary-400">Overall Progress</span>
                <span class="font-semibold text-primary-600 dark:text-primary-400">{{ goalsProgress.overallProgress.toFixed(0) }}%</span>
              </div>
              <div class="h-3 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full transition-all duration-700"
                  :style="{ width: `${Math.min(100, goalsProgress.overallProgress)}%` }"
                />
              </div>
            </div>

            <!-- Stats row -->
            <div class="grid grid-cols-3 gap-3">
              <div class="text-center p-2.5 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
                <p class="text-lg font-bold text-secondary-900 dark:text-secondary-100">{{ goalsProgress.activeGoals }}</p>
                <p class="text-xs text-secondary-500 dark:text-secondary-400">Active</p>
              </div>
              <div class="text-center p-2.5 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <p class="text-lg font-bold text-success-600 dark:text-success-400">{{ goalsProgress.completedGoals }}</p>
                <p class="text-xs text-secondary-500 dark:text-secondary-400">Completed</p>
              </div>
              <div class="text-center p-2.5 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                <p class="text-lg font-bold text-primary-600 dark:text-primary-400">{{ formatCompactCurrency(goalsProgress.totalCurrentAmount) }}</p>
                <p class="text-xs text-secondary-500 dark:text-secondary-400">Saved</p>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center py-4 text-center">
            <div class="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-3">
              <FlagIcon class="w-6 h-6 text-primary-400" />
            </div>
            <p class="text-sm text-secondary-500 dark:text-secondary-400">No goals yet. Set a financial target to start tracking!</p>
          </div>
        </NuxtLink>

        <!-- Debt Overview -->
        <NuxtLink
          to="/debts"
          class="block bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-5 hover:shadow-card-hover hover:border-primary-200 dark:hover:border-primary-700 transition-all group"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold text-secondary-800 dark:text-secondary-200 flex items-center gap-2">
              <CurrencyDollarIcon class="w-5 h-5 text-primary-500" />
              Debt Tracker
            </h3>
            <ArrowRightIcon class="w-4 h-4 text-secondary-400 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
          </div>

          <div v-if="debtSummary && debtSummary.totalDebts > 0">
            <!-- Net position -->
            <div class="mb-4 p-3 rounded-lg" :class="netDebtPosition >= 0 ? 'bg-success-50 dark:bg-success-900/20' : 'bg-danger-50 dark:bg-danger-900/20'">
              <p class="text-xs text-secondary-500 dark:text-secondary-400 mb-0.5">Net Position</p>
              <p class="text-xl font-bold" :class="netDebtPosition >= 0 ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'">
                {{ netDebtPosition >= 0 ? '+' : '' }}{{ formatCurrency(netDebtPosition) }}
              </p>
            </div>

            <!-- I Owe / Owed to Me -->
            <div class="grid grid-cols-2 gap-3">
              <div class="p-2.5 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
                <div class="flex items-center gap-1.5 mb-1">
                  <ArrowTrendingDownIcon class="w-3.5 h-3.5 text-danger-500" />
                  <span class="text-xs text-secondary-500 dark:text-secondary-400">I Owe</span>
                </div>
                <p class="text-sm font-bold text-danger-600 dark:text-danger-400">{{ formatCompactCurrency(debtSummary.totalIOwe) }}</p>
                <p class="text-xs text-secondary-400 dark:text-secondary-500">{{ debtSummary.iOweCount }} active</p>
              </div>
              <div class="p-2.5 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <div class="flex items-center gap-1.5 mb-1">
                  <ArrowTrendingUpIcon class="w-3.5 h-3.5 text-success-500" />
                  <span class="text-xs text-secondary-500 dark:text-secondary-400">Owed to Me</span>
                </div>
                <p class="text-sm font-bold text-success-600 dark:text-success-400">{{ formatCompactCurrency(debtSummary.totalOwedToMe) }}</p>
                <p class="text-xs text-secondary-400 dark:text-secondary-500">{{ debtSummary.owedToMeCount }} active</p>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center py-4 text-center">
            <div class="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-3">
              <CurrencyDollarIcon class="w-6 h-6 text-primary-400" />
            </div>
            <p class="text-sm text-secondary-500 dark:text-secondary-400">No debts tracked. Add debts you owe or are owed.</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Recent Expenses -->
      <div
        v-if="recentExpenses.length > 0"
        class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 flex items-center gap-2">
            <ClockIcon class="w-5 h-5 text-primary-500" />
            Recent Expenses
          </h2>
          <NuxtLink to="/budget-periods" class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
            View all
          </NuxtLink>
        </div>

        <div class="divide-y divide-secondary-100 dark:divide-secondary-700">
          <div
            v-for="expense in recentExpenses"
            :key="expense.id"
            class="flex items-center justify-between py-3 first:pt-0 last:pb-0"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 bg-secondary-100 dark:bg-secondary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <BanknotesIcon class="w-4.5 h-4.5 text-secondary-500 dark:text-secondary-400" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">{{ expense.name }}</p>
                <p class="text-xs text-secondary-400 dark:text-secondary-500">
                  {{ expense.category?.name || 'Uncategorized' }}
                  <span class="mx-1">&middot;</span>
                  {{ timeAgo(expense.createdAt) }}
                </p>
              </div>
            </div>
            <span class="text-sm font-semibold text-danger-600 dark:text-danger-400 flex-shrink-0 ml-3">
              -{{ formatCurrency(expense.amount) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div v-if="nonZeroMonthlyData.length > 0" class="space-y-6 overflow-hidden">
        <div class="grid lg:grid-cols-2 gap-6">
          <!-- Monthly Income vs Expenses (half width) -->
          <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-5 overflow-hidden">
            <h3 class="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
              <ChartBarIcon class="w-4 h-4 text-primary-500" />
              Monthly Income vs Expenses
            </h3>
            <ClientOnly>
              <ChartsMonthlyBarChart :data="nonZeroMonthlyData" :currency="currency" />
              <template #fallback>
                <div class="h-64 flex items-center justify-center">
                  <div class="w-6 h-6 border-2 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Expenses by Category (half width) -->
          <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-5 overflow-hidden">
            <h3 class="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
              <ChartPieIcon class="w-4 h-4 text-primary-500" />
              Expenses by Category
            </h3>
            <ClientOnly>
              <ChartsCategoryPieChart
                v-if="metrics"
                :data="metrics.expensesByCategory"
                :currency="currency"
              />
              <template #fallback>
                <div class="h-72 flex items-center justify-center">
                  <div class="w-6 h-6 border-2 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
                </div>
              </template>
            </ClientOnly>
          </div>

          <!-- Savings Trend (full width) -->
          <div class="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-5 overflow-hidden">
            <h3 class="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
              <ArrowTrendingUpIcon class="w-4 h-4 text-primary-500" />
              Savings Trend
            </h3>
            <ClientOnly>
              <ChartsSavingsLineChart :data="nonZeroMonthlyData" :currency="currency" />
              <template #fallback>
                <div class="h-72 flex items-center justify-center">
                  <div class="w-6 h-6 border-2 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>
      </div>

      <!-- Category Comparison -->
      <div
        v-if="budgetStore.budgetPeriods.length >= 2"
        class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-6 overflow-hidden"
      >
        <h2 class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-2 flex items-center gap-2">
          <ArrowsRightLeftIcon class="w-5 h-5 text-primary-500" />
          Category Comparison
        </h2>
        <p class="text-sm text-secondary-500 dark:text-secondary-400 mb-4">Compare spending across budget periods</p>

        <div class="flex flex-wrap gap-2 mb-5">
          <button
            v-for="period in budgetStore.budgetPeriods.slice(0, 8)"
            :key="period.id"
            class="px-3 py-1.5 text-sm rounded-lg border transition-colors"
            :class="selectedComparisonIds.includes(period.id)
              ? 'bg-primary-500 text-white border-primary-500'
              : 'bg-white dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 border-secondary-200 dark:border-secondary-600 hover:border-primary-300 dark:hover:border-primary-600'"
            @click="toggleComparisonPeriod(period.id)"
          >
            {{ period.name || `${new Date(period.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` }}
          </button>
        </div>

        <div v-if="comparisonLoading" class="flex items-center justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
        </div>

        <div v-else-if="selectedComparisonIds.length < 2" class="text-center py-8">
          <p class="text-secondary-400 dark:text-secondary-500 text-sm">Select at least 2 budget periods to compare</p>
        </div>

        <ClientOnly v-else>
          <ChartsCategoryComparisonChart :data="comparisonData" :currency="currency" />
          <template #fallback>
            <div class="h-80 flex items-center justify-center bg-secondary-50 dark:bg-secondary-900 rounded-xl">
              <div class="w-8 h-8 border-3 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin" />
            </div>
          </template>
        </ClientOnly>
      </div>

      <!-- Quick Actions -->
      <div>
        <h2 class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 mb-5 flex items-center gap-2">
          Quick Actions
        </h2>
        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardQuickActionCard
            to="/budget-periods"
            :icon="CalendarDaysIcon"
            label="Budget Periods"
            :count="budgetPeriodsCount"
            count-label="periods"
            description="Manage income and expenses"
          />
          <DashboardQuickActionCard
            to="/personal-budgets"
            :icon="ClipboardDocumentListIcon"
            label="Personal Budgets"
            :count="personalBudgetsCount"
            count-label="budgets"
            description="Wishlists and shopping lists"
          />
          <DashboardQuickActionCard
            to="/financial-goals"
            :icon="FlagIcon"
            label="Financial Goals"
            :count="goalsProgress?.totalGoals || 0"
            count-label="goals"
            description="Track savings targets"
          />
          <DashboardQuickActionCard
            to="/debts"
            :icon="CurrencyDollarIcon"
            label="Debt Tracker"
            :count="debtSummary?.activeDebts || 0"
            count-label="active debts"
            description="Track who owes who"
          />
          <DashboardQuickActionCard
            to="/vehicles"
            :icon="TruckIcon"
            label="Vehicles"
            count-label="vehicles"
            description="Track car expenses"
          />
        </div>
      </div>
    </div>
  </div>
</template>
