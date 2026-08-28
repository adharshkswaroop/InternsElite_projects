import React from 'react';
import { 
  Compass,
  LayoutDashboard, 
  FileText, 
  Target, 
  MessageSquareQuote, 
  Smile, 
  Layers, 
  Search, 
  Sparkles, 
  Terminal, 
  GitBranch, 
  Activity,
  Flame,
  ChevronRight
} from 'lucide-react';

export type NavView = 
  | 'lifecycle'
  | 'overview'
  | 'explorer'
  | 'absa'
  | 'topics'
  | 'sentiment'
  | 'products'
  | 'search'
  | 'ai_insights'
  | 'tester'
  | 'mlops'
  | 'telemetry';

interface SidebarProps {
  activeView: NavView;
  onSelectView: (view: NavView) => void;
  reviewCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  reviewCount
}) => {
  const navSections = [
    {
      title: "Core Analytics",
      items: [
        { id: 'overview', label: 'Executive Dashboard', icon: LayoutDashboard, badge: 'KPIs' },
        { id: 'explorer', label: 'Review Explorer & ETL', icon: FileText, count: reviewCount },
        { id: 'absa', label: 'Aspect-Based Sentiment', icon: Target, badge: 'ABSA' },
        { id: 'topics', label: 'Topic Discovery', icon: MessageSquareQuote, badge: 'BERTopic' },
        { id: 'sentiment', label: 'Sentiment & Alignment', icon: Smile },
        { id: 'products', label: 'Product Benchmarking', icon: Layers },
      ]
    },
    {
      title: "Intelligence & Search",
      items: [
        { id: 'search', label: 'Semantic Vector Search', icon: Search, badge: 'FAISS' },
        { id: 'ai_insights', label: 'AI Business Intelligence', icon: Sparkles, badge: 'LLM' },
        { id: 'tester', label: 'Live Model Sandbox', icon: Terminal, badge: 'Realtime' },
      ]
    },
    {
      title: "MLOps & Telemetry",
      items: [
        { id: 'mlops', label: 'Model Registry & Metrics', icon: GitBranch, badge: 'MLflow' },
        { id: 'telemetry', label: 'Telemetry & Health', icon: Activity, badge: 'Prometheus' },
      ]
    }
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black p-4 flex flex-col justify-between hidden md:flex sticky top-0 h-[calc(100vh-61px)] overflow-hidden transition-colors duration-150 shadow-sm dark:shadow-none">
      <div className="space-y-5">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 dark:text-zinc-500 font-mono">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                const isHighlight = (item as any).highlight;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectView(item.id as NavView)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-black shadow-[0_0_15px_rgba(255,119,0,0.4)] font-black' 
                        : isHighlight
                        ? 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border border-orange-500/40 hover:bg-orange-500/20'
                        : 'text-zinc-700 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${
                        isActive 
                          ? 'text-black stroke-[2.5]' 
                          : isHighlight
                          ? 'text-orange-600 dark:text-orange-400'
                          : 'text-zinc-500 dark:text-zinc-400'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          isActive 
                            ? 'bg-black text-orange-400' 
                            : isHighlight
                            ? 'bg-orange-500/20 text-orange-900 dark:text-orange-300 border border-orange-500/40'
                            : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.count !== undefined && (
                        <span className={`text-[11px] font-mono font-bold ${isActive ? 'text-black' : 'text-zinc-500 dark:text-zinc-400'}`}>
                          {item.count}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status Card in Saffron-Black Obsidian */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-900/90 border border-amber-500/30 space-y-2.5 shadow-sm dark:shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-200 font-mono">INFERENCE ENGINE</span>
            </div>
            <span className="text-[9px] font-mono text-zinc-950 bg-amber-400 px-1.5 py-0.5 rounded font-black">ONLINE</span>
          </div>
          <div className="text-[10px] text-zinc-600 dark:text-zinc-400 space-y-1 font-mono">
            <div className="flex justify-between">
              <span>DistilBERT (CPU):</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">18.4 ms</span>
            </div>
            <div className="flex justify-between">
              <span>FAISS Vector Index:</span>
              <span className="text-zinc-900 dark:text-zinc-200 font-semibold">128-d / L2</span>
            </div>
            <div className="flex justify-between">
              <span>Model Drift:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">0.042 (Safe)</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
