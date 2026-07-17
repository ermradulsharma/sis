import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Lead from '@/features/crm/models/lead.model';
import Project from '@/features/projects/models/project.model';
import Employee from '@/features/employees/models/employee.model';
import Department from '@/features/departments/models/department.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // 1. Leads Conversion Funnel
    const leadsByStatus = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const leadFunnel = leadsByStatus.map(l => ({ name: l._id, value: l.count }));

    // 2. Project Health
    const projectsByStatus = await Project.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const projectHealth = projectsByStatus.map(p => ({ name: p._id, value: p.count }));

    // 3. Workforce Distribution
    const employeesByDept = await Employee.aggregate([
      { $group: { _id: '$departmentId', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'dept'
        }
      },
      { $unwind: { path: '$dept', preserveNullAndEmptyArrays: true } },
      { $project: { name: { $ifNull: ['$dept.name', 'Unassigned'] }, value: '$count' } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        leadFunnel,
        projectHealth,
        workforceDistribution: employeesByDept
      }
    });
  } catch (error: any) {
    console.error('Error fetching business reports:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
