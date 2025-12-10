import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import CategoryList from '@/components/admin/CategoryList';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  await connectDB();

  const categories = await Category.find().sort({ name: 1 }).lean();

  return (
    <div className="p-8">
      <CategoryList categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
