export interface ShortcutAction {
  key: string;
  label: string;
  description: string;
  category: string;
  action: () => void;
  meta?: boolean;    // Ctrl/Cmd required
  shift?: boolean;   // Shift required
}

const commandPaletteOpen = ref(false);
const shortcutsHelpOpen = ref(false);

export function useKeyboardShortcuts() {
  const router = useRouter();
  const authStore = useAuthStore();

  const shortcuts = computed<ShortcutAction[]>(() => {
    const nav: ShortcutAction[] = [
      {
        key: 'k',
        label: 'Ctrl+K',
        description: 'Open command palette',
        category: 'General',
        action: () => { commandPaletteOpen.value = true; },
        meta: true,
      },
      {
        key: '?',
        label: '?',
        description: 'Show keyboard shortcuts',
        category: 'General',
        action: () => { shortcutsHelpOpen.value = true; },
      },
      {
        key: 'Escape',
        label: 'Esc',
        description: 'Close modal / palette',
        category: 'General',
        action: () => {
          commandPaletteOpen.value = false;
          shortcutsHelpOpen.value = false;
        },
      },
    ];

    if (authStore.isAuthenticated) {
      nav.push(
        {
          key: 'd',
          label: 'G then D',
          description: 'Go to Dashboard',
          category: 'Navigation',
          action: () => router.push('/dashboard'),
        },
        {
          key: 'b',
          label: 'G then B',
          description: 'Go to Budget Periods',
          category: 'Navigation',
          action: () => router.push('/budget-periods'),
        },
        {
          key: 'p',
          label: 'G then P',
          description: 'Go to Personal Budgets',
          category: 'Navigation',
          action: () => router.push('/personal-budgets'),
        },
        {
          key: 'g',
          label: 'G then G',
          description: 'Go to Financial Goals',
          category: 'Navigation',
          action: () => router.push('/financial-goals'),
        },
        {
          key: 't',
          label: 'G then T',
          description: 'Go to Debts',
          category: 'Navigation',
          action: () => router.push('/debts'),
        },
        {
          key: 'v',
          label: 'G then V',
          description: 'Go to Vehicles',
          category: 'Navigation',
          action: () => router.push('/vehicles'),
        },
        {
          key: 's',
          label: 'G then S',
          description: 'Go to Settings',
          category: 'Navigation',
          action: () => router.push('/settings'),
        },
      );
    }

    return nav;
  });

  // "G then X" navigation state
  let goPrefix = false;
  let goPrefixTimeout: ReturnType<typeof setTimeout> | null = null;

  function isInputFocused(): boolean {
    const el = document.activeElement;
    if (!el) return false;
    const tag = el.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || (el as HTMLElement).isContentEditable;
  }

  function handleKeydown(event: KeyboardEvent) {
    // Don't trigger shortcuts when typing in inputs
    if (isInputFocused() && !event.metaKey && !event.ctrlKey) return;

    const isMeta = event.metaKey || event.ctrlKey;

    // Ctrl/Cmd+K: command palette
    if (isMeta && event.key === 'k') {
      event.preventDefault();
      commandPaletteOpen.value = !commandPaletteOpen.value;
      return;
    }

    // Escape: close modals
    if (event.key === 'Escape') {
      if (commandPaletteOpen.value) {
        commandPaletteOpen.value = false;
        event.preventDefault();
        return;
      }
      if (shortcutsHelpOpen.value) {
        shortcutsHelpOpen.value = false;
        event.preventDefault();
        return;
      }
      return;
    }

    // Don't handle other shortcuts if input is focused or palette is open
    if (isInputFocused() || commandPaletteOpen.value) return;

    // ? for shortcuts help
    if (event.key === '?' && !isMeta) {
      event.preventDefault();
      shortcutsHelpOpen.value = !shortcutsHelpOpen.value;
      return;
    }

    // "G then X" navigation
    if (event.key === 'g' && !isMeta && !goPrefix) {
      goPrefix = true;
      if (goPrefixTimeout) clearTimeout(goPrefixTimeout);
      goPrefixTimeout = setTimeout(() => { goPrefix = false; }, 1000);
      return;
    }

    if (goPrefix && !isMeta) {
      goPrefix = false;
      if (goPrefixTimeout) clearTimeout(goPrefixTimeout);

      const navShortcuts = shortcuts.value.filter((s) => s.category === 'Navigation');
      const match = navShortcuts.find((s) => s.key === event.key);
      if (match) {
        event.preventDefault();
        match.action();
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown);
    if (goPrefixTimeout) clearTimeout(goPrefixTimeout);
  });

  return {
    shortcuts,
    commandPaletteOpen,
    shortcutsHelpOpen,
  };
}
