<script setup lang="ts">
import type { Component } from "vue";

interface Props {
  icon?: Component;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

defineProps<Props>();
defineEmits<{
  action: [];
}>();
</script>

<template>
  <div class="text-center py-12">
    <div
      class="bg-white dark:bg-secondary-800 rounded-2xl shadow-card p-10 max-w-lg mx-auto border border-secondary-100 dark:border-secondary-700"
    >
      <div
        v-if="icon"
        class="w-16 h-16 bg-primary-50 dark:bg-primary-900/50 rounded-2xl flex items-center justify-center mx-auto mb-5"
      >
        <component :is="icon" class="w-8 h-8 text-primary-500 dark:text-primary-400" />
      </div>

      <h3 class="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
        {{ title }}
      </h3>

      <p v-if="description" class="text-secondary-500 dark:text-secondary-400 mb-6">
        {{ description }}
      </p>

      <slot name="content" />

      <div v-if="actionLabel" class="mt-6">
        <NuxtLink v-if="actionTo" :to="actionTo">
          <button
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
          >
            {{ actionLabel }}
          </button>
        </NuxtLink>
        <button
          v-else
          class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-card hover:shadow-card-hover font-medium"
          @click="$emit('action')"
        >
          {{ actionLabel }}
        </button>
      </div>

      <slot name="footer" />
    </div>
  </div>
</template>
