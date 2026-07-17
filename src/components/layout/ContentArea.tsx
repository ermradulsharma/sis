import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function ContentArea({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 md:px-8', className)} {...props}>{children}</div>
    );
}
