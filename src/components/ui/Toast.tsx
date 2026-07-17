'use client';

import { useEffect, useState } from 'react';
import { useNotificationStore, ToastNotification } from '@/stores/notification.store';
import { cn } from '@/lib/utils';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export function ToastContainer() {
  const toasts = useNotificationStore((state) => state.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex max-w-md flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

function ToastItem({ toast }: { toast: ToastNotification }) {
  const removeToast = useNotificationStore((state) => state.removeToast);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => removeToast(toast.id), 300); // Wait for exit animation
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, removeToast]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => removeToast(toast.id), 300);
  };

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    error: <AlertCircle className="h-5 w-5 text-rose-400" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    info: <Info className="h-5 w-5 text-indigo-400" />,
  };

  const borderColors = {
    success: 'border-emerald-500/20',
    error: 'border-rose-500/20',
    warning: 'border-amber-500/20',
    info: 'border-indigo-500/20',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full items-start gap-3 rounded-lg border bg-slate-900/90 p-4 shadow-xl backdrop-blur-md transition-all duration-300',
        borderColors[toast.type],
        isLeaving ? 'translate-x-full opacity-0' : 'animate-in slide-in-from-right-full',
      )}
      role="alert"
    >
      <div className="shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 pt-0.5">
        <p className="text-sm font-medium text-white">{toast.title}</p>
        {toast.message && <p className="mt-1 text-sm text-slate-400">{toast.message}</p>}
      </div>
      <button
        onClick={handleClose}
        className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
