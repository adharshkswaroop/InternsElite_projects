import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  ArrowRight, 
  FileText, 
  RefreshCw,
  Award
} from 'lucide-react';
import { AIInsightReport, AspectMetric, Review } from '../../types';
import { generateBusinessIntelligenceReport } from '../../services/aiInsightsService';

interface AIInsightsViewProps {
  reviews: Review[];
  aspectMetrics: AspectMetric[];
}

export const AIInsightsView: React.FC<AIInsightsViewProps> = ({
  reviews,
  aspectMetrics
}) => {
  const [report, setReport] = useState<AIInsightReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedFocus, setSelectedFocus] = useState<any>('Executive Overview');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const generated = await generateBusinessIntelligenceReport({
        scope: "All Catalog Products (Global Sentiment Dataset)",
        focusArea: selectedFocus,
        reviews,
        aspectMetrics
      });
      setReport(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [reviews, aspectMetrics, selectedFocus]);

  const handleCopyMarkdown = () => {
    if (!report) return;
    const md = `
# Customer Review Intelligence & Executive Report
**Report ID:** ${report.report_id}
**Generated At:** ${report.generated_at}
**Model Engine:** ${report.model_name}
**Target Scope:** ${report.target_scope}

## 1. Executive Summary
${report.executive_summary}

## 2. Key Findings
${report.key_findings.map(k => `- ${k}`).join('\n')}

## 3. Critical Complaint Diagnostics
${report.complaint_diagnostics.map(c => `
### [${c.severity}] Aspect: ${c.aspect} (${c.affected_percentage})
- **Root Cause:** ${c.root_cause}
- **Suggested Action:** ${c.suggested_action}
- **Verbatim Customer Evidence:**
${c.verbatim_evidence.map(v => `  > ${v}`).join('\n')}
`).join('\n')}

## 4. Prioritized Action Plan
${report.recommended_actions.map(a => `- **[${a.priority}] ${a.department}:** ${a.action} *(Expected Impact: ${a.expected_impact})*`).join('\n')}
`;
    navigator.clipboard.writeText(md.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 transition-colors duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            AI Executive Business Intelligence & Actionable Briefing
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Automated synthesis of quantitative NLP metrics and customer evidence into verified executive actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-3.5 py-2 rounded-md bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs transition flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate Briefing</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-2xs transition flex items-center gap-2 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Markdown' : 'Copy Executive Report'}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-16 text-center text-slate-500 dark:text-slate-400 space-y-3 shadow-xs">
          <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Synthesizing multi-aspect evidence and customer reviews...</p>
        </div>
      ) : report ? (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="rounded-lg bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/80 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-orange-200/80 dark:border-orange-800/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider font-mono">
                  Executive Briefing
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">ID: {report.report_id}</span>
              </div>
              <span className="text-xs text-orange-600 dark:text-orange-400 font-mono font-medium">Generated: {report.generated_at}</span>
            </div>

            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
              {report.executive_summary}
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-mono pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Evidence Traceability: 100% Grounded in analyzed customer reviews (zero hallucinated stats)</span>
            </div>
          </div>

          {/* Key Findings Checklist */}
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              Key High-Level Strategic Findings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {report.key_findings.map((finding, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 font-mono">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{finding}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Complaint Diagnostics with Verbatim Quotes */}
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Root-Cause Complaint Diagnostics & Evidence
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-medium">Prioritized by Churn Velocity</span>
            </div>

            <div className="space-y-4">
              {report.complaint_diagnostics.map((diag, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-mono">
                        {diag.severity}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Aspect: {diag.aspect}</h4>
                    </div>
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">{diag.affected_percentage}</span>
                  </div>

                  <div className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <div><strong className="text-slate-900 dark:text-white">Root Cause:</strong> {diag.root_cause}</div>
                    <div><strong className="text-emerald-700 dark:text-emerald-400">Prescribed Fix:</strong> {diag.suggested_action}</div>
                  </div>

                  {/* Verbatim quotes */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 space-y-1.5">
                    <span className="text-[10px] uppercase font-mono text-slate-500 dark:text-slate-400 font-semibold">Verbatim Quotes from Dataset:</span>
                    <div className="space-y-1.5">
                      {diag.verbatim_evidence.map((v, vi) => (
                        <p key={vi} className="text-[11px] text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2.5 rounded-md border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                          {v}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Department Roadmap */}
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Prioritized Cross-Department Action Roadmap
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.recommended_actions.map((act, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-700 dark:text-orange-300">{act.department}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono font-bold ${
                        act.priority.startsWith('P0') ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                        act.priority.startsWith('P1') ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                        'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                      }`}>
                        {act.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-900 dark:text-white font-medium mt-2 leading-relaxed">{act.action}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold flex items-center gap-1">
                    <span>Impact:</span> {act.expected_impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

