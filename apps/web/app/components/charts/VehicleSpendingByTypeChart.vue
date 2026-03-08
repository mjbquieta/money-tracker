<script setup lang="ts">
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps<{
  data: Record<string, { total: number; count: number }>;
  currency?: string;
}>();

const { isDark } = useTheme();

const typeLabels: Record<string, string> = {
  FUEL: 'Fuel',
  MAINTENANCE: 'Maintenance',
  INSURANCE: 'Insurance',
  PARKING: 'Parking',
  TOLL: 'Toll',
  ACCESSORIES: 'Accessories',
  REGISTRATION: 'Registration',
  WASH: 'Car Wash',
  PARTICIPATION_FEE: 'Participation Fee',
  OTHER: 'Other',
};

const typeColors: Record<string, string> = {
  FUEL: '#f59e0b',
  MAINTENANCE: '#3b82f6',
  INSURANCE: '#a855f7',
  PARKING: '#06b6d4',
  TOLL: '#f97316',
  ACCESSORIES: '#ec4899',
  REGISTRATION: '#6366f1',
  WASH: '#14b8a6',
  PARTICIPATION_FEE: '#f43f5e',
  OTHER: '#6b7280',
};

const chartData = computed(() => {
  const entries = Object.entries(props.data).sort((a, b) => b[1].total - a[1].total);
  const labels = entries.map(([key]) => typeLabels[key] || key);
  const values = entries.map(([, d]) => d.total);
  const colors = entries.map(([key]) => typeColors[key] || '#6b7280');

  return {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: isDark.value ? '#1e293b' : '#ffffff',
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '55%',
  plugins: {
    legend: {
      position: 'right' as const,
      labels: { color: isDark.value ? '#94a3b8' : '#64748b' },
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
  <div class="h-72">
    <Doughnut v-if="Object.keys(data).length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-secondary-500 dark:text-secondary-400">
      No expense data available
    </div>
  </div>
</template>
