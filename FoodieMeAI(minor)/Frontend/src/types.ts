export type DietaryConstraint =
  | 'keto'
  | 'vegan'
  | 'gluten-free'
  | 'low-sodium'
  | 'dairy-free'
  | 'diabetic-friendly'
  | 'vegetarian'
  | 'paleo'
  | 'high-protein'
  | 'low-calorie'
  | 'low-carb'
  | 'mediterranean';

export type KitchenEquipment =
  | 'stovetop'
  | 'oven'
  | 'air-fryer'
  | 'instant-pot'
  | 'blender'
  | 'grill'
  | 'microwave'
  | 'food-processor'
  | 'cast-iron-skillet'
  | 'slow-cooker'
  | 'toaster';

export type IngredientCategory =
  | 'produce'
  | 'dairy'
  | 'meat_seafood'
  | 'pantry'
  | 'spices_oils'
  | 'bakery'
  | 'frozen'
  | 'other';

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
  category: IngredientCategory;
  isLeftover: boolean;
  usdaMatch?: {
    fdcId?: number;
    description: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
    sugar: number;
    confidence: number;
  };
}

export interface CookingStep {
  stepNumber: number;
  title: string;
  instruction: string;
  timerMinutes?: number;
  equipment?: string;
  chefTip?: string;
}

export interface DietaryBadge {
  id: string;
  label: string;
  color: 'emerald' | 'amber' | 'blue' | 'purple' | 'rose' | 'teal' | 'indigo';
  icon: string;
  status: 'certified' | 'compatible' | 'caution';
  rationale: string;
  benchmarkValue?: string;
}

export interface IngredientNutrientContribution {
  ingredient: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
  fdcId?: number;
  foodGroup?: string;
}

export interface NutritionProfile {
  calories: number;
  protein: number;
  totalCarbs: number;
  netCarbs: number;
  fiber: number;
  totalFat: number;
  saturatedFat: number;
  sodium: number;
  sugar: number;
  cholesterol: number;
  potassium: number;
  macroPercentages: {
    protein: number;
    carbs: number;
    fat: number;
  };
  perServing: boolean;
  servings: number;
  confidenceScore: number;
  verifiedBy: string;
  databaseSource: 'USDA FoodData Central' | 'USDA Standard Reference' | 'Edamam Verified Food Metric';
  ingredientBreakdown: IngredientNutrientContribution[];
  usdaVerifiedDate: string;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory;
  checked: boolean;
  isOptional?: boolean;
  estimatedCost?: string;
}

export interface Recipe {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  cuisine: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  totalTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  ingredients: Ingredient[];
  instructions: CookingStep[];
  chefSecret: string;
  wineOrBeveragePairing?: string;
  storageInstructions: string;
  dietaryBadges: DietaryBadge[];
  nutrition: NutritionProfile;
  leftoverMatchRate: number;
  shoppingListItems: ShoppingListItem[];
  tags: string[];
  createdAt: string;
}

export interface UserInputParams {
  ingredients: string[];
  dietaryConstraints: DietaryConstraint[];
  maxCookTime: number;
  equipment: KitchenEquipment[];
  servings: number;
  skillLevel: 'Beginner' | 'Intermediate' | 'Master Chef';
  mealType: 'Dinner' | 'Lunch' | 'Breakfast' | 'Quick Snack' | 'Dessert' | 'Any';
  calorieTarget?: number;
  allergiesToAvoid: string[];
  customPrompt?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  neighbourhood: string;
  city: string;
  address: string;
  cuisine: string;
  rating: number;
  orderType: string;
  priceForTwo: number;
  priceCurrency: string;
  services: ('Delivery' | 'Takeaway' | 'Dine-in')[];
  isTopMatch?: boolean;
  isVeg?: boolean;
  signatureDishes?: string[];
  dietaryTags?: string[];
  description?: string;
  matchScore?: number;
  aiHighlight?: string;
  timings?: string;
  phone?: string;
}

export interface RestaurantBrief {
  cravingOrCuisine: string;
  neighbourhood: string;
  occasion: string;
  budgetForTwo: number;
  vegOnly: boolean;
  city?: string;
}

export interface UserSettings {
  name: string;
  email: string;
  avatarUrl?: string;
  roleTitle?: string;
  dietaryPreferences: DietaryConstraint[];
  defaultServings: number;
  measurementUnit: 'metric' | 'us_customary';
  highProteinMode: boolean;
  autoAddShoppingList: boolean;
  favoriteCity: string;
  tenantId?: string;
  role?: 'admin' | 'chef' | 'member';
}

export interface SecurityCheckItem {
  id: string;
  category: 'auth' | 'input' | 'transport' | 'observability' | 'realtime' | 'tenancy';
  title: string;
  description: string;
  status: 'passed' | 'warning' | 'critical';
  details: string;
  benchmark: string;
}

export interface SystemReadinessReport {
  status: 'READY' | 'DEGRADED' | 'UNHEALTHY';
  uptimeSeconds: number;
  memoryHeapMb: number;
  cacheHitRatePercent: number;
  circuitBreakerState: 'CLOSED' | 'HALF_OPEN' | 'OPEN';
  p95LatencyMs: number;
  activeSseConnections: number;
  database: 'CONNECTED_POOL' | 'DISCONNECTED';
  usdaApiCacheStatus: 'ACTIVE_L2' | 'COLD';
  securityScore: number;
  timestamp: string;
  securityChecks: SecurityCheckItem[];
}
