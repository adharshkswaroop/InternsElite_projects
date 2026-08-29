import React, { useState } from 'react';
import {
  X,
  Scale,
  ShieldCheck,
  Download,
  Printer,
  Info,
  ExternalLink,
  ChevronRight,
  Database,
  Layers,
  Heart,
  Zap,
} from 'lucide-react';
import { Recipe } from '../types';

interface NutritionBreakdownModalProps {
  recipe: Recipe | null;
  onClose: () => void;
}

export const NutritionBreakdownModal: React.FC<NutritionBreakdownModalProps> = ({
  recipe,
  onClose,
}) => {
  const [filterGroup, setFilterGroup] = useState<string>('all');

  if (!recipe) return null;

  const nutrition = recipe.nutrition;
  const breakdown = nutrition.ingredientBreakdown || [];

  const foodGroups = Array.from(new Set(breakdown.map((b) => b.foodGroup || 'Other')));
  const filteredBreakdown = filterGroup === 'all'
    ? breakdown
    : breakdown.filter((b) => (b.foodGroup || 'Other') === filterGroup);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div
        id="usda-nutrition-modal"
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-[#e8e2d8] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-[#3d3a35] text-[#fcfaf7] p-6 sm:p-7 flex items-center justify-between border-b border-[#2b2925]">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#889e81] uppercase tracking-wider mb-1">
              <Database className="w-4 h-4" />
              <span>Official Food Database Verification</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#fcfaf7]">
              USDA FoodData Central Nutritional Audit
            </h2>
            <p className="text-[#d8d2c7] text-xs mt-0.5">
              Verified for <strong className="text-[#fcfaf7]">{recipe.title}</strong> ({recipe.servings} Servings)
            </p>
          </div>

          <button
            id="close-nutrition-modal-btn"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-[#d8d2c7] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Top Verification Stats Banner */}
          <div className="p-4 rounded-xl bg-[#f1f6ef] border border-[#b8d6b0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#344d30]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#889e81] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="font-bold text-sm text-[#243521]">
                  {nutrition.verifiedBy}
                </div>
                <div className="text-[#435f3d] text-[11px]">
                  Calibrated against USDA Standard Reference Foundation & Survey Nutrients • Verified: {nutrition.usdaVerifiedDate}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 font-mono text-xs bg-white px-3 py-1.5 rounded-lg border border-[#b8d6b0]">
              <span className="text-[#756e65]">Confidence Score:</span>
              <strong className="text-[#344d30] text-sm font-bold">{nutrition.confidenceScore}%</strong>
            </div>
          </div>

          {/* FDA Style Nutrition Facts Label Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Classic Nutrition Facts Box */}
            <div className="md:col-span-5 border-2 border-[#3d3a35] p-4 rounded-lg bg-white font-sans text-[#3d3a35] shadow-xs">
              <h3 className="text-2xl font-black tracking-tight leading-none">Nutrition Facts</h3>
              <div className="text-xs border-b border-[#3d3a35] pb-1 mt-1 font-medium">
                {nutrition.servings} servings per container
              </div>
              <div className="flex justify-between items-baseline font-bold border-b-8 border-[#3d3a35] pb-1 text-sm">
                <span>Serving size</span>
                <span>1 portion ({Math.round(100 / nutrition.servings)}% of recipe)</span>
              </div>

              <div className="flex justify-between items-baseline border-b-4 border-[#3d3a35] py-1">
                <div>
                  <div className="text-xs font-black uppercase">Amount per serving</div>
                  <div className="text-2xl font-black leading-none">Calories</div>
                </div>
                <div className="text-3xl font-black">{nutrition.calories}</div>
              </div>

              <div className="text-right text-[10px] font-bold border-b border-[#3d3a35] py-0.5">
                % Daily Value *
              </div>

              <div className="divide-y divide-[#e8e2d8] text-xs">
                <div className="flex justify-between py-1 font-bold">
                  <span>Total Fat <span className="font-normal">{nutrition.totalFat}g</span></span>
                  <span>{Math.round((nutrition.totalFat / 78) * 100)}%</span>
                </div>
                <div className="flex justify-between py-0.5 pl-4 text-[#756e65]">
                  <span>Saturated Fat {nutrition.saturatedFat}g</span>
                  <span>{Math.round((nutrition.saturatedFat / 20) * 100)}%</span>
                </div>
                <div className="flex justify-between py-1 font-bold">
                  <span>Cholesterol <span className="font-normal">{nutrition.cholesterol}mg</span></span>
                  <span>{Math.round((nutrition.cholesterol / 300) * 100)}%</span>
                </div>
                <div className="flex justify-between py-1 font-bold">
                  <span>Sodium <span className="font-normal">{nutrition.sodium}mg</span></span>
                  <span>{Math.round((nutrition.sodium / 2300) * 100)}%</span>
                </div>
                <div className="flex justify-between py-1 font-bold">
                  <span>Total Carbohydrate <span className="font-normal">{nutrition.totalCarbs}g</span></span>
                  <span>{Math.round((nutrition.totalCarbs / 275) * 100)}%</span>
                </div>
                <div className="flex justify-between py-0.5 pl-4 text-[#756e65] font-medium">
                  <span>Dietary Fiber {nutrition.fiber}g</span>
                  <span>{Math.round((nutrition.fiber / 28) * 100)}%</span>
                </div>
                <div className="flex justify-between py-0.5 pl-4 text-[#756e65]">
                  <span>Total Sugars {nutrition.sugar}g</span>
                  <span>—</span>
                </div>
                <div className="flex justify-between py-1 font-bold bg-[#f1f6ef] px-1 rounded">
                  <span className="text-[#344d30] font-extrabold">Net Impact Carbs</span>
                  <span className="text-[#344d30] font-black">{nutrition.netCarbs}g</span>
                </div>
                <div className="flex justify-between py-1 font-bold border-t-8 border-[#3d3a35]">
                  <span>Protein <span className="font-normal">{nutrition.protein}g</span></span>
                  <span>{Math.round((nutrition.protein / 50) * 100)}%</span>
                </div>
                <div className="flex justify-between py-1 text-[#59534c]">
                  <span>Potassium {nutrition.potassium}mg</span>
                  <span>{Math.round((nutrition.potassium / 4700) * 100)}%</span>
                </div>
              </div>

              <div className="border-t-4 border-[#3d3a35] mt-2 pt-1 text-[9px] text-[#756e65] leading-tight">
                * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
              </div>
            </div>

            {/* Right: Macro Distribution & Visual Insights */}
            <div className="md:col-span-7 space-y-4">
              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e2d8]">
                <h4 className="text-xs font-bold text-[#3d3a35] uppercase tracking-wider mb-2">
                  Macronutrient Energy Contribution
                </h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-[#f0f4f8] rounded-lg border border-[#bcd0e3]">
                    <span className="text-[10px] uppercase font-bold text-[#2c4966] block">Protein</span>
                    <span className="text-xl font-bold text-[#2c4966] font-serif">{nutrition.protein}g</span>
                    <span className="text-[10px] text-[#4a6b8a] block font-medium mt-0.5">
                      {nutrition.macroPercentages.protein}% Calories
                    </span>
                  </div>
                  <div className="p-3 bg-[#f1f6ef] rounded-lg border border-[#b8d6b0]">
                    <span className="text-[10px] uppercase font-bold text-[#344d30] block">Carbs (Net)</span>
                    <span className="text-xl font-bold text-[#344d30] font-serif">{nutrition.netCarbs}g</span>
                    <span className="text-[10px] text-[#4d6b49] block font-medium mt-0.5">
                      {nutrition.macroPercentages.carbs}% Calories
                    </span>
                  </div>
                  <div className="p-3 bg-[#faf2ec] rounded-lg border border-[#f0ccb9]">
                    <span className="text-[10px] uppercase font-bold text-[#8a4220] block">Fat (Total)</span>
                    <span className="text-xl font-bold text-[#8a4220] font-serif">{nutrition.totalFat}g</span>
                    <span className="text-[10px] text-[#a85832] block font-medium mt-0.5">
                      {nutrition.macroPercentages.fat}% Calories
                    </span>
                  </div>
                </div>
              </div>

              {/* Dietary Certification Rationales */}
              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8e2d8]">
                <h4 className="text-xs font-bold text-[#3d3a35] uppercase tracking-wider mb-2">
                  Dietary Badges & Compliance Benchmarks
                </h4>
                <div className="space-y-2">
                  {recipe.dietaryBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="p-2.5 rounded-lg bg-white border border-[#e8e2d8] text-xs flex items-start space-x-2.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#889e81] mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-[#3d3a35] flex items-center gap-2">
                          <span>{badge.label}</span>
                          {badge.benchmarkValue && (
                            <span className="px-1.5 py-0.2 rounded bg-[#f2eee9] text-[10px] font-mono text-[#59534c]">
                              {badge.benchmarkValue}
                            </span>
                          )}
                        </div>
                        <p className="text-[#756e65] text-[11px] mt-0.5 leading-tight">{badge.rationale}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Line-by-Line Ingredient USDA Breakdown Table */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#3d3a35] uppercase tracking-wider flex items-center">
                  <Layers className="w-4 h-4 mr-1.5 text-[#d68c6a]" />
                  Item-by-Item USDA Nutrient Contribution
                </h3>
                <p className="text-xs text-[#756e65]">
                  Values for total recipe batch ({recipe.servings} portions)
                </p>
              </div>

              {/* Filter by Food Group */}
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-[#756e65]">Category:</span>
                <select
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="px-2 py-1 rounded-lg border border-[#dfd8ce] text-xs bg-white text-[#3d3a35]"
                >
                  <option value="all">All Food Groups ({breakdown.length})</option>
                  {foodGroups.map((fg) => (
                    <option key={fg} value={fg}>{fg}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto border border-[#e8e2d8] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7f4ee] text-[#59534c] font-bold border-b border-[#e8e2d8] uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">Ingredient / Portion</th>
                    <th className="p-3">USDA Group / FDC ID</th>
                    <th className="p-3 text-right">Calories</th>
                    <th className="p-3 text-right">Protein</th>
                    <th className="p-3 text-right">Carbs</th>
                    <th className="p-3 text-right">Fat</th>
                    <th className="p-3 text-right">Fiber</th>
                    <th className="p-3 text-right">Sodium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8e2d8] text-[#3d3a35]">
                  {filteredBreakdown.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="p-3 font-semibold text-[#3d3a35]">
                        {item.ingredient}
                        <span className="block text-[10px] font-normal text-[#756e65]">
                          {item.portion}
                        </span>
                      </td>
                      <td className="p-3 text-[#59534c]">
                        <span className="px-1.5 py-0.5 rounded bg-[#f2eee9] text-[10px] font-medium border border-[#e8e2d8]">
                          {item.foodGroup || 'Pantry'}
                        </span>
                        {item.fdcId && (
                          <span className="block text-[9px] font-mono text-[#9c9489] mt-0.5">
                            FDC #{item.fdcId}
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right font-bold text-[#3d3a35]">{item.calories} kcal</td>
                      <td className="p-3 text-right text-[#2c4966] font-medium">{item.protein}g</td>
                      <td className="p-3 text-right text-[#344d30] font-medium">{item.carbs}g</td>
                      <td className="p-3 text-right text-[#8a4220] font-medium">{item.fat}g</td>
                      <td className="p-3 text-right text-[#59534c]">{item.fiber}g</td>
                      <td className="p-3 text-right text-[#59534c]">{item.sodium}mg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#faf8f5] p-4 sm:p-5 border-t border-[#e8e2d8] flex items-center justify-between">
          <div className="text-xs text-[#756e65] flex items-center">
            <Info className="w-3.5 h-3.5 mr-1.5 text-[#9c9489]" />
            Nutritional data complies with USDA FoodData Central & FDA Dietary Reference Intakes (DRIs).
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#3d3a35] hover:bg-[#2b2925] text-[#fcfaf7] rounded-xl text-xs font-semibold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
