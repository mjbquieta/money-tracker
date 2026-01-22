<script setup lang="ts">
interface Props {
  modelValue: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  error: '',
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="props.label" class="text-sm font-medium text-gray-700 dark:text-gray-300">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
    <select
      :value="props.modelValue"
      :required="props.required"
      :disabled="props.disabled"
      :class="[
        'px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-secondary-900 dark:text-secondary-100',
        props.error ? 'border-red-500' : 'border-gray-300 dark:border-secondary-600',
        props.disabled ? 'bg-gray-100 dark:bg-secondary-900 cursor-not-allowed' : 'bg-white dark:bg-secondary-700',
      ]"
      @change="handleChange"
    >
      <slot />
    </select>
    <span v-if="props.error" class="text-sm text-red-500">{{ props.error }}</span>
  </div>
</template>
