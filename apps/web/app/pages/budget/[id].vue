<script setup lang="ts">
import type { Expense, BulkExpenseItem, ExpenseGroup } from '~/types';
import {
  ArrowLeftIcon,
  PencilIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  PlusIcon,
  BanknotesIcon,
  CreditCardIcon,
  WalletIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  TagIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  QueueListIcon,
  XMarkIcon,
  FolderIcon,
  FolderPlusIcon,
  ArrowsRightLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from '@heroicons/vue/24/outline';

definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const budgetStore = useBudgetStore();
const expenseStore = useExpenseStore();
const expenseGroupStore = useExpenseGroupStore();

const budgetPeriodId = route.params.id as string;

const showExpenseModal = ref(false);
const showBulkExpenseModal = ref(false);
const showDeleteConfirm = ref(false);
const showEditPeriodModal = ref(false);
const showDuplicateModal = ref(false);
const showNewCategoryInput = ref(false);
const showBulkNewCategoryInput = ref(false);
const showGroupModal = ref(false);
const showMoveExpenseModal = ref(false);
const editingExpense = ref<Expense | null>(null);
const editingGroup = ref<ExpenseGroup | null>(null);
const selectedExpenseForMove = ref<Expense | null>(null);
const expandedGroups = ref<Set<string>>(new Set());
const loading = ref(false);
const categoryLoading = ref(false);
const error = ref<string | null>(null);
const newCategoryName = ref('');
const bulkNewCategoryName = ref('');

const expenseForm = reactive({
  name: '',
  description: '',
  amount: 0,
  categoryId: '',
  expenseGroupId: '',
});

const showNewGroupInput = ref(false);
const newGroupName = ref('');
const groupLoading = ref(false);

const editPeriodForm = reactive({
  name: '',
  startDate: '',
  endDate: '',
  income: 0,
});

const duplicateForm = reactive({
  name: '',
  startDate: '',
  endDate: '',
  income: 0,
});

const groupForm = reactive({
  name: '',
  description: '',
});

const bulkExpenses = ref<BulkExpenseItem[]>([
  { name: '', description: '', amount: 0, categoryId: '', expenseGroupId: '' },
]);

function addBulkExpenseRow() {
  bulkExpenses.value.push({ name: '', description: '', amount: 0, categoryId: '', expenseGroupId: '' });
}

function removeBulkExpenseRow(index: number) {
  if (bulkExpenses.value.length > 1) {
    bulkExpenses.value.splice(index, 1);
  }
}

const showBulkNewGroupInput = ref(false);
const bulkNewGroupName = ref('');

function resetBulkExpenseForm() {
  bulkExpenses.value = [{ name: '', description: '', amount: 0, categoryId: '', expenseGroupId: '' }];
  showBulkNewCategoryInput.value = false;
  bulkNewCategoryName.value = '';
  showBulkNewGroupInput.value = false;
  bulkNewGroupName.value = '';
  error.value = null;
}

function openBulkExpenseModal() {
  resetBulkExpenseForm();
  showBulkExpenseModal.value = true;
}

async function handleBulkCreateCategory() {
  if (!bulkNewCategoryName.value.trim()) {
    return;
  }

  categoryLoading.value = true;
  const result = await expenseStore.createCategory({ name: bulkNewCategoryName.value.trim() });
  categoryLoading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  showBulkNewCategoryInput.value = false;
  bulkNewCategoryName.value = '';
}

function cancelBulkNewCategory() {
  showBulkNewCategoryInput.value = false;
  bulkNewCategoryName.value = '';
}

async function handleBulkCreateGroup() {
  if (!bulkNewGroupName.value.trim()) {
    return;
  }

  groupLoading.value = true;
  const result = await expenseGroupStore.createGroup({
    name: bulkNewGroupName.value.trim(),
    budgetPeriodId,
  });
  groupLoading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  showBulkNewGroupInput.value = false;
  bulkNewGroupName.value = '';
}

function cancelBulkNewGroup() {
  showBulkNewGroupInput.value = false;
  bulkNewGroupName.value = '';
}

async function handleBulkExpenseSubmit() {
  error.value = null;

  // Validate all expense rows
  const validExpenses = bulkExpenses.value.filter(
    (e) => e.name && e.amount > 0 && e.categoryId
  );

  if (validExpenses.length === 0) {
    error.value = 'Please add at least one valid expense with name, amount, and category.';
    return;
  }

  loading.value = true;

  const result = await expenseStore.createBulkExpenses({
    budgetPeriodId,
    expenses: validExpenses.map((e) => ({
      name: e.name,
      description: e.description || undefined,
      amount: e.amount,
      categoryId: e.categoryId,
      ...(e.expenseGroupId && { expenseGroupId: e.expenseGroupId }),
    })),
  });

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  showBulkExpenseModal.value = false;
  resetBulkExpenseForm();

  await Promise.all([
    budgetStore.fetchBudgetPeriod(budgetPeriodId),
    budgetStore.fetchBudgetSummary(budgetPeriodId),
    expenseGroupStore.fetchGroups(budgetPeriodId),
  ]);
}

const bulkExpensesTotal = computed(() => {
  return bulkExpenses.value.reduce((sum, e) => sum + (e.amount || 0), 0);
});

const validBulkExpensesCount = computed(() => {
  return bulkExpenses.value.filter((e) => e.name && e.amount > 0 && e.categoryId).length;
});

// Expense Group Functions
function resetGroupForm() {
  groupForm.name = '';
  groupForm.description = '';
  editingGroup.value = null;
  error.value = null;
}

function openCreateGroupModal() {
  resetGroupForm();
  showGroupModal.value = true;
}

function openEditGroupModal(group: ExpenseGroup) {
  editingGroup.value = group;
  groupForm.name = group.name;
  groupForm.description = group.description || '';
  error.value = null;
  showGroupModal.value = true;
}

function toggleGroupExpanded(groupId: string) {
  if (expandedGroups.value.has(groupId)) {
    expandedGroups.value.delete(groupId);
  } else {
    expandedGroups.value.add(groupId);
  }
}

const allGroupsExpanded = computed(() => {
  return expenseGroupStore.groups.length > 0 &&
    expenseGroupStore.groups.every((g) => expandedGroups.value.has(g.id));
});

function toggleAllGroups() {
  if (allGroupsExpanded.value) {
    expandedGroups.value.clear();
  } else {
    expenseGroupStore.groups.forEach((g) => expandedGroups.value.add(g.id));
  }
}

function openMoveExpenseModal(expense: Expense) {
  selectedExpenseForMove.value = expense;
  error.value = null;
  showMoveExpenseModal.value = true;
}

async function handleGroupSubmit() {
  error.value = null;

  if (!groupForm.name.trim()) {
    error.value = 'Please enter a group name.';
    return;
  }

  loading.value = true;

  if (editingGroup.value) {
    const result = await expenseGroupStore.updateGroup(editingGroup.value.id, {
      name: groupForm.name,
      description: groupForm.description || undefined,
    });

    if (!result.success && result.error) {
      error.value = typeof result.error.message === 'string'
        ? result.error.message
        : result.error.message[0];
      loading.value = false;
      return;
    }
  } else {
    const result = await expenseGroupStore.createGroup({
      name: groupForm.name,
      description: groupForm.description || undefined,
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
  showGroupModal.value = false;
  resetGroupForm();
}

async function handleDeleteGroup(group: ExpenseGroup) {
  const result = await expenseGroupStore.deleteGroup(group.id);

  if (result.success) {
    await Promise.all([
      budgetStore.fetchBudgetPeriod(budgetPeriodId),
      expenseGroupStore.fetchGroups(budgetPeriodId),
    ]);
  }
}

async function handleMoveExpense(targetGroupId: string | null) {
  if (!selectedExpenseForMove.value) return;

  loading.value = true;

  const result = await expenseGroupStore.moveExpenses({
    expenseIds: [selectedExpenseForMove.value.id],
    targetGroupId,
  });

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  showMoveExpenseModal.value = false;
  selectedExpenseForMove.value = null;

  await Promise.all([
    budgetStore.fetchBudgetPeriod(budgetPeriodId),
    expenseGroupStore.fetchGroups(budgetPeriodId),
  ]);
}

async function handleRemoveFromGroup(expense: Expense) {
  const result = await expenseGroupStore.removeExpenseFromGroup(expense.id);

  if (result.success) {
    await Promise.all([
      budgetStore.fetchBudgetPeriod(budgetPeriodId),
      expenseGroupStore.fetchGroups(budgetPeriodId),
    ]);
  }
}

function getGroupTotal(group: ExpenseGroup) {
  return group.expenses.reduce((sum, e) => sum + e.amount, 0);
}

const ungroupedExpenses = computed(() => {
  if (!period.value) return [];
  return period.value.expenses.filter((e) => !e.expenseGroupId);
});

onMounted(async () => {
  await Promise.all([
    budgetStore.fetchBudgetPeriod(budgetPeriodId),
    budgetStore.fetchBudgetSummary(budgetPeriodId),
    expenseStore.fetchCategories(),
    expenseGroupStore.fetchGroups(budgetPeriodId),
  ]);
});

const period = computed(() => budgetStore.currentPeriod);
const summary = computed(() => budgetStore.currentSummary);

const spendingPercentage = computed(() => {
  if (!summary.value || !period.value || period.value.income === 0) return 0;
  return Math.min(100, (summary.value.totalExpenses / period.value.income) * 100);
});

const sortedCategories = computed(() => {
  if (!summary.value?.expensesByCategory) return [];
  return Object.entries(summary.value.expensesByCategory)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.total - a.total);
});

const topCategory = computed(() => {
  if (sortedCategories.value.length === 0) return null;
  return sortedCategories.value[0];
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

function resetExpenseForm() {
  expenseForm.name = '';
  expenseForm.description = '';
  expenseForm.amount = 0;
  showNewCategoryInput.value = false;
  newCategoryName.value = '';
  expenseForm.categoryId = '';
  expenseForm.expenseGroupId = '';
  showNewGroupInput.value = false;
  newGroupName.value = '';
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
  expenseForm.expenseGroupId = expense.expenseGroupId || '';
  showNewGroupInput.value = false;
  newGroupName.value = '';
  showExpenseModal.value = true;
}

function openEditPeriod() {
  if (period.value) {
    editPeriodForm.name = period.value.name || '';
    editPeriodForm.startDate = period.value.startDate.split('T')[0];
    editPeriodForm.endDate = period.value.endDate.split('T')[0];
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

async function handleCreateCategory() {
  if (!newCategoryName.value.trim()) {
    return;
  }

  categoryLoading.value = true;
  const result = await expenseStore.createCategory({ name: newCategoryName.value.trim() });
  categoryLoading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  // Select the newly created category
  if (result.data) {
    expenseForm.categoryId = result.data.id;
  }

  // Reset the new category input
  showNewCategoryInput.value = false;
  newCategoryName.value = '';
}

function cancelNewCategory() {
  showNewCategoryInput.value = false;
  newCategoryName.value = '';
}

async function handleCreateGroupInline() {
  if (!newGroupName.value.trim()) {
    return;
  }

  groupLoading.value = true;
  const result = await expenseGroupStore.createGroup({
    name: newGroupName.value.trim(),
    budgetPeriodId,
  });
  groupLoading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  // Select the newly created group
  if (result.data) {
    expenseForm.expenseGroupId = result.data.id;
  }

  showNewGroupInput.value = false;
  newGroupName.value = '';
}

function cancelNewGroup() {
  showNewGroupInput.value = false;
  newGroupName.value = '';
}

async function handleExpenseSubmit() {
  error.value = null;

  if (!expenseForm.name || !expenseForm.amount || !expenseForm.categoryId) {
    error.value = 'Please fill in all required fields.';
    return;
  }

  loading.value = true;

  if (editingExpense.value) {
    // Determine the group change - handle setting to null for removing from group
    const groupIdToSend = expenseForm.expenseGroupId || null;
    const hasGroupChanged = groupIdToSend !== (editingExpense.value.expenseGroupId || null);

    const result = await expenseStore.updateExpense(editingExpense.value.id, {
      name: expenseForm.name,
      description: expenseForm.description || undefined,
      amount: expenseForm.amount,
      categoryId: expenseForm.categoryId,
      ...(hasGroupChanged && { expenseGroupId: groupIdToSend }),
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
      ...(expenseForm.expenseGroupId && { expenseGroupId: expenseForm.expenseGroupId }),
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
    expenseGroupStore.fetchGroups(budgetPeriodId),
  ]);
}

async function handleEditPeriodSubmit() {
  error.value = null;

  if (!editPeriodForm.startDate || !editPeriodForm.endDate) {
    error.value = 'Please fill in the date range.';
    return;
  }

  if (new Date(editPeriodForm.startDate) >= new Date(editPeriodForm.endDate)) {
    error.value = 'Start date must be before end date.';
    return;
  }

  if (!editPeriodForm.income || editPeriodForm.income <= 0) {
    error.value = 'Please enter a valid income amount.';
    return;
  }

  loading.value = true;

  const result = await budgetStore.updateBudgetPeriod(budgetPeriodId, {
    name: editPeriodForm.name || undefined,
    startDate: editPeriodForm.startDate,
    endDate: editPeriodForm.endDate,
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
  await Promise.all([
    budgetStore.fetchBudgetPeriod(budgetPeriodId),
    budgetStore.fetchBudgetSummary(budgetPeriodId),
  ]);
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
      expenseGroupStore.fetchGroups(budgetPeriodId),
    ]);
  }
}

async function handleDeleteBudgetPeriod() {
  const result = await budgetStore.deleteBudgetPeriod(budgetPeriodId);

  if (result.success) {
    router.push('/dashboard');
  }
}

const categoryColors: Record<string, { bg: string; text: string; bar: string }> = {
  Bills: { bg: 'bg-danger-50', text: 'text-danger-700', bar: 'bg-danger-500' },
  Food: { bg: 'bg-warning-50', text: 'text-warning-700', bar: 'bg-warning-500' },
  Transport: { bg: 'bg-primary-50', text: 'text-primary-700', bar: 'bg-primary-500' },
  Savings: { bg: 'bg-success-50', text: 'text-success-700', bar: 'bg-success-500' },
  Entertainment: { bg: 'bg-accent-50', text: 'text-accent-700', bar: 'bg-accent-500' },
};

function getCategoryStyle(categoryName: string) {
  return categoryColors[categoryName] || { bg: 'bg-secondary-100', text: 'text-secondary-700', bar: 'bg-secondary-500' };
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="budgetStore.loading" class="text-center py-16">
      <div class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-secondary-500">Loading budget period...</p>
    </div>

    <div v-else-if="period">
      <!-- Header -->
      <div class="mb-8">
        <button
          class="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm mb-4 group"
          @click="router.push('/dashboard')"
        >
          <ArrowLeftIcon class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 class="text-2xl font-bold text-secondary-900">
              {{ period.name || `${formatDate(period.startDate)} - ${formatDate(period.endDate)}` }}
            </h1>
            <p v-if="period.name" class="text-secondary-500 mt-1">
              {{ formatDate(period.startDate) }} - {{ formatDate(period.endDate) }}
            </p>
          </div>

          <div class="flex gap-2">
            <button
              class="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 border border-secondary-200 rounded-lg transition-colors"
              @click="openEditPeriod"
            >
              <PencilIcon class="w-4 h-4" />
              <span class="hidden sm:inline">Edit</span>
            </button>
            <button
              class="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 border border-secondary-200 rounded-lg transition-colors"
              @click="openDuplicateModal"
            >
              <DocumentDuplicateIcon class="w-4 h-4" />
              <span class="hidden sm:inline">Duplicate</span>
            </button>
            <button
              class="flex items-center gap-2 px-4 py-2 text-danger-600 hover:text-danger-700 hover:bg-danger-50 border border-danger-200 rounded-lg transition-colors"
              @click="showDeleteConfirm = true"
            >
              <TrashIcon class="w-4 h-4" />
              <span class="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Income Card -->
        <div
          class="bg-white rounded-xl shadow-card border border-secondary-100 p-5 cursor-pointer hover:shadow-card-hover hover:border-primary-200 transition-all group"
          @click="openEditPeriod"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center group-hover:bg-success-100 transition-colors">
              <ArrowTrendingUpIcon class="w-5 h-5 text-success-600" />
            </div>
            <span class="text-sm font-medium text-secondary-500">Income</span>
          </div>
          <p class="text-2xl font-bold text-success-600">{{ formatCurrency(period.income) }}</p>
          <p class="text-xs text-secondary-400 mt-2">Click to edit</p>
        </div>

        <!-- Total Expenses Card -->
        <div class="bg-white rounded-xl shadow-card border border-secondary-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-danger-50 rounded-lg flex items-center justify-center">
              <CreditCardIcon class="w-5 h-5 text-danger-600" />
            </div>
            <span class="text-sm font-medium text-secondary-500">Expenses</span>
          </div>
          <p class="text-2xl font-bold text-danger-600">{{ formatCurrency(summary?.totalExpenses || 0) }}</p>
          <p class="text-xs text-secondary-400 mt-2">{{ period.expenses.length }} expense{{ period.expenses.length === 1 ? '' : 's' }}</p>
        </div>

        <!-- Remaining Card -->
        <div class="bg-white rounded-xl shadow-card border border-secondary-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <WalletIcon class="w-5 h-5 text-primary-600" />
            </div>
            <span class="text-sm font-medium text-secondary-500">Remaining</span>
          </div>
          <p
            class="text-2xl font-bold"
            :class="(summary?.remaining || 0) >= 0 ? 'text-primary-600' : 'text-danger-600'"
          >
            {{ formatCurrency(summary?.remaining || 0) }}
          </p>
          <p class="text-xs text-secondary-400 mt-2">
            {{ ((summary?.remaining || 0) / period.income * 100).toFixed(1) }}% of budget
          </p>
        </div>

        <!-- Budget Used Card -->
        <div class="bg-white rounded-xl shadow-card border border-secondary-100 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="spendingPercentage > 100 ? 'bg-danger-50' : spendingPercentage > 80 ? 'bg-warning-50' : 'bg-success-50'"
            >
              <ChartPieIcon
                class="w-5 h-5"
                :class="spendingPercentage > 100 ? 'text-danger-600' : spendingPercentage > 80 ? 'text-warning-600' : 'text-success-600'"
              />
            </div>
            <span class="text-sm font-medium text-secondary-500">Budget Used</span>
          </div>
          <p
            class="text-2xl font-bold"
            :class="spendingPercentage > 100 ? 'text-danger-600' : spendingPercentage > 80 ? 'text-warning-600' : 'text-success-600'"
          >
            {{ spendingPercentage.toFixed(1) }}%
          </p>
          <div class="mt-3 h-2 bg-secondary-100 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-500"
              :class="spendingPercentage > 100 ? 'bg-danger-500' : spendingPercentage > 80 ? 'bg-warning-500' : 'bg-primary-500'"
              :style="{ width: `${Math.min(100, spendingPercentage)}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Expenses by Category -->
      <div v-if="sortedCategories.length > 0" class="bg-white rounded-xl shadow-card border border-secondary-100 p-6 mb-8">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-lg font-semibold text-secondary-800 flex items-center gap-2">
            <TagIcon class="w-5 h-5 text-primary-500" />
            Expenses by Category
          </h2>
          <p v-if="topCategory" class="text-sm text-secondary-500">
            Top: <span class="font-medium text-secondary-700">{{ topCategory.name }}</span>
            <span class="text-primary-600 ml-1">({{ ((topCategory.total / (summary?.totalExpenses || 1)) * 100).toFixed(0) }}%)</span>
          </p>
        </div>
        <div class="space-y-4">
          <div
            v-for="category in sortedCategories"
            :key="category.name"
            class="space-y-2"
          >
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-3">
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="[getCategoryStyle(category.name).bg, getCategoryStyle(category.name).text]"
                >
                  {{ category.name }}
                </span>
                <span class="text-sm text-secondary-500">{{ category.count }} expense{{ category.count === 1 ? '' : 's' }}</span>
              </div>
              <div class="text-right">
                <span class="font-semibold text-secondary-900">{{ formatCurrency(category.total) }}</span>
                <span class="text-xs text-secondary-400 ml-2">({{ ((category.total / (summary?.totalExpenses || 1)) * 100).toFixed(0) }}%)</span>
              </div>
            </div>
            <div class="h-2 bg-secondary-100 rounded-full overflow-hidden">
              <div
                class="h-full transition-all duration-500"
                :class="getCategoryStyle(category.name).bar"
                :style="{ width: `${(category.total / (summary?.totalExpenses || 1)) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Expenses List -->
      <div class="bg-white rounded-xl shadow-card border border-secondary-100 p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-secondary-800 flex items-center gap-2">
            <CreditCardIcon class="w-5 h-5 text-primary-500" />
            Expenses
          </h2>
          <div class="flex gap-2">
            <button
              v-if="expenseGroupStore.groups.length > 0"
              class="flex items-center gap-2 px-3 py-2 text-secondary-600 hover:text-accent-600 hover:bg-accent-50 border border-secondary-200 rounded-lg transition-colors font-medium"
              :title="allGroupsExpanded ? 'Collapse all groups' : 'Expand all groups'"
              @click="toggleAllGroups"
            >
              <component
                :is="allGroupsExpanded ? ChevronDoubleUpIcon : ChevronDoubleDownIcon"
                class="w-5 h-5"
              />
              <span class="hidden sm:inline">{{ allGroupsExpanded ? 'Collapse' : 'Expand' }}</span>
            </button>
            <button
              class="flex items-center gap-2 px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 border border-secondary-200 rounded-lg transition-colors font-medium"
              @click="openCreateGroupModal"
            >
              <FolderPlusIcon class="w-5 h-5" />
              <span class="hidden sm:inline">New Group</span>
            </button>
            <button
              class="flex items-center gap-2 px-3 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors font-medium"
              @click="openBulkExpenseModal"
            >
              <QueueListIcon class="w-5 h-5" />
              <span class="hidden sm:inline">Bulk Add</span>
            </button>
            <button
              class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
              @click="openAddExpense"
            >
              <PlusIcon class="w-5 h-5" />
              <span class="hidden sm:inline">Add Expense</span>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="period.expenses.length === 0" class="text-center py-12">
          <div class="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BanknotesIcon class="w-8 h-8 text-secondary-400" />
          </div>
          <p class="text-secondary-500 mb-4">No expenses yet. Add your first expense to start tracking.</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
              @click="openAddExpense"
            >
              <PlusIcon class="w-5 h-5" />
              Add Expense
            </button>
            <button
              class="flex items-center gap-2 px-5 py-2.5 text-primary-600 hover:text-primary-700 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors font-medium"
              @click="openBulkExpenseModal"
            >
              <QueueListIcon class="w-5 h-5" />
              Add Multiple
            </button>
          </div>
        </div>

        <!-- Expenses Content -->
        <div v-else class="space-y-4">
          <!-- Expense Groups -->
          <div v-if="expenseGroupStore.groups.length > 0" class="space-y-3">
            <div
              v-for="group in expenseGroupStore.groups"
              :key="group.id"
              class="border border-secondary-200 rounded-xl overflow-hidden"
            >
              <!-- Group Header -->
              <div
                class="flex items-center justify-between p-4 bg-secondary-50 cursor-pointer hover:bg-secondary-100 transition-colors"
                @click="toggleGroupExpanded(group.id)"
              >
                <div class="flex items-center gap-3">
                  <component
                    :is="expandedGroups.has(group.id) ? ChevronDownIcon : ChevronRightIcon"
                    class="w-5 h-5 text-secondary-400"
                  />
                  <FolderIcon class="w-5 h-5 text-accent-500" />
                  <div>
                    <p class="font-medium text-secondary-900">{{ group.name }}</p>
                    <p v-if="group.description" class="text-xs text-secondary-500">{{ group.description }}</p>
                  </div>
                  <span class="px-2 py-0.5 bg-secondary-200 text-secondary-600 text-xs rounded-full">
                    {{ group.expenses.length }} expense{{ group.expenses.length === 1 ? '' : 's' }}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <p class="font-bold text-danger-600">{{ formatCurrency(getGroupTotal(group)) }}</p>
                  <div class="flex gap-1" @click.stop>
                    <button
                      class="p-1.5 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      @click="openEditGroupModal(group)"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button
                      class="p-1.5 text-secondary-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                      @click="handleDeleteGroup(group)"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Group Expenses -->
              <div v-if="expandedGroups.has(group.id)" class="border-t border-secondary-200">
                <div v-if="group.expenses.length === 0" class="p-4 text-center text-secondary-400 text-sm">
                  No expenses in this group
                </div>
                <div v-else class="divide-y divide-secondary-100">
                  <div
                    v-for="expense in group.expenses"
                    :key="expense.id"
                    class="flex justify-between items-center p-4 hover:bg-secondary-50 transition-colors group"
                  >
                    <div class="flex-1">
                      <div class="flex items-center gap-3">
                        <p class="font-medium text-secondary-900">{{ expense.name }}</p>
                        <span
                          class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="[getCategoryStyle(expense.category.name).bg, getCategoryStyle(expense.category.name).text]"
                        >
                          {{ expense.category.name }}
                        </span>
                      </div>
                      <p v-if="expense.description" class="text-sm text-secondary-500 mt-1">{{ expense.description }}</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <p class="font-bold text-danger-600">{{ formatCurrency(expense.amount) }}</p>
                      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          class="p-2 text-secondary-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                          title="Move to another group"
                          @click="openMoveExpenseModal(expense)"
                        >
                          <ArrowsRightLeftIcon class="w-4 h-4" />
                        </button>
                        <button
                          class="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          @click="openEditExpense(expense)"
                        >
                          <PencilIcon class="w-4 h-4" />
                        </button>
                        <button
                          class="p-2 text-secondary-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                          @click="handleDeleteExpense(expense)"
                        >
                          <TrashIcon class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ungrouped Expenses -->
          <div v-if="ungroupedExpenses.length > 0" class="space-y-3">
            <p v-if="expenseGroupStore.groups.length > 0" class="text-sm font-medium text-secondary-500 mt-4">
              Ungrouped Expenses
            </p>
            <div
              v-for="expense in ungroupedExpenses"
              :key="expense.id"
              class="flex justify-between items-center p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors group"
            >
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <p class="font-medium text-secondary-900">{{ expense.name }}</p>
                  <span
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="[getCategoryStyle(expense.category.name).bg, getCategoryStyle(expense.category.name).text]"
                  >
                    {{ expense.category.name }}
                  </span>
                </div>
                <p v-if="expense.description" class="text-sm text-secondary-500 mt-1">{{ expense.description }}</p>
              </div>
              <div class="flex items-center gap-4">
                <p class="font-bold text-danger-600 text-lg">{{ formatCurrency(expense.amount) }}</p>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    v-if="expenseGroupStore.groups.length > 0"
                    class="p-2 text-secondary-400 hover:text-accent-600 hover:bg-accent-50 rounded-lg transition-colors"
                    title="Move to a group"
                    @click="openMoveExpenseModal(expense)"
                  >
                    <ArrowsRightLeftIcon class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    @click="openEditExpense(expense)"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 text-secondary-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                    @click="handleDeleteExpense(expense)"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Expense Modal -->
    <Teleport to="body">
      <div
        v-if="showExpenseModal"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showExpenseModal = false"
      >
        <div class="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <CreditCardIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900">
                {{ editingExpense ? 'Edit Expense' : 'Add Expense' }}
              </h2>
              <p class="text-sm text-secondary-500">{{ editingExpense ? 'Update expense details' : 'Track a new expense' }}</p>
            </div>
          </div>

          <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

          <form @submit.prevent="handleExpenseSubmit" class="space-y-5">
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

            <div class="space-y-2">
              <UiBaseSelect
                v-if="!showNewCategoryInput"
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
                  {{ category.name }}{{ category.isDefault ? '' : ' (Custom)' }}
                </option>
              </UiBaseSelect>

              <div v-if="showNewCategoryInput" class="space-y-2">
                <label class="text-sm font-medium text-secondary-700">New Category</label>
                <div class="flex gap-2">
                  <input
                    v-model="newCategoryName"
                    type="text"
                    placeholder="Category name"
                    class="flex-1 px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    @keyup.enter="handleCreateCategory"
                  />
                  <button
                    type="button"
                    class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                    :disabled="categoryLoading"
                    @click="handleCreateCategory"
                  >
                    <span v-if="categoryLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
                    <span v-else>Add</span>
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 text-secondary-600 hover:bg-secondary-50 border border-secondary-200 rounded-lg transition-colors"
                    @click="cancelNewCategory"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <button
                v-if="!showNewCategoryInput"
                type="button"
                class="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
                @click="showNewCategoryInput = true"
              >
                <PlusIcon class="w-4 h-4" />
                Add custom category
              </button>
            </div>

            <!-- Group Selection (Optional) -->
            <div class="space-y-2">
              <UiBaseSelect
                v-if="!showNewGroupInput"
                v-model="expenseForm.expenseGroupId"
                label="Group (Optional)"
              >
                <option value="">No group</option>
                <option
                  v-for="group in expenseGroupStore.groups"
                  :key="group.id"
                  :value="group.id"
                >
                  {{ group.name }}
                </option>
              </UiBaseSelect>

              <div v-if="showNewGroupInput" class="space-y-2">
                <label class="text-sm font-medium text-secondary-700">New Group</label>
                <div class="flex gap-2">
                  <input
                    v-model="newGroupName"
                    type="text"
                    placeholder="Group name"
                    class="flex-1 px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                    @keyup.enter.prevent="handleCreateGroupInline"
                  />
                  <button
                    type="button"
                    class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                    :disabled="groupLoading"
                    @click="handleCreateGroupInline"
                  >
                    <span v-if="groupLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
                    <span v-else>Add</span>
                  </button>
                  <button
                    type="button"
                    class="px-4 py-2 text-secondary-600 hover:bg-secondary-50 border border-secondary-200 rounded-lg transition-colors"
                    @click="cancelNewGroup"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <button
                v-if="!showNewGroupInput"
                type="button"
                class="flex items-center gap-1 text-sm text-accent-600 hover:text-accent-700 font-medium"
                @click="showNewGroupInput = true"
              >
                <FolderPlusIcon class="w-4 h-4" />
                Create new group
              </button>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
                @click="showExpenseModal = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium disabled:opacity-50"
                :disabled="loading"
              >
                <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <CheckCircleIcon v-else class="w-5 h-5" />
                {{ editingExpense ? 'Update' : 'Add Expense' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Edit Budget Period Modal -->
    <Teleport to="body">
      <div
        v-if="showEditPeriodModal"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showEditPeriodModal = false"
      >
        <div class="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <PencilIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900">Edit Budget Period</h2>
              <p class="text-sm text-secondary-500">Update period details</p>
            </div>
          </div>

          <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

          <form @submit.prevent="handleEditPeriodSubmit" class="space-y-5">
            <UiBaseInput
              v-model="editPeriodForm.name"
              label="Name (Optional)"
              placeholder="e.g., January 2026"
            />

            <div class="grid grid-cols-2 gap-4">
              <UiBaseInput
                v-model="editPeriodForm.startDate"
                label="Start Date"
                type="date"
                required
              />
              <UiBaseInput
                v-model="editPeriodForm.endDate"
                label="End Date"
                type="date"
                required
              />
            </div>

            <UiBaseInput
              v-model="editPeriodForm.income"
              label="Income"
              type="number"
              :placeholder="`Amount in ${authStore.user?.settings?.currency || 'USD'}`"
              required
            />

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
                @click="showEditPeriodModal = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium disabled:opacity-50"
                :disabled="loading"
              >
                <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <CheckCircleIcon v-else class="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Duplicate Budget Period Modal -->
    <Teleport to="body">
      <div
        v-if="showDuplicateModal"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showDuplicateModal = false"
      >
        <div class="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <DocumentDuplicateIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900">Duplicate Budget Period</h2>
              <p class="text-sm text-secondary-500">Create a copy with the same expenses</p>
            </div>
          </div>

          <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

          <form @submit.prevent="handleDuplicateSubmit" class="space-y-5">
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

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
                @click="showDuplicateModal = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium disabled:opacity-50"
                :disabled="loading"
              >
                <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <DocumentDuplicateIcon v-else class="w-5 h-5" />
                Duplicate
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showDeleteConfirm = false"
      >
        <div class="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-danger-50 rounded-xl flex items-center justify-center">
              <ExclamationTriangleIcon class="w-6 h-6 text-danger-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900">Delete Budget Period</h2>
              <p class="text-sm text-secondary-500">This action cannot be undone</p>
            </div>
          </div>

          <p class="text-secondary-600 mb-6">
            Are you sure you want to delete this budget period? This will also delete all associated expenses.
          </p>

          <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100">
            <button
              type="button"
              class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
              @click="showDeleteConfirm = false"
            >
              Cancel
            </button>
            <button
              type="button"
              class="flex items-center gap-2 px-5 py-2.5 bg-danger-600 hover:bg-danger-700 text-white rounded-lg transition-colors font-medium"
              @click="handleDeleteBudgetPeriod"
            >
              <TrashIcon class="w-5 h-5" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Bulk Expense Modal -->
    <Teleport to="body">
      <div
        v-if="showBulkExpenseModal"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showBulkExpenseModal = false"
      >
        <div class="bg-white rounded-2xl shadow-elevated max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <QueueListIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-secondary-900">Add Multiple Expenses</h2>
              <p class="text-sm text-secondary-500">Add several expenses at once</p>
            </div>
            <button
              type="button"
              class="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors"
              @click="showBulkExpenseModal = false"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

          <form @submit.prevent="handleBulkExpenseSubmit" class="space-y-4">
            <!-- Category Creation -->
            <div v-if="showBulkNewCategoryInput" class="bg-secondary-50 rounded-xl p-4 mb-4">
              <label class="text-sm font-medium text-secondary-700 mb-2 block">Create New Category</label>
              <div class="flex gap-2">
                <input
                  v-model="bulkNewCategoryName"
                  type="text"
                  placeholder="Category name"
                  class="flex-1 px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  @keyup.enter="handleBulkCreateCategory"
                />
                <button
                  type="button"
                  class="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                  :disabled="categoryLoading"
                  @click="handleBulkCreateCategory"
                >
                  <span v-if="categoryLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
                  <span v-else>Add</span>
                </button>
                <button
                  type="button"
                  class="px-4 py-2 text-secondary-600 hover:bg-secondary-100 border border-secondary-200 rounded-lg transition-colors"
                  @click="cancelBulkNewCategory"
                >
                  Cancel
                </button>
              </div>
            </div>

            <button
              v-if="!showBulkNewCategoryInput"
              type="button"
              class="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium mb-4"
              @click="showBulkNewCategoryInput = true"
            >
              <PlusIcon class="w-4 h-4" />
              Add custom category
            </button>

            <!-- Group Creation -->
            <div v-if="showBulkNewGroupInput" class="bg-accent-50 rounded-xl p-4 mb-4">
              <label class="text-sm font-medium text-secondary-700 mb-2 block">Create New Group</label>
              <div class="flex gap-2">
                <input
                  v-model="bulkNewGroupName"
                  type="text"
                  placeholder="Group name"
                  class="flex-1 px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                  @keyup.enter.prevent="handleBulkCreateGroup"
                />
                <button
                  type="button"
                  class="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                  :disabled="groupLoading"
                  @click="handleBulkCreateGroup"
                >
                  <span v-if="groupLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block"></span>
                  <span v-else>Add</span>
                </button>
                <button
                  type="button"
                  class="px-4 py-2 text-secondary-600 hover:bg-secondary-100 border border-secondary-200 rounded-lg transition-colors"
                  @click="cancelBulkNewGroup"
                >
                  Cancel
                </button>
              </div>
            </div>

            <button
              v-if="!showBulkNewGroupInput"
              type="button"
              class="flex items-center gap-1 text-sm text-accent-600 hover:text-accent-700 font-medium mb-4"
              @click="showBulkNewGroupInput = true"
            >
              <FolderPlusIcon class="w-4 h-4" />
              Create new group
            </button>

            <!-- Expense Rows -->
            <div class="space-y-3">
              <div
                v-for="(expense, index) in bulkExpenses"
                :key="index"
                class="bg-secondary-50 rounded-xl p-4"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-medium text-secondary-600">Expense {{ index + 1 }}</span>
                  <button
                    v-if="bulkExpenses.length > 1"
                    type="button"
                    class="p-1 text-secondary-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                    @click="removeBulkExpenseRow(index)"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <input
                    v-model="expense.name"
                    type="text"
                    placeholder="Expense name *"
                    class="px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />

                  <input
                    v-model="expense.description"
                    type="text"
                    placeholder="Description (optional)"
                    class="px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />

                  <input
                    v-model.number="expense.amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Amount *"
                    class="px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />

                  <select
                    v-model="expense.categoryId"
                    class="px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="" disabled>Category *</option>
                    <option
                      v-for="category in expenseStore.categories"
                      :key="category.id"
                      :value="category.id"
                    >
                      {{ category.name }}
                    </option>
                  </select>

                  <select
                    v-model="expense.expenseGroupId"
                    class="px-3 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="">No group</option>
                    <option
                      v-for="group in expenseGroupStore.groups"
                      :key="group.id"
                      :value="group.id"
                    >
                      {{ group.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Add Row Button -->
            <button
              type="button"
              class="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-secondary-300 hover:border-primary-400 text-secondary-500 hover:text-primary-600 rounded-xl transition-colors"
              @click="addBulkExpenseRow"
            >
              <PlusIcon class="w-5 h-5" />
              Add Another Expense
            </button>

            <!-- Summary -->
            <div class="bg-primary-50 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p class="text-sm text-secondary-600">
                  <span class="font-medium">{{ validBulkExpensesCount }}</span> valid expense{{ validBulkExpensesCount === 1 ? '' : 's' }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm text-secondary-500">Total</p>
                <p class="text-xl font-bold text-primary-600">{{ formatCurrency(bulkExpensesTotal) }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
                @click="showBulkExpenseModal = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium disabled:opacity-50"
                :disabled="loading || validBulkExpensesCount === 0"
              >
                <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <CheckCircleIcon v-else class="w-5 h-5" />
                Add {{ validBulkExpensesCount }} Expense{{ validBulkExpensesCount === 1 ? '' : 's' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Create/Edit Group Modal -->
    <Teleport to="body">
      <div
        v-if="showGroupModal"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showGroupModal = false"
      >
        <div class="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center">
              <FolderIcon class="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900">
                {{ editingGroup ? 'Edit Group' : 'Create Group' }}
              </h2>
              <p class="text-sm text-secondary-500">
                {{ editingGroup ? 'Update group details' : 'Organize your expenses into groups' }}
              </p>
            </div>
          </div>

          <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

          <form @submit.prevent="handleGroupSubmit" class="space-y-5">
            <UiBaseInput
              v-model="groupForm.name"
              label="Group Name"
              placeholder="e.g., Monthly Bills, Groceries"
              required
            />

            <UiBaseInput
              v-model="groupForm.description"
              label="Description (Optional)"
              placeholder="Brief description of this group"
            />

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
                @click="showGroupModal = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium disabled:opacity-50"
                :disabled="loading"
              >
                <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <CheckCircleIcon v-else class="w-5 h-5" />
                {{ editingGroup ? 'Update' : 'Create Group' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Move Expense Modal -->
    <Teleport to="body">
      <div
        v-if="showMoveExpenseModal"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showMoveExpenseModal = false"
      >
        <div class="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center">
              <ArrowsRightLeftIcon class="w-6 h-6 text-accent-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900">Move Expense</h2>
              <p class="text-sm text-secondary-500">
                Move "{{ selectedExpenseForMove?.name }}" to a group
              </p>
            </div>
          </div>

          <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

          <div class="space-y-2">
            <!-- Remove from group option -->
            <button
              v-if="selectedExpenseForMove?.expenseGroupId"
              type="button"
              class="w-full flex items-center gap-3 p-4 border border-secondary-200 rounded-xl hover:bg-secondary-50 transition-colors text-left"
              @click="handleMoveExpense(null)"
            >
              <div class="w-10 h-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                <XMarkIcon class="w-5 h-5 text-secondary-500" />
              </div>
              <div>
                <p class="font-medium text-secondary-900">Remove from group</p>
                <p class="text-sm text-secondary-500">Move to ungrouped expenses</p>
              </div>
            </button>

            <!-- Group options -->
            <button
              v-for="group in expenseGroupStore.groups.filter(g => g.id !== selectedExpenseForMove?.expenseGroupId)"
              :key="group.id"
              type="button"
              class="w-full flex items-center gap-3 p-4 border border-secondary-200 rounded-xl hover:bg-accent-50 hover:border-accent-300 transition-colors text-left"
              @click="handleMoveExpense(group.id)"
            >
              <div class="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
                <FolderIcon class="w-5 h-5 text-accent-500" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-secondary-900">{{ group.name }}</p>
                <p class="text-sm text-secondary-500">{{ group.expenses.length }} expense{{ group.expenses.length === 1 ? '' : 's' }}</p>
              </div>
            </button>

            <div v-if="expenseGroupStore.groups.length === 0" class="text-center py-6 text-secondary-500">
              No groups available. Create a group first.
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 mt-4 border-t border-secondary-100">
            <button
              type="button"
              class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
              @click="showMoveExpenseModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
