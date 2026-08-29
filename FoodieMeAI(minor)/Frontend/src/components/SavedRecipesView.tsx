import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Trash2,
  Play,
  Printer,
  Clock,
  Flame,
  Award,
  Sparkles,
  ChevronRight,
  Utensils,
  Share2,
} from 'lucide-react';
import { Recipe } from '../types';

interface SavedRecipesViewProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
  onRemoveRecipe: (recipeId: string) => void;
  onStartCookMode: (recipe: Recipe) => void;
  onPrintRecipe: (recipe: Recipe) => void;
}

export const SavedRecipesView: React.FC<SavedRecipesViewProps> = ({
  recipes,
  onSelectRecipe,
  onRemoveRecipe,
  onStartCookMode,
  onPrintRecipe,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const allTags = Array.from(
    new Set(
      recipes.flatMap((r) => [
        r.cuisine,
        ...r.dietaryBadges.map((b) => b.label),
        ...r.tags,
      ])
    )
  );

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some((i) => i.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag =
      selectedTag === 'all' ||
      r.cuisine === selectedTag ||
      r.dietaryBadges.some((b) => b.label === selectedTag) ||
      r.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-[#b46039] uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Personal Culinary Archives</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#3d3a35]">
              Your Saved Digital Cookbook
            </h2>
            <p className="text-xs sm:text-sm text-[#756e65] mt-1">
              {recipes.length} custom-generated gourmet recipes with validated USDA nutritional profiles.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-[#9c9489]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes or ingredients..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#dfd8ce] text-xs text-[#3d3a35] focus:outline-none focus:ring-2 focus:ring-[#d68c6a]"
            />
          </div>
        </div>

        {/* Tag Filters */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-5 pt-4 border-t border-[#e8e2d8]">
            <span className="text-xs text-[#756e65] mr-1 font-medium">Filter:</span>
            <button
              onClick={() => setSelectedTag('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedTag === 'all'
                  ? 'bg-[#d68c6a] text-white font-bold'
                  : 'bg-[#faf8f5] text-[#59534c] hover:bg-[#f2eee9] border border-[#e8e2d8]'
              }`}
            >
              All ({recipes.length})
            </button>
            {allTags.slice(0, 10).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedTag === tag
                    ? 'bg-[#d68c6a] text-white font-bold'
                    : 'bg-[#faf8f5] text-[#59534c] hover:bg-[#f2eee9] border border-[#e8e2d8]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e8e2d8] shadow-xs p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#faf2ec] text-[#b46039] flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-serif font-bold text-[#3d3a35]">
            {recipes.length === 0 ? 'No Saved Recipes Yet' : 'No Recipes Match Your Filter'}
          </h3>
          <p className="text-xs text-[#756e65] max-w-md mx-auto mt-1">
            {recipes.length === 0
              ? 'Generate your first leftover recipe and click "Save to Cookbook" to archive it here.'
              : 'Try clearing your search query or selecting "All" tags above.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="bg-white rounded-2xl border border-[#e8e2d8] shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Header */}
              <div className="p-5 sm:p-6 pb-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#faf2ec] text-[#8a4220] border border-[#f0ccb9] uppercase">
                    {recipe.cuisine}
                  </span>
                  <div className="flex items-center space-x-1 text-xs text-[#756e65]">
                    <Clock className="w-3.5 h-3.5 text-[#d68c6a]" />
                    <span>{recipe.totalTimeMinutes}m</span>
                  </div>
                </div>

                <h3
                  onClick={() => onSelectRecipe(recipe)}
                  className="font-serif font-bold text-lg text-[#3d3a35] group-hover:text-[#b46039] transition-colors cursor-pointer line-clamp-1"
                >
                  {recipe.title}
                </h3>
                <p className="text-xs text-[#756e65] mt-1 line-clamp-2 leading-relaxed">
                  {recipe.description}
                </p>

                {/* Dietary Badges */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {recipe.dietaryBadges.slice(0, 3).map((b) => (
                    <span
                      key={b.id}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#f1f6ef] text-[#344d30] border border-[#b8d6b0]"
                    >
                      {b.label}
                    </span>
                  ))}
                  {recipe.dietaryBadges.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-[#f2eee9] text-[#59534c] border border-[#e8e2d8]">
                      +{recipe.dietaryBadges.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Nutrition Quick Bar */}
              <div className="bg-[#faf8f5] px-5 py-2.5 border-t border-b border-[#e8e2d8] text-[11px] text-[#59534c] flex justify-between font-mono">
                <span>{recipe.nutrition.calories} kcal</span>
                <span>P: {recipe.nutrition.protein}g</span>
                <span>Net C: {recipe.nutrition.netCarbs}g</span>
                <span>F: {recipe.nutrition.totalFat}g</span>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-white flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectRecipe(recipe)}
                  className="px-3 py-1.5 rounded-xl bg-[#d68c6a] hover:bg-[#b46039] text-white text-xs font-semibold flex items-center shadow-2xs transition-colors"
                >
                  <span>View Recipe</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => onStartCookMode(recipe)}
                    className="p-2 rounded-xl bg-[#faf8f5] hover:bg-[#f2eee9] text-[#59534c] border border-[#e8e2d8] transition-colors"
                    title="Interactive Cook Mode"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#d68c6a] text-[#d68c6a]" />
                  </button>
                  <button
                    onClick={() => onPrintRecipe(recipe)}
                    className="p-2 rounded-xl bg-[#faf8f5] hover:bg-[#f2eee9] text-[#59534c] border border-[#e8e2d8] transition-colors"
                    title="Print / Save PDF"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveRecipe(recipe.id)}
                    className="p-2 rounded-xl bg-[#faf8f5] hover:bg-[#faf2ec] text-[#9c9489] hover:text-[#b46039] border border-[#e8e2d8] transition-colors"
                    title="Remove from Cookbook"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
