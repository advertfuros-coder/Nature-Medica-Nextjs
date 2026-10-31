import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import BestSellerSection from './BestsellerSection';

// Disable caching to ensure fresh data
export const revalidate = 0;

export default async function BestSellerSectionWrapper() {
  await connectDB();

  // Fetch best seller products
  let products = await Product.find({
    isBestSeller: true,
    visibility: true,
    stock: { $gt: 0 }
  })
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  // Fallback to top rated products if none explicitly marked as bestseller
  if (!products || products.length === 0) {
    products = await Product.find({
      visibility: true,
      stock: { $gt: 0 }
    })
      .populate('category', 'name')
      .sort({ reviewCount: -1, ratingAvg: -1, createdAt: -1 })
      .limit(8)
      .lean();
  }

  if (!products || products.length === 0) {
    return null;
  }

  return <BestSellerSection products={JSON.parse(JSON.stringify(products))} />;
}
