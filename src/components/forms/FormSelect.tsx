'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
  helperText?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ className, label, error, options, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-slate-300">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "block w-full appearance-none rounded-lg border bg-slate-900/50 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500/50",
              "transition-colors duration-200",
              error 
                ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" 
                : "border-slate-700 hover:border-slate-600 focus:border-indigo-500",
              className
            )}
            {...props}
          >
            {/* Show an empty placeholder if no value is selected initially */}
            <option value="" disabled className="text-slate-500">Select an option...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-rose-500">{error}</p>
        )}
        {!error && helperText && (
          <p className="mt-1.5 text-sm text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
