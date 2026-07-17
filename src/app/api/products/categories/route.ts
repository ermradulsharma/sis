import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Category from '@/features/products/models/category.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const isActive = searchParams.get('isActive');

    await dbConnect();
    
    const query: any = {};
    if (isActive !== null) query.isActive = isActive === 'true';

    const skip = (page - 1) * limit;
    
    const [categories, total] = await Promise.all([
      Category.find(query).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      Category.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: categories,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
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
    
    const category = await Category.create(body);

    return NextResponse.json({ success: true, data: category }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
