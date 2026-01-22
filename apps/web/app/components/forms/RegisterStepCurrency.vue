<script setup lang="ts">
interface Props {
  modelValue: {
    currency: string;
  };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: Props['modelValue']];
}>();

const currencyOptions = [
  { value: 'PHP', label: 'PHP - Philippine Peso' },
  { value: 'USD', label: 'USD - US Dollar' },
];

function updateCurrency(value: string) {
  emit('update:modelValue', { ...props.modelValue, currency: value });
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Currency Settings</h3>
    <p class="text-sm text-secondary-500 dark:text-secondary-400">Choose your preferred currency for tracking finances.</p>

    <UiBaseSelect
      :model-value="modelValue.currency"
      label="Default Currency"
      required
      @update:model-value="updateCurrency"
    >
      <option v-for="option in currencyOptions" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </UiBaseSelect>

    <div class="mt-4 p-4 bg-primary-50 dark:bg-primary-900/30 rounded-lg">
      <p class="text-sm text-primary-700 dark:text-primary-300">
        You can change this later in your account settings.
      </p>
    </div>
  </div>
</template>
