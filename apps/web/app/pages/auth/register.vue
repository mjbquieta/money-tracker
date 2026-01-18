<script setup lang="ts">
import type { RegisterPayload } from '~/types';

definePageMeta({
  layout: 'auth',
});

const authStore = useAuthStore();
const router = useRouter();

const steps = [
  { label: 'Info' },
  { label: 'Currency' },
];

const currentStep = ref(0);
const loading = ref(false);
const error = ref<string | string[] | null>(null);

const infoForm = reactive({
  email: '',
  name: '',
  username: '',
  password: '',
  confirmPassword: '',
});

const currencyForm = reactive({
  currency: 'PHP',
});

function validateInfoStep(): boolean {
  if (!infoForm.email || !infoForm.name || !infoForm.username || !infoForm.password) {
    error.value = 'Please fill in all required fields.';
    return false;
  }
  if (infoForm.password !== infoForm.confirmPassword) {
    error.value = 'Passwords do not match.';
    return false;
  }
  if (infoForm.password.length < 4) {
    error.value = 'Password must be at least 4 characters.';
    return false;
  }
  return true;
}

function validateCurrencyStep(): boolean {
  if (!currencyForm.currency) {
    error.value = 'Please select a currency.';
    return false;
  }
  return true;
}

function nextStep() {
  error.value = null;

  if (currentStep.value === 0 && !validateInfoStep()) return;

  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
}

function prevStep() {
  error.value = null;
  if (currentStep.value > 0) {
    currentStep.value--;
  }
}

async function handleSubmit() {
  error.value = null;

  if (!validateCurrencyStep()) return;

  loading.value = true;

  const payload: RegisterPayload = {
    email: infoForm.email,
    name: infoForm.name,
    username: infoForm.username,
    password: infoForm.password,
    settings: {
      currency: currencyForm.currency,
    },
  };

  const result = await authStore.register(payload);

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
    <h2 class="text-2xl font-bold text-gray-900 text-center mb-6">
      Create your account
    </h2>

    <UiStepIndicator :steps="steps" :current-step="currentStep" class="mb-8" />

    <UiBaseAlert v-if="error" type="error" :message="error" class="mb-6" />

    <form @submit.prevent="currentStep === steps.length - 1 ? handleSubmit() : nextStep()">
      <FormsRegisterStepInfo
        v-if="currentStep === 0"
        v-model="infoForm"
      />

      <FormsRegisterStepCurrency
        v-if="currentStep === 1"
        v-model="currencyForm"
      />

      <div class="mt-8 flex justify-between">
        <UiBaseButton
          v-if="currentStep > 0"
          type="button"
          variant="outline"
          @click="prevStep"
        >
          Previous
        </UiBaseButton>
        <div v-else />

        <UiBaseButton
          type="submit"
          :loading="loading"
        >
          {{ currentStep === steps.length - 1 ? 'Create Account' : 'Next' }}
        </UiBaseButton>
      </div>
    </form>

    <p class="mt-6 text-center text-sm text-gray-500">
      Already have an account?
      <NuxtLink to="/auth/login" class="text-blue-600 hover:underline font-medium">
        Sign in here
      </NuxtLink>
    </p>
  </div>
</template>
