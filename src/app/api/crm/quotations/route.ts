import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Quotation from '@/features/crm/models/quotation.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'crm:quotations:read')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const opportunityId = searchParams.get('opportunityId') || '';
    
    await dbConnect();
    
    const query: any = {};
    if (status) query.status = status;
    if (opportunityId) query.opportunityId = opportunityId;
    
    if (search) {
      query.quotationNumber = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    
    const [quotations, total] = await Promise.all([
      Quotation.find(query)
        .populate({
          path: 'opportunityId',
          select: 'title customerId',
          populate: { path: 'customerId', select: 'name' }
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Quotation.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: quotations,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'crm:quotations:create')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    
    // Auto-calculate totals before saving
    const items = body.items || [];
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);
    const tax = body.tax || 0;
    const totalAmount = subtotal + tax;

    await dbConnect();
    
    // Generate unique quotation number (Q-YYYYMMDD-XXXX)
    const count = await Quotation.countDocuments();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const quotationNumber = `Q-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;
    
    const quotation = await Quotation.create({
      ...body,
      quotationNumber,
      subtotal,
      totalAmount,
    });

    return NextResponse.json({ success: true, data: quotation }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating quotation:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
