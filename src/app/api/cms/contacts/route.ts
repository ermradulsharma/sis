import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Contact from '@/features/cms/models/contact.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
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
    
    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: contacts,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Note: This endpoint could be public to receive messages from an external marketing site.
    // We are letting it be open (no auth check here, just basic validation).
    const body = await req.json();
    await dbConnect();
    
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 });
    }

    const contact = await Contact.create(body);

    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating contact:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
