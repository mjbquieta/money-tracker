<script setup lang="ts">
import type { Expense } from '~/types';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const budgetStore = useBudgetStore();
const expenseStore = useExpenseStore();

if (!authStore.isAuthenticated) {
  navigateTo('/auth/login');
}

const budgetPeriodId = route.params.id as string;

const showExpenseModal = ref(false);
const showDeleteConfirm = ref(false);
const showEditPeriodModal = ref(false);
const showDuplicateModal = ref(false);
const editingExpense = ref<Expense | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const expenseForm = reactive({
  name: '',
  description: '',
  amount: 0,
  categoryId: '',
});

const editPeriodForm = reactive({
  name: '',
  income: 0,
});

const duplicateForm = reactive({
  name: '',
  startDate: '',
  endDate: '',
  income: 0,
});

onMounted(async () => {
  await Promise.all([
    budgetStore.fetchBudgetPeriod(budgetPeriodId),
    budgetStore.fetchBudgetSummary(budgetPeriodId),
    expenseStore.fetchCategories(),
  ]);
});

const period = computed(() => budgetStore.currentPeriod);
const summary = computed(() => budgetStore.currentSummary);

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateForInput(dateString: string) {
  return new Date(dateString).toISOString().split('T')[0];
}

function formatCurrency(amount: number) {
  const currency = authStore.user?.settings?.currency || 'USD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

function resetExpenseForm() {
  expenseForm.name = '';
  expenseForm.description = '';
  expenseForm.amount = 0;
  expenseForm.categoryId = '';
  editingExpense.value = null;
}

function openAddExpense() {
  resetExpenseForm();
  showExpenseModal.value = true;
}

function openEditExpense(expense: Expense) {
  editingExpense.value = expense;
  expenseForm.name = expense.name;
  expenseForm.description = expense.description || '';
  expenseForm.amount = expense.amount;
  expenseForm.categoryId = expense.categoryId;
  showExpenseModal.value = true;
}

function openEditPeriod() {
  if (period.value) {
    editPeriodForm.name = period.value.name || '';
    editPeriodForm.income = period.value.income;
  }
  error.value = null;
  showEditPeriodModal.value = true;
}

function openDuplicateModal() {
  if (period.value) {
    duplicateForm.name = '';
    duplicateForm.startDate = '';
    duplicateForm.endDate = '';
    duplicateForm.income = period.value.income;
  }
  error.value = null;
  showDuplicateModal.value = true;
}

async function handleExpenseSubmit() {
  error.value = null;

  if (!expenseForm.name || !expenseForm.amount || !expenseForm.categoryId) {
    error.value = 'Please fill in all required fields.';
    return;
  }

  loading.value = true;

  if (editingExpense.value) {
    const result = await expenseStore.updateExpense(editingExpense.value.id, {
      name: expenseForm.name,
      description: expenseForm.description || undefined,
      amount: expenseForm.amount,
      categoryId: expenseForm.categoryId,
    });

    if (!result.success && result.error) {
      error.value = typeof result.error.message === 'string'
        ? result.error.message
        : result.error.message[0];
      loading.value = false;
      return;
    }
  } else {
    const result = await expenseStore.createExpense({
      name: expenseForm.name,
      description: expenseForm.description || undefined,
      amount: expenseForm.amount,
      categoryId: expenseForm.categoryId,
      budgetPeriodId,
    });

    if (!result.success && result.error) {
      error.value = typeof result.error.message === 'string'
        ? result.error.message
        : result.error.message[0];
      loading.value = false;
      return;
    }
  }

  loading.value = false;
  showExpenseModal.value = false;
  resetExpenseForm();

  await Promise.all([
    budgetStore.fetchBudgetPeriod(budgetPeriodId),
    budgetStore.fetchBudgetSummary(budgetPeriodId),
  ]);
}

async function handleEditPeriodSubmit() {
  error.value = null;

  if (!editPeriodForm.income || editPeriodForm.income <= 0) {
    error.value = 'Please enter a valid income amount.';
    return;
  }

  loading.value = true;

  const result = await budgetStore.updateBudgetPeriod(budgetPeriodId, {
    name: editPeriodForm.name || undefined,
    income: editPeriodForm.income,
  });

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  showEditPeriodModal.value = false;
  await budgetStore.fetchBudgetSummary(budgetPeriodId);
}

async function handleDuplicateSubmit() {
  error.value = null;

  if (!duplicateForm.startDate || !duplicateForm.endDate || !duplicateForm.income) {
    error.value = 'Please fill in all required fields.';
    return;
  }

  if (new Date(duplicateForm.startDate) >= new Date(duplicateForm.endDate)) {
    error.value = 'Start date must be before end date.';
    return;
  }

  loading.value = true;

  const result = await budgetStore.duplicateBudgetPeriod(budgetPeriodId, {
    name: duplicateForm.name || undefined,
    startDate: duplicateForm.startDate,
    endDate: duplicateForm.endDate,
    income: duplicateForm.income,
  });

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  showDuplicateModal.value = false;

  // Navigate to the new duplicated budget period
  if (result.data) {
    router.push(`/budget/${result.data.id}`);
  }
}

async function handleDeleteExpense(expense: Expense) {
  const result = await expenseStore.deleteExpense(expense.id);

  if (result.success) {
    await Promise.all([
      budgetStore.fetchBudgetPeriod(budgetPeriodId),
      budgetStore.fetchBudgetSummary(budgetPeriodId),
    ]);
  }
}

async function handleDeleteBudgetPeriod() {
  const result = await budgetStore.deleteBudgetPeriod(budgetPeriodId);

  if (result.success) {
    router.push('/dashboard');
  }
}

function getCategoryColor(categoryName: string): string {
  const colors: Record<string, string> = {
    Bills: 'bg-red-100 text-red-800',
    Food: 'bg-orange-100 text-orange-800',
    Transport: 'bg-blue-100 text-blue-800',
    Savings: 'bg-green-100 text-green-800',
    Entertainment: 'bg-purple-100 text-purple-800',
  };
  return colors[categoryName] || 'bg-gray-100 text-gray-800';
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div v-if="budgetStore.loading" class="text-center py-12">
      <p class="text-gray-500">Loading...</p>
    </div>

    <div v-else-if="period">
      <!-- Header -->
      <div class="mb-8">
        <button
          class="text-blue-600 hover:text-blue-800 text-sm mb-4 flex items-center gap-1"
          @click="router.push('/dashboard')"
        >
          &larr; Back to Dashboard
        </button>

        <div class="flex justify-between items-start">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ period.name || `${formatDate(period.startDate)} - ${formatDate(period.endDate)}` }}
            </h1>
            <p v-if="period.name" class="text-gray-500">
              {{ formatDate(period.startDate) }} - {{ formatDate(period.endDate) }}
            </p>
          </div>

          <div class="flex gap-2">
            <UiBaseButton variant="outline" @click="openEditPeriod">
              Edit
            </UiBaseButton>
            <UiBaseButton variant="outline" @click="openDuplicateModal">
              Duplicate
            </UiBaseButton>
            <UiBaseButton variant="outline" class="text-red-600 border-red-300 hover:bg-red-50" @click="showDeleteConfirm = true">
              Delete
            </UiBaseButton>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow" @click="openEditPeriod">
          <p class="text-sm text-gray-500 mb-1">Income</p>
          <p class="text-2xl font-bold text-green-600">{{ formatCurrency(period.income) }}</p>
          <p class="text-xs text-gray-400 mt-1">Click to edit</p>
        </div>
        <div class="bg-white shadow rounded-lg p-6">
          <p class="text-sm text-gray-500 mb-1">Total Expenses</p>
          <p class="text-2xl font-bold text-red-600">{{ formatCurrency(summary?.totalExpenses || 0) }}</p>
        </div>
        <div class="bg-white shadow rounded-lg p-6">
          <p class="text-sm text-gray-500 mb-1">Remaining</p>
          <p
            class="text-2xl font-bold"
            :class="(summary?.remaining || 0) >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ formatCurrency(summary?.remaining || 0) }}
          </p>
        </div>
      </div>

      <!-- Expenses by Category -->
      <div v-if="summary?.expensesByCategory && Object.keys(summary.expensesByCategory).length > 0" class="bg-white shadow rounded-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h2>
        <div class="space-y-3">
          <div
            v-for="(data, categoryName) in summary.expensesByCategory"
            :key="categoryName"
            class="flex justify-between items-center"
          >
            <div class="flex items-center gap-3">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="getCategoryColor(categoryName as string)"
              >
                {{ categoryName }}
              </span>
              <span class="text-sm text-gray-500">{{ data.count }} expense{{ data.count === 1 ? '' : 's' }}</span>
            </div>
            <span class="font-medium text-gray-900">{{ formatCurrency(data.total) }}</span>
          </div>
        </div>
      </div>

      <!-- Expenses List -->
      <div class="bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Expenses</h2>
          <UiBaseButton @click="openAddExpense">
            + Add Expense
          </UiBaseButton>
        </div>

        <div v-if="period.expenses.length === 0" class="text-center py-8">
          <p class="text-gray-500 mb-4">No expenses yet. Add your first expense to start tracking.</p>
          <UiBaseButton @click="openAddExpense">
            Add Expense
          </UiBaseButton>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="expense in period.expenses"
            :key="expense.id"
            class="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <p class="font-medium text-gray-900">{{ expense.name }}</p>
                <span
                  class="px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="getCategoryColor(expense.category.name)"
                >
                  {{ expense.category.name }}
                </span>
              </div>
              <p v-if="expense.description" class="text-sm text-gray-500 mt-1">{{ expense.description }}</p>
            </div>
            <div class="flex items-center gap-4">
              <p class="font-semibold text-red-600">{{ formatCurrency(expense.amount) }}</p>
              <div class="flex gap-2">
                <button
                  class="text-blue-600 hover:text-blue-800 text-sm"
                  @click="openEditExpense(expense)"
                >
                  Edit
                </button>
                <button
                  class="text-red-600 hover:text-red-800 text-sm"
                  @click="handleDeleteExpense(expense)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Expense Modal -->
    <div
      v-if="showExpenseModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showExpenseModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">
          {{ editingExpense ? 'Edit Expense' : 'Add Expense' }}
        </h2>

        <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

        <form @submit.prevent="handleExpenseSubmit" class="space-y-4">
          <UiBaseInput
            v-model="expenseForm.name"
            label="Name"
            placeholder="e.g., Electricity Bill"
            required
          />

          <UiBaseInput
            v-model="expenseForm.description"
            label="Description (Optional)"
            placeholder="Additional details"
          />

          <UiBaseInput
            v-model="expenseForm.amount"
            label="Amount"
            type="number"
            :placeholder="`Amount in ${authStore.user?.settings?.currency || 'USD'}`"
            required
          />

          <UiBaseSelect
            v-model="expenseForm.categoryId"
            label="Category"
            required
          >
            <option value="" disabled>Select a category</option>
            <option
              v-for="category in expenseStore.categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </UiBaseSelect>

          <div class="flex justify-end gap-3 mt-6">
            <UiBaseButton
              type="button"
              variant="outline"
              @click="showExpenseModal = false"
            >
              Cancel
            </UiBaseButton>
            <UiBaseButton type="submit" :loading="loading">
              {{ editingExpense ? 'Update' : 'Add' }}
            </UiBaseButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Budget Period Modal -->
    <div
      v-if="showEditPeriodModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showEditPeriodModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Edit Budget Period</h2>

        <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

        <form @submit.prevent="handleEditPeriodSubmit" class="space-y-4">
          <UiBaseInput
            v-model="editPeriodForm.name"
            label="Name (Optional)"
            placeholder="e.g., January 2026"
          />

          <UiBaseInput
            v-model="editPeriodForm.income"
            label="Income"
            type="number"
            :placeholder="`Amount in ${authStore.user?.settings?.currency || 'USD'}`"
            required
          />

          <div class="flex justify-end gap-3 mt-6">
            <UiBaseButton
              type="button"
              variant="outline"
              @click="showEditPeriodModal = false"
            >
              Cancel
            </UiBaseButton>
            <UiBaseButton type="submit" :loading="loading">
              Save
            </UiBaseButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Duplicate Budget Period Modal -->
    <div
      v-if="showDuplicateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDuplicateModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Duplicate Budget Period</h2>
        <p class="text-sm text-gray-500 mb-4">
          This will create a new budget period with the same expenses as the current one.
        </p>

        <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

        <form @submit.prevent="handleDuplicateSubmit" class="space-y-4">
          <UiBaseInput
            v-model="duplicateForm.name"
            label="Name (Optional)"
            placeholder="e.g., February 2026"
          />

          <div class="grid grid-cols-2 gap-4">
            <UiBaseInput
              v-model="duplicateForm.startDate"
              label="Start Date"
              type="date"
              required
            />
            <UiBaseInput
              v-model="duplicateForm.endDate"
              label="End Date"
              type="date"
              required
            />
          </div>

          <UiBaseInput
            v-model="duplicateForm.income"
            label="Income"
            type="number"
            :placeholder="`Amount in ${authStore.user?.settings?.currency || 'USD'}`"
            required
          />

          <div class="flex justify-end gap-3 mt-6">
            <UiBaseButton
              type="button"
              variant="outline"
              @click="showDuplicateModal = false"
            >
              Cancel
            </UiBaseButton>
            <UiBaseButton type="submit" :loading="loading">
              Duplicate
            </UiBaseButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirm"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showDeleteConfirm = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Delete Budget Period</h2>
        <p class="text-gray-600 mb-6">
          Are you sure you want to delete this budget period? This will also delete all associated expenses.
          This action cannot be undone.
        </p>
        <div class="flex justify-end gap-3">
          <UiBaseButton
            type="button"
            variant="outline"
            @click="showDeleteConfirm = false"
          >
            Cancel
          </UiBaseButton>
          <UiBaseButton
            type="button"
            class="bg-red-600 hover:bg-red-700"
            @click="handleDeleteBudgetPeriod"
          >
            Delete
          </UiBaseButton>
        </div>
      </div>
    </div>
  </div>
</template>
