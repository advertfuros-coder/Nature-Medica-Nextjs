'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FiSearch,
  FiTruck,
  FiPackage,
  FiMapPin,
  FiShield,
  FiClock,
  FiAlertCircle,
  FiArrowRight,
  FiRefreshCw,
  FiHelpCircle,
  FiCheckCircle,
} from 'react-icons/fi';
import OrderTrackerView from '@/components/customer/OrderTrackerView';

function TrackPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('orderId') || searchParams.get('awb') || searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState('');
  const [tracking, setTracking] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Auto-track if query param exists on load
  useEffect(() => {
    if (initialQuery) {
      performTracking(initialQuery);
    }
  }, [initialQuery]);

  const performTracking = async (codeToTrack, isSilentRefresh = false) => {
    const cleanCode = (codeToTrack || searchQuery || '').trim();
    if (!cleanCode) {
      setError('Please enter a valid Order ID or AWB Tracking Number.');
      return;
    }

    if (isSilentRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
      setError('');
    }

    try {
      const res = await fetch(`/api/shipments/track/${encodeURIComponent(cleanCode)}`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (res.ok && data.success && data.tracking) {
        setTracking(data.tracking);
        setOrder(data.order || null);
        setActiveQuery(cleanCode);
        setError('');
      } else {
        setTracking(null);
        setOrder(null);
        setError(
          data.message ||
            data.error ||
            `No tracking information found for "${cleanCode}". Please verify your Order ID or AWB number.`
        );
      }
    } catch (err) {
      console.error('Track lookup error:', err);
      setError('Unable to reach the tracking service right now. Please check your internet or try again in a few moments.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performTracking(searchQuery);
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header / Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2d4e24]/10 text-[#2d4e24] text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#2d4e24] animate-pulse"></span>
            Real-Time Courier Intelligence
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Track Your Nature Medica Order
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
            Get instant, real-time live location updates and journey milestones for Ekart, Shiprocket, and partner couriers.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4 sm:p-6 transition-all focus-within:ring-4 focus-within:ring-[#2d4e24]/10 focus-within:border-[#2d4e24]">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order ID (e.g. NM000179) or AWB Tracking Number..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/70 border border-gray-200 rounded-2xl text-sm sm:text-base font-medium text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:border-[#2d4e24] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#2d4e24] hover:bg-[#1e3415] text-white rounded-2xl text-sm sm:text-base font-bold shadow-md shadow-[#2d4e24]/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <FiRefreshCw className="w-4 h-4 animate-spin" />
                  <span>Locating Package...</span>
                </>
              ) : (
                <>
                  <span>Track Live</span>
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick tips */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-gray-100 text-[11px] sm:text-xs text-gray-500">
            <span>
              💡 Hint: You can find your Order ID in your order confirmation SMS or WhatsApp.
            </span>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">Supported:</span>
              <span className="font-semibold text-gray-700">Ekart</span>
              <span>•</span>
              <span className="font-semibold text-gray-700">Shiprocket</span>
              <span>•</span>
              <span className="font-semibold text-gray-700">All Carriers</span>
            </div>
          </div>
        </div>

        {/* Error message card */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center space-y-3">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto text-red-600">
              <FiAlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-red-900">Shipment Not Located</h3>
            <p className="text-xs sm:text-sm text-red-700 max-w-md mx-auto">{error}</p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/orders"
                className="px-4 py-2 bg-white border border-red-200 text-red-800 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors"
              >
                View My Orders
              </Link>
              <a
                href="https://wa.me/919999999999?text=Hi%2C%20I%20need%20help%20locating%20my%20order%20tracking"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors"
              >
                WhatsApp Support
              </a>
            </div>
          </div>
        )}

        {/* Tracking Details View (when found) */}
        {tracking && (
          <OrderTrackerView
            tracking={tracking}
            order={order}
            onRefresh={() => performTracking(activeQuery, true)}
            isRefreshing={refreshing}
          />
        )}

        {/* Initial Empty State / Value Proposition (Before searching) */}
        {!tracking && !error && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto sm:mx-0">
                <FiMapPin className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Live Hub Location</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Know the exact city, processing hub, or delivery facility your Ayurvedic parcel is currently passing through.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto sm:mx-0">
                <FiTruck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">End-to-End Milestones</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Track every stage from warehouse packaging, dispatch, in-transit movements, to out-for-delivery in real time.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-2xs space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto sm:mx-0">
                <FiShield className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-base">Return & Delivery Security</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Full transparency if an attempt fails or if a return (RTO) is in progress, with instant WhatsApp support.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PublicTrackingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center p-4">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-4 border-[#2d4e24] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 text-sm font-semibold">Loading Tracking Portal...</p>
          </div>
        </div>
      }
    >
      <TrackPageContent />
    </Suspense>
  );
}
