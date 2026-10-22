import connectDB from "@/lib/mongodb";
import Banner from "@/models/Banner";
import BannerManager from "@/components/admin/BannerManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Hero & Banner Management | Nature Medica Admin",
};

export default async function AdminBannersPage() {
  await connectDB();

  const banners = await Banner.find()
    .sort({ order: 1, createdAt: -1 })
    .lean();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <BannerManager initialBanners={JSON.parse(JSON.stringify(banners))} />
    </div>
  );
}
