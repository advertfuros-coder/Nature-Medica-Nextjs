'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, MapPin, Home, Briefcase, Loader2 } from 'lucide-react';

export default function AddAddressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    type: 'home',
    isDefault: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/user/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push('/addresses');
      } else {
        alert('Failed to add address');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addressTypes = [
    { value: 'home', label: 'Home', icon: Home },
    { value: 'work', label: 'Work', icon: Briefcase },
    { value: 'other', label: 'Other', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Add New Address</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Name */}
        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e]"
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Phone */}
        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e]"
            placeholder="10-digit mobile number"
            pattern="[0-9]{10}"
            required
          />
        </div>

        {/* Address */}
        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
          <textarea
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e] resize-none"
            rows="3"
            placeholder="House No., Building Name, Road name, Area"
            required
          />
        </div>

        {/* City & State */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e]"
              required
            />
          </div>
          <div className="bg-white rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e]"
              required
            />
          </div>
        </div>

        {/* Pincode & Landmark */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
            <input
              type="text"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e]"
              pattern="[0-9]{6}"
              required
            />
          </div>
          <div className="bg-white rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Landmark</label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e]"
            />
          </div>
        </div>

        {/* Address Type */}
        <div className="bg-white rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">Address Type</label>
          <div className="grid grid-cols-3 gap-2">
            {addressTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                    formData.type === type.value
                      ? 'border-[#3a5d1e] bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${formData.type === type.value ? 'text-[#3a5d1e]' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium ${formData.type === type.value ? 'text-[#3a5d1e]' : 'text-gray-700'}`}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Default Address */}
        <div className="bg-white rounded-xl p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-5 h-5 text-[#3a5d1e] rounded focus:ring-[#3a5d1e]"
            />
            <span className="text-sm font-medium text-gray-700">Set as default address</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3a5d1e] text-white py-4 rounded-xl font-semibold hover:bg-[#2d4818] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Address
            </>
          )}
        </button>
      </form>
    </div>
  );
}
