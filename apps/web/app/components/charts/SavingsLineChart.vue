<script setup lang="ts">
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import type { MonthlyBreakdown } from '~/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const props = defineProps<{
  data: MonthlyBreakdown[];
  currency?: string;
}>();

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const chartData = computed(() => {
  const savings = props.data.map((m) => m.income - m.expenses);
  let cumulative = 0;
  const cumulativeSavings = savings.map((s) => {
    cumulative += s;
    return cumulative;
  });

  return {
    labels: monthNames,
    datasets: [
      {
        label: 'Monthly Net',
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        data: savings,
        fill: true,
        tension: 0.3,
      },
      {
        label: 'Cumulative Savings',
        borderColor: '#22c55e',
        backgroundColor: 'transparent',
        data: cumulativeSavings,
        borderDash: [5, 5],
        tension: 0.3,
      },
    ],
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
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
