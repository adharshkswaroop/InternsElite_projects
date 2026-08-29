import React, { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Sparkles,
  MapPin,
  Star,
  ArrowUpRight,
  Utensils,
  Clock,
  Phone,
  Bookmark,
  Share2,
  Check,
  Compass,
  SlidersHorizontal,
  X,
  Flame,
  BadgePercent,
  CheckCircle2,
} from 'lucide-react';
import { Restaurant, RestaurantBrief } from '../types';
import { exploreRestaurants } from '../services/api';

interface RestaurantIntelligenceViewProps {
  onSelectRestaurant?: (restaurant: Restaurant) => void;
}

export const RestaurantIntelligenceView: React.FC<RestaurantIntelligenceViewProps> = () => {
  // Brief Form State (defaults matching image-2)
  const [cravingOrCuisine, setCravingOrCuisine] = useState<string>('Tea');
  const [neighbourhood, setNeighbourhood] = useState<string>('Anywhere in Bangalore');
  const [occasion, setOccasion] = useState<string>('Delivery');
  const [budgetForTwo, setBudgetForTwo] = useState<number>(100);
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [selectedCity, setSelectedCity] = useState<string>('Bangalore');

  // Results & UI State
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [totalMatches, setTotalMatches] = useState<number>(8);
  const [neighbourhoodsMapped, setNeighbourhoodsMapped] = useState<number>(169);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedRestaurantModal, setSelectedRestaurantModal] = useState<Restaurant | null>(null);
  const [savedRestaurantIds, setSavedRestaurantIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load initial results matching image-2
  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await exploreRestaurants({
        cravingOrCuisine,
        neighbourhood,
        occasion,
        budgetForTwo,
        vegOnly,
        city: selectedCity,
      });
      setRestaurants(data.restaurants || []);
      setTotalMatches(data.totalCount || data.restaurants.length);
      setNeighbourhoodsMapped(data.neighbourhoodsCount || 169);
    } catch (err: any) {
      console.error('Failed to fetch recommendations:', err);
      setErrorMessage(err.message || 'Could not load restaurant recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExploreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecommendations();
  };

  const toggleSaveRestaurant = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (savedRestaurantIds.includes(id)) {
      setSavedRestaurantIds(savedRestaurantIds.filter((item) => item !== id));
    } else {
      setSavedRestaurantIds([...savedRestaurantIds, id]);
    }
  };

  const handleShare = (restaurant: Restaurant, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard?.writeText(
      `Check out ${restaurant.name} in ${restaurant.neighbourhood}! Known for ${restaurant.cuisine} (₹${restaurant.priceForTwo} for two).`
    );
    setCopiedId(restaurant.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const neighbourhoodOptions = [
    'Anywhere in Bangalore',
    'Koramangala 1st Block',
    'Koramangala 5th Block',
    'Indiranagar 100ft Rd',
    'HSR Layout',
    'Whitefield',
    'Brookefield',
    'Malleshwaram',
    'Church Street',
    'Lavelle Road',
    'JP Nagar',
    'Jayanagar',
    'MG Road / Brigade Rd',
    'Sadashivanagar',
    'UB City',
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#e8e2d8]">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#d68c6a] block mb-2 font-mono">
            PERSONAL RESTAURANT INTELLIGENCE
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2d2a26] tracking-tight leading-[1.1]">
            Find your next{' '}
            <span className="text-[#d68c6a] font-normal italic font-serif">great table.</span>
          </h1>
          <p className="text-sm sm:text-base text-[#756e65] mt-3 max-w-2xl leading-relaxed">
            A sharper way to explore {selectedCity}’s food scene. Tune the brief, compare the signal,
            and make a confident call.
          </p>
        </div>

        {/* Live Index Stat Pill */}
        <div className="flex items-center space-x-3 bg-white px-4 py-3 rounded-2xl border border-[#e8e2d8] shadow-xs shrink-0 self-start lg:self-end">
          <div className="text-[10px] font-mono font-bold tracking-widest text-[#9c9489] rotate-180 [writing-mode:vertical-rl] leading-none uppercase">
            Live Index
          </div>
          <div className="text-4xl font-serif font-bold text-[#2d2a26]">
            {neighbourhoodsMapped}
          </div>
          <div className="text-xs text-[#756e65] font-medium leading-tight max-w-[90px]">
            neighbourhoods mapped
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Brief Panel on Left, Shortlist on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Dark Slate 'Set your brief' Card */}
        <div className="lg:col-span-4 bg-[#1e2621] text-[#f4efe8] rounded-3xl p-6 sm:p-7 shadow-xl border border-[#2d3831] space-y-6">
          {/* Brief Card Header */}
          <div className="border-b border-white/10 pb-4">
            <div className="text-xs font-mono font-bold text-[#9fc895] flex items-center space-x-1.5 mb-1">
              <span className="px-1.5 py-0.5 rounded bg-[#9fc895]/20 text-[10px]">01</span>
              <span>SET YOUR BRIEF</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              Set your brief
            </h2>
            <p className="text-xs text-[#b8b0a5] mt-1">
              Tell us what matters tonight.
            </p>
          </div>

          <form onSubmit={handleExploreSubmit} className="space-y-5 text-xs font-sans">
            {/* CRAVING OR CUISINE */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a8a095] mb-2">
                Craving or Cuisine
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-[#9c9489] absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={cravingOrCuisine}
                  onChange={(e) => setCravingOrCuisine(e.target.value)}
                  placeholder="e.g. Tea, Biryani, Artisanal Pizza, Dosa..."
                  className="w-full pl-10 pr-4 py-3 bg-[#28322c] border border-white/15 rounded-xl text-white placeholder:text-[#888176] text-sm focus:outline-none focus:ring-1 focus:ring-[#9fc895] transition-all"
                />
              </div>
            </div>

            {/* NEIGHBOURHOOD */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a8a095] mb-2">
                Neighbourhood
              </label>
              <div className="relative">
                <select
                  value={neighbourhood}
                  onChange={(e) => setNeighbourhood(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-[#28322c] border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#9fc895] cursor-pointer"
                >
                  {neighbourhoodOptions.map((n) => (
                    <option key={n} value={n} className="bg-[#1e2621] text-white">
                      {n}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#b8b0a5] absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            {/* OCCASION & BUDGET FOR TWO */}
            <div className="grid grid-cols-2 gap-3">
              {/* Occasion */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a8a095] mb-2">
                  Occasion
                </label>
                <div className="relative">
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full appearance-none px-3 py-3 bg-[#28322c] border border-white/15 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#9fc895] cursor-pointer"
                  >
                    <option value="Delivery" className="bg-[#1e2621]">Delivery</option>
                    <option value="Dine-in" className="bg-[#1e2621]">Dine-in</option>
                    <option value="Takeaway" className="bg-[#1e2621]">Takeaway</option>
                    <option value="Late Night" className="bg-[#1e2621]">Late Night</option>
                    <option value="Romantic Date" className="bg-[#1e2621]">Romantic Date</option>
                    <option value="Sunday Brunch" className="bg-[#1e2621]">Sunday Brunch</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#b8b0a5] absolute right-2.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Budget for two */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#a8a095] mb-2">
                  Budget for Two
                </label>
                <div className="px-3 py-2.5 bg-[#28322c] border border-white/15 rounded-xl flex items-center justify-between text-white font-mono text-sm font-semibold">
                  <span>₹ {budgetForTwo}</span>
                  <span className="text-[10px] text-[#9c9489] font-sans font-normal">for two</span>
                </div>
              </div>
            </div>

            {/* BUDGET RANGE SLIDER */}
            <div className="pt-1">
              <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-[#a8a095] mb-2">
                <span>Budget Range</span>
                <span className="font-mono text-[#9fc895] text-xs">₹{budgetForTwo}</span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={budgetForTwo}
                onChange={(e) => setBudgetForTwo(Number(e.target.value))}
                className="w-full accent-[#9fc895] h-1.5 bg-[#34423a] rounded-lg cursor-pointer appearance-none"
              />
              <div className="flex justify-between text-[10px] font-mono text-[#857d72] mt-1.5">
                <span>₹50</span>
                <span>₹3,000+</span>
              </div>
            </div>

            {/* VEGETARIAN ONLY SWITCH */}
            <div className="flex items-center justify-between py-2 border-t border-white/10">
              <span className="text-xs font-semibold text-[#f4efe8]">Vegetarian only</span>
              <button
                type="button"
                onClick={() => setVegOnly(!vegOnly)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                  vegOnly ? 'bg-[#9fc895]' : 'bg-[#34423a]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    vegOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* EXPLORE RECOMMENDATIONS BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#c5e888] hover:bg-[#b4dc6f] active:scale-[0.99] text-[#1e2621] font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-md mt-4 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-[#1e2621]/30 border-t-[#1e2621] rounded-full animate-spin" />
                  <span>Scanning Food Signal...</span>
                </div>
              ) : (
                <>
                  <span>Explore recommendations</span>
                  <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Shortlist Grid */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header of Shortlist */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#d68c6a] block">
                02 / YOUR SHORTLIST
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#2d2a26] tracking-tight mt-0.5">
                Worth a closer look
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-[#756e65] px-3 py-1 bg-white rounded-full border border-[#e8e2d8]">
              {restaurants.length} matches
            </span>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-[#fdf3f0] border border-[#f5cfc1] text-[#9c391e] text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center space-x-2">
                <span className="font-bold">Error:</span>
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={fetchRecommendations}
                className="px-3 py-1 bg-[#9c391e] text-white rounded-lg font-bold hover:bg-[#7d2c16] transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Grid of Restaurant Cards */}
          {restaurants.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#e8e2d8] p-12 text-center space-y-3">
              <Compass className="w-10 h-10 text-[#9c9489] mx-auto animate-bounce" />
              <h3 className="font-serif font-bold text-lg text-[#3d3a35]">No exact matches in this brief</h3>
              <p className="text-xs text-[#756e65] max-w-sm mx-auto">
                Try widening your budget range, switching to 'Anywhere in Bangalore', or relaxing the craving keywords.
              </p>
              <button
                onClick={() => {
                  setCravingOrCuisine('Tea');
                  setNeighbourhood('Anywhere in Bangalore');
                  setBudgetForTwo(100);
                  setVegOnly(false);
                  fetchRecommendations();
                }}
                className="mt-2 px-4 py-2 bg-[#889e81] text-white text-xs font-bold rounded-xl hover:bg-[#6e8567] transition-colors"
              >
                Reset to Default Brief
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {restaurants.map((restaurant) => {
                const isSaved = savedRestaurantIds.includes(restaurant.id);
                return (
                  <div
                    key={restaurant.id}
                    onClick={() => setSelectedRestaurantModal(restaurant)}
                    className="group bg-white rounded-2xl border border-[#e8e2d8] hover:border-[#889e81] p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative"
                  >
                    {/* Top Row: Tag & Top-right Arrow */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#d68c6a] flex items-center">
                        <span>TOP MATCH</span>
                        <ArrowUpRight className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={(e) => handleShare(restaurant, e)}
                          title="Share restaurant"
                          className="p-1 rounded-lg text-[#9c9489] hover:text-[#3d3a35] hover:bg-[#f2eee9] transition-colors"
                        >
                          {copiedId === restaurant.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => toggleSaveRestaurant(restaurant.id, e)}
                          title={isSaved ? 'Remove from saved' : 'Save restaurant'}
                          className={`p-1 rounded-lg transition-colors ${
                            isSaved
                              ? 'text-[#d68c6a] bg-[#faf2ec]'
                              : 'text-[#9c9489] hover:text-[#d68c6a] hover:bg-[#faf2ec]'
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Restaurant Title & Neighbourhood */}
                    <div>
                      <h3 className="font-serif font-bold text-xl text-[#2d2a26] group-hover:text-[#b46039] transition-colors">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center text-xs text-[#756e65] mt-1 font-medium">
                        <span className="text-[#889e81] mr-1">✦</span>
                        <span>{restaurant.address || `${restaurant.neighbourhood}, ${restaurant.city}`}</span>
                      </div>
                      <p className="text-xs text-[#857d72] mt-2 line-clamp-1 font-sans">
                        {restaurant.cuisine}
                      </p>
                    </div>

                    {/* Divider & Specs Footer */}
                    <div className="mt-4 pt-3 border-t border-[#f2eee9] space-y-3">
                      <div className="flex items-center justify-between">
                        {/* Rating & Mode */}
                        <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#3d3a35]">
                          <span className="text-amber-500 font-bold">★ {restaurant.rating}</span>
                          <span className="text-[#857d72] font-normal">{restaurant.orderType || 'Delivery'}</span>
                        </div>

                        {/* Price for two */}
                        <div className="text-xs font-mono font-bold text-[#2d2a26]">
                          {restaurant.priceCurrency || '₹'}{restaurant.priceForTwo}{' '}
                          <span className="text-[10px] font-sans font-normal text-[#857d72]">for two</span>
                        </div>
                      </div>

                      {/* Service Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(restaurant.services || ['Delivery']).map((service) => (
                          <span
                            key={service}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium text-[#59534c] bg-[#faf8f5] border border-[#e8e2d8]"
                          >
                            {service}
                          </span>
                        ))}
                        {restaurant.isVeg && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium text-[#2c4e26] bg-[#edf7eb] border border-[#c3e3be]">
                            Pure Veg
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Restaurant Detail Modal */}
      {selectedRestaurantModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#e8e2d8] overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#1e2621] text-white p-6 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#9fc895]">
                  ✦ RESTAURANT BRIEF INTEL
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  {selectedRestaurantModal.name}
                </h2>
                <div className="flex items-center text-xs text-[#b8b0a5] mt-1 space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-[#9fc895]" />
                  <span>{selectedRestaurantModal.address || `${selectedRestaurantModal.neighbourhood}, ${selectedRestaurantModal.city}`}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRestaurantModal(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#d8d2c7] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-[#3d3a35]">
              {/* Rating, Price & Timings Strip */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8e2d8]">
                  <span className="text-[10px] uppercase font-bold text-[#857d72] block">Rating</span>
                  <span className="text-lg font-bold font-serif text-[#2d2a26] flex items-center justify-center">
                    ★ {selectedRestaurantModal.rating}
                  </span>
                  <span className="text-[9px] text-[#9c9489]">Verified Food Score</span>
                </div>
                <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8e2d8]">
                  <span className="text-[10px] uppercase font-bold text-[#857d72] block">Price for Two</span>
                  <span className="text-lg font-bold font-serif text-[#2d2a26]">
                    ₹{selectedRestaurantModal.priceForTwo}
                  </span>
                  <span className="text-[9px] text-[#9c9489]">Estimated Avg Cost</span>
                </div>
                <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e8e2d8]">
                  <span className="text-[10px] uppercase font-bold text-[#857d72] block">Hours</span>
                  <span className="text-xs font-bold text-[#2d2a26] line-clamp-1 mt-1">
                    {selectedRestaurantModal.timings || 'Open Daily'}
                  </span>
                  <span className="text-[9px] text-emerald-700 font-semibold">Active Ordering</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#857d72] mb-1.5">
                  About & Atmosphere
                </h4>
                <p className="text-xs sm:text-sm text-[#59534c] leading-relaxed">
                  {selectedRestaurantModal.description ||
                    'Renowned neighborhood culinary gem celebrated for authentic flavor profiles, fresh ingredients, and swift service.'}
                </p>
              </div>

              {/* Signature Dishes & Must-Orders */}
              {selectedRestaurantModal.signatureDishes && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#857d72] mb-2 flex items-center">
                    <Flame className="w-3.5 h-3.5 mr-1 text-[#d68c6a]" />
                    Signature Dishes & Chef's Must-Try Recommendations
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRestaurantModal.signatureDishes.map((dish) => (
                      <span
                        key={dish}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#faf2ec] text-[#a85832] border border-[#f0ccb9]"
                      >
                        ✦ {dish}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Services */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#857d72] mb-2">
                  Service & Ordering Channels
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(selectedRestaurantModal.services || ['Delivery']).map((s) => (
                    <span
                      key={s}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-[#f2eee9] text-[#3d3a35] border border-[#dfd8ce]"
                    >
                      ✓ {s} Available
                    </span>
                  ))}
                  {selectedRestaurantModal.isVeg && (
                    <span className="px-3 py-1 rounded-lg text-xs font-bold bg-[#edf7eb] text-[#2c4e26] border border-[#c3e3be]">
                      ✓ 100% Pure Vegetarian Kitchen
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Action Bar */}
            <div className="p-4 sm:p-5 bg-[#faf8f5] border-t border-[#e8e2d8] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => toggleSaveRestaurant(selectedRestaurantModal.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors border ${
                  savedRestaurantIds.includes(selectedRestaurantModal.id)
                    ? 'bg-[#faf2ec] text-[#a85832] border-[#f0ccb9]'
                    : 'bg-white text-[#59534c] border-[#dfd8ce] hover:bg-[#f2eee9]'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${savedRestaurantIds.includes(selectedRestaurantModal.id) ? 'fill-current' : ''}`} />
                <span>{savedRestaurantIds.includes(selectedRestaurantModal.id) ? 'Saved' : 'Save Table'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${selectedRestaurantModal.name} ${selectedRestaurantModal.neighbourhood} ${selectedRestaurantModal.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-[#f2eee9] text-[#3d3a35] border border-[#dfd8ce] text-xs font-bold flex items-center transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 mr-1 text-[#889e81]" />
                  Maps & Directions
                </a>
                <button
                  onClick={() => {
                    alert(`Direct Order Signal triggered for ${selectedRestaurantModal.name}. Order channels opened.`);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#1e2621] hover:bg-[#2d3a31] text-[#9fc895] text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  <span>Order / Book Table</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
