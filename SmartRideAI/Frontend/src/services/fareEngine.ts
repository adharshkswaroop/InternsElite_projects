import { FareBreakdown, VehicleTier } from '../types/travel';

export interface RideCalculationInput {
  distanceKm: number;
  durationMinutes?: number;
  trafficIndex?: number; // 1.0 = light, 2.0 = medium/heavy, 3.0 = severe gridlock
  isPeakHour?: boolean;
  isRainy?: boolean;
  currency?: string;
  currencyRate?: number; // USD to INR or vice versa
}

export class SmartRideFareEngine {
  /**
   * Estimates fare across all 5 tiers for a given route dynamic
   */
  static calculateAllTiers(input: RideCalculationInput): FareBreakdown[] {
    const distance = Math.max(0.5, input.distanceKm);
    const traffic = input.trafficIndex ?? 1.3;
    const isPeak = input.isPeakHour ?? false;
    const isRain = input.isRainy ?? false;
    const rate = input.currencyRate ?? 1; // Base rates in local USD-equivalent or INR normalized

    // Tier configurations (rates normalized in USD, scalable to INR/EUR)
    const tierConfigs: Array<{
      tier: VehicleTier;
      name: string;
      category: 'Bike' | 'Auto' | 'Economy Cab' | 'Premium Cab' | 'XL Cab';
      icon: string;
      baseFare: number;
      perKm: number;
      perMin: number;
      trafficManeuverability: number; // 0.65 = cuts traffic by 35%, 1.0 = standard cab
      carbonPerKm: number;
    }> = [
      {
        tier: 'rapido_bike',
        name: 'Rapido Moto / Bike',
        category: 'Bike',
        icon: 'Bike',
        baseFare: 1.2,
        perKm: 0.35,
        perMin: 0.04,
        trafficManeuverability: 0.65,
        carbonPerKm: 0.04,
      },
      {
        tier: 'auto_rickshaw',
        name: 'Auto Rickshaw / TukTuk',
        category: 'Auto',
        icon: 'CarFront',
        baseFare: 1.8,
        perKm: 0.55,
        perMin: 0.06,
        trafficManeuverability: 0.85,
        carbonPerKm: 0.07,
      },
      {
        tier: 'uber_go',
        name: 'Uber Go / Compact',
        category: 'Economy Cab',
        icon: 'Car',
        baseFare: 2.8,
        perKm: 0.85,
        perMin: 0.12,
        trafficManeuverability: 1.0,
        carbonPerKm: 0.14,
      },
      {
        tier: 'uber_premier',
        name: 'Uber Premier / Sedan',
        category: 'Premium Cab',
        icon: 'Sparkles',
        baseFare: 4.2,
        perKm: 1.25,
        perMin: 0.18,
        trafficManeuverability: 1.0,
        carbonPerKm: 0.18,
      },
      {
        tier: 'uber_xl',
        name: 'Uber XL / 6-Seater SUV',
        category: 'XL Cab',
        icon: 'Truck',
        baseFare: 6.5,
        perKm: 1.75,
        perMin: 0.25,
        trafficManeuverability: 1.05,
        carbonPerKm: 0.26,
      },
    ];

    // Compute surge multiplier
    let surgeMultiplier = 1.0;
    const surgeReasons: string[] = [];

    if (isPeak) {
      surgeMultiplier += 0.35;
      surgeReasons.push('Peak Rush Hour');
    }
    if (traffic >= 2.2) {
      surgeMultiplier += 0.30;
      surgeReasons.push('High Traffic Congestion');
    } else if (traffic >= 1.7) {
      surgeMultiplier += 0.15;
    }
    if (isRain) {
      surgeMultiplier += 0.25;
      surgeReasons.push('Rain / Weather Demand');
    }

    // Cap surge
    surgeMultiplier = Math.min(3.0, Math.max(1.0, Number(surgeMultiplier.toFixed(2))));

    // Calculate duration based on distance and traffic
    const baseDuration = (distance / 30) * 60; // 30km/h average base city speed

    const results = tierConfigs.map((config) => {
      // Adjusted duration for vehicle type and traffic
      const durationMinutes = Math.max(
        3,
        Math.round(baseDuration * traffic * config.trafficManeuverability)
      );

      // Raw fare calculation
      const distanceCost = distance * config.perKm;
      const timeCost = durationMinutes * config.perMin;
      const subtotal = (config.baseFare + distanceCost + timeCost) * surgeMultiplier;
      
      const estimatedFare = Number((subtotal * rate).toFixed(2));
      const minFare = Number((estimatedFare * 0.92).toFixed(2));
      const maxFare = Number((estimatedFare * 1.15).toFixed(2));
      const carbonKg = Number((distance * config.carbonPerKm).toFixed(2));

      return {
        tier: config.tier,
        name: config.name,
        category: config.category,
        icon: config.icon,
        baseFare: Number((config.baseFare * rate).toFixed(2)),
        perKmRate: Number((config.perKm * rate).toFixed(2)),
        perMinuteRate: Number((config.perMin * rate).toFixed(2)),
        distanceKm: Number(distance.toFixed(1)),
        durationMinutes,
        trafficIndex: traffic,
        surgeMultiplier,
        surgeReason: surgeReasons.length > 0 ? surgeReasons.join(' + ') : 'Normal Traffic',
        weatherFactor: isRain ? 1.25 : 1.0,
        estimatedFare,
        fareRange: { min: minFare, max: maxFare },
        etaMinutes: durationMinutes,
        savingsVsHighest: 0, // will compute after
        carbonKg,
      };
    });

    const maxFare = Math.max(...results.map((r) => r.estimatedFare));
    results.forEach((r) => {
      r.savingsVsHighest = Number((maxFare - r.estimatedFare).toFixed(2));
    });

    return results;
  }

  /**
   * Helper to estimate quick ride between two coordinates or location names
   */
  static estimateSingleRide(
    from: string,
    to: string,
    approxDistanceKm: number,
    isRushHour: boolean = false,
    currencySymbol: string = '$'
  ): {
    bestTier: VehicleTier;
    bestTierName: string;
    estimatedFare: number;
    durationMins: number;
    distanceKm: number;
    surgeMultiplier: number;
    transitAdvice: string;
  } {
    const all = this.calculateAllTiers({
      distanceKm: approxDistanceKm,
      isPeakHour: isRushHour,
      trafficIndex: isRushHour ? 2.1 : 1.3,
    });

    // Recommend best balance
    const recommended = approxDistanceKm < 5 ? all[0] : all[2]; // Bike for short hops, Uber Go for medium
    return {
      bestTier: recommended.tier,
      bestTierName: recommended.name,
      estimatedFare: recommended.estimatedFare,
      durationMins: recommended.durationMinutes,
      distanceKm: approxDistanceKm,
      surgeMultiplier: recommended.surgeMultiplier,
      transitAdvice:
        recommended.surgeMultiplier > 1.2
          ? `High surge detected (${recommended.surgeMultiplier}x). Consider ${all[0].name} to bypass traffic and save ${currencySymbol}${(all[2].estimatedFare - all[0].estimatedFare).toFixed(1)}.`
          : `Standard traffic conditions. ${recommended.name} is recommended for optimal comfort & ETA.`,
    };
  }
}
