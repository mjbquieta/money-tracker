<script setup lang="ts">
import type { RecurringExpense, RecurrenceFrequency } from '~/types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ArrowLeftIcon,
} from '@heroicons/vue/24/outline';

definePageMeta({
  middleware: 'auth',
});

const router = useRouter();
const authStore = useAuthStore();
const expenseStore = useExpenseStore();
const recurringStore = useRecurringExpenseStore();

const showModal = ref(false);
const showDeleteConfirm = ref(false);
const editingItem = ref<RecurringExpense | null>(null);
const itemToDelete = ref<RecurringExpense | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const frequencyOptions: { value: RecurrenceFrequency; label: string }[] = [
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'BIWEEKLY', label: 'Biweekly' },
  { value: 'MONTHLY', label: 'Monthly' },
  { value: 'YEARLY', label: 'Yearly' },
];

const form = reactive({
  name: '',
  description: '',
  amount: 0,
  categoryId: '',
  frequency: 'MONTHLY' as RecurrenceFrequency,
  startDate: '',
  endDate: '',
});

onMounted(async () => {
  await Promise.all([
    recurringStore.fetchAll(),
    expenseStore.fetchCategories(),
  ]);
});

function formatCurrency(amount: number) {
  const currency = authStore.user?.settings?.currency || 'USD';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getFrequencyLabel(frequency: RecurrenceFrequency) {
  return frequencyOptions.find((f) => f.value === frequency)?.label || frequency;
}

function getFrequencyColor(frequency: RecurrenceFrequency) {
  const colors: Record<RecurrenceFrequency, string> = {
    DAILY: 'bg-danger-50 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300',
    WEEKLY: 'bg-warning-50 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300',
    BIWEEKLY: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    MONTHLY: 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    YEARLY: 'bg-success-50 dark:bg-success-900/30 text-success-700 dark:text-success-300',
  };
  return colors[frequency];
}

function resetForm() {
  form.name = '';
  form.description = '';
  form.amount = 0;
  form.categoryId = '';
  form.frequency = 'MONTHLY';
  form.startDate = '';
  form.endDate = '';
  editingItem.value = null;
  error.value = null;
}

function openCreateModal() {
  resetForm();
  showModal.value = true;
}

function openEditModal(item: RecurringExpense) {
  editingItem.value = item;
  form.name = item.name;
  form.description = item.description || '';
  form.amount = item.amount;
  form.categoryId = item.categoryId;
  form.frequency = item.frequency;
  form.startDate = item.startDate.split('T')[0];
  form.endDate = item.endDate ? item.endDate.split('T')[0] : '';
  showModal.value = true;
}

function confirmDelete(item: RecurringExpense) {
  itemToDelete.value = item;
  showDeleteConfirm.value = true;
}

async function handleSubmit() {
  error.value = null;
  loading.value = true;

  if (editingItem.value) {
    const result = await recurringStore.update(editingItem.value.id, {
      name: form.name,
      description: form.description || undefined,
      amount: form.amount,
      categoryId: form.categoryId,
      frequency: form.frequency,
      startDate: form.startDate,
      endDate: form.endDate || null,
    });

    loading.value = false;
    if (!result.success && result.error) {
      error.value = typeof result.error.message === 'string' ? result.error.message : result.error.message[0];
      return;
    }
  } else {
    const result = await recurringStore.create({
      name: form.name,
      description: form.description || undefined,
      amount: form.amount,
      categoryId: form.categoryId,
      frequency: form.frequency,
      startDate: form.startDate,
      endDate: form.endDate || undefined,
    });

    loading.value = false;
    if (!result.success && result.error) {
      error.value = typeof result.error.message === 'string' ? result.error.message : result.error.message[0];
      return;
    }
  }

  showModal.value = false;
  resetForm();
}

async function handleDelete() {
  if (!itemToDelete.value) return;

  loading.value = true;
  const result = await recurringStore.remove(itemToDelete.value.id);
  loading.value = false;

  if (result.success) {
    showDeleteConfirm.value = false;
    itemToDelete.value = null;
  }
}

async function handleToggleActive(item: RecurringExpense) {
  await recurringStore.toggleActive(item.id, !item.isActive);
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
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
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Recurring Expenses</h1>
          <p class="text-sm text-secondary-500 dark:text-secondary-400">Manage expenses that repeat on a schedule</p>
        </div>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
        @click="openCreateModal"
      >
        <PlusIcon class="w-5 h-5" />
        New Recurring
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="recurringStore.items.length === 0 && !recurringStore.loading" class="text-center py-16">
      <div class="w-16 h-16 bg-secondary-50 dark:bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <ArrowPathIcon class="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
      </div>
      <p class="text-secondary-500 dark:text-secondary-400 mb-4">No recurring expenses yet. Create one to auto-generate expenses each period.</p>
      <button
        class="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium"
        @click="openCreateModal"
      >
        Create Recurring Expense
      </button>
    </div>

    <!-- List -->
    <div v-else class="space-y-3">
      <div
        v-for="item in recurringStore.items"
        :key="item.id"
        class="flex items-center justify-between p-4 bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 hover:shadow-card transition-all"
        :class="{ 'opacity-50': !item.isActive }"
      >
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-3 flex-wrap">
            <p class="font-medium text-secondary-900 dark:text-secondary-100">{{ item.name }}</p>
            <span :class="getFrequencyColor(item.frequency)" class="px-2 py-0.5 text-xs font-medium rounded-full">
              {{ getFrequencyLabel(item.frequency) }}
            </span>
            <span class="px-2 py-0.5 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
              {{ item.category?.name || 'Unknown' }}
            </span>
            <span v-if="!item.isActive" class="px-2 py-0.5 text-xs font-medium bg-secondary-100 dark:bg-secondary-700 text-secondary-500 dark:text-secondary-400 rounded-full">
              Paused
            </span>
          </div>
          <div class="flex items-center gap-3 mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            <span v-if="item.description">{{ item.description }}</span>
            <span>From {{ formatDate(item.startDate) }}</span>
            <span v-if="item.endDate">to {{ formatDate(item.endDate) }}</span>
          </div>
        </div>
        <div class="flex items-center gap-3 ml-4">
          <span class="font-semibold text-secondary-900 dark:text-secondary-100 whitespace-nowrap">{{ formatCurrency(item.amount) }}</span>
          <div class="flex gap-1">
            <button
              class="p-2 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
              :title="item.isActive ? 'Pause' : 'Activate'"
              @click="handleToggleActive(item)"
            >
              <ArrowPathIcon class="w-4 h-4" />
            </button>
            <button
              class="p-2 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
              @click="openEditModal(item)"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button
              class="p-2 text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
              @click="confirmDelete(item)"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          {{ editingItem ? 'Edit Recurring Expense' : 'New Recurring Expense' }}
        </h3>

        <div v-if="error" class="mb-4 p-3 bg-danger-50 dark:bg-danger-900/30 border border-danger-200 dark:border-danger-800 rounded-lg text-sm text-danger-700 dark:text-danger-300">
          {{ error }}
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Name</label>
            <input v-model="form.name" type="text" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Description</label>
            <input v-model="form.description" type="text" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Amount</label>
              <input v-model.number="form.amount" type="number" min="0.01" step="0.01" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Frequency</label>
              <select v-model="form.frequency" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
                <option v-for="opt in frequencyOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Category</label>
            <select v-model="form.categoryId" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="" disabled>Select category</option>
              <option v-for="cat in expenseStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Start Date</label>
              <input v-model="form.startDate" type="date" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>

            <div>
              <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">End Date <span class="text-secondary-400">(optional)</span></label>
              <input v-model="form.endDate" type="date" class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 px-4 py-2 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors" @click="showModal = false">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium disabled:opacity-50">
              {{ loading ? 'Saving...' : (editingItem ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <ConfirmModal
      v-if="showDeleteConfirm"
      title="Delete Recurring Expense"
      :message="`Are you sure you want to delete '${itemToDelete?.name}'?`"
      confirm-text="Delete"
      :loading="loading"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
