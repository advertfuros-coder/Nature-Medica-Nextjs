import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/middleware/auth';
import { uploadImage } from '@/lib/cloudinary';

export const runtime = 'nodejs';


export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectDB();

    const contentType = req.headers.get('content-type') || '';
    let payload = {};

    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else {
      const formData = await req.formData();
      payload = {
        title: formData.get('title'),
        tagline: formData.get('tagline') || '',
        slug: formData.get('slug'),
        description: formData.get('description'),
        brand: formData.get('brand') || 'Nature Medica',
        category: formData.get('category'),
        price: parseFloat(formData.get('price')),
        mrp: parseFloat(formData.get('mrp')),
        costPerItem: parseFloat(formData.get('costPerItem') || 0),
        gstSlab: parseFloat(formData.get('gstSlab') || 18),
        hsnCode: formData.get('hsnCode') || '3304',
        stock: parseInt(formData.get('stock') || 0),
        lowStockThreshold: parseInt(formData.get('lowStockThreshold') || 5),
        sku: formData.get('sku') || '',
        netQuantity: formData.get('netQuantity') || '30 ml',
        shelfLife: formData.get('shelfLife') || '24 Months',
        weight: parseFloat(formData.get('weight') || 150),
        isCodAvailable: formData.get('isCodAvailable') !== 'false',
        isFragile: formData.get('isFragile') === 'true',
        isReturnable: formData.get('isReturnable') !== 'false',
        visibility: formData.get('visibility') !== 'false',
        isBestSeller: formData.get('isBestSeller') === 'true',
        isNewArrival: formData.get('isNewArrival') === 'true',
        isFeatured: formData.get('isFeatured') === 'true',
        customBadge: formData.get('customBadge') || '',
        ingredients: formData.get('ingredients') || '',
        precautions: formData.get('precautions') || '',
        dimensions: JSON.parse(formData.get('dimensions') || '{"length":10,"width":5,"height":5}'),
        specifications: JSON.parse(formData.get('specifications') || '[]'),
        variants: JSON.parse(formData.get('variants') || '[]'),
        seo: JSON.parse(formData.get('seo') || '{}'),
        images: JSON.parse(formData.get('images') || '[]'),
        skinTypes: JSON.parse(formData.get('skinTypes') || '[]'),
        skinConcerns: JSON.parse(formData.get('skinConcerns') || '[]'),
        keyActives: JSON.parse(formData.get('keyActives') || '[]'),
        usageTiming: JSON.parse(formData.get('usageTiming') || '[]'),
        howToUseSteps: JSON.parse(formData.get('howToUseSteps') || '[]'),
        trustBadges: JSON.parse(formData.get('trustBadges') || '[]'),
        faqs: JSON.parse(formData.get('faqs') || '[]'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
      };
    }

    if (!payload.title || payload.price === undefined || !payload.category) {
      return NextResponse.json({ error: 'Title, price, and category are required' }, { status: 400 });
    }

    // Generate unique slug
    let baseSlug = (payload.slug || payload.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    let finalSlug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter++}`;
    }

    // Process images
    let uploadedImages = [];
    if (Array.isArray(payload.images) && payload.images.length > 0) {
      for (const img of payload.images) {
        if (typeof img === 'string') {
          if (img.startsWith('data:') && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME) {
            try {
              const uploaded = await uploadImage(img, 'products');
              uploadedImages.push(uploaded);
            } catch (err) {
              uploadedImages.push({ url: img, publicId: '' });
            }
          } else {
            uploadedImages.push({ url: img, publicId: '' });
          }
        } else if (img && typeof img === 'object' && img.url) {
          uploadedImages.push(img);
        }
      }
    }

    // Ensure primary image at index 0
    const primaryIdx = uploadedImages.findIndex(img => img.isPrimary === true);
    if (primaryIdx > 0) {
      const [primary] = uploadedImages.splice(primaryIdx, 1);
      uploadedImages.unshift(primary);
    }
    if (uploadedImages.length > 0) {
      uploadedImages.forEach((img, idx) => {
        img.isPrimary = idx === 0;
      });
    }

    const price = parseFloat(payload.price);
    const mrp = payload.mrp ? parseFloat(payload.mrp) : price;
    const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    const product = await Product.create({
      title: payload.title,
      tagline: payload.tagline || '',
      slug: finalSlug,
      description: payload.description || '',
      brand: payload.brand || 'Nature Medica',
      category: payload.category,
      price,
      mrp,
      costPerItem: payload.costPerItem ? parseFloat(payload.costPerItem) : 0,
      discountPercent,
      gstSlab: payload.gstSlab ? parseFloat(payload.gstSlab) : 18,
      hsnCode: payload.hsnCode || '3304',
      stock: payload.stock ? parseInt(payload.stock) : 0,
      lowStockThreshold: payload.lowStockThreshold ? parseInt(payload.lowStockThreshold) : 5,
      sku: payload.sku || '',
      netQuantity: payload.netQuantity || '30 ml',
      shelfLife: payload.shelfLife || '24 Months',
      weight: payload.weight ? parseFloat(payload.weight) : 150,
      dimensions: payload.dimensions || { length: 10, width: 5, height: 5 },
      isCodAvailable: payload.isCodAvailable !== false,
      isFragile: payload.isFragile === true,
      isReturnable: payload.isReturnable !== false,
      images: uploadedImages,
      featuredImage: uploadedImages[0]?.url || '',
      variants: payload.variants || [],
      specifications: payload.specifications || [],
      skinTypes: payload.skinTypes || [],
      skinConcerns: payload.skinConcerns || [],
      keyActives: payload.keyActives || [],
      ingredients: payload.ingredients || '',
      usageTiming: payload.usageTiming || [],
      howToUseSteps: payload.howToUseSteps || [],
      precautions: payload.precautions || 'For external use only. Patch test recommended.',
      trustBadges: payload.trustBadges || [],
      faqs: payload.faqs || [],
      visibility: payload.visibility !== false,
      isBestSeller: payload.isBestSeller === true,
      isNewArrival: payload.isNewArrival === true,
      isFeatured: payload.isFeatured === true,
      customBadge: payload.customBadge || '',
      tags: payload.tags || [],
      seo: payload.seo || {},
    });

    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'page');
      revalidatePath('/products', 'page');
    } catch (e) {}

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
