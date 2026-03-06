<script setup lang="ts">
import {
  ChartBarIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckIcon,
  HomeIcon,
  FlagIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  TagIcon,
  DevicePhoneMobileIcon,
  MoonIcon,
  CommandLineIcon,
  BellIcon,
  DocumentArrowDownIcon,
  UserPlusIcon,
} from "@heroicons/vue/24/outline";

definePageMeta({
  layout: false,
});

const authStore = useAuthStore();
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;

  // Scroll animation observer
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

const extraFeatures = [
  { icon: ClipboardDocumentListIcon, label: "Personal Budgets & Wishlists" },
  { icon: TagIcon, label: "Tags & Advanced Filters" },
  { icon: MagnifyingGlassIcon, label: "Powerful Expense Search" },
  { icon: DocumentArrowDownIcon, label: "CSV Export & Import" },
  { icon: MoonIcon, label: "Dark Mode" },
  { icon: DevicePhoneMobileIcon, label: "Installable PWA" },
  { icon: CommandLineIcon, label: "Keyboard Shortcuts" },
  { icon: BellIcon, label: "In-App Notifications" },
];
</script>

<template>
  <div>
    <!-- Navbar -->
    <LayoutPublicNavbar transparent />

    <!-- ==================== HERO ==================== -->
    <section class="relative overflow-hidden pt-16 sm:pt-20">
      <div
        class="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-white to-accent-50/40 dark:from-secondary-950 dark:via-secondary-900 dark:to-primary-950/20"
      ></div>
      <div
        class="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-primary-100/60 dark:bg-primary-900/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4"
      ></div>
      <div
        class="hidden sm:block absolute bottom-0 left-0 w-72 h-72 bg-accent-100/60 dark:bg-accent-900/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"
      ></div>

      <div
        class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28"
      >
        <div class="text-center max-w-4xl mx-auto">
          <img
            src="/prospera-logo.png"
            alt="Prospera"
            class="h-20 sm:h-28 md:h-36 lg:h-44 mx-auto mb-6 sm:mb-8"
          />

          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-full mb-6 sm:mb-8"
          >
            <SparklesIcon
              class="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 dark:text-primary-400"
            />
            <span
              class="text-xs sm:text-sm font-semibold text-primary-700 dark:text-primary-300"
              >Free & open for everyone</span
            >
          </div>

          <h2
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight"
            style="transition-delay: 100ms"
          >
            Your money story
            <span
              class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent"
              >starts here.</span
            >
          </h2>

          <p
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0"
            style="transition-delay: 200ms"
          >
            Prospera is a simple, free tool that helps you understand where your
            money goes — so you can spend with intention, save with purpose, and
            stress a little less.
          </p>

          <div
            v-if="mounted"
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0"
            style="transition-delay: 300ms"
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
                  Start your journey
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

          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 px-4 sm:px-0"
            style="transition-delay: 400ms"
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
            <div class="flex items-center gap-1.5 sm:gap-2">
              <CheckIcon class="w-4 h-4 sm:w-5 sm:h-5 text-success-500" />
              <span>Two-factor auth</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== DASHBOARD PREVIEW ==================== -->
    <section class="py-8 sm:py-12 bg-white dark:bg-secondary-900">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-animate
          class="opacity-0 translate-y-6 transition-all duration-700 ease-out"
        >
          <div
            class="transform -rotate-1 hover:rotate-0 hover:scale-[1.01] transition-transform duration-500 bg-secondary-50 dark:bg-secondary-800 rounded-2xl border border-secondary-200/60 dark:border-secondary-700/60 shadow-2xl overflow-hidden"
          >
            <!-- Browser chrome -->
            <div
              class="flex items-center gap-2 px-4 py-3 bg-secondary-100 dark:bg-secondary-700 border-b border-secondary-200 dark:border-secondary-600"
            >
              <div class="flex gap-1.5">
                <div class="w-3 h-3 rounded-full bg-danger-400"></div>
                <div class="w-3 h-3 rounded-full bg-warning-400"></div>
                <div class="w-3 h-3 rounded-full bg-success-400"></div>
              </div>
              <div class="flex-1 mx-4">
                <div
                  class="bg-white dark:bg-secondary-800 rounded-md px-3 py-1 text-xs text-secondary-400 dark:text-secondary-500 max-w-xs mx-auto text-center"
                >
                  prospera.michaelquieta.com/dashboard
                </div>
              </div>
            </div>

            <!-- Dashboard content -->
            <div class="p-4 sm:p-6 space-y-4">
              <!-- Metric cards row -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div
                  class="bg-white dark:bg-secondary-900 rounded-xl p-3 sm:p-4 border border-secondary-100 dark:border-secondary-700"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <div
                      class="w-7 h-7 bg-success-50 dark:bg-success-900/30 rounded-md flex items-center justify-center"
                    >
                      <ArrowTrendingUpIcon
                        class="w-4 h-4 text-success-500"
                      />
                    </div>
                    <span
                      class="text-[10px] sm:text-xs text-secondary-500 dark:text-secondary-400"
                      >Total Income</span
                    >
                  </div>
                  <p
                    class="text-sm sm:text-lg font-bold text-success-600 dark:text-success-400"
                  >
                    $12,450
                  </p>
                </div>
                <div
                  class="bg-white dark:bg-secondary-900 rounded-xl p-3 sm:p-4 border border-secondary-100 dark:border-secondary-700"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <div
                      class="w-7 h-7 bg-danger-50 dark:bg-danger-900/30 rounded-md flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-danger-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181"
                        />
                      </svg>
                    </div>
                    <span
                      class="text-[10px] sm:text-xs text-secondary-500 dark:text-secondary-400"
                      >Expenses</span
                    >
                  </div>
                  <p
                    class="text-sm sm:text-lg font-bold text-danger-600 dark:text-danger-400"
                  >
                    $8,230
                  </p>
                </div>
                <div
                  class="bg-white dark:bg-secondary-900 rounded-xl p-3 sm:p-4 border border-secondary-100 dark:border-secondary-700"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <div
                      class="w-7 h-7 bg-primary-50 dark:bg-primary-900/30 rounded-md flex items-center justify-center"
                    >
                      <svg
                        class="w-4 h-4 text-primary-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                        />
                      </svg>
                    </div>
                    <span
                      class="text-[10px] sm:text-xs text-secondary-500 dark:text-secondary-400"
                      >Net Savings</span
                    >
                  </div>
                  <p
                    class="text-sm sm:text-lg font-bold text-primary-600 dark:text-primary-400"
                  >
                    $4,220
                  </p>
                </div>
                <div
                  class="bg-white dark:bg-secondary-900 rounded-xl p-3 sm:p-4 border border-secondary-100 dark:border-secondary-700"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <div
                      class="w-7 h-7 bg-success-50 dark:bg-success-900/30 rounded-md flex items-center justify-center"
                    >
                      <SparklesIcon class="w-4 h-4 text-success-500" />
                    </div>
                    <span
                      class="text-[10px] sm:text-xs text-secondary-500 dark:text-secondary-400"
                      >Savings Rate</span
                    >
                  </div>
                  <p
                    class="text-sm sm:text-lg font-bold text-success-600 dark:text-success-400"
                  >
                    33.9%
                  </p>
                  <div
                    class="mt-1.5 h-1.5 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden"
                  >
                    <div
                      class="h-full w-[34%] bg-success-500 rounded-full"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- Chart + sidebar row -->
              <div class="grid lg:grid-cols-3 gap-3">
                <div
                  class="lg:col-span-2 bg-white dark:bg-secondary-900 rounded-xl p-4 border border-secondary-100 dark:border-secondary-700"
                >
                  <div class="flex items-center gap-2 mb-3">
                    <ChartBarIcon class="w-4 h-4 text-primary-500" />
                    <span
                      class="text-xs font-semibold text-secondary-700 dark:text-secondary-300"
                      >Monthly Income vs Expenses</span
                    >
                  </div>
                  <div class="flex items-end gap-2 sm:gap-3 h-28 sm:h-36">
                    <div
                      v-for="(pair, i) in [
                        [65, 45],
                        [70, 55],
                        [60, 40],
                        [75, 50],
                        [80, 60],
                        [72, 48],
                      ]"
                      :key="i"
                      class="flex-1 flex items-end gap-0.5 sm:gap-1"
                    >
                      <div
                        class="flex-1 bg-success-400/80 dark:bg-success-500/60 rounded-t-sm"
                        :style="{ height: `${pair[0]}%` }"
                      ></div>
                      <div
                        class="flex-1 bg-danger-400/80 dark:bg-danger-500/60 rounded-t-sm"
                        :style="{ height: `${pair[1]}%` }"
                      ></div>
                    </div>
                  </div>
                  <div class="flex justify-between mt-2">
                    <span
                      v-for="m in ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']"
                      :key="m"
                      class="text-[9px] sm:text-[10px] text-secondary-400 dark:text-secondary-500"
                      >{{ m }}</span
                    >
                  </div>
                  <div class="flex items-center gap-3 mt-2 sm:mt-3">
                    <div class="flex items-center gap-1">
                      <div
                        class="w-2.5 h-2.5 bg-success-400 rounded-sm"
                      ></div>
                      <span
                        class="text-[10px] text-secondary-500 dark:text-secondary-400"
                        >Income</span
                      >
                    </div>
                    <div class="flex items-center gap-1">
                      <div
                        class="w-2.5 h-2.5 bg-danger-400 rounded-sm"
                      ></div>
                      <span
                        class="text-[10px] text-secondary-500 dark:text-secondary-400"
                        >Expenses</span
                      >
                    </div>
                  </div>
                </div>

                <div class="space-y-3">
                  <div
                    class="bg-white dark:bg-secondary-900 rounded-xl p-4 border border-secondary-100 dark:border-secondary-700"
                  >
                    <div class="flex items-center gap-2 mb-3">
                      <FlagIcon class="w-4 h-4 text-primary-500" />
                      <span
                        class="text-xs font-semibold text-secondary-700 dark:text-secondary-300"
                        >Financial Goals</span
                      >
                    </div>
                    <div class="space-y-2.5">
                      <div>
                        <div class="flex justify-between text-[10px] mb-1">
                          <span
                            class="text-secondary-600 dark:text-secondary-400"
                            >Emergency Fund</span
                          >
                          <span
                            class="font-semibold text-primary-600 dark:text-primary-400"
                            >72%</span
                          >
                        </div>
                        <div
                          class="h-1.5 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden"
                        >
                          <div
                            class="h-full w-[72%] bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div class="flex justify-between text-[10px] mb-1">
                          <span
                            class="text-secondary-600 dark:text-secondary-400"
                            >New Laptop</span
                          >
                          <span
                            class="font-semibold text-accent-600 dark:text-accent-400"
                            >45%</span
                          >
                        </div>
                        <div
                          class="h-1.5 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden"
                        >
                          <div
                            class="h-full w-[45%] bg-gradient-to-r from-accent-400 to-accent-600 rounded-full"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="bg-white dark:bg-secondary-900 rounded-xl p-4 border border-secondary-100 dark:border-secondary-700"
                  >
                    <div class="flex items-center gap-2 mb-3">
                      <CurrencyDollarIcon class="w-4 h-4 text-primary-500" />
                      <span
                        class="text-xs font-semibold text-secondary-700 dark:text-secondary-300"
                        >Debt Tracker</span
                      >
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                      <div
                        class="p-2 bg-danger-50 dark:bg-danger-900/20 rounded-lg text-center"
                      >
                        <p
                          class="text-[10px] text-secondary-500 dark:text-secondary-400"
                        >
                          I Owe
                        </p>
                        <p
                          class="text-xs font-bold text-danger-600 dark:text-danger-400"
                        >
                          $1,200
                        </p>
                      </div>
                      <div
                        class="p-2 bg-success-50 dark:bg-success-900/20 rounded-lg text-center"
                      >
                        <p
                          class="text-[10px] text-secondary-500 dark:text-secondary-400"
                        >
                          Owed to Me
                        </p>
                        <p
                          class="text-xs font-bold text-success-600 dark:text-success-400"
                        >
                          $850
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== TRUST SIGNALS ==================== -->
    <section class="py-10 sm:py-14 bg-secondary-50/50 dark:bg-secondary-950/50">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out flex flex-col items-center text-center p-4 sm:p-6"
          >
            <div
              class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-3"
            >
              <SparklesIcon
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <p
              class="text-sm font-semibold text-secondary-900 dark:text-secondary-100"
            >
              Free forever
            </p>
            <p
              class="text-xs text-secondary-500 dark:text-secondary-400 mt-1"
            >
              No premium tiers, no hidden fees
            </p>
          </div>

          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out flex flex-col items-center text-center p-4 sm:p-6"
            style="transition-delay: 75ms"
          >
            <div
              class="w-12 h-12 rounded-xl bg-success-50 dark:bg-success-900/30 flex items-center justify-center mb-3"
            >
              <ShieldCheckIcon
                class="w-6 h-6 text-success-600 dark:text-success-400"
              />
            </div>
            <p
              class="text-sm font-semibold text-secondary-900 dark:text-secondary-100"
            >
              Your data, secured
            </p>
            <p
              class="text-xs text-secondary-500 dark:text-secondary-400 mt-1"
            >
              2FA, encrypted sessions, token rotation
            </p>
          </div>

          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out flex flex-col items-center text-center p-4 sm:p-6"
            style="transition-delay: 150ms"
          >
            <div
              class="w-12 h-12 rounded-xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center mb-3"
            >
              <HeartIcon
                class="w-6 h-6 text-accent-600 dark:text-accent-400"
              />
            </div>
            <p
              class="text-sm font-semibold text-secondary-900 dark:text-secondary-100"
            >
              No ads, ever
            </p>
            <p
              class="text-xs text-secondary-500 dark:text-secondary-400 mt-1"
            >
              No tracking, no selling your data
            </p>
          </div>

          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out flex flex-col items-center text-center p-4 sm:p-6"
            style="transition-delay: 225ms"
          >
            <div
              class="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center mb-3"
            >
              <DevicePhoneMobileIcon
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <p
              class="text-sm font-semibold text-secondary-900 dark:text-secondary-100"
            >
              Works everywhere
            </p>
            <p
              class="text-xs text-secondary-500 dark:text-secondary-400 mt-1"
            >
              PWA — install on any device
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== FEATURE BENTO GRID ==================== -->
    <section class="py-12 sm:py-16 lg:py-20 bg-white dark:bg-secondary-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-animate
          class="opacity-0 translate-y-6 transition-all duration-700 ease-out text-center mb-10 sm:mb-16"
        >
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100"
          >
            Built for the way you
            <span class="text-primary-600 dark:text-primary-400"
              >actually manage money</span
            >
          </h2>
          <p
            class="mt-3 sm:mt-4 text-base sm:text-lg text-secondary-500 dark:text-secondary-400 max-w-2xl mx-auto px-4 sm:px-0"
          >
            Not just another spreadsheet. Prospera brings together everything
            you need in one place.
          </p>
        </div>

        <!-- Bento Grid -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 auto-rows-auto"
        >
          <!-- Budget Periods (wide) -->
          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out md:col-span-2 lg:col-span-2 bg-white dark:bg-secondary-800/80 p-5 sm:p-6 lg:p-8 rounded-2xl border border-secondary-100 dark:border-secondary-700/80 hover:shadow-elevated transition-shadow duration-300"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-primary-50 dark:bg-primary-900/30"
            >
              <CalendarDaysIcon
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
            >
              Organize by time, your way
            </h3>
            <p
              class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 leading-relaxed mb-4"
            >
              Create budget periods for any timeframe — monthly, biweekly, or
              custom. See your income and spending side by side.
            </p>
            <div class="flex flex-col sm:flex-row gap-2">
              <div
                class="flex-1 flex items-center justify-between p-3 bg-secondary-50/80 dark:bg-secondary-900/50 rounded-xl"
              >
                <div>
                  <p
                    class="text-xs font-semibold text-secondary-700 dark:text-secondary-300"
                  >
                    March 2026
                  </p>
                  <p class="text-[10px] text-secondary-400">Mar 1 - Mar 31</p>
                </div>
                <div class="text-right">
                  <p
                    class="text-xs font-semibold text-success-600 dark:text-success-400"
                  >
                    +$4,500
                  </p>
                  <p
                    class="text-xs font-semibold text-danger-600 dark:text-danger-400"
                  >
                    -$2,890
                  </p>
                </div>
              </div>
              <div
                class="flex-1 flex items-center justify-between p-3 bg-secondary-50/80 dark:bg-secondary-900/50 rounded-xl"
              >
                <div>
                  <p
                    class="text-xs font-semibold text-secondary-700 dark:text-secondary-300"
                  >
                    February 2026
                  </p>
                  <p class="text-[10px] text-secondary-400">Feb 1 - Feb 28</p>
                </div>
                <div class="text-right">
                  <p
                    class="text-xs font-semibold text-success-600 dark:text-success-400"
                  >
                    +$4,500
                  </p>
                  <p
                    class="text-xs font-semibold text-danger-600 dark:text-danger-400"
                  >
                    -$3,120
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Rich Analytics (tall) -->
          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out md:row-span-2 bg-white dark:bg-secondary-800/80 p-5 sm:p-6 lg:p-8 rounded-2xl border border-secondary-100 dark:border-secondary-700/80 hover:shadow-elevated transition-shadow duration-300"
            style="transition-delay: 100ms"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-success-50 dark:bg-success-900/30"
            >
              <ChartBarIcon
                class="w-6 h-6 text-success-600 dark:text-success-400"
              />
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
            >
              See where every dollar goes
            </h3>
            <p
              class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 leading-relaxed mb-4"
            >
              Interactive charts that actually help you understand your
              spending. Compare periods, spot trends, find opportunities.
            </p>
            <!-- Mini bar chart -->
            <div
              class="p-3 bg-secondary-50/80 dark:bg-secondary-900/50 rounded-xl mb-3"
            >
              <div class="flex items-end gap-2 h-20">
                <div
                  v-for="(pair, i) in [
                    [70, 50],
                    [60, 40],
                    [80, 55],
                    [75, 45],
                  ]"
                  :key="i"
                  class="flex-1 flex items-end gap-0.5"
                >
                  <div
                    class="flex-1 bg-success-400/80 dark:bg-success-500/60 rounded-t-sm"
                    :style="{ height: `${pair[0]}%` }"
                  ></div>
                  <div
                    class="flex-1 bg-danger-400/80 dark:bg-danger-500/60 rounded-t-sm"
                    :style="{ height: `${pair[1]}%` }"
                  ></div>
                </div>
              </div>
            </div>
            <!-- Mini pie chart -->
            <div
              class="flex gap-3 items-center p-3 bg-secondary-50/80 dark:bg-secondary-900/50 rounded-xl"
            >
              <div class="relative w-14 h-14 flex-shrink-0">
                <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke-width="5"
                    class="stroke-danger-400"
                    stroke-dasharray="35 65"
                    stroke-dashoffset="0"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke-width="5"
                    class="stroke-warning-400"
                    stroke-dasharray="25 75"
                    stroke-dashoffset="-35"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke-width="5"
                    class="stroke-primary-400"
                    stroke-dasharray="20 80"
                    stroke-dashoffset="-60"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke-width="5"
                    class="stroke-success-400"
                    stroke-dasharray="20 80"
                    stroke-dashoffset="-80"
                  />
                </svg>
              </div>
              <div class="space-y-1 flex-1">
                <div class="flex items-center gap-1.5">
                  <div class="w-2 h-2 bg-danger-400 rounded-full"></div>
                  <span
                    class="text-[10px] text-secondary-600 dark:text-secondary-400"
                    >Bills 35%</span
                  >
                </div>
                <div class="flex items-center gap-1.5">
                  <div class="w-2 h-2 bg-warning-400 rounded-full"></div>
                  <span
                    class="text-[10px] text-secondary-600 dark:text-secondary-400"
                    >Food 25%</span
                  >
                </div>
                <div class="flex items-center gap-1.5">
                  <div class="w-2 h-2 bg-primary-400 rounded-full"></div>
                  <span
                    class="text-[10px] text-secondary-600 dark:text-secondary-400"
                    >Transport 20%</span
                  >
                </div>
                <div class="flex items-center gap-1.5">
                  <div class="w-2 h-2 bg-success-400 rounded-full"></div>
                  <span
                    class="text-[10px] text-secondary-600 dark:text-secondary-400"
                    >Other 20%</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Financial Goals -->
          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out bg-white dark:bg-secondary-800/80 p-5 sm:p-6 lg:p-8 rounded-2xl border border-secondary-100 dark:border-secondary-700/80 hover:shadow-elevated transition-shadow duration-300"
            style="transition-delay: 200ms"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-accent-50 dark:bg-accent-900/30"
            >
              <FlagIcon
                class="w-6 h-6 text-accent-600 dark:text-accent-400"
              />
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
            >
              Dream it, track it, reach it
            </h3>
            <p
              class="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed mb-4"
            >
              Set savings goals with deadlines and watch your progress grow.
              Every small contribution adds up.
            </p>
            <div
              class="space-y-2.5 p-3 bg-secondary-50/80 dark:bg-secondary-900/50 rounded-xl"
            >
              <div>
                <div class="flex justify-between text-[10px] mb-1">
                  <span
                    class="font-medium text-secondary-700 dark:text-secondary-300"
                    >Emergency Fund</span
                  >
                  <span class="text-secondary-500 dark:text-secondary-400"
                    >$7,200 / $10,000</span
                  >
                </div>
                <div
                  class="h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full w-[72%] bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-[10px] mb-1">
                  <span
                    class="font-medium text-secondary-700 dark:text-secondary-300"
                    >New Car</span
                  >
                  <span class="text-secondary-500 dark:text-secondary-400"
                    >$12,500 / $30,000</span
                  >
                </div>
                <div
                  class="h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden"
                >
                  <div
                    class="h-full w-[42%] bg-gradient-to-r from-accent-400 to-accent-600 rounded-full"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Debt Tracker -->
          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out bg-white dark:bg-secondary-800/80 p-5 sm:p-6 lg:p-8 rounded-2xl border border-secondary-100 dark:border-secondary-700/80 hover:shadow-elevated transition-shadow duration-300"
            style="transition-delay: 300ms"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-danger-50 dark:bg-danger-900/30"
            >
              <CurrencyDollarIcon
                class="w-6 h-6 text-danger-600 dark:text-danger-400"
              />
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
            >
              Stay on top of who owes what
            </h3>
            <p
              class="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed mb-4"
            >
              Track personal debts in both directions. Log payments and watch
              balances settle automatically.
            </p>
            <div class="space-y-2">
              <div
                class="flex items-center justify-between p-2.5 bg-danger-50 dark:bg-danger-900/20 rounded-lg"
              >
                <div>
                  <p
                    class="text-[10px] font-semibold text-secondary-700 dark:text-secondary-300"
                  >
                    Rent to Alex
                  </p>
                  <p class="text-[9px] text-secondary-400">Due Mar 15</p>
                </div>
                <div class="text-right">
                  <p
                    class="text-[10px] font-bold text-danger-600 dark:text-danger-400"
                  >
                    -$500
                  </p>
                  <p class="text-[9px] text-secondary-400">$300 paid</p>
                </div>
              </div>
              <div
                class="flex items-center justify-between p-2.5 bg-success-50 dark:bg-success-900/20 rounded-lg"
              >
                <div>
                  <p
                    class="text-[10px] font-semibold text-secondary-700 dark:text-secondary-300"
                  >
                    Sam owes me
                  </p>
                  <p class="text-[9px] text-success-500">Settled</p>
                </div>
                <div class="text-right">
                  <p
                    class="text-[10px] font-bold text-success-600 dark:text-success-400 line-through"
                  >
                    +$200
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recurring Expenses -->
          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out bg-white dark:bg-secondary-800/80 p-5 sm:p-6 lg:p-8 rounded-2xl border border-secondary-100 dark:border-secondary-700/80 hover:shadow-elevated transition-shadow duration-300"
            style="transition-delay: 100ms"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-primary-50 dark:bg-primary-900/30"
            >
              <ArrowPathIcon
                class="w-6 h-6 text-primary-600 dark:text-primary-400"
              />
            </div>
            <h3
              class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
            >
              Set it once, forget it
            </h3>
            <p
              class="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed mb-4"
            >
              Rent, subscriptions, gym — add them once and they show up
              automatically each period.
            </p>
            <div class="space-y-2">
              <div
                class="flex items-center justify-between p-2.5 bg-secondary-50/80 dark:bg-secondary-900/50 rounded-lg"
              >
                <span
                  class="text-[10px] font-medium text-secondary-700 dark:text-secondary-300"
                  >Rent</span
                >
                <div class="flex items-center gap-2">
                  <span
                    class="text-[9px] px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded font-medium"
                    >Monthly</span
                  >
                  <span
                    class="text-[10px] font-semibold text-secondary-600 dark:text-secondary-400"
                    >$1,200</span
                  >
                </div>
              </div>
              <div
                class="flex items-center justify-between p-2.5 bg-secondary-50/80 dark:bg-secondary-900/50 rounded-lg"
              >
                <span
                  class="text-[10px] font-medium text-secondary-700 dark:text-secondary-300"
                  >Netflix</span
                >
                <div class="flex items-center gap-2">
                  <span
                    class="text-[9px] px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded font-medium"
                    >Monthly</span
                  >
                  <span
                    class="text-[10px] font-semibold text-secondary-600 dark:text-secondary-400"
                    >$15</span
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Secure by Default (wide) -->
          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out md:col-span-2 lg:col-span-2 bg-white dark:bg-secondary-800/80 p-5 sm:p-6 lg:p-8 rounded-2xl border border-secondary-100 dark:border-secondary-700/80 hover:shadow-elevated transition-shadow duration-300"
            style="transition-delay: 200ms"
          >
            <div class="flex flex-col sm:flex-row sm:items-start gap-5">
              <div class="flex-1">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-success-50 dark:bg-success-900/30"
                >
                  <ShieldCheckIcon
                    class="w-6 h-6 text-success-600 dark:text-success-400"
                  />
                </div>
                <h3
                  class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
                >
                  Your finances are personal. We keep them that way.
                </h3>
                <p
                  class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 leading-relaxed"
                >
                  Two-factor authentication, encrypted sessions, automatic
                  token rotation, and HTTP-only cookies. Security you don't
                  have to think about.
                </p>
              </div>
              <div
                class="sm:w-48 p-4 bg-secondary-50/80 dark:bg-secondary-900/50 rounded-xl"
              >
                <p
                  class="text-[10px] font-medium text-secondary-600 dark:text-secondary-400 mb-2 text-center"
                >
                  Enter 2FA Code
                </p>
                <div class="flex justify-center gap-1.5">
                  <div
                    v-for="(digit, i) in ['4', '7', '2', '9', '1', '3']"
                    :key="i"
                    class="w-6 h-8 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 rounded-md flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400"
                  >
                    {{ digit }}
                  </div>
                </div>
                <div class="flex items-center justify-center gap-1.5 mt-2">
                  <ShieldCheckIcon class="w-3 h-3 text-success-500" />
                  <span
                    class="text-[9px] text-success-600 dark:text-success-400 font-medium"
                    >Verified</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== MORE FEATURES ==================== -->
    <section class="py-10 sm:py-14 bg-secondary-50 dark:bg-secondary-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3
          data-animate
          class="opacity-0 translate-y-6 transition-all duration-700 ease-out text-center text-lg sm:text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-8"
        >
          And there's more...
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div
            v-for="(item, index) in extraFeatures"
            :key="item.label"
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-600 transition-colors"
            :style="{ transitionDelay: `${index * 50}ms` }"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0"
            />
            <span
              class="text-xs sm:text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >{{ item.label }}</span
            >
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== HOW IT WORKS ==================== -->
    <section class="py-12 sm:py-16 lg:py-20 bg-white dark:bg-secondary-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-animate
          class="opacity-0 translate-y-6 transition-all duration-700 ease-out text-center mb-10 sm:mb-16"
        >
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100"
          >
            Getting started takes two minutes
          </h2>
          <p
            class="mt-2 sm:mt-3 text-base sm:text-lg text-secondary-500 dark:text-secondary-400"
          >
            Seriously. That's all.
          </p>
        </div>

        <!-- Desktop timeline (horizontal) -->
        <div class="hidden lg:block">
          <div class="relative">
            <!-- Connecting line -->
            <div
              class="absolute top-7 left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-0.5 bg-gradient-to-r from-primary-200 via-primary-300 to-primary-200 dark:from-primary-800 dark:via-primary-600 dark:to-primary-800"
            ></div>

            <div class="grid grid-cols-3 gap-8">
              <div
                data-animate
                class="opacity-0 translate-y-6 transition-all duration-700 ease-out text-center"
              >
                <div
                  class="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-xl shadow-md mx-auto mb-5 relative z-10"
                >
                  1
                </div>
                <UserPlusIcon
                  class="w-6 h-6 text-primary-400 mx-auto mb-3"
                />
                <h3
                  class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
                >
                  Create your account
                </h3>
                <p class="text-sm text-secondary-500 dark:text-secondary-400">
                  Just a name, email, and password. No credit card, no phone
                  number, no strings.
                </p>
              </div>

              <div
                data-animate
                class="opacity-0 translate-y-6 transition-all duration-700 ease-out text-center"
                style="transition-delay: 200ms"
              >
                <div
                  class="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-xl shadow-md mx-auto mb-5 relative z-10"
                >
                  2
                </div>
                <CalendarDaysIcon
                  class="w-6 h-6 text-primary-400 mx-auto mb-3"
                />
                <h3
                  class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
                >
                  Add your first budget
                </h3>
                <p class="text-sm text-secondary-500 dark:text-secondary-400">
                  Pick a date range, add your income, start logging expenses.
                  Templates and recurring items make it fast.
                </p>
              </div>

              <div
                data-animate
                class="opacity-0 translate-y-6 transition-all duration-700 ease-out text-center"
                style="transition-delay: 400ms"
              >
                <div
                  class="w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-xl shadow-md mx-auto mb-5 relative z-10"
                >
                  3
                </div>
                <ChartBarIcon
                  class="w-6 h-6 text-primary-400 mx-auto mb-3"
                />
                <h3
                  class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
                >
                  Watch the picture come together
                </h3>
                <p class="text-sm text-secondary-500 dark:text-secondary-400">
                  Charts, trends, goals, and insights appear as you go. The
                  more you track, the clearer it gets.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile/tablet timeline (vertical) -->
        <div class="lg:hidden">
          <div class="relative pl-12 sm:pl-16 space-y-10">
            <!-- Vertical connecting line -->
            <div
              class="absolute left-[22px] sm:left-[30px] top-7 bottom-7 w-0.5 bg-gradient-to-b from-primary-200 via-primary-300 to-primary-200 dark:from-primary-800 dark:via-primary-600 dark:to-primary-800"
            ></div>

            <div
              data-animate
              class="opacity-0 translate-y-6 transition-all duration-700 ease-out relative"
            >
              <div
                class="absolute -left-12 sm:-left-16 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10"
              >
                1
              </div>
              <h3
                class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1"
              >
                Create your account
              </h3>
              <p
                class="text-sm text-secondary-500 dark:text-secondary-400"
              >
                Just a name, email, and password. No credit card, no phone
                number, no strings.
              </p>
            </div>

            <div
              data-animate
              class="opacity-0 translate-y-6 transition-all duration-700 ease-out relative"
              style="transition-delay: 150ms"
            >
              <div
                class="absolute -left-12 sm:-left-16 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10"
              >
                2
              </div>
              <h3
                class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1"
              >
                Add your first budget
              </h3>
              <p
                class="text-sm text-secondary-500 dark:text-secondary-400"
              >
                Pick a date range, add your income, start logging expenses.
                Templates and recurring items make it fast.
              </p>
            </div>

            <div
              data-animate
              class="opacity-0 translate-y-6 transition-all duration-700 ease-out relative"
              style="transition-delay: 300ms"
            >
              <div
                class="absolute -left-12 sm:-left-16 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-md z-10"
              >
                3
              </div>
              <h3
                class="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1"
              >
                Watch the picture come together
              </h3>
              <p
                class="text-sm text-secondary-500 dark:text-secondary-400"
              >
                Charts, trends, goals, and insights appear as you go. The more
                you track, the clearer it gets.
              </p>
            </div>
          </div>
        </div>

        <div
          v-if="mounted && !authStore.isAuthenticated"
          data-animate
          class="opacity-0 translate-y-6 transition-all duration-700 ease-out text-center mt-10 sm:mt-14 px-4 sm:px-0"
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

    <!-- ==================== WHY PROSPERA ==================== -->
    <section
      class="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-accent-50/40 via-white to-primary-50/40 dark:from-secondary-900 dark:via-secondary-900 dark:to-secondary-900"
    >
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-animate
          class="opacity-0 translate-y-6 transition-all duration-700 ease-out text-center mb-10 sm:mb-12"
        >
          <div
            class="w-14 h-14 rounded-2xl bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center mx-auto mb-4"
          >
            <HeartIcon
              class="w-7 h-7 text-accent-600 dark:text-accent-400"
            />
          </div>
          <h2
            class="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100"
          >
            Built by a real person, for real people
          </h2>
        </div>

        <div class="space-y-6 sm:space-y-8">
          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out pl-6 border-l-4 border-primary-300 dark:border-primary-600"
          >
            <h3
              class="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
            >
              No corporation, no investors
            </h3>
            <p
              class="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 leading-relaxed"
            >
              Prospera is a solo project, built in spare time by a developer
              who wanted a simpler way to track money. No shareholders to
              please, no growth metrics to hit. Just useful software.
            </p>
          </div>

          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out pl-6 border-l-4 border-accent-300 dark:border-accent-600"
            style="transition-delay: 150ms"
          >
            <h3
              class="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
            >
              No tricks, no fine print
            </h3>
            <p
              class="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 leading-relaxed"
            >
              Free means free. No "freemium" upgrade nags. No ads. No selling
              your data. The app you see today is the complete app — every
              feature, for everyone.
            </p>
          </div>

          <div
            data-animate
            class="opacity-0 translate-y-6 transition-all duration-700 ease-out pl-6 border-l-4 border-success-300 dark:border-success-600"
            style="transition-delay: 300ms"
          >
            <h3
              class="text-base sm:text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2"
            >
              Always improving
            </h3>
            <p
              class="text-sm sm:text-base text-secondary-600 dark:text-secondary-400 leading-relaxed"
            >
              New features are added regularly based on real feedback from real
              users. Have an idea? The
              <NuxtLink
                to="/feedback"
                class="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                >feedback page</NuxtLink
              >
              goes straight to the developer's inbox.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ==================== FINAL CTA ==================== -->
    <section
      class="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden"
    >
      <div
        class="hidden sm:block absolute top-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"
      ></div>
      <div
        class="hidden sm:block absolute bottom-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-accent-400/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"
      ></div>

      <div
        data-animate
        class="opacity-0 translate-y-6 transition-all duration-700 ease-out relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div
          class="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 rounded-full mb-4 sm:mb-6"
        >
          <SparklesIcon class="w-4 h-4 sm:w-5 sm:h-5 text-accent-300" />
          <span class="text-xs sm:text-sm font-semibold text-white"
            >It's free, always</span
          >
        </div>

        <h2
          class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6"
        >
          Ready to start your money story?
        </h2>
        <p
          class="text-base sm:text-lg lg:text-xl text-primary-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-2 sm:px-0"
        >
          No commitment. No credit card. Just a better way to understand your
          finances.
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
                Create your free account
                <ArrowRightIcon
                  class="w-5 h-5 group-hover:translate-x-1 transition-transform"
                />
              </button>
            </NuxtLink>
          </template>
        </div>

        <p class="mt-4 sm:mt-6 text-primary-200 text-xs sm:text-sm">
          Takes less than a minute to sign up
        </p>
      </div>
    </section>

    <!-- ==================== FOOTER ==================== -->
    <footer
      class="py-8 sm:py-12 bg-secondary-50 dark:bg-secondary-950 border-t border-secondary-100 dark:border-secondary-800"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-6"
        >
          <div class="flex items-center gap-3">
            <img src="/prospera-icon.png" alt="Prospera" class="w-8 h-8" />
            <span
              class="font-semibold text-secondary-700 dark:text-secondary-300"
              >Prospera</span
            >
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
          <p
            class="text-sm text-secondary-400 dark:text-secondary-500 flex items-center gap-1"
          >
            Made with
            <HeartIcon class="w-4 h-4 text-danger-500" /> for everyone
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.animate-in {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
</style>
