import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  /** Current theme setting. */
  theme: Theme;
  /** Set the theme. */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark. */
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: 'dark',

  setTheme: (theme) => {
    set({ theme });
    applyTheme(theme);
  },

  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      return { theme: newTheme };
    }),
}));

/**
 * Applies the theme class to the document root element.
 * Called on theme change and during initial hydration.
 */
function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;

  const root = document.documentElement;
  const resolved =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
  localStorage.setItem('sis-erp-theme', theme);
}
