<script setup lang="ts">
import {
  PlusIcon,
  ClipboardDocumentListIcon,
  BanknotesIcon,
  TrashIcon,
  DocumentTextIcon,
} from "@heroicons/vue/24/outline";
import type { PersonalBudgetItemInput } from "~/types";

definePageMeta({
  middleware: "auth",
});

const authStore = useAuthStore();
const personalBudgetStore = usePersonalBudgetStore();
const router = useRouter();

const showCreateModal = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const createForm = reactive({
  name: "",
  description: "",
  items: [{ name: "", description: "", amount: 0 }] as PersonalBudgetItemInput[],
});

const totalAmount = computed(() =>
  createForm.items.reduce((sum, item) => sum + (item.amount || 0), 0),
);

function addItem() {
  createForm.items.push({ name: "", description: "", amount: 0 });
}

function removeItem(index: number) {
  if (createForm.items.length > 1) {
    createForm.items.splice(index, 1);
  }
}

onMounted(async () => {
  await personalBudgetStore.fetchPersonalBudgets();
});

function formatCurrency(amount: number) {
  const currency = authStore.user?.settings?.currency || "USD";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getBudgetTotal(budget: { items: { amount: number }[] }) {
  return budget.items.reduce((sum, item) => sum + item.amount, 0);
}

function resetForm() {
  createForm.name = "";
  createForm.description = "";
  createForm.items = [{ name: "", description: "", amount: 0 }];
}

async function handleCreate() {
  error.value = null;

  if (!createForm.name.trim()) {
    error.value = "Please enter a name for your budget.";
    return;
  }

  const validItems = createForm.items.filter(
    (item) => item.name.trim() && item.amount > 0,
  );

  loading.value = true;

  const result = await personalBudgetStore.createPersonalBudget({
    name: createForm.name,
    description: createForm.description || undefined,
    items: validItems.length > 0 ? validItems : undefined,
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

function viewPersonalBudget(id: string) {
  router.push(`/personal-budgets/${id}`);
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-secondary-900">Personal Budgets</h1>
      <p class="text-secondary-500 mt-1">
        Create simple budgets to track items and their costs
      </p>
    </div>

    <!-- Personal Budgets Section -->
    <div
      class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
    >
      <div>
        <h2
          class="text-lg font-semibold text-secondary-800 flex items-center gap-2"
        >
          <ClipboardDocumentListIcon class="w-5 h-5 text-primary-500" />
          Your Budgets
        </h2>
        <p class="text-secondary-500 text-sm mt-1">
          Quick lists for wishlists, savings goals, or expense planning
        </p>
      </div>
      <button
        class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
        @click="showCreateModal = true"
      >
        <PlusIcon class="w-5 h-5" />
        New Personal Budget
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="personalBudgetStore.loading" class="text-center py-16">
      <div
        class="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"
      ></div>
      <p class="text-secondary-500">Loading your personal budgets...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="personalBudgetStore.personalBudgets.length === 0"
      class="text-center py-16"
    >
      <div
        class="bg-white rounded-2xl shadow-card p-10 max-w-md mx-auto border border-secondary-100"
      >
        <div
          class="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-5"
        >
          <ClipboardDocumentListIcon class="w-8 h-8 text-primary-500" />
        </div>
        <h3 class="text-xl font-semibold text-secondary-900 mb-2">
          No personal budgets yet
        </h3>
        <p class="text-secondary-500 mb-6">
          Create your first personal budget to start tracking items and their
          costs.
        </p>
        <button
          class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium mx-auto"
          @click="showCreateModal = true"
        >
          <PlusIcon class="w-5 h-5" />
          Create Your First Budget
        </button>
      </div>
    </div>

    <!-- Personal Budget Cards -->
    <div v-else class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="budget in personalBudgetStore.personalBudgets"
        :key="budget.id"
        class="bg-white rounded-xl shadow-card border border-secondary-100 p-6 cursor-pointer hover:shadow-card-hover hover:border-primary-200 transition-all group"
        @click="viewPersonalBudget(budget.id)"
      >
        <div class="flex justify-between items-start mb-5">
          <div class="flex-1">
            <h3
              class="font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors"
            >
              {{ budget.name }}
            </h3>
            <p
              v-if="budget.description"
              class="text-sm text-secondary-500 mt-1 line-clamp-2"
            >
              {{ budget.description }}
            </p>
          </div>
          <div
            class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center group-hover:bg-primary-100 transition-colors"
          >
            <ClipboardDocumentListIcon class="w-5 h-5 text-primary-600" />
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-secondary-500 flex items-center gap-2">
              <DocumentTextIcon class="w-4 h-4 text-secondary-400" />
              Items
            </span>
            <span class="font-medium text-secondary-700">{{
              budget.items.length
            }}</span>
          </div>

          <div
            class="border-t border-secondary-100 pt-3 flex justify-between items-center"
          >
            <span class="text-sm font-medium text-secondary-600">Total</span>
            <span class="font-bold text-lg text-primary-600">
              {{ formatCurrency(getBudgetTotal(budget)) }}
            </span>
          </div>
        </div>

        <div
          class="mt-4 pt-3 border-t border-secondary-100 flex items-center justify-between"
        >
          <span class="text-xs text-secondary-400">
            Created {{ formatDate(budget.createdAt) }}
          </span>
          <span
            class="text-xs text-primary-600 font-medium group-hover:text-primary-700"
          >
            View details →
          </span>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        @click.self="showCreateModal = false"
      >
        <div
          class="bg-white rounded-2xl shadow-elevated max-w-md w-full p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto"
        >
          <div class="flex items-center gap-3 mb-6">
            <div
              class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center"
            >
              <ClipboardDocumentListIcon class="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 class="text-xl font-semibold text-secondary-900">
                Create Personal Budget
              </h2>
              <p class="text-sm text-secondary-500">
                Add items and track their costs
              </p>
            </div>
          </div>

          <UiBaseAlert
            v-if="error"
            type="error"
            :message="error"
            class="mb-4"
          />

          <form @submit.prevent="handleCreate" class="space-y-5">
            <UiBaseInput
              v-model="createForm.name"
              label="Budget Name"
              placeholder="e.g., Vacation Budget, Wishlist"
              required
            />

            <UiBaseInput
              v-model="createForm.description"
              label="Description (Optional)"
              placeholder="What is this budget for?"
            />

            <!-- Budget Items -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="block text-sm font-medium text-secondary-700"
                  >Items (Optional)</label
                >
                <button
                  type="button"
                  class="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                  @click="addItem"
                >
                  <PlusIcon class="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div
                v-for="(item, index) in createForm.items"
                :key="index"
                class="p-4 bg-secondary-50 rounded-lg space-y-3"
              >
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-secondary-600"
                    >Item #{{ index + 1 }}</span
                  >
                  <button
                    v-if="createForm.items.length > 1"
                    type="button"
                    class="text-danger-500 hover:text-danger-600 p-1"
                    @click="removeItem(index)"
                  >
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <UiBaseInput
                    v-model="item.name"
                    placeholder="Item name"
                  />
                  <UiBaseInput
                    v-model="item.amount"
                    type="number"
                    placeholder="Amount"
                  />
                </div>

                <UiBaseInput
                  v-model="item.description"
                  placeholder="Description (optional)"
                />
              </div>

              <!-- Total Amount Display -->
              <div
                v-if="totalAmount > 0"
                class="flex items-center justify-between p-3 bg-primary-50 rounded-lg"
              >
                <span class="text-sm font-medium text-primary-700"
                  >Total Amount</span
                >
                <span class="text-lg font-bold text-primary-700">{{
                  formatCurrency(totalAmount)
                }}</span>
              </div>
            </div>

            <div
              class="flex justify-end gap-3 pt-4 border-t border-secondary-100"
            >
              <button
                type="button"
                class="px-5 py-2.5 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 rounded-lg transition-colors font-medium"
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
                Create Budget
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
