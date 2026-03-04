<script setup lang="ts">
import { XMarkIcon, PlusIcon } from '@heroicons/vue/24/outline';
import type { Tag } from '~/types';

interface Props {
  modelValue: string[];
  tags: Tag[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

const isOpen = ref(false);
const search = ref('');

const selectedTags = computed(() =>
  props.tags.filter((t) => props.modelValue.includes(t.id)),
);

const filteredTags = computed(() =>
  props.tags.filter(
    (t) =>
      !props.modelValue.includes(t.id) &&
      t.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
);

function addTag(tagId: string) {
  emit('update:modelValue', [...props.modelValue, tagId]);
  search.value = '';
}

function removeTag(tagId: string) {
  emit(
    'update:modelValue',
    props.modelValue.filter((id) => id !== tagId),
  );
}

function toggleDropdown() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    search.value = '';
  }
}

// Close dropdown when clicking outside
const pickerRef = ref<HTMLElement | null>(null);
function handleClickOutside(event: MouseEvent) {
  if (pickerRef.value && !pickerRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <div ref="pickerRef" class="relative">
    <div class="flex flex-wrap items-center gap-1.5 min-h-[36px]">
      <UiTagBadge
        v-for="tag in selectedTags"
        :key="tag.id"
        :name="tag.name"
        :color="tag.color"
        removable
        @remove="removeTag(tag.id)"
      />
      <button
        type="button"
        class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 border border-dashed border-secondary-300 dark:border-secondary-600 rounded-full transition-colors"
        @click="toggleDropdown"
      >
        <PlusIcon class="w-3 h-3" />
        Add tag
      </button>
    </div>

    <div
      v-if="isOpen"
      class="absolute z-20 mt-1 w-56 bg-white dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg shadow-lg"
    >
      <div class="p-2">
        <input
          v-model="search"
          type="text"
          placeholder="Search tags..."
          class="w-full px-2.5 py-1.5 text-sm border border-secondary-200 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>
      <div class="max-h-40 overflow-y-auto">
        <button
          v-for="tag in filteredTags"
          :key="tag.id"
          type="button"
          class="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-secondary-50 dark:hover:bg-secondary-600 transition-colors"
          @click="addTag(tag.id)"
        >
          <span
            class="w-3 h-3 rounded-full flex-shrink-0"
            :style="{ backgroundColor: tag.color }"
          ></span>
          <span class="text-secondary-900 dark:text-secondary-100 truncate">{{ tag.name }}</span>
        </button>
        <p
          v-if="filteredTags.length === 0"
          class="px-3 py-2 text-xs text-secondary-400 dark:text-secondary-500"
        >
          No tags found
        </p>
      </div>
    </div>
  </div>
</template>
