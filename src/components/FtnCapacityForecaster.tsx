import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Cpu,
  HardDrive,
  Activity,
  Layers,
  Sparkles,
  Zap,
  Server,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Terminal,
  Play,
  RotateCcw,
  ArrowRight,
  Database,
  Radio,
  Sliders
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
  Legend
} from 'recharts';
import { cn } from '../utils';

// Historical and predictive data point
interface CapacityPoint {
  day: string;
  isForecast: boolean;
  cpu: number;
  cpuUpper: number;
  ram: number;
  ramUpper: number;
  storage: number;
  storageUpper: number;
  bandwidth: number;
}

const FORECAST_DATA: CapacityPoint[] = [
  { day: 'Day -7', isForecast: false, cpu: 52, cpuUpper: 52, ram: 64, ramUpper: 64, storage: 68, storageUpper: 68, bandwidth: 1.1 },
  { day: 'Day -6', isForecast: false, cpu: 54, cpuUpper: 54, ram: 66, ramUpper: 66, storage: 69, storageUpper: 69, bandwidth: 1.2 },
  { day: 'Day -5', isForecast: false, cpu: 58, cpuUpper: 58, ram: 69, ramUpper: 69, storage: 71, storageUpper: 71, bandwidth: 1.3 },
  { day: 'Day -4', isForecast: false, cpu: 55, cpuUpper: 55, ram: 71, ramUpper: 71, storage: 72, storageUpper: 72, bandwidth: 1.35 },
  { day: 'Day -3', isForecast: false, cpu: 62, cpuUpper: 62, ram: 74, ramUpper: 74, storage: 73, storageUpper: 73, bandwidth: 1.5 },
  { day: 'Day -2', isForecast: false, cpu: 65, cpuUpper: 65, ram: 78, ramUpper: 78, storage: 74, storageUpper: 74, bandwidth: 1.65 },
  { day: 'Day -1', isForecast: false, cpu: 68, cpuUpper: 68, ram: 81, ramUpper: 81, storage: 75, storageUpper: 75, bandwidth: 1.8 },
  { day: 'Today', isForecast: false, cpu: 71, cpuUpper: 71, ram: 84, ramUpper: 84, storage: 76, storageUpper: 76, bandwidth: 1.9 },
  // 14-Day AI Predictive Horizon
  { day: 'Day +2', isForecast: true, cpu: 74, cpuUpper: 77, ram: 87, ramUpper: 89, storage: 78, storageUpper: 80, bandwidth: 2.05 },
  { day: 'Day +4', isForecast: true, cpu: 78, cpuUpper: 82, ram: 91, ramUpper: 94, storage: 80, storageUpper: 83, bandwidth: 2.2 },
  { day: 'Day +6', isForecast: true, cpu: 81, cpuUpper: 86, ram: 95, ramUpper: 98, storage: 82, storageUpper: 85, bandwidth: 2.35 },
  { day: 'Day +8', isForecast: true, cpu: 84, cpuUpper: 89, ram: 98, ramUpper: 100, storage: 84, storageUpper: 87, bandwidth: 2.5 },
  { day: 'Day +10', isForecast: true, cpu: 88, cpuUpper: 93, ram: 100, ramUpper: 100, storage: 86, storageUpper: 90, bandwidth: 2.65 },
  { day: 'Day +12', isForecast: true, cpu: 91, cpuUpper: 96, ram: 100, ramUpper: 100, storage: 88, storageUpper: 92, bandwidth: 2.8 },
  { day: 'Day +14', isForecast: true, cpu: 95, cpuUpper: 99, ram: 100, ramUpper: 100, storage: 90, storageUpper: 94, bandwidth: 2.95 }
];

export interface NodeExhaustion {
  nodeId: string;
  name: string;
  location: string;
  resource: 'RAM' | 'CPU' | 'STORAGE' | 'BANDWIDTH';
  currentUsage: number;
  projected7d: number;
  daysToCritical: number;
  status: 'CRITICAL' | 'ELEVATED' | 'HEALTHY';
  scalingAction: string;
}

