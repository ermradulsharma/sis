import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Role from '@/features/roles/models/role.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'roles.view')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    
    await dbConnect();
    
    // Create query
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    
    const [roles, total] = await Promise.all([
      Role.find(query)
        .sort({ isSystem: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Role.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: roles,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
