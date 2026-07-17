import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function ChartCard({ title, description, children, action, className }: ChartCardProps) {
  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1.5">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className="flex-1 pb-6 pt-4">
        {/* The chart component (Recharts) will go inside here */}
        <div className="h-full min-h-[300px] w-full">{children}</div>
      </CardContent>
    </Card>
  );
}
