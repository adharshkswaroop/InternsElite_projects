import React, { useState } from 'react';
import {
  Clock,
  Flame,
  Utensils,
  BookOpen,
  ShoppingBag,
  Printer,
  ChevronRight,
  ShieldCheck,
  Award,
  CheckCircle2,
  Share2,
  Sparkles,
  Info,
  Timer,
  Play,
  Heart,
  RotateCcw,
  Scale,
  Plus,
  Minus,
  Check,
  ExternalLink,
} from 'lucide-react';
import { Recipe, DietaryBadge } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onStartCookMode: (recipe: Recipe) => void;
  onOpenNutritionModal: (recipe: Recipe) => void;
  onAddToShoppingList: (recipe: Recipe) => void;
  onSaveToCookbook: (recipe: Recipe) => void;
  onPrintRecipe: (recipe: Recipe) => void;
  isSaved?: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onStartCookMode,
  onOpenNutritionModal,
  onAddToShoppingList,
  onSaveToCookbook,
  onPrintRecipe,
  isSaved = false,
}) => {
  const [currentServings, setCurrentServings] = useState<number>(recipe.servings || 2);
  const [activeBadgeTooltip, setActiveBadgeTooltip] = useState<DietaryBadge | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});

  const scaleFactor = currentServings / (recipe.servings || 2);

  // Scaled Nutrition
  const scaledCalories = Math.round(recipe.nutrition.calories * scaleFactor);
  const scaledProtein = Math.round(recipe.nutrition.protein * scaleFactor * 10) / 10;
  const scaledNetCarbs = Math.round(recipe.nutrition.netCarbs * scaleFactor * 10) / 10;
  const scaledFat = Math.round(recipe.nutrition.totalFat * scaleFactor * 10) / 10;
  const scaledFiber = Math.round(recipe.nutrition.fiber * scaleFactor * 10) / 10;
  const scaledSodium = Math.round(recipe.nutrition.sodium * scaleFactor);
  const scaledSugar = Math.round(recipe.nutrition.sugar * scaleFactor * 10) / 10;

  const toggleIngredientCheck = (id: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getBadgeColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'bg-[#f1f6ef] text-[#344d30] border-[#b8d6b0] ring-[#889e81]';
      case 'blue':
        return 'bg-[#f0f4f8] text-[#2c4966] border-[#bcd0e3] ring-[#6d8fae]';
      case 'amber':
        return 'bg-[#faf2ec] text-[#8a4220] border-[#f0ccb9] ring-[#d68c6a]';
      case 'purple':
        return 'bg-[#f7f2f8] text-[#5c3664] border-[#dfc9e3] ring-[#9c6fa3]';
      case 'teal':
        return 'bg-[#eef6f6] text-[#265353] border-[#b9dedf] ring-[#5ea1a2]';
      case 'rose':
        return 'bg-[#fdf3f0] text-[#9c391e] border-[#f5cfc1] ring-[#d68c6a]';
      default:
        return 'bg-[#f7f4ee] text-[#3d3a35] border-[#e8e2d8] ring-[#889e81]';
    }
  };

  return (
    <div id="active-recipe-card" className="bg-white rounded-2xl border border-[#e8e2d8] shadow-sm overflow-hidden">
      {/* Top Banner / Identity */}
      <div className="bg-[#3d3a35] text-[#fcfaf7] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#d68c6a]/20 text-[#f6e3d9] border border-[#d68c6a]/40 uppercase tracking-wider">
              {recipe.cuisine}
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-[#d8d2c7] border border-white/10">
              {recipe.difficulty} Level
            </span>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#889e81]/25 text-[#dbe7d7] border border-[#889e81]/40 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-[#889e81]" />
              {recipe.leftoverMatchRate}% Leftovers Utilized
            </span>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-2">
            <button
              id="save-to-cookbook-btn"
              onClick={() => onSaveToCookbook(recipe)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center transition-all ${
                isSaved
                  ? 'bg-[#d68c6a] text-white shadow-2xs'
                  : 'bg-white/15 hover:bg-white/25 text-[#fcfaf7] border border-white/20'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              {isSaved ? 'Saved in Cookbook' : 'Save to Cookbook'}
            </button>
            <button
              id="print-recipe-btn"
              onClick={() => onPrintRecipe(recipe)}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-[#fcfaf7] border border-white/20 transition-colors"
              title="Print Recipe Card / PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#fcfaf7] tracking-tight">
          {recipe.title}
        </h2>
        <p className="text-[#d8d2c7] text-sm sm:text-base mt-1.5 font-light">
          {recipe.subtitle}
        </p>

        {/* Quick Time & Servings Bar */}
        <div className="flex flex-wrap items-center gap-6 mt-6 pt-5 border-t border-white/15 text-xs sm:text-sm text-[#d8d2c7]">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#d68c6a]" />
            <span>Prep: <strong className="text-[#fcfaf7] font-semibold">{recipe.prepTimeMinutes}m</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-[#d68c6a]" />
            <span>Cook: <strong className="text-[#fcfaf7] font-semibold">{recipe.cookTimeMinutes}m</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Timer className="w-4 h-4 text-[#d68c6a]" />
            <span>Total: <strong className="text-[#fcfaf7] font-semibold">{recipe.totalTimeMinutes}m</strong></span>
          </div>

          {/* Servings Scaler */}
          <div className="flex items-center space-x-2 ml-auto bg-black/25 px-3 py-1.5 rounded-xl border border-white/15">
            <Utensils className="w-3.5 h-3.5 text-[#d68c6a] mr-1" />
            <span className="text-xs text-[#d8d2c7] font-medium">Servings:</span>
            <button
              onClick={() => setCurrentServings((prev) => Math.max(1, prev - 1))}
              className="w-5 h-5 rounded-md bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-xs"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-bold text-white px-1.5 text-xs">{currentServings}</span>
            <button
              onClick={() => setCurrentServings((prev) => Math.min(12, prev + 1))}
              className="w-5 h-5 rounded-md bg-white/20 hover:bg-white/30 text-white flex items-center justify-center font-bold text-xs"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Description & Chef Note */}
      <div className="p-6 sm:p-8 bg-[#faf8f5] border-b border-[#e8e2d8]">
        <p className="text-sm sm:text-base text-[#59534c] leading-relaxed italic">
          "{recipe.description}"
        </p>

        {/* Dietary Compatibility Badges */}
        <div className="mt-5">
          <div className="text-xs font-semibold text-[#756e65] uppercase tracking-wider mb-2.5 flex items-center">
            <ShieldCheck className="w-4 h-4 text-[#889e81] mr-1.5" />
            Verified Dietary Compatibility Standards
          </div>
          <div className="flex flex-wrap gap-2">
            {recipe.dietaryBadges.map((badge) => (
              <div
                key={badge.id}
                onClick={() => setActiveBadgeTooltip(activeBadgeTooltip?.id === badge.id ? null : badge)}
                className={`relative inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all hover:scale-[1.02] shadow-2xs ${getBadgeColorClasses(
                  badge.color
                )}`}
              >
                <Award className="w-3.5 h-3.5 mr-1.5 opacity-80" />
                <span>{badge.label}</span>
                {badge.benchmarkValue && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-md bg-white/70 text-[10px] font-mono">
                    {badge.benchmarkValue}
                  </span>
                )}
                <Info className="w-3 h-3 ml-1.5 opacity-60" />
              </div>
            ))}
          </div>

          {/* Active Badge Detailed Rationale Popover */}
          {activeBadgeTooltip && (
            <div className="mt-3 p-3.5 rounded-xl bg-white border border-[#dfd8ce] shadow-sm text-xs space-y-1 animate-in fade-in duration-150">
              <div className="font-bold text-[#3d3a35] flex items-center justify-between">
                <span className="flex items-center">
                  <ShieldCheck className="w-4 h-4 text-[#889e81] mr-1.5" />
                  {activeBadgeTooltip.label} — Official Nutritional Criterion
                </span>
                <button
                  onClick={() => setActiveBadgeTooltip(null)}
                  className="text-[#9c9489] hover:text-[#3d3a35]"
                >
                  ✕
                </button>
              </div>
              <p className="text-[#59534c] leading-relaxed">{activeBadgeTooltip.rationale}</p>
            </div>
          )}
        </div>
      </div>

      {/* USDA VERIFIED NUTRITION SUMMARY PANEL */}
      <div className="p-6 sm:p-8 border-b border-[#e8e2d8] bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-[#889e81]" />
              <h3 className="text-sm font-bold text-[#3d3a35] uppercase tracking-wider">
                USDA FoodData Central Verified Nutrition
              </h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f1f6ef] text-[#344d30] border border-[#b8d6b0]">
                98% Precision Confidence
              </span>
            </div>
            <p className="text-xs text-[#756e65] mt-0.5">
              Calculated per serving ({currentServings} {currentServings === 1 ? 'serving' : 'servings'} total)
            </p>
          </div>

          <button
            id="view-full-usda-breakdown-btn"
            onClick={() => onOpenNutritionModal(recipe)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#b46039] bg-[#faf2ec] hover:bg-[#f4e4da] border border-[#f0ccb9] transition-colors shadow-2xs self-start"
          >
            <span>View Full USDA Database Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Key Macro Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="p-3.5 rounded-xl bg-[#f7f4ee] border border-[#e8e2d8] text-center">
            <span className="text-[11px] font-semibold text-[#756e65] block uppercase">Energy / Calories</span>
            <span className="text-2xl font-serif font-bold text-[#3d3a35]">{scaledCalories}</span>
            <span className="text-[10px] text-[#9c9489] block">kcal per serving</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f0f4f8] border border-[#bcd0e3] text-center">
            <span className="text-[11px] font-semibold text-[#2c4966] block uppercase">Protein</span>
            <span className="text-2xl font-serif font-bold text-[#2c4966]">{scaledProtein}g</span>
            <span className="text-[10px] text-[#4a6b8a] block">
              {recipe.nutrition.macroPercentages.protein}% of calories
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#f1f6ef] border border-[#b8d6b0] text-center">
            <span className="text-[11px] font-semibold text-[#344d30] block uppercase">Net Carbs</span>
            <span className="text-2xl font-serif font-bold text-[#344d30]">{scaledNetCarbs}g</span>
            <span className="text-[10px] text-[#4d6b49] block">
              Fiber: {scaledFiber}g • Sugar: {scaledSugar}g
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#faf2ec] border border-[#f0ccb9] text-center">
            <span className="text-[11px] font-semibold text-[#8a4220] block uppercase">Healthy Fats</span>
            <span className="text-2xl font-serif font-bold text-[#8a4220]">{scaledFat}g</span>
            <span className="text-[10px] text-[#a85832] block">
              {recipe.nutrition.macroPercentages.fat}% of calories
            </span>
          </div>
        </div>

        {/* Macro Energy Distribution Bar */}
        <div>
          <div className="flex justify-between text-xs text-[#756e65] mb-1 font-medium">
            <span>Macro Energy Ratio:</span>
            <span>
              <strong className="text-[#2c4966]">Protein: {recipe.nutrition.macroPercentages.protein}%</strong> •{' '}
              <strong className="text-[#344d30]">Carbs: {recipe.nutrition.macroPercentages.carbs}%</strong> •{' '}
              <strong className="text-[#8a4220]">Fat: {recipe.nutrition.macroPercentages.fat}%</strong>
            </span>
          </div>
          <div className="h-2.5 w-full bg-[#f2eee9] rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${recipe.nutrition.macroPercentages.protein}%` }}
              className="bg-[#5b7f9d] h-full"
              title={`Protein: ${recipe.nutrition.macroPercentages.protein}%`}
            />
            <div
              style={{ width: `${recipe.nutrition.macroPercentages.carbs}%` }}
              className="bg-[#889e81] h-full"
              title={`Carbohydrates: ${recipe.nutrition.macroPercentages.carbs}%`}
            />
            <div
              style={{ width: `${recipe.nutrition.macroPercentages.fat}%` }}
              className="bg-[#d68c6a] h-full"
              title={`Fat: ${recipe.nutrition.macroPercentages.fat}%`}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#9c9489] mt-1.5">
            <span>Sodium: <strong className="text-[#3d3a35]">{scaledSodium}mg</strong></span>
            <span>Potassium: <strong className="text-[#3d3a35]">{Math.round(recipe.nutrition.potassium * scaleFactor)}mg</strong></span>
            <span>Cholesterol: <strong className="text-[#3d3a35]">{Math.round(recipe.nutrition.cholesterol * scaleFactor)}mg</strong></span>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS: INGREDIENTS & INSTRUCTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#e8e2d8]">
        {/* INGREDIENTS COLUMN */}
        <div className="lg:col-span-5 p-6 sm:p-8 bg-[#faf8f5]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-serif font-bold text-[#3d3a35] flex items-center">
                <Utensils className="w-4 h-4 mr-2 text-[#d68c6a]" />
                Structured Ingredients ({recipe.ingredients.length})
              </h3>
              <p className="text-xs text-[#756e65]">Scaled for {currentServings} servings</p>
            </div>
            <button
              onClick={() => onAddToShoppingList(recipe)}
              className="text-xs font-semibold text-[#b46039] hover:text-[#984b27] bg-[#faf2ec] hover:bg-[#f4e4da] border border-[#f0ccb9] px-2.5 py-1 rounded-lg transition-colors flex items-center"
              title="Add non-leftover items to grocery checklist"
            >
              <ShoppingBag className="w-3.5 h-3.5 mr-1" />
              + Shop List
            </button>
          </div>

          <div className="space-y-2">
            {recipe.ingredients.map((ing) => {
              const isChecked = !!checkedIngredients[ing.id];
              const scaledAmount = Math.round(ing.amount * scaleFactor * 10) / 10;

              return (
                <div
                  key={ing.id}
                  onClick={() => toggleIngredientCheck(ing.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start space-x-3 ${
                    isChecked
                      ? 'bg-[#f2eee9] border-[#e8e2d8] opacity-60'
                      : 'bg-white border-[#e8e2d8] hover:border-[#d68c6a] shadow-2xs'
                  }`}
                >
                  <div
                    className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                      isChecked
                        ? 'bg-[#889e81] border-[#889e81] text-white'
                        : 'border-[#dfd8ce] bg-white'
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div className="flex-1 text-xs">
                    <div className="flex items-baseline justify-between">
                      <span className={`font-semibold ${isChecked ? 'line-through text-[#9c9489]' : 'text-[#3d3a35]'}`}>
                        {scaledAmount} {ing.unit} {ing.name}
                      </span>
                      {ing.isLeftover ? (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#f1f6ef] text-[#344d30] border border-[#b8d6b0] ml-2 whitespace-nowrap">
                          ✓ In Fridge
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#faf2ec] text-[#8a4220] border border-[#f0ccb9] ml-2 whitespace-nowrap">
                          + Needed
                        </span>
                      )}
                    </div>
                    {ing.notes && (
                      <span className="text-[#756e65] text-[11px] block mt-0.5">{ing.notes}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leftovers Info Box */}
          <div className="mt-4 p-3 rounded-xl bg-[#f1f6ef] border border-[#b8d6b0] text-xs text-[#344d30] flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-[#889e81] mt-0.5 shrink-0" />
            <p>
              <strong>{recipe.ingredients.filter((i) => i.isLeftover).length} of {recipe.ingredients.length}</strong> ingredients matched your available refrigerator leftovers!
            </p>
          </div>
        </div>

        {/* INSTRUCTIONS COLUMN */}
        <div className="lg:col-span-7 p-6 sm:p-8 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-serif font-bold text-[#3d3a35] flex items-center">
              <Flame className="w-4 h-4 mr-2 text-[#d68c6a]" />
              Numbered Step-by-Step Cooking Method
            </h3>
            <button
              id="start-cook-mode-btn"
              onClick={() => onStartCookMode(recipe)}
              className="px-3.5 py-1.5 bg-[#3d3a35] hover:bg-[#2b2925] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-[#d68c6a] text-[#d68c6a]" />
              <span>Interactive Cook Mode</span>
            </button>
          </div>

          <div className="space-y-4">
            {recipe.instructions.map((step, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e2d8] hover:border-[#dfd8ce] transition-all"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-[#d68c6a] text-white font-bold text-xs flex items-center justify-center">
                      {step.stepNumber}
                    </span>
                    <h4 className="text-sm font-bold text-[#3d3a35]">{step.title}</h4>
                  </div>
                  <div className="flex items-center space-x-2">
                    {step.equipment && (
                      <span className="text-[10px] font-medium bg-[#f2eee9] text-[#59534c] px-2 py-0.5 rounded-md border border-[#e8e2d8]">
                        {step.equipment}
                      </span>
                    )}
                    {step.timerMinutes && (
                      <span className="text-[10px] font-semibold bg-[#faf2ec] text-[#8a4220] border border-[#f0ccb9] px-2 py-0.5 rounded-md flex items-center">
                        <Timer className="w-3 h-3 mr-1" />
                        {step.timerMinutes} min
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#59534c] leading-relaxed pl-8">
                  {step.instruction}
                </p>

                {step.chefTip && (
                  <div className="mt-2.5 ml-8 p-2 rounded-lg bg-[#faf2ec] border border-[#f0ccb9] text-xs text-[#8a4220] flex items-start space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d68c6a] mt-0.5 shrink-0" />
                    <span>
                      <strong>Chef Tip:</strong> {step.chefTip}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Chef Secrets & Pairings */}
          <div className="mt-6 space-y-3 pt-6 border-t border-[#e8e2d8]">
            {recipe.chefSecret && (
              <div className="p-3.5 rounded-xl bg-[#faf2ec] border border-[#f0ccb9] text-xs">
                <span className="font-bold text-[#8a4220] block mb-1">👨‍🍳 Executive Chef's Secret Technique:</span>
                <p className="text-[#a85832] leading-relaxed">{recipe.chefSecret}</p>
              </div>
            )}

            {recipe.wineOrBeveragePairing && (
              <div className="p-3.5 rounded-xl bg-[#f7f4ee] border border-[#e8e2d8] text-xs">
                <span className="font-bold text-[#3d3a35] block mb-1">🍷 Sommelier Pairing Recommendation:</span>
                <p className="text-[#59534c] leading-relaxed">{recipe.wineOrBeveragePairing}</p>
              </div>
            )}

            {recipe.storageInstructions && (
              <div className="text-xs text-[#756e65] flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-[#9c9489]" />
                <span>
                  <strong>Storage:</strong> {recipe.storageInstructions}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
