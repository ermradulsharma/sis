import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';

// Import all models needed for dashboard metrics
import Customer from '@/features/crm/models/customer.model';
import Opportunity from '@/features/crm/models/opportunity.model';
import Project from '@/features/projects/models/project.model';
import Task from '@/features/projects/models/task.model';
import Invoice from '@/features/finance/models/invoice.model';
import Ticket from '@/features/services/models/ticket.model';
import Product from '@/features/products/models/product.model';
import LeaveRequest from '@/features/hr/models/leaveRequest.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Fetch aggregate data in parallel for speed
    const [
      totalCustomers,
      pipelineValueAggr,
      activeProjects,
      overdueTasks,
      unpaidInvoicesAggr,
      openTickets,
      lowStockProducts,
      pendingLeaveRequests
    ] = await Promise.all([
      Customer.countDocuments({ status: 'active' }),
      
      Opportunity.aggregate([
        { $match: { status: { $in: ['new', 'discovery', 'proposal', 'negotiation'] } } },
        { $group: { _id: null, total: { $sum: '$expectedValue' } } }
      ]),

      Project.countDocuments({ status: 'active' }),
      
      Task.countDocuments({ 
        status: { $ne: 'done' }, 
        dueDate: { $lt: new Date() } 
      }),

      Invoice.aggregate([
        { $match: { status: { $in: ['sent', 'overdue'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),

      Ticket.countDocuments({ status: { $in: ['open', 'pending'] } }),

      Product.aggregate([
        { $match: { $expr: { $lte: ['$stockQuantity', '$minStockLevel'] } } },
        { $count: 'count' }
      ]),

      LeaveRequest.countDocuments({ status: 'pending' })
    ]);

    // Financial Chart Data (Last 6 Months Revenue - Mocked dynamically for MVP)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const revenueData = months.map(month => ({
      name: month,
      revenue: Math.floor(Math.random() * 50000) + 10000,
      expenses: Math.floor(Math.random() * 30000) + 5000,
    }));

    // CRM Funnel Data
    const pipelineData = [
      { name: 'New Leads', value: 40 },
      { name: 'Discovery', value: 30 },
      { name: 'Proposal', value: 20 },
      { name: 'Negotiation', value: 10 },
      { name: 'Closed Won', value: 5 },
    ];

    return NextResponse.json({
      success: true,
      data: {
        metrics: {
          totalCustomers,
          pipelineValue: pipelineValueAggr[0]?.total || 0,
          activeProjects,
          overdueTasks,
          outstandingInvoices: unpaidInvoicesAggr[0]?.total || 0,
          openTickets,
          lowStockItems: lowStockProducts[0]?.count || 0,
          pendingLeaves: pendingLeaveRequests
        },
        charts: {
          revenue: revenueData,
          pipeline: pipelineData
        }
      }
    });

  } catch (error: any) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
