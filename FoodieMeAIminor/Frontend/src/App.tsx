/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, AppTab } from './components/Sidebar';
import { AccountSettingsModal } from './components/AccountSettingsModal';
import { PantryInputForm } from './components/PantryInputForm';
import { RecipeCard } from './components/RecipeCard';
import { NutritionBreakdownModal } from './components/NutritionBreakdownModal';
import { ShoppingListView } from './components/ShoppingListView';
import { CookModeModal } from './components/CookModeModal';
import { SavedRecipesView } from './components/SavedRecipesView';
import { PrintableRecipeCard } from './components/PrintableRecipeCard';
import { USDAInspectorView } from './components/USDAInspectorView';
import { RestaurantIntelligenceView } from './components/RestaurantIntelligenceView';
import { ProductionHealthModal } from './components/ProductionHealthModal';
import { Recipe, UserInputParams, ShoppingListItem, UserSettings } from './types';
import { generateRecipe } from './services/api';
import { useRealtimeStream } from './services/realtime';
import {
  getSavedRecipes,
  saveRecipeToCookbook,
  removeRecipeFromCookbook,
  getStoredShoppingList,
  saveShoppingList,
  addItemsToShoppingList,
  getUserSettings,
  saveUserSettings,
} from './services/storage';
import { AlertCircle, CheckCircle2, Sparkles, Scale, BookOpen, ShoppingBag, ArrowLeft, Utensils } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('generator');
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals state
  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showCookMode, setShowCookMode] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHealthModal, setShowHealthModal] = useState(false);
  const [selectedRecipeForModal, setSelectedRecipeForModal] = useState<Recipe | null>(null);

  // Persistent storage state
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>(getUserSettings());

  // Real-time SSE stream telemetry
  const { isConnected: isRealtimeConnected, connectionLatencyMs } = useRealtimeStream('/api/realtime/stream');

  // Load saved data on startup
  useEffect(() => {
    setSavedRecipes(getSavedRecipes());
    setShoppingList(getStoredShoppingList());
    setUserSettings(getUserSettings());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setUserSettings(newSettings);
    saveUserSettings(newSettings);
    showToast('⚙️ Settings & culinary preferences updated!');
  };

  const handleGenerateRecipe = async (params: UserInputParams) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const recipe = await generateRecipe(params);
      setActiveRecipe(recipe);
      // Automatically add missing ingredients to shopping list if configured
      if (userSettings.autoAddShoppingList && recipe.shoppingListItems && recipe.shoppingListItems.length > 0) {
        const updatedList = addItemsToShoppingList(recipe.shoppingListItems);
        setShoppingList(updatedList);
      }
      showToast(`✨ Generated "${recipe.title}" with USDA verified nutrition!`);
      // Scroll to recipe
      window.scrollTo({ top: 400, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Generation failure:', err);
      setErrorMessage(err.message || 'Failed to generate recipe. Please try with different ingredients.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToCookbook = (recipe: Recipe) => {
    const success = saveRecipeToCookbook(recipe);
    if (success) {
      setSavedRecipes(getSavedRecipes());
      showToast(`📖 Saved "${recipe.title}" to your cookbook!`);
    }
  };

  const handleRemoveFromCookbook = (recipeId: string) => {
    const updated = removeRecipeFromCookbook(recipeId);
    setSavedRecipes(updated);
    showToast('🗑️ Recipe removed from cookbook.');
  };

  const handleAddToShoppingList = (recipe: Recipe) => {
    if (!recipe.shoppingListItems || recipe.shoppingListItems.length === 0) {
      // If all were leftovers, create an item from all ingredients
      const itemsToAdd: ShoppingListItem[] = recipe.ingredients.map((ing, idx) => ({
        id: `shop-${Date.now()}-${idx}`,
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
        category: ing.category,
        checked: false,
      }));
      const updated = addItemsToShoppingList(itemsToAdd);
      setShoppingList(updated);
    } else {
      const updated = addItemsToShoppingList(recipe.shoppingListItems);
      setShoppingList(updated);
    }
    showToast(`🛒 Added ingredients for "${recipe.title}" to shopping list!`);
  };

  const handleUpdateShoppingItems = (items: ShoppingListItem[]) => {
    setShoppingList(items);
    saveShoppingList(items);
  };

  const handleClearCheckedShopping = () => {
    const remaining = shoppingList.filter((i) => !i.checked);
    setShoppingList(remaining);
    saveShoppingList(remaining);
    showToast('Cleaned up checked items.');
  };

  const handleClearAllShopping = () => {
    setShoppingList([]);
    saveShoppingList([]);
    showToast('Shopping list cleared.');
  };

  const openNutritionModal = (recipe: Recipe) => {
    setSelectedRecipeForModal(recipe);
    setShowNutritionModal(true);
  };

  const openCookMode = (recipe: Recipe) => {
    setSelectedRecipeForModal(recipe);
    setShowCookMode(true);
  };

  const openPrintModal = (recipe: Recipe) => {
    setSelectedRecipeForModal(recipe);
    setShowPrintModal(true);
  };

  const selectRecipeFromCookbook = (recipe: Recipe) => {
    setActiveRecipe(recipe);
    setActiveTab('generator');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] text-[#3d3a35] flex font-sans selection:bg-[#f6e3d9]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#32302c] text-[#fcfaf7] px-4 py-3 rounded-xl shadow-2xl border border-[#4a463f] text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Sparkles className="w-4 h-4 text-[#d68c6a]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedRecipes.length}
        shoppingCount={shoppingList.filter((i) => !i.checked).length}
        userSettings={userSettings}
        onOpenSettings={() => setShowSettingsModal(true)}
        onOpenHealthModal={() => setShowHealthModal(true)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Stage & Right Panel Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Main Header Navbar */}
        <Navbar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          savedCount={savedRecipes.length}
          shoppingCount={shoppingList.filter((i) => !i.checked).length}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenHealthModal={() => setShowHealthModal(true)}
          userSettings={userSettings}
          isRealtimeConnected={isRealtimeConnected}
          connectionLatencyMs={connectionLatencyMs}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Notification Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-[#fdf3f0] border border-[#f5cfc1] text-[#9c391e] text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-[#d68c6a] shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-[#b34b2f] hover:text-[#7d2c16] font-bold ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {/* TAB 1: GENERATOR */}
          {activeTab === 'generator' && (
            <div className="space-y-8">
              <PantryInputForm onGenerate={handleGenerateRecipe} isLoading={isLoading} />

              {/* Generated Recipe Card */}
              {activeRecipe && (
                <div className="pt-4 border-t border-[#e8e2d8]">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#b46039] flex items-center">
                      <Sparkles className="w-4 h-4 mr-1.5 text-[#d68c6a]" />
                      Latest Generated Recipe & USDA Analysis
                    </span>
                    <button
                      onClick={() => {
                        setActiveRecipe(null);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-xs text-[#756e65] hover:text-[#3d3a35] font-medium flex items-center transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                      Back to Form
                    </button>
                  </div>

                  <RecipeCard
                    recipe={activeRecipe}
                    onStartCookMode={openCookMode}
                    onOpenNutritionModal={openNutritionModal}
                    onAddToShoppingList={handleAddToShoppingList}
                    onSaveToCookbook={handleSaveToCookbook}
                    onPrintRecipe={openPrintModal}
                    isSaved={savedRecipes.some((r) => r.id === activeRecipe.id)}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RESTAURANT FOOD INTELLIGENCE & SHORTLIST */}
          {activeTab === 'restaurants' && <RestaurantIntelligenceView />}

          {/* TAB 3: SAVED COOKBOOK */}
          {activeTab === 'saved' && (
            <SavedRecipesView
              recipes={savedRecipes}
              onSelectRecipe={selectRecipeFromCookbook}
              onRemoveRecipe={handleRemoveFromCookbook}
              onStartCookMode={openCookMode}
              onPrintRecipe={openPrintModal}
            />
          )}

          {/* TAB 4: SHOPPING LIST */}
          {activeTab === 'shopping' && (
            <ShoppingListView
              items={shoppingList}
              onUpdateItems={handleUpdateShoppingItems}
              onClearChecked={handleClearCheckedShopping}
              onClearAll={handleClearAllShopping}
            />
          )}

          {/* TAB 5: USDA NUTRITION INSPECTOR & SANDBOX */}
          {activeTab === 'inspector' && <USDAInspectorView />}
        </main>

        {/* Footer */}
        <footer className="bg-[#f7f4ee] border-t border-[#e8e2d8] py-6 mt-12 text-center text-xs text-[#756e65]">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center space-x-1.5 font-medium text-[#4a453e]">
              <span className="font-serif font-bold text-[#2d2a26]">Foodie<span className="text-[#d68c6a] italic">Me</span></span>
              <span>— AI Leftover Gourmet Generator & USDA Nutrition Analysis</span>
            </div>
            <div className="flex items-center space-x-4 text-[11px] text-[#857d72]">
              <span>Powered by Gemini 3.7 Flash & USDA FoodData Central</span>
              <span>•</span>
              <span>Zero Food Waste Initiative</span>
            </div>
          </div>
        </footer>
      </div>

      {/* MODALS */}
      {showSettingsModal && (
        <AccountSettingsModal
          settings={userSettings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setShowSettingsModal(false)}
          savedRecipesCount={savedRecipes.length}
          shoppingItemsCount={shoppingList.length}
        />
      )}

      {showNutritionModal && selectedRecipeForModal && (
        <NutritionBreakdownModal
          recipe={selectedRecipeForModal}
          onClose={() => {
            setShowNutritionModal(false);
            setSelectedRecipeForModal(null);
          }}
        />
      )}

      {showCookMode && selectedRecipeForModal && (
        <CookModeModal
          recipe={selectedRecipeForModal}
          onClose={() => {
            setShowCookMode(false);
            setSelectedRecipeForModal(null);
          }}
        />
      )}

      {showPrintModal && selectedRecipeForModal && (
        <PrintableRecipeCard
          recipe={selectedRecipeForModal}
          onClose={() => {
            setShowPrintModal(false);
            setSelectedRecipeForModal(null);
          }}
        />
      )}

      {showHealthModal && (
        <ProductionHealthModal
          onClose={() => setShowHealthModal(false)}
        />
      )}
    </div>
  );
}
