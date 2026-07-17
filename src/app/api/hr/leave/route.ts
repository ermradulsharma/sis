import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import LeaveRequest from '@/features/hr/models/leaveRequest.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status') || '';
    const skip = (page - 1) * limit;

    const query: any = {};
    
    // If not HR/Admin, only see your own leave requests
    if (!hasPermission(session.user.role?.permissions || [], 'hr:leave:read')) {
      query.employeeId = session.user.id;
    }

    if (status) query.status = status;

    const [leaves, total] = await Promise.all([
      LeaveRequest.find(query)
        .populate('employeeId', 'firstName lastName avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      LeaveRequest.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: leaves,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching leaves:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    await dbConnect();

    // Force employeeId to be the requester
    body.employeeId = session.user.id;
    body.status = 'pending';

    const leave = await LeaveRequest.create(body);

    return NextResponse.json({ success: true, data: leave }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating leave:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
