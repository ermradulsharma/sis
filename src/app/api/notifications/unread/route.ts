import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Notification from '@/features/notifications/models/notification.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const count = await Notification.countDocuments({ 
      recipientId: session.user.id,
      read: false
    });

    return NextResponse.json({
      success: true,
      data: { count }
    });
  } catch (error: any) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
