import { z } from 'zod';

export const PlanTripRequestSchema = z.object({
  destination: z.string().min(2, 'Destination must be at least 2 characters').max(100, 'Destination cannot exceed 100 characters'),
  origin: z.string().max(100).optional().default(''),
  durationDays: z.number().int().min(1, 'Duration must be at least 1 day').max(14, 'Duration capped at 14 days for accuracy'),
  budget: z.number().positive('Budget must be greater than 0').max(1000000, 'Budget cap exceeded'),
  travelers: z.number().int().min(1, 'At least 1 traveler required').max(20, 'Max 20 travelers per booking group'),
  travelStyle: z.enum(['Budget', 'Balanced', 'Luxury', 'Adventure', 'Cultural']).default('Balanced'),
  customPreferences: z.string().max(500, 'Preferences string too long').optional().default(''),
});

export const RideFareEstimateSchema = z.object({
  pickup: z.string().min(2, 'Pickup location required'),
  dropoff: z.string().min(2, 'Dropoff location required'),
  distanceKm: z.number().positive('Distance must be positive').max(500, 'Distance exceeds maximum trip length'),
  durationMinutes: z.number().positive('Duration must be positive').max(1440, 'Duration exceeds 24 hours'),
  tier: z.enum(['rapido_bike', 'auto_rickshaw', 'uber_go', 'uber_premier', 'uber_xl']),
  trafficCondition: z.enum(['low', 'moderate', 'heavy', 'severe']).default('moderate'),
  isRushHour: z.boolean().default(false),
  isRaining: z.boolean().default(false),
});

export const UserPreferencesSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  surgeThreshold: z.number().min(1.0).max(3.0),
  autoBacktrack: z.boolean(),
  rainSafeguard: z.boolean(),
  distanceUnit: z.enum(['km', 'miles']),
  preferredTiers: z.array(z.string()).min(1),
  currency: z.enum(['USD', 'INR', 'EUR', 'GBP']),
});
