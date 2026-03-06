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
interface MonthlyDataItem {
  month: number;
  income: number;
  expenses: number;
  label?: string;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const props = defineProps<{
  data: MonthlyDataItem[];
  currency?: string;
}>();

const { isDark } = useTheme();

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const chartData = computed(() => ({
  labels: props.data.map((m) => m.label || monthNames[m.month - 1]),
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

const chartOptions = computed(() => {
  const textColor = isDark.value ? '#94a3b8' : '#64748b';
  const gridColor = isDark.value ? '#334155' : '#e2e8f0';

  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: textColor },
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
  <div class="h-80">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
