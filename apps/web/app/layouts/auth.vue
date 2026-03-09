<script setup lang="ts">
import { HomeIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <div class="min-h-screen bg-white dark:bg-secondary-900 flex flex-col justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 relative overflow-hidden">

    <!-- Home button -->
    <div class="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
      <NuxtLink
        to="/"
        class="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/80 dark:hover:bg-secondary-800/80 rounded-lg transition-colors group text-sm sm:text-base"
      >
        <HomeIcon class="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
        <span class="font-medium">Home</span>
      </NuxtLink>
    </div>

    <!-- Theme toggle -->
    <div class="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
      <UiThemeToggle size="md" />
    </div>

    <!-- Logo -->
    <div class="relative mx-auto w-full max-w-md px-4 sm:px-0">
      <NuxtLink to="/" class="flex items-center justify-center gap-2 sm:gap-3 group">
        <img src="/prospera-logo.png" alt="Prospera" class="h-10 sm:h-12 group-hover:scale-105 transition-transform" />
      </NuxtLink>
    </div>

    <!-- Form Card -->
    <div class="relative mt-6 sm:mt-8 mx-auto w-full max-w-lg px-0 sm:px-4">
      <div class="bg-white dark:bg-secondary-800 py-8 px-5 sm:py-10 sm:px-10 shadow-elevated rounded-2xl border border-secondary-100 dark:border-secondary-700">
        <slot />
      </div>
    </div>

    <!-- Footer -->
    <p class="relative mt-6 sm:mt-8 text-center text-xs sm:text-sm text-secondary-400 dark:text-secondary-500 px-4">
      Free forever. No credit card required.
    </p>
  </div>
</template>
