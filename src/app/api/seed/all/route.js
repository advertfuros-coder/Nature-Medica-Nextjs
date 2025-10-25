import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET(req) {
  try {
    await connectDB();

    const results = {
      admin: null,
      products: null,
      banners: null,
      coupons: null,
      reviews: null,
      errors: []
    };

    // 1. Seed Admin
    try {
      const adminRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/seed/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Super Admin',
          email: 'admin@naturemedica.com',
          password: 'Admin@12345'
        })
      });
      results.admin = await adminRes.json();
    } catch (error) {
      results.errors.push({ step: 'admin', error: error.message });
    }

    // 2. Seed Products & Categories
    try {
      const productsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/seed/products`, {
        method: 'POST'
      });
      results.products = await productsRes.json();
    } catch (error) {
      results.errors.push({ step: 'products', error: error.message });
    }

    // 3. Seed Banners
    try {
      const bannersRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/seed/banners`, {
        method: 'POST'
      });
      results.banners = await bannersRes.json();
    } catch (error) {
      results.errors.push({ step: 'banners', error: error.message });
    }

    // 4. Seed Coupons
    try {
      const couponsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/seed/coupons`, {
        method: 'POST'
      });
      results.coupons = await couponsRes.json();
    } catch (error) {
      results.errors.push({ step: 'coupons', error: error.message });
    }

    // 5. Seed Reviews
    try {
      const reviewsRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/seed/reviews`, {
        method: 'POST'
      });
      results.reviews = await reviewsRes.json();
    } catch (error) {
      results.errors.push({ step: 'reviews', error: error.message });
    }

    return NextResponse.json({
      success: true,
      message: 'All data seeded successfully',
      results
    });

  } catch (error) {
    console.error('Seed all error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
