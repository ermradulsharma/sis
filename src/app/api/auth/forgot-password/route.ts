import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/features/users/models/user.model';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { success: false, message: 'Email is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // 1. Check if the user exists
        const user = await User.findOne({ email, status: 'active' });

        if (!user) {
            // Security best practice: Don't reveal if the email exists or not
            return NextResponse.json({ 
                success: true, 
                message: 'If an account with that email exists, we sent a password reset link.' 
            });
        }

        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
        
        // Import our new mail utility dynamically or at the top
        const { sendPasswordResetEmail } = require('@/lib/mail');
        await sendPasswordResetEmail(user.email, resetLink);

        console.log(`[Email Sent] Password reset link emailed to ${email}`);

        return NextResponse.json({ 
            success: true, 
            message: 'If an account with that email exists, we sent a password reset link.'
        });

    } catch (error: any) {
        console.error('Forgot password error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
