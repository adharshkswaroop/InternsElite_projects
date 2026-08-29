import React, { useState } from 'react';
import { 
  Target, 
  Smile, 
  Frown, 
  Meh, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Filter, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Quote,
  ShieldAlert,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { AspectMetric, Review } from '../../types';

interface AspectSentimentViewProps {
  aspectMetrics: AspectMetric[];
  reviews: Review[];
  onOpenTesterWithText: (text: string) => void;
}

export const AspectSentimentView: React.FC<AspectSentimentViewProps> = ({
  aspectMetrics,
  reviews,
  onOpenTesterWithText
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedAspectName, setSelectedAspectName] = useState<string>(
    aspectMetrics.find(a => a.aspect === 'battery')?.aspect || aspectMetrics[0]?.aspect || 'battery'
  );

  const selectedAspect = aspectMetrics.find(a => a.aspect === selectedAspectName) || aspectMetrics[0];

  // Filter reviews containing this aspect
  const relatedReviews = reviews.filter(r => 
    r.aspects.some(a => a.aspect.toLowerCase() === selectedAspectName.toLowerCase())
  );

  // Top Negative Aspects Ranking
  const topNegativeAspects = [...aspectMetrics]
    .sort((a, b) => b.negative_ratio - a.negative_ratio)
    .slice(0, 5);

  // Chart data for main comparison
  const chartData = aspectMetrics.map(a => ({
    name: a.aspect.charAt(0).toUpperCase() + a.aspect.slice(1),
    Positive: a.positive_count,
    Neutral: a.neutral_count,
    Negative: a.negative_count,
    netScore: a.net_sentiment_score,
    total: a.total_mentions
  })).sort((a, b) => b.total - a.total);

  // Mock Trend data for selected aspect
  const aspectTrendData = [
    { month: 'Jan', positive: 65, negative: 25 },
    { month: 'Feb', positive: 60, negative: 32 },
    { month: 'Mar', positive: 52, negative: 38 },
    { month: 'Apr', positive: 48, negative: 44 },
    { month: 'May', positive: selectedAspect?.positive_ratio ? Math.round(selectedAspect.positive_ratio * 100) : 42, negative: selectedAspect?.negative_ratio ? Math.round(selectedAspect.negative_ratio * 100) : 49 },
  ];

  // Common complaints curated per aspect
  const complaintsMap: Record<string, string[]> = {
    battery: [
      'Battery drains faster than advertised when gaming or running benchmarks',
      'Device chassis overheats noticeably during 80W fast charging',
      'Standby power draw drops 15% overnight when idle'
    ],
    display: [
      'Minor screen glare under direct sunlight conditions',
      'Auto-brightness sensor responds with slight delay in dim rooms'
    ],
    'customer support': [
      'Slow response time for warranty RMA replacement processing',
      'Tier 1 support representative required repeating serial numbers multiple times'
    ],
    delivery: [
      'Outer courier shipping box arrived slightly crushed',
      'Tracking status took 48 hours to update after shipping label was created'
    ],
    packaging: [
      'Corner foam padding in outer package was torn during transit',
      'Unboxing pull-tab was stiff and tore before opening'
    ],
    price: [
      'Higher price point compared to previous gen predecessor',
      'Accessories and protective case sold separately at premium markup'
    ],
    usability: [
      'Companion mobile app occasionally disconnects Bluetooth when switching modes',
      'Equalizer preset menu requires multiple navigation taps'
    ]
  };

  const commonComplaints = complaintsMap[selectedAspectName.toLowerCase()] || [
    `Occasional inconsistency observed in ${selectedAspectName} performance`,
    `Customer feedback requests software update improvements for ${selectedAspectName}`
  ];

  // AI Summary for selected aspect
  const getAISummary = (aspectName: string) => {
    switch (aspectName.toLowerCase()) {
      case 'battery':
        return "Customers praise long overall screen-on battery runtime, but thermal dissipation and fast-drain during intensive tasks or high refresh rates remain key friction points.";
      case 'customer support':
        return "Support satisfaction is polarized: refund turnarounds are appreciated, but RMA hardware warranty replacement friction triggers strong negative reviews.";
      case 'display':
        return "High customer delight with OLED color accuracy and 120Hz smoothness; minor suggestions focus on outdoor anti-reflective coating.";
      case 'delivery':
        return "Fulfillment speeds consistently meet 2-day delivery estimates; packaging reinforcement needed to prevent outer carton corner damage.";
      default:
        return `Customers report mixed satisfaction with ${selectedAspectName}. Key satisfaction drivers correlate with build durability and price-to-performance ratio.`;
    }
  };

  const tooltipStyle = isDark 
    ? { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }
    : { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

  const gridStroke = isDark ? '#334155' : '#f1f5f9';
  const axisStroke = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6 pb-12 transition-colors duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Aspect-Based Sentiment Analysis (ABSA) Engine
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Fine-grained sentiment evaluation linked to specific product features, components, and service touchpoints.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Aspects Tracked:</span>
          <span className="px-2.5 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 font-mono text-xs font-bold">
            {aspectMetrics.length} Features
          </span>
        </div>
      </div>

      {/* Row: Aspect Sentiment Chart + Top Negative Aspects List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Aspect Comparison Chart */}
        <div className="lg:col-span-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Aspect Sentiment Volume & Polarity</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Comparative breakdown of positive vs negative feedback per feature</p>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">Sorted by Mention Frequency</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="name" stroke={axisStroke} fontSize={11} angle={-25} textAnchor="end" height={40} />
                <YAxis stroke={axisStroke} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Positive" fill="#10b981" stackId="stack" />
                <Bar dataKey="Neutral" fill="#94a3b8" stackId="stack" />
                <Bar dataKey="Negative" fill="#f43f5e" stackId="stack" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Top Negative Aspects Ranking (Section 10) */}
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Top Negative Aspects</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200 dark:border-rose-800">
                Friction Ranked
              </span>
            </div>

            <div className="space-y-3 mt-3">
              {topNegativeAspects.map((asp, idx) => {
                const isSelected = selectedAspectName.toLowerCase() === asp.aspect.toLowerCase();
                const negPct = Math.round(asp.negative_ratio * 100);
                return (
                  <button
                    key={asp.aspect}
                    onClick={() => setSelectedAspectName(asp.aspect)}
                    className={`w-full p-2.5 rounded-lg text-left transition flex items-center justify-between border cursor-pointer ${
                      isSelected
                        ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 ring-1 ring-rose-500'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-mono text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
                        {asp.aspect}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        -{negPct}%
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Click any aspect to launch deep-dive analysis.
          </div>
        </div>
      </div>

      {/* Aspect Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {aspectMetrics.map((asp) => {
          const isSelected = selectedAspectName.toLowerCase() === asp.aspect.toLowerCase();
          return (
            <button
              key={asp.aspect}
              onClick={() => setSelectedAspectName(asp.aspect)}
              className={`p-3.5 rounded-lg text-left transition flex flex-col justify-between border shadow-2xs cursor-pointer ${
                isSelected 
                  ? 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-500 ring-1 ring-orange-500'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">{asp.aspect}</span>
                  <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{asp.total_mentions} mentions</span>
                </div>
                
                <div className="mt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Net Score:</span>
                  <span className={`font-bold ${
                    asp.net_sentiment_score > 0.2 ? 'text-emerald-600 dark:text-emerald-400' :
                    asp.net_sentiment_score < -0.2 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    {asp.net_sentiment_score > 0 ? `+${asp.net_sentiment_score}` : asp.net_sentiment_score}
                  </span>
                </div>
              </div>

              <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: `${asp.positive_ratio * 100}%` }}></div>
                <div className="bg-rose-500 h-full" style={{ width: `${asp.negative_ratio * 100}%` }}></div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Section 11: Aspect Drill-Down Box (Battery Intelligence etc.) */}
      {selectedAspect && (
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 font-mono">Aspect Drill-Down</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{selectedAspect.aspect} Intelligence</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Deep-dive diagnostic into customer sentiment trends, root-cause complaints, and representative verbatim.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="text-center sm:text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">AVG CONFIDENCE</span>
                <span className="text-orange-600 dark:text-orange-400 font-bold">{(selectedAspect.avg_confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">POSITIVE</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{(selectedAspect.positive_ratio * 100).toFixed(0)}%</span>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">NEGATIVE</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{(selectedAspect.negative_ratio * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* AI Aspect Summary Banner */}
          <div className="p-4 rounded-lg bg-orange-50/60 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-800 dark:text-orange-300 font-mono uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Aspect Synthesis & Diagnostic</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {getAISummary(selectedAspect.aspect)}
            </p>
          </div>

          {/* Grid: Sentiment Trend Line + Common Complaints */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Trend Line Chart */}
            <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Sentiment Trajectory Trend
                </h4>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">5-Month Window</span>
              </div>

              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={aspectTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                    <XAxis dataKey="month" stroke={axisStroke} fontSize={10} />
                    <YAxis stroke={axisStroke} fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} name="Positive %" />
                    <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} name="Negative %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Common Complaints */}
            <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Common Customer Complaints</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">Top Root Causes</span>
                </div>

                <div className="space-y-2 mt-3">
                  {commonComplaints.map((comp, idx) => (
                    <div key={idx} className="p-2.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0"></span>
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono pt-2 border-t border-slate-200 dark:border-slate-800">
                Pattern frequency extracted from NLP clusters
              </div>
            </div>
          </div>

          {/* Verbatim Evidence Span Cloud */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Quote className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              Verbatim Evidence Spans Extracted by Model
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedAspect.sample_evidences.map((ev, idx) => (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-lg border flex flex-col justify-between gap-2 shadow-2xs ${
                    ev.sentiment === 'positive' ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200' :
                    ev.sentiment === 'negative' ? 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-200' :
                    'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <p className="text-xs italic leading-relaxed">
                    "{ev.evidence}"
                  </p>
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">{ev.product_name}</span>
                    <span className={`uppercase font-mono font-bold ${
                      ev.sentiment === 'positive' ? 'text-emerald-700 dark:text-emerald-300' :
                      ev.sentiment === 'negative' ? 'text-rose-700 dark:text-rose-300' :
                      'text-slate-600 dark:text-slate-400'
                    }`}>{ev.sentiment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Full Reviews List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Representative Reviews Discussing #{selectedAspect.aspect} ({relatedReviews.length} records)
            </h4>

            <div className="space-y-2.5">
              {relatedReviews.map((rev) => (
                <div key={rev.review_id} className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white">{rev.product_name}</span>
                      <span className="text-amber-500 font-mono font-semibold">{rev.rating} ★</span>
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">ID: {rev.review_id}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      rev.sentiment === 'positive' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                      rev.sentiment === 'negative' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}>
                      Overall: {rev.sentiment}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    "{rev.review_text}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 dark:text-slate-400 border-t border-slate-200/50 dark:border-slate-800">
                    <span>Source: {rev.source} | Date: {rev.review_date}</span>
                    <button
                      onClick={() => onOpenTesterWithText(rev.review_text)}
                      className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold cursor-pointer"
                    >
                      Test in Sandbox →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
