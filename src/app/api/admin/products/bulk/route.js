import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/middleware/auth';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { action, productIds } = await req.json();

    if (!action || !productIds || productIds.length === 0) {
      return NextResponse.json({ 
        error: 'Missing action or product IDs' 
      }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'delete':
        result = await Product.deleteMany({ _id: { $in: productIds } });
        break;

      case 'show':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { visibility: true }
        );
        break;

      case 'hide':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { visibility: false }
        );
        break;

      case 'feature':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { featured: true }
        );
        break;

      case 'unfeature':
        result = await Product.updateMany(
          { _id: { $in: productIds } },
          { featured: false }
        );
        break;

      default:
        return NextResponse.json({ 
          error: 'Invalid action' 
        }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Bulk ${action} completed`,
      modifiedCount: result.modifiedCount || result.deletedCount
    });

  } catch (error) {
    console.error('Bulk action error:', error);
    return NextResponse.json({ 
      error: 'Failed to perform bulk action' 
    }, { status: 500 });
  }
}
