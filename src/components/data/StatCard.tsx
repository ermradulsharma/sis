import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</h3>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-indigo-400">
            {icon}
          </div>
        </div>
        
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span
              className={cn(
                'flex items-center font-medium',
                trend.isPositive ? 'text-emerald-400' : 'text-rose-400',
              )}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              )}
              {trend.value}%
            </span>
            <span className="ml-2 text-slate-500">{trend.label}</span>
          </div>
        )}
      </CardContent>
      {/* Decorative gradient line at the bottom */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0" />
    </Card>
  );
}
