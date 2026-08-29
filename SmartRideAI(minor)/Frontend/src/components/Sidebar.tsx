import React from 'react';
import {
  Calendar,
  Sparkles,
  MapPin,
  Car,
  ShieldCheck,
  User,
  Settings,
  BrainCircuit,
  Compass,
  Download,
  AlertTriangle,
  ChevronRight,
  Sliders,
  CheckCircle,
  X,
  Lock,
} from 'lucide-react';
import { TravelPlan } from '../types/travel';

export type SidebarTab =
  | 'itinerary'
  | 'agent_trace'
  | 'map'
  | 'fare_calc'
  | 'budget'
  | 'security'
  | 'settings';

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  isOpen: boolean;
  onClose: () => void;
  plan: TravelPlan | null;
  currency: string;
  isPlanning: boolean;
  onOpenExport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  plan,
  currency,
  isPlanning,
  onOpenExport,
}) => {
  const menuItems = [
    {
      id: 'itinerary' as SidebarTab,
      label: 'Itinerary & Day Schedules',
      icon: <Calendar className="w-4 h-4" />,
      description: 'Daily timeline & transit routing',
      badge: plan ? `${plan.durationDays} Days` : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'agent_trace' as SidebarTab,
      label: 'ReAct Reasoning Trace',
      icon: <BrainCircuit className="w-4 h-4" />,
      description: 'Autonomous multi-tool decision log',
      badge: isPlanning ? 'Live...' : plan ? `${plan.reasoningTraces.length} Steps` : undefined,
      badgeColor: isPlanning ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-blue-100 text-blue-800',
    },
    {
      id: 'map' as SidebarTab,
      label: 'Interactive Map & Routes',
      icon: <MapPin className="w-4 h-4" />,
      description: 'Waypoints & SmartRide transit legs',
      badge: plan ? `${plan.days.reduce((acc, d) => acc + d.morning.length + d.afternoon.length + d.evening.length, 0)} Pins` : undefined,
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 'fare_calc' as SidebarTab,
      label: 'SmartRide Fare Estimator & Simulator',
      icon: <Car className="w-4 h-4" />,
      description: 'ML surge models & multi-tier pricing',
      badge: '5 Tiers',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'budget' as SidebarTab,
      label: 'Budget & Backtracking Audit',
      icon: <ShieldCheck className="w-4 h-4" />,
      description: 'Constraint satisfaction & cost analysis',
      badge: plan?.budgetSummary.isWithinBudget ? 'Compliant' : plan ? `${plan.backtrackEventsCount} Backtracks` : undefined,
      badgeColor: plan?.budgetSummary.isWithinBudget ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800',
    },
    {
      id: 'security' as SidebarTab,
      label: 'Security & Observability Hub',
      icon: <Lock className="w-4 h-4" />,
      description: 'OWASP checks, rate limits & logs',
      badge: 'Protected',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'settings' as SidebarTab,
      label: 'Settings / User Account',
      icon: <Settings className="w-4 h-4" />,
      description: 'Preferences, API tools & profile',
      badge: 'Pro',
      badgeColor: 'bg-slate-100 text-slate-700',
    },
  ];

  const handleSelect = (tab: SidebarTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand Header */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base text-slate-900 tracking-tight">SmartRide</span>
                  <span className="font-bold text-xs px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">AI</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">ReAct Travel & Fare Agent</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Active Plan Summary if available */}
          {plan && (
            <div className="mx-3 mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-800 mb-1">
                <span className="truncate max-w-[140px] text-emerald-800">{plan.destination}</span>
                <span className="text-slate-500">{plan.durationDays}D</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Budget: {currency} {plan.budgetSummary.totalBudget.toLocaleString()}</span>
                <span className="text-emerald-700 font-semibold">
                  Est: {currency} {plan.budgetSummary.estimatedTotal.toLocaleString()}
                </span>
              </div>
            </div>
          )}

          {/* Navigation Items (The exact requested tabs) */}
          <nav className="p-3 space-y-1 mt-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Agent Navigation
            </span>

            {menuItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-item-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full p-2 rounded-xl transition text-left flex items-center justify-between group ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-950 border border-emerald-200 shadow-2xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <span className={`text-xs block truncate ${isActive ? 'text-emerald-950 font-bold' : 'font-medium'}`}>
                        {item.label}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate group-hover:text-slate-500">
                        {item.description}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ml-1.5 ${
                        item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: User Account & Export Card */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          {plan && (
            <button
              id="sidebar-btn-export"
              onClick={() => {
                onOpenExport();
                if (window.innerWidth < 1024) onClose();
              }}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Travel Package</span>
            </button>
          )}

          {/* User Account Tile */}
          <div
            id="sidebar-user-tile"
            onClick={() => handleSelect('settings')}
            className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
              activeTab === 'settings'
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                KA
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-slate-900 block truncate">Karthik AM</span>
                <span className="text-[10px] text-slate-400 block truncate">karthikam083@gmail.com</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
};
