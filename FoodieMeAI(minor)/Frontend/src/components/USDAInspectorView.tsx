import React, { useState } from 'react';
import {
  Scale,
  Plus,
  Trash2,
  ShieldCheck,
  Award,
  Layers,
  Sparkles,
  RefreshCw,
  Info,
} from 'lucide-react';
import { verifyNutrition } from '../services/api';
import { NutritionProfile, DietaryBadge } from '../types';

export const USDAInspectorView: React.FC = () => {
  const [ingredients, setIngredients] = useState<Array<{ name: string; amount: number; unit: string }>>([
    { name: 'Chicken Breast', amount: 200, unit: 'g' },
    { name: 'Olive Oil', amount: 1, unit: 'tbsp' },
    { name: 'Baby Spinach', amount: 2, unit: 'cup' },
    { name: 'Garlic', amount: 2, unit: 'clove' },
    { name: 'Parmesan Cheese', amount: 2, unit: 'tbsp' },
  ]);

  const [servings, setServings] = useState<number>(2);
  const [newName, setNewName] = useState('');
  const [newAmount, setNewAmount] = useState<number>(100);
  const [newUnit, setNewUnit] = useState('g');
  const [nutrition, setNutrition] = useState<NutritionProfile | null>(null);
  const [badges, setBadges] = useState<DietaryBadge[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleVerify = async (items = ingredients, numServings = servings) => {
    if (!items || items.length === 0) {
      setNutrition(null);
      setBadges([]);
      return;
    }
    setIsVerifying(true);
    setErrorMessage(null);
    try {
      const result = await verifyNutrition(items, numServings);
      setNutrition(result.nutrition);
      setBadges(result.badges || []);
    } catch (err: any) {
      console.error('USDA Inspector verification error:', err);
      setErrorMessage(err.message || 'Could not verify nutrition. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Run on mount or when requested
  React.useEffect(() => {
    handleVerify();
  }, []);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const updated = [...ingredients, { name: newName.trim(), amount: Number(newAmount) || 1, unit: newUnit }];
    setIngredients(updated);
    setNewName('');
    setNewAmount(100);
    handleVerify(updated, servings);
  };

  const handleRemoveIngredient = (idx: number) => {
    const updated = ingredients.filter((_, i) => i !== idx);
    setIngredients(updated);
    handleVerify(updated, servings);
  };

  const handleUpdateAmount = (idx: number, amount: number) => {
    const updated = [...ingredients];
    updated[idx].amount = Math.max(0.1, amount);
    setIngredients(updated);
    handleVerify(updated, servings);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#889e81] uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4" />
              <span>Step 3 & 4: Live USDA Database Inspector</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3d3a35]">
              Interactive Nutrition & Macro Validator
            </h2>
            <p className="text-xs sm:text-sm text-[#756e65] mt-1">
              Test any custom ingredient ratio, examine USDA FoodData Central breakdowns, and verify real-time badge qualifications.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-[#faf8f5] p-2.5 rounded-xl border border-[#e8e2d8]">
            <span className="text-xs font-bold text-[#59534c]">Servings:</span>
            {[1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setServings(s);
                  handleVerify(ingredients, s);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  servings === s ? 'bg-[#889e81] text-white shadow-2xs' : 'bg-white text-[#59534c] border border-[#dfd8ce]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message Banner */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#fdf3f0] border border-[#f5cfc1] text-[#9c391e] text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2">
            <span className="font-bold">Error:</span>
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => handleVerify(ingredients, servings)}
            className="px-3 py-1 bg-[#9c391e] text-white rounded-lg font-bold hover:bg-[#7d2c16] transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Grid: Ingredient Builder & Live Nutrition Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ingredients Table & Quick Add */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-xs p-6">
            <h3 className="text-sm font-bold text-[#3d3a35] uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Active Recipe Ingredients ({ingredients.length})</span>
              <button
                onClick={() => handleVerify(ingredients, servings)}
                disabled={isVerifying}
                className="text-xs font-semibold text-[#889e81] hover:text-[#6b8265] flex items-center"
              >
                <RefreshCw className={`w-3 h-3 mr-1 ${isVerifying ? 'animate-spin' : ''}`} />
                Recalculate
              </button>
            </h3>

            {/* Ingredient rows */}
            <div className="space-y-2 mb-4">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d8] flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 font-semibold text-[#3d3a35]">{ing.name}</div>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      value={ing.amount}
                      onChange={(e) => handleUpdateAmount(idx, Number(e.target.value))}
                      className="w-16 px-2 py-1 rounded-lg border border-[#dfd8ce] text-right font-mono bg-white text-[#3d3a35]"
                    />
                    <span className="text-[#756e65] font-mono w-10">{ing.unit}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveIngredient(idx)}
                    className="text-[#9c9489] hover:text-[#b46039] p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddIngredient} className="grid grid-cols-12 gap-2 pt-3 border-t border-[#e8e2d8]">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Add ingredient (e.g. Avocado, Salmon, Tofu)..."
                className="col-span-6 px-3 py-2 rounded-xl border border-[#dfd8ce] text-xs bg-white text-[#3d3a35] focus:outline-none focus:ring-2 focus:ring-[#889e81]"
              />
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(Number(e.target.value))}
                placeholder="Amount"
                className="col-span-3 px-3 py-2 rounded-xl border border-[#dfd8ce] text-xs bg-white text-[#3d3a35] focus:outline-none focus:ring-2 focus:ring-[#889e81]"
              />
              <select
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="col-span-2 px-1 py-2 rounded-xl border border-[#dfd8ce] text-xs bg-white text-[#3d3a35] focus:outline-none focus:ring-2 focus:ring-[#889e81]"
              >
                <option value="g">g</option>
                <option value="cup">cup</option>
                <option value="tbsp">tbsp</option>
                <option value="tsp">tsp</option>
                <option value="oz">oz</option>
                <option value="piece">piece</option>
                <option value="clove">clove</option>
              </select>
              <button
                type="submit"
                className="col-span-1 bg-[#889e81] hover:bg-[#6b8265] text-white rounded-xl flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Nutritional Audit Panel */}
        <div className="lg:col-span-6 space-y-4">
          {nutrition && (
            <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-xs p-6 space-y-6">
              {/* Top Macros */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-[#3d3a35] uppercase tracking-wider flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-1.5 text-[#889e81]" />
                    Verified Nutrient Breakdown (Per Serving)
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#756e65]">
                    {servings} {servings === 1 ? 'Portion' : 'Portions'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8e2d8]">
                    <span className="text-[10px] uppercase font-bold text-[#756e65] block">Calories</span>
                    <span className="text-xl font-bold font-serif text-[#3d3a35]">{nutrition.calories}</span>
                    <span className="text-[9px] text-[#9c9489] block">kcal</span>
                  </div>
                  <div className="p-3 bg-[#f1f6ef] rounded-xl border border-[#b8d6b0]">
                    <span className="text-[10px] uppercase font-bold text-[#344d30] block">Protein</span>
                    <span className="text-xl font-bold font-serif text-[#233520]">{nutrition.protein}g</span>
                    <span className="text-[9px] text-[#4d6b47] block">{nutrition.macroPercentages.protein}% kcal</span>
                  </div>
                  <div className="p-3 bg-[#faf2ec] rounded-xl border border-[#f0ccb9]">
                    <span className="text-[10px] uppercase font-bold text-[#8a4220] block">Net Carbs</span>
                    <span className="text-xl font-bold font-serif text-[#5d2a13]">{nutrition.netCarbs}g</span>
                    <span className="text-[9px] text-[#b46039] block">Fiber: {nutrition.fiber}g</span>
                  </div>
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#dfd8ce]">
                    <span className="text-[10px] uppercase font-bold text-[#756e65] block">Total Fat</span>
                    <span className="text-xl font-bold font-serif text-[#3d3a35]">{nutrition.totalFat}g</span>
                    <span className="text-[9px] text-[#756e65] block">{nutrition.macroPercentages.fat}% kcal</span>
                  </div>
                </div>

                {/* Macro Ratio Bar */}
                <div className="mt-3">
                  <div className="h-2 w-full bg-[#f2eee9] rounded-full overflow-hidden flex">
                    <div style={{ width: `${nutrition.macroPercentages.protein}%` }} className="bg-[#889e81] h-full" />
                    <div style={{ width: `${nutrition.macroPercentages.carbs}%` }} className="bg-[#d68c6a] h-full" />
                    <div style={{ width: `${nutrition.macroPercentages.fat}%` }} className="bg-[#b3a898] h-full" />
                  </div>
                  <div className="flex justify-between text-[10px] text-[#756e65] mt-1 font-mono">
                    <span>Sodium: {nutrition.sodium}mg</span>
                    <span>Sugar: {nutrition.sugar}g</span>
                    <span>Potassium: {nutrition.potassium}mg</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Compatibility Badges Qualified */}
              <div className="pt-4 border-t border-[#e8e2d8]">
                <h4 className="text-xs font-bold text-[#3d3a35] uppercase tracking-wider mb-2.5 flex items-center">
                  <Award className="w-3.5 h-3.5 mr-1 text-[#d68c6a]" />
                  Triggered Dietary Compatibility Badges ({badges.length})
                </h4>
                {badges.length === 0 ? (
                  <p className="text-xs text-[#756e65] italic">No specific dietary standard met.</p>
                ) : (
                  <div className="space-y-2">
                    {badges.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d8] text-xs flex items-start space-x-2.5"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#889e81] mt-0.5 shrink-0" />
                        <div>
                          <div className="font-bold text-[#3d3a35] flex items-center gap-2">
                            <span>{b.label}</span>
                            {b.benchmarkValue && (
                              <span className="px-1.5 py-0.2 rounded bg-white text-[10px] font-mono border border-[#dfd8ce] text-[#59534c]">
                                {b.benchmarkValue}
                              </span>
                            )}
                          </div>
                          <p className="text-[#756e65] text-[11px] mt-0.5">{b.rationale}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
