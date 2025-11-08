'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, MapPin, Home, Briefcase, Edit2, Trash2, CheckCircle } from 'lucide-react';

export default function AddressesPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch('/api/user/addresses');
      const data = await res.json();
      if (res.ok) {
        setAddresses(data.addresses || []);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      const res = await fetch(`/api/user/addresses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setAddresses(addresses.filter(addr => addr._id !== id));
      }
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  const setDefaultAddress = async (id) => {
    try {
      const res = await fetch(`/api/user/addresses/${id}/default`, { method: 'PUT' });
      if (res.ok) {
        fetchAddresses();
      }
    } catch (error) {
      console.error('Error setting default:', error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'home': return Home;
      case 'work': return Briefcase;
      default: return MapPin;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3a5d1e] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">My Addresses</h1>
        </div>
        <button
          onClick={() => router.push('/addresses/add')}
          className="p-2 bg-[#3a5d1e] text-white rounded-full hover:bg-[#2d4818]"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Addresses List */}
      <div className="p-4 space-y-3">
        {addresses.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-semibold text-gray-900 mb-2">No addresses added</h3>
            <p className="text-sm text-gray-600 mb-4">Add your first delivery address</p>
            <button
              onClick={() => router.push('/addresses/add')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#3a5d1e] text-white rounded-lg font-medium hover:bg-[#2d4818]"
            >
              <Plus className="w-5 h-5" />
              Add Address
            </button>
          </div>
        ) : (
          addresses.map((address) => {
            const Icon = getIcon(address.type);
            return (
              <div key={address._id} className="bg-white rounded-xl p-4 relative">
                {address.isDefault && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      <CheckCircle className="w-3 h-3" />
                      Default
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 capitalize">{address.type}</h3>
                    <p className="text-sm text-gray-600 mb-1">{address.name}</p>
                    <p className="text-sm text-gray-600">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Phone: {address.phone}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  {!address.isDefault && (
                    <button
                      onClick={() => setDefaultAddress(address._id)}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    onClick={() => router.push(`/addresses/edit/${address._id}`)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-[#3a5d1e] bg-green-50 rounded-lg hover:bg-green-100 flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteAddress(address._id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
