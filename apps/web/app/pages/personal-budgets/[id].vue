<script setup lang="ts">
import type { PersonalBudgetItem } from '~/types';
import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline';

definePageMeta({
  middleware: 'auth',
});

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const personalBudgetStore = usePersonalBudgetStore();

const budgetId = route.params.id as string;

const showItemModal = ref(false);
const showDeleteConfirm = ref(false);
const showEditBudgetModal = ref(false);
const showDeleteItemConfirm = ref(false);
const editingItem = ref<PersonalBudgetItem | null>(null);
const itemToDelete = ref<PersonalBudgetItem | null>(null);
const loading = ref(false);
const deleteLoading = ref(false);
const error = ref<string | null>(null);

const itemForm = reactive({
  name: '',
  description: '',
  amount: 0,
});

const editBudgetForm = reactive({
  name: '',
  description: '',
});

onMounted(async () => {
  await personalBudgetStore.fetchPersonalBudget(budgetId);
  if (personalBudgetStore.currentBudget) {
    editBudgetForm.name = personalBudgetStore.currentBudget.name;
    editBudgetForm.description = personalBudgetStore.currentBudget.description || '';
  }
});

const budget = computed(() => personalBudgetStore.currentBudget);
const totalAmount = computed(() => personalBudgetStore.currentTotal);

function formatCurrency(amount: number) {
  const currency = authStore.user?.settings?.currency || 'USD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function resetItemForm() {
  itemForm.name = '';
  itemForm.description = '';
  itemForm.amount = 0;
  editingItem.value = null;
  error.value = null;
}

function openAddItemModal() {
  resetItemForm();
  showItemModal.value = true;
}

function openEditItemModal(item: PersonalBudgetItem) {
  editingItem.value = item;
  itemForm.name = item.name;
  itemForm.description = item.description || '';
  itemForm.amount = item.amount;
  error.value = null;
  showItemModal.value = true;
}

async function handleItemSubmit() {
  error.value = null;

  if (!itemForm.name.trim()) {
    error.value = 'Please enter an item name.';
    return;
  }

  if (!itemForm.amount || itemForm.amount <= 0) {
    error.value = 'Please enter a valid amount.';
    return;
  }

  loading.value = true;

  if (editingItem.value) {
    const result = await personalBudgetStore.updateItem(budgetId, editingItem.value.id, {
      name: itemForm.name,
      description: itemForm.description || undefined,
      amount: itemForm.amount,
    });

    loading.value = false;

    if (!result.success && result.error) {
      error.value = typeof result.error.message === 'string'
        ? result.error.message
        : result.error.message[0];
      return;
    }
  } else {
    const result = await personalBudgetStore.addItem(budgetId, {
      name: itemForm.name,
      description: itemForm.description || undefined,
      amount: itemForm.amount,
    });

    loading.value = false;

    if (!result.success && result.error) {
      error.value = typeof result.error.message === 'string'
        ? result.error.message
        : result.error.message[0];
      return;
    }
  }

  showItemModal.value = false;
  resetItemForm();
}

function confirmDeleteItem(item: PersonalBudgetItem) {
  itemToDelete.value = item;
  showDeleteItemConfirm.value = true;
}

async function handleDeleteItem() {
  if (!itemToDelete.value) return;

  deleteLoading.value = true;
  const result = await personalBudgetStore.deleteItem(budgetId, itemToDelete.value.id);
  deleteLoading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  showDeleteItemConfirm.value = false;
  itemToDelete.value = null;
}

async function handleUpdateBudget() {
  error.value = null;

  if (!editBudgetForm.name.trim()) {
    error.value = 'Please enter a budget name.';
    return;
  }

  loading.value = true;
  const result = await personalBudgetStore.updatePersonalBudget(budgetId, {
    name: editBudgetForm.name,
    description: editBudgetForm.description || undefined,
  });
  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  showEditBudgetModal.value = true;
  showEditBudgetModal.value = false;
}

