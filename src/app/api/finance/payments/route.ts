import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Payment from '@/features/finance/models/payment.model';
import Invoice from '@/features/finance/models/invoice.model';
import { hasPermission } from '@/config/permissions';
import { createNotification } from '@/lib/notifications';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role?.permissions || [], 'finance:invoices:read')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const invoiceId = searchParams.get('invoiceId');
    const customerId = searchParams.get('customerId');
    
    await dbConnect();
    
    const query: any = {};
    if (invoiceId) query.invoiceId = invoiceId;
    if (customerId) query.customerId = customerId;

    const skip = (page - 1) * limit;
    
    const [payments, total] = await Promise.all([
      Payment.find(query)
        .populate('invoiceId', 'invoiceNumber')
        .populate('customerId', 'name')
        .sort({ paymentDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: payments,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching payments:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role?.permissions || [], 'finance:invoices:write')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();
    
    const payment = await Payment.create({
      ...body,
      createdBy: session.user.id
    });

    // If an invoice is linked, update its status based on payments
    if (body.invoiceId) {
      const invoice = await Invoice.findById(body.invoiceId);
      if (invoice) {
        // Simple logic for MVP: any payment marks it as paid. 
        // In reality, you'd sum payments and compare to invoice amount.
        invoice.status = 'paid';
        await invoice.save();

        // Notify creator of invoice or admin
        await createNotification({
          recipientId: invoice.createdBy,
          title: 'Payment Received',
          message: `Payment of $${body.amount} received for Invoice ${invoice.invoiceNumber}`,
          type: 'success',
          linkUrl: '/finance/payments'
        });
      }
    }

    return NextResponse.json({ success: true, data: payment }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating payment:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
