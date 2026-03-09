<script setup lang="ts">
import {
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckIcon,
  HomeIcon,
  FlagIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ArrowPathIcon,
  TruckIcon,
  UserPlusIcon,
  SparklesIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  layout: false,
});

const authStore = useAuthStore();
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  document.querySelectorAll("[data-animate]").forEach((el) => {
    observer.observe(el);
  });
});

const features = [
  {
    icon: CalendarDaysIcon,
    title: "Budget Periods",
    description:
      "Organize spending by any timeframe — monthly, biweekly, or custom.",
  },
  {
    icon: ChartBarIcon,
    title: "Visual Analytics",
    description:
      "Interactive charts that show where every dollar goes.",
  },
  {
    icon: FlagIcon,
    title: "Financial Goals",
    description:
      "Set savings targets with deadlines and track your progress.",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Debt Tracker",
    description:
      "Track who owes what, log payments, auto-settle balances.",
  },
  {
    icon: TruckIcon,
    title: "Vehicle Expenses",
    description:
      "Fuel, maintenance, insurance — track costs per vehicle.",
  },
  {
    icon: ArrowPathIcon,
    title: "Recurring Expenses",
    description:
      "Set up once, auto-applied each period. Templates included.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure by Default",
    description:
      "Two-factor auth, encrypted sessions, token rotation.",
  },
  {
    icon: SparklesIcon,
    title: "And Much More",
    description:
      "Tags, CSV import/export, dark mode, PWA, keyboard shortcuts.",
  },
];
</script>

