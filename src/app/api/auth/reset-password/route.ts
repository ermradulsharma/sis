import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/features/users/models/user.model';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token, newPassword } = body;

        if (!token || !newPassword) {
            return NextResponse.json(
                { success: false, message: 'Token and new password are required' },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { success: false, message: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        await dbConnect();

        // 1. Hash the provided raw token to compare with the one in DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // 2. Find the user with this token and ensure it hasn't expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() },
            status: 'active',
        });

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired password reset token' },
                { status: 400 }
            );
        }

        // 3. Hash the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // 4. Clear the reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return NextResponse.json({ 
            success: true, 
            message: 'Password successfully updated' 
        });

    } catch (error: any) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
