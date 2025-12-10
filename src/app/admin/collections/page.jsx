import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category'; // Import Category model
import CollectionsTable from '@/components/admin/CollectionsTable';

export const dynamic = 'force-dynamic';

export default async function AdminCollectionsPage({ searchParams }) {
  await connectDB();

  // Await searchParams for Next.js 15
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const filter = params.filter || 'all';
  const search = params.search || '';
  const limit = 20;
  const skip = (page - 1) * limit;

  // Build query
  let query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } }
    ];
  }

  switch (filter) {
    case 'bestSeller':
      query.isBestSeller = true;
      break;
    case 'newArrival':
      query.isNewArrival = true;
      break;
    case 'featured':
      query.isFeatured = true;
      break;
    default:
      // Show all products
      break;
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

  // Get counts for each collection
  const counts = {
    all: await Product.countDocuments(),
    bestSeller: await Product.countDocuments({ isBestSeller: true }),
    newArrival: await Product.countDocuments({ isNewArrival: true }),
    featured: await Product.countDocuments({ isFeatured: true })
  };

  return (
    <div className='p-4 md:p-8 lg:p-8'>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Product Collections</h1>
        <p className="text-gray-600 mt-2">Manage Best Sellers, New Arrivals, and Featured Products</p>
      </div>

      <CollectionsTable
        products={JSON.parse(JSON.stringify(products))}
        counts={counts}
        currentFilter={filter}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
