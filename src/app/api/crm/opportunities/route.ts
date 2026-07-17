import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Opportunity from '@/features/crm/models/opportunity.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'crm:opportunities:read')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || '';
    const stage = searchParams.get('stage') || '';
    const customerId = searchParams.get('customerId') || '';
    const assignedTo = searchParams.get('assignedTo') || '';
    
    await dbConnect();
    
    const query: any = {};
    if (stage) query.stage = stage;
    if (customerId) query.customerId = customerId;
    if (assignedTo) query.assignedTo = assignedTo;
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    
    const [opportunities, total] = await Promise.all([
      Opportunity.find(query)
        .populate('customerId', 'name')
        .populate('leadId', 'firstName lastName companyName')
        .populate('assignedTo', 'firstName lastName email avatar')
        .sort({ expectedCloseDate: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Opportunity.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: opportunities,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'crm:opportunities:create')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();
    
    const opportunity = await Opportunity.create(body);

    return NextResponse.json({ success: true, data: opportunity }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
