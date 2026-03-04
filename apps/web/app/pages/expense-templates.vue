<script setup lang="ts">
import type { ExpenseTemplate } from '~/types';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  ArrowLeftIcon,
} from '@heroicons/vue/24/outline';

definePageMeta({
  middleware: 'auth',
});

const router = useRouter();
const authStore = useAuthStore();
const expenseStore = useExpenseStore();
const templateStore = useExpenseTemplateStore();

const showModal = ref(false);
const showDeleteConfirm = ref(false);
const editingTemplate = ref<ExpenseTemplate | null>(null);
const templateToDelete = ref<ExpenseTemplate | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

const form = reactive({
  name: '',
  description: '',
  amount: 0,
  categoryId: '',
});

onMounted(async () => {
  await Promise.all([
    templateStore.fetchTemplates(),
    expenseStore.fetchCategories(),
  ]);
});

function formatCurrency(amount: number) {
  const currency = authStore.user?.settings?.currency || 'USD';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

function resetForm() {
  form.name = '';
  form.description = '';
  form.amount = 0;
  form.categoryId = '';
  editingTemplate.value = null;
  error.value = null;
}

function openCreateModal() {
  resetForm();
  showModal.value = true;
}

function openEditModal(template: ExpenseTemplate) {
  editingTemplate.value = template;
  form.name = template.name;
  form.description = template.description || '';
  form.amount = template.amount;
  form.categoryId = template.categoryId;
  showModal.value = true;
}

function confirmDelete(template: ExpenseTemplate) {
  templateToDelete.value = template;
  showDeleteConfirm.value = true;
}

async function handleSubmit() {
  error.value = null;
  loading.value = true;

  if (editingTemplate.value) {
    const result = await templateStore.updateTemplate(editingTemplate.value.id, {
      name: form.name,
      description: form.description || undefined,
      amount: form.amount,
      categoryId: form.categoryId,
    });

    loading.value = false;
    if (!result.success && result.error) {
      error.value = typeof result.error.message === 'string' ? result.error.message : result.error.message[0];
      return;
    }
  } else {
    const result = await templateStore.createTemplate({
      name: form.name,
      description: form.description || undefined,
      amount: form.amount,
      categoryId: form.categoryId,
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
  if (!templateToDelete.value) return;

  loading.value = true;
  const result = await templateStore.deleteTemplate(templateToDelete.value.id);
  loading.value = false;

  if (result.success) {
    showDeleteConfirm.value = false;
    templateToDelete.value = null;
  }
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
          <h1 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Expense Templates</h1>
          <p class="text-sm text-secondary-500 dark:text-secondary-400">Save common expenses as reusable templates</p>
        </div>
      </div>
      <button
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
        @click="openCreateModal"
      >
        <PlusIcon class="w-5 h-5" />
        New Template
      </button>
    </div>

    <!-- Templates List -->
    <div v-if="templateStore.templates.length === 0 && !templateStore.loading" class="text-center py-16">
      <div class="w-16 h-16 bg-secondary-50 dark:bg-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <DocumentDuplicateIcon class="w-8 h-8 text-secondary-400 dark:text-secondary-500" />
      </div>
      <p class="text-secondary-500 dark:text-secondary-400 mb-4">No templates yet. Create one to speed up expense entry.</p>
      <button
        class="px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium"
        @click="openCreateModal"
      >
        Create Template
      </button>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="template in templateStore.templates"
        :key="template.id"
        class="flex items-center justify-between p-4 bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 hover:shadow-card transition-all"
      >
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <p class="font-medium text-secondary-900 dark:text-secondary-100">{{ template.name }}</p>
            <span class="px-2 py-0.5 text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
              {{ template.category?.name || 'Unknown' }}
            </span>
          </div>
          <p v-if="template.description" class="text-sm text-secondary-500 dark:text-secondary-400 mt-1">{{ template.description }}</p>
        </div>
        <div class="flex items-center gap-3">
          <span class="font-semibold text-secondary-900 dark:text-secondary-100">{{ formatCurrency(template.amount) }}</span>
          <div class="flex gap-1">
            <button
              class="p-2 text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50 rounded-lg transition-colors"
              @click="openEditModal(template)"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button
              class="p-2 text-secondary-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/50 rounded-lg transition-colors"
              @click="confirmDelete(template)"
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
          {{ editingTemplate ? 'Edit Template' : 'New Template' }}
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

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Amount</label>
            <input v-model.number="form.amount" type="number" min="0.01" step="0.01" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">Category</label>
            <select v-model="form.categoryId" required class="w-full px-3 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-600 rounded-lg text-secondary-800 dark:text-secondary-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none">
              <option value="" disabled>Select category</option>
              <option v-for="cat in expenseStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div class="flex gap-3 pt-2">
            <button type="button" class="flex-1 px-4 py-2 border border-secondary-200 dark:border-secondary-600 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors" @click="showModal = false">
              Cancel
            </button>
            <button type="submit" :disabled="loading" class="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium disabled:opacity-50">
              {{ loading ? 'Saving...' : (editingTemplate ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <ConfirmModal
      v-if="showDeleteConfirm"
      title="Delete Template"
      :message="`Are you sure you want to delete '${templateToDelete?.name}'?`"
      confirm-text="Delete"
      :loading="loading"
      @confirm="handleDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>
