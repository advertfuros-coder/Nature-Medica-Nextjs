import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// "The McDonald's Fries" Cart Bump 1-Click Upsell Endpoint
// Prioritizes:
// 1. Eco Bamboo Toothbrush (₹89, Save 80%)
// 2. Ayurvedic Herbal Toothpaste (₹89, Save 82%)
// 3. Nourishing Herbal Lip Balm (₹79, Save 47%)
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const exclude = (searchParams.get('exclude') || '')
      .split(',')
      .map((id) => id.trim())
      .filter((id) => mongoose.Types.ObjectId.isValid(id));

    // Base query: active, in-stock, and not already in the customer's cart
    const base = {
      visibility: true,
      stock: { $gt: 0 },
      ...(exclude.length > 0 && { _id: { $nin: exclude } }),
    };

    // Priority slugs for "The McDonald's Fries" strategy
    const prioritySlugs = [
      'nature-medica-bamboo-toothbrush-extra-soft',
      'buy-2-toothpaste-get-1-bamboo-toothbrush-free',
      'ayurvedic-herbal-clove-miswak-toothpaste',
      'ayurvedic-rose-ghee-lip-balm'
    ];

    // Fetch all eligible cart bump candidates
    const bumpCandidates = await Product.find({
      ...base,
      $or: [
        { isCartBumpOnly: true },
        { bumpPrice: { $gt: 0 } },
        { slug: { $in: prioritySlugs } }
      ]
    }).lean();

    // Sort according to priority: Brush -> Toothpaste -> Lip Balm -> any others
    bumpCandidates.sort((a, b) => {
      const idxA = prioritySlugs.indexOf(a.slug);
      const idxB = prioritySlugs.indexOf(b.slug);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return (a.bumpPrice || a.price) - (b.bumpPrice || b.price);
    });

    let selectedProduct = bumpCandidates.length > 0 ? bumpCandidates[0] : null;

    // Fallback: If no dedicated bump candidates, pick cheapest in-stock item
    if (!selectedProduct) {
      selectedProduct = await Product.findOne(base).sort({ price: 1 }).lean();
    }

    if (!selectedProduct) {
      return NextResponse.json({ product: null, offers: [] });
    }

    // Determine offer price and copy formatting
    const offerPrice =
      selectedProduct.bumpPrice > 0 && selectedProduct.bumpPrice < selectedProduct.price
        ? selectedProduct.bumpPrice
        : selectedProduct.price;

    const mrp = selectedProduct.mrp || Math.round(offerPrice * 2);
    const savings = Math.max(0, mrp - offerPrice);
    const discountPercent = mrp > 0 ? Math.round((savings / mrp) * 100) : 50;

    let shortTitle = 'Bamboo Toothbrush (Pack of 2)';
    let checkboxText = `Add Eco Bamboo Toothbrush (Pack of 2) for just ₹${offerPrice} (Save ${discountPercent}%) — 1 Click Add`;

    if (selectedProduct.slug?.includes('toothpaste') || selectedProduct.title?.toLowerCase().includes('toothpaste')) {
      shortTitle = 'Ayurvedic Herbal Toothpaste';
      checkboxText = `Add Ayurvedic Herbal Toothpaste for just ₹${offerPrice} (Save ${discountPercent}%) — 1 Click Add`;
    } else if (selectedProduct.slug?.includes('lip') || selectedProduct.title?.toLowerCase().includes('lip')) {
      shortTitle = 'Nourishing Herbal Lip Balm';
      checkboxText = `Add Nourishing Herbal Lip Balm for just ₹${offerPrice} (Save ${discountPercent}%) — 1 Click Add`;
    } else if (selectedProduct.slug?.includes('brush') || selectedProduct.title?.toLowerCase().includes('brush')) {
      shortTitle = 'Bamboo Toothbrush (Pack of 2)';
      checkboxText = `Add Eco Bamboo Toothbrush (Pack of 2) for just ₹${offerPrice} (Save ${discountPercent}%) — 1 Click Add`;
    } else {
      shortTitle = selectedProduct.title;
      checkboxText = `Add ${selectedProduct.title} for just ₹${offerPrice} (Save ${discountPercent}%) — 1 Click Add`;
    }

    const formattedProduct = {
      ...JSON.parse(JSON.stringify(selectedProduct)),
      offerPrice,
      mrp,
      savings,
      discountPercent,
      shortTitle,
      checkboxText,
    };

    return NextResponse.json({
      product: formattedProduct,
      allBumpOffers: bumpCandidates.slice(0, 3).map((item) => ({
        _id: item._id,
        title: item.title,
        slug: item.slug,
        offerPrice: item.bumpPrice || item.price,
        mrp: item.mrp || (item.bumpPrice ? item.bumpPrice * 2 : item.price),
      })),
    });
  } catch (error) {
    console.error('Error fetching McDonald\'s Fries Cart Bump product:', error);
    return NextResponse.json({ product: null, offers: [] });
  }
}
