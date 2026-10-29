'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiPackage,
  FiSearch,
  FiHome,
  FiAlertCircle,
  FiArrowRight,
  FiRefreshCw,
  FiBox,
} from 'react-icons/fi';
import OrderTrackerView from '@/components/customer/OrderTrackerView';

export default function TrackShipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const awb = params?.awb;

  const [searchInput, setSearchInput] = useState(awb || '');
  const [tracking, setTracking] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (awb) {
      setSearchInput(awb);
      fetchTracking(awb);
    }
  }, [awb]);

  const fetchTracking = async (code, isSilentRefresh = false) => {
    const cleanCode = (code || awb || '').trim();
    if (!cleanCode) return;

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
        setError('');
      } else {
        setTracking(null);
        setOrder(null);
        setError(
          data.message ||
            data.error ||
            `No tracking information found for "${cleanCode}". Please verify your Order ID or AWB.`
        );
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
      setError('Unable to reach the tracking service. Please try again in a few moments.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/track/${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-emerald-800 transition-colors flex items-center gap-1">
              <FiHome className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <Link href="/track" className="hover:text-emerald-800 transition-colors">
              Tracking Portal
            </Link>
            <span>/</span>
            <span className="font-mono text-gray-800 font-bold">{awb}</span>
          </div>

          <Link
            href="/track"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            Track Another Order <FiArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Compact Search Bar */}
        <div className="bg-white rounded-2xl shadow-2xs border border-gray-200 p-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by Order ID or AWB..."
                className="w-full pl-10 pr-3 py-2 text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#2d4e24]"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2d4e24] hover:bg-[#1e3415] text-white rounded-xl text-xs font-bold transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center space-y-3">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 border-4 border-[#2d4e24] border-t-transparent rounded-full animate-spin"></div>
              <FiPackage className="absolute inset-0 m-auto w-6 h-6 text-[#2d4e24]" />
            </div>
            <h3 className="text-base font-bold text-gray-900">Locating Your Package...</h3>
            <p className="text-xs text-gray-500 font-mono">Query: {awb}</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-white rounded-3xl shadow-sm border border-red-100 p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto text-red-600">
              <FiAlertCircle className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Tracking Information Not Found</h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">{error}</p>
            <div className="flex justify-center gap-3 pt-2">
              <Link
                href="/track"
                className="px-5 py-2.5 bg-[#2d4e24] text-white rounded-xl text-xs font-bold hover:bg-[#1e3415] transition-colors"
              >
                Back to Tracking Portal
              </Link>
              <Link
                href="/orders"
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
              >
                My Orders
              </Link>
            </div>
          </div>
        )}

        {/* Success Tracking View */}
        {tracking && !loading && (
          <OrderTrackerView
            tracking={tracking}
            order={order}
            onRefresh={() => fetchTracking(awb, true)}
            isRefreshing={refreshing}
          />
        )}
      </div>
    </div>
  );
}
