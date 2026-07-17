import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Opportunity from '@/features/crm/models/opportunity.model';
import { hasPermission } from '@/config/permissions';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'crm:opportunities:update')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();
    
    // Only allow updating certain fields (like stage) for now
    const updatableFields = ['stage', 'probability', 'value', 'expectedCloseDate'];
    const updateData: any = {};
    
    for (const key of updatableFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      }
    }

    const opportunity = await Opportunity.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!opportunity) {
      return NextResponse.json({ success: false, message: 'Opportunity not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: opportunity });
  } catch (error: any) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
