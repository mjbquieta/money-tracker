<script setup lang="ts">
interface Step {
  label: string;
  description?: string;
}

interface Props {
  steps: Step[];
  currentStep: number;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="flex items-center justify-between">
    <div
      v-for="(step, index) in props.steps"
      :key="index"
      class="flex items-center"
      :class="{ 'flex-1': index < props.steps.length - 1 }"
    >
      <div class="flex flex-col items-center">
        <div
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors',
            index < props.currentStep
              ? 'bg-green-500 text-white'
              : index === props.currentStep
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-600',
          ]"
        >
          <span v-if="index < props.currentStep">✓</span>
          <span v-else>{{ index + 1 }}</span>
        </div>
        <span
          :class="[
            'text-sm mt-2 font-medium',
            index <= props.currentStep ? 'text-gray-900' : 'text-gray-400',
          ]"
        >
          {{ step.label }}
        </span>
      </div>
      <div
        v-if="index < props.steps.length - 1"
        :class="[
          'flex-1 h-1 mx-4',
          index < props.currentStep ? 'bg-green-500' : 'bg-gray-200',
        ]"
      />
    </div>
  </div>
</template>
