'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import { format } from 'date-fns';

export default function CouponList({ coupons }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percent',
    value: '',
    minOrderValue: '',
    usageLimit: '',
    expiryDate: '',
    description: '',
    active: true
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon._id}`
        : '/api/admin/coupons';

      const res = await fetch(url, {
        method: editingCoupon ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert(`Coupon ${editingCoupon ? 'updated' : 'created'} successfully`);
        resetForm();
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to save coupon');
      }
    } catch (error) {
      alert('Failed to save coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrderValue: coupon.minOrderValue,
      usageLimit: coupon.usageLimit || '',
      expiryDate: format(new Date(coupon.expiryDate), 'yyyy-MM-dd'),
      description: coupon.description || '',
      active: coupon.active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Coupon deleted successfully');
        router.refresh();
      } else {
        alert('Failed to delete coupon');
      }
    } catch (error) {
      alert('Failed to delete coupon');
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percent',
      value: '',
      minOrderValue: '',
      usageLimit: '',
      expiryDate: '',
      description: '',
      active: true
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Coupons</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <FiPlus />
          Add Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-bold text-xl mb-4">
            {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-2">Coupon Code *</label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                placeholder="SAVE20"
                className="w-full border rounded-lg px-4 py-2 uppercase"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Discount Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="percent">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-2">
                Discount Value * {formData.type === 'percent' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Minimum Order Value (₹) *</label>
              <input
                type="number"
                value={formData.minOrderValue}
                onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block font-semibold mb-2">Usage Limit (Optional)</label>
              <input
                type="number"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                placeholder="Leave empty for unlimited"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Expiry Date *</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Get 20% off on orders above ₹499"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="mr-2"
              />
              <span className="font-semibold">Active</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Saving...' : editingCoupon ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Min Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Expiry
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
            {coupons.map((coupon) => (
              <tr key={coupon._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">
                  {coupon.code}
                </td>
                <td className="px-6 py-4">
                  {coupon.type === 'percent' ? `${coupon.value}%` : `₹${coupon.value}`}
                </td>
                <td className="px-6 py-4">
                  ₹{coupon.minOrderValue}
                </td>
                <td className="px-6 py-4 text-sm">
                  {coupon.usedCount} / {coupon.usageLimit || '∞'}
                </td>
                <td className="px-6 py-4 text-sm">
                  {format(new Date(coupon.expiryDate), 'MMM dd, yyyy')}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    coupon.active && new Date(coupon.expiryDate) > new Date()
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {coupon.active && new Date(coupon.expiryDate) > new Date() ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(coupon)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      className="text-red-600 hover:text-red-700"
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
  );
}
