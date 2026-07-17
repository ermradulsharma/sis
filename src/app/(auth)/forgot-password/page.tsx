import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

export const metadata: Metadata = {
    title: 'Forgot Password',
    description: 'Reset your password for the ERP system',
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}
