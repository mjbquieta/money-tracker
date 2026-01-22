<script setup lang="ts">
interface Props {
  type?: 'error' | 'success' | 'warning' | 'info';
  message: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
});

const typeClasses = {
  error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
  success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300',
  warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300',
  info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300',
};

const messages = computed(() => {
  return Array.isArray(props.message) ? props.message : [props.message];
});
</script>

<template>
  <div :class="['p-4 border rounded-md', typeClasses[props.type]]">
    <ul v-if="messages.length > 1" class="list-disc list-inside space-y-1">
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
    <p v-else>{{ messages[0] }}</p>
  </div>
</template>
