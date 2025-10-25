import Link from 'next/link';
import { format } from 'date-fns';

export default function RecentOrders({ orders }) {
  const getStatusColor = (status) => {
    const colors = {
      'Processing': 'bg-blue-100 text-blue-700',
      'Confirmed': 'bg-purple-100 text-purple-700',
      'Shipped': 'bg-yellow-100 text-yellow-700',
      'Delivered': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Recent Orders</h2>

      <div className="space-y-3">
        {orders.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No orders yet</p>
        ) : (
          orders.map((order) => (
            <Link
              key={order._id}
              href={`/admin/orders/${order.orderId}`}
              className="block border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold">#{order.orderId}</p>
                  <p className="text-sm text-gray-600">{order.user.name}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </span>
                <span className="font-semibold">₹{order.finalPrice}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
