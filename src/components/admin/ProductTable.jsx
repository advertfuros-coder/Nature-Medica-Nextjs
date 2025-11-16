'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiEdit, FiTrash2, FiEye, FiEyeOff } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function ProductTable({ products, currentPage, totalPages }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setDeleting(id);

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Product deleted successfully');
        router.refresh();
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      alert('Failed to delete product');
    } finally {
      setDeleting(null);
    }
  };

  const toggleVisibility = async (id, currentVisibility) => {
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: !currentVisibility })
      });

      if (res.ok) {
        router.refresh();
      } else {
        alert('Failed to update visibility');
      }
    } catch (error) {
      alert('Failed to update visibility');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Product
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
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
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={product.images[0]?.url || '/placeholder.png'}
                      alt={product.title}
                      width={50}
                      height={50}
                        unoptimized

                      className="rounded object-cover"
                    />
                    <div>
                      <p className="font-semibold">{product.title}</p>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                    </div>
                  </div>
                </td>
                {/* <td className="px-6 py-4 text-sm">
                  {product.category.name}
                  {console.log(product)}
                </td> */}
                <td className="px-6 py-4 text-sm font-semibold">
                  ₹{product.price}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span className={product.stock > 10 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleVisibility(product._id, product.visibility)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
                      product.visibility
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {product.visibility ? <FiEye /> : <FiEyeOff />}
                    {product.visibility ? 'Visible' : 'Hidden'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FiEdit size={18} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deleting === product._id}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
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
