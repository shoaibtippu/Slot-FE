'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, MapPin, Navigation } from 'lucide-react';

interface LocationMapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number, address: string) => void;
}

// 7 decimal places: ~1 cm precision — plenty for GPS and avoids DB NUMERIC(12,9) overflow
function roundCoord(v: number): number {
  return Math.round(v * 1e7) / 1e7;
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

// Default center: Lahore
const DEFAULT_LAT = 31.5204;
const DEFAULT_LNG = 74.3587;

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  latitude,
  longitude,
  onLocationChange,
}) => {
  const mapDivRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

  const [loaded, setLoaded] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  const centerLat = latitude ?? DEFAULT_LAT;
  const centerLng = longitude ?? DEFAULT_LNG;

  // Load Google Maps JS API once
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).google?.maps) {
      setLoaded(true);
      return;
    }
    if (!API_KEY) {
      setScriptError('NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not set. Add it to .env.local to enable map picker.');
      return;
    }
    if (document.querySelector('#google-maps-script')) {
      // Script already injected by another instance — poll until ready
      const poll = setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((window as any).google?.maps) {
          setLoaded(true);
          clearInterval(poll);
        }
      }, 150);
      return () => clearInterval(poll);
    }
    setScriptLoading(true);
    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => { setLoaded(true); setScriptLoading(false); };
    script.onerror = () => { setScriptError('Failed to load Google Maps. Check your API key.'); setScriptLoading(false); };
    document.head.appendChild(script);
  }, []);

  const reverseGeocode = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (lat: number, lng: number, google: any) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (results: any[], status: string) => {
          const address = status === 'OK' && results[0] ? (results[0].formatted_address as string) : '';
          onLocationChange(roundCoord(lat), roundCoord(lng), address);
        },
      );
    },
    [onLocationChange],
  );

  // Init map once Maps API is loaded
  useEffect(() => {
    if (!loaded || !mapDivRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const google = (window as any).google;

    const map = new google.maps.Map(mapDivRef.current, {
      center: { lat: centerLat, lng: centerLng },
      zoom: latitude ? 15 : 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_CENTER },
    });
    mapRef.current = map;

    const marker = new google.maps.Marker({
      position: { lat: centerLat, lng: centerLng },
      map,
      draggable: true,
      title: 'Ground Location',
      animation: google.maps.Animation.DROP,
    });
    markerRef.current = marker;

    // Drag end — update coords + reverse geocode
    marker.addListener('dragend', () => {
      const pos = marker.getPosition();
      if (pos) reverseGeocode(pos.lat(), pos.lng(), google);
    });

    // Map click — move marker + update
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.addListener('click', (e: any) => {
      const lat = e.latLng.lat() as number;
      const lng = e.latLng.lng() as number;
      marker.setPosition({ lat, lng });
      reverseGeocode(lat, lng, google);
    });

    // Places Autocomplete on search input
    if (searchInputRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(searchInputRef.current, {
        fields: ['formatted_address', 'geometry'],
      });
      autocomplete.addListener('place_changed', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const place: any = autocomplete.getPlace();
        if (!place.geometry?.location) return;
        const lat = place.geometry.location.lat() as number;
        const lng = place.geometry.location.lng() as number;
        map.setCenter({ lat, lng });
        map.setZoom(16);
        marker.setPosition({ lat, lng });
        onLocationChange(roundCoord(lat), roundCoord(lng), place.formatted_address ?? '');
        if (searchInputRef.current) searchInputRef.current.value = '';
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const google = (window as any).google;
        if (mapRef.current && markerRef.current) {
          mapRef.current.setCenter({ lat, lng });
          mapRef.current.setZoom(16);
          markerRef.current.setPosition({ lat, lng });
          reverseGeocode(lat, lng, google);
        }
        setGpsLoading(false);
      },
      () => setGpsLoading(false),
    );
  };

  if (!API_KEY) {
    return (
      <div className="rounded-xl border-2 border-dashed border-amber-200 bg-amber-50 p-5 text-center space-y-2">
        <MapPin className="w-7 h-7 text-amber-400 mx-auto" />
        <p className="text-xs font-bold text-amber-800">Google Maps not configured</p>
        <p className="text-[11px] text-amber-700">
          Add <code className="bg-amber-100 px-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key</code> to{' '}
          <code className="bg-amber-100 px-1 rounded">.env.local</code> and restart the dev server.
        </p>
      </div>
    );
  }

  if (scriptError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 font-medium">
        {scriptError}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for an address or place…"
          className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-xs sm:text-sm text-gray-900 shadow-2xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 transition-all"
        />
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Map container */}
      <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-2xs" style={{ height: '340px' }}>
        {scriptLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <Loader2 className="w-6 h-6 text-emerald-600 animate-spin" />
          </div>
        )}
        <div ref={mapDivRef} className="w-full h-full" />

        {/* Use my location button */}
        <button
          type="button"
          onClick={handleUseMyLocation}
          disabled={gpsLoading || !loaded}
          title="Use my current location"
          className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors cursor-pointer"
        >
          {gpsLoading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Navigation className="w-3.5 h-3.5 text-emerald-600" />}
          My Location
        </button>
      </div>

      {/* Selected coordinates */}
      {latitude != null && longitude != null && (
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-lg">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <p className="text-[11px] font-semibold text-emerald-800">
            Pinned at {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
        </div>
      )}

      <p className="text-[11px] text-gray-400 font-medium">
        Click on the map or drag the marker to set your facility&apos;s location. You can also search by address above.
      </p>
    </div>
  );
};
