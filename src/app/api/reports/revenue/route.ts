import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Invoice from '@/features/finance/models/invoice.model';
import Expense from '@/features/finance/models/expense.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
    twelveMonthsAgo.setDate(1);

    // 1. Monthly Revenue (from Paid invoices)
    const revenueStats = await Invoice.aggregate([
      { 
        $match: { 
          status: 'paid',
          issueDate: { $gte: twelveMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { year: { $year: '$issueDate' }, month: { $month: '$issueDate' } },
          totalRevenue: { $sum: '$totalAmount' }
        }
      }
    ]);

    // 2. Monthly Expenses (from Approved/Reimbursed expenses)
    const expenseStats = await Expense.aggregate([
      { 
        $match: { 
          status: { $in: ['approved', 'reimbursed'] },
          expenseDate: { $gte: twelveMonthsAgo }
        } 
      },
      {
        $group: {
          _id: { year: { $year: '$expenseDate' }, month: { $month: '$expenseDate' } },
          totalExpense: { $sum: '$amount' }
        }
      }
    ]);

    // Combine into a 12-month array
    const monthlyData = [];
    const now = new Date();
    let ytdRevenue = 0;
    let ytdExpense = 0;

    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth() + 1;
      const monthName = targetDate.toLocaleString('default', { month: 'short' });

      const rev = revenueStats.find(r => r._id.year === year && r._id.month === month)?.totalRevenue || 0;
      const exp = expenseStats.find(e => e._id.year === year && e._id.month === month)?.totalExpense || 0;
      
      if (year === now.getFullYear()) {
        ytdRevenue += rev;
        ytdExpense += exp;
      }

      monthlyData.push({
        name: `${monthName} ${year}`,
        revenue: rev,
        expenses: exp,
        profit: rev - exp
      });
    }

    // 3. Top Unpaid Invoices
    const topUnpaid = await Invoice.find({ status: { $ne: 'paid' } })
      .populate('customerId', 'name')
      .sort({ totalAmount: -1 })
      .limit(5)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        monthlyData,
        kpis: {
          ytdRevenue,
          ytdExpense,
          netProfit: ytdRevenue - ytdExpense,
          profitMargin: ytdRevenue > 0 ? ((ytdRevenue - ytdExpense) / ytdRevenue) * 100 : 0
        },
        topUnpaid
      }
    });
  } catch (error: any) {
    console.error('Error fetching revenue reports:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
