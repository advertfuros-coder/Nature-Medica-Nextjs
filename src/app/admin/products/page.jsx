import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductTable from '@/components/admin/ProductTable';
import Link from 'next/link';

export default async function AdminProductsPage({ searchParams }) {
  await connectDB();

  // Await searchParams for Next.js 15
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  let query = {};

  if (params.search) {
    query.$text = { $search: params.search };
  }

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('category')
    .lean();

  const totalProducts = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalProducts / limit);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          + Add Product
        </Link>
      </div>

      <ProductTable
        products={JSON.parse(JSON.stringify(products))}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
