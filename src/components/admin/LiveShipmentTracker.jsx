'use client';

import { useState, useEffect } from 'react';
import {
  FiTruck,
  FiMapPin,
  FiCheckCircle,
  FiAlertTriangle,
  FiRotateCcw,
  FiRefreshCw,
  FiExternalLink,
  FiClock,
  FiBox,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';

export default function LiveShipmentTracker({ orderId, initialTracking, onSyncComplete }) {
  const [tracking, setTracking] = useState(initialTracking);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [showAllScans, setShowAllScans] = useState(false);

  const isTerminal =
    tracking?.isDelivered ||
    tracking?.currentStatus === 'DELIVERED' ||
    tracking?.currentStatus === 'RTO_DELIVERED' ||
    tracking?.currentStatus === 'CANCELLED';

  // Automatically sync when order is viewed or active stage changes
  useEffect(() => {
    if (isTerminal) return;

    const lastSyncTime = tracking?.lastSyncAt ? new Date(tracking.lastSyncAt).getTime() : 0;
    const timeSinceLastSync = Date.now() - lastSyncTime;
    const FIFTEEN_MINS = 15 * 60 * 1000;

    // 1. Silent sync on mount if stale (>15 mins old or never synced)
    if (timeSinceLastSync > FIFTEEN_MINS || !tracking?.currentStatus) {
      handleLiveSync(true);
    }

    // 2. Auto-polling interval: recheck every 10 minutes while tab is open
    const pollInterval = setInterval(() => {
      handleLiveSync(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(pollInterval);
  }, [orderId, isTerminal]);

  const handleLiveSync = async (silent = false) => {
    try {
      setIsSyncing(true);
      if (!silent) setSyncMessage('');

      const res = await fetch(`/api/admin/orders/${orderId}/tracking?sync=true`, {
        cache: 'no-store',
      });
      const data = await res.json();

      if (res.ok && data.success && data.tracking) {
        setTracking(data.tracking);
        if (!silent) {
          setSyncMessage('✅ Live tracking updated just now!');
        }
        if (onSyncComplete) {
          onSyncComplete(data.tracking);
        }
      } else if (!silent) {
        setSyncMessage(`⚠️ ${data.details || data.error || 'Courier server busy, showing latest saved status.'}`);
      }
    } catch (err) {
      console.error('Tracking sync error:', err);
      if (!silent) {
        setSyncMessage('⚠️ Sync failed. Please try again.');
      }
    } finally {
      setIsSyncing(false);
      if (!silent) {
        setTimeout(() => setSyncMessage(''), 6000);
      }
    }
  };

  const getStatusBadge = (status, isRTO) => {
    if (isRTO) {
      if (status === 'RTO_DELIVERED') {
        return {
          label: 'Returned to Warehouse',
          bg: 'bg-rose-900 text-rose-100 border-rose-700',
          dot: 'bg-rose-400',
        };
      }
      return {
        label: 'RTO In-Transit (Returning)',
        bg: 'bg-red-100 text-red-800 border-red-300',
        dot: 'bg-red-500',
      };
    }

    switch (status) {
      case 'DELIVERED':
        return {
          label: 'Delivered',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
        };
      case 'OUT_FOR_DELIVERY':
        return {
          label: 'Out for Delivery',
          bg: 'bg-purple-100 text-purple-800 border-purple-300',
          dot: 'bg-purple-500 animate-pulse',
        };
      case 'IN_TRANSIT':
        return {
          label: 'In Transit',
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-500 animate-pulse',
        };
      case 'PICKED_UP':
        return {
          label: 'Picked Up by Courier',
          bg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
          dot: 'bg-indigo-500',
        };
      case 'MANIFESTED':
        return {
          label: 'Manifested / Ready for Pickup',
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
        };
      case 'NDR':
        return {
          label: 'Delivery Exception / Action Needed',
          bg: 'bg-orange-100 text-orange-800 border-orange-300',
          dot: 'bg-orange-500',
        };
      case 'CANCELLED':
        return {
          label: 'Cancelled',
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          dot: 'bg-gray-500',
        };
      default:
        return {
          label: status || 'Shipped',
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-500',
        };
    }
  };

  if (!tracking || (!tracking.awb && !tracking.currentStatus)) {
    return null;
  }

  const badge = getStatusBadge(tracking.currentStatus, tracking.isRTO);
  const scans = tracking.scans || [];
  const displayScans = showAllScans ? scans : scans.slice(0, 4);

  const getPublicTrackingUrl = () => {
    if (tracking.provider === 'ekart' || tracking.awb?.startsWith('500') || tracking.awb?.startsWith('318')) {
      return `https://app.elite.ekartlogistics.in/track/${tracking.awb}`;
    }
    return `https://shiprocket.co/tracking/${tracking.awb}`;
  };

  // Standard Stepper steps calculation
  const forwardSteps = [
    { key: 'MANIFESTED', label: 'Manifested' },
    { key: 'PICKED_UP', label: 'Picked Up' },
    { key: 'IN_TRANSIT', label: 'In Transit' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
    { key: 'DELIVERED', label: 'Delivered' },
  ];

  const rtoSteps = [
    { key: 'PICKED_UP', label: 'Picked Up' },
    { key: 'IN_TRANSIT', label: 'In Transit' },
    { key: 'NDR', label: 'Failed Attempt' },
    { key: 'RTO_IN_TRANSIT', label: 'RTO Initiated' },
    { key: 'RTO_DELIVERED', label: 'Returned' },
  ];

  const currentStepKey = tracking.currentStatus;
  const isRtoFlow = Boolean(tracking.isRTO);
  const activeSteps = isRtoFlow ? rtoSteps : forwardSteps;

  const getStepIndex = () => {
    const idx = activeSteps.findIndex((s) => s.key === currentStepKey);
    if (idx !== -1) return idx;
    if (tracking.isDelivered) return activeSteps.length - 1;
    if (currentStepKey === 'IN_TRANSIT') return isRtoFlow ? 1 : 2;
    return 1;
  };

  const activeStepIdx = getStepIndex();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-5 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-teal-400">
            <FiTruck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white">Live Shipment Tracking</h3>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold flex items-center gap-1.5 ${badge.bg}`}>
                <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Carrier:{' '}
              <span className="font-semibold text-white">
                {tracking.courierPartner || (tracking.provider === 'ekart' ? 'Ekart Logistics' : 'Shiprocket')}
              </span>{' '}
              • AWB:{' '}
              <span className="font-mono font-bold text-amber-300">{tracking.awb}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-Sync Live Indicator */}
          {!isTerminal ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
              Auto-Sync: Active
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 text-slate-300 text-[11px]">
              Final Stage Reached
            </span>
          )}

          <a
            href={getPublicTrackingUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-slate-200 transition-colors"
          >
            <span>Carrier Portal</span>
            <FiExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={() => handleLiveSync(false)}
            disabled={isSyncing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
            title="Fetch real-time location from courier API"
          >
            <FiRefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Live'}</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className="bg-slate-100 text-slate-800 px-5 py-2 text-xs border-b border-slate-200 font-medium">
          {syncMessage}
        </div>
      )}

      {/* Current Location Highlight Banner */}
      <div className="p-5 border-b border-gray-100 bg-slate-50/70">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-teal-100 text-teal-800 mt-0.5">
              <FiMapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-gray-500">
                Current Location / Facility
              </p>
              <h4 className="text-base font-bold text-gray-900 mt-0.5">
                {tracking.currentLocation || 'Location being updated by courier'}
              </h4>
              {tracking.statusDescription && (
                <p className="text-xs text-gray-600 mt-0.5 font-medium">
                  Remark: {tracking.statusDescription}
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs text-gray-500">Last Synced</p>
            <p className="text-xs font-semibold text-gray-800">
              {tracking.lastSyncAt
                ? new Date(tracking.lastSyncAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : 'Just now'}
            </p>
            {tracking.estimatedDeliveryDate && (
              <p className="text-xs text-emerald-700 font-medium mt-1">
                Estimated Delivery: {new Date(tracking.estimatedDeliveryDate).toLocaleDateString('en-IN')}
              </p>
            )}
          </div>
        </div>

        {/* If RTO banner */}
        {tracking.isRTO && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 flex items-start gap-3 text-xs">
            <FiRotateCcw className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Return to Origin (RTO) Active: </span>
              This package was not delivered and is returning back to your warehouse.
              {tracking.rtoReason && (
                <span className="block mt-0.5 font-medium text-red-800">
                  Reported Reason: {tracking.rtoReason}
                </span>
              )}
            </div>
          </div>
        )}

        {/* If NDR banner */}
        {tracking.currentStatus === 'NDR' && !tracking.isRTO && (
          <div className="mt-4 p-3 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 flex items-start gap-3 text-xs">
            <FiAlertTriangle className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Delivery Exception (NDR): </span>
              Last delivery attempt was unsuccessful. Please contact the customer to confirm their availability before the courier initiates RTO.
            </div>
          </div>
        )}
      </div>

      {/* Visual Stepper */}
      <div className="p-6 border-b border-gray-100">
        <div className="relative">
          <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 -z-0">
            <div
              className={`h-full transition-all duration-500 ${
                isRtoFlow ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{
                width: `${Math.min(100, (activeStepIdx / (activeSteps.length - 1)) * 100)}%`,
              }}
            ></div>
          </div>

          <div className="flex justify-between relative z-10">
            {activeSteps.map((step, idx) => {
              const isPastOrCurrent = idx <= activeStepIdx;
              const isCurrent = idx === activeStepIdx;

              let circleClass = 'bg-gray-200 text-gray-400 border-gray-300';
              if (isPastOrCurrent) {
                if (isRtoFlow) {
                  circleClass = isCurrent
                    ? 'bg-red-600 text-white border-red-600 ring-4 ring-red-100'
                    : 'bg-red-500 text-white border-red-500';
                } else {
                  circleClass = isCurrent
                    ? 'bg-emerald-600 text-white border-emerald-600 ring-4 ring-emerald-100'
                    : 'bg-emerald-500 text-white border-emerald-500';
                }
              }

              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${circleClass}`}
                  >
                    {idx < activeStepIdx ? (
                      <FiCheckCircle className="w-4 h-4" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] mt-2 font-medium text-center max-w-[80px] ${
                      isCurrent
                        ? isRtoFlow
                          ? 'text-red-700 font-bold'
                          : 'text-emerald-700 font-bold'
                        : isPastOrCurrent
                        ? 'text-gray-900'
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

      {/* Scans Timeline */}
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h5 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <FiClock className="w-4 h-4 text-gray-500" />
            Checkpoints & Scan History ({scans.length})
          </h5>
          {scans.length > 4 && (
            <button
              onClick={() => setShowAllScans(!showAllScans)}
              className="text-xs text-teal-700 font-semibold hover:text-teal-900 flex items-center gap-1"
            >
              <span>{showAllScans ? 'Show Less' : `View All (${scans.length})`}</span>
              {showAllScans ? <FiChevronUp /> : <FiChevronDown />}
            </button>
          )}
        </div>

        {scans.length === 0 ? (
          <p className="text-xs text-gray-500 italic">No checkpoint scans received yet from courier.</p>
        ) : (
          <div className="space-y-4">
            {displayScans.map((scan, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full mt-1 ${
                      i === 0
                        ? isRtoFlow
                          ? 'bg-red-500 ring-2 ring-red-200'
                          : 'bg-emerald-500 ring-2 ring-emerald-200'
                        : 'bg-gray-300'
                    }`}
                  ></div>
                  {i < displayScans.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1"></div>}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-bold text-gray-900">{scan.activity || scan.status}</span>
                    <span className="text-gray-500 text-[11px]">
                      {scan.date
                        ? new Date(scan.date).toLocaleString('en-IN', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })
                        : ''}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-0.5 flex items-center gap-1 text-[11px]">
                    <FiMapPin className="w-3 h-3 text-gray-400" />
                    <span>{scan.location || 'Hub / Facility'}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
