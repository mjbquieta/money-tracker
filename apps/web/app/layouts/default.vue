<script setup lang="ts">
import {
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";

const authStore = useAuthStore();
const mounted = ref(false);
const mobileMenuOpen = ref(false);
const accountMenuOpen = ref(false);

// Close menus on route change
const route = useRoute();
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
    accountMenuOpen.value = false;
  },
);

// Close account menu when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest(".account-menu-container")) {
    accountMenuOpen.value = false;
  }
}

onMounted(() => {
  // Ensure auth state is hydrated from localStorage before showing nav
  authStore.hydrateFromStorage();
  mounted.value = true;
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="min-h-screen bg-secondary-50 flex flex-col">
    <header class="bg-white border-b border-secondary-200 sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-14 sm:h-16 items-center">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2 group flex-shrink-0">
            <img
              src="/prospera-icon.png"
              alt="Prospera"
              class="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform"
            />
            <span
              class="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent hidden xs:inline"
            >
              Prospera
            </span>
          </NuxtLink>

          <!-- Desktop Navigation -->
          <div v-if="mounted" class="hidden md:flex items-center gap-2">
            <template v-if="authStore.isAuthenticated">
              <NuxtLink
                to="/dashboard"
                class="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                active-class="!text-primary-700 !bg-primary-100 font-medium"
              >
                <HomeIcon class="w-5 h-5" />
                <span>Dashboard</span>
              </NuxtLink>
              <NuxtLink
                to="/metrics"
                class="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                active-class="!text-primary-700 !bg-primary-100 font-medium"
              >
                <ChartBarIcon class="w-5 h-5" />
                <span>Metrics</span>
              </NuxtLink>
              <div class="w-px h-8 bg-secondary-200 mx-2" />

              <!-- Account Dropdown -->
              <div class="relative account-menu-container">
                <button
                  class="flex items-center gap-2 px-3 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  @click.stop="accountMenuOpen = !accountMenuOpen"
                >
                  <UserCircleIcon class="w-5 h-5" />
                  <span class="text-sm font-medium">{{
                    authStore.user?.name
                  }}</span>
                  <ChevronDownIcon
                    class="w-4 h-4 transition-transform"
                    :class="{ 'rotate-180': accountMenuOpen }"
                  />
                </button>

                <!-- Dropdown Menu -->
                <Transition
                  enter-active-class="transition duration-150 ease-out"
                  enter-from-class="opacity-0 scale-95"
                  enter-to-class="opacity-100 scale-100"
                  leave-active-class="transition duration-100 ease-in"
                  leave-from-class="opacity-100 scale-100"
                  leave-to-class="opacity-0 scale-95"
                >
                  <div
                    v-if="accountMenuOpen"
                    class="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-elevated border border-secondary-100 py-2 z-50"
                  >
                    <!-- User Info -->
                    <div class="px-4 py-3 border-b border-secondary-100">
                      <p class="font-medium text-secondary-900">
                        {{ authStore.user?.name }}
                      </p>
                      <p class="text-sm text-secondary-500">
                        {{ authStore.user?.email }}
                      </p>
                    </div>

                    <!-- Menu Items -->
                    <div class="py-1">
                      <NuxtLink
                        to="/settings"
                        class="flex items-center gap-3 px-4 py-2.5 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        <Cog6ToothIcon class="w-5 h-5" />
                        <span>Settings</span>
                      </NuxtLink>
                    </div>

                    <!-- Logout -->
                    <div class="border-t border-secondary-100 pt-1">
                      <button
                        class="flex items-center gap-3 w-full px-4 py-2.5 text-danger-600 hover:bg-danger-50 transition-colors"
                        @click="authStore.logout"
                      >
                        <ArrowRightOnRectangleIcon class="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </template>

            <template v-else>
              <NuxtLink to="/auth/login">
                <button
                  class="flex items-center gap-2 px-4 py-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors font-medium"
                >
                  Login
                </button>
              </NuxtLink>
              <NuxtLink to="/auth/register">
                <button
                  class="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
                >
                  Get Started
                </button>
              </NuxtLink>
            </template>
          </div>

          <!-- Mobile Menu Button -->
          <div v-if="mounted" class="flex md:hidden items-center gap-2">
            <template v-if="!authStore.isAuthenticated">
              <NuxtLink to="/auth/login">
                <button
                  class="px-3 py-1.5 text-sm text-secondary-600 hover:text-primary-600 font-medium"
                >
                  Login
                </button>
              </NuxtLink>
              <NuxtLink to="/auth/register">
                <button
                  class="px-3 py-1.5 text-sm bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium"
                >
                  Sign Up
                </button>
              </NuxtLink>
            </template>
            <template v-else>
              <button
                class="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                @click="mobileMenuOpen = !mobileMenuOpen"
              >
                <Bars3Icon v-if="!mobileMenuOpen" class="w-6 h-6" />
                <XMarkIcon v-else class="w-6 h-6" />
              </button>
            </template>
          </div>
        </div>
      </nav>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="mobileMenuOpen && authStore.isAuthenticated"
          class="md:hidden bg-white border-b border-secondary-200 shadow-lg"
        >
          <div class="px-4 py-3 space-y-1">
            <!-- User Info -->
            <div
              class="flex items-center gap-3 px-3 py-3 mb-2 bg-secondary-50 rounded-xl"
            >
              <UserCircleIcon class="w-10 h-10 text-secondary-400" />
              <div>
                <p class="font-medium text-secondary-900">
                  {{ authStore.user?.name }}
                </p>
                <p class="text-sm text-secondary-500">
                  {{ authStore.user?.email }}
                </p>
              </div>
            </div>

            <!-- Navigation Links -->
            <NuxtLink
              to="/dashboard"
              class="flex items-center gap-3 px-3 py-3 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
              active-class="!text-primary-700 !bg-primary-100 font-medium"
            >
              <HomeIcon class="w-5 h-5" />
              <span>Dashboard</span>
            </NuxtLink>
            <NuxtLink
              to="/metrics"
              class="flex items-center gap-3 px-3 py-3 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
              active-class="!text-primary-700 !bg-primary-100 font-medium"
            >
              <ChartBarIcon class="w-5 h-5" />
              <span>Metrics</span>
            </NuxtLink>
            <NuxtLink
              to="/settings"
              class="flex items-center gap-3 px-3 py-3 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
              active-class="!text-primary-700 !bg-primary-100 font-medium"
            >
              <Cog6ToothIcon class="w-5 h-5" />
              <span>Settings</span>
            </NuxtLink>

            <div class="border-t border-secondary-100 my-2" />

            <!-- Logout Button -->
            <button
              class="flex items-center gap-3 w-full px-3 py-3 text-danger-600 hover:bg-danger-50 rounded-xl transition-colors"
              @click="authStore.logout"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </Transition>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="bg-white border-t border-secondary-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div
          class="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4"
        >
          <div class="flex items-center gap-2 text-secondary-500">
            <img
              src="/prospera-icon.png"
              alt="Prospera"
              class="w-4 h-4 sm:w-5 sm:h-5"
            />
            <span class="text-xs sm:text-sm">Prospera</span>
          </div>
          <p class="text-xs sm:text-sm text-secondary-400">
            Build a healthier relationship with money.
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>
