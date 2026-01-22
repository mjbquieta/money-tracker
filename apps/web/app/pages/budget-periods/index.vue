<script setup lang="ts">
import {
  PlusIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  TrashIcon,
  CreditCardIcon,
} from "@heroicons/vue/24/outline";
import type { IncomeItem } from "~/types";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const budgetStore = useBudgetStore();
const router = useRouter();

const showCreateModal = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const createForm = reactive({
  name: "",
  startDate: "",
  endDate: "",
  incomes: [{ name: "", description: "", amount: 0 }] as IncomeItem[],
});

const totalIncome = computed(() =>
  createForm.incomes.reduce((sum, inc) => sum + (inc.amount || 0), 0),
);

function addIncomeSource() {
  createForm.incomes.push({ name: "", description: "", amount: 0 });
}

function removeIncomeSource(index: number) {
  if (createForm.incomes.length > 1) {
    createForm.incomes.splice(index, 1);
  }
}

onMounted(async () => {
  await budgetStore.fetchBudgetPeriods();
});

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCurrency(amount: number) {
  const currency = authStore.user?.settings?.currency || "USD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

function getPeriodIncome(period: { incomes?: { amount: number }[] }) {
  return period.incomes?.reduce((sum, inc) => sum + inc.amount, 0) || 0;
}

function resetForm() {
  createForm.name = "";
  createForm.startDate = "";
  createForm.endDate = "";
  createForm.incomes = [{ name: "", description: "", amount: 0 }];
}

async function handleCreate() {
  error.value = null;

  if (!createForm.startDate || !createForm.endDate) {
    error.value = "Please fill in all required fields.";
    return;
  }

  const validIncomes = createForm.incomes.filter(
    (inc) => inc.name.trim() && inc.amount > 0,
  );

  if (validIncomes.length === 0) {
    error.value =
      "Please add at least one income source with a name and amount.";
    return;
  }

  if (new Date(createForm.startDate) >= new Date(createForm.endDate)) {
    error.value = "Start date must be before end date.";
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
    error.value =
      typeof result.error.message === "string"
        ? result.error.message
        : result.error.message[0];
    return;
  }

  showCreateModal.value = false;
  resetForm();
}

function viewBudgetPeriod(id: string) {
  router.push(`/budget-periods/${id}`);
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
    >
      <div>
        <h1
          class="text-2xl font-bold text-secondary-900 dark:text-secondary-100 flex items-center gap-2"
        >
          <CalendarDaysIcon class="w-7 h-7 text-primary-500" />
          Budget Periods
        </h1>
        <p class="text-secondary-500 dark:text-secondary-400 mt-1">
          Track your income and expenses over specific time periods
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
        @click="showCreateModal = true"
      >
        <PlusIcon class="w-5 h-5" />
        New Budget Period
      </button>
    </div>

    <!-- Info Banner -->
    <UiInfoBanner
      variant="info"
      dismissible
      dismiss-key="budget-periods-intro"
      class="mb-6"
    >
      A budget period represents a time range (like a month) where you track
      your income and expenses. Your financial insights on the
      <NuxtLink to="/dashboard" class="text-primary-700 hover:underline font-medium"
        >Dashboard</NuxtLink
      >
      are calculated from all your budget periods.
    </UiInfoBanner>

    <!-- Loading State -->
    <div v-if="budgetStore.loading" class="text-center py-16">
      <div
        class="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"
      ></div>
      <p class="text-secondary-500 dark:text-secondary-400">Loading your budget periods...</p>
    </div>

    <!-- Empty State -->
    <UiEmptyState
      v-else-if="budgetStore.budgetPeriods.length === 0"
      :icon="BanknotesIcon"
      title="No budget periods yet"
      description="Budget periods help you track your income and expenses over time. Create your first one to start managing your finances."
      action-label="Create Your First Budget Period"
      @action="showCreateModal = true"
    >
      <template #footer>
        <p class="text-sm text-secondary-400 mt-4">
          Tip: Most people create a new budget period each month.
        </p>
      </template>
    </UiEmptyState>

    <!-- Budget Period Cards -->
    <div v-else class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="period in budgetStore.budgetPeriods"
        :key="period.id"
        class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-6 cursor-pointer hover:shadow-card-hover hover:border-primary-200 dark:hover:border-primary-700 transition-all group"
        @click="viewBudgetPeriod(period.id)"
      >
        <div class="flex justify-between items-start mb-5">
          <div class="flex-1">
            <h3
              class="font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors"
            >
              {{
                period.name ||
                `${formatDate(period.startDate)} - ${formatDate(period.endDate)}`
              }}
            </h3>
            <p
              v-if="period.name"
              class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-1 mt-1"
            >
              <ClockIcon class="w-4 h-4" />
              {{ formatDate(period.startDate) }} -
              {{ formatDate(period.endDate) }}
            </p>
          </div>
          <div
            class="w-10 h-10 bg-primary-50 dark:bg-primary-900/50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 dark:group-hover:bg-primary-900/70 transition-colors"
          >
            <CalendarDaysIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-2">
              <ArrowTrendingUpIcon class="w-4 h-4 text-success-500" />
              Income
            </span>
            <span class="font-semibold text-success-600 dark:text-success-400">{{
              formatCurrency(getPeriodIncome(period))
            }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-secondary-500 dark:text-secondary-400 flex items-center gap-2">
              <CreditCardIcon class="w-4 h-4 text-danger-500" />
              Expenses
            </span>
            <span class="font-semibold text-danger-600 dark:text-danger-400">
              {{
                formatCurrency(
                  period.expenses.reduce((sum, e) => sum + e.amount, 0),
                )
              }}
            </span>
          </div>

          <div
            class="border-t border-secondary-100 dark:border-secondary-700 pt-3 flex justify-between items-center"
          >
            <span class="text-sm font-medium text-secondary-600 dark:text-secondary-400">Remaining</span>
            <span
              class="font-bold text-lg"
              :class="
                getPeriodIncome(period) -
                  period.expenses.reduce((sum, e) => sum + e.amount, 0) >=
                0
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-danger-600 dark:text-danger-400'
              "
            >
              {{
                formatCurrency(
                  getPeriodIncome(period) -
                    period.expenses.reduce((sum, e) => sum + e.amount, 0),
                )
              }}
            </span>
          </div>
        </div>

        <div
          class="mt-4 pt-3 border-t border-secondary-100 dark:border-secondary-700 flex items-center justify-between"
        >
          <span class="text-xs text-secondary-400 dark:text-secondary-500">
            {{ period.expenses.length }} expense{{
              period.expenses.length === 1 ? "" : "s"
            }}
          </span>
          <span
            class="text-xs text-primary-600 dark:text-primary-400 font-medium group-hover:text-primary-700 dark:group-hover:text-primary-300"
          >
            View details
          </span>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-secondary-900/50 dark:bg-secondary-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showCreateModal = false"
      >
        <div
          class="bg-white dark:bg-secondary-800 rounded-2xl shadow-elevated max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto"
        >
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-12 h-12 bg-primary-50 dark:bg-primary-900/50 rounded-xl flex items-center justify-center"
            >
              <CalendarDaysIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                Create Budget Period
              </h2>
              <p class="text-sm text-secondary-500 dark:text-secondary-400">
                Set up a new period to track your finances
              </p>
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
                <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300"
                  >Income Sources</label
                >
                <button
                  type="button"
                  class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1"
                  @click="addIncomeSource"
                >
                  <PlusIcon class="w-4 h-4" />
                  Add Source
                </button>
              </div>

              <div
                v-for="(income, index) in createForm.incomes"
                :key="index"
                class="p-4 bg-secondary-50 dark:bg-secondary-900 rounded-lg space-y-3"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-secondary-600 dark:text-secondary-400"
                    >Income #{{ index + 1 }}</span
                  >
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
                    placeholder="Amount"
                    required
                  />
                </div>

                <UiBaseInput
                  v-model="income.description"
                  placeholder="Description (optional)"
                />
              </div>

              <!-- Total Income Display -->
              <div
                class="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/30 rounded-lg"
              >
                <span class="text-sm font-medium text-primary-700 dark:text-primary-300"
                  >Total Income</span
                >
                <span class="text-lg font-bold text-primary-700 dark:text-primary-300">{{
                  formatCurrency(totalIncome)
                }}</span>
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100 dark:border-secondary-700">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors font-medium"
                @click="showCreateModal = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium disabled:opacity-50"
                :disabled="loading"
              >
                <span
                  v-if="loading"
                  class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                ></span>
                <PlusIcon v-else class="w-5 h-5" />
                Create Budget Period
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
