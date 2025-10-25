'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserProfile } from '@/store/slices/userSlice';

export default function AddressForm({ onSuccess }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    type: 'home',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    isDefault: false
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(updateUserProfile({ addresses: data.addresses }));
        alert('Address added successfully');
        onSuccess?.();
      } else {
        alert(data.error || 'Failed to add address');
      }
    } catch (error) {
      alert('Failed to add address');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Address Type:</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full border rounded-lg px-4 py-2"
          >
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-2">Phone:</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Street Address:</label>
        <input
          type="text"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          required
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block font-semibold mb-2">City:</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">State:</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Pincode:</label>
          <input
            type="text"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            required
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
      </div>

      <label className="flex items-center">
        <input
          type="checkbox"
          checked={formData.isDefault}
          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
          className="mr-2"
        />
        <span>Set as default address</span>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
      >
        {submitting ? 'Saving...' : 'Save Address'}
      </button>
    </form>
  );
}
