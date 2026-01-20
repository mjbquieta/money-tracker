<script setup lang="ts">
import type { Component } from "vue";

interface Props {
  icon: Component;
  iconBgClass?: string;
  iconClass?: string;
  label: string;
  value: string | number;
  valueClass?: string;
  subtitle?: string;
  showProgress?: boolean;
  progressValue?: number;
  progressClass?: string;
}

withDefaults(defineProps<Props>(), {
  iconBgClass: "bg-primary-50",
  iconClass: "text-primary-600",
  valueClass: "text-secondary-900",
  showProgress: false,
  progressValue: 0,
  progressClass: "bg-primary-500",
});
</script>

<template>
  <div
    class="bg-white rounded-xl shadow-card p-5 border border-secondary-100"
  >
    <div class="flex items-center gap-3 mb-3">
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center"
        :class="iconBgClass"
      >
        <component :is="icon" class="w-5 h-5" :class="iconClass" />
      </div>
      <span class="text-sm font-medium text-secondary-500">{{ label }}</span>
    </div>
    <p class="text-2xl font-bold" :class="valueClass">
      {{ value }}
    </p>
    <p v-if="subtitle" class="text-xs text-secondary-400 mt-2">
      {{ subtitle }}
    </p>
    <div v-if="showProgress" class="mt-3 h-2 bg-secondary-100 rounded-full overflow-hidden">
      <div
        class="h-full transition-all duration-500"
        :class="progressClass"
        :style="{ width: `${Math.max(0, Math.min(100, progressValue))}%` }"
      />
    </div>
  </div>
</template>
