import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/middleware/auth';
import { uploadMultipleBuffers, deleteImage } from '@/lib/cloudinary';

export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const formData = await req.formData();

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Extract form fields
    const title = formData.get('title');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const mrp = parseFloat(formData.get('mrp'));
    const category = formData.get('category');
    const stock = parseInt(formData.get('stock'));
    const sku = formData.get('sku');
    const weight = parseFloat(formData.get('weight')) || 0;
    const tags = formData.get('tags')?.split(',').map(t => t.trim()) || [];
    const ingredients = formData.get('ingredients');
    const visibility = formData.get('visibility') === 'true';
    const featured = formData.get('featured') === 'true';

    // Parse JSON fields
    const dimensions = JSON.parse(formData.get('dimensions') || '{}');
    const specifications = JSON.parse(formData.get('specifications') || '[]');
    const variants = JSON.parse(formData.get('variants') || '[]');
    const seo = JSON.parse(formData.get('seo') || '{}');
    const existingImages = JSON.parse(formData.get('existingImages') || '[]');

    // Handle new image uploads
    const newImages = [];
    const files = formData.getAll('newImages');
    
    if (files.length > 0) {
      const buffers = [];
      for (const file of files) {
        if (file.size > 0) {
          const bytes = await file.arrayBuffer();
          buffers.push({
            buffer: Buffer.from(bytes),
            filename: file.name
          });
        }
      }

      if (buffers.length > 0) {
        const uploaded = await uploadMultipleBuffers(buffers, 'products');
        newImages.push(...uploaded);
      }
    }

    // Combine images
    const allImages = [...existingImages, ...newImages];

    // Generate slug
    const slug = formData.get('slug') || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Calculate discount
    const discountPercent = mrp > price 
      ? Math.round(((mrp - price) / mrp) * 100) 
      : 0;

    // Update product
    product.title = title;
    product.slug = slug;
    product.description = description;
    product.images = allImages;
    product.price = price;
    product.mrp = mrp;
    product.discountPercent = discountPercent;
    product.category = category;
    product.stock = stock;
    product.sku = sku;
    product.weight = weight;
    product.dimensions = dimensions;
    product.tags = tags;
    product.ingredients = ingredients;
    product.specifications = specifications;
    product.variants = variants;
    product.visibility = visibility;
    product.featured = featured;
    product.seo = seo;

    await product.save();

    return NextResponse.json({ 
      success: true, 
      message: 'Product updated successfully',
      product 
    });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ 
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const product = await Product.findById(params.id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete images
    if (product.images?.length > 0) {
      for (const image of product.images) {
        if (image.publicId) {
          await deleteImage(image.publicId);
        }
      }
    }

    await Product.findByIdAndDelete(params.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted' 
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
