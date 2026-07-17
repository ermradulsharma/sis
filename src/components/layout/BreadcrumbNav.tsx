'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

export interface BreadcrumbNavProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
    const pathname = usePathname();

    if (!items || items.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className={cn('flex items-center text-sm', className)}>
            <ol className="flex items-center gap-2">
                <li className="flex items-center">
                    <Link href="/admin" className="flex items-center text-slate-400 hover:text-white transition-colors" aria-label="Home"><Home className="h-4 w-4" /></Link>
                </li>

                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isActive = item.href ? pathname === item.href : isLast;

                    return (
                        <li key={index} className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4 text-slate-600" />
                            {item.href && !isLast ? (
                                <Link href={item.href} className="text-slate-400 hover:text-white transition-colors" aria-current={isActive ? 'page' : undefined}>{item.label}</Link>
                            ) : (
                                <span className={cn('font-medium', isActive ? 'text-indigo-400' : 'text-slate-200')} aria-current={isActive ? 'page' : undefined}>{item.label}</span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
