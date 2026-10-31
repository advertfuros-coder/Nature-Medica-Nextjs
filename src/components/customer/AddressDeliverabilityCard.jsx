'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle2, Info, Truck, HelpCircle } from 'lucide-react';

export default function AddressDeliverabilityCard({ hygiene }) {
  if (!hygiene) return null;

  const {
    score = 0,
    tier = 'poor',
    tierLabel = 'High RTO Risk',
    color = 'rose',
    badgeColor = 'bg-rose-100 text-rose-800 border-rose-300',
    barColor = 'bg-rose-500',
    checks = [],
    warnings = [],
    isDeliverable = false,
    hostelMissingRoom = false,
    isVague = false,
    logisticsPartner = 'Ekart & Shiprocket AI Deliverability'
  } = hygiene;

  return (
    <div
      className={`rounded-xl border p-3.5 transition-all mb-4 ${
        isDeliverable
          ? 'bg-emerald-50/60 border-emerald-200'
          : score >= 50
          ? 'bg-amber-50/70 border-amber-300'
          : 'bg-rose-50/70 border-rose-300'
      }`}
    >
      {/* Header with Logistics Partner Branding and Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-gray-200/80">
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isDeliverable ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-gray-900 tracking-tight">
                {logisticsPartner}
              </span>
              <span className="text-[9px] bg-white border border-gray-200 text-gray-600 font-bold px-1.5 py-0.2 rounded">
                Address Hygiene Score
              </span>
            </div>
            <p className="text-[10px] text-gray-600 mt-0.5">
              Real-time courier deliverability check for 0% RTO &amp; zero-delay dispatch
            </p>
          </div>
        </div>

        {/* Score & Tier Badge */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <div className="text-right">
            <span className="text-xs font-bold text-gray-500 block text-[9px] uppercase tracking-wider">
              Score
            </span>
            <span
              className={`text-base sm:text-lg font-black leading-none ${
                score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-green-700' : score >= 40 ? 'text-amber-700' : 'text-rose-700'
              }`}
            >
              {score}
              <span className="text-[10px] font-semibold text-gray-400">/100</span>
            </span>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-lg border whitespace-nowrap ${badgeColor}`}
          >
            {tierLabel}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-2.5">
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${barColor}`}
            style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
          />
        </div>
      </div>

      {/* Campus / Hostel Alert */}
      {(hostelMissingRoom || isVague) && (
        <div className="mt-2.5 p-2.5 rounded-lg bg-rose-100/90 border border-rose-300 text-rose-950 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-700 flex-shrink-0 mt-0.5" />
          <div className="text-[11px] leading-tight">
            <p className="font-bold">
              {isVague
                ? 'Address too vague ("Hostel" or short name alone)'
                : 'Hostel / PG detected without Room Number!'}
            </p>
            <p className="text-[10px] text-rose-800 mt-0.5">
              Couriers from Ekart &amp; Shiprocket are strictly stopped at campus gates without a specific
              <strong> Room Number, Hostel Name, and Campus Gate</strong>. Please provide them to ensure delivery.
            </p>
          </div>
        </div>
      )}

      {/* Diagnostic Checklist */}
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {checks.map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] ${
              item.status === 'pass'
                ? 'bg-white/80 text-emerald-900 border border-emerald-200'
                : item.status === 'warning'
                ? 'bg-amber-100/60 text-amber-900 border border-amber-200'
                : item.status === 'info'
                ? 'bg-blue-50/70 text-blue-900 border border-blue-200'
                : 'bg-rose-100/60 text-rose-900 border border-rose-200'
            }`}
          >
            {item.status === 'pass' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            ) : item.status === 'warning' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
            ) : item.status === 'info' ? (
              <Info className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            )}
            <span className="truncate font-medium">{item.hint}</span>
          </div>
        ))}
      </div>

      {/* Actionable Advice Footer */}
      {!isDeliverable && warnings.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px] text-gray-700">
          <span className="font-semibold text-rose-700">
            ⚠️ Minimum 60% Deliverability Score required to place order
          </span>
          <span className="text-gray-500 italic">
            Add House No. &amp; Street to unlock
          </span>
        </div>
      )}

      {isDeliverable && (
        <div className="mt-2.5 pt-2 border-t border-emerald-200/80 flex items-center gap-1.5 text-[10px] font-semibold text-emerald-800">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>✓ Address verified for priority dispatch by Ekart &amp; Shiprocket logistics network.</span>
        </div>
      )}
    </div>
  );
}
