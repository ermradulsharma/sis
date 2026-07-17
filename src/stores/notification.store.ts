import { create } from 'zustand';
import type { NotificationType } from '@/types';

export interface ToastNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationState {
  /** Queue of active toast notifications. */
  toasts: ToastNotification[];
  /** Add a toast notification. Returns the toast ID. */
  addToast: (toast: Omit<ToastNotification, 'id'>) => string;
  /** Remove a toast by ID. */
  removeToast: (id: string) => void;
  /** Clear all toasts. */
  clearToasts: () => void;
}

let toastIdCounter = 0;

export const useNotificationStore = create<NotificationState>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${++toastIdCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}));

/**
 * Convenience helpers for common toast types.
 */
export const toast = {
  success: (title: string, message?: string) =>
    useNotificationStore.getState().addToast({ type: 'success', title, message, duration: 3000 }),

  error: (title: string, message?: string) =>
    useNotificationStore.getState().addToast({ type: 'error', title, message, duration: 5000 }),

  warning: (title: string, message?: string) =>
    useNotificationStore.getState().addToast({ type: 'warning', title, message, duration: 4000 }),

  info: (title: string, message?: string) =>
    useNotificationStore.getState().addToast({ type: 'info', title, message, duration: 3000 }),
};
