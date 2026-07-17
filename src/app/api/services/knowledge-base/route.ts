import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import KnowledgeArticle from '@/features/services/models/knowledge.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const category = searchParams.get('category');

    await dbConnect();
    
    const query: any = {};
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    
    const [articles, total] = await Promise.all([
      KnowledgeArticle.find(query)
        .populate('authorId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      KnowledgeArticle.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: articles,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching knowledge articles:', error);
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
    
    const article = await KnowledgeArticle.create({
      ...body,
      authorId: session.user.id
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating knowledge article:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
