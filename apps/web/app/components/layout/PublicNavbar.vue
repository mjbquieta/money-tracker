<script setup lang="ts">
import {
  LightBulbIcon,
  HeartIcon,
  HomeIcon,
} from '@heroicons/vue/24/outline';

const props = defineProps<{
  transparent?: boolean;
}>();

const authStore = useAuthStore();
const mounted = ref(false);

onMounted(() => {
  authStore.hydrateFromStorage();
  mounted.value = true;
});
</script>

<template>
  <nav
    class="w-full z-50"
    :class="transparent ? 'absolute top-0 left-0 right-0' : 'bg-white dark:bg-secondary-900 border-b border-secondary-200 dark:border-secondary-700'"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 sm:h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <img
            src="/prospera-icon.png"
            alt="Prospera"
            class="w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-105 transition-transform"
          />
          <span class="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent hidden xs:inline">
            Prospera
          </span>
        </NuxtLink>

        <!-- Right side links -->
        <div v-if="mounted" class="flex items-center gap-2 sm:gap-4">
          <NuxtLink
            to="/feedback"
            class="flex items-center gap-1.5 px-3 py-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/50 rounded-lg transition-colors text-sm font-medium"
          >
            <LightBulbIcon class="w-4 h-4" />
            <span class="hidden sm:inline">Feedback</span>
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="flex items-center gap-1.5 px-3 py-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/50 rounded-lg transition-colors text-sm font-medium"
          >
            <HeartIcon class="w-4 h-4" />
            <span class="hidden sm:inline">About</span>
          </NuxtLink>
          <UiThemeToggle size="sm" />
          <div class="w-px h-6 bg-secondary-200 dark:bg-secondary-700 mx-1 hidden sm:block" />
          <template v-if="authStore.isAuthenticated">
            <NuxtLink
              to="/dashboard"
              class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium text-sm"
            >
              <HomeIcon class="w-4 h-4" />
              <span class="hidden sm:inline">Dashboard</span>
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/auth/login"
              class="px-3 sm:px-4 py-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium text-sm"
            >
              Sign In
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="px-3 sm:px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all font-medium text-sm"
            >
              Get Started
            </NuxtLink>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
