import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Payroll from '@/features/hr/models/payroll.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const status = searchParams.get('status');

    await dbConnect();
    
    const query: any = {};
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    
    const [payrolls, total] = await Promise.all([
      Payroll.find(query)
        .populate('employeeId', 'firstName lastName employeeId')
        .sort({ year: -1, month: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Payroll.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: payrolls,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching payroll:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
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
    
    // Ensure netPay is calculated if not provided
    if (body.netPay === undefined) {
      body.netPay = (body.basicSalary || 0) + (body.allowances || 0) - (body.deductions || 0);
    }

    const payroll = await Payroll.create(body);

    return NextResponse.json({ success: true, data: payroll }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating payroll:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