<template>
  <div class="bg-white dark:bg-secondary-900">
    <LayoutPublicNavbar transparent />

    <!-- ==================== HERO ==================== -->
    <section class="relative overflow-hidden pt-16 sm:pt-20">
      <div
        class="absolute inset-0 bg-gradient-to-b from-primary-50/60 to-white dark:from-secondary-950 dark:to-secondary-900"
      ></div>

      <div
        class="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32"
      >
        <div class="text-center">
          <img
            src="/prospera-logo.png"
            alt="Prospera"
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out h-16 sm:h-24 lg:h-32 mx-auto mb-8 sm:mb-10"
          />

          <h1
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out text-3xl sm:text-4xl lg:text-5xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight tracking-tight"
            style="transition-delay: 100ms"
          >
            A simpler way to<br />
            <span
              class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent"
              >understand your money.</span
            >
          </h1>

          <p
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out mt-5 sm:mt-6 text-base sm:text-lg text-secondary-500 dark:text-secondary-400 max-w-xl mx-auto leading-relaxed"
            style="transition-delay: 200ms"
          >
            Track spending, set goals, and see where every dollar goes.
            Free, private, no ads — ever.
          </p>

          <div
            v-if="mounted"
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3"
            style="transition-delay: 300ms"
          >
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/dashboard">
                <button
                  class="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-semibold text-base"
                >
                  <HomeIcon class="w-5 h-5" />
                  Go to Dashboard
                </button>
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/auth/register">
                <button
                  class="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-semibold text-base group"
                >
                  Get Started — It's Free
                  <ArrowRightIcon
                    class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </NuxtLink>
              <NuxtLink to="/auth/login">
                <button
                  class="flex items-center justify-center w-full sm:w-auto px-7 py-3.5 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 rounded-xl transition-colors font-semibold text-base"
                >
                  Sign In
                </button>
              </NuxtLink>
            </template>
          </div>

          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-secondary-400 dark:text-secondary-500"
            style="transition-delay: 400ms"
          >
            <span class="flex items-center gap-1.5">
              <CheckIcon class="w-4 h-4 text-success-500" />
              Free forever
            </span>
            <span class="flex items-center gap-1.5">
              <CheckIcon class="w-4 h-4 text-success-500" />
              No credit card
            </span>
            <span class="flex items-center gap-1.5">
              <CheckIcon class="w-4 h-4 text-success-500" />
              No ads
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== HOW IT WORKS ==================== -->
    <section class="py-16 sm:py-20 lg:py-24">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          data-animate
          class="opacity-0 translate-y-6 transition-all duration-700 ease-out text-center text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-12 sm:mb-16"
        >
          Three steps to clarity
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8 text-center">
          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out"
          >
            <div
              class="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4"
            >
              <UserPlusIcon
                class="w-7 h-7 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3
              class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
            >
              Sign up
            </h3>
            <p class="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed">
              Create your account in seconds. Name, email, password — that's it.
            </p>
          </div>

          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out"
            style="transition-delay: 150ms"
          >
            <div
              class="w-14 h-14 rounded-2xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center mx-auto mb-4"
            >
              <CalendarDaysIcon
                class="w-7 h-7 text-accent-600 dark:text-accent-400"
              />
            </div>
            <h3
              class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
            >
              Track
            </h3>
            <p class="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed">
              Add your income and expenses. Use templates to make it fast.
            </p>
          </div>

          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out"
            style="transition-delay: 300ms"
          >
            <div
              class="w-14 h-14 rounded-2xl bg-success-50 dark:bg-success-900/30 flex items-center justify-center mx-auto mb-4"
            >
              <ChartBarIcon
                class="w-7 h-7 text-success-600 dark:text-success-400"
              />
            </div>
            <h3
              class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
            >
              Understand
            </h3>
            <p class="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed">
              Charts and insights appear as you go. See trends, set goals, take control.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== FEATURES ==================== -->
    <section
      class="py-16 sm:py-20 lg:py-24 bg-secondary-50/50 dark:bg-secondary-950/50"
    >
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-animate
          class="opacity-0 translate-y-6 transition-all duration-700 ease-out text-center mb-12 sm:mb-16"
        >
          <h2
            class="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-100"
          >
            Everything you need,
            <span class="text-primary-600 dark:text-primary-400"
              >nothing you don't</span
            >
          </h2>
          <p
            class="mt-3 text-base text-secondary-500 dark:text-secondary-400 max-w-xl mx-auto"
          >
            Built for simplicity. Powerful when you need it.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out bg-white dark:bg-secondary-800/80 p-5 sm:p-6 rounded-2xl border border-secondary-100 dark:border-secondary-700/80"
            :style="{ transitionDelay: `${index * 75}ms` }"
          >
            <component
              :is="feature.icon"
              class="w-6 h-6 text-primary-600 dark:text-primary-400 mb-3"
            />
            <h3
              class="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-1.5"
            >
              {{ feature.title }}
            </h3>
            <p
              class="text-xs text-secondary-500 dark:text-secondary-400 leading-relaxed"
            >
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== FINAL CTA ==================== -->
    <section class="py-16 sm:py-20 lg:py-24">
      <div
        data-animate
        class="opacity-0 translate-y-6 transition-all duration-700 ease-out max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h2
          class="text-2xl sm:text-3xl font-bold text-secondary-900 dark:text-secondary-100 mb-4"
        >
          Ready to take control?
        </h2>
        <p
          class="text-base text-secondary-500 dark:text-secondary-400 mb-8 max-w-md mx-auto"
        >
          Join Prospera and start understanding your money in minutes. No commitment, no cost.
        </p>

        <div v-if="mounted" class="flex flex-col sm:flex-row justify-center gap-3">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/dashboard">
              <button
                class="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-semibold text-base"
              >
                <HomeIcon class="w-5 h-5" />
                Go to Dashboard
              </button>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/auth/register">
              <button
                class="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl transition-colors font-semibold text-base group"
              >
                Create Your Free Account
                <ArrowRightIcon
                  class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                />
              </button>
            </NuxtLink>
          </template>
        </div>
      </div>
    </section>

    <LayoutPublicFooter />
  </div>
</template>

<style>
.animate-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
</style>
