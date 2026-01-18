<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
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

  router.push('/dashboard');
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-8">
      Sign in to your account
    </h2>

    <UiBaseAlert v-if="error" type="error" :message="error" class="mb-6" />

    <form class="space-y-6" @submit.prevent="handleSubmit">
      <UiBaseInput
        v-model="form.email"
        label="Email address"
        type="email"
        placeholder="you@example.com"
        required
      />

      <UiBaseInput
        v-model="form.password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        required
      />

      <UiBaseButton type="submit" class="w-full" :loading="loading">
        Sign in
      </UiBaseButton>
    </form>

    <p class="mt-6 text-center text-sm text-gray-500">
      Don't have an account?
      <NuxtLink to="/auth/register" class="text-blue-600 hover:underline font-medium">
        Register here
      </NuxtLink>
    </p>
  </div>
</template>
