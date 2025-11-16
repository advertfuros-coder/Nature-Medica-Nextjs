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
  FiAlertCircle
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
      setError('Unable to connect to tracking service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#3a5d1e] border-t-transparent rounded-full animate-spin"></div>
            <FiPackage className="absolute inset-0 m-auto w-8 h-8 text-[#3a5d1e]" />
          </div>
          <p className="text-gray-700 font-semibold text-lg mb-2">Tracking Your Order</p>
          <p className="text-gray-500 text-sm">AWB: {awb}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiAlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Tracking Not Available</h1>
          <p className="text-gray-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500 mb-6">Tracking Number: {awb}</p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#3a5d1e] text-white px-6 py-3 rounded-xl hover:bg-[#2d4818] transition-all font-semibold"
            >
              <FiHome className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 border-2 border-[#3a5d1e] text-[#3a5d1e] px-6 py-3 rounded-xl hover:bg-[#3a5d1e] hover:text-white transition-all font-semibold"
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
  const currentStatus = tracking?.current_status || 'Processing';
  const courierName = tracking?.courier_name || 'Courier Service';
  const activities = tracking?.activities || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-[#3a5d1e] bg-opacity-10 rounded-full flex items-center justify-center">
              <FiTruck className="w-7 h-7 text-[#3a5d1e]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Track Your Shipment</h1>
              <p className="text-gray-600">Nature Medica - Ayurvedic Wellness</p>
            </div>
          </div>

          {/* Tracking Number */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Tracking Number (AWB)</p>
            <p className="font-mono font-bold text-xl text-gray-900">{awb}</p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <FiPackage className="w-5 h-5 text-blue-600" />
                <p className="text-sm font-medium text-blue-900">Current Status</p>
              </div>
              <p className="font-bold text-lg text-blue-900">{currentStatus}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border-2 border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <FiTruck className="w-5 h-5 text-green-600" />
                <p className="text-sm font-medium text-green-900">Courier Partner</p>
              </div>
              <p className="font-bold text-lg text-green-900">{courierName}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        {order && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FiBox className="w-5 h-5 text-[#3a5d1e]" />
              Order Details
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Order ID</p>
                <p className="font-semibold">{order.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-semibold text-lg">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold">{order.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Order Date</p>
                <p className="font-semibold">
                  {new Date(order.orderDate).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>

            {/* Items */}
            {order.items && order.items.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">Items</p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-gray-600">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tracking Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <FiMapPin className="w-5 h-5 text-[#3a5d1e]" />
            Shipment Journey
          </h2>

          <div className="relative">
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>

            <div className="space-y-6">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <div key={index} className="relative flex gap-4">
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index === 0 
                        ? 'bg-[#3a5d1e] text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index === 0 ? (
                        <FiCheck className="w-6 h-6" />
                      ) : (
                        <FiMapPin className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1 pb-6">
                      <div className={`rounded-xl p-4 ${
                        index === 0 ? 'bg-green-50 border-2 border-[#3a5d1e]' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{activity.activity}</h3>
                          <span className="text-sm text-gray-600">
                            {new Date(activity.date).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">{activity.location}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FiClock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Tracking updates will appear here soon</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4 justify-center">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 bg-[#3a5d1e] text-white px-8 py-3 rounded-xl hover:bg-[#2d4818] transition-all font-semibold shadow-lg"
          >
            <FiBox />
            My Orders
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-2 border-[#3a5d1e] text-[#3a5d1e] px-8 py-3 rounded-xl hover:bg-[#3a5d1e] hover:text-white transition-all font-semibold"
          >
            <FiHome />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
