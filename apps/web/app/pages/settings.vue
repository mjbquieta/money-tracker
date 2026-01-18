<script setup lang="ts">
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  CurrencyDollarIcon,
  TagIcon,
  UserIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  PencilIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';

definePageMeta({
  middleware: 'auth',
});

const authStore = useAuthStore();
const expenseStore = useExpenseStore();

const loading = ref(false);
const categoryLoading = ref(false);
const profileLoading = ref(false);
const passwordLoading = ref(false);
const error = ref<string | null>(null);
const success = ref<string | null>(null);
const newCategoryName = ref('');
const showNewCategoryInput = ref(false);

// Delete category confirmation
const showDeleteCategoryConfirm = ref(false);
const categoryToDelete = ref<{ id: string; name: string } | null>(null);
const deleteLoading = ref(false);

// Profile editing
const isEditingProfile = ref(false);
const profileForm = reactive({
  name: authStore.user?.name || '',
  username: authStore.user?.username || '',
});

// Password change
const showPasswordForm = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '\u20AC' },
  { code: 'GBP', name: 'British Pound', symbol: '\u00A3' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '\u20B1' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '\u00A5' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
];

const selectedCurrency = ref(authStore.user?.settings?.currency || 'USD');

onMounted(async () => {
  await expenseStore.fetchCategories();
});

// Watch for user changes to update form
watch(() => authStore.user, (newUser) => {
  if (newUser && !isEditingProfile.value) {
    profileForm.name = newUser.name;
    profileForm.username = newUser.username;
  }
}, { immediate: true });

const customCategories = computed(() =>
  expenseStore.categories.filter((c) => !c.isDefault)
);

const defaultCategories = computed(() =>
  expenseStore.categories.filter((c) => c.isDefault)
);

const hasProfileChanges = computed(() => {
  return profileForm.name !== authStore.user?.name ||
         profileForm.username !== authStore.user?.username;
});

async function handleCurrencyChange() {
  error.value = null;
  success.value = null;
  loading.value = true;

  const result = await authStore.updateSettings({ currency: selectedCurrency.value });

  loading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  success.value = 'Currency updated successfully!';
  setTimeout(() => {
    success.value = null;
  }, 3000);
}

async function handleCreateCategory() {
  if (!newCategoryName.value.trim()) {
    return;
  }

  error.value = null;
  categoryLoading.value = true;

  const result = await expenseStore.createCategory({ name: newCategoryName.value.trim() });

  categoryLoading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  newCategoryName.value = '';
  showNewCategoryInput.value = false;
  success.value = 'Category created successfully!';
  setTimeout(() => {
    success.value = null;
  }, 3000);
}

function confirmDeleteCategory(categoryId: string, categoryName: string) {
  categoryToDelete.value = { id: categoryId, name: categoryName };
  showDeleteCategoryConfirm.value = true;
}

async function handleDeleteCategory() {
  if (!categoryToDelete.value) return;

  error.value = null;
  deleteLoading.value = true;

  const result = await expenseStore.deleteCategory(categoryToDelete.value.id);

  deleteLoading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  showDeleteCategoryConfirm.value = false;
  categoryToDelete.value = null;
  success.value = 'Category deleted successfully!';
  setTimeout(() => {
    success.value = null;
  }, 3000);
}

function startEditingProfile() {
  profileForm.name = authStore.user?.name || '';
  profileForm.username = authStore.user?.username || '';
  isEditingProfile.value = true;
}

function cancelEditingProfile() {
  profileForm.name = authStore.user?.name || '';
  profileForm.username = authStore.user?.username || '';
  isEditingProfile.value = false;
}

async function handleUpdateProfile() {
  if (!profileForm.name.trim() || !profileForm.username.trim()) {
    error.value = 'Name and username are required.';
    return;
  }

  error.value = null;
  profileLoading.value = true;

  const result = await authStore.updateProfile({
    name: profileForm.name.trim(),
    username: profileForm.username.trim(),
  });

  profileLoading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  isEditingProfile.value = false;
  success.value = 'Profile updated successfully!';
  setTimeout(() => {
    success.value = null;
  }, 3000);
}

function resetPasswordForm() {
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  showCurrentPassword.value = false;
  showNewPassword.value = false;
  showConfirmPassword.value = false;
  showPasswordForm.value = false;
}

