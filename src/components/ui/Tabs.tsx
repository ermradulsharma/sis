import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: ReactNode;
  content?: ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
  contentClassName?: string;
}

export function Tabs({ tabs, activeTab, onChange, className, contentClassName }: TabsProps) {
  const activeContent = tabs.find((t) => t.id === activeTab)?.content;

  return (
    <div className={className}>
      <div className="border-b border-slate-800">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={cn(
                  'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-200',
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.icon && (
                  <span
                    className={cn(
                      'mr-2 h-5 w-5',
                      isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-400',
                    )}
                  >
                    {tab.icon}
                  </span>
                )}
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
      
      {activeContent && (
        <div className={cn('pt-6', contentClassName)}>
          {activeContent}
        </div>
      )}
    </div>
  );
}
