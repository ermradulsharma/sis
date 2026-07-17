import { create } from 'zustand';

interface SidebarState {
  /** Whether the sidebar is collapsed (icons only). */
  isCollapsed: boolean;
  /** Whether the mobile sidebar overlay is open. */
  isMobileOpen: boolean;
  /** Toggle collapsed state. */
  toggleCollapsed: () => void;
  /** Set collapsed state explicitly. */
  setCollapsed: (collapsed: boolean) => void;
  /** Toggle mobile overlay. */
  toggleMobile: () => void;
  /** Close mobile overlay. */
  closeMobile: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  toggleMobile: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  closeMobile: () => set({ isMobileOpen: false }),
}));