async function handleChangePassword() {
  if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    error.value = 'All password fields are required.';
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    error.value = 'New passwords do not match.';
    return;
  }

  if (passwordForm.newPassword.length < 4) {
    error.value = 'Password must be at least 4 characters.';
    return;
  }

  error.value = null;
  passwordLoading.value = true;

  const result = await authStore.changePassword({
    currentPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword,
  });

  passwordLoading.value = false;

  if (!result.success && result.error) {
    error.value = typeof result.error.message === 'string'
      ? result.error.message
      : result.error.message[0];
    return;
  }

  resetPasswordForm();
  success.value = 'Password changed successfully!';
  setTimeout(() => {
    success.value = null;
  }, 3000);
}

function getCurrencySymbol(code: string) {
  return currencies.find((c) => c.code === code)?.symbol || code;
}

function formatDate(dateString: string | undefined) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <button
        class="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm mb-4 group"
        @click="navigateTo('/dashboard')"
      >
        <ArrowLeftIcon class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </button>

      <h1 class="text-2xl font-bold text-secondary-900 flex items-center gap-2">
        <Cog6ToothIcon class="w-7 h-7 text-primary-500" />
        Settings
      </h1>
      <p class="text-secondary-500 mt-1">Manage your account settings and preferences</p>
    </div>

    <!-- Alerts -->
    <UiBaseAlert v-if="error" type="error" :message="error" class="mb-6" />
    <div
      v-if="success"
      class="mb-6 flex items-center gap-3 p-4 bg-success-50 border border-success-200 text-success-700 rounded-xl"
    >
      <CheckCircleIcon class="w-5 h-5 flex-shrink-0" />
      <span class="text-sm font-medium">{{ success }}</span>
    </div>

    <!-- Account Information -->
    <div class="bg-white rounded-xl shadow-card border border-secondary-100 p-6 mb-6">
      <div class="flex justify-between items-start mb-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
            <UserIcon class="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-secondary-900">Account Information</h2>
            <p class="text-sm text-secondary-500">Your personal details</p>
          </div>
        </div>
        <button
          v-if="!isEditingProfile"
          class="flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors font-medium"
          @click="startEditingProfile"
        >
          <PencilIcon class="w-4 h-4" />
          Edit
        </button>
      </div>

      <!-- Display Mode -->
      <div v-if="!isEditingProfile" class="divide-y divide-secondary-100">
        <div class="flex justify-between items-center py-4">
          <span class="text-secondary-500">Name</span>
          <span class="font-medium text-secondary-900">{{ authStore.user?.name }}</span>
        </div>
        <div class="flex justify-between items-center py-4">
          <span class="text-secondary-500">Username</span>
          <span class="font-medium text-secondary-900">{{ authStore.user?.username }}</span>
        </div>
        <div class="flex justify-between items-center py-4">
          <span class="text-secondary-500">Email</span>
          <div class="flex items-center gap-2">
            <span class="font-medium text-secondary-900">{{ authStore.user?.email }}</span>
            <span class="text-xs text-secondary-400 bg-secondary-100 px-2 py-0.5 rounded-full">Cannot be changed</span>
          </div>
        </div>
        <div class="flex justify-between items-center py-4">
          <span class="text-secondary-500">Member since</span>
          <span class="font-medium text-secondary-900">
            {{ formatDate(authStore.user?.createdAt) }}
          </span>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-2">Name</label>
          <input
            v-model="profileForm.name"
            type="text"
            class="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-2">Username</label>
          <input
            v-model="profileForm.username"
            type="text"
            class="w-full px-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Your username"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-2">Email</label>
          <input
            :value="authStore.user?.email"
            type="email"
            disabled
            class="w-full px-4 py-2.5 border border-secondary-200 rounded-lg bg-secondary-50 text-secondary-500 cursor-not-allowed"
          />
          <p class="text-xs text-secondary-400 mt-1">Email address cannot be changed.</p>
        </div>
        <div class="flex gap-3 pt-2">
          <button
            class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium disabled:opacity-50"
            :disabled="profileLoading || !hasProfileChanges"
            @click="handleUpdateProfile"
          >
            <span v-if="profileLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <CheckCircleIcon v-else class="w-5 h-5" />
            Save Changes
          </button>
          <button
            class="px-5 py-2.5 text-secondary-600 hover:bg-secondary-100 border border-secondary-200 rounded-lg transition-colors font-medium"
            @click="cancelEditingProfile"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Password Section -->
    <div class="bg-white rounded-xl shadow-card border border-secondary-100 p-6 mb-6">
      <div class="flex justify-between items-start mb-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-warning-50 rounded-lg flex items-center justify-center">
            <LockClosedIcon class="w-5 h-5 text-warning-600" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-secondary-900">Password</h2>
            <p class="text-sm text-secondary-500">Update your password to keep your account secure</p>
          </div>
        </div>
        <button
          v-if="!showPasswordForm"
          class="flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors font-medium"
          @click="showPasswordForm = true"
        >
          <PencilIcon class="w-4 h-4" />
          Change Password
        </button>
      </div>

      <div v-if="!showPasswordForm" class="py-4">
        <div class="flex items-center gap-2 text-secondary-500">
          <span>Password last updated:</span>
          <span class="font-medium text-secondary-900">{{ formatDate(authStore.user?.updatedAt) }}</span>
        </div>
      </div>

      <!-- Password Change Form -->
      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-2">Current Password</label>
          <div class="relative">
            <input
              v-model="passwordForm.currentPassword"
              :type="showCurrentPassword ? 'text' : 'password'"
              class="w-full px-4 py-2.5 pr-12 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your current password"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              @click="showCurrentPassword = !showCurrentPassword"
            >
              <EyeSlashIcon v-if="showCurrentPassword" class="w-5 h-5" />
              <EyeIcon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-2">New Password</label>
          <div class="relative">
            <input
              v-model="passwordForm.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="w-full px-4 py-2.5 pr-12 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter your new password"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              @click="showNewPassword = !showNewPassword"
            >
              <EyeSlashIcon v-if="showNewPassword" class="w-5 h-5" />
              <EyeIcon v-else class="w-5 h-5" />
            </button>
          </div>
          <p class="text-xs text-secondary-400 mt-1">Must be at least 4 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol.</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-secondary-700 mb-2">Confirm New Password</label>
          <div class="relative">
            <input
              v-model="passwordForm.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              class="w-full px-4 py-2.5 pr-12 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <EyeSlashIcon v-if="showConfirmPassword" class="w-5 h-5" />
              <EyeIcon v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button
            class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium disabled:opacity-50"
            :disabled="passwordLoading"
            @click="handleChangePassword"
          >
            <span v-if="passwordLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <CheckCircleIcon v-else class="w-5 h-5" />
            Update Password
          </button>
          <button
            class="px-5 py-2.5 text-secondary-600 hover:bg-secondary-100 border border-secondary-200 rounded-lg transition-colors font-medium"
            @click="resetPasswordForm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Currency Settings -->
    <div class="bg-white rounded-xl shadow-card border border-secondary-100 p-6 mb-6">
      <div class="flex items-center gap-3 mb-5">
        <div class="w-10 h-10 bg-success-50 rounded-lg flex items-center justify-center">
          <CurrencyDollarIcon class="w-5 h-5 text-success-600" />
        </div>
        <div>
          <h2 class="text-lg font-semibold text-secondary-900">Currency</h2>
          <p class="text-sm text-secondary-500">Choose your preferred currency for displaying amounts</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div class="flex-1 max-w-xs w-full">
          <label class="block text-sm font-medium text-secondary-700 mb-2">Display Currency</label>
          <select
            v-model="selectedCurrency"
            class="w-full px-4 py-2.5 bg-white border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-secondary-700"
          >
            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
              {{ currency.symbol }} {{ currency.code }} - {{ currency.name }}
            </option>
          </select>
        </div>
        <button
          class="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loading || selectedCurrency === authStore.user?.settings?.currency"
          @click="handleCurrencyChange"
        >
          <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <CheckCircleIcon v-else class="w-5 h-5" />
          Save Changes
        </button>
      </div>

      <p v-if="authStore.user?.settings?.currency" class="text-xs text-secondary-400 mt-3">
        Current: {{ getCurrencySymbol(authStore.user.settings.currency) }} {{ authStore.user.settings.currency }}
      </p>
    </div>

    <!-- Categories Settings -->
    <div class="bg-white rounded-xl shadow-card border border-secondary-100 p-6">
      <div class="flex justify-between items-start mb-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center">
            <TagIcon class="w-5 h-5 text-accent-600" />
          </div>
          <div>
            <h2 class="text-lg font-semibold text-secondary-900">Categories</h2>
            <p class="text-sm text-secondary-500">Manage your expense categories</p>
          </div>
        </div>
        <button
          v-if="!showNewCategoryInput"
          class="flex items-center gap-2 px-4 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 border border-primary-200 rounded-lg transition-colors font-medium"
          @click="showNewCategoryInput = true"
        >
          <PlusIcon class="w-4 h-4" />
          Add Category
        </button>
      </div>

      <!-- New Category Input -->
      <div v-if="showNewCategoryInput" class="mb-6 p-4 bg-secondary-50 rounded-xl">
        <label class="block text-sm font-medium text-secondary-700 mb-2">New Category Name</label>
        <div class="flex gap-2">
          <input
            v-model="newCategoryName"
            type="text"
            placeholder="e.g., Healthcare, Education"
            class="flex-1 px-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @keyup.enter="handleCreateCategory"
          />
          <button
            class="flex items-center gap-2 px-4 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
            :disabled="categoryLoading"
            @click="handleCreateCategory"
          >
            <span v-if="categoryLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <PlusIcon v-else class="w-4 h-4" />
            Add
          </button>
          <button
            class="px-4 py-2.5 text-secondary-600 hover:bg-secondary-100 border border-secondary-200 rounded-lg transition-colors"
            @click="showNewCategoryInput = false; newCategoryName = ''"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Default Categories -->
      <div class="mb-6">
        <h3 class="text-sm font-semibold text-secondary-700 mb-3 flex items-center gap-2">
          <ShieldCheckIcon class="w-4 h-4 text-secondary-400" />
          Default Categories
        </h3>
        <div class="grid gap-2">
          <div
            v-for="category in defaultCategories"
            :key="category.id"
            class="flex items-center justify-between p-4 bg-secondary-50 rounded-xl"
          >
            <div class="flex items-center gap-3">
              <span class="font-medium text-secondary-900">{{ category.name }}</span>
              <span class="text-xs text-secondary-500 bg-secondary-200 px-2 py-0.5 rounded-full">Default</span>
            </div>
          </div>
        </div>
        <p class="text-xs text-secondary-400 mt-3">Default categories cannot be deleted or renamed.</p>
      </div>

      <!-- Custom Categories -->
      <div>
        <h3 class="text-sm font-semibold text-secondary-700 mb-3">
          Custom Categories
          <span class="text-secondary-400 font-normal ml-1">({{ customCategories.length }})</span>
        </h3>

        <div v-if="customCategories.length === 0" class="text-center py-8 bg-secondary-50 rounded-xl">
          <div class="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <TagIcon class="w-6 h-6 text-secondary-400" />
          </div>
          <p class="text-secondary-500 mb-3">No custom categories yet.</p>
          <button
            class="text-primary-600 hover:text-primary-700 text-sm font-medium"
            @click="showNewCategoryInput = true"
          >
            Create your first custom category
          </button>
        </div>

        <div v-else class="grid gap-2">
          <div
            v-for="category in customCategories"
            :key="category.id"
            class="flex items-center justify-between p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors group"
          >
            <div class="flex items-center gap-3">
              <span class="font-medium text-secondary-900">{{ category.name }}</span>
              <span v-if="category.description" class="text-sm text-secondary-500">
                {{ category.description }}
              </span>
            </div>
            <button
              class="flex items-center gap-1 px-3 py-1.5 text-danger-600 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-colors text-sm font-medium opacity-0 group-hover:opacity-100"
              @click="confirmDeleteCategory(category.id, category.name)"
            >
              <TrashIcon class="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Category Confirmation Modal -->
    <UiConfirmModal
      :show="showDeleteCategoryConfirm"
      title="Delete Category"
      :message="`Are you sure you want to delete '${categoryToDelete?.name}'? Expenses with this category will need to be reassigned.`"
      confirm-text="Delete"
      :loading="deleteLoading"
      @confirm="handleDeleteCategory"
      @cancel="showDeleteCategoryConfirm = false; categoryToDelete = null"
    />
  </div>
</template>
