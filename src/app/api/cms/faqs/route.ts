import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import FAQ from '@/features/cms/models/faq.model';

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
    
    const [faqs, total] = await Promise.all([
      FAQ.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      FAQ.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: faqs,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching faqs:', error);
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
    
    const faq = await FAQ.create(body);

    return NextResponse.json({ success: true, data: faq }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating faq:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
