import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import File from '@/features/file-manager/models/file.model';
import { hasPermission } from '@/config/permissions';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const search = searchParams.get('search') || '';
    const folderId = searchParams.get('folderId') || null;
    
    await dbConnect();
    
    // By default, users can see files they uploaded or files shared globally
    const query: any = {
      $or: [
        { uploadedBy: session.user.id },
        { isPublic: true }
      ]
    };
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    if (folderId) {
      query.folderId = folderId;
    } else if (!search) {
      // Only show root level files if no search is active
      query.folderId = { $exists: false };
    }

    const skip = (page - 1) * limit;
    
    const [files, total] = await Promise.all([
      File.find(query)
        .populate('uploadedBy', 'firstName lastName')
        .sort({ isFolder: -1, name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      File.countDocuments(query)
    ]);

    const formattedFiles = files.map((f: any) => ({
      ...f,
      uploadedBy: f.uploadedBy?._id,
      uploadedByName: f.uploadedBy ? `${f.uploadedBy.firstName} ${f.uploadedBy.lastName}` : 'Unknown'
    }));

    return NextResponse.json({
      success: true,
      data: formattedFiles,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
