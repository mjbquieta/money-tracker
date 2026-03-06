<script setup lang="ts">
const { shortcuts, shortcutsHelpOpen } = useKeyboardShortcuts();

const groupedShortcuts = computed(() => {
  const groups: Record<string, typeof shortcuts.value> = {};
  for (const s of shortcuts.value) {
    if (!groups[s.category]) groups[s.category] = [];
    groups[s.category].push(s);
  }
  return groups;
});
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="shortcutsHelpOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        @click.self="shortcutsHelpOpen = false"
      >
        <div class="w-full max-w-md bg-white dark:bg-secondary-800 rounded-xl shadow-elevated border border-secondary-200 dark:border-secondary-700 overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-secondary-100 dark:border-secondary-700">
            <h2 class="text-lg font-semibold text-secondary-900 dark:text-secondary-100">Keyboard Shortcuts</h2>
            <button
              class="p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300 rounded transition-colors"
              @click="shortcutsHelpOpen = false"
            >
              <span class="sr-only">Close</span>
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="max-h-96 overflow-y-auto p-5 space-y-5">
            <div v-for="(items, category) in groupedShortcuts" :key="category">
              <h3 class="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                {{ category }}
              </h3>
              <div class="space-y-1.5">
                <div
                  v-for="shortcut in items"
                  :key="shortcut.key + shortcut.description"
                  class="flex items-center justify-between py-1.5"
                >
                  <span class="text-sm text-secondary-700 dark:text-secondary-300">{{ shortcut.description }}</span>
                  <kbd class="px-2 py-1 text-xs font-mono font-medium text-secondary-600 dark:text-secondary-400 bg-secondary-100 dark:bg-secondary-700 rounded border border-secondary-200 dark:border-secondary-600">
                    {{ shortcut.label }}
                  </kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
