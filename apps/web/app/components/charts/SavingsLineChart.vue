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
import { QuestionMarkCircleIcon } from '@heroicons/vue/24/outline';

interface MonthlyDataItem {
  month: number;
  income: number;
  expenses: number;
  label?: string;
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const props = defineProps<{
  data: MonthlyDataItem[];
  currency?: string;
}>();

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const metricDescriptions = {
  monthlyIncome: 'Total income from all sources each month across all budget periods.',
  monthlyRemaining: 'Total remaining balance each month (Income - Expenses). This is how much you saved or overspent.',
};

const chartData = computed(() => {
  const incomes = props.data.map((m) => m.income);
  const savings = props.data.map((m) => m.income - m.expenses);

  return {
    labels: props.data.map((m) => m.label || monthNames[m.month - 1]),
    datasets: [
      {
        label: 'Monthly Income',
        borderColor: '#eab308',
        backgroundColor: 'rgba(234, 179, 8, 0.1)',
        data: incomes,
        fill: false,
        tension: 0.3,
      },
      {
        label: 'Monthly Remaining',
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        data: savings,
        fill: true,
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
      display: false,
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
  <div>
    <!-- Metric Legend with Tooltips -->
    <div class="flex flex-wrap gap-4 mb-4 text-sm">
      <div class="flex items-center gap-2 group relative">
        <span class="w-3 h-3 rounded-full bg-yellow-500"></span>
        <span class="text-secondary-600 dark:text-secondary-400">Monthly Income</span>
        <div class="relative">
          <QuestionMarkCircleIcon class="w-4 h-4 text-secondary-400 cursor-help" />
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-secondary-800 dark:bg-secondary-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-52 z-10">
            {{ metricDescriptions.monthlyIncome }}
            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-secondary-800 dark:border-t-secondary-700"></div>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 group relative">
        <span class="w-3 h-3 rounded-full bg-green-500"></span>
        <span class="text-secondary-600 dark:text-secondary-400">Monthly Remaining</span>
        <div class="relative">
          <QuestionMarkCircleIcon class="w-4 h-4 text-secondary-400 cursor-help" />
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-secondary-800 dark:bg-secondary-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-56 z-10">
            {{ metricDescriptions.monthlyRemaining }}
            <div class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-secondary-800 dark:border-t-secondary-700"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="h-80">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
