import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Employee from '@/features/employees/models/employee.model';
import User from '@/features/users/models/user.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'core:employees:read')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const departmentId = searchParams.get('departmentId') || '';
    const status = searchParams.get('status') || '';
    
    await dbConnect();
    
    const query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } }
      ];
    }
    if (departmentId) query.departmentId = departmentId;
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    
    const [employees, total] = await Promise.all([
      Employee.find(query)
        .populate('departmentId', 'name')
        .populate('designationId', 'title')
        .populate('managerId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Employee.countDocuments(query)
    ]);

    const formattedEmployees = employees.map((e: any) => ({
      ...e,
      department: e.departmentId,
      designation: e.designationId,
      manager: e.managerId,
      departmentId: e.departmentId?._id,
      designationId: e.designationId?._id,
      managerId: e.managerId?._id,
    }));

    return NextResponse.json({
      success: true,
      data: formattedEmployees,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
