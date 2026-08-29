import React, { useState } from 'react';
import { SmartRideFareEngine } from '../services/fareEngine';
import { FareBreakdown, VehicleTier } from '../types/travel';
import {
  Car,
  Bike,
  CarFront,
  Sparkles,
  Truck,
  Zap,
  CloudRain,
  Clock,
  Navigation,
  DollarSign,
  Leaf,
  ShieldCheck,
  TrendingDown,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface SmartRideCalculatorProps {
  currency: string;
}

export const SmartRideCalculator: React.FC<SmartRideCalculatorProps> = ({ currency }) => {
  const [distanceKm, setDistanceKm] = useState<number>(8.5);
  const [trafficIndex, setTrafficIndex] = useState<number>(1.6);
  const [isPeakHour, setIsPeakHour] = useState<boolean>(true);
  const [isRainy, setIsRainy] = useState<boolean>(false);
  const [selectedTier, setSelectedTier] = useState<VehicleTier>('uber_go');

  const estimates: FareBreakdown[] = SmartRideFareEngine.calculateAllTiers({
    distanceKm,
    trafficIndex,
    isPeakHour,
    isRainy,
  });

  const activeBreakdown = estimates.find((e) => e.tier === selectedTier) || estimates[2];

  const getTierIcon = (tier: VehicleTier) => {
    switch (tier) {
      case 'rapido_bike':
        return <Bike className="w-5 h-5 text-amber-600" />;
      case 'auto_rickshaw':
        return <CarFront className="w-5 h-5 text-emerald-600" />;
      case 'uber_go':
        return <Car className="w-5 h-5 text-blue-600" />;
      case 'uber_premier':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'uber_xl':
        return <Truck className="w-5 h-5 text-indigo-600" />;
    }
  };

  const chartData = estimates.map((e) => ({
    name: e.name.split('/')[0].trim(),
    fare: e.estimatedFare,
    tier: e.tier,
    carbon: e.carbonKg,
    eta: e.durationMinutes,
  }));

  const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#6366f1'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
              <Car className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              SmartRide ML Fare Estimation & Surge Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate real-time route dynamics with traffic bottleneck factors, surge multipliers, and multi-tier pricing transparency.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> Surge Multiplier: {activeBreakdown.surgeMultiplier}x
          </span>
        </div>
      </div>

      {/* Simulator Sliders & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
        {/* Distance Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1">
              <Navigation className="w-3.5 h-3.5 text-blue-600" /> Route Distance
            </span>
            <span className="text-blue-700 font-mono">{distanceKm.toFixed(1)} km</span>
          </div>
          <input
            id="slider-distance"
            type="range"
            min={0.5}
            max={40}
            step={0.5}
            value={distanceKm}
            onChange={(e) => setDistanceKm(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.5 km (Short)</span>
            <span>20 km (City)</span>
            <span>40 km (Airport)</span>
          </div>
        </div>

        {/* Traffic Index Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Traffic Index
            </span>
            <span className="text-amber-700 font-mono">
              {trafficIndex < 1.4 ? 'Light (1.0x)' : trafficIndex < 2.2 ? 'Moderate (1.8x)' : 'Gridlock (2.8x)'}
            </span>
          </div>
          <input
            id="slider-traffic"
            type="range"
            min={1.0}
            max={3.0}
            step={0.1}
            value={trafficIndex}
            onChange={(e) => setTrafficIndex(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>Free Flow</span>
            <span>Bottleneck</span>
            <span>Severe Jam</span>
          </div>
        </div>

        {/* Peak Hour Toggle */}
        <div className="flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-2">
            <Zap className="w-3.5 h-3.5 text-rose-500" /> Peak Rush Hour
          </span>
          <button
            id="btn-toggle-peak"
            onClick={() => setIsPeakHour(!isPeakHour)}
            className={`w-full py-2 px-3 text-xs font-bold rounded-xl border transition flex items-center justify-center space-x-2 ${
              isPeakHour
                ? 'bg-rose-50 border-rose-400 text-rose-800'
                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isPeakHour ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span>{isPeakHour ? 'Rush Hour (+35% Surge)' : 'Off-Peak Normal'}</span>
          </button>
        </div>

        {/* Rain / Weather Toggle */}
        <div className="flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mb-2">
            <CloudRain className="w-3.5 h-3.5 text-sky-500" /> Rain Weather Surge
          </span>
          <button
            id="btn-toggle-rain"
            onClick={() => setIsRainy(!isRainy)}
            className={`w-full py-2 px-3 text-xs font-bold rounded-xl border transition flex items-center justify-center space-x-2 ${
              isRainy
                ? 'bg-sky-50 border-sky-400 text-sky-800'
                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CloudRain className={`w-3.5 h-3.5 ${isRainy ? 'text-sky-600' : 'text-slate-400'}`} />
            <span>{isRainy ? 'Rain / Storm (+25% Surge)' : 'Dry & Clear'}</span>
          </button>
        </div>
      </div>

      {/* 5 Vehicle Tiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {estimates.map((est) => {
          const isSelected = selectedTier === est.tier;

          return (
            <div
              key={est.tier}
              id={`card-tier-${est.tier}`}
              onClick={() => setSelectedTier(est.tier)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition relative ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {est.tier === 'rapido_bike' && (
                <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  Fastest in Jam
                </span>
              )}
              {est.tier === 'uber_go' && (
                <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                  Best Value
                </span>
              )}

              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  {getTierIcon(est.tier)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{est.name.split('/')[0]}</h4>
                  <span className="text-[10px] text-slate-500">{est.category}</span>
                </div>
              </div>

              <div className="mt-3">
                <span className="text-lg font-black text-slate-900">
                  {currency} {est.estimatedFare}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Range: {currency} {est.fareRange.min} - {est.fareRange.max}
                </span>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>ETA:</span>
                  <span className="font-bold text-slate-800">{est.durationMinutes} mins</span>
                </div>
                <div className="flex justify-between">
                  <span>CO₂ Impact:</span>
                  <span className="font-mono text-slate-700">{est.carbonKg} kg</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Fare Breakdown of Selected Vehicle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 text-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              {getTierIcon(activeBreakdown.tier)}
              <h4 className="text-sm font-bold text-white">
                {activeBreakdown.name} — Algorithmic Fare Audit
              </h4>
            </div>
            <span className="text-xs text-emerald-400 font-bold">
              Surge: {activeBreakdown.surgeMultiplier}x ({activeBreakdown.surgeReason})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Base Fare</span>
              <span className="font-bold text-slate-200">{currency} {activeBreakdown.baseFare}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Distance Rate</span>
              <span className="font-bold text-slate-200">{currency} {activeBreakdown.perKmRate}/km</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Time Rate</span>
              <span className="font-bold text-slate-200">{currency} {activeBreakdown.perMinuteRate}/min</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Weather Coeff.</span>
              <span className="font-bold text-slate-200">{activeBreakdown.weatherFactor}x</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Choosing <b>{activeBreakdown.name.split('/')[0]}</b> saves <b>{currency} {activeBreakdown.savingsVsHighest}</b> compared to SUV/XL tiers.
              </span>
            </div>
            <span className="font-bold text-emerald-300 shrink-0 ml-2">Eco Impact: {activeBreakdown.carbonKg}kg CO₂</span>
          </div>
        </div>

        {/* Visual Bar Comparison */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-800 mb-2">Price vs Vehicle Tier Comparison</h4>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${currency} ${val}`, 'Estimated Fare']}
                  contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                />
                <Bar dataKey="fare" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
