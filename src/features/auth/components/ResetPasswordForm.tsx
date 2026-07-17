'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from '@/stores/notification.store';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const resetPasswordSchema = z.object({
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get('token') || '';
    
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: data.password }),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                setIsSuccess(true);
                toast.success('Password reset successfully.');
            } else {
                toast.error(result.message || 'Failed to reset password.');
            }
        } catch (error) {
            toast.error('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="w-full max-w-sm space-y-8 rounded-2xl bg-slate-900 p-8 shadow-xl ring-1 ring-slate-800 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-white">Invalid Link</h2>
                <p className="mt-2 text-sm text-slate-400">
                    This password reset link is invalid or has expired.
                </p>
                <div className="mt-8">
                    <Link href="/forgot-password" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Request new link
                    </Link>
                </div>
            </div>
        );
    }

    if (isSuccess) {
        return (
            <div className="w-full max-w-sm space-y-8 rounded-2xl bg-slate-900 p-8 shadow-xl ring-1 ring-slate-800 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 mb-4">
                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Password updated</h2>
                <p className="mt-2 text-sm text-slate-400">
                    Your password has been successfully reset.
                </p>
                <div className="mt-8">
                    <Button onClick={() => router.push('/login')} className="w-full">
                        Sign in now
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm space-y-8 rounded-2xl bg-slate-900 p-8 shadow-xl ring-1 ring-slate-800">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Set new password</h2>
                <p className="mt-2 text-sm text-slate-400">
                    Please enter your new password below.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-300 mb-2">
                        New password
                    </label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        leftIcon={<Lock className="h-4 w-4" />}
                        error={errors.password?.message}
                        {...register('password')}
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-slate-300 mb-2">
                        Confirm password
                    </label>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        leftIcon={<Lock className="h-4 w-4" />}
                        error={errors.confirmPassword?.message}
                        {...register('confirmPassword')}
                    />
                </div>

                <div>
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Reset password
                    </Button>
                </div>
                
                <div className="text-center mt-4">
                    <Link href="/login" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to sign in
                    </Link>
                </div>
            </form>
        </div>
    );
}
