<script setup lang="ts">
import type { Expense, BulkExpenseItem, ExpenseGroup, Income, IncomeItem } from '~/types';
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
});

const duplicateForm = reactive({
  name: '',
  startDate: '',
  endDate: '',
});

const groupForm = reactive({
  name: '',
  description: '',
});

const showIncomeModal = ref(false);
const editingIncome = ref<Income | null>(null);
const incomeForm = reactive({
  name: '',
  description: '',
  amount: 0,
});

// Delete confirmation states
const showDeleteExpenseConfirm = ref(false);
const showDeleteIncomeConfirm = ref(false);
const showDeleteGroupConfirm = ref(false);
const expenseToDelete = ref<Expense | null>(null);
const incomeToDelete = ref<Income | null>(null);
const groupToDelete = ref<ExpenseGroup | null>(null);
const deleteLoading = ref(false);

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

  // Update local state
  if (result.data && budgetStore.currentPeriod) {
    // Add all new expenses to the period
    budgetStore.currentPeriod.expenses.unshift(...result.data);

    // Update summary
    if (budgetStore.currentSummary) {
      for (const expense of result.data) {
        budgetStore.currentSummary.totalExpenses += expense.amount;
        budgetStore.currentSummary.remaining -= expense.amount;

        const categoryName = expense.category.name;
        if (!budgetStore.currentSummary.expensesByCategory[categoryName]) {
          budgetStore.currentSummary.expensesByCategory[categoryName] = { total: 0, count: 0 };
        }
        budgetStore.currentSummary.expensesByCategory[categoryName].total += expense.amount;
        budgetStore.currentSummary.expensesByCategory[categoryName].count += 1;

        // Add to expense group if specified
        if (expense.expenseGroupId) {
          const group = expenseGroupStore.groups.find((g) => g.id === expense.expenseGroupId);
          if (group) {
            group.expenses.push(expense);
          }
        }
      }
    }
  }

  showBulkExpenseModal.value = false;
  resetBulkExpenseForm();
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

function confirmDeleteGroup(group: ExpenseGroup) {
  groupToDelete.value = group;
  showDeleteGroupConfirm.value = true;
}

