import React, { useState } from 'react';
import { 
  Database, 
  Cpu, 
  Target, 
  Smile, 
  MessageSquareQuote, 
  Search, 
  Sparkles, 
  Activity, 
  ArrowRight, 
  Play, 
  CheckCircle2, 
  HelpCircle, 
  ChevronRight,
  Info,
  X,
  FileSpreadsheet,
  Workflow,
  Flame
} from 'lucide-react';
import { NavView } from './Sidebar';

interface MLPipelineBarProps {
  activeView: NavView;
  onNavigate: (view: NavView) => void;
  onSelectDataset?: (name: string) => void;
}

export const MLPipelineBar: React.FC<MLPipelineBarProps> = ({
  activeView,
  onNavigate,
  onSelectDataset
}) => {
  const pipelineStages: {
    id: NavView;
    step: number;
    name: string;
    tech: string;
    icon: any;
    desc: string;
  }[] = [
    {
      id: 'explorer',
      step: 1,
      name: 'Data & ETL',
      tech: 'FastAPI / Pydantic',
      icon: Database,
      desc: 'Raw review ingestion, schema normalization, missing value handling & quality scoring.'
    },
    {
      id: 'tester',
      step: 2,
      name: 'Predictions',
      tech: 'DistilBERT / PyTorch',
      icon: Cpu,
      desc: 'Tokenization, subword masking, attention weights, and real-time inference.'
    },
    {
      id: 'absa',
      step: 3,
      name: 'Aspect Extraction',
      tech: 'BIO Tagger / SpaCy',
      icon: Target,
      desc: 'Fine-grained aspect entity extraction across battery, camera, display, support, etc.'
    },
    {
      id: 'sentiment',
      step: 4,
      name: 'Sentiment & Alignment',
      tech: 'VADER / RoBERTa',
      icon: Smile,
      desc: 'Polarity confidence calculation and star-rating vs textual discrepancy detection.'
    },
    {
      id: 'topics',
      step: 5,
      name: 'Topic Discovery',
      tech: 'BERTopic / UMAP',
      icon: MessageSquareQuote,
      desc: 'Unsupervised thematic clustering using c-TF-IDF keyword weights and HDBSCAN.'
    },
    {
      id: 'search',
      step: 6,
      name: 'Semantic Search',
      tech: 'FAISS / all-MiniLM',
      icon: Search,
      desc: '128-dimensional dense vector embeddings with cosine similarity nearest-neighbor lookup.'
    },
    {
      id: 'ai_insights',
      step: 7,
      name: 'Business Insights',
      tech: 'Gemini LLM / Grounding',
      icon: Sparkles,
      desc: 'Evidence-grounded executive summaries, root cause diagnostics, and prioritized actions.'
    },
    {
      id: 'mlops',
      step: 8,
      name: 'Model Monitoring',
      tech: 'MLflow / Prometheus',
      icon: Activity,
      desc: 'Model registry, staging vs production benchmarks, latency tracking, and KL data drift.'
    }
  ];

  return (
    <div className="w-full bg-zinc-950 dark:bg-black text-zinc-100 border-b border-zinc-200 dark:border-zinc-800/80 px-4 py-2.5 shadow-sm dark:shadow-md transition-colors duration-150">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Left: ML Pipeline Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
          <span className="text-xs font-extrabold font-mono tracking-wider text-orange-500 uppercase">
            SUPER VIEW NLP Pipeline
          </span>
        </div>

        {/* Center/Right: Pipeline Stage Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-[11px]">
          {pipelineStages.map((stage, idx) => {
            const isActive = activeView === stage.id;
            return (
              <React.Fragment key={stage.id}>
                <button
                  onClick={() => onNavigate(stage.id)}
                  title={`${stage.name} (${stage.tech}): ${stage.desc}`}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition font-mono whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black shadow-[0_0_12px_rgba(255,119,0,0.45)]'
                      : 'text-zinc-300 dark:text-zinc-400 hover:text-white hover:bg-zinc-850 dark:hover:bg-zinc-900 border border-transparent'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isActive ? 'bg-black text-orange-400' : 'bg-zinc-800 text-zinc-300 dark:text-zinc-400'
                  }`}>
                    {stage.step}
                  </span>
                  <span className="font-sans font-semibold text-xs">{stage.name}</span>
                </button>
                {idx < pipelineStages.length - 1 && (
                  <ChevronRight className="w-3 h-3 text-zinc-600 dark:text-zinc-700 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
