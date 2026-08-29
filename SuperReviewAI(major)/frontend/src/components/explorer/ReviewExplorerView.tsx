import React, { useState, useRef } from 'react';
import { 
  FileText, 
  UploadCloud, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle, 
  Star, 
  ShieldCheck, 
  ExternalLink, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  RefreshCw, 
  FileSpreadsheet, 
  Layers, 
  Terminal,
  Download
} from 'lucide-react';
import { DataQualityReport, Review } from '../../types';
import { validateAndNormalizeDataset } from '../../utils/nlpEngine';
import { parseDatasetContent } from '../../utils/datasetImporter';

interface ReviewExplorerViewProps {
  reviews: Review[];
  qualityReport: DataQualityReport;
  onUploadDataset: (newReviews: Review[], report: DataQualityReport) => void;
  onOpenTesterWithText: (text: string) => void;
}

export const ReviewExplorerView: React.FC<ReviewExplorerViewProps> = ({
  reviews,
  qualityReport,
  onUploadDataset,
  onOpenTesterWithText
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('ALL');
  const [selectedSentiment, setSelectedSentiment] = useState('ALL');
  const [selectedRating, setSelectedRating] = useState('ALL');
  const [selectedAspect, setSelectedAspect] = useState('ALL');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showValidationLogs, setShowValidationLogs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract distinct products and aspects for filter dropdowns
  const distinctProducts = Array.from(new Set(reviews.map(r => r.product_name)));
  const distinctAspects = Array.from(new Set(reviews.flatMap(r => r.aspects.map(a => a.aspect))));

  // Filter reviews
  const filteredReviews = reviews.filter(rev => {
    const matchesSearch = 
      rev.review_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rev.review_title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProduct = selectedProduct === 'ALL' || rev.product_name === selectedProduct;
    const matchesSentiment = selectedSentiment === 'ALL' || rev.sentiment === selectedSentiment;
    const matchesRating = selectedRating === 'ALL' || rev.rating.toString() === selectedRating;
    const matchesAspect = selectedAspect === 'ALL' || rev.aspects.some(a => a.aspect === selectedAspect);

    return matchesSearch && matchesProduct && matchesSentiment && matchesRating && matchesAspect;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const paginatedReviews = filteredReviews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Handle CSV file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;

      try {
        const parsedRecords = parseDatasetContent(content, file.name);
        if (parsedRecords.length === 0) return;

        // Map common alternative column names to canonical schema
        parsedRecords.forEach(record => {
          if (!record.review_text && (record.text || record.content || record.review || record.body)) {
            record.review_text = record.text || record.content || record.review || record.body;
          }
          if (!record.rating && (record.stars || record.score)) {
            record.rating = Number(record.stars || record.score);
          }
          if (!record.product_name && (record.product || record.item)) {
            record.product_name = record.product || record.item;
          }
          if (!record.product_name && (record.business_name || record.business || record.venue)) {
            record.product_name = record.business_name || record.business || record.venue;
          }
        });

        const { reviews: newReviews, report: newReport } = validateAndNormalizeDataset(parsedRecords);
        onUploadDataset(newReviews, newReport);
        setCurrentPage(1);
      } catch {
        return;
      }
    };
    reader.readAsText(file);
  };

  // Export current filtered dataset to JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredReviews, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `customer_reviews_normalized_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12 transition-colors duration-150">
      {/* Header & CSV Ingestion Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Review Ingestion, Validation & Schema Normalization
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ingest reviews from any business or venue via CSV, with automatic sentiment, service, and quality analysis.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept=".csv,.txt,.json" 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-2xs transition flex items-center gap-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload CSV Dataset</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs transition flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Data Quality Report Banner */}
      <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center font-bold text-base font-mono">
              {qualityReport.quality_score}%
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Data Quality & Validation Health</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono font-semibold">
                  Schema Passed
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Validated canonical fields: review_id, business, text, rating, date, aspects. Confidential identifiers are abstracted.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-center sm:text-right">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">VALID RECORDS</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{qualityReport.valid_records} / {qualityReport.total_records}</span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">DUPLICATES DETECTED</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">{qualityReport.duplicates_detected}</span>
            </div>
            <div className="text-center sm:text-right">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px]">AVG CHAR LENGTH</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold">{qualityReport.avg_character_length} chars</span>
            </div>
            <button
              onClick={() => setShowValidationLogs(!showValidationLogs)}
              className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline font-sans font-medium"
            >
              {showValidationLogs ? 'Hide Logs' : 'View Audit Logs'}
            </button>
          </div>
        </div>

        {/* Validation logs accordion */}
        {showValidationLogs && (
          <div className="mt-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300 max-h-36 overflow-y-auto space-y-1">
            <div className="text-orange-600 dark:text-orange-400 font-semibold mb-1">--- Validation & Preprocessing Audit Logs ---</div>
            {qualityReport.validation_logs.length > 0 ? (
              qualityReport.validation_logs.map((log, idx) => (
                <div key={idx} className="text-slate-600 dark:text-slate-400">• {log}</div>
              ))
            ) : (
              <div className="text-emerald-600 dark:text-emerald-400">✓ All incoming records passed strict canonical schema validation with zero malformed entries.</div>
            )}
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by keyword, product name, or phrase..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          {/* Product Filter */}
          <div>
            <select
              value={selectedProduct}
              onChange={(e) => { setSelectedProduct(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
            >
              <option value="ALL">All Businesses ({distinctProducts.length})</option>
              {distinctProducts.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Sentiment Filter */}
          <div>
            <select
              value={selectedSentiment}
              onChange={(e) => { setSelectedSentiment(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
            >
              <option value="ALL">All Sentiments</option>
              <option value="positive">Positive Only</option>
              <option value="neutral">Neutral Only</option>
              <option value="negative">Negative Only</option>
            </select>
          </div>

          {/* Aspect Filter */}
          <div>
            <select
              value={selectedAspect}
              onChange={(e) => { setSelectedAspect(e.target.value); setCurrentPage(1); }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
            >
              <option value="ALL">All Extracted Aspects ({distinctAspects.length})</option>
              {distinctAspects.map((asp, idx) => (
                <option key={idx} value={asp}>Aspect: {asp}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>Showing {filteredReviews.length} matching reviews</span>
          {(searchTerm || selectedProduct !== 'ALL' || selectedSentiment !== 'ALL' || selectedAspect !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedProduct('ALL');
                setSelectedSentiment('ALL');
                setSelectedRating('ALL');
                setSelectedAspect('ALL');
                setCurrentPage(1);
              }}
              className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Review Cards / Data Table */}
      <div className="space-y-3">
        {paginatedReviews.length === 0 ? (
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-500 dark:text-slate-400 shadow-xs">
            <p className="text-sm">No customer reviews match your active filter criteria.</p>
          </div>
        ) : (
          paginatedReviews.map((rev) => (
            <div 
              key={rev.review_id}
              onClick={() => setSelectedReview(rev)}
              className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-4 transition shadow-xs cursor-pointer space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.product_name}</span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <div className="flex items-center text-amber-500 font-mono text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-700'}`} />
                    ))}
                  </div>
                  {rev.verified_purchase && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-2.5 h-2.5" /> Verified
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    rev.sentiment === 'positive' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                    rev.sentiment === 'negative' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                    'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}>
                    {rev.sentiment} ({(rev.sentiment_confidence * 100).toFixed(0)}%)
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">{rev.review_date}</span>
                </div>
              </div>

              {/* Title & Body */}
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{rev.review_title}</h4>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  "{rev.review_text}"
                </p>
              </div>

              {/* Extracted Aspects Tags */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap gap-1.5">
                  {rev.aspects.map((asp, idx) => (
                    <span 
                      key={idx} 
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono flex items-center gap-1 ${
                        asp.sentiment === 'positive' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                        asp.sentiment === 'negative' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="font-bold">#{asp.aspect}:</span> {asp.sentiment} ({(asp.confidence * 100).toFixed(0)}%)
                    </span>
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3">
                  <span>Source: <strong className="text-slate-700 dark:text-slate-300">{rev.source}</strong></span>
                  <span>ID: <code className="text-orange-600 dark:text-orange-400 font-mono font-medium">{rev.review_id}</code></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2">
        <span>Page {currentPage} of {totalPages}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 shadow-2xs transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-200 shadow-2xs transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Review Detail Modal Drawer */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-xl relative text-slate-900 dark:text-white">
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 right-4 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 font-mono text-[10px] font-semibold">
                  {selectedReview.review_id}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{selectedReview.category}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedReview.product_name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 font-medium">{selectedReview.review_title}</p>
            </div>

            {/* Dual Representation (Raw vs ML Cleaned) */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Raw Customer Text:</span>
                <div className="mt-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 leading-relaxed">
                  "{selectedReview.review_text}"
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">ML-Cleaned Normalized Representation:</span>
                <div className="mt-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                  {selectedReview.cleaned_text}
                </div>
              </div>

              {/* Preprocessed Token List */}
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tokenization & Stem/Stopword Pruning ({selectedReview.tokens.length} tokens):</span>
                <div className="mt-1.5 flex flex-wrap gap-1 max-h-24 overflow-y-auto p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  {selectedReview.tokens.map((token, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 text-orange-700 dark:text-orange-300 border border-slate-200 dark:border-slate-700 font-mono">
                      {token}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Detected Aspects & Spans */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Extracted Aspect Spans & Sentiment Confidence:</span>
              <div className="mt-2 space-y-2">
                {selectedReview.aspects.length > 0 ? (
                  selectedReview.aspects.map((asp, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white uppercase font-mono">{asp.aspect}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            asp.sentiment === 'positive' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                            asp.sentiment === 'negative' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                            'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          }`}>
                            {asp.sentiment} ({(asp.confidence * 100).toFixed(0)}% conf)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 italic">
                          Evidence: "{asp.evidence}"
                        </p>
                      </div>
                      {asp.span && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                          Span: [{asp.span[0]}:{asp.span[1]}]
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">No specific aspect keyword matched in taxonomy.</p>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">Verified: {selectedReview.verified_purchase ? 'Yes' : 'No'} | Helpful: {selectedReview.helpful_votes} votes</span>
              <button
                onClick={() => {
                  onOpenTesterWithText(selectedReview.review_text);
                  setSelectedReview(null);
                }}
                className="px-3.5 py-1.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition shadow-2xs flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Test in Live Model Sandbox</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
