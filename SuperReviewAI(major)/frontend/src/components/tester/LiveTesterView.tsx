import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Zap, 
  Smile, 
  Frown, 
  Meh, 
  Target, 
  Cpu, 
  Hash, 
  ArrowRight 
} from 'lucide-react';
import { 
  analyzeSentiment, 
  extractAspects, 
  generateDenseEmbedding, 
  preprocessText 
} from '../../utils/nlpEngine';
import { AspectExtraction, SentimentType } from '../../types';

interface LiveTesterViewProps {
  initialText?: string;
}

export const LiveTesterView: React.FC<LiveTesterViewProps> = ({ initialText }) => {
  const [inputText, setInputText] = useState(
    initialText || "The battery lasts for an amazing 14 hours and the OLED screen is gorgeous, but the customer support was completely unhelpful when my charger arrived with a broken pin."
  );

  const presets = [
    {
      label: "Flagship Laptop Review",
      text: "The battery lasts for an amazing 14 hours and the OLED screen is gorgeous, but the customer support was completely unhelpful when my charger arrived with a broken pin."
    },
    {
      label: "Severe Support & Quality Friction",
      text: "Terrible quality control. The trackpad broke within two weeks and the support agent refused to issue a warranty replacement."
    },
    {
      label: "Audio & Mobile App Bug",
      text: "Sound quality is punchy with great active noise cancelling, but the companion mobile app keeps crashing during Bluetooth pairing."
    },
    {
      label: "Fast Shipping & Packaging",
      text: "Arrived two days early in pristine sealed packaging. Very easy setup and outstanding value for money."
    }
  ];

  useEffect(() => {
    if (initialText) {
      setInputText(initialText);
    }
  }, [initialText]);

  // Run pipeline
  const { cleaned, tokens } = preprocessText(inputText);
  const { sentiment, confidence } = analyzeSentiment(inputText);
  const aspects: AspectExtraction[] = extractAspects(inputText);
  const embedding = generateDenseEmbedding(inputText);

  return (
    <div className="space-y-6 pb-12 transition-colors duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            Live Model Sandbox & Real-Time Inference Tester
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Test and inspect individual customer reviews through every stage of the staged NLP and ABSA pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
            Realtime Client-Side Engine Ready
          </span>
        </div>
      </div>

      {/* Input Text Area & Presets */}
      <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Raw Customer Review Text Input
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">{inputText.length} characters</span>
        </div>

        <textarea
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste or type any customer feedback here..."
          className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:bg-white dark:focus:bg-slate-800 transition font-sans leading-relaxed"
        />

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Test Presets:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setInputText(p.text)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition font-medium cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Pipeline Execution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stage 1 & 2: Preprocessing & Sentiment */}
        <div className="space-y-6">
          {/* Stage 1: Preprocessing & Tokenization */}
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 flex items-center justify-center text-xs font-bold font-mono">1</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Text Cleaning & Tokenization</h3>
              </div>
              <span className="text-[10px] font-mono font-semibold text-orange-600 dark:text-orange-400">{tokens.length} ML Tokens</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold mb-1">Normalized Cleaned String:</span>
                <p className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                  {cleaned || '<empty>'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-semibold mb-1">Filtered Content Tokens (Stopwords Removed):</span>
                <div className="flex flex-wrap gap-1 p-2 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 max-h-24 overflow-y-auto">
                  {tokens.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-orange-700 dark:text-orange-300 border border-slate-200 dark:border-slate-700 font-mono shadow-2xs">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stage 2: Overall Sentiment Polarity */}
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 flex items-center justify-center text-xs font-bold font-mono">2</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sentiment Classification</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Confidence Calibration</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  sentiment === 'positive' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300' :
                  sentiment === 'negative' ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300' :
                  'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {sentiment === 'positive' && <Smile className="w-6 h-6" />}
                  {sentiment === 'negative' && <Frown className="w-6 h-6" />}
                  {sentiment === 'neutral' && <Meh className="w-6 h-6" />}
                </div>
                <div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-mono">Predicted Polarity</span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white uppercase">{sentiment}</h4>
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-xs text-slate-500 dark:text-slate-400 block">MODEL CONFIDENCE</span>
                <span className="text-lg font-bold text-orange-600 dark:text-orange-400">{(confidence * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stage 3 & 4: ABSA Spans & Embeddings */}
        <div className="space-y-6">
          {/* Stage 3: Extracted Aspect Spans */}
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 flex items-center justify-center text-xs font-bold font-mono">3</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Aspect-Based Extractions & Evidence Spans</h3>
              </div>
              <span className="text-[10px] font-mono font-semibold text-orange-600 dark:text-orange-400">{aspects.length} Detected</span>
            </div>

            <div className="space-y-2">
              {aspects.length > 0 ? (
                aspects.map((asp, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white font-mono uppercase">#{asp.aspect}</span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          asp.sentiment === 'positive' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                          asp.sentiment === 'negative' ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                          'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {asp.sentiment}
                        </span>
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">{(asp.confidence * 100).toFixed(0)}% conf</span>
                    </div>
                    <p className="text-[11px] text-slate-700 dark:text-slate-300 italic bg-white dark:bg-slate-900 p-2 rounded-md border border-slate-200 dark:border-slate-700/80 shadow-2xs">
                      "{asp.evidence}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-center text-slate-500 dark:text-slate-400 text-xs">
                  No domain aspect keywords detected in this input snippet.
                </div>
              )}
            </div>
          </div>

          {/* Stage 4: Dense Vector Embedding Preview */}
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300 flex items-center justify-center text-xs font-bold font-mono">4</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Dense Semantic Vector Projection</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">128-Dimension L2 Normalized</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
              <div className="flex flex-wrap gap-1 font-mono text-[9px] text-slate-600 dark:text-slate-300 max-h-24 overflow-y-auto">
                {embedding.slice(0, 32).map((val, idx) => (
                  <span key={idx} className="p-1 rounded bg-white dark:bg-slate-900 text-orange-700 dark:text-orange-300 border border-slate-200 dark:border-slate-700 font-mono shadow-2xs">
                    d{idx}:{val}
                  </span>
                ))}
                <span className="p-1 text-slate-400 dark:text-slate-500">...+96 dimensions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

