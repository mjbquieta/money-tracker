<script setup lang="ts">
import {
  TagIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline';
import type { Tag } from '~/types';

const tagStore = useTagStore();
const { tags, loading } = storeToRefs(tagStore);

const error = ref<string | null>(null);

// Create form
const showCreateForm = ref(false);
const newName = ref('');
const newColor = ref('#6B7280');

// Edit state
const editingId = ref<string | null>(null);
const editName = ref('');
const editColor = ref('');

// Delete confirm
const deletingId = ref<string | null>(null);

const presetColors = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E', '#14B8A6',
  '#3B82F6', '#6366F1', '#A855F7', '#EC4899', '#6B7280',
];

onMounted(() => {
  tagStore.fetchTags();
});

async function handleCreate() {
  if (!newName.value.trim()) return;

  error.value = null;
  const result = await tagStore.createTag({
    name: newName.value.trim(),
    color: newColor.value,
  });

  if (result.error) {
    error.value =
      typeof result.error.message === 'string'
        ? result.error.message
        : result.error.message[0];
    return;
  }

  newName.value = '';
  newColor.value = '#6B7280';
  showCreateForm.value = false;
}

function startEdit(tag: Tag) {
  editingId.value = tag.id;
  editName.value = tag.name;
  editColor.value = tag.color;
}

function cancelEdit() {
  editingId.value = null;
}

async function handleUpdate() {
  if (!editingId.value || !editName.value.trim()) return;

  error.value = null;
  const result = await tagStore.updateTag(editingId.value, {
    name: editName.value.trim(),
    color: editColor.value,
  });

  if (result.error) {
    error.value =
      typeof result.error.message === 'string'
        ? result.error.message
        : result.error.message[0];
    return;
  }

  editingId.value = null;
}

async function handleDelete(id: string) {
  error.value = null;
  const result = await tagStore.deleteTag(id);

  if (result.error) {
    error.value =
      typeof result.error.message === 'string'
        ? result.error.message
        : result.error.message[0];
  }

  deletingId.value = null;
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center bg-primary-50 dark:bg-primary-900/30">
          <TagIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
            Tags
          </h3>
          <p class="text-sm text-secondary-500 dark:text-secondary-400">
            Organize your expenses with custom tags
          </p>
        </div>
      </div>
      <button
        v-if="!showCreateForm"
        class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 border border-primary-200 dark:border-primary-700 rounded-lg transition-colors"
        @click="showCreateForm = true"
      >
        <PlusIcon class="w-4 h-4" />
        New Tag
      </button>
    </div>

    <UiBaseAlert v-if="error" type="error" :message="error" class="mb-4" />

    <!-- Create Form -->
    <div
      v-if="showCreateForm"
      class="flex items-end gap-3 mb-4 p-3 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg"
    >
      <div class="flex-1">
        <label class="block text-xs font-medium text-secondary-600 dark:text-secondary-400 mb-1">Name</label>
        <input
          v-model="newName"
          type="text"
          placeholder="Tag name"
          maxlength="50"
          class="w-full px-3 py-1.5 text-sm border border-secondary-200 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
          @keyup.enter="handleCreate"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-secondary-600 dark:text-secondary-400 mb-1">Color</label>
        <div class="flex items-center gap-1">
          <button
            v-for="c in presetColors"
            :key="c"
            type="button"
            class="w-5 h-5 rounded-full border-2 transition-all"
            :class="newColor === c ? 'border-secondary-900 dark:border-white scale-110' : 'border-transparent'"
            :style="{ backgroundColor: c }"
            @click="newColor = c"
          ></button>
        </div>
      </div>
      <button
        class="px-3 py-1.5 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-md transition-colors disabled:opacity-50"
        :disabled="!newName.trim()"
        @click="handleCreate"
      >
        Create
      </button>
      <button
        class="px-3 py-1.5 text-sm font-medium text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-600 rounded-md transition-colors"
        @click="showCreateForm = false; newName = ''; newColor = '#6B7280'"
      >
        Cancel
      </button>
    </div>

    <!-- Tags List -->
    <div v-if="loading && tags.length === 0" class="text-sm text-secondary-400 py-4 text-center">
      Loading tags...
    </div>

    <div v-else-if="tags.length === 0" class="text-sm text-secondary-400 py-4 text-center">
      No tags yet. Create one to get started.
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="tag in tags"
        :key="tag.id"
        class="flex items-center justify-between px-3 py-2 bg-white dark:bg-secondary-700 border border-secondary-100 dark:border-secondary-600 rounded-lg"
      >
        <!-- View mode -->
        <template v-if="editingId !== tag.id">
          <div class="flex items-center gap-2">
            <span
              class="w-4 h-4 rounded-full flex-shrink-0"
              :style="{ backgroundColor: tag.color }"
            ></span>
            <span class="text-sm font-medium text-secondary-900 dark:text-secondary-100">
              {{ tag.name }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <button
              class="p-1.5 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 transition-colors rounded"
              @click="startEdit(tag)"
            >
              <PencilSquareIcon class="w-4 h-4" />
            </button>
            <button
              v-if="deletingId !== tag.id"
              class="p-1.5 text-secondary-400 hover:text-red-500 transition-colors rounded"
              @click="deletingId = tag.id"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
            <template v-else>
              <button
                class="p-1.5 text-red-500 hover:text-red-600 transition-colors rounded"
                @click="handleDelete(tag.id)"
              >
                <CheckIcon class="w-4 h-4" />
              </button>
              <button
                class="p-1.5 text-secondary-400 hover:text-secondary-600 transition-colors rounded"
                @click="deletingId = null"
              >
                <XMarkIcon class="w-4 h-4" />
              </button>
            </template>
          </div>
        </template>

        <!-- Edit mode -->
        <template v-else>
          <div class="flex items-center gap-2 flex-1">
            <input
              v-model="editName"
              type="text"
              maxlength="50"
              class="flex-1 px-2 py-1 text-sm border border-secondary-200 dark:border-secondary-600 rounded-md bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
              @keyup.enter="handleUpdate"
            />
            <div class="flex items-center gap-0.5">
              <button
                v-for="c in presetColors"
                :key="c"
                type="button"
                class="w-4 h-4 rounded-full border-2 transition-all"
                :class="editColor === c ? 'border-secondary-900 dark:border-white scale-110' : 'border-transparent'"
                :style="{ backgroundColor: c }"
                @click="editColor = c"
              ></button>
            </div>
          </div>
          <div class="flex items-center gap-1 ml-2">
            <button
              class="p-1.5 text-green-500 hover:text-green-600 transition-colors rounded"
              :disabled="!editName.trim()"
              @click="handleUpdate"
            >
              <CheckIcon class="w-4 h-4" />
            </button>
            <button
              class="p-1.5 text-secondary-400 hover:text-secondary-600 transition-colors rounded"
              @click="cancelEdit"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
