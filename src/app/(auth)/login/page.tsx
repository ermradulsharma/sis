import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata = {
    title: 'Sign In',
    description: 'Sign in to access your SIS ERP dashboard',
};

import { Suspense } from 'react';

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
