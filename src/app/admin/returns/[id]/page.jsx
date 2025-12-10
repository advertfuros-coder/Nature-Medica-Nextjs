import connectDB from '@/lib/mongodb';
import ReturnRequest from '@/models/ReturnRequest';
import Order from '@/models/Order'; // Import Order model
import User from '@/models/User'; // Import User model
import Product from '@/models/Product'; // Import Product model
import ReturnDetailView from '@/components/admin/ReturnDetailView';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminReturnDetailPage({ params }) {
  await connectDB();

  // Import all models before querying to avoid schema registration errors
  // This ensures Mongoose knows about all referenced models
  const models = { Order, User, Product };

  const returnRequest = await ReturnRequest.findById(params.id)
    .populate('user', 'name email phone')
    .populate('order', 'orderId shippingAddress')
    .populate('items.product', 'title images')
    .lean();

  if (!returnRequest) {
    notFound();
  }

  return (
    <div className="p-8">
      <ReturnDetailView returnRequest={JSON.parse(JSON.stringify(returnRequest))} />
    </div>
  );
}