async function handleDeleteGroup() {
  if (!groupToDelete.value) return;

  deleteLoading.value = true;
  const result = await expenseGroupStore.deleteGroup(groupToDelete.value.id);
  deleteLoading.value = false;

  if (result.success) {
    showDeleteGroupConfirm.value = false;
    groupToDelete.value = null;
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

// Income management functions
function resetIncomeForm() {
  incomeForm.name = '';
  incomeForm.description = '';
  incomeForm.amount = 0;
  editingIncome.value = null;
  error.value = null;
}

function openAddIncome() {
  resetIncomeForm();
  showIncomeModal.value = true;
}

function openEditIncome(income: Income) {
  editingIncome.value = income;
  incomeForm.name = income.name;
  incomeForm.description = income.description || '';
  incomeForm.amount = income.amount;
  error.value = null;
  showIncomeModal.value = true;
}

async function handleIncomeSubmit() {
  error.value = null;

  if (!incomeForm.name.trim() || !incomeForm.amount || incomeForm.amount <= 0) {
    error.value = 'Please enter a name and valid amount.';
    return;
  }

  loading.value = true;

  if (editingIncome.value) {
    const result = await budgetStore.updateIncome(editingIncome.value.id, {
      name: incomeForm.name,
      description: incomeForm.description || undefined,
      amount: incomeForm.amount,
    });

    if (!result.success && result.error) {
      error.value = typeof result.error.message === 'string'
        ? result.error.message
        : result.error.message[0];
      loading.value = false;
      return;
    }
  } else {
    const result = await budgetStore.createIncome({
      name: incomeForm.name,
      description: incomeForm.description || undefined,
      amount: incomeForm.amount,
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

  // Update summary
  if (budgetStore.currentSummary && budgetStore.currentPeriod) {
    budgetStore.currentSummary.income = budgetStore.currentPeriod.income;
    budgetStore.currentSummary.remaining = budgetStore.currentPeriod.income - budgetStore.currentSummary.totalExpenses;
  }

  loading.value = false;
  showIncomeModal.value = false;
  resetIncomeForm();
}

function confirmDeleteIncome(income: Income) {
  incomeToDelete.value = income;
  showDeleteIncomeConfirm.value = true;
}

async function handleDeleteIncome() {
  if (!incomeToDelete.value) return;

  deleteLoading.value = true;
  const result = await budgetStore.deleteIncome(incomeToDelete.value.id);
  deleteLoading.value = false;

  if (result.success) {
    showDeleteIncomeConfirm.value = false;
    incomeToDelete.value = null;
  }
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

// Compute total income from incomes array
const totalIncome = computed(() => {
  if (!period.value?.incomes) return 0;
  return period.value.incomes.reduce((sum, inc) => sum + inc.amount, 0);
});

const spendingPercentage = computed(() => {
  if (!summary.value || totalIncome.value === 0) return 0;
  return Math.min(100, (summary.value.totalExpenses / totalIncome.value) * 100);
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
  }
  error.value = null;
  showEditPeriodModal.value = true;
}

function openDuplicateModal() {
  duplicateForm.name = '';
  duplicateForm.startDate = '';
  duplicateForm.endDate = '';
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
    const oldAmount = editingExpense.value.amount;
    const oldCategoryName = editingExpense.value.category.name;
    const oldGroupId = editingExpense.value.expenseGroupId;

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

    // Update local state
    if (result.data && budgetStore.currentPeriod) {
      const index = budgetStore.currentPeriod.expenses.findIndex((e) => e.id === result.data!.id);
      if (index !== -1) {
        budgetStore.currentPeriod.expenses[index] = result.data;
      }

      // Update summary
      if (budgetStore.currentSummary) {
        const amountDiff = expenseForm.amount - oldAmount;
        budgetStore.currentSummary.totalExpenses += amountDiff;
        budgetStore.currentSummary.remaining -= amountDiff;

        // Update category totals if category changed
        const newCategoryName = result.data.category.name;
        if (oldCategoryName !== newCategoryName) {
          // Remove from old category
          if (budgetStore.currentSummary.expensesByCategory[oldCategoryName]) {
            budgetStore.currentSummary.expensesByCategory[oldCategoryName].total -= oldAmount;
            budgetStore.currentSummary.expensesByCategory[oldCategoryName].count -= 1;
            if (budgetStore.currentSummary.expensesByCategory[oldCategoryName].count === 0) {
              delete budgetStore.currentSummary.expensesByCategory[oldCategoryName];
            }
          }
          // Add to new category
          if (!budgetStore.currentSummary.expensesByCategory[newCategoryName]) {
            budgetStore.currentSummary.expensesByCategory[newCategoryName] = { total: 0, count: 0 };
          }
          budgetStore.currentSummary.expensesByCategory[newCategoryName].total += expenseForm.amount;
          budgetStore.currentSummary.expensesByCategory[newCategoryName].count += 1;
        } else {
          // Same category, just update amount
          budgetStore.currentSummary.expensesByCategory[oldCategoryName].total += amountDiff;
        }
      }

      // Update expense groups if group changed
      if (hasGroupChanged) {
        // Remove from old group
        if (oldGroupId) {
          const oldGroup = expenseGroupStore.groups.find((g) => g.id === oldGroupId);
          if (oldGroup) {
            oldGroup.expenses = oldGroup.expenses.filter((e) => e.id !== result.data!.id);
          }
        }
        // Add to new group
        if (groupIdToSend) {
          const newGroup = expenseGroupStore.groups.find((g) => g.id === groupIdToSend);
          if (newGroup) {
            newGroup.expenses.push(result.data);
          }
        }
      } else if (oldGroupId) {
        // Same group, update the expense in place
        const group = expenseGroupStore.groups.find((g) => g.id === oldGroupId);
        if (group) {
          const groupIndex = group.expenses.findIndex((e) => e.id === result.data!.id);
          if (groupIndex !== -1) {
            group.expenses[groupIndex] = result.data;
          }
        }
      }
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

    // Update local state
    if (result.data && budgetStore.currentPeriod) {
      budgetStore.currentPeriod.expenses.unshift(result.data);

      // Update summary
      if (budgetStore.currentSummary) {
        budgetStore.currentSummary.totalExpenses += result.data.amount;
        budgetStore.currentSummary.remaining -= result.data.amount;

        const categoryName = result.data.category.name;
        if (!budgetStore.currentSummary.expensesByCategory[categoryName]) {
          budgetStore.currentSummary.expensesByCategory[categoryName] = { total: 0, count: 0 };
        }
        budgetStore.currentSummary.expensesByCategory[categoryName].total += result.data.amount;
        budgetStore.currentSummary.expensesByCategory[categoryName].count += 1;
      }

      // Add to expense group if specified
      if (expenseForm.expenseGroupId) {
        const group = expenseGroupStore.groups.find((g) => g.id === expenseForm.expenseGroupId);
        if (group) {
          group.expenses.push(result.data);
        }
      }
    }
  }

  loading.value = false;
  showExpenseModal.value = false;
  resetExpenseForm();
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

  loading.value = true;

  const result = await budgetStore.updateBudgetPeriod(budgetPeriodId, {
    name: editPeriodForm.name || undefined,
    startDate: editPeriodForm.startDate,
    endDate: editPeriodForm.endDate,
  });

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  showEditPeriodModal.value = false;
}

async function handleDuplicateSubmit() {
  error.value = null;

  if (!duplicateForm.startDate || !duplicateForm.endDate) {
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
    router.push(`/budget-periods/${result.data.id}`);
  }
}

function confirmDeleteExpense(expense: Expense) {
  expenseToDelete.value = expense;
  showDeleteExpenseConfirm.value = true;
}

async function handleDeleteExpense() {
  if (!expenseToDelete.value) return;

  const expense = expenseToDelete.value;
  deleteLoading.value = true;
  const result = await expenseStore.deleteExpense(expense.id);
  deleteLoading.value = false;

  if (result.success && budgetStore.currentPeriod) {
    showDeleteExpenseConfirm.value = false;
    expenseToDelete.value = null;

    // Update local state instead of refetching
    budgetStore.currentPeriod.expenses = budgetStore.currentPeriod.expenses.filter(
      (e) => e.id !== expense.id
    );

    // Update summary
    if (budgetStore.currentSummary) {
      budgetStore.currentSummary.totalExpenses -= expense.amount;
      budgetStore.currentSummary.remaining += expense.amount;

      const categoryName = expense.category.name;
      if (budgetStore.currentSummary.expensesByCategory[categoryName]) {
        budgetStore.currentSummary.expensesByCategory[categoryName].total -= expense.amount;
        budgetStore.currentSummary.expensesByCategory[categoryName].count -= 1;
        if (budgetStore.currentSummary.expensesByCategory[categoryName].count === 0) {
          delete budgetStore.currentSummary.expensesByCategory[categoryName];
        }
      }
    }

    // Update expense group if the expense was in a group
    if (expense.expenseGroupId) {
      const group = expenseGroupStore.groups.find((g) => g.id === expense.expenseGroupId);
      if (group) {
        group.expenses = group.expenses.filter((e) => e.id !== expense.id);
      }
    }
  }
}

async function handleDeleteBudgetPeriod() {
  const result = await budgetStore.deleteBudgetPeriod(budgetPeriodId);

  if (result.success) {
    router.push('/budget-periods');
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
    <div v-if="budgetStore.loading && !period" class="text-center py-16">
      <div class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-secondary-500 dark:text-secondary-400">Loading budget period...</p>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!period" class="text-center py-16">
      <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-card p-10 max-w-md mx-auto border border-secondary-100 dark:border-secondary-700">
        <h3 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Budget period not found</h3>
        <p class="text-secondary-500 dark:text-secondary-400 mb-6">The budget period you're looking for doesn't exist or has been deleted.</p>
        <button
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
          @click="router.push('/budget-periods')"
        >
          <ArrowLeftIcon class="w-5 h-5" />
          Back to Budget Periods
        </button>
      </div>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="mb-8">
        <button
          class="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm mb-4 group"
          @click="router.push('/budget-periods')"
        >
          <ArrowLeftIcon class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Budget Periods
        </button>

        <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
              {{ period.name || `${formatDate(period.startDate)} - ${formatDate(period.endDate)}` }}
            </h1>
            <p v-if="period.name" class="text-secondary-500 dark:text-secondary-400 mt-1">
              {{ formatDate(period.startDate) }} - {{ formatDate(period.endDate) }}
            </p>
          </div>

          <div class="flex gap-2">
            <button
              class="flex items-center gap-2 px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 border border-secondary-200 dark:border-secondary-600 rounded-lg transition-colors"
              @click="openEditPeriod"
            >
              <PencilIcon class="w-4 h-4" />
              <span class="hidden sm:inline">Edit</span>
            </button>
            <button
              class="flex items-center gap-2 px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 border border-secondary-200 dark:border-secondary-600 rounded-lg transition-colors"
              @click="openDuplicateModal"
            >
              <DocumentDuplicateIcon class="w-4 h-4" />
              <span class="hidden sm:inline">Duplicate</span>
            </button>
            <button
              class="flex items-center gap-2 px-4 py-2 text-danger-600 dark:text-danger-400 hover:text-danger-700 dark:hover:text-danger-300 hover:bg-danger-50 dark:hover:bg-danger-900/50 border border-danger-200 dark:border-danger-700 rounded-lg transition-colors"
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
        <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-success-50 dark:bg-success-900/50 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon class="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <span class="text-sm font-medium text-secondary-500 dark:text-secondary-400">Income</span>
          </div>
          <p class="text-2xl font-bold text-success-600 dark:text-success-400">{{ formatCurrency(totalIncome) }}</p>
          <p class="text-xs text-secondary-400 dark:text-secondary-500 mt-2">{{ period.incomes?.length || 0 }} source{{ (period.incomes?.length || 0) === 1 ? '' : 's' }}</p>
        </div>

        <!-- Total Expenses Card -->
        <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-danger-50 dark:bg-danger-900/50 rounded-lg flex items-center justify-center">
              <CreditCardIcon class="w-5 h-5 text-danger-600 dark:text-danger-400" />
            </div>
            <span class="text-sm font-medium text-secondary-500 dark:text-secondary-400">Expenses</span>
          </div>
          <p class="text-2xl font-bold text-danger-600 dark:text-danger-400">{{ formatCurrency(summary?.totalExpenses || 0) }}</p>
          <p class="text-xs text-secondary-400 dark:text-secondary-500 mt-2">{{ period.expenses.length }} expense{{ period.expenses.length === 1 ? '' : 's' }}</p>
        </div>

        <!-- Remaining Card -->
        <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-primary-50 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
              <WalletIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <span class="text-sm font-medium text-secondary-500 dark:text-secondary-400">Remaining</span>
          </div>
          <p
            class="text-2xl font-bold"
            :class="(summary?.remaining || 0) >= 0 ? 'text-primary-600 dark:text-primary-400' : 'text-danger-600 dark:text-danger-400'"
          >
            {{ formatCurrency(summary?.remaining || 0) }}
          </p>
          <p class="text-xs text-secondary-400 dark:text-secondary-500 mt-2">
            {{ totalIncome > 0 ? ((summary?.remaining || 0) / totalIncome * 100).toFixed(1) : 0 }}% of budget
          </p>
        </div>

        <!-- Budget Used Card -->
        <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-5">
          <div class="flex items-center gap-3 mb-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="spendingPercentage > 100 ? 'bg-danger-50 dark:bg-danger-900/50' : spendingPercentage > 80 ? 'bg-warning-50 dark:bg-warning-900/50' : 'bg-success-50 dark:bg-success-900/50'"
            >
              <ChartPieIcon
                class="w-5 h-5"
                :class="spendingPercentage > 100 ? 'text-danger-600 dark:text-danger-400' : spendingPercentage > 80 ? 'text-warning-600 dark:text-warning-400' : 'text-success-600 dark:text-success-400'"
              />
            </div>
            <span class="text-sm font-medium text-secondary-500 dark:text-secondary-400">Budget Used</span>
          </div>
          <p
            class="text-2xl font-bold"
            :class="spendingPercentage > 100 ? 'text-danger-600 dark:text-danger-400' : spendingPercentage > 80 ? 'text-warning-600 dark:text-warning-400' : 'text-success-600 dark:text-success-400'"
          >
            {{ spendingPercentage.toFixed(1) }}%
          </p>
          <div class="mt-3 h-2 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-500"
              :class="spendingPercentage > 100 ? 'bg-danger-500' : spendingPercentage > 80 ? 'bg-warning-500' : 'bg-primary-500'"
              :style="{ width: `${Math.min(100, spendingPercentage)}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Income Sources Section -->
      <div v-if="period.incomes && period.incomes.length > 0" class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-6 mb-8">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 flex items-center gap-2">
            <ArrowTrendingUpIcon class="w-5 h-5 text-success-500 dark:text-success-400" />
            Income Sources
          </h2>
          <button
            class="flex items-center gap-2 px-3 py-2 text-success-600 dark:text-success-400 hover:text-success-700 dark:hover:text-success-300 hover:bg-success-50 dark:hover:bg-success-900/50 border border-success-200 dark:border-success-700 rounded-lg transition-colors font-medium"
            @click="openAddIncome"
          >
            <PlusIcon class="w-4 h-4" />
            Add Income
          </button>
        </div>

        <div class="space-y-3">
          <div
            v-for="income in period.incomes"
            :key="income.id"
            class="flex justify-between items-center p-4 bg-success-50/50 dark:bg-success-900/30 rounded-xl hover:bg-success-50 dark:hover:bg-success-900/50 transition-colors group"
          >
            <div class="flex-1">
              <p class="font-medium text-secondary-900 dark:text-secondary-100">{{ income.name }}</p>
              <p v-if="income.description" class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">{{ income.description }}</p>
            </div>
            <div class="flex items-center gap-4">
              <p class="font-bold text-success-600 dark:text-success-400 text-lg">{{ formatCurrency(income.amount) }}</p>
              <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  class="p-2 text-secondary-400 dark:text-secondary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                  @click="openEditIncome(income)"
                >
                  <PencilIcon class="w-4 h-4" />
                </button>
                <button
                  class="p-2 text-secondary-400 dark:text-secondary-500 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
                  @click="confirmDeleteIncome(income)"
                >
                  <TrashIcon class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Income Footer -->
        <div class="mt-4 pt-4 border-t border-success-100 dark:border-success-800 flex justify-between items-center">
          <span class="text-sm font-medium text-secondary-600 dark:text-secondary-400">Total Income</span>
          <span class="text-xl font-bold text-success-600 dark:text-success-400">{{ formatCurrency(totalIncome) }}</span>
        </div>
      </div>

      <!-- Add Income Button when no incomes exist -->
      <div v-else class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-6 mb-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-success-50 dark:bg-success-900/50 rounded-lg flex items-center justify-center">
              <ArrowTrendingUpIcon class="w-5 h-5 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <h3 class="font-semibold text-secondary-900 dark:text-secondary-100">Income Sources</h3>
              <p class="text-sm text-secondary-500 dark:text-secondary-400">Track your income sources</p>
            </div>
          </div>
          <button
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
            @click="openAddIncome"
          >
            <PlusIcon class="w-5 h-5" />
            Add Income
          </button>
        </div>
      </div>

      <!-- Expenses by Category -->
      <div v-if="sortedCategories.length > 0" class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-6 mb-8">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 flex items-center gap-2">
            <TagIcon class="w-5 h-5 text-primary-500 dark:text-primary-400" />
            Expenses by Category
          </h2>
          <p v-if="topCategory" class="text-sm text-secondary-500 dark:text-secondary-400">
            Top: <span class="font-medium text-secondary-700 dark:text-secondary-300">{{ topCategory.name }}</span>
            <span class="text-primary-600 dark:text-primary-400 ml-1">({{ ((topCategory.total / (summary?.totalExpenses || 1)) * 100).toFixed(0) }}%)</span>
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
                <span class="text-sm text-secondary-500 dark:text-secondary-400">{{ category.count }} expense{{ category.count === 1 ? '' : 's' }}</span>
              </div>
              <div class="text-right">
                <span class="font-semibold text-secondary-900 dark:text-secondary-100">{{ formatCurrency(category.total) }}</span>
                <span class="text-xs text-secondary-400 dark:text-secondary-500 ml-2">({{ ((category.total / (summary?.totalExpenses || 1)) * 100).toFixed(0) }}%)</span>
              </div>
            </div>
            <div class="h-2 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
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
      <div class="bg-white dark:bg-secondary-800 rounded-xl shadow-card border border-secondary-100 dark:border-secondary-700 p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-lg font-semibold text-secondary-800 dark:text-secondary-200 flex items-center gap-2">
            <CreditCardIcon class="w-5 h-5 text-primary-500 dark:text-primary-400" />
            Expenses
          </h2>
          <div class="flex gap-2">
            <button
              v-if="expenseGroupStore.groups.length > 0"
              class="flex items-center gap-2 px-3 py-2 text-secondary-600 dark:text-secondary-400 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/50 border border-secondary-200 dark:border-secondary-600 rounded-lg transition-colors font-medium"
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
              class="flex items-center gap-2 px-3 py-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 border border-secondary-200 dark:border-secondary-600 rounded-lg transition-colors font-medium"
              @click="openCreateGroupModal"
            >
              <FolderPlusIcon class="w-5 h-5" />
              <span class="hidden sm:inline">New Group</span>
            </button>
            <button
              class="flex items-center gap-2 px-3 py-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/50 border border-primary-200 dark:border-primary-700 rounded-lg transition-colors font-medium"
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
          <div class="w-16 h-16 bg-secondary-50 dark:bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BanknotesIcon class="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
          </div>
          <p class="text-secondary-500 dark:text-secondary-400 mb-4">No expenses yet. Add your first expense to start tracking.</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
              @click="openAddExpense"
            >
              <PlusIcon class="w-5 h-5" />
              Add Expense
            </button>
            <button
              class="flex items-center gap-2 px-5 py-2.5 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/50 border border-primary-200 dark:border-primary-700 rounded-lg transition-colors font-medium"
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
              class="border border-secondary-200 dark:border-secondary-600 rounded-xl overflow-hidden"
            >
              <!-- Group Header -->
              <div
                class="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-900 cursor-pointer hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
                @click="toggleGroupExpanded(group.id)"
              >
                <div class="flex items-center gap-3">
                  <component
                    :is="expandedGroups.has(group.id) ? ChevronDownIcon : ChevronRightIcon"
                    class="w-5 h-5 text-secondary-400 dark:text-secondary-500"
                  />
                  <FolderIcon class="w-5 h-5 text-accent-500 dark:text-accent-400" />
                  <div>
                    <p class="font-medium text-secondary-900 dark:text-secondary-100">{{ group.name }}</p>
                    <p v-if="group.description" class="text-xs text-secondary-500 dark:text-secondary-400">{{ group.description }}</p>
                  </div>
                  <span class="px-2 py-0.5 bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 text-xs rounded-full">
                    {{ group.expenses.length }} expense{{ group.expenses.length === 1 ? '' : 's' }}
                  </span>
                </div>
                <div class="flex items-center gap-3">
                  <p class="font-bold text-danger-600 dark:text-danger-400">{{ formatCurrency(getGroupTotal(group)) }}</p>
                  <div class="flex gap-1" @click.stop>
                    <button
                      class="p-1.5 text-secondary-400 dark:text-secondary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                      @click="openEditGroupModal(group)"
                    >
                      <PencilIcon class="w-4 h-4" />
                    </button>
                    <button
                      class="p-1.5 text-secondary-400 dark:text-secondary-500 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
                      @click="confirmDeleteGroup(group)"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- Group Expenses -->
              <div v-if="expandedGroups.has(group.id)" class="border-t border-secondary-200 dark:border-secondary-600">
                <div v-if="group.expenses.length === 0" class="p-4 text-center text-secondary-400 dark:text-secondary-500 text-sm">
                  No expenses in this group
                </div>
                <div v-else class="divide-y divide-secondary-100 dark:divide-secondary-700">
                  <div
                    v-for="expense in group.expenses"
                    :key="expense.id"
                    class="flex justify-between items-center p-4 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors group"
                  >
                    <div class="flex-1">
                      <div class="flex items-center gap-3">
                        <p class="font-medium text-secondary-900 dark:text-secondary-100">{{ expense.name }}</p>
                        <span
                          class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="[getCategoryStyle(expense.category.name).bg, getCategoryStyle(expense.category.name).text]"
                        >
                          {{ expense.category.name }}
                        </span>
                      </div>
                      <p v-if="expense.description" class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">{{ expense.description }}</p>
                    </div>
                    <div class="flex items-center gap-4">
                      <p class="font-bold text-danger-600 dark:text-danger-400">{{ formatCurrency(expense.amount) }}</p>
                      <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          class="p-2 text-secondary-400 dark:text-secondary-500 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/50 rounded-lg transition-colors"
                          title="Move to another group"
                          @click="openMoveExpenseModal(expense)"
                        >
                          <ArrowsRightLeftIcon class="w-4 h-4" />
                        </button>
                        <button
                          class="p-2 text-secondary-400 dark:text-secondary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                          @click="openEditExpense(expense)"
                        >
                          <PencilIcon class="w-4 h-4" />
                        </button>
                        <button
                          class="p-2 text-secondary-400 dark:text-secondary-500 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
                          @click="confirmDeleteExpense(expense)"
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
            <p v-if="expenseGroupStore.groups.length > 0" class="text-sm font-medium text-secondary-500 dark:text-secondary-400 mt-4">
              Ungrouped Expenses
            </p>
            <div
              v-for="expense in ungroupedExpenses"
              :key="expense.id"
              class="flex justify-between items-center p-4 bg-secondary-50 dark:bg-secondary-900 rounded-xl hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors group"
            >
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <p class="font-medium text-secondary-900 dark:text-secondary-100">{{ expense.name }}</p>
                  <span
                    class="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="[getCategoryStyle(expense.category.name).bg, getCategoryStyle(expense.category.name).text]"
                  >
                    {{ expense.category.name }}
                  </span>
                </div>
                <p v-if="expense.description" class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">{{ expense.description }}</p>
              </div>
              <div class="flex items-center gap-4">
                <p class="font-bold text-danger-600 dark:text-danger-400 text-lg">{{ formatCurrency(expense.amount) }}</p>
                <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    v-if="expenseGroupStore.groups.length > 0"
                    class="p-2 text-secondary-400 dark:text-secondary-500 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/50 rounded-lg transition-colors"
                    title="Move to a group"
                    @click="openMoveExpenseModal(expense)"
                  >
                    <ArrowsRightLeftIcon class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 text-secondary-400 dark:text-secondary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
                    @click="openEditExpense(expense)"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 text-secondary-400 dark:text-secondary-500 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
                    @click="confirmDeleteExpense(expense)"
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
        class="fixed inset-0 bg-secondary-900/50 dark:bg-secondary-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showExpenseModal = false"
      >
        <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-primary-50 dark:bg-primary-900/50 rounded-xl flex items-center justify-center">
              <CreditCardIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                {{ editingExpense ? 'Edit Expense' : 'Add Expense' }}
              </h2>
              <p class="text-sm text-secondary-500 dark:text-secondary-400">{{ editingExpense ? 'Update expense details' : 'Track a new expense' }}</p>
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
                <label class="text-sm font-medium text-secondary-700 dark:text-secondary-300">New Category</label>
                <div class="flex gap-2">
                  <input
                    v-model="newCategoryName"
                    type="text"
                    placeholder="Category name"
                    class="flex-1 px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
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
                    class="px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg transition-colors"
                    @click="cancelNewCategory"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <button
                v-if="!showNewCategoryInput"
                type="button"
                class="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
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
                <label class="text-sm font-medium text-secondary-700 dark:text-secondary-300">New Group</label>
                <div class="flex gap-2">
                  <input
                    v-model="newGroupName"
                    type="text"
                    placeholder="Group name"
                    class="flex-1 px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
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
                    class="px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg transition-colors"
                    @click="cancelNewGroup"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <button
                v-if="!showNewGroupInput"
                type="button"
                class="flex items-center gap-1 text-sm text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-medium"
                @click="showNewGroupInput = true"
              >
                <FolderPlusIcon class="w-4 h-4" />
                Create new group
              </button>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100 dark:border-secondary-700">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors font-medium"
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
        class="fixed inset-0 bg-secondary-900/50 dark:bg-secondary-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showEditPeriodModal = false"
      >
        <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-primary-50 dark:bg-primary-900/50 rounded-xl flex items-center justify-center">
              <PencilIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100">Edit Budget Period</h2>
              <p class="text-sm text-secondary-500 dark:text-secondary-400">Update period details</p>
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

            <!-- Info about managing income -->
            <div class="bg-secondary-50 dark:bg-secondary-900 rounded-lg p-4">
              <p class="text-sm text-secondary-600 dark:text-secondary-400">
                <span class="font-medium">Note:</span> To manage income sources, use the Income Sources section on this page.
              </p>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100 dark:border-secondary-700">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors font-medium"
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
        class="fixed inset-0 bg-secondary-900/50 dark:bg-secondary-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showDuplicateModal = false"
      >
        <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-primary-50 dark:bg-primary-900/50 rounded-xl flex items-center justify-center">
              <DocumentDuplicateIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100">Duplicate Budget Period</h2>
              <p class="text-sm text-secondary-500 dark:text-secondary-400">Create a copy with the same expenses and incomes</p>
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

            <!-- What will be duplicated info -->
            <div class="bg-secondary-50 dark:bg-secondary-900 rounded-lg p-4 space-y-2">
              <p class="text-sm font-medium text-secondary-700 dark:text-secondary-300">What will be copied:</p>
              <ul class="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
                <li class="flex items-center gap-2">
                  <ArrowTrendingUpIcon class="w-4 h-4 text-success-500 dark:text-success-400" />
                  {{ period?.incomes?.length || 0 }} income source{{ (period?.incomes?.length || 0) === 1 ? '' : 's' }}
                  <span class="text-success-600 dark:text-success-400 font-medium">({{ formatCurrency(totalIncome) }})</span>
                </li>
                <li class="flex items-center gap-2">
                  <CreditCardIcon class="w-4 h-4 text-danger-500 dark:text-danger-400" />
                  {{ period?.expenses?.length || 0 }} expense{{ (period?.expenses?.length || 0) === 1 ? '' : 's' }}
                </li>
              </ul>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100 dark:border-secondary-700">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors font-medium"
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
        class="fixed inset-0 bg-secondary-900/50 dark:bg-secondary-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showDeleteConfirm = false"
      >
        <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-danger-50 dark:bg-danger-900/50 rounded-xl flex items-center justify-center">
              <ExclamationTriangleIcon class="w-6 h-6 text-danger-600 dark:text-danger-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100">Delete Budget Period</h2>
              <p class="text-sm text-secondary-500 dark:text-secondary-400">This action cannot be undone</p>
            </div>
          </div>

          <p class="text-secondary-600 dark:text-secondary-400 mb-6">
            Are you sure you want to delete this budget period? This will also delete all associated expenses.
          </p>

          <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100 dark:border-secondary-700">
            <button
              type="button"
              class="px-5 py-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors font-medium"
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

    <!-- Delete Expense Confirmation Modal -->
    <UiConfirmModal
      :show="showDeleteExpenseConfirm"
      title="Delete Expense"
      :message="`Are you sure you want to delete '${expenseToDelete?.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      :loading="deleteLoading"
      @confirm="handleDeleteExpense"
      @cancel="showDeleteExpenseConfirm = false; expenseToDelete = null"
    />

    <!-- Delete Income Confirmation Modal -->
    <UiConfirmModal
      :show="showDeleteIncomeConfirm"
      title="Delete Income"
      :message="`Are you sure you want to delete '${incomeToDelete?.name}'? This action cannot be undone.`"
      confirm-text="Delete"
      :loading="deleteLoading"
      @confirm="handleDeleteIncome"
      @cancel="showDeleteIncomeConfirm = false; incomeToDelete = null"
    />

    <!-- Delete Group Confirmation Modal -->
    <UiConfirmModal
      :show="showDeleteGroupConfirm"
      title="Delete Expense Group"
      :message="`Are you sure you want to delete '${groupToDelete?.name}'? Expenses in this group will be moved to ungrouped.`"
      confirm-text="Delete"
      variant="warning"
      :loading="deleteLoading"
      @confirm="handleDeleteGroup"
      @cancel="showDeleteGroupConfirm = false; groupToDelete = null"
    />

    <!-- Bulk Expense Modal -->
    <Teleport to="body">
      <div
        v-if="showBulkExpenseModal"
        class="fixed inset-0 bg-secondary-900/50 dark:bg-secondary-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showBulkExpenseModal = false"
      >
        <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-elevated max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-primary-50 dark:bg-primary-900/50 rounded-xl flex items-center justify-center">
              <QueueListIcon class="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100">Add Multiple Expenses</h2>
              <p class="text-sm text-secondary-500 dark:text-secondary-400">Add several expenses at once</p>
            </div>
            <button
              type="button"
              class="p-2 text-secondary-400 dark:text-secondary-500 hover:text-secondary-600 dark:hover:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors"
              @click="showBulkExpenseModal = false"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

          <form @submit.prevent="handleBulkExpenseSubmit" class="space-y-4">
            <!-- Category Creation -->
            <div v-if="showBulkNewCategoryInput" class="bg-secondary-50 dark:bg-secondary-900 rounded-xl p-4 mb-4">
              <label class="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 block">Create New Category</label>
              <div class="flex gap-2">
                <input
                  v-model="bulkNewCategoryName"
                  type="text"
                  placeholder="Category name"
                  class="flex-1 px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
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
                  class="px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg transition-colors"
                  @click="cancelBulkNewCategory"
                >
                  Cancel
                </button>
              </div>
            </div>

            <button
              v-if="!showBulkNewCategoryInput"
              type="button"
              class="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mb-4"
              @click="showBulkNewCategoryInput = true"
            >
              <PlusIcon class="w-4 h-4" />
              Add custom category
            </button>

            <!-- Group Creation -->
            <div v-if="showBulkNewGroupInput" class="bg-accent-50 dark:bg-accent-900/30 rounded-xl p-4 mb-4">
              <label class="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2 block">Create New Group</label>
              <div class="flex gap-2">
                <input
                  v-model="bulkNewGroupName"
                  type="text"
                  placeholder="Group name"
                  class="flex-1 px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
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
                  class="px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg transition-colors"
                  @click="cancelBulkNewGroup"
                >
                  Cancel
                </button>
              </div>
            </div>

            <button
              v-if="!showBulkNewGroupInput"
              type="button"
              class="flex items-center gap-1 text-sm text-accent-600 dark:text-accent-400 hover:text-accent-700 dark:hover:text-accent-300 font-medium mb-4"
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
                class="bg-secondary-50 dark:bg-secondary-900 rounded-xl p-4"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-medium text-secondary-600 dark:text-secondary-400">Expense {{ index + 1 }}</span>
                  <button
                    v-if="bulkExpenses.length > 1"
                    type="button"
                    class="p-1 text-secondary-400 dark:text-secondary-500 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
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
                    class="px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
                  />

                  <input
                    v-model="expense.description"
                    type="text"
                    placeholder="Description (optional)"
                    class="px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
                  />

                  <input
                    v-model.number="expense.amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Amount *"
                    class="px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
                  />

                  <select
                    v-model="expense.categoryId"
                    class="px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
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
                    class="px-3 py-2 border border-secondary-200 dark:border-secondary-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent text-sm bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100"
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
              class="flex items-center gap-2 w-full justify-center py-3 border-2 border-dashed border-secondary-300 dark:border-secondary-600 hover:border-primary-400 dark:hover:border-primary-500 text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-colors"
              @click="addBulkExpenseRow"
            >
              <PlusIcon class="w-5 h-5" />
              Add Another Expense
            </button>

            <!-- Summary -->
            <div class="bg-primary-50 dark:bg-primary-900/50 rounded-xl p-4 flex justify-between items-center">
              <div>
                <p class="text-sm text-secondary-600 dark:text-secondary-400">
                  <span class="font-medium">{{ validBulkExpensesCount }}</span> valid expense{{ validBulkExpensesCount === 1 ? '' : 's' }}
                </p>
              </div>
              <div class="text-right">
                <p class="text-sm text-secondary-500 dark:text-secondary-400">Total</p>
                <p class="text-xl font-bold text-primary-600 dark:text-primary-400">{{ formatCurrency(bulkExpensesTotal) }}</p>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100 dark:border-secondary-700">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors font-medium"
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
        class="fixed inset-0 bg-secondary-900/50 dark:bg-secondary-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showGroupModal = false"
      >
        <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-accent-50 dark:bg-accent-900/50 rounded-xl flex items-center justify-center">
              <FolderIcon class="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                {{ editingGroup ? 'Edit Group' : 'Create Group' }}
              </h2>
              <p class="text-sm text-secondary-500 dark:text-secondary-400">
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

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100 dark:border-secondary-700">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors font-medium"
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
        class="fixed inset-0 bg-secondary-900/50 dark:bg-secondary-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showMoveExpenseModal = false"
      >
        <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-accent-50 dark:bg-accent-900/50 rounded-xl flex items-center justify-center">
              <ArrowsRightLeftIcon class="w-6 h-6 text-accent-600 dark:text-accent-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100">Move Expense</h2>
              <p class="text-sm text-secondary-500 dark:text-secondary-400">
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
              class="w-full flex items-center gap-3 p-4 border border-secondary-200 dark:border-secondary-600 rounded-xl hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors text-left"
              @click="handleMoveExpense(null)"
            >
              <div class="w-10 h-10 bg-secondary-100 dark:bg-secondary-700 rounded-lg flex items-center justify-center">
                <XMarkIcon class="w-5 h-5 text-secondary-500 dark:text-secondary-400" />
              </div>
              <div>
                <p class="font-medium text-secondary-900 dark:text-secondary-100">Remove from group</p>
                <p class="text-sm text-secondary-500 dark:text-secondary-400">Move to ungrouped expenses</p>
              </div>
            </button>

            <!-- Group options -->
            <button
              v-for="group in expenseGroupStore.groups.filter(g => g.id !== selectedExpenseForMove?.expenseGroupId)"
              :key="group.id"
              type="button"
              class="w-full flex items-center gap-3 p-4 border border-secondary-200 dark:border-secondary-600 rounded-xl hover:bg-accent-50 dark:hover:bg-accent-900/50 hover:border-accent-300 dark:hover:border-accent-700 transition-colors text-left"
              @click="handleMoveExpense(group.id)"
            >
              <div class="w-10 h-10 bg-accent-50 dark:bg-accent-900/50 rounded-lg flex items-center justify-center">
                <FolderIcon class="w-5 h-5 text-accent-500 dark:text-accent-400" />
              </div>
              <div class="flex-1">
                <p class="font-medium text-secondary-900 dark:text-secondary-100">{{ group.name }}</p>
                <p class="text-sm text-secondary-500 dark:text-secondary-400">{{ group.expenses.length }} expense{{ group.expenses.length === 1 ? '' : 's' }}</p>
              </div>
            </button>

            <div v-if="expenseGroupStore.groups.length === 0" class="text-center py-6 text-secondary-500 dark:text-secondary-400">
              No groups available. Create a group first.
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 mt-4 border-t border-secondary-100 dark:border-secondary-700">
            <button
              type="button"
              class="px-5 py-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors font-medium"
              @click="showMoveExpenseModal = false"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Add/Edit Income Modal -->
    <Teleport to="body">
      <div
        v-if="showIncomeModal"
        class="fixed inset-0 bg-secondary-900/50 dark:bg-secondary-950/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showIncomeModal = false"
      >
        <div class="bg-white dark:bg-secondary-800 rounded-2xl shadow-elevated max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-success-50 dark:bg-success-900/50 rounded-xl flex items-center justify-center">
              <ArrowTrendingUpIcon class="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                {{ editingIncome ? 'Edit Income' : 'Add Income Source' }}
              </h2>
              <p class="text-sm text-secondary-500 dark:text-secondary-400">{{ editingIncome ? 'Update income details' : 'Track a new income source' }}</p>
            </div>
          </div>

          <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

          <form @submit.prevent="handleIncomeSubmit" class="space-y-5">
            <UiBaseInput
              v-model="incomeForm.name"
              label="Name"
              placeholder="e.g., Main Job, Side Business"
              required
            />

            <UiBaseInput
              v-model="incomeForm.description"
              label="Description (Optional)"
              placeholder="Additional details"
            />

            <UiBaseInput
              v-model="incomeForm.amount"
              label="Amount"
              type="number"
              :placeholder="`Amount in ${authStore.user?.settings?.currency || 'USD'}`"
              required
            />

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100 dark:border-secondary-700">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-700 rounded-lg transition-colors font-medium"
                @click="showIncomeModal = false"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium disabled:opacity-50"
                :disabled="loading"
              >
                <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <CheckCircleIcon v-else class="w-5 h-5" />
                {{ editingIncome ? 'Update' : 'Add Income' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
