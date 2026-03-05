<script setup lang="ts">
import type { Debt, DebtType, DebtStatus } from '~/types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
} from '@heroicons/vue/24/outline';

definePageMeta({
  middleware: 'auth',
});

const router = useRouter();
const authStore = useAuthStore();
const debtStore = useDebtStore();

const activeTab = ref<'I_OWE' | 'OWED_TO_ME'>('I_OWE');
const showDebtModal = ref(false);
const showPaymentModal = ref(false);
const showDeleteConfirm = ref(false);
const showPaymentHistory = ref(false);
const editingDebt = ref<Debt | null>(null);
const selectedDebt = ref<Debt | null>(null);
const debtToDelete = ref<Debt | null>(null);
const detailDebt = ref<Debt | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const debtForm = reactive({
  type: 'I_OWE' as DebtType,
  counterparty: '',
  description: '',
  amount: 0,
  dueDate: '',
});

const paymentForm = reactive({
  amount: 0,
  note: '',
});

const filteredDebts = computed(() =>
  debtStore.debts.filter((d) => d.type === activeTab.value),
);

onMounted(async () => {
  await Promise.all([debtStore.fetchDebts(), debtStore.fetchSummary()]);
});

function formatCurrency(amount: number) {
  const currency = authStore.user?.settings?.currency || 'USD';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getProgress(debt: Debt) {
  if (debt.amount === 0) return 0;
  return Math.min(100, (debt.paidAmount / debt.amount) * 100);
}

function getStatusBadge(status: DebtStatus) {
  const badges: Record<DebtStatus, { class: string; label: string }> = {
    ACTIVE: { class: 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300', label: 'Active' },
    SETTLED: { class: 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300', label: 'Settled' },
    CANCELLED: { class: 'bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400', label: 'Cancelled' },
  };
  return badges[status];
}

function resetDebtForm() {
  debtForm.type = activeTab.value;
  debtForm.counterparty = '';
  debtForm.description = '';
  debtForm.amount = 0;
  debtForm.dueDate = '';
  editingDebt.value = null;
  error.value = null;
}

function resetPaymentForm() {
  paymentForm.amount = 0;
  paymentForm.note = '';
  error.value = null;
}

function openCreateDebt() {
  resetDebtForm();
  showDebtModal.value = true;
}

function openEditDebt(debt: Debt) {
  editingDebt.value = debt;
  debtForm.type = debt.type;
  debtForm.counterparty = debt.counterparty;
  debtForm.description = debt.description || '';
  debtForm.amount = debt.amount;
  debtForm.dueDate = debt.dueDate ? debt.dueDate.split('T')[0] : '';
  showDebtModal.value = true;
}

function openPaymentModal(debt: Debt) {
  selectedDebt.value = debt;
  resetPaymentForm();
  showPaymentModal.value = true;
}

function confirmDeleteDebt(debt: Debt) {
  debtToDelete.value = debt;
  showDeleteConfirm.value = true;
}

async function openPaymentHistory(debt: Debt) {
  const { data } = await debtStore.fetchDebt(debt.id);
  if (data) {
    detailDebt.value = data;
    showPaymentHistory.value = true;
  }
}

async function handleDebtSubmit() {
  error.value = null;
  loading.value = true;

  const payload = {
    type: debtForm.type,
    counterparty: debtForm.counterparty,
    description: debtForm.description || undefined,
    amount: debtForm.amount,
    dueDate: debtForm.dueDate || undefined,
  };

  const result = editingDebt.value
    ? await debtStore.updateDebt(editingDebt.value.id, payload)
    : await debtStore.createDebt(payload);

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string' ? result.error.message : result.error.message[0];
    return;
  }

  showDebtModal.value = false;
  resetDebtForm();
  debtStore.fetchSummary();
}

async function handlePaymentSubmit() {
  if (!selectedDebt.value) return;
  error.value = null;
  loading.value = true;

  const result = await debtStore.addPayment(selectedDebt.value.id, {
    amount: paymentForm.amount,
    note: paymentForm.note || undefined,
  });

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string' ? result.error.message : result.error.message[0];
    return;
  }

  showPaymentModal.value = false;
  resetPaymentForm();
  debtStore.fetchSummary();
}

async function handleDeleteDebt() {
  if (!debtToDelete.value) return;
  loading.value = true;
  const result = await debtStore.deleteDebt(debtToDelete.value.id);
  loading.value = false;

  if (result.success) {
    showDeleteConfirm.value = false;
    debtToDelete.value = null;
    debtStore.fetchSummary();
  }
}

async function handleDeletePayment(debtId: string, paymentId: string) {
  loading.value = true;
  const result = await debtStore.deletePayment(debtId, paymentId);
  loading.value = false;

  if (result.success && result.data) {
    detailDebt.value = result.data;
    debtStore.fetchSummary();
  }
}

function getDaysUntilDue(dueDate: string) {
  const diff = new Date(dueDate).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
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
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Debts</h1>
          <p class="text-sm text-secondary-500 dark:text-secondary-400">Track money you owe and money owed to you</p>
        </div>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
        @click="openCreateDebt"
      >
        <PlusIcon class="w-5 h-5" />
        <span class="hidden sm:inline">New Debt</span>
      </button>
    </div>

    <!-- Summary Cards -->
    <div v-if="debtStore.summary && debtStore.summary.totalDebts > 0" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
        <p class="text-sm text-secondary-500 dark:text-secondary-400">I Owe</p>
        <p class="text-2xl font-bold text-danger-600 dark:text-danger-400 mt-1">{{ formatCurrency(debtStore.summary.totalIOwe) }}</p>
        <p class="text-xs text-secondary-400 mt-1">{{ debtStore.summary.iOweCount }} active</p>
      </div>
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
        <p class="text-sm text-secondary-500 dark:text-secondary-400">Owed to Me</p>
        <p class="text-2xl font-bold text-success-600 dark:text-success-400 mt-1">{{ formatCurrency(debtStore.summary.totalOwedToMe) }}</p>
        <p class="text-xs text-secondary-400 mt-1">{{ debtStore.summary.owedToMeCount }} active</p>
      </div>
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
        <p class="text-sm text-secondary-500 dark:text-secondary-400">Active</p>
        <p class="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mt-1">{{ debtStore.summary.activeDebts }}</p>
      </div>
      <div class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 p-4">
        <p class="text-sm text-secondary-500 dark:text-secondary-400">Settled</p>
        <p class="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-1">{{ debtStore.summary.settledDebts }}</p>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex gap-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg p-1 mb-6">
      <button
        class="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        :class="activeTab === 'I_OWE' ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-sm' : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300'"
        @click="activeTab = 'I_OWE'"
      >
        I Owe ({{ debtStore.debts.filter(d => d.type === 'I_OWE').length }})
      </button>
      <button
        class="flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors"
        :class="activeTab === 'OWED_TO_ME' ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-sm' : 'text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300'"
        @click="activeTab = 'OWED_TO_ME'"
      >
        Owed to Me ({{ debtStore.debts.filter(d => d.type === 'OWED_TO_ME').length }})
      </button>
    </div>

    <!-- Loading -->
    <div v-if="debtStore.loading" class="flex justify-center py-16">
      <div class="w-8 h-8 border-2 border-primary-200 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredDebts.length === 0" class="text-center py-16">
      <div class="w-16 h-16 bg-secondary-50 dark:bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CurrencyDollarIcon class="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
      </div>
      <p class="text-secondary-500 dark:text-secondary-400 mb-4">
        {{ activeTab === 'I_OWE' ? 'No debts you owe.' : 'No debts owed to you.' }}
      </p>
      <button
        class="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium"
        @click="openCreateDebt"
      >
        Add a Debt
      </button>
    </div>

    <!-- Debts List -->
    <div v-else class="space-y-4">
      <div
        v-for="debt in filteredDebts"
        :key="debt.id"
        class="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 hover:shadow-card transition-all overflow-hidden"
      >
        <div class="p-5">
          <!-- Top Row -->
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-semibold text-secondary-900 dark:text-secondary-100">{{ debt.counterparty }}</h3>
                <span
                  :class="getStatusBadge(debt.status).class"
                  class="px-2 py-0.5 text-xs font-medium rounded-full"
                >
                  {{ getStatusBadge(debt.status).label }}
                </span>
              </div>
              <p v-if="debt.description" class="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">{{ debt.description }}</p>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button
                v-if="debt.status === 'ACTIVE'"
                class="p-2 text-secondary-400 hover:text-success-600 dark:hover:text-success-400 hover:bg-success-50 dark:hover:bg-success-900/50 rounded-lg transition-colors"
                title="Record payment"
                @click="openPaymentModal(debt)"
              >
                <BanknotesIcon class="w-4 h-4" />
              </button>
              <button
                class="p-2 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                title="Edit debt"
                @click="openEditDebt(debt)"
              >
                <PencilIcon class="w-4 h-4" />
              </button>
              <button
                class="p-2 text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
                title="Delete debt"
                @click="confirmDeleteDebt(debt)"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="mb-3">
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium text-secondary-700 dark:text-secondary-300">Paid: {{ formatCurrency(debt.paidAmount) }}</span>
              <span class="text-secondary-500 dark:text-secondary-400">Total: {{ formatCurrency(debt.amount) }}</span>
            </div>
            <div class="w-full bg-secondary-100 dark:bg-secondary-700 rounded-full h-2.5">
              <div
                class="h-2.5 rounded-full transition-all duration-500"
                :class="debt.status === 'SETTLED' ? 'bg-success-500' : 'bg-primary-500'"
                :style="{ width: `${getProgress(debt)}%` }"
              />
            </div>
            <div class="flex justify-between text-xs text-secondary-400 dark:text-secondary-500 mt-1">
              <span>{{ getProgress(debt).toFixed(1) }}% paid</span>
              <span v-if="debt.amount > debt.paidAmount">
                {{ formatCurrency(debt.amount - debt.paidAmount) }} remaining
              </span>
            </div>
          </div>

          <!-- Bottom Info -->
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center gap-4 text-secondary-500 dark:text-secondary-400">
              <span v-if="debt.dueDate">
                Due: {{ formatDate(debt.dueDate) }}
                <template v-if="debt.status === 'ACTIVE' && getDaysUntilDue(debt.dueDate) > 0">
                  ({{ getDaysUntilDue(debt.dueDate) }}d left)
                </template>
                <template v-else-if="debt.status === 'ACTIVE' && getDaysUntilDue(debt.dueDate) <= 0">
                  <span class="text-danger-500">(overdue)</span>
                </template>
              </span>
              <span>{{ debt._count.payments }} payment{{ debt._count.payments !== 1 ? 's' : '' }}</span>
            </div>
            <button
              v-if="debt._count.payments > 0"
              class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
              @click="openPaymentHistory(debt)"
            >
              View payments
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Debt Modal -->
    <div v-if="showDebtModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showDebtModal = false">
      <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          {{ editingDebt ? 'Edit Debt' : 'New Debt' }}
        </h3>

        <div v-if="error" class="mb-4 p-3 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg text-sm text-danger-700 dark:text-danger-300">
          {{ error }}
        </div>

        <form class="space-y-4" @submit.prevent="handleDebtSubmit">
          <div v-if="!editingDebt">
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Type</label>
            <select v-model="debtForm.type" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="I_OWE">I Owe</option>
              <option value="OWED_TO_ME">Owed to Me</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">{{ debtForm.type === 'I_OWE' ? 'Who do you owe?' : 'Who owes you?' }}</label>
            <input v-model="debtForm.counterparty" type="text" required placeholder="e.g., John Doe" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Description <span class="text-secondary-400">(optional)</span></label>
            <input v-model="debtForm.description" type="text" placeholder="e.g., Borrowed for dinner" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Amount</label>
              <input v-model.number="debtForm.amount" type="number" min="0.01" step="0.01" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Due Date <span class="text-secondary-400">(optional)</span></label>
              <input v-model="debtForm.dueDate" type="date" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 px-4 py-2 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors" @click="showDebtModal = false">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium disabled:opacity-50">
              {{ loading ? 'Saving...' : (editingDebt ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add Payment Modal -->
    <div v-if="showPaymentModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showPaymentModal = false">
      <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
          Record Payment
        </h3>
        <p class="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
          {{ selectedDebt?.type === 'I_OWE' ? 'Payment to' : 'Payment from' }} {{ selectedDebt?.counterparty }}
        </p>

        <div v-if="error" class="mb-4 p-3 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg text-sm text-danger-700 dark:text-danger-300">
          {{ error }}
        </div>

        <form class="space-y-4" @submit.prevent="handlePaymentSubmit">
          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Amount</label>
            <input v-model.number="paymentForm.amount" type="number" min="0.01" step="0.01" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Note <span class="text-secondary-400">(optional)</span></label>
            <input v-model="paymentForm.note" type="text" placeholder="e.g., Bank transfer" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div v-if="selectedDebt" class="p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg text-sm">
            <div class="flex justify-between text-secondary-600 dark:text-secondary-400">
              <span>Paid: {{ formatCurrency(selectedDebt.paidAmount) }}</span>
              <span>Total: {{ formatCurrency(selectedDebt.amount) }}</span>
            </div>
            <div v-if="paymentForm.amount > 0" class="mt-1 text-primary-600 dark:text-primary-400 font-medium">
              After: {{ formatCurrency(selectedDebt.paidAmount + paymentForm.amount) }}
              ({{ Math.min(100, ((selectedDebt.paidAmount + paymentForm.amount) / selectedDebt.amount * 100)).toFixed(1) }}%)
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 px-4 py-2 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors" @click="showPaymentModal = false">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="flex-1 px-4 py-2 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white rounded-lg transition-all font-medium disabled:opacity-50">
              {{ loading ? 'Recording...' : 'Record Payment' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Payment History Modal -->
    <div v-if="showPaymentHistory && detailDebt" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="showPaymentHistory = false">
      <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div class="p-6 pb-4 border-b border-secondary-100 dark:border-secondary-700">
          <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">{{ detailDebt.counterparty }} - Payments</h3>
          <p class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
            {{ detailDebt._count.payments }} total payments
          </p>
        </div>
        <div class="flex-1 overflow-y-auto p-6 pt-4">
          <div v-if="detailDebt.payments.length === 0" class="text-center py-8 text-secondary-500 dark:text-secondary-400">
            No payments yet
          </div>
          <div v-else class="space-y-3">
            <div
              v-for="p in detailDebt.payments"
              :key="p.id"
              class="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg"
            >
              <div>
                <span class="font-medium text-success-600 dark:text-success-400">{{ formatCurrency(p.amount) }}</span>
                <p v-if="p.note" class="text-sm text-secondary-500 dark:text-secondary-400 mt-0.5">{{ p.note }}</p>
                <p class="text-xs text-secondary-400 dark:text-secondary-500 mt-0.5">{{ formatDate(p.createdAt) }}</p>
              </div>
              <button
                class="p-1.5 text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
                title="Remove payment"
                @click="handleDeletePayment(detailDebt!.id, p.id)"
              >
                <TrashIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-secondary-100 dark:border-secondary-700">
          <button
            class="w-full px-4 py-2 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
            @click="showPaymentHistory = false"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <UiConfirmModal
      :show="showDeleteConfirm"
      title="Delete Debt"
      :message="`Are you sure you want to delete the debt with '${debtToDelete?.counterparty}'? This will also remove all payment records.`"
      confirm-text="Delete"
      :loading="loading"
      @confirm="handleDeleteDebt"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
