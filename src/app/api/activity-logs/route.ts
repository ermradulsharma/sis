import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import ActivityLog from '@/features/activity-logs/models/activity-log.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'core:activity-logs:read')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const action = searchParams.get('action') || '';
    const resource = searchParams.get('resource') || '';
    
    await dbConnect();
    
    const query: any = {};
    if (action) query.action = action;
    if (resource) query.resource = resource;

    const skip = (page - 1) * limit;
    
    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate('userId', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(query)
    ]);

    const formattedLogs = logs.map((log: any) => ({
      ...log,
      user: log.userId,
      userId: log.userId?._id,
    }));

    return NextResponse.json({
      success: true,
      data: formattedLogs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
