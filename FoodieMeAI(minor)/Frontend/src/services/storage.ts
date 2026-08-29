import { Recipe, ShoppingListItem } from '../types';

const SAVED_RECIPES_KEY = 'culinary_copilot_saved_recipes';
const SHOPPING_LIST_KEY = 'culinary_copilot_shopping_list';
const PANTRY_ITEMS_KEY = 'culinary_copilot_pantry_items';

export function getSavedRecipes(): Recipe[] {
  try {
    const raw = localStorage.getItem(SAVED_RECIPES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading saved recipes:', e);
    return [];
  }
}

export function saveRecipeToCookbook(recipe: Recipe): boolean {
  try {
    const list = getSavedRecipes();
    const existingIndex = list.findIndex((r) => r.id === recipe.id);
    if (existingIndex >= 0) {
      list[existingIndex] = recipe;
    } else {
      list.unshift(recipe);
    }
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    console.error('Error saving recipe:', e);
    return false;
  }
}

export function removeRecipeFromCookbook(recipeId: string): Recipe[] {
  try {
    const list = getSavedRecipes().filter((r) => r.id !== recipeId);
    localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(list));
    return list;
  } catch (e) {
    console.error('Error removing recipe:', e);
    return [];
  }
}

export function getStoredShoppingList(): ShoppingListItem[] {
  try {
    const raw = localStorage.getItem(SHOPPING_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading shopping list:', e);
    return [];
  }
}

export function saveShoppingList(items: ShoppingListItem[]): void {
  try {
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving shopping list:', e);
  }
}

export function addItemsToShoppingList(newItems: ShoppingListItem[]): ShoppingListItem[] {
  try {
    const current = getStoredShoppingList();
    const map = new Map<string, ShoppingListItem>();
    
    // Add existing
    current.forEach((item) => {
      map.set(item.name.toLowerCase().trim(), item);
    });

    // Merge new items
    newItems.forEach((item) => {
      const key = item.name.toLowerCase().trim();
      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.amount += item.amount;
      } else {
        map.set(key, { ...item, id: `shop-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` });
      }
    });

    const combined = Array.from(map.values());
    saveShoppingList(combined);
    return combined;
  } catch (e) {
    console.error('Error adding to shopping list:', e);
    return getStoredShoppingList();
  }
}

export function getStoredPantry(): string[] {
  try {
    const raw = localStorage.getItem(PANTRY_ITEMS_KEY);
    return raw ? JSON.parse(raw) : ['Eggs', 'Spinach', 'Garlic', 'Olive Oil', 'Parmesan', 'Tomatoes'];
  } catch (e) {
    return ['Eggs', 'Spinach', 'Garlic', 'Olive Oil', 'Parmesan', 'Tomatoes'];
  }
}

export function saveStoredPantry(items: string[]): void {
  try {
    localStorage.setItem(PANTRY_ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving pantry:', e);
  }
}

const USER_SETTINGS_KEY = 'culinary_copilot_user_settings';

export const DEFAULT_USER_SETTINGS: import('../types').UserSettings = {
  name: 'Swaroop',
  email: 'swaroop.23mic7315@vitapstudent.ac.in',
  roleTitle: 'Home Gourmet & Nutritionist',
  dietaryPreferences: [],
  defaultServings: 2,
  measurementUnit: 'metric',
  highProteinMode: false,
  autoAddShoppingList: true,
  favoriteCity: 'Bangalore',
};

export function getUserSettings(): import('../types').UserSettings {
  try {
    const raw = localStorage.getItem(USER_SETTINGS_KEY);
    return raw ? { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) } : DEFAULT_USER_SETTINGS;
  } catch (e) {
    return DEFAULT_USER_SETTINGS;
  }
}

export function saveUserSettings(settings: import('../types').UserSettings): void {
  try {
    localStorage.setItem(USER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving user settings:', e);
  }
}
