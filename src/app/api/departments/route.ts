import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Department from '@/features/departments/models/department.model';
import Employee from '@/features/employees/models/employee.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'core:departments:read')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    
    await dbConnect();
    
    const query: any = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const skip = (page - 1) * limit;
    
    const [departments, total] = await Promise.all([
      Department.find(query)
        .populate('managerId', 'firstName lastName')
        .populate('parentDepartmentId', 'name')
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Department.countDocuments(query)
    ]);

    // Format response
    const formattedDepartments = departments.map((d: any) => ({
      ...d,
      manager: d.managerId,
      parentDepartment: d.parentDepartmentId,
      managerId: d.managerId?._id,
      parentDepartmentId: d.parentDepartmentId?._id,
    }));

    // Attach employee counts (can be optimized with aggregation, but this is fine for basic phase 1)
    const deptIds = formattedDepartments.map(d => d._id);
    const counts = await Employee.aggregate([
      { $match: { departmentId: { $in: deptIds } } },
      { $group: { _id: '$departmentId', count: { $sum: 1 } } }
    ]);
    
    const countMap = counts.reduce((acc, curr) => {
      acc[curr._id.toString()] = curr.count;
      return acc;
    }, {});

    const finalDepartments = formattedDepartments.map(d => ({
      ...d,
      employeeCount: countMap[d._id.toString()] || 0
    }));

    return NextResponse.json({
      success: true,
      data: finalDepartments,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
