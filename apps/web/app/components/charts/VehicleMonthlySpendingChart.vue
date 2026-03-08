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
import type { VehicleMonthlySpending } from '~/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{
  data: VehicleMonthlySpending[];
  currency?: string;
}>();

const { isDark } = useTheme();

const chartData = computed(() => {
  const labels = props.data.map((d) => {
    const [year, month] = d.month.split('-');
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  });

  return {
    labels,
    datasets: [
      {
        label: 'Monthly Spending',
        data: props.data.map((d) => d.total),
        backgroundColor: isDark.value ? 'rgba(99, 102, 241, 0.7)' : 'rgba(99, 102, 241, 0.8)',
        borderColor: '#6366f1',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };
});

const chartOptions = computed(() => {
  const textColor = isDark.value ? '#94a3b8' : '#64748b';
  const gridColor = isDark.value ? '#334155' : '#e2e8f0';

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: { parsed: { y: number } }) => {
            const value = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: props.currency || 'USD',
            }).format(context.parsed.y);
            return `Spent: ${value}`;
          },
          afterLabel: (_context: { dataIndex: number }) => {
            const point = props.data[_context.dataIndex];
            return `${point.count} expense${point.count !== 1 ? 's' : ''}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColor,
          callback: (value: number) => {
            return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: props.currency || 'USD',
              notation: 'compact',
            }).format(value);
          },
        },
        grid: { color: gridColor },
      },
    },
  };
});
</script>

<template>
  <div class="h-64">
    <Bar v-if="data.length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-secondary-500 dark:text-secondary-400">
      No monthly data available
    </div>
  </div>
</template>
