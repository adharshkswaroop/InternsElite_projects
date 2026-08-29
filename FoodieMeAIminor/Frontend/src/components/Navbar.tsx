import React from 'react';
import { ChefHat, BookOpen, ShoppingBag, Sparkles, Scale, Utensils, Menu, Settings, User, ShieldCheck, Activity } from 'lucide-react';
import { UserSettings } from '../types';

interface NavbarProps {
  activeTab: 'generator' | 'saved' | 'shopping' | 'inspector' | 'restaurants';
  onSelectTab: (tab: 'generator' | 'saved' | 'shopping' | 'inspector' | 'restaurants') => void;
  savedCount: number;
  shoppingCount: number;
  onOpenMobileSidebar?: () => void;
  onOpenSettings?: () => void;
  onOpenHealthModal?: () => void;
  userSettings?: UserSettings;
  isRealtimeConnected?: boolean;
  connectionLatencyMs?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  shoppingCount,
  onOpenMobileSidebar,
  onOpenSettings,
  onOpenHealthModal,
  userSettings,
  isRealtimeConnected = true,
  connectionLatencyMs = 18,
}) => {
  return (
    <header className="sticky top-0 z-20 bg-[#fcfaf7]/95 backdrop-blur border-b border-[#e8e2d8] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Menu Button & Brand Logo */}
          <div className="flex items-center space-x-3">
            {onOpenMobileSidebar && (
              <button
                id="open-mobile-sidebar-btn"
                onClick={onOpenMobileSidebar}
                className="lg:hidden p-2 rounded-xl text-[#756e65] hover:text-[#2d2a26] hover:bg-[#f2eee9] transition-colors"
                title="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div
              id="brand-logo-btn"
              onClick={() => onSelectTab('generator')}
              className="flex items-center space-x-3.5 cursor-pointer group select-none"
            >
              {/* Redesigned Modern Logo Badge */}
              <div className="relative">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-linear-to-br from-[#e07a5f] via-[#d68c6a] to-[#ba5637] flex items-center justify-center text-white shadow-md shadow-[#d68c6a]/25 border border-white/40 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#d68c6a]/35 transition-all duration-200">
                  <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-xs group-hover:rotate-6 transition-transform" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-2.5 h-2.5 text-[#6c3b1e]" />
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-serif font-black text-xl sm:text-2xl text-[#2d2a26] tracking-tight flex items-baseline">
                    Foodie<span className="text-[#d68c6a] font-serif italic ml-0.5 font-bold">Me</span>
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#f1f6ef] text-[#4d6645] border border-[#c7dec2]">
                    <Scale className="w-3 h-3 mr-1 text-[#889e81]" />
                    USDA Verified
                  </span>
                </div>
                <p className="text-[11px] text-[#857d72] hidden xl:block font-medium">
                  AI Gourmet Leftover Generator & Macro Nutrition Validator
                </p>
              </div>
            </div>
          </div>

          {/* Right: Realtime Health Pill & Account Settings Trigger */}
          <div className="flex items-center space-x-2.5">
            {/* Live Telemetry & Security Health Pill */}
            {onOpenHealthModal && (
              <button
                id="navbar-health-status-btn"
                type="button"
                onClick={onOpenHealthModal}
                title="Open Production Health & Security Inspector"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-mono font-medium transition-all shadow-2xs group"
              >
                <span className={`w-2 h-2 rounded-full ${isRealtimeConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
                <span className="font-bold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  <span className="hidden sm:inline">SaaS Guard:</span> 98%
                </span>
                <span className="text-[11px] text-emerald-600 hidden md:inline">({connectionLatencyMs}ms)</span>
              </button>
            )}

            {/* Quick module indicator on desktop */}
            <div className="hidden lg:flex items-center space-x-1.5 text-xs text-[#756e65] px-3 py-1.5 bg-[#faf8f5] rounded-xl border border-[#e8e2d8]">
              <span className="font-medium capitalize font-mono">
                {activeTab === 'generator' && 'Recipe Studio'}
                {activeTab === 'restaurants' && 'Dining Intel'}
                {activeTab === 'inspector' && 'USDA FoodData'}
                {activeTab === 'shopping' && `List (${shoppingCount})`}
                {activeTab === 'saved' && `Cookbook (${savedCount})`}
              </span>
            </div>

            {/* User Account / Settings Button */}
            {onOpenSettings && (
              <button
                id="navbar-account-settings-btn"
                onClick={onOpenSettings}
                className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-xl border border-[#e8e2d8] hover:border-[#889e81] bg-white hover:bg-[#faf8f5] transition-colors shadow-2xs group"
                title="Account Settings & Preferences"
              >
                <div className="w-7 h-7 rounded-lg bg-[#1e2621] text-[#9fc895] flex items-center justify-center text-xs font-bold font-serif shadow-xs">
                  {userSettings?.name ? userSettings.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <span className="text-xs font-semibold text-[#3d3a35] hidden sm:inline group-hover:text-[#2c4e26]">
                  {userSettings?.name || 'Account'}
                </span>
                <Settings className="w-3.5 h-3.5 text-[#9c9489] group-hover:text-[#3d3a35]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
