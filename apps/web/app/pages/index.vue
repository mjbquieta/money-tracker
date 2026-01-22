<script setup lang="ts">
import {
  ChartBarIcon,
  CreditCardIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckIcon,
  HomeIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  layout: false,
});

const authStore = useAuthStore();
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});

const features = [
  {
    icon: CreditCardIcon,
    title: "Track Effortlessly",
    description:
      "Log income and expenses in seconds. See exactly where your money goes without the complexity.",
    color: "primary",
  },
  {
    icon: ChartBarIcon,
    title: "Understand Patterns",
    description:
      "Clear insights into your spending habits at a glance. No confusing charts or financial jargon.",
    color: "success",
  },
  {
    icon: ArrowTrendingUpIcon,
    title: "Grow Your Savings",
    description:
      "Set meaningful financial goals and watch your progress. Small, consistent steps lead to big results.",
    color: "accent",
  },
  {
    icon: HeartIcon,
    title: "Build Better Habits",
    description:
      "Develop a healthier relationship with money through calm, supportive guidance over time.",
    color: "danger",
  },
  {
    icon: ShieldCheckIcon,
    title: "Private & Secure",
    description:
      "Your financial data stays yours. We never share or sell your information.",
    color: "primary",
  },
  {
    icon: SparklesIcon,
    title: "Simple by Design",
    description:
      "Clarity over clutter. A calm, intuitive experience that makes managing money feel effortless.",
    color: "success",
  },
];

const colorClasses = {
  success: { bg: "bg-success-50 dark:bg-success-900/30", icon: "text-success-600 dark:text-success-400" },
  danger: { bg: "bg-danger-50 dark:bg-danger-900/30", icon: "text-danger-600 dark:text-danger-400" },
  primary: { bg: "bg-primary-50 dark:bg-primary-900/30", icon: "text-primary-600 dark:text-primary-400" },
  accent: { bg: "bg-accent-50 dark:bg-accent-900/30", icon: "text-accent-600 dark:text-accent-400" },
};
</script>

