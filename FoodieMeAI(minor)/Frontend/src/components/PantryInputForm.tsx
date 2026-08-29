import React, { useState, useEffect } from 'react';
import {
  Plus,
  X,
  Clock,
  Flame,
  Utensils,
  Leaf,
  Sparkles,
  Zap,
  Sliders,
  Check,
  AlertCircle,
  Lightbulb,
  Heart,
  ShieldCheck,
} from 'lucide-react';
import { DietaryConstraint, KitchenEquipment, UserInputParams } from '../types';
import { getPantrySuggestions } from '../services/api';

interface PantryInputFormProps {
  onGenerate: (params: UserInputParams) => void;
  isLoading: boolean;
}

const COMMON_PANTRY_PRESETS = [
  'Eggs',
  'Chicken Breast',
  'Salmon Fillet',
  'Tofu',
  'Baby Spinach',
  'Broccoli',
  'Bell Peppers',
  'Garlic',
  'Onion',
  'Cherry Tomatoes',
  'Mushrooms',
  'Zucchini',
  'Avocado',
  'Greek Yogurt',
  'Parmesan',
  'Cheddar Cheese',
  'Olive Oil',
  'Brown Rice',
  'Quinoa',
  'Black Beans',
  'Almonds',
  'Soy Sauce / Tamari',
];

const DIETARY_OPTIONS: { id: DietaryConstraint; label: string; icon: string; desc: string }[] = [
  { id: 'keto', label: 'Keto', icon: '🥑', desc: 'Net carbs < 9g, high healthy fats' },
  { id: 'high-protein', label: 'High-Protein', icon: '🥩', desc: '>= 25g protein per serving' },
  { id: 'low-sodium', label: 'Low-Sodium', icon: '❤️', desc: '<= 140mg sodium (AHA guideline)' },
  { id: 'gluten-free', label: 'Gluten-Free', icon: '🌾', desc: 'Zero wheat, barley, or rye' },
  { id: 'vegan', label: 'Vegan', icon: '🌱', desc: '100% plant-based formulation' },
  { id: 'dairy-free', label: 'Dairy-Free', icon: '🥛', desc: 'Zero milk, cream, or cheese' },
  { id: 'diabetic-friendly', label: 'Diabetic-Friendly', icon: '🩸', desc: 'Low GI, <5g sugar, high fiber' },
  { id: 'paleo', label: 'Paleo', icon: '🥥', desc: 'Unprocessed whole ingredients' },
  { id: 'mediterranean', label: 'Mediterranean', icon: '🫒', desc: 'Heart-healthy fats & veggies' },
];

const EQUIPMENT_OPTIONS: { id: KitchenEquipment; label: string; icon: string }[] = [
  { id: 'stovetop', label: 'Stovetop / Skillet', icon: '🍳' },
  { id: 'oven', label: 'Oven', icon: '♨️' },
  { id: 'air-fryer', label: 'Air Fryer', icon: '🌪️' },
  { id: 'instant-pot', label: 'Instant Pot / Pressure Cooker', icon: '⏱️' },
  { id: 'blender', label: 'Blender / Food Processor', icon: '🌪️' },
  { id: 'grill', label: 'Grill / Griddle', icon: '🔥' },
  { id: 'cast-iron-skillet', label: 'Cast Iron Skillet', icon: '🥘' },
  { id: 'microwave', label: 'Microwave', icon: '⚡' },
];

const INSPIRATION_PRESETS = [
  {
    title: 'High-Protein Keto Sauté',
    ingredients: ['Chicken Breast', 'Baby Spinach', 'Garlic', 'Olive Oil', 'Parmesan', 'Mushrooms'],
    diets: ['keto', 'high-protein', 'gluten-free'] as DietaryConstraint[],
    time: 20,
    meal: 'Dinner' as const,
  },
  {
    title: '20-Min Low-Sodium Salmon',
    ingredients: ['Salmon Fillet', 'Broccoli', 'Lemon', 'Garlic', 'Olive Oil', 'Black Pepper'],
    diets: ['low-sodium', 'gluten-free', 'dairy-free'] as DietaryConstraint[],
    time: 20,
    meal: 'Dinner' as const,
  },
  {
    title: 'Vegan Buddha Power Bowl',
    ingredients: ['Tofu', 'Quinoa', 'Avocado', 'Baby Spinach', 'Cherry Tomatoes', 'Almonds'],
    diets: ['vegan', 'gluten-free', 'high-protein'] as DietaryConstraint[],
    time: 25,
    meal: 'Lunch' as const,
  },
  {
    title: 'Fridge Clean-out Scramble',
    ingredients: ['Eggs', 'Bell Peppers', 'Onion', 'Cheddar Cheese', 'Cherry Tomatoes'],
    diets: ['keto', 'gluten-free'] as DietaryConstraint[],
    time: 15,
    meal: 'Breakfast' as const,
  },
];

