<script setup lang="ts">
import type { FinancialGoal, GoalStatus } from '~/types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  FlagIcon,
  BanknotesIcon,
  CheckCircleIcon,
  PauseCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline';

definePageMeta({
  middleware: 'auth',
});

const router = useRouter();
const authStore = useAuthStore();
const goalStore = useFinancialGoalStore();

const showGoalModal = ref(false);
const showContributionModal = ref(false);
const showDeleteConfirm = ref(false);
const showContributionHistory = ref(false);
const editingGoal = ref<FinancialGoal | null>(null);
const selectedGoal = ref<FinancialGoal | null>(null);
const goalToDelete = ref<FinancialGoal | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const detailGoal = ref<FinancialGoal | null>(null);

const goalForm = reactive({
  name: '',
  description: '',
  targetAmount: 0,
  targetDate: '',
});

const contributionForm = reactive({
  amount: 0,
  note: '',
});

const statusOptions: { value: GoalStatus; label: string }[] = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'PAUSED', label: 'Paused' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

onMounted(async () => {
  await Promise.all([goalStore.fetchGoals(), goalStore.fetchSummary()]);
});

function formatCurrency(amount: number) {
  const currency = authStore.user?.settings?.currency || 'USD';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getProgress(goal: FinancialGoal) {
  if (goal.targetAmount === 0) return 0;
  return Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
}

function getProgressColor(goal: FinancialGoal) {
  if (goal.status === 'COMPLETED') return 'bg-success-500';
  if (goal.status === 'PAUSED') return 'bg-secondary-400';
  if (goal.status === 'CANCELLED') return 'bg-secondary-300';
  const p = getProgress(goal);
  if (p >= 80) return 'bg-success-500';
  if (p >= 50) return 'bg-primary-500';
  if (p >= 25) return 'bg-warning-500';
  return 'bg-primary-400';
}

function getStatusBadge(status: GoalStatus) {
  const badges: Record<GoalStatus, { class: string; label: string }> = {
    ACTIVE: { class: 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300', label: 'Active' },
    COMPLETED: { class: 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300', label: 'Completed' },
    PAUSED: { class: 'bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300', label: 'Paused' },
    CANCELLED: { class: 'bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400', label: 'Cancelled' },
  };
  return badges[status];
}

function resetGoalForm() {
  goalForm.name = '';
  goalForm.description = '';
  goalForm.targetAmount = 0;
  goalForm.targetDate = '';
  editingGoal.value = null;
  error.value = null;
}

function resetContributionForm() {
  contributionForm.amount = 0;
  contributionForm.note = '';
  error.value = null;
}

function openCreateGoal() {
  resetGoalForm();
  showGoalModal.value = true;
}

function openEditGoal(goal: FinancialGoal) {
  editingGoal.value = goal;
  goalForm.name = goal.name;
  goalForm.description = goal.description || '';
  goalForm.targetAmount = goal.targetAmount;
  goalForm.targetDate = goal.targetDate ? goal.targetDate.split('T')[0] : '';
  showGoalModal.value = true;
}

function openContributionModal(goal: FinancialGoal) {
  selectedGoal.value = goal;
  resetContributionForm();
  showContributionModal.value = true;
}

function confirmDeleteGoal(goal: FinancialGoal) {
  goalToDelete.value = goal;
  showDeleteConfirm.value = true;
}

async function openContributionHistory(goal: FinancialGoal) {
  const { data } = await goalStore.fetchGoal(goal.id);
  if (data) {
    detailGoal.value = data;
    showContributionHistory.value = true;
  }
}

async function handleGoalSubmit() {
  error.value = null;
  loading.value = true;

  const payload = {
    name: goalForm.name,
    description: goalForm.description || undefined,
    targetAmount: goalForm.targetAmount,
    targetDate: goalForm.targetDate || undefined,
  };

  const result = editingGoal.value
    ? await goalStore.updateGoal(editingGoal.value.id, payload)
    : await goalStore.createGoal(payload);

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string' ? result.error.message : result.error.message[0];
    return;
  }

  showGoalModal.value = false;
  resetGoalForm();
  goalStore.fetchSummary();
}

async function handleContributionSubmit() {
  if (!selectedGoal.value) return;
  error.value = null;
  loading.value = true;

  const result = await goalStore.addContribution(selectedGoal.value.id, {
    amount: contributionForm.amount,
    note: contributionForm.note || undefined,
  });

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string' ? result.error.message : result.error.message[0];
    return;
  }

  showContributionModal.value = false;
  resetContributionForm();
  goalStore.fetchSummary();
}

async function handleDeleteGoal() {
  if (!goalToDelete.value) return;
  loading.value = true;
  const result = await goalStore.deleteGoal(goalToDelete.value.id);
  loading.value = false;

  if (result.success) {
    showDeleteConfirm.value = false;
    goalToDelete.value = null;
    goalStore.fetchSummary();
  }
}

async function handleDeleteContribution(goalId: string, contributionId: string) {
  loading.value = true;
  const result = await goalStore.deleteContribution(goalId, contributionId);
  loading.value = false;

  if (result.success && result.data) {
    detailGoal.value = result.data;
    goalStore.fetchSummary();
  }
}

async function handleStatusChange(goal: FinancialGoal, status: GoalStatus) {
  await goalStore.updateGoal(goal.id, { status });
  goalStore.fetchSummary();
}

function getDaysRemaining(targetDate: string) {
  const diff = new Date(targetDate).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div class="flex items-center gap-4">
        <button
          class="p-2 text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
          @click="router.back()"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Financial Goals</h1>
          <p class="text-sm text-secondary-500 dark:text-secondary-400">Track your savings targets and progress</p>
        </div>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
        @click="openCreateGoal"
      >
        <PlusIcon class="w-5 h-5" />
        <span class="hidden sm:inline">New Goal</span>
      </button>
    </div>

    <!-- Summary Cards -->
    <div v-if="goalStore.summary && goalStore.summary.totalGoals > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
        <p class="text-sm text-secondary-500 dark:text-secondary-400">Active Goals</p>
        <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">{{ goalStore.summary.activeGoals }}</p>
      </div>
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
        <p class="text-sm text-secondary-500 dark:text-secondary-400">Completed</p>
        <p class="text-2xl font-bold text-success-600 dark:text-success-400 mt-1">{{ goalStore.summary.completedGoals }}</p>
      </div>
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
        <p class="text-sm text-secondary-500 dark:text-secondary-400">Total Saved</p>
        <p class="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">{{ formatCurrency(goalStore.summary.totalCurrentAmount) }}</p>
      </div>
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
        <p class="text-sm text-secondary-500 dark:text-secondary-400">Overall Progress</p>
        <div class="flex items-end gap-2 mt-1">
          <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">{{ goalStore.summary.overallProgress.toFixed(1) }}%</p>
        </div>
        <div class="w-full bg-secondary-100 dark:bg-secondary-700 rounded-full h-1.5 mt-2">
          <div class="bg-primary-500 h-1.5 rounded-full transition-all" :style="{ width: `${Math.min(100, goalStore.summary.overallProgress)}%` }" />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="goalStore.loading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-2 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
    </div>

    <!-- Empty State -->
    <div v-else-if="goalStore.goals.length === 0" class="text-center py-16">
      <div class="w-16 h-16 bg-secondary-50 dark:bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <FlagIcon class="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
      </div>
      <p class="text-secondary-500 dark:text-secondary-400 mb-4">No financial goals yet. Start by creating a savings target!</p>
      <button
        class="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium"
        @click="openCreateGoal"
      >
        Create Your First Goal
      </button>
    </div>

    <!-- Goals List -->
    <div v-else class="space-y-4">
      <div
        v-for="goal in goalStore.goals"
        :key="goal.id"
        class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 hover:shadow-card transition-all overflow-hidden"
      >
        <div class="p-5">
          <!-- Top Row -->
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-semibold text-secondary-900 dark:text-secondary-100">{{ goal.name }}</h3>
                <span
                  :class="getStatusBadge(goal.status).class"
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                >
                  {{ getStatusBadge(goal.status).label }}
                </span>
              </div>
              <p v-if="goal.description" class="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">{{ goal.description }}</p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button
                v-if="goal.status === 'ACTIVE'"
                class="p-2 text-secondary-400 hover:text-success-600 dark:hover:text-success-400 hover:bg-success-50 dark:hover:bg-success-900/50 rounded-lg transition-colors"
                title="Add contribution"
                @click="openContributionModal(goal)"
              >
                <BanknotesIcon class="w-4 h-4" />
              </button>
              <button
                class="p-2 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                title="Edit goal"
                @click="openEditGoal(goal)"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <button
                class="p-2 text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
                title="Delete goal"
                @click="confirmDeleteGoal(goal)"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-3">
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium text-secondary-700 dark:text-secondary-300">{{ formatCurrency(goal.currentAmount) }}</span>
              <span class="text-secondary-500 dark:text-secondary-400">{{ formatCurrency(goal.targetAmount) }}</span>
            </div>
            <div class="w-full bg-secondary-100 dark:bg-secondary-700 rounded-full h-2.5">
              <div
                :class="getProgressColor(goal)"
                class="h-2.5 rounded-full transition-all duration-500"
                :style="{ width: `${getProgress(goal)}%` }"
              />
            </div>
            <div class="flex justify-between text-xs text-secondary-400 dark:text-secondary-500 mt-1">
              <span>{{ getProgress(goal).toFixed(1) }}% complete</span>
              <span v-if="goal.targetAmount > goal.currentAmount">
                {{ formatCurrency(goal.targetAmount - goal.currentAmount) }} remaining
              </span>
            </div>
          </div>

          <!-- Bottom Info -->
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-4 text-secondary-500 dark:text-secondary-400">
              <span v-if="goal.targetDate">
                Target: {{ formatDate(goal.targetDate) }}
                <template v-if="goal.status === 'ACTIVE' && getDaysRemaining(goal.targetDate) > 0">
                  ({{ getDaysRemaining(goal.targetDate) }}d left)
                </template>
                <template v-else-if="goal.status === 'ACTIVE' && getDaysRemaining(goal.targetDate) <= 0">
                  <span class="text-danger-500">(overdue)</span>
                </template>
              </span>
              <span>{{ goal._count.contributions }} contribution{{ goal._count.contributions !== 1 ? 's' : '' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="goal._count.contributions > 0"
                class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                @click="openContributionHistory(goal)"
              >
                View history
              </button>
              <select
                v-if="goal.status !== 'COMPLETED'"
                class="text-xs bg-transparent border border-secondary-200 dark:border-secondary-600 rounded px-1.5 py-0.5 text-secondary-600 dark:text-secondary-400 focus:ring-1 focus:ring-primary-500 outline-none"
                :value="goal.status"
                @change="handleStatusChange(goal, ($event.target as HTMLSelectElement).value as GoalStatus)"
              >
                <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
          </div>

          <!-- Recent Contributions Preview -->
          <div v-if="goal.contributions.length > 0" class="mt-3 pt-3 border-t border-secondary-100 dark:border-secondary-700">
            <p class="text-xs font-medium text-secondary-500 dark:text-secondary-400 mb-2">Recent contributions</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="c in goal.contributions.slice(0, 3)"
                :key="c.id"
                class="inline-flex items-center gap-1 px-2 py-0.5 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 rounded-full text-xs"
              >
                +{{ formatCurrency(c.amount) }}
                <span v-if="c.note" class="text-success-500 dark:text-success-400">{{ c.note }}</span>
              </span>
              <span v-if="goal.contributions.length > 3" class="text-xs text-secondary-400 self-center">
                +{{ goal.contributions.length - 3 }} more
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Goal Modal -->
    <div v-if="showGoalModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showGoalModal = false">
      <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          {{ editingGoal ? 'Edit Goal' : 'New Financial Goal' }}
        </h3>

        <div v-if="error" class="mb-4 p-3 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg text-sm text-danger-700 dark:text-danger-300">
          {{ error }}
        </div>

        <form class="space-y-4" @submit.prevent="handleGoalSubmit">
          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Goal Name</label>
            <input v-model="goalForm.name" type="text" required placeholder="e.g., Emergency Fund" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Description <span class="text-secondary-400">(optional)</span></label>
            <input v-model="goalForm.description" type="text" placeholder="e.g., 6 months of expenses" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Target Amount</label>
              <input v-model.number="goalForm.targetAmount" type="number" min="1" step="0.01" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Target Date <span class="text-secondary-400">(optional)</span></label>
              <input v-model="goalForm.targetDate" type="date" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 px-4 py-2 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors" @click="showGoalModal = false">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium disabled:opacity-50">
              {{ loading ? 'Saving...' : (editingGoal ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Contribution Modal -->
    <div v-if="showContributionModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showContributionModal = false">
      <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
          Add Contribution
        </h3>
        <p class="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
          to {{ selectedGoal?.name }}
        </p>

        <div v-if="error" class="mb-4 p-3 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg text-sm text-danger-700 dark:text-danger-300">
          {{ error }}
        </div>

        <form class="space-y-4" @submit.prevent="handleContributionSubmit">
          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Amount</label>
            <input v-model.number="contributionForm.amount" type="number" min="0.01" step="0.01" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Note <span class="text-secondary-400">(optional)</span></label>
            <input v-model="contributionForm.note" type="text" placeholder="e.g., Monthly savings" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div v-if="selectedGoal" class="p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg text-sm">
            <div class="flex justify-between text-secondary-600 dark:text-secondary-400">
              <span>Current: {{ formatCurrency(selectedGoal.currentAmount) }}</span>
              <span>Target: {{ formatCurrency(selectedGoal.targetAmount) }}</span>
            </div>
            <div v-if="contributionForm.amount > 0" class="mt-1 text-primary-600 dark:text-primary-400 font-medium">
              After: {{ formatCurrency(selectedGoal.currentAmount + contributionForm.amount) }}
              ({{ Math.min(100, ((selectedGoal.currentAmount + contributionForm.amount) / selectedGoal.targetAmount * 100)).toFixed(1) }}%)
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 px-4 py-2 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors" @click="showContributionModal = false">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="flex-1 px-4 py-2 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white rounded-lg transition-all font-medium disabled:opacity-50">
              {{ loading ? 'Adding...' : 'Add Contribution' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Contribution History Modal -->
    <div v-if="showContributionHistory && detailGoal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showContributionHistory = false">
      <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div class="p-6 pb-4 border-b border-secondary-100 dark:border-secondary-700">
          <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">{{ detailGoal.name }} - Contributions</h3>
          <p class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            {{ detailGoal._count.contributions }} total contributions
          </p>
        </div>
        <div class="flex-1 overflow-y-auto p-6 pt-4">
          <div v-if="detailGoal.contributions.length === 0" class="text-center py-8 text-secondary-500 dark:text-secondary-400">
            No contributions yet
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="c in detailGoal.contributions"
              :key="c.id"
              class="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg"
            >
              <div>
                <span class="font-medium text-success-600 dark:text-success-400">+{{ formatCurrency(c.amount) }}</span>
                <p v-if="c.note" class="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">{{ c.note }}</p>
                <p class="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">{{ formatDate(c.createdAt) }}</p>
              </div>
              <button
                class="p-1.5 text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
                title="Remove contribution"
                @click="handleDeleteContribution(detailGoal!.id, c.id)"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-secondary-100 dark:border-secondary-700">
          <button
            class="w-full px-4 py-2 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
            @click="showContributionHistory = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <UiConfirmModal
      :show="showDeleteConfirm"
      title="Delete Financial Goal"
      :message="`Are you sure you want to delete '${goalToDelete?.name}'? This will also remove all contributions.`"
      confirm-text="Delete"
      :loading="loading"
      @confirm="handleDeleteGoal"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
