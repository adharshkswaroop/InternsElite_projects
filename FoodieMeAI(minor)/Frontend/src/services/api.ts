import { Recipe, UserInputParams, NutritionProfile, DietaryBadge } from '../types';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out after ${Math.round(timeoutMs / 1000)} seconds. Please try again.`);
    }
    if (!navigator.onLine) {
      throw new Error('Network connection appears to be offline. Please check your internet.');
    }
    throw new Error(error.message || 'Network communication error. Please try again.');
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function generateRecipe(params: UserInputParams): Promise<Recipe> {
  try {
    const response = await fetchWithTimeout('/api/recipe/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    }, 45000);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error (${response.status}): Could not formulate recipe.`);
    }

    const data = await response.json();
    if (!data.success || !data.recipe) {
      throw new Error(data.error || 'Failed to generate recipe structure. Please check input items.');
    }

    return data.recipe;
  } catch (err: any) {
    console.error('generateRecipe error:', err);
    throw err;
  }
}

export async function verifyNutrition(
  ingredients: any[],
  servings: number = 2
): Promise<{ nutrition: NutritionProfile; badges: DietaryBadge[] }> {
  try {
    const response = await fetchWithTimeout('/api/nutrition/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients, servings }),
    }, 15000);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to verify nutrition against USDA database');
    }

    const data = await response.json();
    return {
      nutrition: data.nutrition,
      badges: data.badges || [],
    };
  } catch (err: any) {
    console.error('verifyNutrition error:', err);
    throw err;
  }
}

export async function getPantrySuggestions(
  ingredients: string[]
): Promise<Array<{ name: string; reason: string; category: string }>> {
  if (ingredients.length === 0) return [];
  
  try {
    const response = await fetchWithTimeout('/api/pantry/suggest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingredients }),
    }, 12000);

    if (!response.ok) return [];
    const data = await response.json();
    return data.suggestions || [];
  } catch (err) {
    console.warn('Could not fetch pantry suggestions', err);
    return [];
  }
}

export async function exploreRestaurants(brief: {
  cravingOrCuisine: string;
  neighbourhood: string;
  occasion: string;
  budgetForTwo: number;
  vegOnly: boolean;
  city?: string;
}): Promise<{ totalCount: number; neighbourhoodsCount: number; restaurants: import('../types').Restaurant[] }> {
  try {
    const response = await fetchWithTimeout('/api/restaurants/explore', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(brief),
    }, 20000);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to fetch restaurant recommendations');
    }

    const data = await response.json();
    return {
      totalCount: data.totalCount || 0,
      neighbourhoodsCount: data.neighbourhoodsCount || 169,
      restaurants: data.restaurants || [],
    };
  } catch (err: any) {
    console.error('exploreRestaurants error:', err);
    throw err;
  }
}

