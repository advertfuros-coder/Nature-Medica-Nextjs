import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import NewArrivalSection from './NewArrivalSection';

// Disable caching to ensure fresh data
export const revalidate = 0;

export default async function NewArrivalSectionWrapper() {
  await connectDB();

  let products = await Product.find({
    isNewArrival: true,
    visibility: true,
    stock: { $gt: 0 }
  })
    .populate('category', 'name')
    .sort({ createdAt: -1 })
    .limit(12)
    .lean();

  // Fallback to recent products if none explicitly marked as new arrival
  if (!products || products.length === 0) {
    products = await Product.find({
      visibility: true,
      stock: { $gt: 0 }
    })
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
  }

  if (!products || products.length === 0) {
    return null;
  }

  return <NewArrivalSection products={JSON.parse(JSON.stringify(products))} />;
}
