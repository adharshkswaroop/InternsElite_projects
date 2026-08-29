import React, { useState } from 'react';
import { 
  Layers, 
  Star, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Award, 
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';
import { ProductComparison, Review } from '../../types';

interface ProductBenchmarkViewProps {
  productComparisons: ProductComparison[];
  reviews: Review[];
}

export const ProductBenchmarkView: React.FC<ProductBenchmarkViewProps> = ({
  productComparisons,
  reviews
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    productComparisons.slice(0, 3).map(p => p.product_id)
  );

  const toggleProduct = (id: string) => {
    if (selectedProductIds.includes(id)) {
      if (selectedProductIds.length > 1) {
        setSelectedProductIds(selectedProductIds.filter(p => p !== id));
      }
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const activeProducts = productComparisons.filter(p => selectedProductIds.includes(p.product_id));

  // Build comparative aspect chart data
  const aspectsList = ['battery', 'display', 'camera', 'quality', 'usability', 'customer support', 'price', 'delivery'];
  const aspectChartData = aspectsList.map(aspect => {
    const row: any = { aspect: aspect.toUpperCase() };
    activeProducts.forEach(p => {
      row[p.product_name] = p.aspect_scores[aspect] ?? 0;
    });
    return row;
  });

  const colors = ['#f97316', '#10b981', '#f59e0b', '#ec4899', '#14b8a6'];

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
            <Layers className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Cross-Product Intelligence & Aspect Benchmarking
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Compare aspect sentiment, customer delight drivers, and return friction across multiple SKUs.
          </p>
        </div>

        {/* Product selector chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-500 dark:text-slate-400 mr-1">Select SKUs:</span>
          {productComparisons.map((p, idx) => {
            const isSelected = selectedProductIds.includes(p.product_id);
            return (
              <button
                key={p.product_id}
                onClick={() => toggleProduct(p.product_id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold transition border shadow-2xs cursor-pointer ${
                  isSelected
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {p.product_name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeProducts.map((prod, idx) => (
          <div key={prod.product_id} className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 font-semibold">
                  {prod.category}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{prod.review_count} Reviews</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-2">{prod.product_name}</h3>

              <div className="mt-3 flex items-center justify-between p-3 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs font-mono">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">AVG RATING</span>
                  <div className="flex items-center gap-1 font-bold text-amber-500 text-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{prod.avg_rating} ★</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">NET SENTIMENT (NSS)</span>
                  <span className={`text-sm font-bold ${
                    prod.net_sentiment_score > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}>
                    {prod.net_sentiment_score > 0 ? `+${prod.net_sentiment_score}` : prod.net_sentiment_score}
                  </span>
                </div>
              </div>
            </div>

            {/* Praise and Complaint Highlights */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-md bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">Top Customer Praise:</span>
                <p className="text-[11px] mt-0.5 italic">"{prod.top_praise}"</p>
              </div>
              <div className="p-2.5 rounded-md bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 text-rose-950 dark:text-rose-200">
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block">Top Complaint Vector:</span>
                <p className="text-[11px] mt-0.5 italic">"{prod.top_complaint}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Side-by-Side Aspect Strengths Comparative Chart */}
      <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Comparative Feature Net Sentiment Scores (-1.0 to +1.0)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Higher score indicates superior customer satisfaction for that specific aspect</p>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">Net Sentiment Scale</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={aspectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
              <XAxis dataKey="aspect" stroke={axisStroke} fontSize={10} />
              <YAxis domain={[-1, 1]} stroke={axisStroke} fontSize={10} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              {activeProducts.map((p, idx) => (
                <Bar key={p.product_id} dataKey={p.product_name} fill={colors[idx % colors.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

