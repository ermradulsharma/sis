import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Blog from '@/features/cms/models/blog.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    // In a real app, you might allow public reading for blogs via a separate API.
    // For admin dashboard, we require auth.
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
    
    const [blogs, total] = await Promise.all([
      Blog.find(query)
        .populate('author', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Blog.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: blogs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching blogs:', error);
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
    
    // Auto-generate slug if not provided
    if (!body.slug && body.title) {
      body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const blog = await Blog.create({
      ...body,
      author: session.user.id
    });

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
