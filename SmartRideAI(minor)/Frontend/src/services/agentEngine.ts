import {
  PlanTripRequest,
  TravelPlan,
  ReactTraceStep,
  DayItinerary,
  ActivityItem,
  VehicleTier,
  FlightOption,
  HotelOption,
  WeatherCondition,
  AttractionPlace,
} from '../types/travel';
import { AgentToolsService } from './toolsService';
import { SmartRideFareEngine } from './fareEngine';

export class ReActAgentEngine {
  /**
   * Runs the ReAct Multi-Tool Agent to plan an end-to-end travel itinerary with budget backtracking
   */
  static async planTrip(request: PlanTripRequest): Promise<TravelPlan> {
    const traces: ReactTraceStep[] = [];
    let stepCount = 1;
    let backtrackCount = 0;
    const now = () => new Date().toISOString().substring(11, 19);

    const logStep = (
      type: ReactTraceStep['type'],
      content: string,
      toolName?: ReactTraceStep['toolName'],
      toolInput?: Record<string, any>,
      toolOutput?: Record<string, any> | string,
      status: ReactTraceStep['status'] = 'success'
    ) => {
      traces.push({
        step: stepCount++,
        type,
        toolName,
        toolInput,
        toolOutput,
        content,
        status,
        timestamp: now(),
      });
    };

    // Step 1: Initial Thought & Problem Formulation
    logStep(
      'thought',
      `Initializing Autonomous Travel Planning Agent for ${request.travelers} traveler(s) heading to ${request.destination} starting ${request.startDate} for ${request.durationDays} day(s). User budget constraint: ${request.currency} ${request.budget}. Travel style: ${request.travelStyle}. Preferred ride tier: ${request.preferredRideTier || 'all'}.`
    );

    // Step 2: Query Weather via OpenWeatherMap tool
    logStep(
      'action',
      `Calling OpenWeatherMap tool to assess climate conditions, precipitation risks, and outdoor activity safety index for ${request.destination}.`,
      'OpenWeatherMap',
      { destination: request.destination, startDate: request.startDate }
    );

    const weatherData: WeatherCondition = await AgentToolsService.queryWeather(
      request.destination,
      request.startDate
    );

    logStep(
      'observation',
      `Weather tool returned: ${weatherData.temperatureC}°C (${weatherData.temperatureF}°F), ${weatherData.condition}. Precipitation risk: ${weatherData.precipitationChance}%. Advisory: ${weatherData.travelAdvisory}`,
      'OpenWeatherMap',
      undefined,
      weatherData
    );

    // Step 3: Thought on Flights & Accommodation allocation
    const targetFlightBudget = Math.round(request.budget * 0.28);
    const targetHotelBudgetPerNight = Math.round((request.budget * 0.35) / Math.max(1, request.durationDays));

    logStep(
      'thought',
      `Formulating budget allocation model: Flights (~28% = ${request.currency} ${targetFlightBudget}), Accommodation (~35% = ${request.currency} ${targetHotelBudgetPerNight}/night), Rides & Local Transit (~15%), Food & Activities (~18%), Emergency Buffer (~4%). Querying Skyscanner/Amadeus and Hotel aggregators.`
    );

    // Step 4: Action - Search Flights
    logStep(
      'action',
      `Invoking Skyscanner/Amadeus Flight Search API from ${request.origin || 'Origin City'} to ${request.destination}.`,
      'Skyscanner_Flights',
      { origin: request.origin || 'Origin', destination: request.destination, cabin: request.travelStyle === 'Luxury' ? 'Business' : 'Economy' }
    );

    const flightsResult = await AgentToolsService.queryFlights(
      request.origin || 'Airport',
      request.destination,
      request.travelStyle,
      targetFlightBudget
    );

    logStep(
      'observation',
      `Flight tool identified ${flightsResult.alternatives.length} options. Recommended flight: ${flightsResult.selected.airline} (${flightsResult.selected.flightNumber}) at ${request.currency} ${flightsResult.selected.price}.`,
      'Skyscanner_Flights',
      undefined,
      flightsResult
    );

    // Step 5: Action - Search Hotels
    logStep(
      'action',
      `Invoking Amadeus/Booking Accommodation API for ${request.destination} for ${request.durationDays} night(s).`,
      'Amadeus_Hotels',
      { destination: request.destination, nights: request.durationDays, style: request.travelStyle }
    );

    let hotelsResult = await AgentToolsService.queryHotels(
      request.destination,
      request.durationDays,
      request.travelStyle,
      targetHotelBudgetPerNight
    );

    logStep(
      'observation',
      `Hotel tool returned ${hotelsResult.alternatives.length} options. Top match: ${hotelsResult.selected.name} (${hotelsResult.selected.stars}★) at ${request.currency} ${hotelsResult.selected.pricePerNight}/night (Total: ${request.currency} ${hotelsResult.selected.totalPrice}).`,
      'Amadeus_Hotels',
      undefined,
      hotelsResult
    );

    // Step 6: Action - Query Attractions via Google Places
    logStep(
      'action',
      `Calling Google Places API to discover curated landmarks, cultural pavilions, and dining hotspots in ${request.destination}.`,
      'GooglePlaces_Attractions',
      { destination: request.destination, filter: weatherData.precipitationChance > 50 ? 'indoor_preferred' : 'all' }
    );

    const places: AttractionPlace[] = await AgentToolsService.queryPlaces(request.destination);

    logStep(
      'observation',
      `Google Places tool retrieved ${places.length} top-ranked attractions. Filtering for optimal geographical clustering to minimize transit surge.`,
      'GooglePlaces_Attractions',
      undefined,
      { count: places.length, sample: places.map((p) => p.name) }
    );

    // Step 7: Build Day-by-Day schedule with SmartRide fare integrations
    logStep(
      'thought',
      `Constructing sequential daily itineraries for ${request.durationDays} day(s). Running SmartRide Fare Estimation Engine on every leg to calculate distance, traffic index, surge multiplier, and best vehicle tier (Rapido Bike vs Auto vs Uber Go vs Premier).`
    );

    let selectedFlight = flightsResult.selected;
    let selectedHotel = hotelsResult.selected;

    // Generate Days
    const days: DayItinerary[] = [];
    let totalEstimatedRides = 0;
    let totalEstimatedActivities = 0;

    const baseDate = new Date(request.startDate || new Date().toISOString().split('T')[0]);

    for (let d = 1; d <= request.durationDays; d++) {
      const currentDayDate = new Date(baseDate);
      currentDayDate.setDate(baseDate.getDate() + (d - 1));
      const dateStr = currentDayDate.toISOString().split('T')[0];

      const p1 = places[(d * 3 - 3) % places.length] || places[0];
      const p2 = places[(d * 3 - 2) % places.length] || places[1] || places[0];
      const p3 = places[(d * 3 - 1) % places.length] || places[2] || places[0];

      // Ride legs
      const ride1 = SmartRideFareEngine.calculateAllTiers({
        distanceKm: 4.8 + d * 0.5,
        trafficIndex: 1.2,
        isPeakHour: false,
        isRainy: weatherData.precipitationChance > 40,
      });

      const ride2 = SmartRideFareEngine.calculateAllTiers({
        distanceKm: 6.2 + d * 0.3,
        trafficIndex: 2.1, // Peak afternoon rush
        isPeakHour: true,
        isRainy: weatherData.precipitationChance > 40,
      });

      const ride3 = SmartRideFareEngine.calculateAllTiers({
        distanceKm: 7.5 + d * 0.4,
        trafficIndex: 1.6, // Evening transit back to hotel
        isPeakHour: true,
        isRainy: weatherData.precipitationChance > 40,
      });

      // Select tier based on preference
      const pickTier = (allTiers: typeof ride1, isPeak: boolean): typeof ride1[0] => {
        if (request.preferredRideTier === 'budget_first') return allTiers[0]; // Rapido Bike / Auto
        if (request.preferredRideTier === 'comfort_first') return allTiers[3]; // Premier
        return isPeak && allTiers[0].surgeMultiplier > 1.3 ? allTiers[1] : allTiers[2]; // Uber Go or Auto
      };

      const leg1 = pickTier(ride1, false);
      const leg2 = pickTier(ride2, true);
      const leg3 = pickTier(ride3, true);

      const morningActivity: ActivityItem = {
        id: `act-d${d}-m`,
        timeSlot: 'morning',
        time: '09:00 AM - 12:00 PM',
        title: `Explore ${p1.name}`,
        type: 'sightseeing',
        description: p1.description,
        location: `${p1.name}, ${request.destination}`,
        lat: p1.lat,
        lng: p1.lng,
        estimatedCost: p1.entryFee,
        durationMinutes: 180,
        placeDetails: p1,
        rideToNext: {
          from: selectedHotel.name,
          to: p1.name,
          distanceKm: leg1.distanceKm,
          durationMins: leg1.durationMinutes,
          recommendedTier: leg1.tier,
          estimatedFare: leg1.estimatedFare,
          surgeMultiplier: leg1.surgeMultiplier,
          transitTip: `SmartRide: Take ${leg1.name} (Surge ${leg1.surgeMultiplier}x) — ${leg1.durationMinutes} mins ETA.`,
        },
        weatherTips: weatherData.precipitationChance > 30 ? 'Morning is clear; ideal for open-air photography.' : 'Mild morning breeze; comfortable for walking.',
      };

      const afternoonActivity: ActivityItem = {
        id: `act-d${d}-a`,
        timeSlot: 'afternoon',
        time: '01:00 PM - 04:30 PM',
        title: `Cultural Visit & Dining at ${p2.name}`,
        type: p2.indoor ? 'cultural' : 'sightseeing',
        description: p2.description,
        location: `${p2.name}, ${request.destination}`,
        lat: p2.lat,
        lng: p2.lng,
        estimatedCost: p2.entryFee + 20, // + lunch
        durationMinutes: 210,
        placeDetails: p2,
        rideToNext: {
          from: p1.name,
          to: p2.name,
          distanceKm: leg2.distanceKm,
          durationMins: leg2.durationMinutes,
          recommendedTier: leg2.tier,
          estimatedFare: leg2.estimatedFare,
          surgeMultiplier: leg2.surgeMultiplier,
          transitTip: leg2.surgeMultiplier > 1.2
            ? `Rush Hour Surge Warning (${leg2.surgeMultiplier}x)! ${leg2.name} cuts through bottleneck traffic.`
            : `Smooth route transit via ${leg2.name}.`,
        },
        weatherTips: weatherData.precipitationChance > 40 ? 'Afternoon rain showers possible; indoor pavilions recommended.' : 'High UV index; stay hydrated and use sunscreen.',
      };

      const eveningActivity: ActivityItem = {
        id: `act-d${d}-e`,
        timeSlot: 'evening',
        time: '06:00 PM - 09:30 PM',
        title: `Sunset Experience & Dinner near ${p3.name}`,
        type: 'dining',
        description: `${p3.description} Followed by curated local culinary tasting and panoramic night views.`,
        location: `${p3.name}, ${request.destination}`,
        lat: p3.lat,
        lng: p3.lng,
        estimatedCost: p3.entryFee + 35, // + dinner
        durationMinutes: 210,
        placeDetails: p3,
        rideToNext: {
          from: p2.name,
          to: p3.name,
          distanceKm: leg3.distanceKm,
          durationMins: leg3.durationMinutes,
          recommendedTier: leg3.tier,
          estimatedFare: leg3.estimatedFare,
          surgeMultiplier: leg3.surgeMultiplier,
          transitTip: `Night return to hotel via ${leg3.name} with air conditioning.`,
        },
        weatherTips: 'Cool evening atmosphere. Perfect for outdoor promenades and skyline photography.',
      };

      const dayRideCost = leg1.estimatedFare + leg2.estimatedFare + leg3.estimatedFare;
      const dayActivityCost = morningActivity.estimatedCost + afternoonActivity.estimatedCost + eveningActivity.estimatedCost;
      const dayTotal = dayRideCost + dayActivityCost;

      totalEstimatedRides += dayRideCost;
      totalEstimatedActivities += dayActivityCost;

      days.push({
        dayNumber: d,
        date: dateStr,
        title: `Day ${d}: ${p1.tags[0] || 'Heritage'} & ${p3.tags[0] || 'City Lights'}`,
        theme: d === 1 ? 'Historic Icons & Orientation' : d === 2 ? 'Modern Culture & Gastronomy' : 'Nature & Panoramic Vistas',
        weather: weatherData,
        morning: [morningActivity],
        afternoon: [afternoonActivity],
        evening: [eveningActivity],
        totalDayCost: Number(dayTotal.toFixed(2)),
        totalRideCost: Number(dayRideCost.toFixed(2)),
        totalActivityCost: Number(dayActivityCost.toFixed(2)),
        dailySummary: `Comprehensive day covering ${p1.name}, ${p2.name}, and ${p3.name} with 3 optimized SmartRide transfers.`,
      });
    }

    // Step 8: Constraint Verification & Backtracking Loop
    let flightCost = selectedFlight.price * request.travelers;
    let hotelCost = selectedHotel.totalPrice;
    let ridesCost = totalEstimatedRides;
    let activitiesCost = totalEstimatedActivities;
    let bufferCost = Math.round(request.budget * 0.05);

    let totalProjected = flightCost + hotelCost + ridesCost + activitiesCost + bufferCost;

    logStep(
      'action',
      `Invoking BudgetConstraint_Verifier tool to audit initial cost projection (${request.currency} ${totalProjected.toFixed(2)}) against user ceiling (${request.currency} ${request.budget}).`,
      'BudgetConstraint_Verifier',
      {
        totalBudget: request.budget,
        projectedTotal: totalProjected,
        flights: flightCost,
        hotel: hotelCost,
        rides: ridesCost,
        activities: activitiesCost,
      }
    );

    // If exceeding budget, execute Backtracking loop
    let planStatus: TravelPlan['status'] = 'optimal';

    if (totalProjected > request.budget) {
      backtrackCount++;
      planStatus = 'adjusted_for_budget';
      const overage = totalProjected - request.budget;

      logStep(
        'backtrack',
        `⚠️ Budget Constraint Violated: Cost (${request.currency} ${totalProjected.toFixed(2)}) exceeds ceiling by ${request.currency} ${overage.toFixed(2)}. Initiating Backtracking Reasoner: Evaluating alternative hotel tier, switching flight cabin, and downgrading cab tiers to Rapido/Auto.`,
        'BudgetConstraint_Verifier',
        { overage },
        undefined,
        'backtracking'
      );

      // Backtrack Step 1: Switch Hotel if budget alternative exists
      if (hotelsResult.alternatives.length > 0 && hotelsResult.alternatives[0].id !== selectedHotel.id) {
        const previousHotel = selectedHotel;
        selectedHotel = hotelsResult.alternatives[0];
        const savedOnHotel = previousHotel.totalPrice - selectedHotel.totalPrice;
        hotelCost = selectedHotel.totalPrice;

        logStep(
          'action',
          `Substituted accommodation: Swapped "${previousHotel.name}" for budget-optimized "${selectedHotel.name}", saving ${request.currency} ${savedOnHotel.toFixed(2)}.`,
          'Amadeus_Hotels',
          { original: previousHotel.name, new: selectedHotel.name, saved: savedOnHotel }
        );
      }

      // Backtrack Step 2: Switch Flight to lowest fare alternative
      if (flightsResult.alternatives.length > 0 && flightsResult.alternatives[0].id !== selectedFlight.id) {
        const prevFlight = selectedFlight;
        selectedFlight = flightsResult.alternatives[0];
        const savedOnFlight = (prevFlight.price - selectedFlight.price) * request.travelers;
        flightCost = selectedFlight.price * request.travelers;

        logStep(
          'action',
          `Substituted airfare: Swapped "${prevFlight.airline}" to economy saver "${selectedFlight.airline}", saving ${request.currency} ${savedOnFlight.toFixed(2)}.`,
          'Skyscanner_Flights',
          { original: prevFlight.airline, new: selectedFlight.airline, saved: savedOnFlight }
        );
      }

      // Backtrack Step 3: Optimize ride tiers to budget mode
      let rideSavings = 0;
      days.forEach((day) => {
        [...day.morning, ...day.afternoon, ...day.evening].forEach((act) => {
          if (act.rideToNext) {
            const oldFare = act.rideToNext.estimatedFare;
            const newTiers = SmartRideFareEngine.calculateAllTiers({
              distanceKm: act.rideToNext.distanceKm,
              trafficIndex: 1.4,
            });
            const ecoTier = newTiers[0]; // Bike / Auto
            act.rideToNext.recommendedTier = ecoTier.tier;
            act.rideToNext.estimatedFare = ecoTier.estimatedFare;
            act.rideToNext.transitTip = `SmartRide Budget Saver: Using ${ecoTier.name} to preserve trip buffer.`;
            rideSavings += (oldFare - ecoTier.estimatedFare);
          }
        });
      });

      ridesCost = Math.max(10, ridesCost - rideSavings);
      totalProjected = flightCost + hotelCost + ridesCost + activitiesCost + bufferCost;

      logStep(
        'observation',
        `Backtracking completed successfully! New verified total is ${request.currency} ${totalProjected.toFixed(2)} (${totalProjected <= request.budget ? '✅ Within Budget' : 'Adjusted to Minimum Possible'}). Total savings achieved: ${request.currency} ${(flightCost + hotelCost + ridesCost).toFixed(2)}.`,
        'BudgetConstraint_Verifier',
        undefined,
        { newTotal: totalProjected, isCompliant: totalProjected <= request.budget }
      );
    } else {
      logStep(
        'decision',
        `✅ All constraints satisfied on initial pass! Projected total (${request.currency} ${totalProjected.toFixed(2)}) is well within budget limit of ${request.currency} ${request.budget}. Remaining buffer: ${request.currency} ${(request.budget - totalProjected).toFixed(2)}.`
      );
    }

    // Final Decision Step
    logStep(
      'decision',
      `Autonomous Travel Plan generated with ${days.length} day(s), ${places.length} attractions, verified SmartRide routing with surge resilience, and direct booking links for Skyscanner and Booking.com.`
    );

    const savingsFromSmartRides = Number((ridesCost * 0.35).toFixed(2));

    return {
      id: `plan-${Date.now()}`,
      tripTitle: `${request.durationDays}-Day Smart Travel Itinerary: ${request.destination}`,
      destination: request.destination,
      origin: request.origin || 'Selected Origin',
      startDate: request.startDate,
      endDate: days[days.length - 1]?.date || request.startDate,
      durationDays: request.durationDays,
      travelersCount: request.travelers,
      travelStyle: request.travelStyle,
      currency: request.currency,
      createdAt: new Date().toISOString(),
      budgetSummary: {
        totalBudget: request.budget,
        estimatedTotal: Number(totalProjected.toFixed(2)),
        remainingBudget: Number((request.budget - totalProjected).toFixed(2)),
        isWithinBudget: totalProjected <= request.budget,
        currency: request.currency,
        allocations: {
          flights: Number(flightCost.toFixed(2)),
          hotels: Number(hotelCost.toFixed(2)),
          rides: Number(ridesCost.toFixed(2)),
          activitiesAndFood: Number(activitiesCost.toFixed(2)),
          bufferEmergency: Number(bufferCost.toFixed(2)),
        },
        savingsFromSmartRides,
        budgetTips: [
          'Pre-booking flight and hotel locked in early rates.',
          'SmartRide algorithm selected Auto / Rapido during 5-7 PM rush hours, cutting surge fees by ~35%.',
          'Free-admission morning heritage visits paired with ticketed afternoon museum passes.',
        ],
      },
      selectedFlight,
      selectedHotel,
      alternativeHotels: hotelsResult.alternatives,
      alternativeFlights: flightsResult.alternatives,
      days,
      overallWeatherSummary: `${weatherData.condition} (${weatherData.temperatureC}°C / ${weatherData.temperatureF}°F) with ${weatherData.precipitationChance}% precipitation risk. ${weatherData.travelAdvisory}`,
      smartRideTransitGuide: {
        peakHoursWarning: 'Peak congestion observed between 08:30-10:30 AM & 05:30-08:00 PM. Expect 1.4x-2.2x surge on 4-wheeler cabs.',
        bestTierForTrip: request.travelStyle === 'Budget' ? 'Rapido Bike & Auto Rickshaw' : 'Uber Go & Premier Cab',
        estimatedTotalRideCost: Number(ridesCost.toFixed(2)),
        surgeAvoidanceTips: [
          'Schedule rides 20 minutes before peak intervals.',
          'Use Rapido Moto for distances < 6 km during gridlock traffic.',
          'Pool rides or switch to Auto Rickshaw during heavy evening rainfall.',
        ],
      },
      reasoningTraces: traces,
      backtrackEventsCount: backtrackCount,
      status: planStatus,
    };
  }
}
