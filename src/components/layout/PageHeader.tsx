import { ReactNode } from 'react';
import { BreadcrumbNav, type BreadcrumbNavProps } from './BreadcrumbNav';
import { cn } from '@/lib/utils';

export interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbNavProps['items'];
    actions?: ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn('mb-8 space-y-4', className)}>
            {breadcrumbs && <BreadcrumbNav items={breadcrumbs} />}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
                    {description && <p className="mt-1.5 text-sm text-slate-400">{description}</p>}
                </div>
                {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
        </div>
    );
}
