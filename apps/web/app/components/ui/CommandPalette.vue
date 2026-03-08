<script setup lang="ts">
import {
  MagnifyingGlassIcon,
  HomeIcon,
  CalendarDaysIcon,
  ClipboardDocumentListIcon,
  FlagIcon,
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowPathIcon,
  TruckIcon,
} from '@heroicons/vue/24/outline';

const router = useRouter();
const { commandPaletteOpen } = useKeyboardShortcuts();
const searchQuery = ref('');
const selectedIndex = ref(0);
const inputRef = ref<HTMLInputElement | null>(null);

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: any;
  action: () => void;
  category: string;
}

const commands = computed<CommandItem[]>(() => [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'Go to dashboard',
    icon: HomeIcon,
    action: () => router.push('/dashboard'),
    category: 'Navigation',
  },
  {
    id: 'budget-periods',
    label: 'Budget Periods',
    description: 'Manage budget periods',
    icon: CalendarDaysIcon,
    action: () => router.push('/budget-periods'),
    category: 'Navigation',
  },
  {
    id: 'personal-budgets',
    label: 'Personal Budgets',
    description: 'Manage personal budgets',
    icon: ClipboardDocumentListIcon,
    action: () => router.push('/personal-budgets'),
    category: 'Navigation',
  },
  {
    id: 'goals',
    label: 'Financial Goals',
    description: 'Track financial goals',
    icon: FlagIcon,
    action: () => router.push('/financial-goals'),
    category: 'Navigation',
  },
  {
    id: 'debts',
    label: 'Debts',
    description: 'Track debts and payments',
    icon: CurrencyDollarIcon,
    action: () => router.push('/debts'),
    category: 'Navigation',
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    description: 'Track car and vehicle expenses',
    icon: TruckIcon,
    action: () => router.push('/vehicles'),
    category: 'Navigation',
  },
  {
    id: 'expense-templates',
    label: 'Expense Templates',
    description: 'Manage expense templates',
    icon: DocumentTextIcon,
    action: () => router.push('/expense-templates'),
    category: 'Navigation',
  },
  {
    id: 'recurring-expenses',
    label: 'Recurring Expenses',
    description: 'Manage recurring expenses',
    icon: ArrowPathIcon,
    action: () => router.push('/recurring-expenses'),
    category: 'Navigation',
  },
  {
    id: 'metrics',
    label: 'Metrics',
    description: 'View analytics and metrics',
    icon: ChartBarIcon,
    action: () => router.push('/metrics'),
    category: 'Navigation',
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'App settings and preferences',
    icon: Cog6ToothIcon,
    action: () => router.push('/settings'),
    category: 'Navigation',
  },
]);

const filteredCommands = computed(() => {
  if (!searchQuery.value) return commands.value;
  const q = searchQuery.value.toLowerCase();
  return commands.value.filter(
    (c) =>
      c.label.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q),
  );
});

watch(commandPaletteOpen, (isOpen) => {
  if (isOpen) {
    searchQuery.value = '';
    selectedIndex.value = 0;
    nextTick(() => inputRef.value?.focus());
  }
});

watch(searchQuery, () => {
  selectedIndex.value = 0;
});

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    selectedIndex.value = Math.min(selectedIndex.value + 1, filteredCommands.value.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const cmd = filteredCommands.value[selectedIndex.value];
    if (cmd) executeCommand(cmd);
  }
}

function executeCommand(cmd: CommandItem) {
  commandPaletteOpen.value = false;
  cmd.action();
}
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
        v-if="commandPaletteOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center pt-[15vh]"
        @click.self="commandPaletteOpen = false"
      >
        <div
          class="w-full max-w-lg bg-white dark:bg-secondary-800 rounded-xl shadow-elevated border border-secondary-200 dark:border-secondary-700 overflow-hidden"
          @keydown="handleKeydown"
          data-tour="keyboard-shortcuts"
        >
          <!-- Search input -->
          <div class="flex items-center gap-3 px-4 py-3 border-b border-secondary-100 dark:border-secondary-700">
            <MagnifyingGlassIcon class="w-5 h-5 text-secondary-400" />
            <input
              ref="inputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Search commands..."
              class="flex-1 bg-transparent text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 outline-none text-sm"
            />
            <kbd class="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-medium text-secondary-400 bg-secondary-100 dark:bg-secondary-700 rounded">
              ESC
            </kbd>
          </div>

          <!-- Results -->
          <div class="max-h-72 overflow-y-auto py-2">
            <div v-if="filteredCommands.length === 0" class="px-4 py-6 text-center text-sm text-secondary-500 dark:text-secondary-400">
              No commands found
            </div>
            <button
              v-for="(cmd, index) in filteredCommands"
              :key="cmd.id"
              class="flex items-center gap-3 w-full px-4 py-2.5 text-left transition-colors"
              :class="index === selectedIndex
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700/50'"
              @click="executeCommand(cmd)"
              @mouseenter="selectedIndex = index"
            >
              <component :is="cmd.icon" class="w-5 h-5 flex-shrink-0 opacity-60" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ cmd.label }}</p>
                <p v-if="cmd.description" class="text-xs opacity-60 truncate">{{ cmd.description }}</p>
              </div>
            </button>
          </div>

          <!-- Footer -->
          <div class="px-4 py-2 border-t border-secondary-100 dark:border-secondary-700 flex items-center gap-4 text-[10px] text-secondary-400">
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-secondary-100 dark:bg-secondary-700 rounded font-medium">↑↓</kbd>
              navigate
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-secondary-100 dark:bg-secondary-700 rounded font-medium">↵</kbd>
              select
            </span>
            <span class="flex items-center gap-1">
              <kbd class="px-1.5 py-0.5 bg-secondary-100 dark:bg-secondary-700 rounded font-medium">esc</kbd>
              close
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
