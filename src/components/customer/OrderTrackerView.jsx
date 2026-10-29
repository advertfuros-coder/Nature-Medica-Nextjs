'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FiPackage,
  FiTruck,
  FiMapPin,
  FiCheckCircle,
  FiClock,
  FiRotateCcw,
  FiAlertTriangle,
  FiCopy,
  FiCheck,
  FiRefreshCw,
  FiBox,
  FiChevronDown,
  FiChevronUp,
  FiHelpCircle,
  FiMessageSquare,
} from 'react-icons/fi';

export default function OrderTrackerView({
  tracking,
  order,
  onRefresh,
  isRefreshing = false,
}) {
  const [copied, setCopied] = useState(false);
  const [showAllScans, setShowAllScans] = useState(false);

  if (!tracking) return null;

  const awb = tracking.awb || order?.orderId;
  const currentStatus = tracking.current_status || order?.status || 'IN_TRANSIT';
  const courierName = tracking.courier_name || 'Express Logistics';
  const currentLocation = tracking.current_location || 'In Transit';
  const activities = tracking.activities || [];
  const isDelivered = Boolean(tracking.is_delivered);
  const isRTO = Boolean(tracking.is_rto);

  const handleCopy = () => {
    if (awb) {
      navigator.clipboard.writeText(awb);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getStatusBadge = () => {
    if (isRTO) {
      if (currentStatus === 'RTO_DELIVERED') {
        return {
          label: 'Returned to Warehouse',
          bg: 'bg-rose-900 text-rose-100 border-rose-800',
          dot: 'bg-rose-400',
        };
      }
      return {
        label: 'Return in Transit (Returning to Sender)',
        bg: 'bg-red-100 text-red-800 border-red-300',
        dot: 'bg-red-500',
      };
    }

    const s = String(currentStatus).toUpperCase();
    if (s.includes('DELIVERED')) {
      return {
        label: 'Delivered',
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        dot: 'bg-emerald-500',
      };
    }
    if (s.includes('OUT FOR DELIVERY') || s.includes('OFD')) {
      return {
        label: 'Out for Delivery Today',
        bg: 'bg-purple-100 text-purple-800 border-purple-300',
        dot: 'bg-purple-500 animate-pulse',
      };
    }
    if (s.includes('UNDELIVERED') || s.includes('FAILED') || s.includes('NDR')) {
      return {
        label: 'Delivery Attempt Unsuccessful',
        bg: 'bg-orange-100 text-orange-800 border-orange-300',
        dot: 'bg-orange-500',
      };
    }
    if (s.includes('PICKED UP')) {
      return {
        label: 'Picked Up by Courier',
        bg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        dot: 'bg-indigo-500',
      };
    }
    return {
      label: 'In Transit',
      bg: 'bg-blue-100 text-blue-800 border-blue-300',
      dot: 'bg-blue-500 animate-pulse',
    };
  };

  const badge = getStatusBadge();

  // Stepper calculations
  const forwardSteps = [
    { key: 'MANIFESTED', label: 'Order Confirmed' },
    { key: 'PICKED_UP', label: 'Picked Up' },
    { key: 'IN_TRANSIT', label: 'In Transit' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const rtoSteps = [
    { key: 'PICKED_UP', label: 'Picked Up' },
    { key: 'IN_TRANSIT', label: 'In Transit' },
    { key: 'NDR', label: 'Attempt Failed' },
    { key: 'RTO_IN_TRANSIT', label: 'Return Initiated' },
    { key: 'RTO_DELIVERED', label: 'Returned' },
  ];

  const activeSteps = isRTO ? rtoSteps : forwardSteps;

  const getStepIndex = () => {
    const s = String(currentStatus).toUpperCase();
    if (isDelivered || s.includes('DELIVERED')) return activeSteps.length - 1;
    if (s.includes('OUT FOR DELIVERY')) return 3;
    if (s.includes('IN TRANSIT') || s.includes('TRANSIT')) return isRTO ? 1 : 2;
    if (s.includes('PICKED UP')) return isRTO ? 0 : 1;
    if (s.includes('NDR') || s.includes('FAILED')) return 2;
    if (s.includes('RTO')) return isRTO ? 3 : 2;
    return 1;
  };

  const activeStepIdx = getStepIndex();
  const displayActivities = showAllScans ? activities : activities.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Main Status & Location Hero Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Top Dark Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#1e3415] p-6 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-emerald-400">
                <FiTruck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-white">Live Tracking Details</h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full border font-bold flex items-center gap-1.5 ${badge.bg}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                    {badge.label}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Courier Partner:{' '}
                  <span className="font-semibold text-white">{courierName}</span>
                  {order?.orderId && (
                    <>
                      {' • '}Order ID:{' '}
                      <span className="font-semibold text-white">#{order.orderId}</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Refresh / Sync Button */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all disabled:opacity-50"
                title="Fetch live location update"
              >
                <FiRefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh Live Status'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tracking Number Bar */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 font-medium">Tracking / AWB Number:</span>
            <span className="font-mono font-bold text-gray-900 text-sm">{awb}</span>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors font-medium text-xs shadow-2xs"
          >
            {copied ? <FiCheck className="w-3.5 h-3.5 text-emerald-600" /> : <FiCopy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy AWB'}</span>
          </button>
        </div>

        {/* Current Location Highlight Banner */}
        <div className="p-6 bg-gradient-to-br from-emerald-50/70 via-white to-blue-50/50 border-b border-gray-100">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-600/20">
                <FiMapPin className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-emerald-800">
                  Current Parcel Location
                </p>
                <h3 className="text-lg sm:text-xl font-black text-gray-900 mt-0.5">
                  {currentLocation}
                </h3>
                {tracking.status_description && (
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    Remark: {tracking.status_description}
                  </p>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              {tracking.edd ? (
                <div className="inline-block bg-white px-3.5 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
                  <p className="text-[11px] text-gray-500">Estimated Delivery</p>
                  <p className="text-sm font-bold text-emerald-700">
                    {new Date(tracking.edd).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              ) : tracking.last_updated ? (
                <div>
                  <p className="text-[11px] text-gray-500">Last Scanned</p>
                  <p className="text-xs font-semibold text-gray-800">
                    {new Date(tracking.last_updated).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* RTO Alert banner if returning */}
          {isRTO && (
            <div className="mt-4 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 text-xs">
              <FiRotateCcw className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Return to Origin in Progress: </span>
                This package is returning back to the sender.
                {tracking.rto_reason && (
                  <span className="block mt-0.5 font-medium text-red-800">
                    Reason: {tracking.rto_reason}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Visual Progress Stepper */}
        <div className="p-6 sm:p-8 border-b border-gray-100 bg-white">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-6">
            Delivery Progress Stages
          </p>

          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-4 left-4 right-4 h-1.5 bg-gray-100 -z-0 rounded-full">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isRTO ? 'bg-red-500' : 'bg-[#2d4e24]'
                }`}
                style={{
                  width: `${Math.min(100, (activeStepIdx / (activeSteps.length - 1)) * 100)}%`,
                }}
              ></div>
            </div>

            {/* Steps circles */}
            <div className="flex justify-between relative z-10">
              {activeSteps.map((step, idx) => {
                const isPastOrCurrent = idx <= activeStepIdx;
                const isCurrent = idx === activeStepIdx;

                let circleStyle = 'bg-white text-gray-400 border-gray-200 shadow-2xs';
                if (isPastOrCurrent) {
                  if (isRTO) {
                    circleStyle = isCurrent
                      ? 'bg-red-600 text-white border-red-600 ring-4 ring-red-100 shadow-md'
                      : 'bg-red-500 text-white border-red-500';
                  } else {
                    circleStyle = isCurrent
                      ? 'bg-[#2d4e24] text-white border-[#2d4e24] ring-4 ring-emerald-100 shadow-md'
                      : 'bg-emerald-600 text-white border-emerald-600';
                  }
                }

                return (
                  <div key={step.key} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${circleStyle}`}
                    >
                      {idx < activeStepIdx ? (
                        <FiCheck className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs mt-2.5 font-medium text-center max-w-[70px] sm:max-w-[90px] leading-tight ${
                        isCurrent
                          ? isRTO
                            ? 'text-red-700 font-bold'
                            : 'text-[#2d4e24] font-bold'
                          : isPastOrCurrent
                          ? 'text-gray-900 font-medium'
                          : 'text-gray-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Checkpoint Scans Timeline */}
        <div className="p-6 sm:p-8 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gray-100 text-gray-700">
                <FiClock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">Journey History & Checkpoints</h4>
                <p className="text-xs text-gray-500">Real-time scan logs from courier partner hubs</p>
              </div>
            </div>

            {activities.length > 5 && (
              <button
                onClick={() => setShowAllScans(!showAllScans)}
                className="text-xs text-emerald-800 font-bold hover:text-emerald-950 flex items-center gap-1 transition-colors"
              >
                <span>{showAllScans ? 'Show Less' : `View All (${activities.length})`}</span>
                {showAllScans ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            )}
          </div>

          {activities.length === 0 ? (
            <div className="bg-gray-50 rounded-2xl p-6 text-center text-gray-500 text-xs">
              <FiPackage className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p>Tracking has been initiated. Hub checkpoints will populate as the courier scans the parcel.</p>
            </div>
          ) : (
            <div className="relative pl-2 sm:pl-4 space-y-6">
              {displayActivities.map((act, i) => {
                const isLatest = i === 0;
                return (
                  <div key={i} className="relative flex gap-4 text-xs">
                    {/* Vertical line */}
                    {i < displayActivities.length - 1 && (
                      <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-gray-200"></div>
                    )}

                    {/* Dot */}
                    <div
                      className={`relative z-10 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isLatest
                          ? isRTO
                            ? 'bg-red-500 ring-4 ring-red-100 text-white'
                            : 'bg-emerald-600 ring-4 ring-emerald-100 text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isLatest ? 'bg-white' : 'bg-gray-400'
                        }`}
                      ></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p
                          className={`font-bold ${
                            isLatest ? 'text-gray-900 text-sm' : 'text-gray-700 text-xs'
                          }`}
                        >
                          {act.activity || act.status}
                        </p>
                        <span className="text-[11px] text-gray-400 font-medium">
                          {act.date
                            ? new Date(act.date).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                              })
                            : ''}
                        </span>
                      </div>

                      <p className="text-gray-500 text-xs mt-0.5 flex items-center gap-1.5 font-medium">
                        <FiMapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>{act.location || 'In Transit Facility'}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Items in Package (Destination Card Removed) */}
      {order && order.items && order.items.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h4 className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-2">
              <FiBox className="w-4 h-4 text-[#2d4e24]" />
              Items in this Package ({order.items.length})
            </h4>

            <a
              href="https://wa.me/917080403322?text=Hi%2C%20I%20need%20help%20with%20my%20order%20tracking"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              <FiMessageSquare className="w-3.5 h-3.5" />
              <span>Have delivery questions? WhatsApp Support</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3.5 p-3 rounded-2xl bg-gray-50/80 border border-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded-xl bg-white border border-gray-100 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                    NM
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{item.title}</p>
                  <p className="text-[11px] text-gray-500">
                    Qty: {item.quantity} {item.variant ? `• ${item.variant}` : ''}
                  </p>
                </div>
                {item.price > 0 && (
                  <p className="text-xs font-bold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
