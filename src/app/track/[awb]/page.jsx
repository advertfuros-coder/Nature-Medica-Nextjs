'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FiPackage, 
  FiTruck, 
  FiHome, 
  FiCheck,
  FiMapPin,
  FiBox,
  FiClock,
  FiAlertCircle,
  FiPhone,
  FiMail,
  FiMapPin as FiLocation
} from 'react-icons/fi';

export default function TrackShipmentPage() {
  const params = useParams();
  const { awb } = params;

  const [tracking, setTracking] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (awb) {
      fetchTracking();
    }
  }, [awb]);

  const fetchTracking = async () => {
    console.log('🔍 Fetching tracking for:', awb);
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/shipments/track/${awb}`);
      console.log('📡 Response status:', res.status);
      
      const data = await res.json();
      console.log('📦 Response ', data);

      if (res.ok) {
        setTracking(data.tracking);
        setOrder(data.order);
      } else {
        setError(data.message || data.error || 'Tracking information not available');
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setError('Unable to connect to tracking service. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('delivered')) return 'bg-green-500';
    if (s.includes('shipped') || s.includes('transit')) return 'bg-blue-500';
    if (s.includes('cancelled')) return 'bg-red-500';
    if (s.includes('processing')) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#3a5d1e] border-t-transparent rounded-full animate-spin"></div>
            <FiPackage className="absolute inset-0 m-auto w-8 h-8 text-[#3a5d1e]" />
          </div>
          <p className="text-gray-700 font-semibold text-lg mb-2">Loading Tracking Information</p>
          <p className="text-gray-500 text-sm">AWB: {awb}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Tracking Not Available</h1>
          <p className="text-gray-600 mb-2">{error}</p>
          <div className="bg-gray-100 rounded-lg p-3 mb-6">
            <p className="text-sm text-gray-500">Tracking Number</p>
            <p className="font-mono font-semibold text-gray-900">{awb}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-[#3a5d1e] text-white px-6 py-3 rounded-xl hover:bg-[#2d4818] transition-all font-semibold"
            >
              <FiHome className="w-4 h-4" />
              Go Home
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#3a5d1e] text-[#3a5d1e] px-6 py-3 rounded-xl hover:bg-[#3a5d1e] hover:text-white transition-all font-semibold"
            >
              <FiBox className="w-4 h-4" />
              My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
   const courierName = tracking?.courier_name || 'Processing';
  const activities = tracking?.activities || [];
  const currentStatus = tracking?.current_status || 'Processing';
const statusText = currentStatus?.toLowerCase?.() || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#3a5d1e] to-[#2d4818] rounded-2xl flex items-center justify-center shadow-lg">
                <FiTruck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
                <p className="text-gray-600 text-sm">Nature Medica - Natural Wellness</p>
              </div>
            </div>
            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-2 text-[#3a5d1e] hover:text-[#2d4818] font-medium text-sm"
            >
              <FiHome className="w-4 h-4" />
              Home
            </Link>
          </div>

          {/* Tracking Number */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4 border border-gray-200">
            <p className="text-xs text-gray-600 mb-1 font-medium">Tracking Number (AWB)</p>
            <div className="flex items-center justify-between">
              <p className="font-mono font-bold text-xl text-gray-900">{awb}</p>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(awb);
                  alert('Tracking number copied!');
                }}
                className="text-xs bg-white px-3 py-1.5 rounded-lg border border-gray-300 hover:border-[#3a5d1e] hover:text-[#3a5d1e] transition-colors font-medium"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            Current

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-100">
              <div className="flex items-center gap-2 mb-2">
                <FiTruck className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-medium text-purple-900">Courier Partner</p>
              </div>
              <p className="font-bold text-lg text-purple-900">{courierName}</p>
            </div>
          </div>
        </div>

       

        {/* Tracking Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiMapPin className="w-5 h-5 text-[#3a5d1e]" />
            Shipment Journey
          </h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-[#3a5d1e] via-gray-200 to-gray-200"></div>

            {/* Timeline Items */}
            <div className="space-y-6">
              {activities.length > 0 ? (
                activities.map((activity, index) => {
                  const isLatest = index === 0;
                  const isDelivered = activity.activity?.toLowerCase().includes('delivered');
                  
                  return (
                    <div key={index} className="relative flex gap-4">
                      {/* Timeline Dot */}
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white shadow-lg ${
                        isDelivered
                          ? 'bg-green-500 text-white'
                          : isLatest 
                          ? 'bg-[#3a5d1e] text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {isDelivered ? (
                          <FiCheck className="w-6 h-6" />
                        ) : isLatest ? (
                          <FiTruck className="w-5 h-5" />
                        ) : (
                          <FiMapPin className="w-5 h-5" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className={`rounded-xl p-4 transition-all ${
                          isDelivered
                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300'
                            : isLatest 
                            ? 'bg-gradient-to-br from-green-50 to-blue-50 border-2 border-[#3a5d1e]' 
                            : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-bold text-gray-900">{activity.activity}</h3>
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                              isLatest ? 'bg-[#3a5d1e] text-white' : 'bg-gray-200 text-gray-700'
                            }`}>
                              {new Date(activity.date).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                            <FiMapPin className="w-4 h-4" />
                            <p>{activity.location}</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString('en-IN', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiClock className="w-10 h-10 text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium mb-2">No tracking updates yet</p>
                  <p className="text-sm text-gray-400">Updates will appear here once your order is processed</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="tel:+918400043322"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl hover:shadow-md transition-all border border-blue-200"
            >
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <FiPhone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Call Us</p>
                <p className="font-semibold text-blue-900">+91 8400043322</p>
              </div>
            </a>
            <a
              href="mailto:support@naturemedica.com"
              className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all border border-purple-200"
            >
              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                <FiMail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Email Us</p>
                <p className="font-semibold text-purple-900">support@naturemedica.com</p>
              </div>
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center justify-center gap-2 bg-[#3a5d1e] text-white px-8 py-3 rounded-xl hover:bg-[#2d4818] transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            <FiBox className="w-5 h-5" />
            View All Orders
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border-2 border-[#3a5d1e] text-[#3a5d1e] px-8 py-3 rounded-xl hover:bg-[#3a5d1e] hover:text-white transition-all font-semibold"
          >
            <FiHome className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

