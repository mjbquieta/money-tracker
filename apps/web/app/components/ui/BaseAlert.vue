<script setup lang="ts">
interface Props {
  type?: 'error' | 'success' | 'warning' | 'info';
  message: string | string[];
}

const props = withDefaults(defineProps<Props>(), {
  type: 'error',
});

const typeClasses = {
  error: 'bg-red-50 border-red-200 text-red-700',
  success: 'bg-green-50 border-green-200 text-green-700',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  info: 'bg-blue-50 border-blue-200 text-blue-700',
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
