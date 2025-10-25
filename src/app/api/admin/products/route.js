import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/middleware/auth';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const formData = await req.json();
    const { 
      title, 
      description, 
      price, 
      mrp, 
      category, 
      brand, 
      stock,
      images,
      variants,
      ingredients,
      specifications,
      visibility 
    } = formData;

    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Upload images to Cloudinary
    const uploadedImages = [];
    for (const image of images) {
      if (image.startsWith('')) {
        const uploaded = await uploadImage(image, 'products');
        uploadedImages.push(uploaded);
      }
    }

    const discountPercent = Math.round(((mrp - price) / mrp) * 100);

    const product = await Product.create({
      title,
      slug,
      description,
      price,
      mrp,
      discountPercent,
      category,
      brand,
      stock,
      images: uploadedImages,
      variants: variants || [],
      ingredients,
      specifications,
      visibility: visibility !== undefined ? visibility : true
    });

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}


 
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const visibility = searchParams.get('visibility') || '';

    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (visibility === 'visible') {
      query.visibility = true;
    } else if (visibility === 'hidden') {
      query.visibility = false;
    }

    // Fetch products
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        hasMore: page < totalPages
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products' 
    }, { status: 500 });
  }
}
