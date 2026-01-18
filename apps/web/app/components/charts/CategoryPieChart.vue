<script setup lang="ts">
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  data: Record<string, { total: number; count: number }>;
  currency?: string;
}>();

const categoryColors: Record<string, string> = {
  Bills: '#ef4444',
  Food: '#f97316',
  Transport: '#3b82f6',
  Savings: '#22c55e',
  Entertainment: '#a855f7',
};

const defaultColors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#84cc16', '#06b6d4'];

const chartData = computed(() => {
  const entries = Object.entries(props.data);
  const labels = entries.map(([name]) => name);
  const values = entries.map(([, data]) => data.total);
  const colors = entries.map(([name], index) => categoryColors[name] || defaultColors[index % defaultColors.length]);

  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const,
    },
    tooltip: {
      callbacks: {
        label: (context: { label: string; parsed: number; dataset: { data: number[] } }) => {
          const value = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: props.currency || 'USD',
          }).format(context.parsed);
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((context.parsed / total) * 100).toFixed(1);
          return `${context.label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
}));
</script>

<template>
  <div class="h-80">
    <Pie v-if="Object.keys(data).length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-gray-500">
      No expense data available
    </div>
  </div>
</template>
