import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Attendance from '@/features/hr/models/attendance.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Get today's attendance for the logged-in user
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      employeeId: session.user.id,
      date: today
    }).lean();

    return NextResponse.json({ success: true, data: attendance });
  } catch (error: any) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json(); // { action: 'clock-in' | 'clock-out' }
    await dbConnect();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const now = new Date();

    if (body.action === 'clock-in') {
      const existing = await Attendance.findOne({ employeeId: session.user.id, date: today });
      if (existing) {
        return NextResponse.json({ success: false, message: 'Already clocked in today' }, { status: 400 });
      }

      const attendance = await Attendance.create({
        employeeId: session.user.id,
        date: today,
        clockIn: now
      });
      return NextResponse.json({ success: true, data: attendance });
    } 
    
    if (body.action === 'clock-out') {
      const attendance = await Attendance.findOneAndUpdate(
        { employeeId: session.user.id, date: today, clockOut: { $exists: false } },
        { $set: { clockOut: now } },
        { new: true }
      );
      
      if (!attendance) {
        return NextResponse.json({ success: false, message: 'No active clock-in found for today' }, { status: 400 });
      }
      return NextResponse.json({ success: true, data: attendance });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating attendance:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
