import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export async function POST(req) {
  try {
    await connectDB();

    // Drop the sku_1 index if it exists
    try {
      await Product.collection.dropIndex('sku_1');
      console.log('Successfully dropped sku_1 index');
    } catch (error) {
      if (error.code === 27) {
        console.log('Index sku_1 does not exist, skipping...');
      } else {
        throw error;
      }
    }

    // Ensure proper indexes exist
    await Product.collection.createIndexes([
      { key: { slug: 1 }, unique: true, name: 'slug_1' },
      { 
        key: { title: 'text', description: 'text' }, 
        name: 'title_text_description_text' 
      }
    ]);

    return NextResponse.json({
      success: true,
      message: 'Indexes fixed successfully'
    });

  } catch (error) {
    console.error('Fix indexes error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
