<script setup lang="ts">
interface Props {
  name: string;
  color: string;
  removable?: boolean;
}

defineProps<Props>();
const emit = defineEmits<{ remove: [] }>();
</script>

<template>
  <span
    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
    :style="{
      backgroundColor: color + '20',
      color: color,
      border: `1px solid ${color}40`,
    }"
  >
    {{ name }}
    <button
      v-if="removable"
      class="ml-0.5 hover:opacity-70 transition-opacity"
      @click.stop="emit('remove')"
    >
      &times;
    </button>
  </span>
</template>
