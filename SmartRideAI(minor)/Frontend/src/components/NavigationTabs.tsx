import React from 'react';
import {
  Calendar,
  BrainCircuit,
  MapPin,
  Car,
  ShieldCheck,
  Lock,
  Settings,
} from 'lucide-react';
import { SidebarTab } from './Sidebar';

interface NavigationTabsProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  dayCount?: number;
  traceCount?: number;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  setActiveTab,
  dayCount,
  traceCount,
}) => {
  const tabs: Array<{
    id: SidebarTab;
    label: string;
    shortLabel: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
    {
      id: 'itinerary',
      label: 'Itinerary & Daily Schedule',
      shortLabel: 'Itinerary',
      icon: <Calendar className="w-4 h-4" />,
      badge: dayCount ? `${dayCount}D` : undefined,
    },
    {
      id: 'agent_trace',
      label: 'ReAct Agent Reasoning',
      shortLabel: 'AI Reasoning',
      icon: <BrainCircuit className="w-4 h-4" />,
      badge: traceCount ? `${traceCount}` : undefined,
    },
    {
      id: 'map',
      label: 'Interactive Route Map',
      shortLabel: 'Map & Routes',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: 'fare_calc',
      label: 'SmartRide Fare Calculator',
      shortLabel: 'Fare Estimator',
      icon: <Car className="w-4 h-4" />,
    },
    {
      id: 'budget',
      label: 'Budget & Backtrack Audit',
      shortLabel: 'Budget Analytics',
      icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
      id: 'security',
      label: 'Security & Observability',
      shortLabel: 'Security',
      icon: <Lock className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Settings & Profile',
      shortLabel: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full mb-6">
      {/* Scrollable / Responsive Tab Bar */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto scrollbar-none flex items-center gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 shrink-0 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <span className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {tab.icon}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden inline">{tab.shortLabel}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-emerald-800 text-emerald-100'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
