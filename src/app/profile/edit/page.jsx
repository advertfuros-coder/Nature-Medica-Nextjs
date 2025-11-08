'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, Save, Loader2 } from 'lucide-react';
import { setUser } from '@/store/slices/userSlice';

export default function EditProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        dispatch(setUser(data.user));
        setSuccess('Profile updated successfully!');
        setTimeout(() => router.push('/profile'), 1500);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Edit Profile</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        {/* Success Message */}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {/* Name Field */}
        <div className="bg-white rounded-xl p-4">
          <label className="flex items-center gap-3 mb-3">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Full Name</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e]"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Email Field */}
        <div className="bg-white rounded-xl p-4">
          <label className="flex items-center gap-3 mb-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Email Address</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e]"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Phone Field */}
        <div className="bg-white rounded-xl p-4">
          <label className="flex items-center gap-3 mb-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Phone Number</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3a5d1e]"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#3a5d1e] text-white py-4 rounded-xl font-semibold hover:bg-[#2d4818] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
