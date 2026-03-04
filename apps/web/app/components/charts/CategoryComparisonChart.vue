<script setup lang="ts">
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { CategoryComparisonPeriod } from '~/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{
  data: CategoryComparisonPeriod[];
  currency?: string;
}>();

const periodColors = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#84cc16', '#06b6d4'];

const chartData = computed(() => {
  // Collect all category names across all periods
  const allCategories = new Set<string>();
  for (const period of props.data) {
    for (const cat of Object.keys(period.expensesByCategory)) {
      allCategories.add(cat);
    }
  }
  const categories = Array.from(allCategories).sort();

  // Each period becomes a dataset
  const datasets = props.data.map((period, index) => ({
    label: period.name || `Period ${index + 1}`,
    data: categories.map((cat) => period.expensesByCategory[cat]?.total || 0),
    backgroundColor: periodColors[index % periodColors.length],
    borderRadius: 4,
  }));

  return {
    labels: categories,
    datasets,
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label: (context: { dataset: { label: string }; parsed: { y: number } }) => {
          const value = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: props.currency || 'USD',
          }).format(context.parsed.y);
          return `${context.dataset.label}: ${value}`;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value: number) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: props.currency || 'USD',
            notation: 'compact',
          }).format(value);
        },
      },
    },
  },
}));
</script>

<template>
  <div class="h-80">
    <Bar v-if="data.length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-secondary-500 dark:text-secondary-400">
      Select budget periods to compare
    </div>
  </div>
</template>
