import connectDB from '@/lib/mongodb';
import Coupon from '@/models/Coupon';
import CouponList from '@/components/admin/CouponList';

export const dynamic = 'force-dynamic';

export default async function AdminCouponsPage() {
  await connectDB();

  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Coupons</h1>
      <CouponList coupons={JSON.parse(JSON.stringify(coupons))} />
    </div>
  );
}
