import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Banner from '@/models/Banner';
import { requireAdmin } from '@/middleware/auth';
import { uploadImage, deleteImage } from '@/lib/cloudinary';

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const formData = await req.json();
    const banner = await Banner.findById(params.id);

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    if (formData.image && formData.image.startsWith('')) {
      if (banner.image?.publicId) {
        await deleteImage(banner.image.publicId);
      }
      formData.image = await uploadImage(formData.image, 'banners');
    }

    Object.assign(banner, formData);
    await banner.save();

    return NextResponse.json({
      success: true,
      banner
    });

  } catch (error) {
    console.error('Update banner error:', error);
    return NextResponse.json(
      { error: 'Failed to update banner' },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const banner = await Banner.findById(params.id);

    if (!banner) {
      return NextResponse.json(
        { error: 'Banner not found' },
        { status: 404 }
      );
    }

    if (banner.image?.publicId) {
      await deleteImage(banner.image.publicId);
    }

    await banner.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Banner deleted successfully'
    });

  } catch (error) {
    console.error('Delete banner error:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
