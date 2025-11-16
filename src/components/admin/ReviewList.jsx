'use client';

import { useRouter } from 'next/navigation';
import { FiCheck, FiX } from 'react-icons/fi';
import { format } from 'date-fns';

export default function ReviewList({ reviews, currentPage, totalPages }) {
  const router = useRouter();

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/approve`, {
        method: 'PUT'
      });

      if (res.ok) {
        alert('Review approved successfully');
        router.refresh();
      } else {
        alert('Failed to approve review');
      }
    } catch (error) {
      alert('Failed to approve review');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Review deleted successfully');
        router.refresh();
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      alert('Failed to delete review');
    }
  };

  return (
    <div>
      <div className="mb-6 flex gap-3">
        <a
          href="?status=pending"
          className="px-4 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
        >
          Pending Reviews
        </a>
        <a
          href="?status=approved"
          className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
        >
          Approved Reviews
        </a>
        <a
          href="/admin/reviews"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          All Reviews
        </a>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Review
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
            {reviews.map((review) => (
              <tr key={review._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-semibold">{review.product.title}</p>
                </td>
                {/* <td className="px-6 py-4">
                  {review.user.name}
                </td> */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-semibold">{review.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-xs">
                  <p className="text-sm text-gray-700 line-clamp-2">{review.text}</p>
                </td>
                <td className="px-6 py-4 text-sm">
                  {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    review.approved
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {review.approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {!review.approved && (
                      <button
                        onClick={() => handleApprove(review._id)}
                        className="text-green-600 hover:text-green-700"
                        title="Approve"
                      >
                        <FiCheck size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-red-600 hover:text-red-700"
                      title="Delete"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <a
              key={page}
              href={`?page=${page}`}
              className={`px-4 py-2 border rounded ${
                page === currentPage
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
