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
} from "@heroicons/vue/24/outline";

definePageMeta({
  layout: false,
});

const authStore = useAuthStore();
const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
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

    <!-- Hero Section -->
    <section class="relative overflow-hidden pt-16 sm:pt-20">
      <div class="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50/30 dark:from-secondary-950 dark:via-secondary-900 dark:to-primary-950/30"></div>
      <div class="hidden sm:block absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary-100 dark:bg-primary-900/30 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/2"></div>
      <div class="hidden sm:block absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-accent-100 dark:bg-accent-900/30 rounded-full blur-3xl opacity-30 translate-y-1/2 -translate-x-1/2"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
        <div class="text-center max-w-4xl mx-auto">
          <img src="/prospera-logo.png" alt="Prospera" class="h-20 sm:h-28 md:h-36 lg:h-44 mx-auto mb-6 sm:mb-8" />

          <div class="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-success-50 dark:bg-success-900/30 border border-success-200 dark:border-success-700 rounded-full mb-6 sm:mb-8">
            <SparklesIcon class="w-4 h-4 sm:w-5 sm:h-5 text-success-600 dark:text-success-400" />
            <span class="text-xs sm:text-sm font-semibold text-success-700 dark:text-success-300">100% Free Forever</span>
          </div>

          <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-secondary-900 dark:text-secondary-100 leading-tight">
            Your Complete
            <span class="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">Personal Finance</span>
            Toolkit
          </h2>

          <p class="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-secondary-600 dark:text-secondary-400 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            Budget periods, expense tracking, financial goals, debt management, and rich analytics
            — everything you need to take control of your money.
            <span class="font-semibold text-primary-600 dark:text-primary-400">Free forever. No strings attached.</span>
          </p>

          <div v-if="mounted" class="mt-8 sm:mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <template v-if="authStore.isAuthenticated">
              <NuxtLink to="/dashboard">
                <button class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl transition-all shadow-elevated hover:shadow-lg font-semibold text-base sm:text-lg">
                  <HomeIcon class="w-5 h-5 sm:w-6 sm:h-6" />
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
                <button class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-secondary-700 dark:text-secondary-300 hover:text-primary-700 dark:hover:text-primary-400 bg-white dark:bg-secondary-800 hover:bg-primary-50 dark:hover:bg-primary-900/50 border-2 border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 rounded-xl transition-all font-semibold text-base sm:text-lg">
                  Sign In
                </button>
              </NuxtLink>
            </template>
          </div>

          <div class="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 px-4 sm:px-0">
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

    <!-- Dashboard Preview Mockup -->
    <section class="py-8 sm:py-12 bg-white dark:bg-secondary-900 -mt-8 sm:-mt-12">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-secondary-50 dark:bg-secondary-800 rounded-2xl border border-secondary-200 dark:border-secondary-700 shadow-elevated overflow-hidden">
          <!-- Browser chrome -->
          <div class="flex items-center gap-2 px-4 py-3 bg-secondary-100 dark:bg-secondary-700 border-b border-secondary-200 dark:border-secondary-600">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-danger-400"></div>
              <div class="w-3 h-3 rounded-full bg-warning-400"></div>
              <div class="w-3 h-3 rounded-full bg-success-400"></div>
            </div>
            <div class="flex-1 mx-4">
              <div class="bg-white dark:bg-secondary-800 rounded-md px-3 py-1 text-xs text-secondary-400 dark:text-secondary-500 max-w-xs mx-auto text-center">
                prospera.app/dashboard
              </div>
            </div>
          </div>

          <!-- Dashboard content -->
          <div class="p-4 sm:p-6 space-y-4">
            <!-- Metric cards row -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <!-- Income -->
              <div class="bg-white dark:bg-secondary-900 rounded-xl p-3 sm:p-4 border border-secondary-100 dark:border-secondary-700">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-7 h-7 bg-success-50 dark:bg-success-900/30 rounded-md flex items-center justify-center">
                    <ArrowTrendingUpIcon class="w-4 h-4 text-success-500" />
                  </div>
                  <span class="text-[10px] sm:text-xs text-secondary-500 dark:text-secondary-400">Total Income</span>
                </div>
                <p class="text-sm sm:text-lg font-bold text-success-600 dark:text-success-400">$12,450</p>
              </div>
              <!-- Expenses -->
              <div class="bg-white dark:bg-secondary-900 rounded-xl p-3 sm:p-4 border border-secondary-100 dark:border-secondary-700">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-7 h-7 bg-danger-50 dark:bg-danger-900/30 rounded-md flex items-center justify-center">
                    <svg class="w-4 h-4 text-danger-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" /></svg>
                  </div>
                  <span class="text-[10px] sm:text-xs text-secondary-500 dark:text-secondary-400">Expenses</span>
                </div>
                <p class="text-sm sm:text-lg font-bold text-danger-600 dark:text-danger-400">$8,230</p>
              </div>
              <!-- Savings -->
              <div class="bg-white dark:bg-secondary-900 rounded-xl p-3 sm:p-4 border border-secondary-100 dark:border-secondary-700">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-7 h-7 bg-primary-50 dark:bg-primary-900/30 rounded-md flex items-center justify-center">
                    <svg class="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>
                  </div>
                  <span class="text-[10px] sm:text-xs text-secondary-500 dark:text-secondary-400">Net Savings</span>
                </div>
                <p class="text-sm sm:text-lg font-bold text-primary-600 dark:text-primary-400">$4,220</p>
              </div>
              <!-- Savings Rate -->
              <div class="bg-white dark:bg-secondary-900 rounded-xl p-3 sm:p-4 border border-secondary-100 dark:border-secondary-700">
                <div class="flex items-center gap-2 mb-2">
                  <div class="w-7 h-7 bg-success-50 dark:bg-success-900/30 rounded-md flex items-center justify-center">
                    <SparklesIcon class="w-4 h-4 text-success-500" />
                  </div>
                  <span class="text-[10px] sm:text-xs text-secondary-500 dark:text-secondary-400">Savings Rate</span>
                </div>
                <p class="text-sm sm:text-lg font-bold text-success-600 dark:text-success-400">33.9%</p>
                <div class="mt-1.5 h-1.5 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
                  <div class="h-full w-[34%] bg-success-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <!-- Chart + sidebar row -->
            <div class="grid lg:grid-cols-3 gap-3">
              <!-- Bar chart mockup -->
              <div class="lg:col-span-2 bg-white dark:bg-secondary-900 rounded-xl p-4 border border-secondary-100 dark:border-secondary-700">
                <div class="flex items-center gap-2 mb-3">
                  <ChartBarIcon class="w-4 h-4 text-primary-500" />
                  <span class="text-xs font-semibold text-secondary-700 dark:text-secondary-300">Monthly Income vs Expenses</span>
                </div>
                <!-- Bars -->
                <div class="flex items-end gap-2 sm:gap-3 h-28 sm:h-36">
                  <div v-for="(pair, i) in [[65, 45], [70, 55], [60, 40], [75, 50], [80, 60], [72, 48]]" :key="i" class="flex-1 flex items-end gap-0.5 sm:gap-1">
                    <div class="flex-1 bg-success-400/80 dark:bg-success-500/60 rounded-t-sm transition-all" :style="{ height: `${pair[0]}%` }"></div>
                    <div class="flex-1 bg-danger-400/80 dark:bg-danger-500/60 rounded-t-sm transition-all" :style="{ height: `${pair[1]}%` }"></div>
                  </div>
                </div>
                <div class="flex justify-between mt-2">
                  <span v-for="m in ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']" :key="m" class="text-[9px] sm:text-[10px] text-secondary-400 dark:text-secondary-500">{{ m }}</span>
                </div>
                <div class="flex items-center gap-3 mt-2 sm:mt-3">
                  <div class="flex items-center gap-1"><div class="w-2.5 h-2.5 bg-success-400 rounded-sm"></div><span class="text-[10px] text-secondary-500 dark:text-secondary-400">Income</span></div>
                  <div class="flex items-center gap-1"><div class="w-2.5 h-2.5 bg-danger-400 rounded-sm"></div><span class="text-[10px] text-secondary-500 dark:text-secondary-400">Expenses</span></div>
                </div>
              </div>

              <!-- Goals + Debts sidebar -->
              <div class="space-y-3">
                <!-- Goals card -->
                <div class="bg-white dark:bg-secondary-900 rounded-xl p-4 border border-secondary-100 dark:border-secondary-700">
                  <div class="flex items-center gap-2 mb-3">
                    <FlagIcon class="w-4 h-4 text-primary-500" />
                    <span class="text-xs font-semibold text-secondary-700 dark:text-secondary-300">Financial Goals</span>
                  </div>
                  <div class="space-y-2.5">
                    <div>
                      <div class="flex justify-between text-[10px] mb-1">
                        <span class="text-secondary-600 dark:text-secondary-400">Emergency Fund</span>
                        <span class="font-semibold text-primary-600 dark:text-primary-400">72%</span>
                      </div>
                      <div class="h-1.5 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
                        <div class="h-full w-[72%] bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between text-[10px] mb-1">
                        <span class="text-secondary-600 dark:text-secondary-400">New Laptop</span>
                        <span class="font-semibold text-accent-600 dark:text-accent-400">45%</span>
                      </div>
                      <div class="h-1.5 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
                        <div class="h-full w-[45%] bg-gradient-to-r from-accent-400 to-accent-600 rounded-full"></div>
                      </div>
                    </div>
                    <div>
                      <div class="flex justify-between text-[10px] mb-1">
                        <span class="text-secondary-600 dark:text-secondary-400">Vacation</span>
                        <span class="font-semibold text-success-600 dark:text-success-400">100%</span>
                      </div>
                      <div class="h-1.5 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
                        <div class="h-full w-full bg-gradient-to-r from-success-400 to-success-600 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Debt card -->
                <div class="bg-white dark:bg-secondary-900 rounded-xl p-4 border border-secondary-100 dark:border-secondary-700">
                  <div class="flex items-center gap-2 mb-3">
                    <CurrencyDollarIcon class="w-4 h-4 text-primary-500" />
                    <span class="text-xs font-semibold text-secondary-700 dark:text-secondary-300">Debt Tracker</span>
                  </div>
                  <div class="grid grid-cols-2 gap-2">
                    <div class="p-2 bg-danger-50 dark:bg-danger-900/20 rounded-lg text-center">
                      <p class="text-[10px] text-secondary-500 dark:text-secondary-400">I Owe</p>
                      <p class="text-xs font-bold text-danger-600 dark:text-danger-400">$1,200</p>
                    </div>
                    <div class="p-2 bg-success-50 dark:bg-success-900/20 rounded-lg text-center">
                      <p class="text-[10px] text-secondary-500 dark:text-secondary-400">Owed to Me</p>
                      <p class="text-xs font-bold text-success-600 dark:text-success-400">$850</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Features Section -->
    <section class="py-12 sm:py-16 lg:py-20 bg-white dark:bg-secondary-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100">
            Everything You Need to
            <span class="text-primary-600 dark:text-primary-400">Manage Your Money</span>
          </h2>
          <p class="mt-3 sm:mt-4 text-base sm:text-lg text-secondary-500 dark:text-secondary-400 max-w-2xl mx-auto px-4 sm:px-0">
            Powerful features that work together to give you complete control over your personal finances.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <!-- Budget Periods -->
          <div class="bg-white dark:bg-secondary-800 p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-secondary-100 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-600 hover:shadow-card-hover transition-all group">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform bg-primary-50 dark:bg-primary-900/30">
              <CalendarDaysIcon class="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">Budget Periods</h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 leading-relaxed mb-4">
              Organize your finances by month or any custom time range. Track income and expenses together in one place.
            </p>
            <!-- Mockup: period cards -->
            <div class="space-y-2">
              <div class="flex items-center justify-between p-2.5 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
                <div>
                  <p class="text-[10px] font-semibold text-secondary-700 dark:text-secondary-300">March 2026</p>
                  <p class="text-[9px] text-secondary-400">Mar 1 - Mar 31</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-semibold text-success-600 dark:text-success-400">+$4,500</p>
                  <p class="text-[10px] font-semibold text-danger-600 dark:text-danger-400">-$2,890</p>
                </div>
              </div>
              <div class="flex items-center justify-between p-2.5 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
                <div>
                  <p class="text-[10px] font-semibold text-secondary-700 dark:text-secondary-300">February 2026</p>
                  <p class="text-[9px] text-secondary-400">Feb 1 - Feb 28</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-semibold text-success-600 dark:text-success-400">+$4,500</p>
                  <p class="text-[10px] font-semibold text-danger-600 dark:text-danger-400">-$3,120</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Rich Analytics -->
          <div class="bg-white dark:bg-secondary-800 p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-secondary-100 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-600 hover:shadow-card-hover transition-all group">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform bg-success-50 dark:bg-success-900/30">
              <ChartBarIcon class="w-6 h-6 sm:w-7 sm:h-7 text-success-600 dark:text-success-400" />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">Rich Analytics</h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 leading-relaxed mb-4">
              Interactive charts for spending trends, category breakdowns, savings rate, and period-over-period comparisons.
            </p>
            <!-- Mockup: pie chart + breakdown -->
            <div class="flex gap-3 items-center p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
              <!-- Mini pie -->
              <div class="relative w-16 h-16 flex-shrink-0">
                <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
                  <circle cx="18" cy="18" r="14" fill="none" stroke-width="5" class="stroke-danger-400" stroke-dasharray="35 65" stroke-dashoffset="0" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke-width="5" class="stroke-warning-400" stroke-dasharray="25 75" stroke-dashoffset="-35" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke-width="5" class="stroke-primary-400" stroke-dasharray="20 80" stroke-dashoffset="-60" />
                  <circle cx="18" cy="18" r="14" fill="none" stroke-width="5" class="stroke-success-400" stroke-dasharray="20 80" stroke-dashoffset="-80" />
                </svg>
              </div>
              <div class="space-y-1 flex-1">
                <div class="flex items-center gap-1.5"><div class="w-2 h-2 bg-danger-400 rounded-full"></div><span class="text-[10px] text-secondary-600 dark:text-secondary-400">Bills 35%</span></div>
                <div class="flex items-center gap-1.5"><div class="w-2 h-2 bg-warning-400 rounded-full"></div><span class="text-[10px] text-secondary-600 dark:text-secondary-400">Food 25%</span></div>
                <div class="flex items-center gap-1.5"><div class="w-2 h-2 bg-primary-400 rounded-full"></div><span class="text-[10px] text-secondary-600 dark:text-secondary-400">Transport 20%</span></div>
                <div class="flex items-center gap-1.5"><div class="w-2 h-2 bg-success-400 rounded-full"></div><span class="text-[10px] text-secondary-600 dark:text-secondary-400">Other 20%</span></div>
              </div>
            </div>
          </div>

          <!-- Financial Goals -->
          <div class="bg-white dark:bg-secondary-800 p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-secondary-100 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-600 hover:shadow-card-hover transition-all group">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform bg-accent-50 dark:bg-accent-900/30">
              <FlagIcon class="w-6 h-6 sm:w-7 sm:h-7 text-accent-600 dark:text-accent-400" />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">Financial Goals</h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 leading-relaxed mb-4">
              Set savings targets with deadlines, track contributions, and watch your progress grow over time.
            </p>
            <!-- Mockup: goal progress -->
            <div class="space-y-2.5 p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
              <div>
                <div class="flex justify-between text-[10px] mb-1">
                  <span class="font-medium text-secondary-700 dark:text-secondary-300">Emergency Fund</span>
                  <span class="text-secondary-500 dark:text-secondary-400">$7,200 / $10,000</span>
                </div>
                <div class="h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                  <div class="h-full w-[72%] bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-[10px] mb-1">
                  <span class="font-medium text-secondary-700 dark:text-secondary-300">New Car</span>
                  <span class="text-secondary-500 dark:text-secondary-400">$12,500 / $30,000</span>
                </div>
                <div class="h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                  <div class="h-full w-[42%] bg-gradient-to-r from-accent-400 to-accent-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Debt Tracker -->
          <div class="bg-white dark:bg-secondary-800 p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-secondary-100 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-600 hover:shadow-card-hover transition-all group">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform bg-danger-50 dark:bg-danger-900/30">
              <CurrencyDollarIcon class="w-6 h-6 sm:w-7 sm:h-7 text-danger-600 dark:text-danger-400" />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">Debt Tracker</h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 leading-relaxed mb-4">
              Track what you owe and what's owed to you. Log payments, see your net position, and stay on top of due dates.
            </p>
            <!-- Mockup: debt items -->
            <div class="space-y-2">
              <div class="flex items-center justify-between p-2.5 bg-danger-50 dark:bg-danger-900/20 rounded-lg">
                <div>
                  <p class="text-[10px] font-semibold text-secondary-700 dark:text-secondary-300">Rent to Alex</p>
                  <p class="text-[9px] text-secondary-400">Due Mar 15</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-bold text-danger-600 dark:text-danger-400">-$500</p>
                  <p class="text-[9px] text-secondary-400">$300 paid</p>
                </div>
              </div>
              <div class="flex items-center justify-between p-2.5 bg-success-50 dark:bg-success-900/20 rounded-lg">
                <div>
                  <p class="text-[10px] font-semibold text-secondary-700 dark:text-secondary-300">Sam owes me</p>
                  <p class="text-[9px] text-success-500">Settled</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-bold text-success-600 dark:text-success-400 line-through">+$200</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recurring Expenses -->
          <div class="bg-white dark:bg-secondary-800 p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-secondary-100 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-600 hover:shadow-card-hover transition-all group">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform bg-primary-50 dark:bg-primary-900/30">
              <ArrowPathIcon class="w-6 h-6 sm:w-7 sm:h-7 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">Recurring Expenses</h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 leading-relaxed mb-4">
              Set up recurring costs once and auto-generate them each period. Save time on rent, subscriptions, and bills.
            </p>
            <!-- Mockup: recurring list -->
            <div class="space-y-2">
              <div class="flex items-center justify-between p-2.5 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
                <span class="text-[10px] font-medium text-secondary-700 dark:text-secondary-300">Rent</span>
                <div class="flex items-center gap-2">
                  <span class="text-[9px] px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded font-medium">Monthly</span>
                  <span class="text-[10px] font-semibold text-secondary-600 dark:text-secondary-400">$1,200</span>
                </div>
              </div>
              <div class="flex items-center justify-between p-2.5 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
                <span class="text-[10px] font-medium text-secondary-700 dark:text-secondary-300">Netflix</span>
                <div class="flex items-center gap-2">
                  <span class="text-[9px] px-1.5 py-0.5 bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded font-medium">Monthly</span>
                  <span class="text-[10px] font-semibold text-secondary-600 dark:text-secondary-400">$15</span>
                </div>
              </div>
              <div class="flex items-center justify-between p-2.5 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
                <span class="text-[10px] font-medium text-secondary-700 dark:text-secondary-300">Gym</span>
                <div class="flex items-center gap-2">
                  <span class="text-[9px] px-1.5 py-0.5 bg-accent-100 dark:bg-accent-900/40 text-accent-700 dark:text-accent-300 rounded font-medium">Yearly</span>
                  <span class="text-[10px] font-semibold text-secondary-600 dark:text-secondary-400">$480</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Secure by Default -->
          <div class="bg-white dark:bg-secondary-800 p-5 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl border border-secondary-100 dark:border-secondary-700 hover:border-primary-200 dark:hover:border-primary-600 hover:shadow-card-hover transition-all group">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 group-hover:scale-110 transition-transform bg-success-50 dark:bg-success-900/30">
              <ShieldCheckIcon class="w-6 h-6 sm:w-7 sm:h-7 text-success-600 dark:text-success-400" />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">Secure by Default</h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 leading-relaxed mb-4">
              Two-factor authentication, encrypted sessions, and automatic token refresh keep your data safe.
            </p>
            <!-- Mockup: 2FA input -->
            <div class="p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg">
              <p class="text-[10px] font-medium text-secondary-600 dark:text-secondary-400 mb-2 text-center">Enter 2FA Code</p>
              <div class="flex justify-center gap-1.5">
                <div v-for="(digit, i) in ['4', '7', '2', '9', '1', '3']" :key="i"
                  class="w-7 h-9 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-600 rounded-md flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-400"
                >
                  {{ digit }}
                </div>
              </div>
              <div class="flex items-center justify-center gap-1.5 mt-2">
                <ShieldCheckIcon class="w-3 h-3 text-success-500" />
                <span class="text-[9px] text-success-600 dark:text-success-400 font-medium">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- More Features Strip -->
    <section class="py-10 sm:py-14 bg-secondary-50 dark:bg-secondary-950">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 class="text-center text-lg sm:text-xl font-semibold text-secondary-800 dark:text-secondary-200 mb-8">
          And so much more...
        </h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div
            v-for="item in extraFeatures"
            :key="item.label"
            class="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 bg-white dark:bg-secondary-800 rounded-xl border border-secondary-100 dark:border-secondary-700"
          >
            <component :is="item.icon" class="w-5 h-5 text-primary-500 dark:text-primary-400 flex-shrink-0" />
            <span class="text-xs sm:text-sm font-medium text-secondary-700 dark:text-secondary-300">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
      <div class="hidden sm:block absolute top-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
      <div class="hidden sm:block absolute bottom-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-accent-400/20 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>

      <div class="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 rounded-full mb-4 sm:mb-6">
          <SparklesIcon class="w-4 h-4 sm:w-5 sm:h-5 text-accent-300" />
          <span class="text-xs sm:text-sm font-semibold text-white">Completely Free</span>
        </div>

        <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
          Start Your Journey to Financial Clarity
        </h2>
        <p class="text-base sm:text-lg lg:text-xl text-primary-100 mb-8 sm:mb-10 max-w-2xl mx-auto px-2 sm:px-0">
          Join people who are taking control of their money with budgeting, goal tracking, debt management, and powerful insights.
        </p>

        <div v-if="mounted" class="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
          <template v-if="authStore.isAuthenticated">
            <NuxtLink to="/dashboard">
              <button class="flex items-center justify-center gap-2 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-primary-700 hover:bg-primary-50 rounded-xl transition-all shadow-lg font-semibold text-base sm:text-lg">
                <HomeIcon class="w-5 h-5 sm:w-6 sm:h-6" />
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

    <!-- How It Works -->
    <section class="py-12 sm:py-16 lg:py-20 bg-white dark:bg-secondary-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10 sm:mb-16">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-secondary-100">How It Works</h2>
          <p class="mt-3 sm:mt-4 text-base sm:text-lg text-secondary-500 dark:text-secondary-400">Get started in just three simple steps</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 lg:gap-8">
          <div class="text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900/50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <span class="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">1</span>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">Sign Up Free</h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 px-4 sm:px-0">
              Create your account in seconds. No credit card, no commitments. Enable 2FA for extra security.
            </p>
          </div>

          <div class="text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900/50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <span class="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">2</span>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">Track Everything</h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 px-4 sm:px-0">
              Create budget periods, log income and expenses, set up recurring costs, and track debts and goals.
            </p>
          </div>

          <div class="text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 bg-primary-100 dark:bg-primary-900/50 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
              <span class="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400">3</span>
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2 sm:mb-3">Gain Insights</h3>
            <p class="text-sm sm:text-base text-secondary-500 dark:text-secondary-400 px-4 sm:px-0">
              View interactive charts, compare periods, monitor spending limits, and watch your savings grow.
            </p>
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

    <!-- Footer -->
    <footer class="py-8 sm:py-12 bg-secondary-50 dark:bg-secondary-950 border-t border-secondary-100 dark:border-secondary-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div class="flex items-center gap-3">
            <img src="/prospera-icon.png" alt="Prospera" class="w-8 h-8" />
            <span class="font-semibold text-secondary-700 dark:text-secondary-300">Prospera</span>
          </div>
          <div class="flex items-center gap-6 sm:gap-8">
            <NuxtLink to="/feedback" class="text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
              Request Improvements
            </NuxtLink>
            <NuxtLink to="/about" class="text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
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
