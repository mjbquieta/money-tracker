<script setup lang="ts">
import { ShieldCheckIcon } from '@heroicons/vue/24/outline';
import type { User } from '~/types';

definePageMeta({
  layout: 'auth',
});

const api = useApi();
const authStore = useAuthStore();
const { setAccessToken } = useAuthInterceptor();
const router = useRouter();

const code = ref('');
const useBackupCode = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

async function handleSubmit() {
  if (!code.value.trim()) return;

  loading.value = true;
  error.value = null;

  const { data, error: apiError } = await api.post<{
    user: User;
    accessToken: string;
  }>('/api/v1/auth/2fa/authenticate', {
    code: code.value.trim(),
    isBackupCode: useBackupCode.value,
  });

  loading.value = false;

  if (apiError) {
    error.value =
      typeof apiError.message === 'string'
        ? apiError.message
        : apiError.message[0];
    return;
  }

  if (data) {
    setAccessToken(data.accessToken);
    authStore.user = data.user;
    if (import.meta.client) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    router.push('/dashboard');
  }
}

function toggleBackupCode() {
  useBackupCode.value = !useBackupCode.value;
  code.value = '';
  error.value = null;
}
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <div
        class="w-16 h-16 bg-primary-50 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center mx-auto mb-4"
      >
        <ShieldCheckIcon class="w-8 h-8 text-primary-600 dark:text-primary-400" />
      </div>
      <h2 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
        Two-Factor Authentication
      </h2>
      <p class="text-secondary-500 dark:text-secondary-400 mt-2">
        {{
          useBackupCode
            ? 'Enter one of your backup codes'
            : 'Enter the 6-digit code from your authenticator app'
        }}
      </p>
    </div>

    <UiBaseAlert v-if="error" type="error" :message="error" class="mb-6" />

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label
          class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
        >
          {{ useBackupCode ? 'Backup Code' : 'Verification Code' }}
        </label>
        <input
          v-model="code"
          :type="'text'"
          :placeholder="useBackupCode ? 'Enter 8-character backup code' : 'Enter 6-digit code'"
          :maxlength="useBackupCode ? 8 : 6"
          required
          autocomplete="one-time-code"
          class="w-full px-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 text-center text-2xl tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
        />
      </div>

      <button
        type="submit"
        class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all shadow-card hover:shadow-card-hover font-semibold text-lg disabled:opacity-50"
        :disabled="loading || !code.trim()"
      >
        <span
          v-if="loading"
          class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
        ></span>
        <template v-else>Verify</template>
      </button>
    </form>

    <div class="mt-6 text-center">
      <button
        class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
        @click="toggleBackupCode"
      >
        {{
          useBackupCode
            ? 'Use authenticator app instead'
            : 'Use a backup code instead'
        }}
      </button>
    </div>

    <div class="mt-4 text-center">
      <NuxtLink
        to="/auth/login"
        class="text-sm text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300"
      >
        Back to login
      </NuxtLink>
    </div>
  </div>
</template>
