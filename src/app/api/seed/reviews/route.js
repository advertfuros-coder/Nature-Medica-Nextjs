import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    await connectDB();

    const existingReviews = await Review.countDocuments();
    if (existingReviews > 0) {
      return NextResponse.json({
        error: 'Reviews already seeded. Delete existing reviews first.'
      }, { status: 400 });
    }

    // Create sample customer users for reviews
    let users = await User.find({ role: 'customer' }).limit(5);
    
    if (users.length === 0) {
      const hashedPassword = await bcrypt.hash('Customer@123', 10);
      users = await User.insertMany([
        { 
          name: 'Priya Sharma', 
          email: 'priya@example.com', 
          password: hashedPassword, 
          verified: true, 
          role: 'customer' 
        },
        { 
          name: 'Rahul Verma', 
          email: 'rahul@example.com', 
          password: hashedPassword, 
          verified: true, 
          role: 'customer' 
        },
        { 
          name: 'Anjali Singh', 
          email: 'anjali@example.com', 
          password: hashedPassword, 
          verified: true, 
          role: 'customer' 
        },
        { 
          name: 'Vikram Patel', 
          email: 'vikram@example.com', 
          password: hashedPassword, 
          verified: true, 
          role: 'customer' 
        },
        { 
          name: 'Sneha Reddy', 
          email: 'sneha@example.com', 
          password: hashedPassword, 
          verified: true, 
          role: 'customer' 
        }
      ]);
    }

    // Get all products
    const products = await Product.find().limit(8);

    if (products.length === 0) {
      return NextResponse.json({
        error: 'No products found. Seed products first.'
      }, { status: 400 });
    }

    const reviewTexts = [
      {
        rating: 5,
        text: 'Excellent product! Noticed significant improvement in my health within 2 weeks. Highly recommended for everyone looking for natural wellness solutions.'
      },
      {
        rating: 4,
        text: 'Very good quality product. Packaging was excellent and delivery was on time. Worth the price. Will definitely order again.'
      },
      {
        rating: 5,
        text: 'Amazing results! I have been using this for a month now and can feel the difference. The quality is top-notch and completely natural.'
      },
      {
        rating: 4,
        text: 'Good product with visible results. Takes a bit of time to show effects but definitely worth it. Great value for money.'
      },
      {
        rating: 5,
        text: 'Best purchase ever! This has become part of my daily routine. No side effects and purely natural. Thank you NatureMedica!'
      },
      {
        rating: 3,
        text: 'Decent product. Does what it claims but took longer than expected to see results. Overall satisfied with the purchase.'
      },
      {
        rating: 5,
        text: 'Absolutely love it! The taste is good and easy to consume daily. Noticed improvement in my energy levels and overall health.'
      },
      {
        rating: 4,
        text: 'Great product quality. Received it well-packaged. Started seeing results after regular use for 3 weeks. Recommended!'
      }
    ];

    const reviews = [];

    // Create 2-3 reviews per product
    for (let i = 0; i < products.length; i++) {
      const reviewsPerProduct = Math.floor(Math.random() * 2) + 2; // 2-3 reviews
      
      for (let j = 0; j < reviewsPerProduct; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomReview = reviewTexts[Math.floor(Math.random() * reviewTexts.length)];
        
        reviews.push({
          product: products[i]._id,
          user: randomUser._id,
          rating: randomReview.rating,
          text: randomReview.text,
          approved: true, // Auto-approve seeded reviews
          adminAdded: false,
          helpful: Math.floor(Math.random() * 50)
        });
      }
    }

    const insertedReviews = await Review.insertMany(reviews);

    // Update product ratings
    for (const product of products) {
      const productReviews = await Review.find({ 
        product: product._id, 
        approved: true 
      });

      if (productReviews.length > 0) {
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        
        await Product.findByIdAndUpdate(product._id, {
          ratingAvg: avgRating,
          reviewCount: productReviews.length
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Reviews seeded successfully',
      count: insertedReviews.length,
      usersCreated: users.length,
      productsWithReviews: products.length
    });

  } catch (error) {
    console.error('Seed reviews error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
