import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import User from '@/models/User';
import Product from '@/models/Product';
import { notFound } from 'next/navigation';
import EnhancedOrderDetailView from '@/components/admin/EnhancedOrderDetailView';

export default async function AdminOrderDetailPage({ params }) {
  await connectDB();

  const order = await Order.findOne({ orderId: params.orderId })
    .populate('user', 'name email phone')
    .populate('items.product', 'title images stock')
    .lean();

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto">
      <EnhancedOrderDetailView order={JSON.parse(JSON.stringify(order))} />
    </div>
  );
}
