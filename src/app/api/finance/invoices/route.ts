import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Invoice from '@/features/finance/models/invoice.model';

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
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.invoiceNumber = { $regex: search, $options: 'i' };
    }

    const [invoices, total] = await Promise.all([
      Invoice.find(query)
        .populate('customerId', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Invoice.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: invoices,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
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

    // Auto generate invoice number if missing
    if (!body.invoiceNumber) {
      const count = await Invoice.countDocuments();
      const prefix = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`;
      body.invoiceNumber = `${prefix}-${String(count + 1).padStart(4, '0')}`;
    }

    const invoice = await Invoice.create(body);

    return NextResponse.json({ success: true, data: invoice }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
