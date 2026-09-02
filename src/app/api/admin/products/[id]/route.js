import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import { requireAdmin } from '@/middleware/auth';
import { uploadMultipleBuffers, deleteImage } from '@/lib/cloudinary';

export const runtime = 'nodejs';


export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectDB();

    const resolvedParams = await params;
    const id = resolvedParams?.id;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const contentType = req.headers.get('content-type') || '';
    let payload = {};
    let newImages = [];

    if (contentType.includes('application/json')) {
      payload = await req.json();
      
      // If new images provided as data URLs in JSON
      if (Array.isArray(payload.newImages) && payload.newImages.length > 0) {
        if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME) {
          try {
            const { uploadImage } = await import('@/lib/cloudinary');
            for (const imgStr of payload.newImages) {
              if (typeof imgStr === 'string' && imgStr.startsWith('data:')) {
                const uploaded = await uploadImage(imgStr, 'products');
                newImages.push(uploaded);
              }
            }
          } catch (uploadError) {
            console.error('❌ Cloudinary JSON upload error:', uploadError.message);
          }
        }
      }
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
        existingImages: JSON.parse(formData.get('existingImages') || '[]'),
        skinTypes: JSON.parse(formData.get('skinTypes') || '[]'),
        skinConcerns: JSON.parse(formData.get('skinConcerns') || '[]'),
        keyActives: JSON.parse(formData.get('keyActives') || '[]'),
        usageTiming: JSON.parse(formData.get('usageTiming') || '[]'),
        howToUseSteps: JSON.parse(formData.get('howToUseSteps') || '[]'),
        trustBadges: JSON.parse(formData.get('trustBadges') || '[]'),
        faqs: JSON.parse(formData.get('faqs') || '[]'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : [],
      };

      const files = formData.getAll('newImages');
      if (files.length > 0) {
        const buffers = [];
        for (const file of files) {
          if (file && file.size > 0 && typeof file.arrayBuffer === 'function') {
            const bytes = await file.arrayBuffer();
            buffers.push({ buffer: Buffer.from(bytes), filename: file.name });
          }
        }
        if (buffers.length > 0 && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_CLOUD_NAME) {
          try {
            const uploaded = await uploadMultipleBuffers(buffers, 'products');
            newImages.push(...uploaded);
          } catch (uploadError) {
            console.error('❌ Cloudinary buffer upload error:', uploadError.message);
          }
        }
      }
    }

    // Combine existing and new images
    const existingImages = payload.images || payload.existingImages || product.images || [];
    const allImages = [...existingImages, ...newImages];

    // Ensure primary image is at index 0
    const primaryIdx = allImages.findIndex(img => img.isPrimary === true);
    if (primaryIdx > 0) {
      const [primaryImg] = allImages.splice(primaryIdx, 1);
      allImages.unshift(primaryImg);
    }
    if (allImages.length > 0) {
      allImages.forEach((img, idx) => {
        img.isPrimary = idx === 0;
      });
    }

    // Slug calculation
    const title = payload.title || product.title;
    const slug = payload.slug || title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Price & Discount
    const price = payload.price !== undefined ? parseFloat(payload.price) : product.price;
    const mrp = payload.mrp !== undefined ? parseFloat(payload.mrp) : product.mrp;
    const discountPercent = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

    // Apply updates to product
    product.title = title;
    product.tagline = payload.tagline !== undefined ? payload.tagline : product.tagline;
    product.slug = slug;
    product.description = payload.description || product.description;
    product.brand = payload.brand || product.brand || 'Nature Medica';
    product.category = payload.category || product.category;
    product.price = price;
    product.mrp = mrp;
    product.costPerItem = payload.costPerItem !== undefined ? parseFloat(payload.costPerItem) : (product.costPerItem || 0);
    product.discountPercent = discountPercent;
    product.gstSlab = payload.gstSlab !== undefined ? parseFloat(payload.gstSlab) : (product.gstSlab || 18);
    product.hsnCode = payload.hsnCode || product.hsnCode || '3304';
    product.sku = payload.sku !== undefined ? payload.sku : product.sku;
    product.stock = payload.stock !== undefined ? parseInt(payload.stock) : product.stock;
    product.lowStockThreshold = payload.lowStockThreshold !== undefined ? parseInt(payload.lowStockThreshold) : (product.lowStockThreshold || 5);
    product.netQuantity = payload.netQuantity || product.netQuantity || '30 ml';
    product.shelfLife = payload.shelfLife || product.shelfLife || '24 Months';
    product.skinTypes = payload.skinTypes || product.skinTypes || [];
    product.skinConcerns = payload.skinConcerns || product.skinConcerns || [];
    product.keyActives = payload.keyActives || product.keyActives || [];
    product.ingredients = payload.ingredients !== undefined ? payload.ingredients : product.ingredients;
    product.usageTiming = payload.usageTiming || product.usageTiming || [];
    product.howToUseSteps = payload.howToUseSteps || product.howToUseSteps || [];
    product.precautions = payload.precautions !== undefined ? payload.precautions : product.precautions;
    product.trustBadges = payload.trustBadges || product.trustBadges || [];
    product.specifications = payload.specifications || product.specifications || [];
    product.variants = payload.variants || product.variants || [];
    product.weight = payload.weight !== undefined ? parseFloat(payload.weight) : product.weight;
    product.dimensions = payload.dimensions || product.dimensions || { length: 10, width: 5, height: 5 };
    product.isCodAvailable = payload.isCodAvailable !== undefined ? payload.isCodAvailable : product.isCodAvailable;
    product.isFragile = payload.isFragile !== undefined ? payload.isFragile : product.isFragile;
    product.isReturnable = payload.isReturnable !== undefined ? payload.isReturnable : product.isReturnable;
    product.faqs = payload.faqs || product.faqs || [];
    product.visibility = payload.visibility !== undefined ? payload.visibility : product.visibility;
    product.isBestSeller = payload.isBestSeller !== undefined ? payload.isBestSeller : product.isBestSeller;
    product.isNewArrival = payload.isNewArrival !== undefined ? payload.isNewArrival : product.isNewArrival;
    product.isFeatured = payload.isFeatured !== undefined ? payload.isFeatured : product.isFeatured;
    product.customBadge = payload.customBadge !== undefined ? payload.customBadge : product.customBadge;
    product.tags = payload.tags || product.tags || [];
    product.seo = payload.seo || product.seo || {};

    if (allImages.length > 0) {
      product.images = allImages;
      product.featuredImage = allImages[0]?.url || '';
    }

    await product.save();

    // Revalidate customer PDP and Home
    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'page');
      revalidatePath('/products', 'page');
      revalidatePath(`/products/${product.slug}`, 'page');
    } catch (revalidateErr) {
      console.warn('Revalidate warning:', revalidateErr.message);
    }

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

    const resolvedParams = await params;
    const id = resolvedParams?.id;

    const product = await Product.findById(id);
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

    await Product.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted' 
    });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
