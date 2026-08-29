import React from 'react';
import {
  ChefHat,
  Sparkles,
  Utensils,
  Scale,
  ShoppingBag,
  BookOpen,
  Settings,
  User,
  X,
  ChevronRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';
import { UserSettings } from '../types';

export type AppTab = 'generator' | 'restaurants' | 'inspector' | 'shopping' | 'saved';

interface SidebarProps {
  activeTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  savedCount: number;
  shoppingCount: number;
  userSettings: UserSettings;
  onOpenSettings: () => void;
  onOpenHealthModal?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  savedCount,
  shoppingCount,
  userSettings,
  onOpenSettings,
  onOpenHealthModal,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const navItems: {
    id: AppTab;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'generator',
      label: 'Recipe Generator',
      description: 'Leftover & Pantry Studio',
      icon: ChefHat,
    },
    {
      id: 'restaurants',
      label: 'Find Tables',
      description: 'Dining Intelligence & Intel',
      icon: Utensils,
    },
    {
      id: 'inspector',
      label: 'USDA Analyzer',
      description: 'Macro & FoodData Inspector',
      icon: Scale,
    },
    {
      id: 'shopping',
      label: 'Shopping List',
      description: 'Smart Grocery Sync',
      icon: ShoppingBag,
      badge: shoppingCount,
      badgeColor: 'bg-[#a85832] text-white',
    },
    {
      id: 'saved',
      label: 'Cookbook',
      description: 'Saved Kitchen Creations',
      icon: BookOpen,
      badge: savedCount,
      badgeColor: 'bg-[#2c4e26] text-white',
    },
  ];

  const handleNavClick = (tab: AppTab) => {
    onSelectTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#1e2621] text-[#f4efe8] border-r border-[#2d3831]">
      {/* Brand Header */}
      <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3.5 cursor-pointer group select-none" onClick={() => handleNavClick('generator')}>
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-linear-to-br from-[#2f4233] via-[#243328] to-[#18231c] border border-[#9fc895]/40 flex items-center justify-center text-[#9fc895] shadow-lg shadow-black/30 group-hover:scale-105 group-hover:border-[#9fc895]/70 transition-all duration-200">
              <ChefHat className="w-5 h-5 drop-shadow-xs group-hover:rotate-6 transition-transform text-[#9fc895]" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d68c6a] border-2 border-[#1e2621] flex items-center justify-center shadow-xs">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif font-black text-xl text-white tracking-tight leading-tight flex items-baseline">
                Foodie<span className="text-[#9fc895] font-serif italic ml-0.5 font-bold">Me</span>
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#9fc895]/20 text-[#9fc895] border border-[#9fc895]/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-[#a8a095] font-mono leading-none mt-1">
              USDA-Ground Intelligence
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#d8d2c7] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Section */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#78887e]">
          Platform Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all group ${
                isActive
                  ? 'bg-[#28352c] text-white border border-[#3b4c40] shadow-sm'
                  : 'text-[#c2bcaf] hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                    isActive
                      ? 'bg-[#9fc895] text-[#1e2621]'
                      : 'bg-white/5 text-[#a8a095] group-hover:text-white group-hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <div
                    className={`text-sm font-medium leading-tight truncate ${
                      isActive ? 'font-bold text-white' : 'text-[#eae5db]'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[10px] text-[#8e877c] font-sans truncate mt-0.5">
                    {item.description}
                  </div>
                </div>
              </div>

              {/* Badges or Arrow */}
              <div className="flex items-center space-x-1.5 shrink-0 ml-2">
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                      item.badgeColor || 'bg-white/20 text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="w-4 h-4 text-[#9fc895]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* User Account & Security Guard Section at the Bottom */}
      <div className="p-4 border-t border-white/10 bg-[#171e19] space-y-2">
        {onOpenHealthModal && (
          <button
            id="sidebar-health-guard-btn"
            type="button"
            onClick={onOpenHealthModal}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 transition-all text-xs font-mono group"
          >
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">SaaS Guard & Intel</span>
            </div>
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              98% PASS
            </span>
          </button>
        )}

        <div className="bg-[#212b24] hover:bg-[#28342c] transition-all rounded-2xl p-3.5 border border-white/10 flex items-center justify-between group">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center space-x-3 text-left flex-1 min-w-0"
          >
            {/* User Avatar */}
            <div className="w-10 h-10 rounded-xl bg-[#9fc895]/20 border border-[#9fc895]/40 flex items-center justify-center text-[#9fc895] font-serif font-bold text-base shadow-inner shrink-0">
              {userSettings.name ? userSettings.name.charAt(0).toUpperCase() : 'S'}
            </div>

            {/* User Details */}
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate group-hover:text-[#9fc895] transition-colors">
                {userSettings.name || 'User Account'}
              </div>
              <div className="text-[10px] text-[#9c9489] truncate font-mono mt-0.5">
                {userSettings.email}
              </div>
            </div>
          </button>

          {/* Quick Settings Icon Button */}
          <button
            id="sidebar-settings-btn"
            type="button"
            onClick={onOpenSettings}
            title="Open Account & Settings"
            className="p-2 rounded-xl text-[#a8a095] hover:text-white hover:bg-white/10 transition-colors ml-1"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        id="app-main-sidebar"
        className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 z-30 shadow-md"
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
