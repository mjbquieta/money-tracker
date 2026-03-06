<script setup lang="ts">
const props = defineProps<{
  totalSpent: number;
  spendingLimit: number;
  categoryName: string;
  formatCurrency: (amount: number) => string;
}>();

const percentage = computed(() => Math.min(150, (props.totalSpent / props.spendingLimit) * 100));

const barColor = computed(() => {
  if (percentage.value > 100) return 'bg-danger-500';
  if (percentage.value >= 80) return 'bg-warning-500';
  if (percentage.value >= 60) return 'bg-yellow-500';
  return 'bg-success-500';
});

const textColor = computed(() => {
  if (percentage.value > 100) return 'text-danger-600 dark:text-danger-400';
  if (percentage.value >= 80) return 'text-warning-600 dark:text-warning-400';
  return 'text-secondary-600 dark:text-secondary-400';
});
</script>

<template>
  <div class="space-y-1">
    <div class="flex items-center justify-between text-xs">
      <span :class="textColor" class="font-medium">
        {{ formatCurrency(totalSpent) }} / {{ formatCurrency(spendingLimit) }}
      </span>
      <span :class="textColor">
        {{ percentage.toFixed(0) }}%
      </span>
    </div>
    <div class="h-2 bg-secondary-100 dark:bg-secondary-700 rounded-full overflow-hidden">
      <div
        :class="barColor"
        class="h-full rounded-full transition-all duration-300"
        :style="{ width: `${Math.min(100, percentage)}%` }"
      />
    </div>
  </div>
</template>
