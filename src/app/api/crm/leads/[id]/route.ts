import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Lead from '@/features/crm/models/lead.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'crm:leads:read')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    const lead = await Lead.findById(id)
      .populate('assignedTo', 'firstName lastName email avatar')
      .lean();

    if (!lead) {
      return NextResponse.json({ success: false, message: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: lead });
  } catch (error: any) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
