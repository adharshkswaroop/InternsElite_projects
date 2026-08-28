import React from 'react';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Database, 
  Server, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Radio, 
  CheckCircle2, 
  BarChart2,
  Zap,
  Layers,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export const SystemHealthView: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Prometheus time series
  const throughputData = [
    { time: '10:00', rps: 24, latency: 18.2, errors: 0 },
    { time: '10:05', rps: 32, latency: 19.1, errors: 1 },
    { time: '10:10', rps: 45, latency: 21.4, errors: 0 },
    { time: '10:15', rps: 38, latency: 18.9, errors: 0 },
    { time: '10:20', rps: 52, latency: 22.1, errors: 2 },
    { time: '10:25', rps: 41, latency: 19.5, errors: 0 },
    { time: '10:30', rps: 48, latency: 20.2, errors: 0 },
  ];

  const predictionDistribution = [
    { class: 'Positive', count: 1845, share: '62%' },
    { class: 'Neutral', count: 412, share: '14%' },
    { class: 'Negative', count: 719, share: '24%' },
  ];

  const systemLogs = [
    { level: 'INFO', ts: '10:30:14', msg: 'DistilBERT inference batch (size: 64) completed in 18.4ms on CPU thread pool.' },
    { level: 'INFO', ts: '10:29:45', msg: 'FAISS vector index synchronized (128 dimensions, normalized L2 distance).' },
    { level: 'INFO', ts: '10:28:12', msg: 'Data quality check passed: 100% valid records, zero malformed UTF-8 strings.' },
    { level: 'INFO', ts: '10:25:01', msg: 'Prometheus metrics exported on /metrics (HTTP 200 OK).' },
    { level: 'INFO', ts: '10:22:19', msg: 'PostgreSQL connection pool healthy (active: 3, idle: 7, max: 20).' },
    { level: 'INFO', ts: '10:18:40', msg: 'KL Divergence drift check: 0.042 (well below threshold 0.150).' },
  ];

  const services = [
    { name: 'API Gateway (FastAPI)', status: 'Healthy', uptime: '99.98%', latency: '8.2ms', icon: Server },
    { name: 'PostgreSQL Database', status: 'Healthy', uptime: '99.99%', latency: '3.1ms', icon: Database },
    { name: 'ML Inference Service (DistilBERT)', status: 'Healthy', uptime: '99.95%', latency: '18.4ms', icon: Cpu },
    { name: 'Vector Database (FAISS)', status: 'Healthy', uptime: '99.99%', latency: '2.4ms', icon: Layers },
    { name: 'Redis Cache & Queue', status: 'Healthy', uptime: '100.0%', latency: '0.9ms', icon: Zap },
  ];

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
            <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Admin Telemetry, Prometheus Metrics & System Health
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time infrastructure health, inference latencies, data drift tracking, and vector cache stats.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            ALL 5 SERVICES HEALTHY
          </span>
        </div>
      </div>

      {/* Section 19: System Status Badges */}
      <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">System Infrastructure Status</h3>
          <span className="text-[11px] font-mono text-slate-400">Scraped via /healthz</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {services.map((svc, idx) => {
            const Icon = svc.icon;
            return (
              <div key={idx} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[110px]">{svc.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px]">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {svc.status}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">{svc.latency}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 19: System Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>CPU UTILIZATION</span>
            <Cpu className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">32%</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">8 vCPU Cluster</span>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>RAM MEMORY</span>
            <HardDrive className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">61%</div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">9.8 GB / 16 GB</span>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>TOTAL REQUESTS</span>
            <Radio className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 font-mono">12,492</div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-medium">Last 24 hours</span>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>HTTP ERRORS</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-500 font-mono">13</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">0.10% Error Rate</span>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-mono">
            <span>P95 LATENCY</span>
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">84 ms</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">SLA Target: &lt;150ms</span>
        </div>
      </div>

      {/* Latency and Throughput Chart */}
      <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">API Throughput & Latency Trend (Prometheus Scraped)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Scraped every 15s via /metrics endpoint</p>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Window: Last 30 mins</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={throughputData} margin={{ top: 10, right: 20, left: -20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis dataKey="time" stroke={axisStroke} fontSize={11} />
              <YAxis stroke={axisStroke} fontSize={11} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rps" stroke="#2563eb" strokeWidth={2} name="Requests/sec" />
              <Line type="monotone" dataKey="latency" stroke="#0d9488" strokeWidth={2} name="Latency (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: ML Service Health & Live Log Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ML Service Health Card (Section 20) */}
        <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">ML Service Health</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              STABLE
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Requests / minute:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">2,880 req/min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">DistilBERT Inference:</span>
              <span className="font-mono font-bold text-orange-600 dark:text-orange-400">18.4 ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">Inference Error Rate:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0.00%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400">KL Data Drift Score:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0.042 (Safe)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">Prediction Class Distribution:</span>
            <div className="space-y-1.5">
              {predictionDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500 dark:text-slate-400">{item.class}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{item.count} ({item.share})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live System Log Tail */}
        <div className="lg:col-span-2 rounded-lg bg-slate-950 text-slate-200 border border-slate-800 p-5 shadow-xs space-y-3 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                Production Serving Logs & Audit Stream
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Tail
            </span>
          </div>

          <div className="space-y-2 text-[11px] pt-1">
            {systemLogs.map((log, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-500 shrink-0">{log.ts}</span>
                <span className="text-orange-400 font-bold shrink-0">[{log.level}]</span>
                <span className="text-slate-300">{log.msg}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-800 flex items-center justify-between">
            <span>Log Collector: FluentBit / Vector</span>
            <span>Container: feedback-nlp-distilbert:v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
