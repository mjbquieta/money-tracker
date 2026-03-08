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
import type { VehicleFuelDataPoint } from '~/types';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const props = defineProps<{
  data: VehicleFuelDataPoint[];
  currency?: string;
}>();

const { isDark } = useTheme();

const chartData = computed(() => {
  const labels = props.data.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  return {
    labels,
    datasets: [
      {
        label: 'Liters',
        data: props.data.map((d) => d.liters),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 7,
        yAxisID: 'y',
      },
      {
        label: 'Cost',
        data: props.data.map((d) => d.amount),
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 7,
        yAxisID: 'y1',
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
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: textColor },
      },
      tooltip: {
        callbacks: {
          afterLabel: (context: { dataIndex: number }) => {
            const point = props.data[context.dataIndex];
            const parts: string[] = [];
            if (point.pricePerLiter) parts.push(`Price/L: ${point.pricePerLiter.toFixed(2)}`);
            if (point.odometer) parts.push(`ODO: ${point.odometer.toLocaleString()} km`);
            if (point.isFullTank) parts.push('Full Tank');
            return parts.length > 0 ? parts.join(' | ') : '';
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
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Liters',
          color: textColor,
        },
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cost',
          color: textColor,
        },
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
        grid: { drawOnChartArea: false },
      },
    },
  };
});
</script>

<template>
  <div class="h-72">
    <Line v-if="data.length > 0" :data="chartData" :options="chartOptions" />
    <div v-else class="h-full flex items-center justify-center text-secondary-500 dark:text-secondary-400">
      No fuel data available
    </div>
  </div>
</template>
