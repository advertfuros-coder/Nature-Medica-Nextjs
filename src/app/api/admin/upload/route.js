import { NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    await requireAdmin(req);

    const formData = await req.formData();
    const files = formData.getAll('files');
    const singleFile = formData.get('file');
    const productId = formData.get('productId');

    const allFiles = files.length > 0 ? files : (singleFile ? [singleFile] : []);

    if (allFiles.length === 0) {
      return NextResponse.json({ error: 'No files provided for upload' }, { status: 400 });
    }

    const uploadedImages = [];

    for (const file of allFiles) {
      if (typeof file === 'string') continue;
      const buffer = Buffer.from(await file.arrayBuffer());
      const rawName = file.name || `product-${Date.now()}.jpg`;
      const cleanName = rawName.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFilename = `${Date.now()}-${cleanName}`;

      let uploadedResult = null;

      // Try Cloudinary if credentials are configured
      if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_SECRET) {
        try {
          const { uploadImageBuffer } = await import('@/lib/cloudinary');
          const res = await uploadImageBuffer(buffer, cleanName, 'products');
          if (res?.url) {
            uploadedResult = {
              url: res.url,
              publicId: res.publicId || uniqueFilename,
              altText: ''
            };
          }
        } catch (cloudErr) {
          console.error('Cloudinary upload fallback to local storage:', cloudErr.message);
        }
      }

      // Fallback: save to public/uploads/products/
      if (!uploadedResult) {
        const publicUploadsDir = join(process.cwd(), 'public', 'uploads', 'products');
        const filePath = join(publicUploadsDir, uniqueFilename);
        await writeFile(filePath, buffer);
        uploadedResult = {
          url: `/uploads/products/${uniqueFilename}`,
          publicId: uniqueFilename,
          altText: ''
        };
      }

      uploadedImages.push(uploadedResult);
    }

    // If productId is provided, persist these images to the product document in DB
    if (productId && uploadedImages.length > 0) {
      try {
        await connectDB();
        const product = await Product.findById(productId);
        if (product) {
          const currentImages = Array.isArray(product.images) ? product.images : [];
          const hasExistingImages = currentImages.length > 0;

          uploadedImages.forEach((img, idx) => {
            img.isPrimary = !hasExistingImages && idx === 0;
            currentImages.push(img);
          });

          product.images = currentImages;
          if (!product.featuredImage && currentImages[0]?.url) {
            product.featuredImage = currentImages[0].url;
          }
          await product.save();
        }
      } catch (dbErr) {
        console.error('Error attaching uploaded images to product in DB:', dbErr.message);
      }
    }

    return NextResponse.json({
      success: true,
      images: uploadedImages
    });

  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json(
      { error: error.message || 'Image upload failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await requireAdmin(req);
    const { url, publicId, productId } = await req.json();

    // 1. Delete from Cloudinary if publicId exists
    if (publicId && !publicId.startsWith('17')) {
      try {
        const { deleteImage } = await import('@/lib/cloudinary');
        await deleteImage(publicId);
      } catch (err) {
        console.error('Failed to delete image from Cloudinary:', err);
      }
    }

    // 2. If productId provided, remove from product document in DB immediately
    if (productId) {
      await connectDB();
      const product = await Product.findById(productId);
      if (product && Array.isArray(product.images)) {
        product.images = product.images.filter(img => {
          const imgUrl = typeof img === 'string' ? img : img?.url;
          const imgPub = typeof img === 'object' ? img?.publicId : '';
          return imgUrl !== url && (!publicId || imgPub !== publicId);
        });

        // Ensure at least first image is marked primary
        if (product.images.length > 0) {
          const hasPrimary = product.images.some(img => img.isPrimary);
          if (!hasPrimary) {
            product.images[0].isPrimary = true;
          }
          product.featuredImage = product.images[0].url;
        } else {
          product.featuredImage = '';
        }

        await product.save();
      }
    }

    return NextResponse.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete image' },
      { status: 500 }
    );
  }
}

