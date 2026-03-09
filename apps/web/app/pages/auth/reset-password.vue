<script setup lang="ts">
import {
  ArrowLeftIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  layout: "auth",
});

const { post } = useApi();
const route = useRoute();
const router = useRouter();

const token = computed(() => route.query.token as string);

const form = reactive({
  newPassword: "",
  confirmPassword: "",
});

const loading = ref(false);
const error = ref<string | string[] | null>(null);
const success = ref(false);

async function handleSubmit() {
  if (form.newPassword !== form.confirmPassword) {
    error.value = "Passwords do not match";
    return;
  }

  if (form.newPassword.length < 8) {
    error.value = "Password must be at least 8 characters";
    return;
  }

  loading.value = true;
  error.value = null;

  const { error: apiError } = await post("/api/v1/auth/reset-password", {
    token: token.value,
    newPassword: form.newPassword,
  });

  loading.value = false;

  if (apiError) {
    error.value = apiError.message;
    return;
  }

  success.value = true;
}

// Redirect if no token
onMounted(() => {
  if (!token.value) {
    router.replace("/auth/forgot-password");
  }
});
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h2
        class="text-2xl font-bold text-secondary-900 dark:text-secondary-100"
      >
        Set new password
      </h2>
      <p class="text-secondary-500 dark:text-secondary-400 mt-2">
        Enter your new password below
      </p>
    </div>

    <!-- Success state -->
    <div v-if="success" class="text-center">
      <div
        class="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center"
      >
        <CheckCircleIcon class="w-8 h-8 text-primary-500" />
      </div>
      <h3
        class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
      >
        Password reset successful
      </h3>
      <p class="text-secondary-500 dark:text-secondary-400 text-sm mb-6">
        Your password has been updated. You can now sign in with your new
        password.
      </p>
      <NuxtLink
        to="/auth/login"
        class="inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all shadow-card hover:shadow-card-hover font-semibold text-lg"
      >
        Sign in
      </NuxtLink>
    </div>

    <!-- Form state -->
    <template v-else>
      <UiBaseAlert v-if="error" type="error" :message="error" class="mb-6" />

      <form class="space-y-5" @submit.prevent="handleSubmit">
        <div>
          <label
            class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
            >New password</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
            >
              <LockClosedIcon class="w-5 h-5 text-secondary-400" />
            </div>
            <input
              v-model="form.newPassword"
              type="password"
              placeholder="At least 8 characters"
              required
              minlength="8"
              class="w-full pl-11 pr-4 py-3 border border-secondary-200 dark:border-secondary-600 rounded-xl bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label
            class="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2"
            >Confirm new password</label
          >
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"
            >
              <LockClosedIcon class="w-5 h-5 text-secondary-400" />
            </div>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
              minlength="8"
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
          <template v-else>Reset password</template>
        </button>
      </form>

      <div
        class="mt-8 pt-6 border-t border-secondary-100 dark:border-secondary-700"
      >
        <p
          class="text-center text-sm text-secondary-500 dark:text-secondary-400"
        >
          <NuxtLink
            to="/auth/login"
            class="inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold"
          >
            <ArrowLeftIcon class="w-4 h-4" />
            Back to sign in
          </NuxtLink>
        </p>
      </div>
    </template>
  </div>
</template>
