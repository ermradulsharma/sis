import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  id?: string;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export function FormField({
  id,
  label,
  description,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-200"
      >
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>
      
      {children}
      
      {error && <p className="text-xs text-rose-500">{error}</p>}
      
      {description && !error && (
        <p className="text-xs text-slate-400">{description}</p>
      )}
    </div>
  );
}

export interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <div className={cn('space-y-6 pt-6', className)}>
      <div>
        <h3 className="text-lg font-medium leading-6 text-white">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
        {children}
      </div>
    </div>
  );
}
