'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { MoreVertical } from 'lucide-react';

export interface DropdownItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  href?: string;
  danger?: boolean;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger?: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, items, align = 'right', className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative inline-block text-left', className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger || (
          <button className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <MoreVertical className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 mt-2 w-48 origin-top-right rounded-xl border border-slate-700 bg-slate-800 py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item, index) => {
            const Component = item.href ? 'a' : 'button';
            return (
              <Component
                key={index}
                href={item.href}
                onClick={() => {
                  if (item.disabled) return;
                  if (item.onClick) item.onClick();
                  setIsOpen(false);
                }}
                disabled={item.disabled}
                className={cn(
                  'flex w-full items-center px-4 py-2 text-sm transition-colors',
                  item.disabled
                    ? 'cursor-not-allowed text-slate-500'
                    : item.danger
                    ? 'text-rose-400 hover:bg-slate-700 hover:text-rose-300'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                )}
              >
                {item.icon && <span className="mr-3 shrink-0">{item.icon}</span>}
                {item.label}
              </Component>
            );
          })}
        </div>
      )}
    </div>
  );
}
