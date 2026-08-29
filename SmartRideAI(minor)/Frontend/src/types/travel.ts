export type VehicleTier = 'rapido_bike' | 'auto_rickshaw' | 'uber_go' | 'uber_premier' | 'uber_xl';

export interface FareBreakdown {
  tier: VehicleTier;
  name: string;
  category: 'Bike' | 'Auto' | 'Economy Cab' | 'Premium Cab' | 'XL Cab';
  icon: string;
  baseFare: number;
  perKmRate: number;
  perMinuteRate: number;
  distanceKm: number;
  durationMinutes: number;
  trafficIndex: number; // 1.0 (free flow) to 3.0 (gridlock)
  surgeMultiplier: number; // 1.0 to 3.5
  surgeReason?: string;
  weatherFactor: number; // 1.0 to 1.4 for rain/storms
  estimatedFare: number;
  fareRange: { min: number; max: number };
  etaMinutes: number;
  savingsVsHighest: number;
  carbonKg: number;
}

export interface WeatherCondition {
  city: string;
  temperatureC: number;
  temperatureF: number;
  condition: string;
  icon: string; // sunny, rainy, cloudy, stormy, snowy
  humidity: number;
  precipitationChance: number;
  windSpeedKmh: number;
  travelAdvisory: string;
  bestTimeToStepOut: string;
  precautions: string[];
}

export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business';
  price: number;
  currency: string;
  bookingUrl: string;
  logo?: string;
}

export interface HotelOption {
  id: string;
  name: string;
  location: string;
  city: string;
  stars: number;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  totalPrice: number;
  nights: number;
  amenities: string[];
  distanceToCenterKm: number;
  bookingUrl: string;
  imageUrl?: string;
  badge?: string;
}

export interface AttractionPlace {
  id: string;
  name: string;
  category: string;
  description: string;
  suggestedDuration: string;
  entryFee: number;
  openingHours: string;
  rating: number;
  lat: number;
  lng: number;
  tags: string[];
  indoor: boolean;
  bookingUrl?: string;
  imageUrl?: string;
}

export interface ActivityItem {
  id: string;
  timeSlot: 'morning' | 'afternoon' | 'evening';
  time: string;
  title: string;
  type: 'sightseeing' | 'dining' | 'adventure' | 'cultural' | 'leisure' | 'transit';
  description: string;
  location: string;
  lat: number;
  lng: number;
  estimatedCost: number;
  durationMinutes: number;
  placeDetails?: AttractionPlace;
  rideToNext?: {
    from: string;
    to: string;
    distanceKm: number;
    durationMins: number;
    recommendedTier: VehicleTier;
    estimatedFare: number;
    surgeMultiplier: number;
    transitTip: string;
    routeCoordinates?: [number, number][];
  };
  weatherTips?: string;
}

export interface DayItinerary {
  dayNumber: number;
  date: string;
  title: string;
  theme: string;
  weather: WeatherCondition;
  morning: ActivityItem[];
  afternoon: ActivityItem[];
  evening: ActivityItem[];
  totalDayCost: number;
  totalRideCost: number;
  totalActivityCost: number;
  dailySummary: string;
}

export interface ReactTraceStep {
  step: number;
  type: 'thought' | 'action' | 'observation' | 'backtrack' | 'decision';
  toolName?: 'OpenWeatherMap' | 'Skyscanner_Flights' | 'Amadeus_Hotels' | 'GooglePlaces_Attractions' | 'SmartRide_FareEngine' | 'BudgetConstraint_Verifier';
  toolInput?: Record<string, any>;
  toolOutput?: Record<string, any> | string;
  content: string;
  status?: 'running' | 'success' | 'warning' | 'backtracking';
  timestamp: string;
}

export interface BudgetBreakdown {
  totalBudget: number;
  estimatedTotal: number;
  remainingBudget: number;
  isWithinBudget: boolean;
  currency: string;
  allocations: {
    flights: number;
    hotels: number;
    rides: number;
    activitiesAndFood: number;
    bufferEmergency: number;
  };
  savingsFromSmartRides: number;
  budgetTips: string[];
}

export interface TravelPlan {
  id: string;
  tripTitle: string;
  destination: string;
  origin: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelersCount: number;
  travelStyle: 'Budget' | 'Balanced' | 'Luxury' | 'Adventure' | 'Cultural';
  currency: string;
  createdAt: string;
  budgetSummary: BudgetBreakdown;
  selectedFlight?: FlightOption;
  selectedHotel?: HotelOption;
  alternativeHotels?: HotelOption[];
  alternativeFlights?: FlightOption[];
  days: DayItinerary[];
  overallWeatherSummary: string;
  smartRideTransitGuide: {
    peakHoursWarning: string;
    bestTierForTrip: string;
    estimatedTotalRideCost: number;
    surgeAvoidanceTips: string[];
  };
  reasoningTraces: ReactTraceStep[];
  backtrackEventsCount: number;
  status: 'optimal' | 'adjusted_for_budget' | 'fallback_applied';
}

export interface PlanTripRequest {
  destination: string;
  origin?: string;
  startDate: string;
  durationDays: number;
  travelers: number;
  budget: number;
  currency: string;
  travelStyle: 'Budget' | 'Balanced' | 'Luxury' | 'Adventure' | 'Cultural';
  preferredRideTier?: 'all' | 'budget_first' | 'comfort_first';
  customPreferences?: string;
}
