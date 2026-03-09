<script setup lang="ts">
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PaperAirplaneIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  layout: "auth",
});

const { post } = useApi();

const email = ref("");
const loading = ref(false);
const error = ref<string | string[] | null>(null);
const sent = ref(false);

async function handleSubmit() {
  loading.value = true;
  error.value = null;

  const { error: apiError } = await post("/api/v1/auth/forgot-password", {
    email: email.value,
  });

  loading.value = false;

  if (apiError) {
    error.value = apiError.message;
    return;
  }

  sent.value = true;
}
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
        Forgot your password?
      </h2>
      <p class="text-secondary-500 dark:text-secondary-400 mt-2">
        Enter your email and we'll send you a reset link
      </p>
    </div>

    <!-- Success state -->
    <div v-if="sent" class="text-center">
      <div
        class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center"
      >
        <PaperAirplaneIcon class="w-8 h-8 text-primary-500" />
      </div>
      <h3
        class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
      >
        Check your email
      </h3>
      <p class="text-secondary-500 dark:text-secondary-400 text-sm mb-6">
        If an account with <strong>{{ email }}</strong> exists, we've sent a
        password reset link. Check your inbox and spam folder.
      </p>
      <NuxtLink
        to="/auth/login"
        class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold text-sm"
      >
        <ArrowLeftIcon class="w-4 h-4" />
        Back to sign in
      </NuxtLink>
    </div>

    <!-- Form state -->
    <template v-else>
      <UiBaseAlert v-if="error" type="error" :message="error" class="mb-6" />

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label
            class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
            >Email address</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
            >
              <EnvelopeIcon class="w-5 h-5 text-secondary-400" />
            </div>
            <input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              required
              class="w-full pl-11 pr-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          class="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all shadow-card hover:shadow-card-hover font-semibold text-lg disabled:opacity-50"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
          ></span>
          <template v-else>Send reset link</template>
        </button>
      </form>

      <div
        class="mt-8 pt-6 border-t border-secondary-100 dark:border-secondary-700"
      >
        <p
          class="text-center text-sm text-secondary-500 dark:text-secondary-400"
        >
          Remember your password?
          <NuxtLink
            to="/auth/login"
            class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold ml-1"
          >
            Sign in
          </NuxtLink>
        </p>
      </div>
    </template>
  </div>
</template>
