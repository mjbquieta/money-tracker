<script setup lang="ts">
import { HomeIcon } from '@heroicons/vue/24/outline';
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50/30 flex flex-col justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background decoration - hidden on small screens for performance -->
    <div class="hidden sm:block absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-primary-100 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
    <div class="hidden sm:block absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-accent-100 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

    <!-- Home button -->
    <div class="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
      <NuxtLink
        to="/"
        class="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-secondary-600 hover:text-primary-600 hover:bg-white/80 rounded-lg transition-colors group text-sm sm:text-base"
      >
        <HomeIcon class="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
        <span class="font-medium">Home</span>
      </NuxtLink>
    </div>

    <!-- Logo -->
    <div class="relative mx-auto w-full max-w-md px-4 sm:px-0">
      <NuxtLink to="/" class="flex items-center justify-center gap-2 sm:gap-3 group">
        <img src="/prospera-logo.png" alt="Prospera" class="h-10 sm:h-12 group-hover:scale-105 transition-transform" />
      </NuxtLink>
    </div>

    <!-- Form Card -->
    <div class="relative mt-6 sm:mt-8 mx-auto w-full max-w-lg px-0 sm:px-4">
      <div class="bg-white/80 backdrop-blur-sm py-8 px-5 sm:py-10 sm:px-10 shadow-elevated rounded-2xl border border-secondary-100">
        <slot />
      </div>
    </div>

    <!-- Footer -->
    <p class="relative mt-6 sm:mt-8 text-center text-xs sm:text-sm text-secondary-400 px-4">
      Free forever. No credit card required.
    </p>
  </div>
</template>
