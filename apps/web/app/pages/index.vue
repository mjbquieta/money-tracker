<script setup lang="ts">
import {
  BanknotesIcon,
  ChartBarIcon,
  CreditCardIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ClockIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline';

const authStore = useAuthStore();
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

const features = [
  {
    icon: ChartBarIcon,
    title: 'Track Income',
    description: 'Monitor all your income sources in one place and understand your earning patterns over time.',
    color: 'success',
  },
  {
    icon: CreditCardIcon,
    title: 'Manage Expenses',
    description: 'Categorize and track your spending to identify areas where you can save money.',
    color: 'danger',
  },
  {
    icon: SparklesIcon,
    title: 'Visual Insights',
    description: 'Beautiful charts and metrics to help you visualize your financial health at a glance.',
    color: 'primary',
  },
  {
    icon: ShieldCheckIcon,
    title: 'Secure & Private',
    description: 'Your financial data stays private. We never share or sell your information.',
    color: 'accent',
  },
  {
    icon: ClockIcon,
    title: 'Budget Periods',
    description: 'Create custom budget periods to track your finances weekly, monthly, or any way you like.',
    color: 'primary',
  },
  {
    icon: BanknotesIcon,
    title: 'Multi-Currency',
    description: 'Support for multiple currencies including USD, EUR, GBP, PHP, JPY, and more.',
    color: 'success',
  },
];

const colorClasses = {
  success: { bg: 'bg-success-50', icon: 'text-success-600' },
  danger: { bg: 'bg-danger-50', icon: 'text-danger-600' },
  primary: { bg: 'bg-primary-50', icon: 'text-primary-600' },
  accent: { bg: 'bg-accent-50', icon: 'text-accent-600' },
};
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <!-- Background decoration - hidden on mobile for performance -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50/30"></div>
      <div class="hidden sm:block absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary-100 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
      <div class="hidden sm:block absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-accent-100 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32">
        <div class="text-center max-w-4xl mx-auto">
          <!-- Free Badge -->
          <div class="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-success-50 border border-success-200 rounded-full mb-6 sm:mb-8">
            <SparklesIcon class="w-4 h-4 sm:w-5 sm:h-5 text-success-600" />
            <span class="text-xs sm:text-sm font-semibold text-success-700">100% Free Forever</span>
          </div>

          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 leading-tight">
            Take Control of Your
            <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent"> Finances</span>
          </h1>

          <p class="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Track your income, manage expenses, and achieve your financial goals with our simple and intuitive money tracking tool.
            <span class="font-semibold text-primary-600">No hidden fees, no subscriptions.</span>
          </p>

          <div v-if="mounted" class="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/dashboard">
                <button class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all shadow-elevated hover:shadow-lg font-semibold text-base sm:text-lg">
                  <BanknotesIcon class="w-5 h-5 sm:w-6 sm:h-6" />
                  Go to Dashboard
                </button>
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/auth/register">
                <button class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all shadow-elevated hover:shadow-lg font-semibold text-base sm:text-lg group">
                  Get Started Free
                  <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </NuxtLink>
              <NuxtLink to="/auth/login">
                <button class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-secondary-700 hover:text-primary-700 bg-white hover:bg-primary-50 border-2 border-secondary-200 hover:border-primary-300 rounded-xl transition-all font-semibold text-base sm:text-lg">
                  Sign In
                </button>
              </NuxtLink>
            </template>
          </div>

          <!-- Trust indicators -->
          <div class="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-secondary-500 px-4 sm:px-0">
            <div class="flex items-center gap-1.5 sm:gap-2">
              <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-success-500" />
              <span>No credit card</span>
            </div>
            <div class="flex items-center gap-1.5 sm:gap-2">
              <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-success-500" />
              <span>Free forever</span>
            </div>
            <div class="flex items-center gap-1.5 sm:gap-2">
              <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-success-500" />
              <span>No ads</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-12 sm:py-16 lg:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900">
            Everything You Need to
            <span class="text-primary-600">Manage Money</span>
          </h2>
          <p class="mt-3 sm:mt-4 text-base sm:text-lg text-secondary-500 max-w-2xl mx-auto px-4 sm:px-0">
            Powerful features to help you track, analyze, and improve your financial health.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="bg-white p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-secondary-100 hover:border-primary-200 hover:shadow-card-hover transition-all group"
          >
            <div
              class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform"
              :class="colorClasses[feature.color as keyof typeof colorClasses].bg"
            >
              <component
                :is="feature.icon"
                class="w-6 h-6 sm:w-7 sm:h-7"
                :class="colorClasses[feature.color as keyof typeof colorClasses].icon"
              />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 mb-2 sm:mb-3">{{ feature.title }}</h3>
            <p class="text-sm sm:text-base text-secondary-500 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
      <!-- Decorative elements - hidden on mobile -->
      <div class="hidden sm:block absolute top-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
      <div class="hidden sm:block absolute bottom-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-accent-400/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 rounded-full mb-4 sm:mb-6">
          <SparklesIcon class="w-4 h-4 sm:w-5 sm:h-5 text-accent-300" />
          <span class="text-xs sm:text-sm font-semibold text-white">Completely Free</span>
        </div>

        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
          Start Tracking Your Money Today
        </h2>
        <p class="text-base sm:text-lg lg:text-xl text-primary-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-2 sm:px-0">
          Join thousands of users who have taken control of their finances. No credit card required, no hidden fees, just simple money tracking.
        </p>

        <div v-if="mounted" class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/dashboard">
              <button class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-700 hover:bg-primary-50 rounded-xl transition-all shadow-lg font-semibold text-base sm:text-lg">
                <BanknotesIcon class="w-5 h-5 sm:w-6 sm:h-6" />
                Go to Dashboard
              </button>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/auth/register">
              <button class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-700 hover:bg-primary-50 rounded-xl transition-all shadow-lg font-semibold text-base sm:text-lg group">
                Create Free Account
                <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </NuxtLink>
          </template>
        </div>

        <p class="mt-4 sm:mt-6 text-primary-200 text-xs sm:text-sm">
          Free forever. No strings attached.
        </p>
      </div>
    </section>

    <!-- Simple How It Works -->
    <section class="py-12 sm:py-16 lg:py-20 bg-secondary-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900">
            How It Works
          </h2>
          <p class="mt-3 sm:mt-4 text-base sm:text-lg text-secondary-500">
            Get started in just three simple steps
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-8">
          <div class="text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <span class="text-xl sm:text-2xl font-bold text-primary-600">1</span>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 mb-2 sm:mb-3">Create Account</h3>
            <p class="text-sm sm:text-base text-secondary-500 px-4 sm:px-0">Sign up for free in seconds. No credit card or payment info needed.</p>
          </div>

          <div class="text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <span class="text-xl sm:text-2xl font-bold text-primary-600">2</span>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 mb-2 sm:mb-3">Add Your Budget</h3>
            <p class="text-sm sm:text-base text-secondary-500 px-4 sm:px-0">Create budget periods, add your income, and start tracking expenses.</p>
          </div>

          <div class="text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <span class="text-xl sm:text-2xl font-bold text-primary-600">3</span>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 mb-2 sm:mb-3">See Your Progress</h3>
            <p class="text-sm sm:text-base text-secondary-500 px-4 sm:px-0">View charts, metrics, and insights to improve your financial health.</p>
          </div>
        </div>

        <div v-if="mounted && !authStore.isAuthenticated" class="text-center mt-10 sm:mt-12 px-4 sm:px-0">
          <NuxtLink to="/auth/register">
            <button class="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all shadow-card hover:shadow-card-hover font-semibold text-base sm:text-lg group">
              Start For Free
              <ArrowRightIcon class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
