'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from '@/stores/notification.store';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email }),
            });

            const result = await res.json();

            if (res.ok && result.success) {
                setIsSuccess(true);
                toast.success('Password reset link sent to your email.');
            } else {
                toast.error(result.message || 'Failed to send reset link.');
            }
        } catch (error) {
            toast.error('An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="w-full max-w-sm space-y-8 rounded-2xl bg-slate-900 p-8 shadow-xl ring-1 ring-slate-800">
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 mb-4">
                        <Mail className="h-6 w-6 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white">Check your email</h2>
                    <p className="mt-2 text-sm text-slate-400">
                        We sent a password reset link to your email address.
                    </p>
                </div>
                
                <div className="mt-8 text-center">
                    <Link href="/login" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to sign in
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-sm space-y-8 rounded-2xl bg-slate-900 p-8 shadow-xl ring-1 ring-slate-800">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-white">Reset password</h2>
                <p className="mt-2 text-sm text-slate-400">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-300 mb-2">
                        Email address
                    </label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@company.com"
                        leftIcon={<Mail className="h-4 w-4" />}
                        error={errors.email?.message}
                        {...register('email')}
                    />
                </div>

                <div>
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Send reset link
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
