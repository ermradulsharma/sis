import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Expense from '@/features/finance/models/expense.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role?.permissions || [], 'finance:expenses:read')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    
    await dbConnect();
    
    const query: any = {};
    if (category) query.category = category;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    
    const [expenses, total] = await Promise.all([
      Expense.find(query)
        .populate('incurredBy', 'name email')
        .sort({ expenseDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Expense.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: expenses,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role?.permissions || [], 'finance:expenses:write')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();
    
    const expense = await Expense.create({
      ...body,
      createdBy: session.user.id
    });

    return NextResponse.json({ success: true, data: expense }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating expense:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
