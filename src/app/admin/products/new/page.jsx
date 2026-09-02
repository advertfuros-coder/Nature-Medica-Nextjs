import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import ProductMasterForm from '@/components/admin/ProductMasterForm';

export const dynamic = 'force-dynamic';

export default async function NewProductPage() {
  await connectDB();
  const categories = await Category.find().lean();

  return (
    <div>
      <ProductMasterForm
        product={{}}
        categories={JSON.parse(JSON.stringify(categories))}
        mode="create"
      />
    </div>
  );
}
