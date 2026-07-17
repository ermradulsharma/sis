import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Contact from '@/features/cms/models/contact.model';

/**
 * Public-facing contact form endpoint.
 * Accepts submissions without authentication so visitors on the
 * marketing site can send inquiries that land in the admin CMS inbox.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    await dbConnect();

    await Contact.create({
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      subject: body.subject?.trim() || 'Website Inquiry',
      message: body.message.trim(),
      status: 'new',
    });

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Public contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