const INITIAL_EXHAUSTION_NODES: NodeExhaustion[] = [
  {
    nodeId: 'ftn-edge-02',
    name: 'FTN-EDGE-FRA-02',
    location: 'Frankfurt, DE',
    resource: 'RAM',
    currentUsage: 84,
    projected7d: 96,
    daysToCritical: 4.8,
    status: 'CRITICAL',
    scalingAction: 'Allocate +16GB RAM & Migrate 120 WireGuard peers'
  },
  {
    nodeId: 'ftn-core-01',
    name: 'FTN-CORE-DHAKA-01',
    location: 'Dhaka, BD',
    resource: 'STORAGE',
    currentUsage: 76,
    projected7d: 84,
    daysToCritical: 14.2,
    status: 'ELEVATED',
    scalingAction: 'Attach +4TB Ceph NVMe block volume to InfluxDB'
  },
  {
    nodeId: 'ftn-edge-04',
    name: 'FTN-EDGE-NYC-01',
    location: 'New York, US',
    resource: 'CPU',
    currentUsage: 71,
    projected7d: 82,
    daysToCritical: 11.5,
    status: 'ELEVATED',
    scalingAction: 'Offload BGP flow filtering to eBPF XDP hardware NIC'
  },
  {
    nodeId: 'ftn-edge-03',
    name: 'FTN-EDGE-SGP-01',
    location: 'Singapore, SG',
    resource: 'BANDWIDTH',
    currentUsage: 68,
    projected7d: 74,
    daysToCritical: 32.0,
    status: 'HEALTHY',
    scalingAction: 'Provision secondary 10Gbps IX transit peer'
  }
];

