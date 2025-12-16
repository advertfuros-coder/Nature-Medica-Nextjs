import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { requireAdmin } from '@/middleware/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

export const runtime = 'nodejs';


export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const formData = await req.json();
    const category = await Category.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Handle image update
    if (formData.image && formData.image.startsWith('')) {
      if (category.image?.publicId) {
        await deleteImage(category.image.publicId);
      }
      formData.image = await uploadImage(formData.image, 'categories');
    }

    // Update slug if name changed
    if (formData.name && formData.name !== category.name) {
      formData.slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    Object.assign(category, formData);
    await category.save();

    return NextResponse.json({
      success: true,
      category
    });

  } catch (error) {
    console.error('Update category error:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const category = await Category.findById(params.id);

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    if (category.image?.publicId) {
      await deleteImage(category.image.publicId);
    }

    await category.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error) {
    console.error('Delete category error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
