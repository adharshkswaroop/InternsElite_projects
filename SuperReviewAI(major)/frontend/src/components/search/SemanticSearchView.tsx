import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Sliders, 
  Star, 
  ExternalLink, 
  Layers, 
  Zap, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Review, SemanticSearchResult } from '../../types';
import { cosineSimilarity, generateDenseEmbedding } from '../../utils/nlpEngine';

interface SemanticSearchViewProps {
  reviews: Review[];
  onOpenTesterWithText: (text: string) => void;
}

export const SemanticSearchView: React.FC<SemanticSearchViewProps> = ({
  reviews,
  onOpenTesterWithText
}) => {
  const [query, setQuery] = useState('complaints about battery draining fast after charging');
  const [similarityThreshold, setSimilarityThreshold] = useState(0.40);
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState('ALL');

  const presetQueries = [
    'battery dying fast after a few hours',
    'terrible customer service and broken RMA refund',
    'stunning OLED screen brightness and color accuracy',
    'mobile companion app crashes and freezing Bluetooth',
    'fast shipping and well packaged undamaged box'
  ];

  // Perform vector search
  const searchResults: SemanticSearchResult[] = useMemo(() => {
    if (!query.trim()) return [];

    const queryEmbedding = generateDenseEmbedding(query);

    const scored = reviews.map(review => {
      const reviewEmbedding = review.embedding || generateDenseEmbedding(review.review_text);
      const similarity = cosineSimilarity(queryEmbedding, reviewEmbedding);

      // Find matched aspects
      const matchedAspects = review.aspects
        .filter(a => query.toLowerCase().includes(a.aspect.toLowerCase()))
        .map(a => a.aspect);

      return {
        review,
        similarity_score: similarity,
        matched_aspects: matchedAspects.length > 0 ? matchedAspects : review.aspects.map(a => a.aspect).slice(0, 2),
        highlight_snippet: review.review_text
      };
    });

    return scored
      .filter(res => res.similarity_score >= similarityThreshold)
      .filter(res => selectedSentimentFilter === 'ALL' || res.review.sentiment === selectedSentimentFilter)
      .sort((a, b) => b.similarity_score - a.similarity_score);
  }, [query, similarityThreshold, selectedSentimentFilter, reviews]);

  return (
    <div className="space-y-6 pb-12 transition-colors duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Search className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Semantic Embedding & Vector Search (FAISS/Sentence-Transformers)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Retrieve customer feedback by conceptual intent and meaning rather than strict keyword matching.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 font-semibold">
            Vector Store: 128-dim Dense Index
          </span>
        </div>
      </div>

      {/* Query Bar Card */}
      <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type any natural language query (e.g. 'unhelpful support representatives during return')..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg pl-11 pr-28 py-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition"
          />
          <button
            onClick={() => setQuery(query)}
            className="absolute right-2 top-2 px-4 py-1.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition shadow-2xs cursor-pointer"
          >
            Vector Search
          </button>
        </div>

        {/* Preset Query Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Suggested queries:
          </span>
          {presetQueries.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(preset)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition font-medium cursor-pointer"
            >
              "{preset}"
            </button>
          ))}
        </div>

        {/* Threshold & Filters Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Similarity Threshold:</span>
            <input
              type="range"
              min="0.10"
              max="0.80"
              step="0.05"
              value={similarityThreshold}
              onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
              className="w-32 accent-orange-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-orange-600 dark:text-orange-400">
              {(similarityThreshold * 100).toFixed(0)}%
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 dark:text-slate-400 font-medium">Sentiment Filter:</span>
            <select
              value={selectedSentimentFilter}
              onChange={(e) => setSelectedSentimentFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Polarities</option>
              <option value="positive">Positive Only</option>
              <option value="negative">Negative Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1 font-medium">
          <span>Found {searchResults.length} semantically relevant reviews</span>
          <span className="font-mono text-orange-600 dark:text-orange-400 font-semibold">Cosine Distance Ranked</span>
        </div>

        {searchResults.length === 0 ? (
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400 space-y-2 shadow-xs">
            <p className="text-sm">No reviews met the similarity cutoff ({(similarityThreshold * 100).toFixed(0)}%).</p>
            <button
              onClick={() => setSimilarityThreshold(0.20)}
              className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-semibold"
            >
              Lower similarity threshold to 20%
            </button>
          </div>
        ) : (
          searchResults.map((res, idx) => {
            const similarityPct = Math.round(res.similarity_score * 100);
            return (
              <div 
                key={res.review.review_id}
                className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-4 transition shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                      Rank #{idx + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{res.review.product_name}</span>
                    <span className="text-amber-500 text-xs font-mono">({res.review.rating} ★)</span>
                  </div>

                  {/* Similarity Score Badge */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 font-mono text-xs font-bold">
                      <Zap className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                      <span>{similarityPct}% Match</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                      res.review.sentiment === 'positive' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                      res.review.sentiment === 'negative' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}>
                      {res.review.sentiment}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed italic bg-slate-50 dark:bg-slate-800/60 p-3 rounded-md border border-slate-200 dark:border-slate-700/80">
                  "{res.review.review_text}"
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <div className="flex flex-wrap gap-1">
                    {res.review.aspects.map((a, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-mono">
                        #{a.aspect}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => onOpenTesterWithText(res.review.review_text)}
                    className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    Examine in NLP Sandbox <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

