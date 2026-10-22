import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { requireAdmin } from '@/middleware/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

export const runtime = 'nodejs';

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const formData = await req.json();
    const banner = await Banner.findById(id);

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    let uploadedImage = formData.image;
    // Check if a new base64 image is passed
    if (typeof formData.image === 'string' && formData.image.startsWith('data:')) {
      if (banner.image?.publicId) {
        try {
          await deleteImage(banner.image.publicId);
        } catch (e) {
          console.warn('Failed to delete old image from Cloudinary:', e.message);
        }
      }
      uploadedImage = await uploadImage(formData.image, 'banners');
    } else if (typeof formData.image === 'object' && formData.image?.url?.startsWith('data:')) {
      if (banner.image?.publicId) {
        try {
          await deleteImage(banner.image.publicId);
        } catch (e) {
          console.warn('Failed to delete old image from Cloudinary:', e.message);
        }
      }
      uploadedImage = await uploadImage(formData.image.url, 'banners');
    }

    if (uploadedImage) {
      banner.image = uploadedImage;
    }

    if (formData.type !== undefined) banner.type = formData.type;
    if (formData.title !== undefined) banner.title = formData.title;
    if (formData.subtitle !== undefined) banner.subtitle = formData.subtitle;
    if (formData.badge !== undefined) banner.badge = formData.badge;
    if (formData.tagline !== undefined) banner.tagline = formData.tagline;
    if (formData.categoryName !== undefined) banner.categoryName = formData.categoryName;
    if (formData.link !== undefined) banner.link = formData.link;
    if (formData.order !== undefined) banner.order = Number(formData.order) || 0;
    if (formData.active !== undefined) banner.active = Boolean(formData.active);

    await banner.save();

    return NextResponse.json({
      success: true,
      banner
    });

  } catch (error) {
    console.error('Update banner error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const banner = await Banner.findById(id);

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    if (banner.image?.publicId) {
      try {
        await deleteImage(banner.image.publicId);
      } catch (e) {
        console.warn('Failed to delete image from Cloudinary:', e.message);
      }
    }

    await banner.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully'
    });

  } catch (error) {
    console.error('Delete banner error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
