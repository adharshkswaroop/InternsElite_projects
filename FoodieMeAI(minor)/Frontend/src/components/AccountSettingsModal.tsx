import React, { useState } from 'react';
import {
  X,
  User,
  Settings,
  Mail,
  ShieldCheck,
  Scale,
  Sparkles,
  Check,
  Sliders,
  Bell,
  Trash2,
  Database,
  MapPin,
  UtensilsCrossed,
} from 'lucide-react';
import { UserSettings, DietaryConstraint } from '../types';
import { saveUserSettings } from '../services/storage';

interface AccountSettingsModalProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onClose: () => void;
  savedRecipesCount: number;
  shoppingItemsCount: number;
  onClearAllData?: () => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  savedRecipesCount,
  shoppingItemsCount,
  onClearAllData,
}) => {
  const [formData, setFormData] = useState<UserSettings>({ ...settings });
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'preferences' | 'data'>('profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const dietaryOptions: { id: DietaryConstraint; label: string }[] = [
    { id: 'keto', label: 'Keto' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'low-sodium', label: 'Low Sodium' },
    { id: 'high-protein', label: 'High Protein' },
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'dairy-free', label: 'Dairy-Free' },
    { id: 'mediterranean', label: 'Mediterranean' },
    { id: 'diabetic-friendly', label: 'Diabetic-Friendly' },
  ];

  const handleToggleDietary = (diet: DietaryConstraint) => {
    if (formData.dietaryPreferences.includes(diet)) {
      setFormData({
        ...formData,
        dietaryPreferences: formData.dietaryPreferences.filter((d) => d !== diet),
      });
    } else {
      setFormData({
        ...formData,
        dietaryPreferences: [...formData.dietaryPreferences, diet],
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserSettings(formData);
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div
      id="account-settings-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
    >
      <div className="bg-[#fcfaf7] rounded-3xl max-w-xl w-full shadow-2xl border border-[#e8e2d8] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#1e2621] text-white p-6 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#9fc895]/20 border border-[#9fc895]/40 flex items-center justify-center text-lg font-bold font-serif text-[#9fc895] shadow-inner">
              {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9fc895]">
                Account & Preferences
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                {formData.name || 'User Profile'}
              </h2>
              <p className="text-xs text-[#b8b0a5] font-mono mt-0.5">{formData.email}</p>
            </div>
          </div>
          <button
            id="close-settings-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#d8d2c7] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex border-b border-[#e8e2d8] bg-white px-6">
          <button
            type="button"
            onClick={() => setActiveSubTab('profile')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeSubTab === 'profile'
                ? 'border-[#a85832] text-[#a85832]'
                : 'border-transparent text-[#756e65] hover:text-[#2d2a26]'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('preferences')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeSubTab === 'preferences'
                ? 'border-[#a85832] text-[#a85832]'
                : 'border-transparent text-[#756e65] hover:text-[#2d2a26]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Culinary Preferences</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('data')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeSubTab === 'data'
                ? 'border-[#a85832] text-[#a85832]'
                : 'border-transparent text-[#756e65] hover:text-[#2d2a26]'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Storage & Sync</span>
          </button>
        </div>

        {/* Body Content */}
        <form onSubmit={handleSave} className="p-6 sm:p-7 overflow-y-auto space-y-5 text-xs text-[#3d3a35]">
          {activeSubTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#756e65] mb-1.5">
                  Display Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9c9489] absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e8e2d8] rounded-xl text-sm font-medium text-[#2d2a26] focus:outline-none focus:ring-1 focus:ring-[#889e81]"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#756e65] mb-1.5">
                  Account Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9c9489] absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e8e2d8] rounded-xl text-sm font-mono text-[#2d2a26] focus:outline-none focus:ring-1 focus:ring-[#889e81]"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#756e65] mb-1.5">
                  Role / Bio Title
                </label>
                <input
                  type="text"
                  value={formData.roleTitle || ''}
                  onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-white border border-[#e8e2d8] rounded-xl text-sm text-[#2d2a26] focus:outline-none focus:ring-1 focus:ring-[#889e81]"
                  placeholder="e.g. Executive Home Chef, Nutrition Explorer"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#756e65] mb-1.5">
                  Default City for Dining Intel
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#9c9489] absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={formData.favoriteCity}
                    onChange={(e) => setFormData({ ...formData, favoriteCity: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#e8e2d8] rounded-xl text-sm text-[#2d2a26] focus:outline-none focus:ring-1 focus:ring-[#889e81]"
                    placeholder="e.g. Bangalore, Mumbai, San Francisco"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'preferences' && (
            <div className="space-y-5">
              {/* Default Dietary Constraints */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#756e65] mb-2">
                  Default Dietary Preferences
                </label>
                <p className="text-[11px] text-[#857d72] mb-2.5">
                  These dietary guidelines will automatically pre-populate in your recipe generation brief.
                </p>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((opt) => {
                    const isSelected = formData.dietaryPreferences.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleToggleDietary(opt.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          isSelected
                            ? 'bg-[#2c4e26] text-white border-[#2c4e26] shadow-xs'
                            : 'bg-white text-[#59534c] border-[#e8e2d8] hover:border-[#889e81]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Units & Default Servings */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[#e8e2d8]">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#756e65] mb-1.5">
                    Measurement System
                  </label>
                  <select
                    value={formData.measurementUnit}
                    onChange={(e) =>
                      setFormData({ ...formData, measurementUnit: e.target.value as 'metric' | 'us_customary' })
                    }
                    className="w-full px-3 py-2.5 bg-white border border-[#e8e2d8] rounded-xl text-xs sm:text-sm text-[#2d2a26] focus:outline-none focus:ring-1 focus:ring-[#889e81]"
                  >
                    <option value="metric">Metric (g, ml, kg)</option>
                    <option value="us_customary">US Customary (oz, cups, lbs)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#756e65] mb-1.5">
                    Default Servings
                  </label>
                  <select
                    value={formData.defaultServings}
                    onChange={(e) => setFormData({ ...formData, defaultServings: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-white border border-[#e8e2d8] rounded-xl text-xs sm:text-sm text-[#2d2a26] focus:outline-none focus:ring-1 focus:ring-[#889e81]"
                  >
                    <option value={1}>1 Serving (Single)</option>
                    <option value={2}>2 Servings (Couple)</option>
                    <option value={4}>4 Servings (Family)</option>
                    <option value={6}>6 Servings (Dinner Party)</option>
                  </select>
                </div>
              </div>

              {/* Auto Sync Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#e8e2d8]">
                <div>
                  <span className="font-bold text-xs text-[#2d2a26] block">Auto-populate Shopping List</span>
                  <span className="text-[10px] text-[#857d72]">
                    Automatically add missing pantry items to your shopping list when recipes are generated.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, autoAddShoppingList: !formData.autoAddShoppingList })}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out shrink-0 ml-3 ${
                    formData.autoAddShoppingList ? 'bg-[#2c4e26]' : 'bg-[#d8d2c7]'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      formData.autoAddShoppingList ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeSubTab === 'data' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-[#e8e2d8] space-y-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#756e65] block">
                  Active Local Data Storage
                </span>
                <div className="grid grid-cols-2 gap-3 text-center pt-1">
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8e2d8]">
                    <span className="text-xl font-serif font-bold text-[#2d2a26]">{savedRecipesCount}</span>
                    <span className="text-[10px] text-[#756e65] block font-medium">Cookbook Recipes</span>
                  </div>
                  <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8e2d8]">
                    <span className="text-xl font-serif font-bold text-[#2d2a26]">{shoppingItemsCount}</span>
                    <span className="text-[10px] text-[#756e65] block font-medium">Grocery Items</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#f8f0eb] rounded-2xl border border-[#f0ccb9] text-xs text-[#a85832] space-y-2">
                <div className="flex items-center space-x-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#a85832]" />
                  <span>USDA FDC Offline Caching Active</span>
                </div>
                <p className="text-[11px] text-[#854526] leading-relaxed">
                  Nutritional calculations are cached locally for lightning-fast recalculation and zero-latency macro breakdown.
                </p>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-[#e8e2d8] flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#756e65] hover:text-[#2d2a26] hover:bg-[#f2eee9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#2c4e26] hover:bg-[#233f1e] text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-[#9fc895]" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
