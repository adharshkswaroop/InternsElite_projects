import React, { useState } from 'react';
import { TravelPlan, DayItinerary, ActivityItem } from '../types/travel';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Sun,
  CloudRain,
  Plane,
  Building,
  DollarSign,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Zap,
  Info,
  Bike,
  CarFront,
} from 'lucide-react';

interface ItineraryViewProps {
  plan: TravelPlan;
  currency: string;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({ plan, currency }) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const activeDayData = plan.days.find((d) => d.dayNumber === selectedDay) || plan.days[0];

  const getTierIcon = (tier?: string) => {
    switch (tier) {
      case 'rapido_bike':
        return <Bike className="w-3.5 h-3.5 text-amber-600" />;
      case 'auto_rickshaw':
        return <CarFront className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Car className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  const getTierBadge = (tier?: string) => {
    switch (tier) {
      case 'rapido_bike':
        return { label: 'Rapido Moto / Bike', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
      case 'auto_rickshaw':
        return { label: 'Auto Rickshaw', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'uber_go':
        return { label: 'Uber Go (AC)', bg: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'uber_premier':
        return { label: 'Uber Premier Sedan', bg: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'uber_xl':
        return { label: 'Uber XL (6-Seater)', bg: 'bg-indigo-50 text-indigo-800 border-indigo-200' };
      default:
        return { label: 'SmartRide Cab', bg: 'bg-slate-50 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* 1. Trip Header Overview Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {plan.travelStyle} Trip
              </span>
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                {plan.durationDays} Days ({plan.startDate} to {plan.endDate})
              </span>
            </div>

            {/* Budget status pill */}
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                  plan.budgetSummary.isWithinBudget
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {plan.budgetSummary.isWithinBudget ? 'Within Budget Limit' : 'Budget Backtracked & Optimized'}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white">
            {plan.tripTitle}
          </h1>

          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed mb-6">
            Autonomous multi-tool itinerary curated for {plan.travelersCount} traveler(s) with real-time SmartRide ML fare estimation, weather safeguards, and guaranteed budget compliance.
          </p>

          {/* Quick Metrics Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-700/60">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Total Projected Cost</span>
              <span className="text-lg font-bold text-emerald-400">
                {currency} {plan.budgetSummary.estimatedTotal.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                of {currency} {plan.budgetSummary.totalBudget.toLocaleString()} budget
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-400 block mb-0.5">SmartRide Transit Budget</span>
              <span className="text-lg font-bold text-teal-300">
                {currency} {plan.budgetSummary.allocations.rides.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">
                Saved {currency} {plan.budgetSummary.savingsFromSmartRides} vs standard surge
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Destination Climate</span>
              <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5 mt-1">
                <Sun className="w-4 h-4 text-amber-400" />
                {plan.overallWeatherSummary.split('(')[0] || 'Clear & Mild'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Precipitation: {plan.days[0]?.weather?.precipitationChance || 10}%
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] font-medium text-slate-400 block mb-0.5">Agent Verification</span>
              <span className="text-sm font-bold text-emerald-300 flex items-center gap-1 mt-1">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                {plan.reasoningTraces.length} ReAct Steps
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {plan.backtrackEventsCount} Backtrack Resolves
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Flight & Accommodation Booking Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selected Flight Card */}
        {plan.selectedFlight && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <Plane className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Recommended Flight</span>
                  <h4 className="text-sm font-bold text-slate-900">{plan.selectedFlight.airline} ({plan.selectedFlight.flightNumber})</h4>
                </div>
              </div>
              <span className="text-sm font-extrabold text-blue-600">
                {currency} {plan.selectedFlight.price}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
              <div>
                <span className="font-bold text-slate-800">{plan.selectedFlight.origin}</span>
                <span className="block text-[10px] text-slate-400">{plan.selectedFlight.departureTime}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-medium text-slate-500">{plan.selectedFlight.duration}</span>
                <div className="w-16 h-0.5 bg-slate-300 relative my-1">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                </div>
                <span className="text-[10px] text-slate-400">
                  {plan.selectedFlight.stops === 0 ? 'Non-stop' : `${plan.selectedFlight.stops} stop`}
                </span>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-800">{plan.selectedFlight.destination}</span>
                <span className="block text-[10px] text-slate-400">{plan.selectedFlight.arrivalTime}</span>
              </div>
            </div>

            <a
              id="link-book-flight"
              href={plan.selectedFlight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-1.5 text-xs font-bold py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
            >
              <span>View Deals on Skyscanner</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Selected Hotel Card */}
        {plan.selectedHotel && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Recommended Stay</span>
                  <h4 className="text-sm font-bold text-slate-900">{plan.selectedHotel.name}</h4>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-extrabold text-amber-600">
                  {currency} {plan.selectedHotel.pricePerNight}
                </span>
                <span className="text-[10px] text-slate-400 block">/night (Total: {currency} {plan.selectedHotel.totalPrice})</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-700 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {plan.selectedHotel.location} ({plan.selectedHotel.distanceToCenterKm}km to center)
                </span>
                <span className="font-bold text-amber-700 bg-amber-100/80 px-1.5 py-0.5 rounded text-[10px]">
                  ★ {plan.selectedHotel.rating} ({plan.selectedHotel.reviewsCount} reviews)
                </span>
              </div>
              <div className="flex flex-wrap gap-1 pt-1">
                {plan.selectedHotel.amenities.slice(0, 3).map((amenity, i) => (
                  <span key={i} className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-600">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <a
              id="link-book-hotel"
              href={plan.selectedHotel.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center space-x-1.5 text-xs font-bold py-2 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 transition"
            >
              <span>Check Rooms on Booking.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* 3. Day Navigation Pills */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>Daily Schedule & Route Dynamics</span>
        </h3>
        <div className="flex space-x-1.5 overflow-x-auto">
          {plan.days.map((d) => (
            <button
              key={d.dayNumber}
              id={`btn-day-tab-${d.dayNumber}`}
              onClick={() => setSelectedDay(d.dayNumber)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                selectedDay === d.dayNumber
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Day {d.dayNumber}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Active Day Card Details */}
      {activeDayData && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
          {/* Day Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Day {activeDayData.dayNumber} • {activeDayData.date}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {activeDayData.theme}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{activeDayData.title}</h2>
            </div>

            {/* Day Cost Breakdown */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Rides Total</span>
                <span className="font-bold text-slate-800">{currency} {activeDayData.totalRideCost}</span>
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <div>
                <span className="text-[10px] text-slate-400 block">Activities & Meals</span>
                <span className="font-bold text-slate-800">{currency} {activeDayData.totalActivityCost}</span>
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <div>
                <span className="text-[10px] text-slate-400 block">Day Total</span>
                <span className="font-extrabold text-emerald-600">{currency} {activeDayData.totalDayCost}</span>
              </div>
            </div>
          </div>

          {/* Time Slots: Morning, Afternoon, Evening */}
          {(['morning', 'afternoon', 'evening'] as const).map((slotKey) => {
            const activities = activeDayData[slotKey];
            if (!activities || activities.length === 0) return null;

            const slotTitle =
              slotKey === 'morning'
                ? 'Morning Exploration (09:00 - 12:00)'
                : slotKey === 'afternoon'
                ? 'Afternoon Culture & Lunch (13:00 - 16:30)'
                : 'Evening Dining & Night Vistas (18:00 - 21:30)';

            const slotColor =
              slotKey === 'morning'
                ? 'border-amber-400 bg-amber-50/30'
                : slotKey === 'afternoon'
                ? 'border-blue-400 bg-blue-50/30'
                : 'border-purple-400 bg-purple-50/30';

            return (
              <div key={slotKey} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${slotKey === 'morning' ? 'bg-amber-500' : slotKey === 'afternoon' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{slotTitle}</h4>
                </div>

                {activities.map((act) => {
                  const rideBadge = act.rideToNext ? getTierBadge(act.rideToNext.recommendedTier) : null;

                  return (
                    <div key={act.id} className="space-y-3">
                      {/* Activity Main Card */}
                      <div className={`p-4 rounded-xl border-l-4 border bg-white border-slate-200 shadow-2xs ${slotColor}`}>
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-[11px] font-bold text-slate-500">{act.time}</span>
                              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {act.type}
                              </span>
                              {act.placeDetails?.indoor && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                                  Rain Safe (Indoor)
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-slate-900">{act.title}</h4>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{act.description}</p>
                          </div>

                          <div className="text-right sm:self-center shrink-0">
                            <span className="text-xs font-bold text-slate-900">
                              {act.estimatedCost === 0 ? 'Free Entry' : `${currency} ${act.estimatedCost}`}
                            </span>
                            <span className="text-[10px] text-slate-400 block">Est. Cost</span>
                          </div>
                        </div>

                        {act.weatherTips && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100/80 flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span>{act.weatherTips}</span>
                          </div>
                        )}
                      </div>

                      {/* SmartRide Connector */}
                      {act.rideToNext && (
                        <div className="ml-4 pl-4 border-l-2 border-dashed border-emerald-300 py-1 space-y-1">
                          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center space-x-2.5">
                              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                                {getTierIcon(act.rideToNext.recommendedTier)}
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${rideBadge?.bg}`}>
                                    {rideBadge?.label}
                                  </span>
                                  <span className="text-[11px] text-slate-500 font-medium">
                                    {act.rideToNext.distanceKm} km • ~{act.rideToNext.durationMins} mins
                                  </span>
                                  {act.rideToNext.surgeMultiplier > 1.2 && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-0.5">
                                      <Zap className="w-2.5 h-2.5" /> Surge {act.rideToNext.surgeMultiplier}x
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-600 mt-1 font-medium">{act.rideToNext.transitTip}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3 sm:self-center">
                              <div className="text-right">
                                <span className="text-xs font-extrabold text-emerald-700">
                                  {currency} {act.rideToNext.estimatedFare}
                                </span>
                                <span className="text-[9px] text-slate-400 block">Est. Fare</span>
                              </div>

                              <button
                                onClick={() =>
                                  alert(
                                    `SmartRide Simulator: Routing from "${act.rideToNext?.from}" to "${act.rideToNext?.to}" via ${rideBadge?.label} at ${currency} ${act.rideToNext?.estimatedFare}. Surge: ${act.rideToNext?.surgeMultiplier}x.`
                                  )
                                }
                                className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 transition"
                              >
                                Book Ride
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. SmartRide Surge & Transit Guidelines Box */}
      <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200 p-5">
        <div className="flex items-center space-x-2 mb-3">
          <Car className="w-4 h-4 text-emerald-700" />
          <h4 className="text-sm font-bold text-emerald-900">SmartRide Transit & Pricing Transparency Guide</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-emerald-950">
          <div className="p-3 bg-white rounded-xl border border-emerald-100">
            <span className="font-bold block mb-1">Peak Hours Congestion</span>
            <p className="text-slate-600">{plan.smartRideTransitGuide.peakHoursWarning}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-emerald-100">
            <span className="font-bold block mb-1">Recommended Vehicle Tier</span>
            <p className="text-slate-600">{plan.smartRideTransitGuide.bestTierForTrip}</p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-emerald-100">
            <span className="font-bold block mb-1">Surge-Bypass Tips</span>
            <ul className="list-disc pl-4 text-slate-600 space-y-0.5">
              {plan.smartRideTransitGuide.surgeAvoidanceTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
