import React, { useState } from 'react';
import { PlanTripRequest } from '../types/travel';
import { Sparkles, MapPin, Calendar, DollarSign, Users, Compass, Car, Sliders, ChevronDown, CheckCircle2 } from 'lucide-react';

interface AgentPlannerFormProps {
  onPlanTrip: (params: PlanTripRequest) => void;
  isPlanning: boolean;
  currency: string;
  initialValues?: Partial<PlanTripRequest>;
}

export const AgentPlannerForm: React.FC<AgentPlannerFormProps> = ({
  onPlanTrip,
  isPlanning,
  currency,
  initialValues,
}) => {
  const [destination, setDestination] = useState(initialValues?.destination || 'Tokyo, Japan');
  const [origin, setOrigin] = useState(initialValues?.origin || 'San Francisco, USA');
  const [durationDays, setDurationDays] = useState(initialValues?.durationDays || 3);
  const [budget, setBudget] = useState(initialValues?.budget || 1500);
  const [travelers, setTravelers] = useState(initialValues?.travelers || 1);
  const [travelStyle, setTravelStyle] = useState<PlanTripRequest['travelStyle']>(
    initialValues?.travelStyle || 'Balanced'
  );
  const [preferredRideTier, setPreferredRideTier] = useState<PlanTripRequest['preferredRideTier']>(
    initialValues?.preferredRideTier || 'all'
  );
  const [customPreferences, setCustomPreferences] = useState(
    initialValues?.customPreferences || 'Love architectural photography, local ramen stalls, and avoiding heavy traffic surges.'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    onPlanTrip({
      destination: destination.trim(),
      origin: origin.trim(),
      startDate: new Date().toISOString().split('T')[0],
      durationDays: Number(durationDays),
      travelers: Number(travelers),
      budget: Number(budget),
      currency,
      travelStyle,
      preferredRideTier,
      customPreferences: customPreferences.trim(),
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Autonomous ReAct Travel & Fare Planner</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Orchestrates OpenWeatherMap, Amadeus/Skyscanner, Google Places & ML SmartRide surge estimation with backtrack reasoning.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> ReAct Engine Ready
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Destination
            </label>
            <input
              id="input-destination"
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Tokyo, Paris, Bengaluru"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>

          {/* Origin */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-slate-500" /> Origin / Starting City
            </label>
            <input
              id="input-origin"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. San Francisco, London"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            />
          </div>

          {/* Duration Days */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" /> Duration (Days)
            </label>
            <select
              id="select-duration"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
            >
              <option value={1}>1 Day (Express Tour)</option>
              <option value={2}>2 Days (Weekend Getaway)</option>
              <option value={3}>3 Days (Recommended)</option>
              <option value={4}>4 Days (Full Exploration)</option>
              <option value={5}>5 Days (Deep Dive)</option>
              <option value={7}>7 Days (Extended Week)</option>
            </select>
          </div>

          {/* Budget Constraint */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" /> Total Budget ({currency})
            </label>
            <input
              id="input-budget"
              type="number"
              min={100}
              max={50000}
              step={50}
              required
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition font-semibold text-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Travelers count */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" /> Travelers
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  id={`btn-travelers-${num}`}
                  onClick={() => setTravelers(num)}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition ${
                    travelers === num
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {num} {num === 1 ? 'Solo' : num === 2 ? 'Duo' : 'Group'}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-slate-500" /> Travel Style
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Budget', 'Balanced', 'Luxury'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  id={`btn-style-${style.toLowerCase()}`}
                  onClick={() => setTravelStyle(style)}
                  className={`py-1.5 text-xs font-semibold rounded-lg border transition ${
                    travelStyle === style
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Ride Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Car className="w-3.5 h-3.5 text-emerald-600" /> SmartRide Routing Policy
            </label>
            <select
              id="select-ride-policy"
              value={preferredRideTier}
              onChange={(e) => setPreferredRideTier(e.target.value as any)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
            >
              <option value="all">Dynamic ML Multi-Tier (Best Balance)</option>
              <option value="budget_first">Budget Saver (Rapido Bike & Auto)</option>
              <option value="comfort_first">Comfort Priority (Uber Premier & XL)</option>
            </select>
          </div>
        </div>

        {/* Custom Preferences / Agent Instructions */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-slate-500" /> Specific Interests, Dietary or Transit Constraints
          </label>
          <input
            id="input-custom-constraints"
            type="text"
            value={customPreferences}
            onChange={(e) => setCustomPreferences(e.target.value)}
            placeholder="e.g. Vegetarian dining, indoor museum alternatives for rain, avoid toll routes..."
            className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition text-slate-800"
          />
        </div>

        {/* Submit Agent Button */}
        <div className="pt-2 flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ReAct Engine will backtrack accommodations or ride tiers if budget ceiling is exceeded.
          </div>

          <button
            id="btn-run-agent"
            type="submit"
            disabled={isPlanning}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isPlanning ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                <span>Executing ReAct Loop...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Launch Autonomous Travel Agent</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