export function FtnCapacityForecaster({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [selectedMetric, setSelectedMetric] = useState<'ram' | 'cpu' | 'storage'>('ram');
  const [nodes, setNodes] = useState<NodeExhaustion[]>(INITIAL_EXHAUSTION_NODES);
  const [executingNodeId, setExecutingNodeId] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([
    '[INIT] Prometheus Telemetry Ingestion Active: 30 of 30 Nodes Scraped (10s interval).',
    '[INFLUX] InfluxDB v2 TSDB Retention Engine: 45,000 metrics/sec streaming smoothly.',
    '[AI-PLANNER] Capacity Exhaustion Algorithm: Polynomial Growth Regression Model Loaded.'
  ]);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-30), `[${timestamp}] ${msg}`]);
  };

  // Execute one-click proactive scaling
  const handleProactiveScale = (node: NodeExhaustion) => {
    if (executingNodeId) return;
    setExecutingNodeId(node.nodeId);
    addLog(`[SCALE] AI Planner triggered Proactive Scaling for ${node.name}: "${node.scalingAction}"`);

    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          type: 'info',
          title: `Proactive Scaling: ${node.name}`,
          message: `Dispatching Ansible & Kubelet auto-scale playbook across cluster...`
        }
      })
    );

    setTimeout(() => {
      setNodes(prev =>
        prev.map(n =>
          n.nodeId === node.nodeId
            ? {
                ...n,
                currentUsage: Math.max(38, n.currentUsage - 35),
                projected7d: Math.max(48, n.projected7d - 35),
                daysToCritical: 90,
                status: 'HEALTHY'
              }
            : n
        )
      );

      addLog(`[SUCCESS] ${node.name} successfully expanded. Headroom restored to 65% safe zone.`);
      setExecutingNodeId(null);

      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: {
            type: 'success',
            title: `Scale Completed: ${node.name}`,
            message: `Resource capacity expanded. Days-to-exhaustion increased to >90 days.`
          }
        })
      );
    }, 2000);
  };

  // Scale All Critical Nodes
  const handleScaleAllCritical = () => {
    const criticalNodes = nodes.filter(n => n.status === 'CRITICAL' || n.status === 'ELEVATED');
    addLog(`[BATCH SCALE] Scaling all ${criticalNodes.length} constrained nodes simultaneously.`);

    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          type: 'info',
          title: `Batch Scaling ${criticalNodes.length} Nodes`,
          message: 'Allocating RAM, storage volumes, and spinning up container replicas...'
        }
      })
    );

    setTimeout(() => {
      setNodes(prev =>
        prev.map(n => ({
          ...n,
          currentUsage: Math.max(35, n.currentUsage - 30),
          projected7d: Math.max(45, n.projected7d - 30),
          daysToCritical: 90,
          status: 'HEALTHY'
        }))
      );

      addLog('[BATCH SUCCESS] All nodes successfully rebalanced and scaled.');

      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: {
            type: 'success',
            title: 'Cluster Health Secured',
            message: 'All resource bottlenecks cleared. Grid operating at optimal baseline.'
          }
        })
      );
    }, 2200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#091122] via-[#0b1730] to-[#080e1c] border border-gray-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-purple-500 flex items-center justify-center text-gray-950 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                <TrendingUp className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight flex items-center gap-3">
                  FTN CAPACITY FORECASTER &amp; AI PLANNER
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/40">
                    InfluxDB &bull; Prometheus Telemetry
                  </span>
                </h1>
                <p className="text-gray-300 font-mono text-xs lg:text-sm">
                  Predictive resource exhaustion forecasting for RAM, CPU, Storage, and Bandwidth with one-click automated proactive scaling.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Status Pill Strip */}
          <div className="flex flex-wrap items-center gap-4 bg-gray-950/80 border border-gray-800 rounded-2xl p-4">
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Ingestion Engine</span>
              <span className="text-lg font-black text-[#00f0ff] font-mono">Prometheus/Influx</span>
            </div>
            <div className="h-10 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Earliest Bottleneck</span>
              <span className="text-lg font-black text-red-400 font-mono">4.8 Days (RAM)</span>
            </div>
            <div className="h-10 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">AI Model Fit</span>
              <span className="text-lg font-black text-[#00ff66] font-mono">R² = 0.984</span>
            </div>
          </div>
        </div>

        {/* Metric Selector Tabs */}
        <div className="mt-6 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMetric('ram')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border",
                selectedMetric === 'ram'
                  ? "bg-purple-500/20 border-purple-500/60 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)]"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
              )}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>RAM Capacity Forecast</span>
            </button>

            <button
              onClick={() => setSelectedMetric('cpu')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border",
                selectedMetric === 'cpu'
                  ? "bg-[#00f0ff]/20 border-[#00f0ff]/60 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>CPU Utilization Forecast</span>
            </button>

            <button
              onClick={() => setSelectedMetric('storage')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border",
                selectedMetric === 'storage'
                  ? "bg-[#00ff66]/20 border-[#00ff66]/60 text-emerald-300 shadow-[0_0_15px_rgba(0,255,102,0.2)]"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
              )}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>Storage &amp; NVMe Forecast</span>
            </button>
          </div>

          <button
            onClick={handleScaleAllCritical}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-purple-500 text-gray-950 font-mono font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI One-Click: Proactive Scale All Constrained Nodes</span>
          </button>
        </div>
      </div>

      {/* Main Predictive Chart Section */}
      <div className="bg-[#080e1c] border border-gray-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
          <div>
            <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              14-DAY PREDICTIVE EXHAUSTION ENVELOPE ({selectedMetric.toUpperCase()})
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Solid line: Median AI Projected Trajectory &bull; Dashed: 95% Confidence Upper Bound &bull; Red line: 85% Warning Threshold
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <span className="w-3 h-3 rounded bg-purple-500/40 border border-purple-500 inline-block" />
            <span>Projected {selectedMetric.toUpperCase()}</span>
            <span className="w-3 h-0.5 bg-red-500 inline-block ml-3" />
            <span className="text-red-400">85% Limit</span>
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={FORECAST_DATA} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="metricGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={selectedMetric === 'ram' ? '#a855f7' : selectedMetric === 'cpu' ? '#00f0ff' : '#00ff66'} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={selectedMetric === 'ram' ? '#a855f7' : selectedMetric === 'cpu' ? '#00f0ff' : '#00ff66'} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={11} domain={[40, 100]} fontFamily="monospace" unit="%" />
              <Tooltip
                contentStyle={{ backgroundColor: '#091122', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
              />
              <ReferenceLine y={85} stroke="#ef4444" strokeDasharray="4 4" label={{ value: '85% Critical Threshold', fill: '#ef4444', fontSize: 10 }} />

              {/* Upper Bound Line */}
              <Line
                type="monotone"
                dataKey={selectedMetric === 'ram' ? 'ramUpper' : selectedMetric === 'cpu' ? 'cpuUpper' : 'storageUpper'}
                stroke="#64748b"
                strokeDasharray="4 4"
                dot={false}
                name="95% Confidence Upper"
              />

              {/* Main Trend Line & Area */}
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={selectedMetric === 'ram' ? '#a855f7' : selectedMetric === 'cpu' ? '#00f0ff' : '#00ff66'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#metricGrad)"
                name={`Actual / Forecast ${selectedMetric.toUpperCase()}`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Node-by-Node Exhaustion Risk Matrix & One-Click Proactive Scaling */}
      <div className="bg-[#080e1c] border border-gray-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Server className="w-4 h-4 text-[#00f0ff]" />
              EDGE NODE EXHAUSTION MATRIX &amp; PROACTIVE SCALING RUNBOOKS
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              AI Planner detected bottlenecks with immediate automated mitigation actions.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {nodes.map(node => {
            const isBusy = executingNodeId === node.nodeId;
            const isCritical = node.status === 'CRITICAL';
            const isElevated = node.status === 'ELEVATED';

            return (
              <div
                key={node.nodeId}
                className={cn(
                  "p-4 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4",
                  isCritical
                    ? "bg-red-950/20 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20"
                    : isElevated
                    ? "bg-amber-950/15 border-amber-500/40"
                    : "bg-[#091122] border-gray-800 hover:border-gray-700"
                )}
              >
                {/* Node details */}
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-display">{node.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-900 text-gray-300 border border-gray-800">
                      {node.location}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border",
                        isCritical ? "bg-red-500/20 text-red-400 border-red-500/40" :
                        isElevated ? "bg-amber-500/20 text-amber-400 border-amber-500/40" :
                        "bg-emerald-500/20 text-[#00ff66] border-emerald-500/40"
                      )}
                    >
                      {node.status}
                    </span>
                  </div>

                  <p className="text-xs font-mono text-gray-300">
                    <strong className="text-purple-400">AI Recommendation:</strong> {node.scalingAction}
                  </p>

                  <div className="flex items-center gap-4 text-xs font-mono text-gray-400 pt-1">
                    <span>Current: <strong className="text-white">{node.currentUsage}%</strong></span>
                    <span>7-Day Projected: <strong className={isCritical ? "text-red-400" : "text-amber-400"}>{node.projected7d}%</strong></span>
                    <span>Exhaustion in: <strong className={node.daysToCritical < 7 ? "text-red-400" : "text-[#00ff66]"}>{node.daysToCritical} Days</strong></span>
                  </div>
                </div>

                {/* Scaling Action Button (Requested feature) */}
                <button
                  onClick={() => handleProactiveScale(node)}
                  disabled={isBusy || node.status === 'HEALTHY'}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md flex-shrink-0",
                    node.status === 'HEALTHY'
                      ? "bg-emerald-500/15 text-[#00ff66] border border-emerald-500/30 cursor-default"
                      : isBusy
                      ? "bg-purple-500/30 text-purple-200 border border-purple-500/50 animate-pulse"
                      : "bg-gradient-to-r from-[#00f0ff] to-purple-500 text-gray-950 font-black hover:brightness-110 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
                  )}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    {node.status === 'HEALTHY' ? 'Headroom Secured' : isBusy ? 'Executing Runbook...' : 'Proactive Scale Node'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live AI Telemetry Logs Terminal */}
      <div className="bg-black/90 border border-gray-800 rounded-3xl p-5 font-mono text-xs space-y-2">
        <div className="flex items-center justify-between text-gray-400 pb-2 border-b border-gray-800 text-[11px]">
          <span className="flex items-center gap-2 text-white font-bold">
            <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
            INFLUXDB / PROMETHEUS CAPACITY TELEMETRY FEED
          </span>
          <button
            onClick={() => setLogs(['[RESET] Telemetry terminal buffer cleared.'])}
            className="text-gray-500 hover:text-gray-300"
          >
            Clear
          </button>
        </div>
        <div className="max-h-32 overflow-y-auto space-y-1 text-gray-300 text-[11px] scrollbar-thin">
          {logs.map((log, i) => (
            <div key={i} className="leading-relaxed">
              <span className={cn(
                log.includes('[SUCCESS]') ? 'text-[#00ff66]' :
                log.includes('[SCALE]') ? 'text-purple-400 font-bold' :
                log.includes('[AI-PLANNER]') ? 'text-cyan-400' :
                'text-gray-400'
              )}>
                {log}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
