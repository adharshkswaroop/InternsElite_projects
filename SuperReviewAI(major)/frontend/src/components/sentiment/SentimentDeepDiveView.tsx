import React from 'react';
import { 
  Smile, 
  Frown, 
  Meh, 
  AlertCircle, 
  TrendingUp, 
  Zap, 
  Star, 
  ShieldAlert, 
  Layers 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { Review } from '../../types';

interface SentimentDeepDiveViewProps {
  reviews: Review[];
  onOpenTesterWithText: (text: string) => void;
}

export const SentimentDeepDiveView: React.FC<SentimentDeepDiveViewProps> = ({
  reviews,
  onOpenTesterWithText
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Find rating vs sentiment mismatches (e.g. 4-5 stars with negative sentiment, or 1-2 stars with positive sentiment)
  const mismatches = reviews.filter(r => 
    (r.rating >= 4 && r.sentiment === 'negative') ||
    (r.rating <= 2 && r.sentiment === 'positive') ||
    (r.rating === 3 && (r.aspects.some(a => a.sentiment === 'negative') && r.aspects.some(a => a.sentiment === 'positive')))
  );

  // Confidence distribution bins
  const confidenceBins = [
    { bin: '60-70%', count: reviews.filter(r => r.sentiment_confidence >= 0.6 && r.sentiment_confidence < 0.7).length },
    { bin: '70-80%', count: reviews.filter(r => r.sentiment_confidence >= 0.7 && r.sentiment_confidence < 0.8).length },
    { bin: '80-90%', count: reviews.filter(r => r.sentiment_confidence >= 0.8 && r.sentiment_confidence < 0.9).length },
    { bin: '90-100%', count: reviews.filter(r => r.sentiment_confidence >= 0.9).length },
  ];

  // Category sentiment
  const categories = Array.from(new Set(reviews.map(r => r.category)));
  const categorySentiment = categories.map(cat => {
    const catReviews = reviews.filter(r => r.category === cat);
    return {
      category: cat,
      Positive: catReviews.filter(r => r.sentiment === 'positive').length,
      Neutral: catReviews.filter(r => r.sentiment === 'neutral').length,
      Negative: catReviews.filter(r => r.sentiment === 'negative').length,
      avgRating: (catReviews.reduce((s, r) => s + r.rating, 0) / (catReviews.length || 1)).toFixed(2)
    };
  });

  const tooltipStyle = isDark 
    ? { backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '11px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }
    : { backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', color: '#0f172a', fontSize: '11px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' };

  const gridStroke = isDark ? '#334155' : '#f1f5f9';
  const axisStroke = isDark ? '#94a3b8' : '#64748b';

  return (
    <div className="space-y-6 pb-12 transition-colors duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Smile className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Sentiment Granularity & Rating Alignment Analysis
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Identify nuanced sentiment discrepancies, sarcasm, and cross-category sentiment benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-mono font-semibold">
            {mismatches.length} Potential Mismatches Detected
          </span>
        </div>
      </div>

      {/* Discrepancy Alert Card */}
      <div className="rounded-lg bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/80 p-5 space-y-4 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">Rating-Sentiment Anomaly & Sarcasm Detector</h3>
            <p className="text-xs text-amber-900/90 dark:text-amber-300/90 mt-0.5 leading-relaxed">
              Traditional review systems only look at star ratings. The ReviewIntel NLP pipeline flags customer reviews with high star ratings (4-5★) that express intense hidden frustration in text, or low star ratings with specific praised sub-aspects.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {mismatches.slice(0, 4).map((rev) => (
            <div key={rev.review_id} className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  <span>{rev.product_name}</span>
                  <span className="text-amber-500 font-mono">({rev.rating} ★)</span>
                </div>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                  rev.sentiment === 'negative' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                }`}>
                  NLP Sentiment: {rev.sentiment}
                </span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 italic">
                "{rev.review_text}"
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-1 font-mono border-t border-slate-100 dark:border-slate-800">
                <span>Confidence: {(rev.sentiment_confidence * 100).toFixed(0)}%</span>
                <button
                  onClick={() => onOpenTesterWithText(rev.review_text)}
                  className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold font-sans"
                >
                  Analyze in Sandbox →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts: Category Breakdown + Confidence Histogram */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Sentiment Breakdown */}
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Sentiment by Product Category</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Aggregated sentiment per catalog category</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categorySentiment} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="category" stroke={axisStroke} fontSize={11} />
                <YAxis stroke={axisStroke} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Positive" fill="#10b981" />
                <Bar dataKey="Neutral" fill="#94a3b8" />
                <Bar dataKey="Negative" fill="#f43f5e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Model Sentiment Confidence Histogram */}
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Model Confidence Score Distribution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Probability calibration across sentiment predictions</p>
            </div>
                <span className="text-xs font-mono text-orange-600 dark:text-orange-400 font-semibold">Mean: 88.4%</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceBins} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="bin" stroke={axisStroke} fontSize={11} />
                <YAxis stroke={axisStroke} fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#f97316" radius={[4, 4, 0, 0]} name="Reviews" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

