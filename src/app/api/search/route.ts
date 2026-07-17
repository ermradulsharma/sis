import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';

import Customer from '@/features/crm/models/customer.model';
import Project from '@/features/projects/models/project.model';
import Product from '@/features/products/models/product.model';
import Invoice from '@/features/finance/models/invoice.model';

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    
    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, data: [] });
    }

    await dbConnect();
    const searchRegex = new RegExp(query, 'i');
    
    // Search across multiple collections in parallel
    const [customers, projects, products, invoices] = await Promise.all([
      Customer.find({ $or: [{ name: searchRegex }, { email: searchRegex }, { company: searchRegex }] })
        .limit(5).select('_id name email type').lean(),
      Project.find({ name: searchRegex })
        .limit(5).select('_id name status').lean(),
      Product.find({ $or: [{ name: searchRegex }, { sku: searchRegex }] })
        .limit(5).select('_id name sku price').lean(),
      Invoice.find({ invoiceNumber: searchRegex })
        .limit(5).select('_id invoiceNumber amount status').lean(),
    ]);

    // Format results into a unified structure
    const results = [
      ...customers.map(c => ({
        id: c._id,
        title: c.name,
        subtitle: c.email || 'Customer',
        type: 'customer',
        url: `/crm/customers/${c._id}`
      })),
      ...projects.map(p => ({
        id: p._id,
        title: p.name,
        subtitle: p.status,
        type: 'project',
        url: `/projects/${p._id}`
      })),
      ...products.map(p => ({
        id: p._id,
        title: p.name,
        subtitle: `SKU: ${p.sku} - $${p.price}`,
        type: 'product',
        url: `/products`
      })),
      ...invoices.map(i => ({
        id: i._id,
        title: i.invoiceNumber,
        subtitle: `$${i.amount} - ${i.status}`,
        type: 'invoice',
        url: `/finance`
      }))
    ];

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    console.error('Error searching:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
