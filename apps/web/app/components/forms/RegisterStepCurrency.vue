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

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const currencyOptions = [
  { value: 'PHP', label: 'PHP - Philippine Peso' },
  { value: 'USD', label: 'USD - US Dollar' },
];
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-lg font-semibold text-gray-900">Currency Settings</h3>
    <p class="text-sm text-gray-500">Choose your preferred currency for tracking finances.</p>

    <UiBaseSelect
      v-model="form.currency"
      label="Default Currency"
      :options="currencyOptions"
      required
    />

    <div class="mt-4 p-4 bg-blue-50 rounded-md">
      <p class="text-sm text-blue-700">
        You can change this later in your account settings.
      </p>
    </div>
  </div>
</template>
