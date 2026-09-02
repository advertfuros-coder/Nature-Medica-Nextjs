import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { notFound } from 'next/navigation';
import ProductMasterForm from '@/components/admin/ProductMasterForm';

export const dynamic = 'force-dynamic';

export default async function ProductEditPage({ params }) {
  await connectDB();

  const resolvedParams = await params;
  const id = resolvedParams?.id;

  const product = await Product.findById(id).lean();
  const categories = await Category.find().lean();

  if (!product) {
    notFound();
  }

  return (
    <div>
      <ProductMasterForm
        product={JSON.parse(JSON.stringify(product))}
        categories={JSON.parse(JSON.stringify(categories))}
        mode="edit"
      />
    </div>
  );
}
