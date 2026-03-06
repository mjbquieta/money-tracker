<template>
  <div v-if="hasMore" class="flex justify-center py-4">
    <button
      type="button"
      :disabled="loading"
      class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      @click="$emit('load-more')"
    >
      <svg
        v-if="loading"
        class="h-4 w-4 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {{ loading ? 'Loading...' : 'Load More' }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  hasMore: boolean;
  loading: boolean;
}>();

defineEmits<{
  'load-more': [];
}>();
</script>
