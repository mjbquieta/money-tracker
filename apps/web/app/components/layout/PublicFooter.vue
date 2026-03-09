<script setup lang="ts">
import { HeartIcon } from "@heroicons/vue/24/outline";
</script>

<template>
  <footer
    class="py-8 sm:py-10 border-t border-secondary-100 dark:border-secondary-800"
  >
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div
        class="flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <div class="flex items-center gap-2.5">
          <img src="/prospera-icon.png" alt="Prospera" class="w-7 h-7" />
          <span
            class="font-semibold text-secondary-700 dark:text-secondary-300 text-sm"
            >Prospera</span
          >
        </div>
        <div class="flex items-center gap-6">
          <NuxtLink
            to="/feedback"
            class="text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Feedback
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            About
          </NuxtLink>
        </div>
        <p
          class="text-xs text-secondary-400 dark:text-secondary-500 flex items-center gap-1"
        >
          Made with
          <HeartIcon class="w-3.5 h-3.5 text-danger-500" /> by
          <a
            href="https://michaelquieta.com"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary-600 dark:text-primary-400 hover:underline"
            >michaelquieta.com</a
          >
        </p>
      </div>
    </div>
  </footer>
</template>
