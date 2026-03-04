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
import type { TopExpenseItem } from '~/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{
  data: TopExpenseItem[];
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

const chartData = computed(() => ({
  labels: props.data.map((e) => e.name),
  datasets: [
    {
      label: 'Amount',
      data: props.data.map((e) => e.amount),
      backgroundColor: props.data.map((e, i) => categoryColors[e.categoryName] || defaultColors[i % defaultColors.length]),
      borderRadius: 4,
    },
  ],
}));

const chartOptions = computed(() => ({
  indexAxis: 'y' as const,
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: { parsed: { x: number } }) => {
          const value = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: props.currency || 'USD',
          }).format(context.parsed.x);
          return value;
        },
        afterLabel: (context: { dataIndex: number }) => {
          return props.data[context.dataIndex]?.categoryName || '';
        },
      },
    },
  },
  scales: {
    x: {
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
  <div class="h-64">
    <Bar v-if="data.length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-secondary-500 dark:text-secondary-400">
      No expense data available
    </div>
  </div>
</template>
