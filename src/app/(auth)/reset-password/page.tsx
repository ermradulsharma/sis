import { Suspense } from 'react';
import { Metadata } from 'next';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Set a new password for the ERP system',
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div></div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
