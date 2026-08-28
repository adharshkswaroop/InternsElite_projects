import React from 'react';
import {
  Sparkles,
  Compass,
  Car,
  MapPin,
  Download,
  ShieldCheck,
  Menu,
  User,
  Settings,
} from 'lucide-react';
import { SidebarTab } from './Sidebar';

interface NavbarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  currency: string;
  setCurrency: (c: string) => void;
  onOpenExport: () => void;
  hasPlan: boolean;
  onQuickPreset: (destination: string, budget: number, duration: number, style: any) => void;
  isPlanning: boolean;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onOpenExport,
  hasPlan,
  onQuickPreset,
  isPlanning,
  onToggleSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Sidebar Toggle & Brand */}
          <div className="flex items-center space-x-3">
            <button
              id="btn-toggle-sidebar"
              onClick={onToggleSidebar}
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition"
              title="Toggle Navigation Sidebar"
            >
              <Menu className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
                <Car className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-sm text-slate-900 tracking-tight">SmartRide <span className="text-emerald-600">AI</span></span>
                  <span className="text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ReAct Loop
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Quick Destination Presets */}
          <div className="hidden md:flex items-center space-x-1 text-xs text-slate-600">
            <span className="font-medium text-slate-400 mr-1 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" /> Presets:
            </span>
            <button
              id="btn-preset-tokyo"
              onClick={() => onQuickPreset('Tokyo, Japan', 1800, 4, 'Balanced')}
              disabled={isPlanning}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 transition font-medium text-slate-700 disabled:opacity-50"
            >
              Tokyo (4d)
            </button>
            <button
              id="btn-preset-paris"
              onClick={() => onQuickPreset('Paris, France', 2100, 3, 'Luxury')}
              disabled={isPlanning}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 transition font-medium text-slate-700 disabled:opacity-50"
            >
              Paris (3d)
            </button>
            <button
              id="btn-preset-blr"
              onClick={() => onQuickPreset('Bengaluru, India', 850, 3, 'Budget')}
              disabled={isPlanning}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 transition font-medium text-slate-700 disabled:opacity-50"
            >
              Bengaluru (3d)
            </button>
            <button
              id="btn-preset-nyc"
              onClick={() => onQuickPreset('New York, USA', 2400, 3, 'Balanced')}
              disabled={isPlanning}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 transition font-medium text-slate-700 disabled:opacity-50"
            >
              New York (3d)
            </button>
          </div>

          {/* Right: Currency & Export & User Account Pill */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Currency selector */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs font-semibold">
              {(['USD', 'INR', 'EUR', 'GBP'] as const).map((curr) => (
                <button
                  key={curr}
                  id={`btn-curr-${curr}`}
                  onClick={() => setCurrency(curr)}
                  className={`px-2 py-1 rounded-md transition ${
                    currency === curr ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Export Package button */}
            {hasPlan && (
              <button
                id="btn-export-package"
                onClick={onOpenExport}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            )}

            {/* Quick User Account Avatar Pill */}
            <button
              id="btn-nav-user-account"
              onClick={() => setActiveTab('settings')}
              className={`p-1.5 rounded-xl border flex items-center space-x-1.5 transition ${
                activeTab === 'settings'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title="Settings / User Account (karthikam083@gmail.com)"
            >
              <div className="w-6 h-6 rounded-lg bg-slate-800 text-white font-bold text-[10px] flex items-center justify-center">
                KA
              </div>
              <span className="text-xs font-semibold hidden md:inline">Account</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
