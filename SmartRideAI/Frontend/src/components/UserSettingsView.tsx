import React, { useState } from 'react';
import {
  User,
  Mail,
  Shield,
  CreditCard,
  Sliders,
  Car,
  Bike,
  CarFront,
  Zap,
  Globe,
  Bell,
  CheckCircle,
  Save,
  Key,
  Compass,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

interface UserSettingsProps {
  currency: string;
  setCurrency: (c: string) => void;
}

export const UserSettingsView: React.FC<UserSettingsProps> = ({ currency, setCurrency }) => {
  const [userName, setUserName] = useState('Karthik AM');
  const [userEmail, setUserEmail] = useState('karthikam083@gmail.com');
  const [surgeThreshold, setSurgeThreshold] = useState(1.5);
  const [autoBacktrack, setAutoBacktrack] = useState(true);
  const [rainSafeguard, setRainSafeguard] = useState(true);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>('km');
  const [preferredTiers, setPreferredTiers] = useState<string[]>([
    'uber_go',
    'auto_rickshaw',
    'rapido_bike',
    'uber_premier',
  ]);
  const [savedToast, setSavedToast] = useState(false);

  const toggleTier = (tier: string) => {
    if (preferredTiers.includes(tier)) {
      if (preferredTiers.length > 1) {
        setPreferredTiers(preferredTiers.filter((t) => t !== tier));
      }
    } else {
      setPreferredTiers([...preferredTiers, tier]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
            KA
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Settings & User Account</h2>
            <p className="text-xs text-slate-500">
              Manage your travel profile, ReAct agent constraints, and SmartRide vehicle preferences.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Shield className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Pro Plan Explorer
          </span>
        </div>
      </div>

      {savedToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Preferences and agent tuning parameters saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. Profile & Account Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Profile & Account Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <input
                id="input-settings-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="input-settings-email"
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Autonomous ReAct Agent Parameters */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Autonomous ReAct Agent & Multi-Tool Tuning
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Surge Threshold */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" /> Max Surge Backtracking Trigger
                </span>
                <span className="text-emerald-700 font-mono">{surgeThreshold}x Surge</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Agent will automatically backtrack and switch to public transit or alternate departure windows if surge multiplier exceeds this value.
              </p>
              <input
                id="slider-surge-threshold"
                type="range"
                min={1.1}
                max={2.5}
                step={0.1}
                value={surgeThreshold}
                onChange={(e) => setSurgeThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>1.1x (Strict Budget)</span>
                <span>1.5x (Balanced)</span>
                <span>2.5x (Speed Priority)</span>
              </div>
            </div>

            {/* Weather Rain Safeguard */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Globe className="w-4 h-4 text-sky-500" /> Dynamic Rain Re-Routing
                  </span>
                  <input
                    id="checkbox-rain-safeguard"
                    type="checkbox"
                    checked={rainSafeguard}
                    onChange={(e) => setRainSafeguard(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Automatically swap outdoor sights (parks, viewpoints) with covered cultural museums if precipitation probability &gt; 50%.
                </p>
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold mt-2">
                {rainSafeguard ? '✓ Safeguard Active' : '✕ Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Preferred SmartRide Vehicle Tiers */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Car className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              SmartRide Vehicle Fleet Eligibility
            </h3>
          </div>

          <p className="text-xs text-slate-500">
            Select vehicle categories the agent should consider when calculating transit connectors:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { id: 'rapido_bike', name: 'Rapido Bike / Moto', icon: <Bike className="w-4 h-4 text-amber-600" />, desc: 'Solo fast transit' },
              { id: 'auto_rickshaw', name: 'Auto Rickshaw', icon: <CarFront className="w-4 h-4 text-emerald-600" />, desc: 'Local short trips' },
              { id: 'uber_go', name: 'Uber Go (AC)', icon: <Car className="w-4 h-4 text-blue-600" />, desc: 'Standard compact' },
              { id: 'uber_premier', name: 'Uber Premier', icon: <Sparkles className="w-4 h-4 text-purple-600" />, desc: 'Sedan comfort' },
              { id: 'uber_xl', name: 'Uber XL', icon: <Layers className="w-4 h-4 text-indigo-600" />, desc: '6-Seater SUV' },
            ].map((tier) => {
              const active = preferredTiers.includes(tier.id);
              return (
                <div
                  key={tier.id}
                  id={`tier-setting-${tier.id}`}
                  onClick={() => toggleTier(tier.id)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition ${
                    active ? 'bg-emerald-50/50 border-emerald-600' : 'bg-white border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    {tier.icon}
                    <span className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-600' : 'bg-slate-300'}`}></span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{tier.name}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">{tier.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Currency & Measurement Preferences */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
            <Globe className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Localization & Units
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Default Currency</label>
              <div className="grid grid-cols-4 gap-2">
                {(['USD', 'INR', 'EUR', 'GBP'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      currency === curr
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Distance Unit</label>
              <div className="grid grid-cols-2 gap-2">
                {(['km', 'miles'] as const).map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setDistanceUnit(unit)}
                    className={`py-2 text-xs font-bold rounded-xl border transition capitalize ${
                      distanceUnit === unit
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {unit === 'km' ? 'Kilometers (km)' : 'Miles (mi)'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            id="btn-save-settings"
            type="submit"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
