import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, SidebarTab } from './components/Sidebar';
import { NavigationTabs } from './components/NavigationTabs';
import { AgentPlannerForm } from './components/AgentPlannerForm';
import { ItineraryView } from './components/ItineraryView';
import { ReactTraceViewer } from './components/ReactTraceViewer';
import { SmartRideCalculator } from './components/SmartRideCalculator';
import { InteractiveMap } from './components/InteractiveMap';
import { BudgetAnalytics } from './components/BudgetAnalytics';
import { SecurityAuditView } from './components/SecurityAuditView';
import { UserSettingsView } from './components/UserSettingsView';
import { ExportModal } from './components/ExportModal';
import { PlanTripRequest, TravelPlan } from './types/travel';
import { ReActAgentEngine } from './services/agentEngine';
import {
  Sparkles,
  AlertCircle,
  Car,
} from 'lucide-react';

export default function App() {
  // 1. URL Hash routing sync for browser forward/back buttons & direct page links
  const getTabFromHash = (): SidebarTab => {
    const hash = window.location.hash.replace('#', '') as SidebarTab;
    const validTabs: SidebarTab[] = [
      'itinerary',
      'agent_trace',
      'map',
      'fare_calc',
      'budget',
      'security',
      'settings',
    ];
    return validTabs.includes(hash) ? hash : 'itinerary';
  };

  const [activeTab, setActiveTabState] = useState<SidebarTab>(getTabFromHash());
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>('USD');
  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Sync hash routing
  const setActiveTab = (tab: SidebarTab) => {
    setActiveTabState(tab);
    window.location.hash = tab;
    // Scroll smoothly to top on page change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTabState(getTabFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Initialize with a default Tokyo Travel Plan on first render
  useEffect(() => {
    handlePlanTrip({
      destination: 'Tokyo, Japan',
      origin: 'San Francisco, USA',
      startDate: new Date().toISOString().split('T')[0],
      durationDays: 4,
      budget: 1800,
      currency: 'USD',
      travelers: 2,
      travelStyle: 'Balanced',
      customPreferences: 'Explore vintage cafes in Shimokitazawa, historical temples in Asakusa, and night neon in Shinjuku.',
    });
  }, []);

  const handlePlanTrip = async (params: PlanTripRequest) => {
    setIsPlanning(true);
    setErrorMsg(null);
    try {
      // 1. Attempt production backend API with rate-limiting & Zod schema validation
      const response = await fetch('/api/agent/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.plan) {
          setPlan(data.plan);
          return;
        }
      }

      // 2. Resilient In-Memory Fallback if backend API is offline
      const generatedPlan = await ReActAgentEngine.planTrip(params);
      setPlan(generatedPlan);
    } catch (err: any) {
      console.warn('ReAct agent execution note:', err);
      // Secondary safety fallback ensures zero UI crashes
      const generatedPlan = await ReActAgentEngine.planTrip(params);
      setPlan(generatedPlan);
    } finally {
      setIsPlanning(false);
    }
  };

  const handleQuickPreset = (destination: string, budget: number, duration: number, style: any) => {
    handlePlanTrip({
      destination,
      origin: 'Current Location',
      startDate: new Date().toISOString().split('T')[0],
      durationDays: duration,
      budget,
      currency,
      travelers: 2,
      travelStyle: style,
      customPreferences: `Fast and efficient tour of ${destination} optimizing SmartRide transit connections.`,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* 1. Sidebar Navigation (Responsive Drawer on Mobile, Fixed on Desktop) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        plan={plan}
        currency={currency}
        isPlanning={isPlanning}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Wrapper with Sidebar Offset on lg screens */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currency={currency}
          setCurrency={setCurrency}
          onOpenExport={() => setIsExportOpen(true)}
          hasPlan={Boolean(plan)}
          onQuickPreset={handleQuickPreset}
          isPlanning={isPlanning}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-6">
          {/* Error notification banner */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Responsive Page Navigation Tabs */}
          <NavigationTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            dayCount={plan?.durationDays}
            traceCount={plan?.reasoningTraces.length}
          />

          {/* Trip Configuration Planner Form (Shown on primary planning views) */}
          {activeTab !== 'settings' && activeTab !== 'security' && (
            <AgentPlannerForm
              onPlanTrip={handlePlanTrip}
              isPlanning={isPlanning}
              currency={currency}
              initialValues={plan ? {
                destination: plan.destination,
                origin: plan.origin,
                startDate: plan.startDate,
                durationDays: plan.durationDays,
                budget: plan.budgetSummary.totalBudget,
                currency: plan.currency,
                travelers: plan.travelersCount,
                travelStyle: plan.travelStyle,
              } : undefined}
            />
          )}

          {/* Loading State */}
          {isPlanning && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center space-y-4 mb-6 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Autonomous ReAct Agent Reasoning in Progress...
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Querying climate forecasts, flight matrix, hotel inventories, place coordinates, and calculating SmartRide surge multiplier models across all route legs.
              </p>
            </div>
          )}

          {/* Active Tab / Page Routing Views */}
          {!isPlanning && plan && (
            <div className="space-y-6">
              {activeTab === 'itinerary' && (
                <ItineraryView plan={plan} currency={currency} />
              )}

              {activeTab === 'agent_trace' && (
                <ReactTraceViewer
                  traces={plan.reasoningTraces}
                  isPlanning={isPlanning}
                  backtrackCount={plan.backtrackEventsCount}
                />
              )}

              {activeTab === 'map' && (
                <InteractiveMap plan={plan} currency={currency} />
              )}

              {activeTab === 'fare_calc' && (
                <SmartRideCalculator currency={currency} />
              )}

              {activeTab === 'budget' && (
                <BudgetAnalytics plan={plan} currency={currency} />
              )}
            </div>
          )}

          {/* Security & Production Observability View */}
          {activeTab === 'security' && (
            <SecurityAuditView currency={currency} />
          )}

          {/* Settings / User Account View */}
          {activeTab === 'settings' && (
            <UserSettingsView currency={currency} setCurrency={setCurrency} />
          )}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-5 sm:py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 font-medium">
              <Car className="w-4 h-4 text-emerald-600" />
              <span>SmartRide AI • Autonomous ReAct Travel Planning & Dynamic Fare Calculator</span>
            </div>
            <div className="flex items-center space-x-3 text-[11px] text-slate-400">
              <button onClick={() => setActiveTab('itinerary')} className="hover:text-slate-700">Itinerary</button>
              <span>•</span>
              <button onClick={() => setActiveTab('map')} className="hover:text-slate-700">Map</button>
              <span>•</span>
              <button onClick={() => setActiveTab('fare_calc')} className="hover:text-slate-700">Fare Calc</button>
              <span>•</span>
              <button onClick={() => setActiveTab('security')} className="hover:text-slate-700">Security</button>
            </div>
          </div>
        </footer>
      </div>

      {/* Export Package Modal */}
      {plan && (
        <ExportModal
          plan={plan}
          currency={currency}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
}