export const PantryInputForm: React.FC<PantryInputFormProps> = ({ onGenerate, isLoading }) => {
  const [ingredients, setIngredients] = useState<string[]>([
    'Chicken Breast',
    'Baby Spinach',
    'Garlic',
    'Olive Oil',
    'Parmesan',
  ]);
  const [newIngredient, setNewIngredient] = useState('');
  const [dietaryConstraints, setDietaryConstraints] = useState<DietaryConstraint[]>([
    'high-protein',
    'gluten-free',
  ]);
  const [maxCookTime, setMaxCookTime] = useState<number>(30);
  const [equipment, setEquipment] = useState<KitchenEquipment[]>(['stovetop', 'oven']);
  const [servings, setServings] = useState<number>(2);
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Master Chef'>('Intermediate');
  const [mealType, setMealType] = useState<'Dinner' | 'Lunch' | 'Breakfast' | 'Quick Snack' | 'Dessert' | 'Any'>('Dinner');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [allergiesToAvoid, setAllergiesToAvoid] = useState<string[]>([]);
  const [allergyInput, setAllergyInput] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Suggestions state
  const [pantrySuggestions, setPantrySuggestions] = useState<Array<{ name: string; reason: string; category: string }>>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  // Fetch AI suggestions when ingredients change
  useEffect(() => {
    if (ingredients.length === 0) {
      setPantrySuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const suggestions = await getPantrySuggestions(ingredients);
        // filter out already added items
        const filtered = suggestions.filter(
          (s) => !ingredients.some((i) => i.toLowerCase().includes(s.name.toLowerCase()))
        );
        setPantrySuggestions(filtered.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [ingredients]);

  const handleAddIngredient = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !ingredients.some((i) => i.toLowerCase() === trimmed.toLowerCase())) {
      setIngredients([...ingredients, trimmed]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient(newIngredient);
    }
  };

  const toggleDietary = (diet: DietaryConstraint) => {
    if (dietaryConstraints.includes(diet)) {
      setDietaryConstraints(dietaryConstraints.filter((d) => d !== diet));
    } else {
      setDietaryConstraints([...dietaryConstraints, diet]);
    }
  };

  const toggleEquipment = (eq: KitchenEquipment) => {
    if (equipment.includes(eq)) {
      if (equipment.length > 1) {
        setEquipment(equipment.filter((e) => e !== eq));
      }
    } else {
      setEquipment([...equipment, eq]);
    }
  };

  const handleAddAllergy = () => {
    if (allergyInput.trim() && !allergiesToAvoid.includes(allergyInput.trim())) {
      setAllergiesToAvoid([...allergiesToAvoid, allergyInput.trim()]);
      setAllergyInput('');
    }
  };

  const applyInspirationPreset = (preset: typeof INSPIRATION_PRESETS[0]) => {
    setIngredients(preset.ingredients);
    setDietaryConstraints(preset.diets);
    setMaxCookTime(preset.time);
    setMealType(preset.meal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.length === 0) {
      alert('Please add at least one leftover ingredient from your refrigerator or pantry.');
      return;
    }

    onGenerate({
      ingredients,
      dietaryConstraints,
      maxCookTime,
      equipment,
      servings,
      skillLevel,
      mealType,
      allergiesToAvoid,
      customPrompt: customPrompt.trim() || undefined,
    });
  };

  return (
    <div className="bg-[#ffffff] rounded-2xl border border-[#e8e2d8] shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#3d3a35] via-[#4a463f] to-[#32302c] p-6 sm:p-8 text-[#fcfaf7]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#e8cbbd] text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-[#d68c6a]" />
              <span>Step 1: Inventory & Dietary Constraints</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#fcfaf7] tracking-tight">
              Culinary Leftover Transformer
            </h1>
            <p className="text-[#d8d2c7] text-sm mt-1 max-w-2xl">
              Turn what's in your fridge into gourmet meals. We validate complete
              macronutrients against official USDA FoodData Central standards.
            </p>
          </div>

          {/* Quick Presets Dropdown / Buttons */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15">
            <div className="text-xs font-semibold text-[#f6e3d9] mb-2 flex items-center">
              <Zap className="w-3.5 h-3.5 mr-1 text-[#d68c6a]" /> Quick Inspiration Presets
            </div>
            <div className="flex flex-wrap gap-1.5">
              {INSPIRATION_PRESETS.map((p) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => applyInspirationPreset(p)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white/15 hover:bg-white/25 text-[#fcfaf7] transition-all text-left font-medium"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* SECTION 1: INGREDIENTS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-[#3d3a35] flex items-center">
              <span className="w-6 h-6 rounded-full bg-[#faf2ec] text-[#b46039] font-bold text-xs flex items-center justify-center mr-2 border border-[#f0ccb9]">
                1
              </span>
              Available Fridge & Pantry Ingredients ({ingredients.length})
            </label>
            <button
              type="button"
              onClick={() => setIngredients([])}
              className="text-xs text-[#9c9489] hover:text-[#b46039] transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Ingredient Input Field */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="pantry-ingredient-input"
                type="text"
                value={newIngredient}
                onChange={(e) => setNewIngredient(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type an ingredient (e.g. Salmon, Spinach, Greek Yogurt, Leftover Rice)..."
                className="w-full px-4 py-2.5 rounded-xl border border-[#dfd8ce] focus:outline-none focus:ring-2 focus:ring-[#d68c6a] focus:border-[#d68c6a] text-sm text-[#3d3a35] placeholder-[#9c9489] bg-[#faf8f5]"
              />
            </div>
            <button
              id="add-ingredient-btn"
              type="button"
              onClick={() => handleAddIngredient(newIngredient)}
              className="px-4 py-2.5 bg-[#d68c6a] hover:bg-[#b46039] text-white rounded-xl text-sm font-medium transition-colors flex items-center shadow-xs"
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </button>
          </div>

          {/* Active Ingredients Tags */}
          <div className="mt-3 min-h-[48px] p-3 bg-[#f7f4ee] rounded-xl border border-[#e8e2d8] flex flex-wrap gap-2">
            {ingredients.length === 0 ? (
              <span className="text-xs text-[#9c9489] italic flex items-center">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5 text-[#9c9489]" />
                No ingredients added yet. Pick from popular staples below or type custom leftovers.
              </span>
            ) : (
              ingredients.map((ing, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-[#dfd8ce] text-[#3d3a35] shadow-2xs group hover:border-[#d68c6a] transition-all"
                >
                  <span className="w-2 h-2 rounded-full bg-[#889e81] mr-2" />
                  {ing}
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(idx)}
                    className="ml-2 text-[#9c9489] hover:text-[#b46039] group-hover:text-[#59534c] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Quick-Pick Staples Cloud */}
          <div className="mt-3">
            <div className="text-xs font-medium text-[#756e65] mb-1.5">Quick-Add Common Pantry Items:</div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {COMMON_PANTRY_PRESETS.map((item) => {
                const isSelected = ingredients.some((i) => i.toLowerCase() === item.toLowerCase());
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleAddIngredient(item)}
                    disabled={isSelected}
                    className={`px-2.5 py-1 rounded-md text-xs transition-all ${
                      isSelected
                        ? 'bg-[#e8e2d8] text-[#9c9489] cursor-not-allowed'
                        : 'bg-[#f7f4ee] hover:bg-[#faf2ec] hover:text-[#b46039] text-[#59534c] border border-[#e8e2d8]'
                    }`}
                  >
                    + {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Pairing Suggestions */}
          {pantrySuggestions.length > 0 && (
            <div className="mt-3.5 p-3 rounded-xl bg-[#faf2ec] border border-[#f0ccb9] text-xs">
              <div className="font-semibold text-[#8a4220] flex items-center mb-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#d68c6a] mr-1.5" />
                AI Culinary Pairing Suggestions:
              </div>
              <div className="flex flex-wrap gap-2">
                {pantrySuggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleAddIngredient(sug.name)}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white border border-[#f0ccb9] text-[#8a4220] hover:bg-[#faf8f5] text-xs font-medium shadow-2xs transition-all"
                  >
                    <span className="font-bold mr-1">+ {sug.name}</span>
                    <span className="text-[10px] text-[#b46039]">({sug.reason})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: DIETARY CONSTRAINTS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-semibold text-[#3d3a35] flex items-center">
              <span className="w-6 h-6 rounded-full bg-[#f1f6ef] text-[#4d6645] font-bold text-xs flex items-center justify-center mr-2 border border-[#c7dec2]">
                2
              </span>
              Dietary Constraints & Certification Standards
            </label>
            <span className="text-xs text-[#756e65]">
              {dietaryConstraints.length} selected
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5">
            {DIETARY_OPTIONS.map((diet) => {
              const isSelected = dietaryConstraints.includes(diet.id);
              return (
                <div
                  key={diet.id}
                  id={`diet-toggle-${diet.id}`}
                  onClick={() => toggleDietary(diet.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#f1f6ef] border-[#889e81] ring-1 ring-[#889e81] shadow-2xs'
                      : 'bg-white border-[#e8e2d8] hover:border-[#dfd8ce] hover:bg-[#faf8f5]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{diet.icon}</span>
                      <span className="text-xs font-bold text-[#3d3a35]">{diet.label}</span>
                    </div>
                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-[#889e81] text-white flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-[#756e65] mt-1 leading-tight">{diet.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: TIME, EQUIPMENT & SERVINGS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#e8e2d8]">
          {/* Cooking Time */}
          <div>
            <div className="flex items-center justify-between text-sm font-semibold text-[#3d3a35] mb-2">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-[#d68c6a]" /> Max Time:
              </span>
              <span className="text-[#a85832] font-bold bg-[#faf2ec] px-2 py-0.5 rounded-md border border-[#f0ccb9]">
                {maxCookTime} mins
              </span>
            </div>
            <input
              id="max-cook-time-slider"
              type="range"
              min="15"
              max="75"
              step="5"
              value={maxCookTime}
              onChange={(e) => setMaxCookTime(Number(e.target.value))}
              className="w-full accent-[#d68c6a] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#9c9489] mt-1">
              <span>15m (Speed Sauté)</span>
              <span>40m (Balanced)</span>
              <span>75m+ (Slow Simmer)</span>
            </div>
          </div>

          {/* Servings */}
          <div>
            <label className="block text-sm font-semibold text-[#3d3a35] mb-2 flex items-center">
              <Utensils className="w-4 h-4 mr-1.5 text-[#d68c6a]" /> Servings:
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  id={`servings-btn-${num}`}
                  onClick={() => setServings(num)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                    servings === num
                      ? 'bg-[#d68c6a] text-white border-[#d68c6a] shadow-2xs'
                      : 'bg-white border-[#e8e2d8] text-[#59534c] hover:bg-[#f7f4ee]'
                  }`}
                >
                  {num} {num === 1 ? 'Person' : 'Portions'}
                </button>
              ))}
            </div>
          </div>

          {/* Meal Type */}
          <div>
            <label className="block text-sm font-semibold text-[#3d3a35] mb-2 flex items-center">
              <Flame className="w-4 h-4 mr-1.5 text-[#d68c6a]" /> Meal Type:
            </label>
            <select
              id="meal-type-select"
              value={mealType}
              onChange={(e) => setMealType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-[#dfd8ce] text-xs font-medium text-[#3d3a35] bg-white focus:outline-none focus:ring-2 focus:ring-[#d68c6a]"
            >
              <option value="Dinner">Dinner (Gourmet Main)</option>
              <option value="Lunch">Lunch (Quick & Energizing)</option>
              <option value="Breakfast">Breakfast / Brunch</option>
              <option value="Quick Snack">Savory Quick Snack</option>
              <option value="Dessert">Healthy Dessert</option>
              <option value="Any">Chef's Choice (Any)</option>
            </select>
          </div>
        </div>

        {/* SECTION 4: KITCHEN EQUIPMENT */}
        <div className="pt-4 border-t border-[#e8e2d8]">
          <label className="block text-sm font-semibold text-[#3d3a35] mb-3">
            Available Kitchen Equipment ({equipment.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((eq) => {
              const isSelected = equipment.includes(eq.id);
              return (
                <button
                  key={eq.id}
                  id={`equipment-btn-${eq.id}`}
                  type="button"
                  onClick={() => toggleEquipment(eq.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center space-x-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#3d3a35] text-[#fcfaf7] border-[#3d3a35] shadow-2xs'
                      : 'bg-white border-[#e8e2d8] text-[#59534c] hover:bg-[#f7f4ee]'
                  }`}
                >
                  <span>{eq.icon}</span>
                  <span>{eq.label}</span>
                  {isSelected && <Check className="w-3 h-3 ml-1 text-[#889e81]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ADVANCED TOGGLE */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-semibold text-[#756e65] hover:text-[#b46039] flex items-center transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 mr-1" />
            {showAdvanced ? 'Hide Advanced Chef Customization' : 'Show Advanced Chef Options (Allergies, Chef Notes)'}
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 rounded-xl bg-[#f7f4ee] border border-[#e8e2d8] space-y-4">
              {/* Skill Level */}
              <div>
                <label className="block text-xs font-semibold text-[#59534c] mb-1.5">Chef Skill Level</label>
                <div className="flex gap-2">
                  {(['Beginner', 'Intermediate', 'Master Chef'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSkillLevel(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        skillLevel === lvl
                          ? 'bg-[#b46039] text-white border-[#b46039] font-bold'
                          : 'bg-white border-[#dfd8ce] text-[#59534c]'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-xs font-semibold text-[#59534c] mb-1.5">
                  Allergens & Disliked Ingredients to Avoid
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={allergyInput}
                    onChange={(e) => setAllergyInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAllergy();
                      }
                    }}
                    placeholder="e.g. Peanuts, Shellfish, Cilantro..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-[#dfd8ce] text-xs bg-white text-[#3d3a35]"
                  />
                  <button
                    type="button"
                    onClick={handleAddAllergy}
                    className="px-3 py-1.5 bg-[#3d3a35] text-white rounded-lg text-xs font-medium"
                  >
                    Add Avoidance
                  </button>
                </div>
                {allergiesToAvoid.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {allergiesToAvoid.map((a, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-xs bg-[#fdf3f0] text-[#9c391e] border border-[#f5cfc1] flex items-center"
                      >
                        {a}
                        <button
                          type="button"
                          onClick={() => setAllergiesToAvoid(allergiesToAvoid.filter((_, idx) => idx !== i))}
                          className="ml-1 text-[#b34b2f] hover:text-[#7d2c16]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Prompt */}
              <div>
                <label className="block text-xs font-semibold text-[#59534c] mb-1">
                  Custom Culinary Directives (Optional)
                </label>
                <input
                  type="text"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g. 'Make it spicy with a crispy crust' or 'Focus on comforting autumn flavors'"
                  className="w-full px-3 py-2 rounded-lg border border-[#dfd8ce] text-xs bg-white text-[#3d3a35]"
                />
              </div>
            </div>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4">
          <button
            id="generate-recipe-submit-btn"
            type="submit"
            disabled={isLoading || ingredients.length === 0}
            className={`w-full py-4 rounded-xl text-base font-bold text-white transition-all flex items-center justify-center space-x-2 shadow-md ${
              isLoading
                ? 'bg-[#b8b0a5] cursor-not-allowed'
                : 'bg-gradient-to-r from-[#d68c6a] to-[#b46039] hover:from-[#b46039] hover:to-[#984b27] hover:shadow-lg transform active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Consulting Michelin AI Chef & Verifying USDA Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-[#f6e3d9]" />
                <span>Generate Recipe & Validate Nutrition Database</span>
              </>
            )}
          </button>
          <div className="flex items-center justify-center space-x-4 text-[11px] text-[#756e65] mt-2.5">
            <span className="flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#889e81] mr-1" /> USDA FoodData Central Verified
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Zap className="w-3.5 h-3.5 text-[#d68c6a] mr-1" /> Real-Time Macro Analysis
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Leaf className="w-3.5 h-3.5 text-[#889e81] mr-1" /> Leftover Rescue Rate
            </span>
          </div>
        </div>
      </form>
    </div>
  );
};
