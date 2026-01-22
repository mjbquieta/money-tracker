export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme-preference';

const colorMode = ref<Theme>('system');
const isDark = ref(false);
const isHydrated = ref(false);

function getSystemPreference(): boolean {
  if (import.meta.client) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return false;
}

function applyTheme(dark: boolean) {
  if (!import.meta.client) return;

  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  isDark.value = dark;
}

function resolveTheme(preference: Theme): boolean {
  if (preference === 'system') {
    return getSystemPreference();
  }
  return preference === 'dark';
}

function setTheme(theme: Theme) {
  colorMode.value = theme;
  if (import.meta.client) {
    localStorage.setItem(STORAGE_KEY, theme);
  }
  applyTheme(resolveTheme(theme));
}

function toggleTheme() {
  setTheme(isDark.value ? 'light' : 'dark');
}

function hydrateTheme() {
  if (!import.meta.client || isHydrated.value) return;

  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (saved && ['light', 'dark', 'system'].includes(saved)) {
    colorMode.value = saved;
  } else {
    colorMode.value = 'system';
  }
  applyTheme(resolveTheme(colorMode.value));
  isHydrated.value = true;

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (colorMode.value === 'system') {
      applyTheme(e.matches);
    }
  });
}

if (import.meta.client) {
  hydrateTheme();
}

export function useTheme() {
  return {
    colorMode: readonly(colorMode),
    isDark: readonly(isDark),
    isHydrated: readonly(isHydrated),
    setTheme,
    toggleTheme,
    hydrateTheme,
  };
}
