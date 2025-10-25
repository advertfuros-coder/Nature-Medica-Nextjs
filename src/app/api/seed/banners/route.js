import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function POST(req) {
  try {
    await connectDB();

    const existingBanners = await Banner.countDocuments();
    if (existingBanners > 0) {
      return NextResponse.json({
        error: 'Banners already seeded. Delete existing banners first.'
      }, { status: 400 });
    }

    const banners = [
      {
        type: 'home',
        title: 'Welcome to NatureMedica',
        subtitle: 'Your Trusted Source for Natural Wellness',
        image: {
          url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1920&h=500&fit=crop',
          publicId: 'banner_home_1'
        },
        link: '/products',
        active: true,
        order: 1
      },
      {
        type: 'home',
        title: '100% Natural & Organic',
        subtitle: 'Lab Tested Products You Can Trust',
        image: {
          url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&h=500&fit=crop',
          publicId: 'banner_home_2'
        },
        link: '/products?category=organic-foods',
        active: true,
        order: 2
      },
      {
        type: 'home',
        title: 'Boost Your Immunity',
        subtitle: 'Ayurvedic Supplements for Better Health',
        image: {
          url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1920&h=500&fit=crop',
          publicId: 'banner_home_3'
        },
        link: '/products?category=immunity-boosters',
        active: true,
        order: 3
      },
      {
        type: 'bestseller',
        title: 'Best Selling Products',
        subtitle: 'Customer Favorites',
        image: {
          url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1920&h=400&fit=crop',
          publicId: 'banner_bestseller_1'
        },
        link: '/products?sort=rating',
        active: true,
        order: 1
      },
      {
        type: 'hotselling',
        title: 'Hot Deals This Week',
        subtitle: 'Up to 40% Off on Selected Items',
        image: {
          url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1920&h=400&fit=crop',
          publicId: 'banner_hotselling_1'
        },
        link: '/products',
        active: true,
        order: 1
      }
    ];

    const insertedBanners = await Banner.insertMany(banners);

    return NextResponse.json({
      success: true,
      message: 'Banners seeded successfully',
      count: insertedBanners.length,
      banners: insertedBanners.map(b => ({ 
        id: b._id, 
        type: b.type, 
        title: b.title 
      }))
    });

  } catch (error) {
    console.error('Seed banners error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
