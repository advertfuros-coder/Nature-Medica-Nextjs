'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/userSlice';
import { FiMapPin, FiHome, FiMap, FiBriefcase } from 'react-icons/fi';

export default function AddressForm({ existingAddress, onSuccess, onCancel }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    type: existingAddress?.type || 'home',
    name: existingAddress?.name || '',
    phone: existingAddress?.phone || '',
    street: existingAddress?.street || '',
    city: existingAddress?.city || '',
    state: existingAddress?.state || '',
    pincode: existingAddress?.pincode || '',
    landmark: existingAddress?.landmark || '',
    isDefault: existingAddress?.isDefault || false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = '/api/user/address';
      const method = existingAddress ? 'PUT' : 'POST';
      
      const payload = existingAddress 
        ? { ...formData, addressId: existingAddress._id }
        : formData;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(setUser(data.user));
        if (onSuccess) onSuccess();
      } else {
        setError(data.error || 'Failed to save address');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      setError('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-md text-red-600 text-[11px]">
          {error}
        </div>
      )}

      {/* Address Type */}
      <div>
        <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
          Address Type *
        </label>
        <div className="grid grid-cols-3 gap-2">
          <label className={`flex items-center justify-center gap-2 p-2.5 border-2 rounded-md cursor-pointer transition-all hover:shadow-md ${
            formData.type === 'home' ? 'border-[#3a5d1e] bg-green-50' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="type"
              value="home"
              checked={formData.type === 'home'}
              onChange={handleInputChange}
              className="sr-only"
            />
            <FiHome className="w-4 h-4" />
            <span className="text-[11px] font-medium">Home</span>
          </label>

          <label className={`flex items-center justify-center gap-2 p-2.5 border-2 rounded-md cursor-pointer transition-all hover:shadow-md ${
            formData.type === 'work' ? 'border-[#3a5d1e] bg-green-50' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="type"
              value="work"
              checked={formData.type === 'work'}
              onChange={handleInputChange}
              className="sr-only"
            />
            <FiBriefcase className="w-4 h-4" />
            <span className="text-[11px] font-medium">Work</span>
          </label>

          <label className={`flex items-center justify-center gap-2 p-2.5 border-2 rounded-md cursor-pointer transition-all hover:shadow-md ${
            formData.type === 'other' ? 'border-[#3a5d1e] bg-green-50' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <input
              type="radio"
              name="type"
              value="other"
              checked={formData.type === 'other'}
              onChange={handleInputChange}
              className="sr-only"
            />
            <FiMapPin className="w-4 h-4" />
            <span className="text-[11px] font-medium">Other</span>
          </label>
        </div>
      </div>

      {/* Name and Phone */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-md focus:border-[#3a5d1e] focus:outline-none text-[12px]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
            pattern="[0-9]{10}"
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-md focus:border-[#3a5d1e] focus:outline-none text-[12px]"
          />
        </div>
      </div>

      {/* Street Address */}
      <div>
        <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">
          Street Address *
        </label>
        <textarea
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          required
          rows={2}
          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-md focus:border-[#3a5d1e] focus:outline-none text-[12px]"
          placeholder="House No., Building, Street"
        />
      </div>

      {/* City, State, Pincode */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-md focus:border-[#3a5d1e] focus:outline-none text-[12px]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-md focus:border-[#3a5d1e] focus:outline-none text-[12px]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">Pincode *</label>
          <input
            type="text"
            name="pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            required
            pattern="[0-9]{6}"
            className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-md focus:border-[#3a5d1e] focus:outline-none text-[12px]"
          />
        </div>
      </div>

      {/* Landmark */}
      <div>
        <label className="block text-[11px] font-semibold text-gray-700 mb-1.5">Landmark</label>
        <input
          type="text"
          name="landmark"
          value={formData.landmark}
          onChange={handleInputChange}
          className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-md focus:border-[#3a5d1e] focus:outline-none text-[12px]"
          placeholder="Optional"
        />
      </div>

      {/* Set as Default */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleInputChange}
            className="w-4 h-4 text-[#3a5d1e] border-gray-300 rounded focus:ring-[#3a5d1e]"
          />
          <span className="text-[11px] font-medium text-gray-700">Set as default address</span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 rounded-md font-semibold text-[13px] hover:bg-gray-50 transition-all hover:shadow-md"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-[#3a5d1e] to-[#5a7f3d] text-white py-2.5 rounded-md font-semibold text-[13px] hover:shadow-md transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : existingAddress ? 'Update Address' : 'Add Address'}
        </button>
      </div>
    </form>
  );
}
