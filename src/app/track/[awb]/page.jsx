'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  FiPackage, 
  FiTruck, 
  FiHome, 
  FiCheck,
  FiMapPin
} from 'react-icons/fi';

export default function TrackShipmentPage() {
  const params = useParams();
  const { awb } = params;

  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (awb) {
      fetchTracking();
    }
  }, [awb]);

  const fetchTracking = async () => {
    try {
      const res = await fetch(`/api/shipments/track/${awb}`);
      const data = await res.json();

      if (res.ok) {
        setTracking(data.tracking);
      } else {
        setError(data.error || 'Failed to fetch tracking information');
      }
    } catch (error) {
      setError('Failed to fetch tracking information');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#3a5d1e] border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Fetching tracking information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Tracking Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#3a5d1e] text-white px-6 py-3 rounded-lg hover:bg-[#2d4818] transition-all font-semibold"
          >
            <FiHome />
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const trackingData = tracking?.tracking_data;
  const shipmentTrack = trackingData?.shipment_track?.[0] || {};
  const shipmentDetails = trackingData?.shipment_track_activities || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#3a5d1e] bg-opacity-10 rounded-full flex items-center justify-center">
              <FiTruck className="w-6 h-6 text-[#3a5d1e]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Track Your Shipment</h1>
              <p className="text-gray-600">Real-time tracking information</p>
            </div>
          </div>

          {/* Tracking Number */}
          <div className="bg-gray-50 rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
            <p className="font-mono font-bold text-xl text-gray-900">{awb}</p>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Current Status</p>
              <p className="font-semibold text-lg text-blue-900">
                {shipmentTrack.current_status || 'In Transit'}
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Courier</p>
              <p className="font-semibold text-lg text-green-900">
                {shipmentTrack.courier_name || 'N/A'}
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Expected Delivery</p>
              <p className="font-semibold text-lg text-purple-900">
                {shipmentTrack.edd ? new Date(shipmentTrack.edd).toLocaleDateString('en-IN') : 'TBD'}
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold mb-6">Shipment Journey</h2>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200"></div>

            {/* Timeline Items */}
            <div className="space-y-6">
              {shipmentDetails.length > 0 ? (
                shipmentDetails.map((activity, index) => (
                  <div key={index} className="relative flex gap-4">
                    {/* Timeline Dot */}
                    <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index === 0 
                        ? 'bg-[#3a5d1e] text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index === 0 ? (
                        <FiCheck className="w-6 h-6" />
                      ) : (
                        <FiMapPin className="w-6 h-6" />
                      )}
                    </div>

                    {/* Content */}
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
                        <p className="text-gray-600 text-sm mb-2">{activity.location}</p>
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
                  <FiPackage className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No tracking updates available yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 text-center">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 bg-[#3a5d1e] text-white px-6 py-3 rounded-lg hover:bg-[#2d4818] transition-all font-semibold"
          >
            <FiPackage />
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
