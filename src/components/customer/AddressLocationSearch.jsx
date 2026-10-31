'use client';

import React, { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { MapPin, Navigation, Search, Check, Loader2 } from 'lucide-react';

export default function AddressLocationSearch({ onAddressSelect, areaOptions = [], onAreaSelect }) {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [locating, setLocating] = useState(false);
  const [locationSuccess, setLocationSuccess] = useState('');
  const [locationError, setLocationError] = useState('');
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Initialize Google Places Autocomplete if API Key is available
  useEffect(() => {
    if (!googleLoaded || !inputRef.current || !window.google?.maps?.places) return;

    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'in' },
        fields: ['address_components', 'formatted_address', 'name', 'geometry'],
      });

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (!place || !place.address_components) return;

        let houseNumber = '';
        let streetParts = [];
        let city = '';
        let state = '';
        let pincode = '';
        let landmark = '';

        place.address_components.forEach((component) => {
          const types = component.types;
          if (types.includes('subpremise') || types.includes('premise') || types.includes('street_number')) {
            houseNumber = houseNumber ? `${houseNumber}, ${component.long_name}` : component.long_name;
          } else if (types.includes('route') || types.includes('sublocality_level_1') || types.includes('sublocality')) {
            streetParts.push(component.long_name);
          } else if (types.includes('locality') || types.includes('administrative_area_level_2')) {
            if (!city) city = component.long_name;
          } else if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
          } else if (types.includes('postal_code')) {
            pincode = component.long_name;
          } else if (types.includes('point_of_interest') || types.includes('establishment')) {
            landmark = component.long_name;
          }
        });

        // If place has a specific establishment name (e.g. apartment, hostel, building name)
        if (place.name && !streetParts.includes(place.name)) {
          if (!houseNumber) {
            houseNumber = place.name;
          } else {
            streetParts.unshift(place.name);
          }
        }

        onAddressSelect({
          houseNumber,
          street: streetParts.join(', '),
          city,
          state,
          pincode,
          landmark,
          formattedAddress: place.formatted_address,
        });

        setLocationSuccess(`Selected: ${place.name || place.formatted_address}`);
        setTimeout(() => setLocationSuccess(''), 4000);
      });
    } catch (e) {
      console.warn('Google Places init error:', e);
    }
  }, [googleLoaded, onAddressSelect]);

  // GPS Geolocation auto-detection
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationError('');
    setLocationSuccess('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Free reverse geocoding for Indian coordinates
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            const city = data.city || data.locality || data.principalSubdivisionDistrict || '';
            const state = data.principalSubdivision || '';
            const pincode = data.postcode || '';
            const area = data.localityInfo?.administrative?.[3]?.name || data.locality || '';

            onAddressSelect({
              city,
              state,
              pincode,
              street: area ? `Near ${area}` : '',
            });

            setLocationSuccess(`Location detected: ${city}, ${state} (${pincode})`);
            setTimeout(() => setLocationSuccess(''), 4500);
          } else {
            throw new Error('Reverse geocode failed');
          }
        } catch (err) {
          setLocationError('Could not fetch exact address from GPS. Please enter your Pincode.');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setLocationError('Location permission denied. Please enter Pincode manually.');
        } else {
          setLocationError('Unable to retrieve location. Please enter Pincode.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="mb-3.5 space-y-2">
      {/* Script for Google Places if API key is configured */}
      {googleApiKey && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places`}
          strategy="lazyOnload"
          onLoad={() => setGoogleLoaded(true)}
        />
      )}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* Google Places search bar if API key is active */}
        {googleApiKey ? (
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={inputRef}
              type="text"
              placeholder="🔍 Search building, society or hostel to auto-fill..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-[11px] focus:outline-none focus:border-[#415f2d] focus:ring-1 focus:ring-[#415f2d] bg-white placeholder-gray-400"
            />
          </div>
        ) : null}

        {/* GPS Quick Auto-Detect Button */}
        <button
          type="button"
          onClick={handleDetectLocation}
          disabled={locating}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2 border border-emerald-600/30 bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-900 rounded-lg text-[11px] font-bold transition-all disabled:opacity-50 cursor-pointer shadow-2xs whitespace-nowrap"
        >
          {locating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
              <span>Detecting Location...</span>
            </>
          ) : (
            <>
              <Navigation className="w-3.5 h-3.5 text-emerald-700 fill-emerald-600/20" />
              <span>📍 Detect Current Location</span>
            </>
          )}
        </button>
      </div>

      {/* Status Notifications */}
      {locationSuccess && (
        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-medium flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>{locationSuccess}</span>
        </div>
      )}
      {locationError && (
        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-medium">
          {locationError}
        </div>
      )}

      {/* Pincode Post Office / Area Quick-Pick Pill Badges */}
      {areaOptions && areaOptions.length > 0 && (
        <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-200">
          <p className="text-[10px] font-bold text-gray-700 mb-1.5 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#415f2d]" />
            <span>Select Your Locality / Post Office (Tap to auto-fill):</span>
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {areaOptions.map((area, idx) => (
              <button
                key={`${area.name}-${idx}`}
                type="button"
                onClick={() => onAreaSelect && onAreaSelect(area.name)}
                className="text-[10px] font-semibold bg-white hover:bg-[#415f2d] hover:text-white text-gray-800 px-2 py-0.5 rounded-md border border-gray-200 shadow-2xs transition-colors cursor-pointer"
              >
                + {area.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
