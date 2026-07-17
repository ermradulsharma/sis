import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Task from '@/features/projects/models/task.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'tasks:read')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';
    const skip = (page - 1) * limit;

    const query: any = {};
    
    // Optional filtering by projectId
    const projectId = searchParams.get('projectId');
    if (projectId) {
      query.projectId = projectId;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('assigneeId', 'firstName lastName avatar')
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Task.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'tasks:create')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    await dbConnect();

    // Set order to be the last item in the status column for the project
    const lastTask = await Task.findOne({ projectId: body.projectId, status: body.status || 'todo' })
      .sort({ order: -1 })
      .lean();
    
    body.order = lastTask ? lastTask.order + 1024 : 1024;

    const task = await Task.create(body);

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating task:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
