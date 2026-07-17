import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Notification from '@/features/notifications/models/notification.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const type = searchParams.get('type') || '';
    
    await dbConnect();
    
    // Users can only read their own notifications
    const query: any = { recipientId: session.user.id };
    if (type) query.type = type;

    const skip = (page - 1) * limit;
    
    const [notifications, total] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: notifications,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { notificationIds, read } = body;
    
    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json({ success: false, message: 'Invalid payload' }, { status: 400 });
    }

    await dbConnect();
    
    await Notification.updateMany(
      { _id: { $in: notificationIds }, recipientId: session.user.id },
      { $set: { read, readAt: read ? new Date() : null } }
    );

    return NextResponse.json({
      success: true,
      message: 'Notifications updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating notifications:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
