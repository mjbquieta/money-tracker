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
import type { MonthlyBreakdown } from '~/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{
  data: MonthlyBreakdown[];
  currency?: string;
}>();

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const chartData = computed(() => ({
  labels: monthNames,
  datasets: [
    {
      label: 'Income',
      backgroundColor: '#22c55e',
      data: props.data.map((m) => m.income),
    },
    {
      label: 'Expenses',
      backgroundColor: '#ef4444',
      data: props.data.map((m) => m.expenses),
    },
  ],
}));

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
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
