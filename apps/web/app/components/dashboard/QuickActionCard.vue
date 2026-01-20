<script setup lang="ts">
import type { Component } from "vue";
import { ChevronRightIcon } from "@heroicons/vue/24/outline";

interface Props {
  to: string;
  icon: Component;
  label: string;
  count?: number;
  countLabel?: string;
  description?: string;
}

defineProps<Props>();
</script>

<template>
  <NuxtLink
    :to="to"
    class="block bg-white rounded-xl shadow-card border border-secondary-100 p-5 hover:shadow-card-hover hover:border-primary-200 transition-all group"
  >
    <div class="flex items-start justify-between">
      <div class="flex items-center gap-3">
        <div
          class="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors"
        >
          <component :is="icon" class="w-6 h-6 text-primary-600" />
        </div>
        <div>
          <h3
            class="font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors"
          >
            {{ label }}
          </h3>
          <p v-if="count !== undefined" class="text-sm text-secondary-500">
            {{ count }} {{ countLabel || (count === 1 ? "item" : "items") }}
          </p>
        </div>
      </div>
      <ChevronRightIcon
        class="w-5 h-5 text-secondary-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all"
      />
    </div>
    <p v-if="description" class="text-sm text-secondary-500 mt-3">
      {{ description }}
    </p>
  </NuxtLink>
</template>
