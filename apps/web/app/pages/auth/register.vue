<script setup lang="ts">
import type { RegisterPayload } from '~/types';
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/vue/24/outline';

definePageMeta({
  layout: 'auth',
});

const authStore = useAuthStore();
const router = useRouter();

const steps = [
  { label: 'Account Info' },
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
    <div class="text-center mb-6">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-success-50 border border-success-200 rounded-full mb-4">
        <SparklesIcon class="w-4 h-4 text-success-600" />
        <span class="text-xs font-semibold text-success-700">100% Free</span>
      </div>
      <h2 class="text-2xl font-bold text-secondary-900">
        Create your account
      </h2>
      <p class="text-secondary-500 mt-2">Start tracking your finances today</p>
    </div>

    <!-- Step Indicator -->
    <div class="flex items-center justify-center gap-3 mb-8">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="flex items-center"
      >
        <div
          class="flex items-center gap-2 px-4 py-2 rounded-full transition-all"
          :class="index <= currentStep
            ? 'bg-primary-50 text-primary-700'
            : 'bg-secondary-50 text-secondary-400'"
        >
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all"
            :class="index < currentStep
              ? 'bg-primary-500 text-white'
              : index === currentStep
                ? 'bg-primary-500 text-white'
                : 'bg-secondary-200 text-secondary-500'"
          >
            <CheckCircleIcon v-if="index < currentStep" class="w-4 h-4" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <span class="text-sm font-medium hidden sm:inline">{{ step.label }}</span>
        </div>
        <div
          v-if="index < steps.length - 1"
          class="w-8 h-0.5 mx-2"
          :class="index < currentStep ? 'bg-primary-500' : 'bg-secondary-200'"
        />
      </div>
    </div>

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

      <div class="mt-8 flex justify-between gap-4">
        <button
          v-if="currentStep > 0"
          type="button"
          class="flex items-center gap-2 px-5 py-3 text-secondary-600 hover:text-secondary-800 hover:bg-secondary-50 border border-secondary-200 rounded-xl transition-colors font-medium group"
          @click="prevStep"
        >
          <ArrowLeftIcon class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Previous
        </button>
        <div v-else />

        <button
          type="submit"
          class="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all shadow-card hover:shadow-card-hover font-semibold disabled:opacity-50 group"
          :disabled="loading"
        >
          <span v-if="loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          <template v-else>
            {{ currentStep === steps.length - 1 ? 'Create Account' : 'Continue' }}
            <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </template>
        </button>
      </div>
    </form>

    <div class="mt-8 pt-6 border-t border-secondary-100">
      <p class="text-center text-sm text-secondary-500">
        Already have an account?
        <NuxtLink to="/auth/login" class="text-primary-600 hover:text-primary-700 font-semibold ml-1">
          Sign in here
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