<template>
  <div>
    <!-- Navbar -->
    <LayoutPublicNavbar transparent />

    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-16 sm:pt-20">
      <!-- Background decoration - hidden on mobile for performance -->
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50/30 dark:from-secondary-950 dark:via-secondary-900 dark:to-primary-950/30"
      ></div>
      <div
        class="hidden sm:block absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary-100 dark:bg-primary-900/30 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"
      ></div>
      <div
        class="hidden sm:block absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-accent-100 dark:bg-accent-900/30 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"
      ></div>

      <div
        class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32"
      >
        <div class="text-center max-w-4xl mx-auto">
          <!-- Brand Logo -->
          <img
            src="/prospera-logo.png"
            alt="Prospera"
            class="h-20 sm:h-28 md:h-36 lg:h-44 mx-auto mb-6 sm:mb-8"
          />

          <!-- Free Badge -->
          <div
            class="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-700 rounded-full mb-6 sm:mb-8"
          >
            <SparklesIcon class="w-4 h-4 sm:w-5 sm:h-5 text-success-600 dark:text-success-400" />
            <span class="text-xs sm:text-sm font-semibold text-success-700 dark:text-success-300"
              >100% Free Forever</span
            >
          </div>

          <h2
            class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight"
          >
            Your Path to
            <span
              class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent"
            >
              Financial Well-being</span
            >
          </h2>

          <p
            class="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
          >
            Track your money, manage expenses, and build healthier financial
            habits — so you can focus on growing your future with confidence.
            <span class="font-semibold text-primary-600"
              >Free forever. No strings attached.</span
            >
          </p>

          <div
            v-if="mounted"
            class="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
          >
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/dashboard">
                <button
                  class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all shadow-elevated hover:shadow-lg font-semibold text-base sm:text-lg"
                >
                  <HomeIcon class="w-5 h-5 sm:w-6 sm:h-6" />
                  Go to Dashboard
                </button>
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/auth/register">
                <button
                  class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all shadow-elevated hover:shadow-lg font-semibold text-base sm:text-lg group"
                >
                  Get Started Free
                  <ArrowRightIcon
                    class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </NuxtLink>
              <NuxtLink to="/auth/login">
                <button
                  class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-secondary-700 dark:text-secondary-300 hover:text-primary-700 dark:hover:text-primary-400 bg-white dark:bg-secondary-800 hover:bg-primary-50 dark:hover:bg-primary-900/50 border-2 border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 rounded-xl transition-all font-semibold text-base sm:text-lg"
                >
                  Sign In
                </button>
              </NuxtLink>
            </template>
          </div>

          <!-- Trust indicators -->
          <div
            class="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 px-4 sm:px-0"
          >
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
    <section class="py-12 sm:py-16 lg:py-20 bg-white dark:bg-secondary-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 sm:mb-16">
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100"
          >
            Simple Tools for
            <span class="text-primary-600 dark:text-primary-400">Lasting Prosperity</span>
          </h2>
          <p
            class="mt-3 sm:mt-4 text-base sm:text-lg text-secondary-500 dark:text-secondary-400 max-w-2xl mx-auto px-4 sm:px-0"
          >
            Everything you need to understand, control, and grow your finances —
            without the overwhelm.
          </p>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          <div
            v-for="feature in features"
            :key="feature.title"
            class="bg-white dark:bg-secondary-800 p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-secondary-100 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-600 hover:shadow-card-hover transition-all group"
          >
            <div
              class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform"
              :class="
                colorClasses[feature.color as keyof typeof colorClasses].bg
              "
            >
              <component
                :is="feature.icon"
                class="w-6 h-6 sm:w-7 sm:h-7"
                :class="
                  colorClasses[feature.color as keyof typeof colorClasses].icon
                "
              />
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3"
            >
              {{ feature.title }}
            </h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 leading-relaxed">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section
      class="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden"
    >
      <!-- Decorative elements - hidden on mobile -->
      <div
        class="hidden sm:block absolute top-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"
      ></div>
      <div
        class="hidden sm:block absolute bottom-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-accent-400/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"
      ></div>

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 rounded-full mb-4 sm:mb-6"
        >
          <SparklesIcon class="w-4 h-4 sm:w-5 sm:h-5 text-accent-300" />
          <span class="text-xs sm:text-sm font-semibold text-white"
            >Completely Free</span
          >
        </div>

        <h2
          class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6"
        >
          Start Your Journey to Prosperity
        </h2>
        <p
          class="text-base sm:text-lg lg:text-xl text-primary-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-2 sm:px-0"
        >
          Join people who are building a healthier relationship with money.
          Progress over perfection — every small step counts.
        </p>

        <div
          v-if="mounted"
          class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
        >
          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/dashboard">
              <button
                class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-700 hover:bg-primary-50 rounded-xl transition-all shadow-lg font-semibold text-base sm:text-lg"
              >
                <HomeIcon class="w-5 h-5 sm:w-6 sm:h-6" />
                Go to Dashboard
              </button>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/auth/register">
              <button
                class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-700 hover:bg-primary-50 rounded-xl transition-all shadow-lg font-semibold text-base sm:text-lg group"
              >
                Create Free Account
                <ArrowRightIcon
                  class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                />
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
    <section class="py-12 sm:py-16 lg:py-20 bg-secondary-50 dark:bg-secondary-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 sm:mb-16">
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100"
          >
            How It Works
          </h2>
          <p class="mt-3 sm:mt-4 text-base sm:text-lg text-secondary-500 dark:text-secondary-400">
            Get started in just three simple steps
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-8">
          <div class="text-center">
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900/50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5"
            >
              <span class="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400"
                >1</span
              >
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3"
            >
              Sign Up Free
            </h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 px-4 sm:px-0">
              Create your account in seconds. No credit card, no commitments.
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900/50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5"
            >
              <span class="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400"
                >2</span
              >
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3"
            >
              Track Your Flow
            </h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 px-4 sm:px-0">
              Add income and expenses as they happen. Keep it simple, stay
              consistent.
            </p>
          </div>

          <div class="text-center">
            <div
              class="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900/50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5"
            >
              <span class="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400"
                >3</span
              >
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3"
            >
              Grow With Clarity
            </h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 px-4 sm:px-0">
              Watch your progress unfold. Build confidence and healthier money
              habits.
            </p>
          </div>
        </div>

        <div
          v-if="mounted && !authStore.isAuthenticated"
          class="text-center mt-10 sm:mt-12 px-4 sm:px-0"
        >
          <NuxtLink to="/auth/register">
            <button
              class="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all shadow-card hover:shadow-card-hover font-semibold text-base sm:text-lg group"
            >
              Start For Free
              <ArrowRightIcon
                class="w-5 h-5 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 sm:py-12 bg-white dark:bg-secondary-900 border-t border-secondary-100 dark:border-secondary-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-3">
            <img
              src="/prospera-icon.png"
              alt="Prospera"
              class="w-8 h-8"
            />
            <span class="font-semibold text-secondary-700 dark:text-secondary-300">Prospera</span>
          </div>
          <div class="flex items-center gap-6 sm:gap-8">
            <NuxtLink
              to="/feedback"
              class="text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
            >
              Request Improvements
            </NuxtLink>
            <NuxtLink
              to="/about"
              class="text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
            >
              About & Donate
            </NuxtLink>
          </div>
          <p class="text-sm text-secondary-400 dark:text-secondary-500 flex items-center gap-1">
            Made with <HeartIcon class="w-4 h-4 text-danger-500" /> for everyone
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
