import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import FollowUp from '@/features/crm/models/follow-up.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'crm:follow-ups:read')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const entityType = searchParams.get('entityType') || '';
    const entityId = searchParams.get('entityId') || '';
    
    await dbConnect();
    
    const query: any = {};
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;

    const skip = (page - 1) * limit;
    
    const [followUps, total] = await Promise.all([
      FollowUp.find(query)
        .populate('assignedTo', 'firstName lastName avatar')
        .sort({ date: -1 }) // Sort newest first
        .skip(skip)
        .limit(limit)
        .lean(),
      FollowUp.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: followUps,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching follow-ups:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'crm:follow-ups:create')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();
    
    // Auto-assign to current user if not provided
    if (!body.assignedTo) {
      body.assignedTo = session.user.id;
    }
    
    const followUp = await FollowUp.create(body);
    const populated = await FollowUp.findById(followUp._id).populate('assignedTo', 'firstName lastName avatar').lean();

    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating follow-up:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
