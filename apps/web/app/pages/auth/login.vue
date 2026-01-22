<script setup lang="ts">
import {
  ArrowRightIcon,
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  layout: "auth",
});

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  email: "",
  password: "",
});

const loading = ref(false);
const error = ref<string | string[] | null>(null);

async function handleSubmit() {
  loading.value = true;
  error.value = null;

  const result = await authStore.login(form);

  loading.value = false;

  if (!result.success && result.error) {
    error.value = result.error.message;
    return;
  }

  router.push("/dashboard");
}
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">Welcome back</h2>
      <p class="text-secondary-500 dark:text-secondary-400 mt-2">
        Sign in to continue tracking your finances
      </p>
    </div>

    <UiBaseAlert v-if="error" type="error" :message="error" class="mb-6" />

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
          >Email address</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          >
            <EnvelopeIcon class="w-5 h-5 text-secondary-400" />
          </div>
          <input
            v-model="form.email"
            type="text"
            placeholder="you@example.com"
            required
            class="w-full pl-11 pr-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
          >Password</label
        >
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
          >
            <LockClosedIcon class="w-5 h-5 text-secondary-400" />
          </div>
          <input
            v-model="form.password"
            type="password"
            placeholder="Enter your password"
            required
            class="w-full pl-11 pr-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all shadow-card hover:shadow-card-hover font-semibold text-lg disabled:opacity-50 group"
        :disabled="loading"
      >
        <span
          v-if="loading"
          class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
        ></span>
        <template v-else>
          Sign in
          <ArrowRightIcon
            class="w-5 h-5 group-hover:translate-x-1 transition-transform"
          />
        </template>
      </button>
    </form>

    <div class="mt-8 pt-6 border-t border-secondary-100 dark:border-secondary-700">
      <p class="text-center text-sm text-secondary-500 dark:text-secondary-400">
        Don't have an account?
        <NuxtLink
          to="/auth/register"
          class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold ml-1"
        >
          Create one for free
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
