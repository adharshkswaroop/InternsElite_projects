import React, { useState } from 'react';
import { ReactTraceStep } from '../types/travel';
import {
  BrainCircuit,
  Wrench,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  CloudSun,
  Plane,
  Building,
  MapPin,
  Car,
  Filter,
} from 'lucide-react';

interface ReactTraceViewerProps {
  traces: ReactTraceStep[];
  isPlanning: boolean;
  backtrackCount: number;
}

export const ReactTraceViewer: React.FC<ReactTraceViewerProps> = ({
  traces,
  isPlanning,
  backtrackCount,
}) => {
  const [filter, setFilter] = useState<'all' | 'thoughts' | 'tools' | 'backtrack'>('all');
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (stepNum: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [stepNum]: !prev[stepNum],
    }));
  };

  const getToolIcon = (toolName?: ReactTraceStep['toolName']) => {
    switch (toolName) {
      case 'OpenWeatherMap':
        return <CloudSun className="w-4 h-4 text-sky-600" />;
      case 'Skyscanner_Flights':
        return <Plane className="w-4 h-4 text-blue-600" />;
      case 'Amadeus_Hotels':
        return <Building className="w-4 h-4 text-amber-600" />;
      case 'GooglePlaces_Attractions':
        return <MapPin className="w-4 h-4 text-rose-600" />;
      case 'SmartRide_FareEngine':
        return <Car className="w-4 h-4 text-emerald-600" />;
      default:
        return <Wrench className="w-4 h-4 text-purple-600" />;
    }
  };

  const filteredTraces = traces.filter((t) => {
    if (filter === 'thoughts') return t.type === 'thought';
    if (filter === 'tools') return t.type === 'action' || t.type === 'observation';
    if (filter === 'backtrack') return t.type === 'backtrack' || t.status === 'backtracking';
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 mb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Autonomous ReAct Reasoning & Execution Trace
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time step-by-step trace of Thought → Action → Observation loop with constraint backtracking.
          </p>
        </div>

        {/* Stats & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {backtrackCount > 0 && (
            <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
              {backtrackCount} Backtracking Event(s)
            </span>
          )}

          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 text-xs font-medium border border-slate-200">
            {(['all', 'thoughts', 'tools', 'backtrack'] as const).map((f) => (
              <button
                key={f}
                id={`btn-trace-filter-${f}`}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md transition capitalize ${
                  filter === f ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {f === 'backtrack' ? 'Backtracks' : f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trace Timeline */}
      <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {filteredTraces.map((trace) => {
          const isThought = trace.type === 'thought';
          const isAction = trace.type === 'action';
          const isObservation = trace.type === 'observation';
          const isBacktrack = trace.type === 'backtrack';
          const isDecision = trace.type === 'decision';
          const isExpanded = expandedSteps[trace.step];

          let badgeBg = 'bg-slate-100 text-slate-700 border-slate-300';
          let icon = <BrainCircuit className="w-3.5 h-3.5" />;

          if (isThought) {
            badgeBg = 'bg-blue-50 text-blue-800 border-blue-200';
            icon = <BrainCircuit className="w-3.5 h-3.5 text-blue-600" />;
          } else if (isAction) {
            badgeBg = 'bg-purple-50 text-purple-800 border-purple-200';
            icon = <Wrench className="w-3.5 h-3.5 text-purple-600" />;
          } else if (isObservation) {
            badgeBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
            icon = <Eye className="w-3.5 h-3.5 text-emerald-600" />;
          } else if (isBacktrack) {
            badgeBg = 'bg-rose-50 text-rose-800 border-rose-200 animate-pulse';
            icon = <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />;
          } else if (isDecision) {
            badgeBg = 'bg-teal-50 text-teal-800 border-teal-200 font-bold';
            icon = <CheckCircle className="w-3.5 h-3.5 text-teal-600" />;
          }

          return (
            <div key={trace.step} className="relative group">
              {/* Step indicator circle on timeline */}
              <div
                className={`absolute -left-6 top-1.5 w-6 h-6 rounded-full border-2 bg-white flex items-center justify-center -translate-x-1/2 ${
                  isBacktrack
                    ? 'border-rose-500 text-rose-600'
                    : isAction
                    ? 'border-purple-500 text-purple-600'
                    : isObservation
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-blue-500 text-blue-600'
                }`}
              >
                <span className="text-[10px] font-bold">{trace.step}</span>
              </div>

              {/* Step Card */}
              <div
                className={`p-3.5 rounded-xl border transition ${
                  isBacktrack
                    ? 'bg-rose-50/50 border-rose-200'
                    : isDecision
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeBg}`}>
                      {icon}
                      <span>{trace.type}</span>
                    </span>

                    {trace.toolName && (
                      <span className="inline-flex items-center space-x-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                        {getToolIcon(trace.toolName)}
                        <span>{trace.toolName}</span>
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {trace.timestamp}
                  </span>
                </div>

                {/* Content */}
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line font-medium">
                  {trace.content}
                </p>

                {/* Collapsible Tool Payload Details */}
                {(trace.toolInput || trace.toolOutput) && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => toggleStep(trace.step)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition"
                    >
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      <span>{isExpanded ? 'Hide Tool JSON Payload' : 'Inspect Tool JSON Payload'}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                        {trace.toolInput && (
                          <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono overflow-x-auto">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                              // Tool Input Arguments
                            </span>
                            <pre>{JSON.stringify(trace.toolInput, null, 2)}</pre>
                          </div>
                        )}
                        {trace.toolOutput && (
                          <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-300 font-mono overflow-x-auto">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                              // Tool Observation Data
                            </span>
                            <pre>
                              {typeof trace.toolOutput === 'string'
                                ? trace.toolOutput
                                : JSON.stringify(trace.toolOutput, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isPlanning && (
          <div className="relative pl-2 flex items-center space-x-2 text-xs font-semibold text-emerald-700 animate-pulse py-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
            <span>Agent ReAct loop active: evaluating constraints & verifying ride surge indices...</span>
          </div>
        )}
      </div>
    </div>
  );
};
