import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { requireAdmin } from '@/middleware/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { name, description, image, icon } = await req.json();

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    let uploadedImage = null;
    if (image && image.startsWith('')) {
      uploadedImage = await uploadImage(image, 'categories');
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image: uploadedImage,
      icon,
      active: true
    });

    return NextResponse.json({
      success: true,
      category
    });

  } catch (error) {
    console.error('Create category error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