async function handleDeleteBudget() {
  deleteLoading.value = true;
  const result = await personalBudgetStore.deletePersonalBudget(budgetId);
  deleteLoading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  router.push('/personal-budgets');
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Loading State -->
    <div v-if="personalBudgetStore.loading && !budget" class="text-center py-16">
      <div
        class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"
      ></div>
      <p class="text-secondary-500">Loading budget...</p>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!budget" class="text-center py-16">
      <div class="bg-white rounded-2xl shadow-card p-10 max-w-md mx-auto border border-secondary-100">
        <h3 class="text-xl font-semibold text-secondary-900 mb-2">Budget not found</h3>
        <p class="text-secondary-500 mb-6">The budget you're looking for doesn't exist.</p>
        <NuxtLink
          to="/personal-budgets"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
        >
          <ArrowLeftIcon class="w-5 h-5" />
          Back to Budgets
        </NuxtLink>
      </div>
    </div>

    <template v-else>
      <!-- Header -->
      <div class="mb-8">
        <NuxtLink
          to="/personal-budgets"
          class="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-700 mb-4 transition-colors"
        >
          <ArrowLeftIcon class="w-4 h-4" />
          Back to Personal Budgets
        </NuxtLink>

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 class="text-2xl font-bold text-secondary-900">{{ budget.name }}</h1>
            <p v-if="budget.description" class="text-secondary-500 mt-1">
              {{ budget.description }}
            </p>
            <p class="text-sm text-secondary-400 mt-1">
              Created {{ formatDate(budget.createdAt) }}
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              class="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors"
              @click="showEditBudgetModal = true"
            >
              <PencilIcon class="w-4 h-4" />
              Edit
            </button>
            <button
              class="flex items-center gap-2 px-4 py-2 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-colors"
              @click="showDeleteConfirm = true"
            >
              <TrashIcon class="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Summary Card -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div class="bg-white rounded-xl shadow-card p-5 border border-secondary-100">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
              <DocumentTextIcon class="w-5 h-5 text-primary-600" />
            </div>
            <span class="text-sm font-medium text-secondary-500">Total Items</span>
          </div>
          <p class="text-2xl font-bold text-secondary-900">{{ budget.items.length }}</p>
        </div>

        <div class="bg-white rounded-xl shadow-card p-5 border border-secondary-100">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
              <BanknotesIcon class="w-5 h-5 text-success-600" />
            </div>
            <span class="text-sm font-medium text-secondary-500">Total Amount</span>
          </div>
          <p class="text-2xl font-bold text-primary-600">{{ formatCurrency(totalAmount) }}</p>
        </div>
      </div>

      <!-- Items Section -->
      <div class="bg-white rounded-xl shadow-card border border-secondary-100">
        <div class="p-5 border-b border-secondary-100 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-secondary-800 flex items-center gap-2">
            <ClipboardDocumentListIcon class="w-5 h-5 text-primary-500" />
            Budget Items
          </h2>
          <button
            class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-sm font-medium"
            @click="openAddItemModal"
          >
            <PlusIcon class="w-4 h-4" />
            Add Item
          </button>
        </div>

        <!-- Empty Items State -->
        <div v-if="budget.items.length === 0" class="p-10 text-center">
          <div class="w-16 h-16 bg-secondary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardDocumentListIcon class="w-8 h-8 text-secondary-400" />
          </div>
          <h3 class="text-lg font-medium text-secondary-700 mb-2">No items yet</h3>
          <p class="text-secondary-500 mb-4">Add items to track their costs</p>
          <button
            class="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
            @click="openAddItemModal"
          >
            <PlusIcon class="w-4 h-4" />
            Add Your First Item
          </button>
        </div>

        <!-- Items List -->
        <div v-else class="divide-y divide-secondary-100">
          <div
            v-for="item in budget.items"
            :key="item.id"
            class="p-4 hover:bg-secondary-50 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h3 class="font-medium text-secondary-900">{{ item.name }}</h3>
                <p v-if="item.description" class="text-sm text-secondary-500 mt-1">
                  {{ item.description }}
                </p>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-semibold text-primary-600">
                  {{ formatCurrency(item.amount) }}
                </span>
                <div class="flex items-center gap-1">
                  <button
                    class="p-1.5 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded transition-colors"
                    title="Edit item"
                    @click="openEditItemModal(item)"
                  >
                    <PencilIcon class="w-4 h-4" />
                  </button>
                  <button
                    class="p-1.5 text-secondary-400 hover:text-danger-600 hover:bg-danger-50 rounded transition-colors"
                    title="Delete item"
                    @click="confirmDeleteItem(item)"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Footer -->
        <div v-if="budget.items.length > 0" class="p-5 border-t border-secondary-100 bg-secondary-50">
          <div class="flex justify-between items-center">
            <span class="font-semibold text-secondary-700">Total</span>
            <span class="text-xl font-bold text-primary-600">{{ formatCurrency(totalAmount) }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- Add/Edit Item Modal -->
    <Teleport to="body">
      <div
        v-if="showItemModal"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showItemModal = false"
      >
        <div class="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <ClipboardDocumentListIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900">
                {{ editingItem ? 'Edit Item' : 'Add Item' }}
              </h2>
              <p class="text-sm text-secondary-500">
                {{ editingItem ? 'Update item details' : 'Add a new item to your budget' }}
              </p>
            </div>
          </div>

          <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

          <form @submit.prevent="handleItemSubmit" class="space-y-4">
            <UiBaseInput
              v-model="itemForm.name"
              label="Item Name"
              placeholder="e.g., New Laptop"
              required
            />

            <UiBaseInput
              v-model="itemForm.amount"
              label="Amount"
              type="number"
              placeholder="0.00"
              required
            />

            <UiBaseInput
              v-model="itemForm.description"
              label="Description (Optional)"
              placeholder="Additional details..."
            />

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
                @click="showItemModal = false"
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
                {{ editingItem ? 'Update Item' : 'Add Item' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Edit Budget Modal -->
    <Teleport to="body">
      <div
        v-if="showEditBudgetModal"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showEditBudgetModal = false"
      >
        <div class="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
              <PencilIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900">Edit Budget</h2>
              <p class="text-sm text-secondary-500">Update budget details</p>
            </div>
          </div>

          <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

          <form @submit.prevent="handleUpdateBudget" class="space-y-4">
            <UiBaseInput
              v-model="editBudgetForm.name"
              label="Budget Name"
              placeholder="e.g., Vacation Budget"
              required
            />

            <UiBaseInput
              v-model="editBudgetForm.description"
              label="Description (Optional)"
              placeholder="What is this budget for?"
            />

            <div class="flex justify-end gap-3 pt-4 border-t border-secondary-100">
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
                @click="showEditBudgetModal = false"
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
                Update Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <!-- Delete Budget Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteConfirm"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showDeleteConfirm = false"
      >
        <div class="bg-white rounded-2xl shadow-elevated max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-danger-50 rounded-xl flex items-center justify-center">
              <ExclamationTriangleIcon class="w-6 h-6 text-danger-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-secondary-900">Delete Budget</h2>
              <p class="text-sm text-secondary-500">This action cannot be undone</p>
            </div>
          </div>

          <p class="text-secondary-600 mb-6">
            Are you sure you want to delete "{{ budget?.name }}"? All items in this budget will also be deleted.
          </p>

          <div class="flex justify-end gap-3">
            <button
              class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
              @click="showDeleteConfirm = false"
            >
              Cancel
            </button>
            <button
              class="flex items-center gap-2 px-5 py-2.5 bg-danger-500 hover:bg-danger-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
              :disabled="deleteLoading"
              @click="handleDeleteBudget"
            >
              <span
                v-if="deleteLoading"
                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></span>
              <TrashIcon v-else class="w-4 h-4" />
              Delete Budget
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Delete Item Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showDeleteItemConfirm"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showDeleteItemConfirm = false"
      >
        <div class="bg-white rounded-2xl shadow-elevated max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 bg-danger-50 rounded-xl flex items-center justify-center">
              <ExclamationTriangleIcon class="w-6 h-6 text-danger-600" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-secondary-900">Delete Item</h2>
              <p class="text-sm text-secondary-500">This action cannot be undone</p>
            </div>
          </div>

          <p class="text-secondary-600 mb-6">
            Are you sure you want to delete "{{ itemToDelete?.name }}"?
          </p>

          <div class="flex justify-end gap-3">
            <button
              class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
              @click="showDeleteItemConfirm = false"
            >
              Cancel
            </button>
            <button
              class="flex items-center gap-2 px-5 py-2.5 bg-danger-500 hover:bg-danger-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
              :disabled="deleteLoading"
              @click="handleDeleteItem"
            >
              <span
                v-if="deleteLoading"
                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></span>
              <TrashIcon v-else class="w-4 h-4" />
              Delete Item
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
