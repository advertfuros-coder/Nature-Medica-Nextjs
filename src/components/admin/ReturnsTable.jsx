'use client';

import Link from 'next/link';
import { format } from 'date-fns';

export default function ReturnsTable({ returns, currentPage, totalPages }) {
  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700',
      'approved': 'bg-blue-100 text-blue-700',
      'rejected': 'bg-red-100 text-red-700',
      'pickup_scheduled': 'bg-purple-100 text-purple-700',
      'picked_up': 'bg-indigo-100 text-indigo-700',
      'refunded': 'bg-green-100 text-green-700',
      'completed': 'bg-gray-100 text-gray-700'
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
                Return ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Reason
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Date
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
            {returns.map((returnReq) => (
              <tr key={returnReq._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">
                  #{returnReq.returnId}
                </td>
                <td className="px-6 py-4">
                  #{returnReq.order.orderId}
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-semibold">{returnReq.user.name}</p>
                    <p className="text-sm text-gray-600">{returnReq.user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="capitalize">{returnReq.type}</span>
                </td>
                <td className="px-6 py-4 max-w-xs truncate">
                  {returnReq.reason}
                </td>
                <td className="px-6 py-4 font-semibold">
                  ₹{returnReq.refundAmount}
                </td>
                <td className="px-6 py-4 text-sm">
                  {format(new Date(returnReq.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(returnReq.status)}`}>
                    {returnReq.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/returns/${returnReq._id}`}
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
