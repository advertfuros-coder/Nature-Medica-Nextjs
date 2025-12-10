import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { notFound } from 'next/navigation';
import ProductEditForm from '@/components/admin/ProductEditForm';

export const dynamic = 'force-dynamic';

export default async function ProductEditPage({ params }) {
  await connectDB();

  const product = await Product.findById(params.id).lean();
  const categories = await Category.find().lean();

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product details, images, pricing and inventory</p>
      </div>

      <ProductEditForm
        product={JSON.parse(JSON.stringify(product))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </div>
  );
}
