'use client';

import { useRouter } from 'next/navigation';
import { FiCheck, FiX, FiTrash2, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { format } from 'date-fns';

export default function ReviewList({ reviews, currentPage, totalPages }) {
  const router = useRouter();

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/approve`, {
        method: 'PUT'
      });

      if (res.ok) {
        alert('✅ Review approved successfully');
        router.refresh();
      } else {
        const data = await res.json();
        alert(`❌ Failed to approve review: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Approve error:', error);
      alert('❌ Failed to approve review');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('✅ Review deleted successfully');
        router.refresh();
      } else {
        const data = await res.json();
        alert(`❌ Failed to delete review: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Failed to delete review');
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <FiAlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Found</h3>
        <p className="text-gray-500">There are no reviews to display at the moment.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter Tabs */}
      <div className="mb-6 flex gap-3">
        <a
          href="?status=pending"
          className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 font-medium transition-colors"
        >
          <FiAlertCircle className="inline mr-2" />
          Pending Reviews
        </a>
        <a
          href="?status=approved"
          className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium transition-colors"
        >
          <FiCheckCircle className="inline mr-2" />
          Approved Reviews
        </a>
        <a
          href="/admin/reviews"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
        >
          All Reviews
        </a>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <tr key={review._id} className="hover:bg-gray-50 transition-colors">
                  {/* Product */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {review.product?.image && (
                        <img
                          src={review.product.image}
                          alt={review.product.title || 'Product'}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {review.product?.title || 'Deleted Product'}
                        </p>
                        {!review.product?.title && (
                          <span className="text-xs text-red-500">Product no longer exists</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Customer */}
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">
                        {review.user?.name || 'Anonymous'}
                      </p>
                      {review.user?.email && (
                        <p className="text-xs text-gray-500">{review.user.email}</p>
                      )}
                      {!review.user?.name && (
                        <span className="text-xs text-red-500">User deleted</span>
                      )}
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-1 font-semibold text-gray-700">{review.rating}</span>
                    </div>
                  </td>

                  {/* Review Text */}
                  <td className="px-6 py-4 max-w-xs">
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {review.text || 'No review text'}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      review.approved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {review.approved ? (
                        <>
                          <FiCheckCircle className="w-3 h-3" />
                          Approved
                        </>
                      ) : (
                        <>
                          <FiAlertCircle className="w-3 h-3" />
                          Pending
                        </>
                      )}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {!review.approved && (
                        <button
                          onClick={() => handleApprove(review._id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve Review"
                        >
                          <FiCheck size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Review"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <a
              key={page}
              href={`?page=${page}`}
              className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                page === currentPage
                  ? 'bg-[#3a5d1e] text-white border-[#3a5d1e]'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
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
