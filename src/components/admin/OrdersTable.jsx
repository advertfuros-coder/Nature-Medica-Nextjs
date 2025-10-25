'use client';

import Link from 'next/link';
import { format } from 'date-fns';

export default function OrdersTable({ orders, currentPage, totalPages }) {
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
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">
                  #{order.orderId}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold">{order.user.name}</p>
                    <p className="text-sm text-gray-600">{order.user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4 font-semibold">
                  ₹{order.finalPrice}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    order.paymentStatus === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {order.paymentMode.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/orders/${order.orderId}`}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`?page=${page}`}
              className={`px-4 py-2 border rounded ${
                page === currentPage
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
