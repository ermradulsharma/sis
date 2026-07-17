import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import CompanySettings from '@/features/company-settings/models/company-settings.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'core:settings:read')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    await dbConnect();
    
    // There should only be one company settings document
    let settings = await CompanySettings.findOne().lean();

    // If it doesn't exist, create a default one (usually handled by seed, but good fallback)
    if (!settings) {
      settings = await CompanySettings.create({
        companyName: 'SIS ERP',
        contactEmail: 'admin@sis-erp.com',
        timezone: 'UTC',
        currency: 'USD',
        dateFormat: 'MM/DD/YYYY'
      });
    }

    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error: any) {
    console.error('Error fetching company settings:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.role?.permissions) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.role.permissions, 'core:settings:write')) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    
    await dbConnect();
    
    const settings = await CompanySettings.findOneAndUpdate(
      {}, // Empty filter matches the first document
      { $set: body },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    return NextResponse.json({
      success: true,
      data: settings,
      message: 'Company settings updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating company settings:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
