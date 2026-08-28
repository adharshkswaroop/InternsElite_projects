import React, { useRef, useState } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Terminal, 
  Database, 
  Activity, 
  FileSpreadsheet, 
  Layers,
  Cpu,
  Sun,
  Moon,
  Flame,
  Workflow,
  UploadCloud,
  Link2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { DataQualityReport, Review } from '../../types';
import { validateAndNormalizeDataset } from '../../utils/nlpEngine';
import { parseDatasetContent } from '../../utils/datasetImporter';

interface NavbarProps {
  currentDatasetName: string;
  onSelectDataset: (name: string) => void;
  reviewCount: number;
  qualityScore: number;
  onOpenTester: () => void;
  onOpenReport: () => void;
  onUploadDataset: (reviews: Review[], report: DataQualityReport) => void;
  onOpenLifecycle?: () => void;
  activeView: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentDatasetName,
  onSelectDataset,
  reviewCount,
  qualityScore,
  onOpenTester,
  onOpenReport,
  onUploadDataset,
  onOpenLifecycle
}) => {
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [datasetUrl, setDatasetUrl] = useState('');
  const [datasetStatus, setDatasetStatus] = useState('');

  const importDataset = (content: string, filename: string) => {
    const records = parseDatasetContent(content, filename);
    if (records.length === 0) throw new Error('No review records found.');
    const { reviews, report } = validateAndNormalizeDataset(records);
    if (reviews.length === 0) throw new Error('No valid review records found.');
    onUploadDataset(reviews, report);
    setDatasetStatus(`${reviews.length} reviews loaded`);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importDataset(reader.result as string, file.name);
      } catch (error) {
        setDatasetStatus(error instanceof Error ? error.message : 'Unable to read dataset.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleLinkDataset = async () => {
    if (!datasetUrl.trim()) return;
    setDatasetStatus('Loading dataset...');
    try {
      const response = await fetch(datasetUrl.trim());
      if (!response.ok) throw new Error(`Dataset request failed (${response.status}).`);
      const filename = new URL(datasetUrl.trim()).pathname;
      importDataset(await response.text(), filename);
    } catch (error) {
      setDatasetStatus(error instanceof Error ? error.message : 'Unable to load dataset link.');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-black px-4 lg:px-6 py-3 flex items-center justify-between shadow-md dark:shadow-2xl transition-colors duration-150">
      {/* Brand Identity */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 flex items-center justify-center text-zinc-950 shadow-[0_0_18px_rgba(255,119,0,0.5)] shrink-0">
          <Flame className="h-5 w-5 text-black fill-black" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-zinc-950 dark:text-white tracking-tight font-sans">
              SUPER VIEW <span className="text-orange-500 dark:text-orange-400 font-black">AI</span>
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium hidden sm:block">
            Enterprise ABSA • 2D Vector Discovery • MLOps Telemetry • LLM Root-Cause
          </p>
        </div>
      </div>

      {/* Dataset & Engine Controls */}
      <div className="flex items-center gap-2.5">
        {/* Dataset Switcher Dropdown */}
        <div className="hidden md:flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 shadow-inner">
          <Database className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400 mr-2 shrink-0" />
          <span className="text-zinc-500 dark:text-zinc-400 mr-1.5 font-medium">Dataset:</span>
          <select 
            value={currentDatasetName}
            onChange={(e) => onSelectDataset(e.target.value)}
            className="bg-transparent text-zinc-900 dark:text-white font-semibold focus:outline-none cursor-pointer pr-1"
          >
            <option value="amazon" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Amazon Reviews</option>
            <option value="tech" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Demo Consumer Tech (20 rev)</option>
            <option value="audio" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Audio & ANC Headsets (4 rev)</option>
            <option value="smart_home" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Smart Home & IoT (2 rev)</option>
          </select>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.txt,.json"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold transition cursor-pointer"
          title="Upload a CSV or JSON customer review dataset"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Upload Dataset</span>
        </button>
        <div className="hidden lg:flex items-center gap-1">
          <input
            type="url"
            value={datasetUrl}
            onChange={(event) => setDatasetUrl(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') void handleLinkDataset(); }}
            placeholder="Dataset URL"
            aria-label="Dataset URL"
            className="w-32 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-[11px] text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={() => void handleLinkDataset()}
            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 cursor-pointer"
            title="Load a CSV or JSON dataset from a URL"
            aria-label="Load dataset from URL"
          >
            <Link2 className="w-3.5 h-3.5" />
          </button>
        </div>
        {datasetStatus && <span className="hidden xl:inline text-[10px] text-zinc-500 dark:text-zinc-400 max-w-28 truncate" title={datasetStatus}>{datasetStatus}</span>}

        {/* Dataset Quality Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"></span>
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">Records:</span>
          <span className="font-bold text-zinc-900 dark:text-white">{reviewCount}</span>
          <span className="text-zinc-400 dark:text-zinc-700">|</span>
          <span className="text-zinc-500 dark:text-zinc-400 font-medium">Quality:</span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{qualityScore}%</span>
        </div>

        {/* Model Engine Status */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-orange-500/30 text-xs text-orange-800 dark:text-orange-300 font-mono font-medium">
          <Cpu className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
          <span>DistilBERT (CPU 18.4ms)</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-300 dark:border-zinc-700 transition shadow-xs flex items-center justify-center cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-orange-400 animate-in fade-in zoom-in duration-200" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-800 animate-in fade-in zoom-in duration-200" />
          )}
        </button>

        {/* Action Buttons */}
        <button
          onClick={onOpenTester}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition border border-zinc-300 dark:border-zinc-700 shadow-xs cursor-pointer"
          title="Test NLP Model on any text in real-time"
        >
          <Terminal className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" />
          <span>Live Tester</span>
        </button>

        <button
          onClick={onOpenReport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:brightness-110 text-zinc-950 text-xs font-black transition shadow-[0_0_15px_rgba(255,119,0,0.4)] cursor-pointer"
          title="Generate AI Executive Business Intelligence Report"
        >
          <Sparkles className="w-3.5 h-3.5 text-zinc-950 fill-black" />
          <span>Generate AI Insights</span>
        </button>
      </div>
    </header>
  );
};

