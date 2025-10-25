import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import CategoryList from '@/components/admin/CategoryList';

export default async function AdminCategoriesPage() {
  await connectDB();

  const categories = await Category.find().sort({ name: 1 }).lean();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Categories</h1>
      <CategoryList categories={JSON.parse(JSON.stringify(categories))} />
    </div>
  );
}
