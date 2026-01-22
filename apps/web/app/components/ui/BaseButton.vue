<script setup lang="ts">
interface Props {
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  disabled: false,
  loading: false,
});

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-700',
  outline:
    'border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:border-gray-300 dark:disabled:border-gray-600 disabled:text-gray-300 dark:disabled:text-gray-500',
};
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :class="[
      'px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2',
      variantClasses[props.variant],
      { 'cursor-not-allowed': props.disabled || props.loading },
    ]"
  >
    <span v-if="props.loading" class="animate-spin">⏳</span>
    <slot />
  </button>
</template>
