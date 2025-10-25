import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/middleware/auth';
import { uploadMultipleImages } from '@/lib/cloudinary';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const data = await req.json();

    // Validate required fields
    if (!data.title || !data.price || !data.category) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, price, category' 
      }, { status: 400 });
    }

    // Upload images to Cloudinary
    let uploadedImages = [];
    if (data.images && data.images.length > 0) {
      try {
        uploadedImages = await uploadMultipleImages(data.images, 'products');
      } catch (uploadError) {
        return NextResponse.json({ 
          error: 'Failed to upload images' 
        }, { status: 400 });
      }
    }

    // Generate slug
    const slug = data.slug || data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    const finalSlug = existingProduct 
      ? `${slug}-${Date.now().toString().slice(-6)}` 
      : slug;

    // Calculate discount
    const discountPercent = data.mrp > data.price 
      ? Math.round(((data.mrp - data.price) / data.mrp) * 100) 
      : 0;

    // Create product
    const product = await Product.create({
      title: data.title,
      slug: finalSlug,
      description: data.description,
      images: uploadedImages,
      price: data.price,
      mrp: data.mrp || data.price,
      discountPercent,
      category: data.category,
      stock: data.stock || 0,
      sku: data.sku,
      weight: data.weight,
      dimensions: data.dimensions,
      tags: data.tags,
      ingredients: data.ingredients,
      specifications: data.specifications,
      variants: data.variants,
      visibility: data.visibility ?? true,
      featured: data.featured ?? false,
      seo: data.seo
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Product created successfully',
      product 
    });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to create product' 
    }, { status: 500 });
  }
}
