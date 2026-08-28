import React, { useEffect, useRef, useState } from 'react';
import { TravelPlan } from '../types/travel';
import L from 'leaflet';
import { MapPin, Navigation, Car, Layers, Info, Calendar } from 'lucide-react';

interface InteractiveMapProps {
  plan: TravelPlan;
  currency: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ plan, currency }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Gather all points
    const points: Array<{
      lat: number;
      lng: number;
      title: string;
      category: string;
      day?: number;
      timeSlot?: string;
      fare?: number;
      tier?: string;
    }> = [];

    // Hotel point
    const baseLat = plan.days[0]?.morning[0]?.lat || 35.6762;
    const baseLng = plan.days[0]?.morning[0]?.lng || 139.6503;

    if (plan.selectedHotel) {
      points.push({
        lat: baseLat - 0.015,
        lng: baseLng - 0.015,
        title: `Hotel: ${plan.selectedHotel.name}`,
        category: 'Hotel',
      });
    }

    // Attractions
    plan.days.forEach((d) => {
      [...d.morning, ...d.afternoon, ...d.evening].forEach((act) => {
        points.push({
          lat: act.lat,
          lng: act.lng,
          title: act.title,
          category: act.type,
          day: d.dayNumber,
          timeSlot: act.timeSlot,
          fare: act.rideToNext?.estimatedFare,
          tier: act.rideToNext?.recommendedTier,
        });
      });
    });

    // Initialize Leaflet Map
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [baseLat, baseLng],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear existing markers/lines
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const bounds = L.latLngBounds([]);
    const filteredPoints = activeDayFilter === 'all' ? points : points.filter((p) => !p.day || p.day === activeDayFilter);

    // Custom Icon generator
    const createCustomIcon = (color: string, label: string) => {
      return L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            background-color: ${color};
            color: white;
            font-weight: bold;
            font-size: 11px;
            padding: 3px 6px;
            border-radius: 10px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);
            border: 2px solid white;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
          ">
            <span>📍</span>
            <span>${label}</span>
          </div>
        `,
        iconSize: [80, 26],
        iconAnchor: [40, 13],
      });
    };

    // Add markers
    filteredPoints.forEach((pt) => {
      const latLng = L.latLng(pt.lat, pt.lng);
      bounds.extend(latLng);

      const color = pt.category === 'Hotel' ? '#f59e0b' : pt.day === 1 ? '#10b981' : pt.day === 2 ? '#3b82f6' : '#8b5cf6';
      const label = pt.category === 'Hotel' ? 'Hotel' : `D${pt.day} ${pt.timeSlot || ''}`;

      const marker = L.marker(latLng, {
        icon: createCustomIcon(color, label),
      }).addTo(map);

      const popupHtml = `
        <div style="font-family: sans-serif; font-size: 12px; min-width: 170px; padding: 4px;">
          <h4 style="margin: 0 0 4px; font-size: 13px; font-weight: bold; color: #0f172a;">${pt.title}</h4>
          <p style="margin: 0 0 6px; color: #64748b; font-size: 11px;">Category: ${pt.category}</p>
          ${pt.fare ? `<div style="background: #ecfdf5; padding: 4px 6px; border-radius: 6px; color: #065f46; font-weight: bold; font-size: 11px;">🚕 SmartRide: ${currency} ${pt.fare}</div>` : ''}
        </div>
      `;
      marker.bindPopup(popupHtml);
    });

    // Draw route polylines
    if (filteredPoints.length > 1) {
      const routeCoords = filteredPoints.map((p) => [p.lat, p.lng] as [number, number]);
      L.polyline(routeCoords, {
        color: '#059669',
        weight: 3,
        opacity: 0.8,
        dashArray: '6, 6',
      }).addTo(map);
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }

    // Leaflet container invalidation for smooth responsiveness on window resize / tab change
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [plan, activeDayFilter, currency]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Interactive Route Map & Transit Waypoints
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualizes day-by-day attraction stops, hotel base, and optimized SmartRide transit legs.
          </p>
        </div>

        {/* Day Filter selector */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            id="btn-map-filter-all"
            onClick={() => setActiveDayFilter('all')}
            className={`px-3 py-1 rounded-lg transition whitespace-nowrap ${
              activeDayFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            All Route Legs
          </button>
          {plan.days.map((d) => (
            <button
              key={d.dayNumber}
              id={`btn-map-filter-d${d.dayNumber}`}
              onClick={() => setActiveDayFilter(d.dayNumber)}
              className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                activeDayFilter === d.dayNumber ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Day {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-[380px] sm:h-[480px] rounded-xl overflow-hidden border border-slate-200">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Legend */}
        <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-slate-200 shadow-md text-[11px] sm:text-xs space-y-1 pointer-events-none max-w-[200px] sm:max-w-none">
          <span className="font-bold text-slate-800 block mb-0.5">Route Legend</span>
          <div className="flex items-center space-x-2 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Hotel Accommodation</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Day 1 Attractions</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Day 2 Attractions</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
            <span>Day 3+ Attractions</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <span className="w-3.5 h-0.5 border-t-2 border-dashed border-emerald-600"></span>
            <span>SmartRide Transit Leg</span>
          </div>
        </div>
      </div>
    </div>
  );
};
