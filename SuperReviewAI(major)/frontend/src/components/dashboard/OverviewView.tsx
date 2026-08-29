import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Smile, 
  Frown, 
  Meh, 
  AlertTriangle, 
  Award, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  FileSpreadsheet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid,
  Legend
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { AspectMetric, Review, TopicCluster } from '../../types';

interface OverviewViewProps {
  reviews: Review[];
  aspectMetrics: AspectMetric[];
  topicClusters: TopicCluster[];
  onNavigate: (view: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  reviews,
  aspectMetrics,
  topicClusters,
  onNavigate
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const totalReviews = reviews.length || 1;
  const positiveReviews = reviews.filter(r => r.sentiment === 'positive');
  const negativeReviews = reviews.filter(r => r.sentiment === 'negative');
  const neutralReviews = reviews.filter(r => r.sentiment === 'neutral');

  const posPct = Math.round((positiveReviews.length / totalReviews) * 100);
  const negPct = Math.round((negativeReviews.length / totalReviews) * 100);
  const neuPct = Math.round((neutralReviews.length / totalReviews) * 100);

  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(2);
  const verifiedCount = reviews.filter(r => r.verified_purchase).length;
  const verifiedPct = Math.round((verifiedCount / totalReviews) * 100);

  // Most discussed aspect
  const sortedAspects = [...aspectMetrics].sort((a, b) => b.total_mentions - a.total_mentions);
  const mostDiscussedAspect = sortedAspects[0]?.aspect || 'N/A';

  // Most negative aspect
  const mostNegativeAspect = [...aspectMetrics]
    .filter(a => a.total_mentions >= 2)
    .sort((a, b) => b.negative_ratio - a.negative_ratio)[0]?.aspect || 'customer support';

  // Trending topic
  const trendingTopic = topicClusters.find(t => t.trend === 'increasing') || topicClusters[0];

  // Rating distribution for BarChart
  const ratingCounts = [1, 2, 3, 4, 5].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    return {
      rating: `${star} Star`,
      count,
      percentage: Math.round((count / totalReviews) * 100)
    };
  });

  // Sentiment timeline
  const timelineMap: Record<string, { date: string; positive: number; neutral: number; negative: number; count: number }> = {};
  reviews.forEach(r => {
    const d = r.review_date || '2026-08-01';
    if (!timelineMap[d]) {
      timelineMap[d] = { date: d.slice(5), positive: 0, neutral: 0, negative: 0, count: 0 };
    }
    timelineMap[d].count++;
    if (r.sentiment === 'positive') timelineMap[d].positive++;
    else if (r.sentiment === 'negative') timelineMap[d].negative++;
    else timelineMap[d].neutral++;
  });
  const sentimentTimeline = Object.values(timelineMap).sort((a, b) => a.date.localeCompare(b.date));

  // Aspect sentiment chart data
  const aspectChartData = sortedAspects.slice(0, 7).map(a => ({
    name: a.aspect.charAt(0).toUpperCase() + a.aspect.slice(1),
    Positive: a.positive_count,
    Neutral: a.neutral_count,
    Negative: a.negative_count,
    netScore: a.net_sentiment_score
  }));

  const tooltipStyle = isDark 
    ? { backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '10px', color: '#f4f4f5', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.7)' }
    : { backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '10px', color: '#09090b', fontSize: '12px', boxShadow: '0 4px 12px -2px rgba(0, 0, 0, 0.1)' };

  const gridStroke = isDark ? '#27272a' : '#f4f4f5';
  const axisStroke = isDark ? '#a1a1aa' : '#71717a';

  return (
    <div className="space-y-6 pb-12 transition-colors duration-150">
      {/* Top Banner Overview */}
      <div className="rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-950 to-black dark:from-zinc-950 dark:via-zinc-900 dark:to-black border border-amber-500/40 p-6 sm:p-8 shadow-xl relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-black tracking-wider border border-amber-500/40 flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                SUPER VIEW AI • ACTIVE NLP PIPELINE
              </span>
              <span className="text-xs text-zinc-400 font-mono hidden sm:inline">DistilBERT ABSA + FAISS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Customer Review Intelligence Dashboard
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
              Multi-dimensional intelligence suite combining Aspect-Based Sentiment Analysis (ABSA), BERTopic 2D Discovery, Semantic Vector Search, and 10-Stage ML Lifecycle Architecture.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Metric KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Reviews */}
        <div className="rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm dark:shadow-md hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">Total Reviews</span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-950 dark:text-white font-mono">{reviews.length}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-0.5" /> {verifiedPct}% Verified
            </span>
          </div>
          <div className="mt-2 w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* KPI 2: Average Rating */}
        <div className="rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm dark:shadow-md hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">Average Rating</span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-zinc-950 dark:text-white font-mono">{avgRating}</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">/ 5.00 stars</span>
          </div>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.round(Number(avgRating))
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-zinc-300 dark:text-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* KPI 3: Sentiment Breakdown (Positive / Negative) */}
        <div className="rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm dark:shadow-md hover:border-amber-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">Sentiment Split</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Smile className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="text-left">
              <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{posPct}%</div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold font-mono">Positive</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-extrabold text-zinc-600 dark:text-zinc-300 font-mono">{neuPct}%</div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold font-mono">Neutral</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">{negPct}%</div>
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold font-mono">Negative</div>
            </div>
          </div>
          <div className="mt-2 w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden flex">
            <div className="bg-emerald-500 h-full" style={{ width: `${posPct}%` }}></div>
            <div className="bg-zinc-400 dark:bg-zinc-600 h-full" style={{ width: `${neuPct}%` }}></div>
            <div className="bg-rose-500 h-full" style={{ width: `${negPct}%` }}></div>
          </div>
        </div>

        {/* KPI 4: Most Negative Aspect (Alert) */}
        <div className="rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm dark:shadow-md hover:border-rose-500/40 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-mono">Top Friction Aspect</span>
            <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-lg font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-tight block truncate font-mono">
              {mostNegativeAspect}
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 block mt-0.5">
              Primary driver of negative reviews
            </span>
          </div>
          <div className="mt-2 text-[11px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 font-mono">
            <TrendingDown className="w-3.5 h-3.5" /> Requires engineering triage
          </div>
        </div>
      </div>

      {/* Second Row: Aspect Discussed + Trending Topic Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm dark:shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono font-bold uppercase tracking-wider">Most Discussed Feature Aspect</span>
              <h4 className="text-lg font-extrabold text-zinc-950 dark:text-white capitalize">{mostDiscussedAspect}</h4>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('absa')}
            className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-bold flex items-center gap-1 font-mono cursor-pointer"
          >
            Explore ABSA <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-5 shadow-sm dark:shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono font-bold uppercase tracking-wider">Trending Customer Concern</span>
              <h4 className="text-lg font-extrabold text-zinc-950 dark:text-white truncate max-w-xs">{trendingTopic?.business_label || 'Battery Performance'}</h4>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('topics')}
            className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-bold flex items-center gap-1 font-mono cursor-pointer"
          >
            Topic Clusters <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Aspect Sentiment Breakdown */}
        <div className="lg:col-span-2 rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm dark:shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-zinc-950 dark:text-white tracking-tight">Aspect-Based Sentiment Distribution</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Extracted mentions categorized into positive, neutral, and negative sentiment</p>
            </div>
            <button
              onClick={() => onNavigate('absa')}
              className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-bold flex items-center gap-1 font-mono cursor-pointer"
            >
              Full Breakdown <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aspectChartData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} horizontal={false} />
                <XAxis type="number" stroke={axisStroke} fontSize={11} />
                <YAxis dataKey="name" type="category" stroke={axisStroke} fontSize={12} tickLine={false} width={85} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="Positive" stackId="a" fill="#10b981" />
                <Bar dataKey="Neutral" stackId="a" fill="#71717a" />
                <Bar dataKey="Negative" stackId="a" fill="#f43f5e" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Overall Sentiment Donut + Rating Breakdown */}
        <div className="rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm dark:shadow-lg space-y-4 flex flex-col justify-between">
          <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <h3 className="text-base font-extrabold text-zinc-950 dark:text-white tracking-tight">Rating & Sentiment Alignment</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Star ratings distribution across catalog</p>
          </div>

          {/* Star Ratings Mini Bars */}
          <div className="space-y-3">
            {ratingCounts.reverse().map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1 text-zinc-800 dark:text-zinc-300">
                    <span className="text-amber-500 font-bold">{5 - idx} ★</span>
                  </div>
                  <span className="text-zinc-500 dark:text-zinc-400 font-semibold">{item.count} rev ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-amber-500' : idx === 2 ? 'bg-orange-500' : idx === 3 ? 'bg-rose-400' : 'bg-rose-600'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Verified Buyer Integrity:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">{verifiedPct}% Confirmed</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Sentiment Timeline + Recent High-Impact Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Timeline Area Chart */}
        <div className="rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm dark:shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-zinc-950 dark:text-white tracking-tight">Review Volume & Sentiment Over Time</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Temporal trajectory of customer feedback</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-mono font-bold">
              Timeline View
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="posGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="negGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                <XAxis dataKey="date" stroke={axisStroke} fontSize={10} />
                <YAxis stroke={axisStroke} fontSize={10} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="positive" stroke="#10b981" fillOpacity={1} fill="url(#posGrad)" name="Positive" />
                <Area type="monotone" dataKey="negative" stroke="#ef4444" fillOpacity={1} fill="url(#negGrad)" name="Negative" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Representative Verbatim Stream */}
        <div className="rounded-xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm dark:shadow-lg space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-zinc-950 dark:text-white tracking-tight">Recent High-Signal Feedback</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Sample of incoming reviews with detected aspects</p>
            </div>
            <button
              onClick={() => onNavigate('explorer')}
              className="text-xs text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-bold flex items-center gap-1 font-mono cursor-pointer"
            >
              View All ({reviews.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
            {reviews.slice(0, 3).map((rev) => (
              <div key={rev.review_id} className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-950 dark:text-white truncate max-w-[160px]">{rev.product_name}</span>
                    <span className="text-amber-500 dark:text-amber-400 font-mono font-bold">{rev.rating} ★</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase ${
                    rev.sentiment === 'positive' ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30' :
                    rev.sentiment === 'negative' ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30' :
                    'bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700'
                  }`}>
                    {rev.sentiment} ({(rev.sentiment_confidence * 100).toFixed(0)}%)
                  </span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 line-clamp-2 italic leading-relaxed">
                  "{rev.review_text}"
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {rev.aspects.map((asp, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-zinc-900 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-mono font-semibold">
                      #{asp.aspect} ({asp.sentiment})
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

