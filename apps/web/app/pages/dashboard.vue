<script setup lang="ts">
const authStore = useAuthStore();
const budgetStore = useBudgetStore();
const router = useRouter();

if (!authStore.isAuthenticated) {
  navigateTo('/auth/login');
}

const showCreateModal = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const createForm = reactive({
  name: '',
  startDate: '',
  endDate: '',
  income: 0,
});

onMounted(async () => {
  await budgetStore.fetchBudgetPeriods();
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

function resetForm() {
  createForm.name = '';
  createForm.startDate = '';
  createForm.endDate = '';
  createForm.income = 0;
}

async function handleCreate() {
  error.value = null;

  if (!createForm.startDate || !createForm.endDate || !createForm.income) {
    error.value = 'Please fill in all required fields.';
    return;
  }

  if (new Date(createForm.startDate) >= new Date(createForm.endDate)) {
    error.value = 'Start date must be before end date.';
    return;
  }

  loading.value = true;

  const result = await budgetStore.createBudgetPeriod({
    name: createForm.name || undefined,
    startDate: createForm.startDate,
    endDate: createForm.endDate,
    income: createForm.income,
  });

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  showCreateModal.value = false;
  resetForm();
}

function viewBudgetPeriod(id: string) {
  router.push(`/budget/${id}`);
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Budget Periods</h1>
        <p class="text-gray-500 mt-1">Manage your budget periods and track expenses</p>
      </div>
      <UiBaseButton @click="showCreateModal = true">
        + New Budget Period
      </UiBaseButton>
    </div>

    <div v-if="budgetStore.loading" class="text-center py-12">
      <p class="text-gray-500">Loading...</p>
    </div>

    <div v-else-if="budgetStore.budgetPeriods.length === 0" class="text-center py-12">
      <div class="bg-gray-50 rounded-lg p-8">
        <h3 class="text-lg font-medium text-gray-900 mb-2">No budget periods yet</h3>
        <p class="text-gray-500 mb-4">Create your first budget period to start tracking expenses.</p>
        <UiBaseButton @click="showCreateModal = true">
          Create Budget Period
        </UiBaseButton>
      </div>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="period in budgetStore.budgetPeriods"
        :key="period.id"
        class="bg-white shadow rounded-lg p-6 cursor-pointer hover:shadow-md transition-shadow"
        @click="viewBudgetPeriod(period.id)"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-semibold text-gray-900">
              {{ period.name || `${formatDate(period.startDate)} - ${formatDate(period.endDate)}` }}
            </h3>
            <p v-if="period.name" class="text-sm text-gray-500">
              {{ formatDate(period.startDate) }} - {{ formatDate(period.endDate) }}
            </p>
          </div>
        </div>

        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Income:</span>
            <span class="font-medium text-green-600">{{ formatCurrency(period.income) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Expenses:</span>
            <span class="font-medium text-red-600">
              {{ formatCurrency(period.expenses.reduce((sum, e) => sum + e.amount, 0)) }}
            </span>
          </div>
          <div class="border-t pt-2 flex justify-between text-sm">
            <span class="text-gray-500">Remaining:</span>
            <span
              class="font-semibold"
              :class="period.income - period.expenses.reduce((sum, e) => sum + e.amount, 0) >= 0
                ? 'text-green-600'
                : 'text-red-600'"
            >
              {{ formatCurrency(period.income - period.expenses.reduce((sum, e) => sum + e.amount, 0)) }}
            </span>
          </div>
        </div>

        <div class="mt-4 text-xs text-gray-400">
          {{ period.expenses.length }} expense{{ period.expenses.length === 1 ? '' : 's' }}
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showCreateModal = false"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Create Budget Period</h2>

        <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

        <form @submit.prevent="handleCreate" class="space-y-4">
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

          <UiBaseInput
            v-model="createForm.income"
            label="Income"
            type="number"
            :placeholder="`Amount in ${authStore.user?.settings?.currency || 'USD'}`"
            required
          />

          <div class="flex justify-end gap-3 mt-6">
            <UiBaseButton
              type="button"
              variant="outline"
              @click="showCreateModal = false"
            >
              Cancel
            </UiBaseButton>
            <UiBaseButton type="submit" :loading="loading">
              Create
            </UiBaseButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
