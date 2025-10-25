import connectDB from '@/lib/mongodb';
import Banner from '@/models/Banner';
import BannerList from '@/components/admin/BannerList';

export default async function AdminBannersPage() {
  await connectDB();

  const banners = await Banner.find().sort({ order: 1 }).lean();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Banners</h1>
      <BannerList banners={JSON.parse(JSON.stringify(banners))} />
    </div>
  );
}
