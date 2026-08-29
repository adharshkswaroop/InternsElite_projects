import React, { useState } from 'react';
import { 
  GitBranch, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Sparkles, 
  Zap, 
  Clock, 
  HardDrive, 
  Code, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  TrendingUp, 
  ArrowRight 
} from 'lucide-react';
import { MLModelBenchmark } from '../../types';
import { ML_MODEL_BENCHMARKS } from '../../data/mockDataset';

export const ModelRegistryView: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('distilbert-base-uncased-v2');
  const [copied, setCopied] = useState(false);

  const selectedModel = ML_MODEL_BENCHMARKS.find(m => m.id === selectedModelId) || ML_MODEL_BENCHMARKS[0];

  const handleCopyMetricsJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(ML_MODEL_BENCHMARKS, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(ML_MODEL_BENCHMARKS, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `sentiment_metrics.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12 transition-colors duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            MLflow Model Registry & Benchmark Leaderboard
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Staged evaluation of baseline models (TF-IDF + LR/RF/XGBoost) against transformer architectures (DistilBERT/RoBERTa).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMetricsJSON}
            className="px-3 py-1.5 rounded-md bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-300 dark:border-slate-700 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />}
            <span>Copy Metrics JSON</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download metrics.json</span>
          </button>
        </div>
      </div>

      {/* Model Benchmark Leaderboard Table */}
      <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Verified Evaluation Metrics Matrix
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Stratified 80/10/10 Split</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-mono uppercase text-[10px] border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4">Model & Architecture</th>
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Accuracy</th>
                <th className="py-3 px-3">Macro F1</th>
                <th className="py-3 px-3">Weighted F1</th>
                <th className="py-3 px-3">Latency (CPU)</th>
                <th className="py-3 px-3">Model Size</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              {ML_MODEL_BENCHMARKS.map((m) => {
                const isSelected = selectedModelId === m.id;
                return (
                  <tr 
                    key={m.id}
                    onClick={() => setSelectedModelId(m.id)}
                    className={`cursor-pointer transition ${
                      isSelected 
                        ? 'bg-orange-50/80 dark:bg-orange-950/40 text-slate-900 dark:text-white font-medium'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {m.name}
                        {m.status === 'production' && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">{m.id}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        m.category === 'Transformer' ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {m.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-900 dark:text-white font-bold">{(m.accuracy * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-orange-600 dark:text-orange-400 font-bold">{(m.macro_f1 * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-amber-600 dark:text-amber-400 font-bold">{(m.weighted_f1 * 100).toFixed(1)}%</td>
                    <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400">{m.inference_latency_ms} ms</td>
                    <td className="py-3.5 px-3 text-slate-500 dark:text-slate-400">{m.model_size_mb} MB</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${
                        m.status === 'production' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                        m.status === 'staging' ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Model Detailed Diagnostic & Confusion Matrix */}
      {selectedModel && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Architecture & Features Details */}
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 font-bold uppercase">Model Specification</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedModel.name}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono uppercase ${
                selectedModel.status === 'production' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}>
                {selectedModel.status}
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedModel.description}
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-semibold">ARCHITECTURE:</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedModel.architecture}</span>
              </div>

              <div className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-semibold">FEATURE EXTRACTION PIPELINE:</span>
                <span className="text-slate-800 dark:text-slate-200">{selectedModel.features_used}</span>
              </div>
            </div>

            {/* MLOps Staging Promotion Stepper */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                MLOps Model Lifecycle Stage
              </span>
              <div className="grid grid-cols-5 gap-1.5 text-center text-[10px] font-mono font-bold">
                <div className="p-1.5 rounded-md bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">1. Training</div>
                <div className="p-1.5 rounded-md bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">2. Validated</div>
                <div className="p-1.5 rounded-md bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">3. Registered</div>
                <div className="p-1.5 rounded-md bg-orange-50 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">4. Approved</div>
                <div className={`p-1.5 rounded-md ${
                  selectedModel.status === 'production' ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                }`}>5. Production</div>
              </div>
            </div>
          </div>

          {/* Interactive 3x3 Confusion Matrix */}
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 font-bold uppercase">Evaluation Diagnostics</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">3-Class Confusion Matrix</h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Holdout Test Set</span>
            </div>

            {/* Matrix Visualizer */}
            <div className="space-y-2">
              <div className="text-center text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase font-mono">
                Predicted Sentiment
              </div>

              <div className="grid grid-cols-4 gap-1.5 text-xs font-mono text-center">
                {/* Header Row */}
                <div></div>
                <div className="p-2 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-md border border-emerald-200 dark:border-emerald-800">Positive</div>
                <div className="p-2 font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">Neutral</div>
                <div className="p-2 font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 rounded-md border border-rose-200 dark:border-rose-800">Negative</div>

                {/* Row 1: Actual Positive */}
                <div className="p-2 font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 rounded-md border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
                  Act. Pos
                </div>
                <div className="p-3 bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-100 font-bold rounded-md border border-emerald-300 dark:border-emerald-700">
                  {selectedModel.confusion_matrix.matrix[0][0]}
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700">
                  {selectedModel.confusion_matrix.matrix[0][1]}
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700">
                  {selectedModel.confusion_matrix.matrix[0][2]}
                </div>

                {/* Row 2: Actual Neutral */}
                <div className="p-2 font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  Act. Neu
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700">
                  {selectedModel.confusion_matrix.matrix[1][0]}
                </div>
                <div className="p-3 bg-orange-100/90 dark:bg-orange-900/60 text-orange-900 dark:text-orange-100 font-bold rounded-md border border-orange-300 dark:border-orange-700">
                  {selectedModel.confusion_matrix.matrix[1][1]}
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700">
                  {selectedModel.confusion_matrix.matrix[1][2]}
                </div>

                {/* Row 3: Actual Negative */}
                <div className="p-2 font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 rounded-md border border-rose-200 dark:border-rose-800 flex items-center justify-center">
                  Act. Neg
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700">
                  {selectedModel.confusion_matrix.matrix[2][0]}
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700">
                  {selectedModel.confusion_matrix.matrix[2][1]}
                </div>
                <div className="p-3 bg-rose-100/90 dark:bg-rose-900/60 text-rose-900 dark:text-rose-100 font-bold rounded-md border border-rose-300 dark:border-rose-700">
                  {selectedModel.confusion_matrix.matrix[2][2]}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Macro F1: <strong className="text-slate-900 dark:text-white">{(selectedModel.macro_f1 * 100).toFixed(1)}%</strong></span>
              <span>Weighted F1: <strong className="text-slate-900 dark:text-white">{(selectedModel.weighted_f1 * 100).toFixed(1)}%</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

