import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';
import OrdersTable from '@/components/admin/OrdersTable';

export default async function AdminOrdersPage({ searchParams }) {
  await connectDB();

  const page = parseInt(searchParams.page) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  let query = {};
  
  if (searchParams.status) {
    query.orderStatus = searchParams.status;
  }

  if (searchParams.search) {
    query.$or = [
      { orderId: { $regex: searchParams.search, $options: 'i' } },
    ];
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .lean();

  const totalOrders = await Order.countDocuments(query);
  const totalPages = Math.ceil(totalOrders / limit);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      <OrdersTable 
        orders={JSON.parse(JSON.stringify(orders))}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
