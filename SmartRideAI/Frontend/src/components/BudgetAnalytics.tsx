import React from 'react';
import { TravelPlan } from '../types/travel';
import {
  ShieldCheck,
  DollarSign,
  TrendingDown,
  PieChart as PieIcon,
  BarChart2,
  AlertTriangle,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';

interface BudgetAnalyticsProps {
  plan: TravelPlan;
  currency: string;
}

export const BudgetAnalytics: React.FC<BudgetAnalyticsProps> = ({ plan, currency }) => {
  const { budgetSummary } = plan;

  const allocationData = [
    { name: 'Flights', value: budgetSummary.allocations.flights, color: '#3b82f6' },
    { name: 'Hotels / Lodging', value: budgetSummary.allocations.hotels, color: '#f59e0b' },
    { name: 'SmartRide Cabs', value: budgetSummary.allocations.rides, color: '#10b981' },
    { name: 'Activities & Dining', value: budgetSummary.allocations.activitiesAndFood, color: '#8b5cf6' },
    { name: 'Buffer Reserve', value: budgetSummary.allocations.bufferEmergency, color: '#64748b' },
  ];

  const dailySpendData = plan.days.map((d) => ({
    day: `Day ${d.dayNumber}`,
    rides: d.totalRideCost,
    activities: d.totalActivityCost,
    total: d.totalDayCost,
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Budget Constraint Verification & Backtracking Audit
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            ReAct constraint satisfaction analytics, component allocations, and ML surge-savings audit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${
              budgetSummary.isWithinBudget
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Remaining Buffer: {currency} {budgetSummary.remainingBudget}
          </span>
        </div>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block mb-1">Total Trip Budget</span>
          <span className="text-xl font-extrabold text-slate-900">
            {currency} {budgetSummary.totalBudget.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-400 block mt-1">User-defined ceiling constraint</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block mb-1">Projected Total Cost</span>
          <span className="text-xl font-extrabold text-emerald-600">
            {currency} {budgetSummary.estimatedTotal.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-1">
            {budgetSummary.isWithinBudget ? '✅ 100% Compliant' : '⚠️ Backtrack Optimized'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block mb-1">SmartRide Route Savings</span>
          <span className="text-xl font-extrabold text-teal-600">
            {currency} {budgetSummary.savingsFromSmartRides.toLocaleString()}
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Saved via dynamic tier choice</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block mb-1">Constraint Backtracks</span>
          <span className="text-xl font-extrabold text-amber-600">
            {plan.backtrackEventsCount} Event(s)
          </span>
          <span className="text-[10px] text-slate-500 block mt-1">Auto-resolved accommodation/rides</span>
        </div>
      </div>

      {/* Visual Charts: Donut Allocation + Day Spend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Donut Allocation */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <PieIcon className="w-4 h-4 text-emerald-600" />
            <span>Budget Allocation Breakdown</span>
          </h4>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => [`${currency} ${val}`, 'Allocated']}
                  contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-[11px]">
            {allocationData.map((item) => (
              <div key={item.name} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900">{currency} {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day-by-Day Cost Bar */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-blue-600" />
            <span>Day-by-Day Spending Trajectory</span>
          </h4>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySpendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(val: any) => [`${currency} ${val}`, 'Spend']}
                  contentStyle={{ fontSize: '11px', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px' }} />
                <Bar dataKey="rides" name="SmartRide Cabs" stackId="a" fill="#10b981" />
                <Bar dataKey="activities" name="Activities & Meals" stackId="a" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
            Average Daily Burn: <span className="font-bold text-slate-800">{currency} {(budgetSummary.estimatedTotal / plan.durationDays).toFixed(2)}/day</span>
          </div>
        </div>
      </div>

      {/* Backtracking & AI Decision Audit Log */}
      <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-200 space-y-2">
        <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
          <span>Agent Budget Strategy & Constraints Audit Log</span>
        </h4>
        <ul className="space-y-1 text-xs text-slate-700">
          {budgetSummary.budgetTips.map((tip, idx) => (
            <li key={idx} className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
