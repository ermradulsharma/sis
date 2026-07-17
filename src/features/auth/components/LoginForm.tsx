'use client';

import Link from 'next/link';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from '@/stores/notification.store';
import { Mail, Lock } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl') || '/admin';
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: data.email,
                password: data.password,
            });

            if (result?.error) {
                toast.error('Login Failed', result.error);
            } else {
                toast.success('Login Successful', 'Welcome back to SIS ERP');
                router.push(callbackUrl);
                router.refresh(); // Ensure layout recalculates session
            }
        } catch (error) {
            toast.error('Login Error', 'An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold leading-9 tracking-tight text-white">
                Sign in to your account
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
                Enter your credentials to access the ERP system.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
                <div className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-slate-300 mb-2"
                        >
                            Email address
                        </label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            placeholder="admin@company.com"
                            leftIcon={<Mail className="h-4 w-4" />}
                            error={errors.email?.message}
                            {...register('email')}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium leading-6 text-slate-300 mb-2"
                        >
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            leftIcon={<Lock className="h-4 w-4" />}
                            error={errors.password?.message}
                            {...register('password')}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50 focus:ring-offset-slate-950"
                        />
                        <label htmlFor="remember-me" className="text-sm leading-6 text-slate-400">
                            Remember me
                        </label>
                    </div>

                    <div className="text-sm leading-6">
                        <Link href="/forgot-password" className="font-semibold text-indigo-400 hover:text-indigo-300">
                            Forgot password?
                        </Link>
                    </div>
                </div>

                <div>
                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Sign in
                    </Button>
                </div>
            </form>
        </div>
    );
}
