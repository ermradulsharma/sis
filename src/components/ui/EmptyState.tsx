import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FolderSearch } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center animate-in fade-in duration-500',
        className,
      )}
      {...props}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-800 text-slate-400 ring-8 ring-slate-800/50">
        {icon || <FolderSearch className="h-10 w-10" />}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      {description && <p className="mb-6 max-w-sm text-sm text-slate-400">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
