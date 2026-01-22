<script setup lang="ts">
import { SunIcon, MoonIcon } from '@heroicons/vue/24/outline';

interface Props {
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

withDefaults(defineProps<Props>(), {
  showLabel: false,
  size: 'md',
});

const { isDark, isHydrated, toggleTheme } = useTheme();

const sizeClasses = {
  sm: {
    button: 'p-1.5',
    icon: 'w-4 h-4',
  },
  md: {
    button: 'p-2',
    icon: 'w-5 h-5',
  },
};
</script>

<template>
  <button
    v-if="isHydrated"
    type="button"
    :class="[
      'text-secondary-600 hover:text-primary-600 hover:bg-primary-50 dark:text-secondary-400 dark:hover:text-primary-400 dark:hover:bg-primary-900/50 rounded-lg transition-colors',
      sizeClasses[size].button,
      showLabel ? 'flex items-center gap-2' : '',
    ]"
    :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggleTheme"
  >
    <SunIcon v-if="!isDark" :class="sizeClasses[size].icon" />
    <MoonIcon v-else :class="sizeClasses[size].icon" />
    <span v-if="showLabel" class="text-sm font-medium">
      {{ isDark ? 'Dark' : 'Light' }}
    </span>
  </button>
</template>
