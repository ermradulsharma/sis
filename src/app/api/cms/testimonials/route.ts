import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Testimonial from '@/features/cms/models/testimonial.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    
    await dbConnect();
    
    const skip = (page - 1) * limit;
    
    const [testimonials, total] = await Promise.all([
      Testimonial.find({})
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Testimonial.countDocuments({})
    ]);

    return NextResponse.json({
      success: true,
      data: testimonials,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
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
    
    const testimonial = await Testimonial.create(body);

    return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
