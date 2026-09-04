import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Server,
  Cpu,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Layers,
  Sparkles,
  Sliders,
  Flame,
  Check,
  Clock,
  Play
} from 'lucide-react';

interface RebalanceCandidate {
  id: string;
  workload: string;
  containerId: string;
  sourceNode: string;
  targetNode: string;
  sourceBeforeCpu: number;
  sourceAfterCpu: number;
  sourceBeforeRam: number;
  sourceAfterRam: number;
  bandwidthSavedGbps: number;
  impactScore: string;
  status: 'PENDING' | 'EXECUTING' | 'COMPLETED';
}

interface NodeEfficiency {
  id: string;
  name: string;
  location: string;
  beforeCpu: number;
  optimizedCpu: number;
  beforeRam: number;
  optimizedRam: number;
  beforeBw: number;
  optimizedBw: number;
  status: 'HOT' | 'WARM' | 'OPTIMAL';
}

const INITIAL_NODES: NodeEfficiency[] = [
  { id: 'n1', name: 'FTN-DHAKA-CORE-01', location: 'Dhaka Core DC', beforeCpu: 76.5, optimizedCpu: 52.1, beforeRam: 74.2, optimizedRam: 54.0, beforeBw: 14.8, optimizedBw: 9.1, status: 'WARM' },
  { id: 'n2', name: 'FTN-BANANI-EDGE-02', location: 'Banani Edge POP', beforeCpu: 88.4, optimizedCpu: 44.1, beforeRam: 89.1, optimizedRam: 52.3, beforeBw: 17.5, optimizedBw: 10.2, status: 'HOT' },
  { id: 'n3', name: 'FTN-CTG-HUB-03', location: 'Chittagong Hub', beforeCpu: 22.0, optimizedCpu: 38.6, beforeRam: 34.2, optimizedRam: 48.9, beforeBw: 4.8, optimizedBw: 11.4, status: 'OPTIMAL' },
  { id: 'n4', name: 'FTN-SGP-TRANSIT-04', location: 'Singapore Transit', beforeCpu: 32.7, optimizedCpu: 42.0, beforeRam: 44.1, optimizedRam: 51.5, beforeBw: 11.6, optimizedBw: 14.2, status: 'OPTIMAL' },
  { id: 'n5', name: 'FTN-FRA-BACKUP-05', location: 'Frankfurt Vault', beforeCpu: 36.8, optimizedCpu: 38.5, beforeRam: 46.2, optimizedRam: 49.0, beforeBw: 9.8, optimizedBw: 10.5, status: 'OPTIMAL' }
];

const INITIAL_CANDIDATES: RebalanceCandidate[] = [
  {
    id: 'plan-1',
    workload: 'ftn-smart-dns:v2.4',
    containerId: 'cntr-dns-banani-904',
    sourceNode: 'FTN-BANANI-EDGE-02',
    targetNode: 'FTN-CTG-HUB-03',
    sourceBeforeCpu: 88.4,
    sourceAfterCpu: 44.1,
    sourceBeforeRam: 89.1,
    sourceAfterRam: 52.3,
    bandwidthSavedGbps: 7.3,
    impactScore: 'High Relief (-44% CPU)',
    status: 'PENDING'
  },
  {
    id: 'plan-2',
    workload: 'edge-cdn-proxy:v1.8',
    containerId: 'cntr-cdn-cache-332',
    sourceNode: 'FTN-DHAKA-CORE-01',
    targetNode: 'FTN-SGP-TRANSIT-04',
    sourceBeforeCpu: 76.5,
    sourceAfterCpu: 52.1,
    sourceBeforeRam: 74.2,
    sourceAfterRam: 54.0,
    bandwidthSavedGbps: 5.7,
    impactScore: 'Medium Relief (-24% CPU)',
    status: 'PENDING'
  },
  {
    id: 'plan-3',
    workload: 'ftn-wireguard-mesh:v2.1',
    containerId: 'cntr-wg-tunnel-092',
    sourceNode: 'FTN-BANANI-EDGE-02',
    targetNode: 'FTN-DHAKA-CORE-01',
    sourceBeforeCpu: 62.0,
    sourceAfterCpu: 48.0,
    sourceBeforeRam: 58.0,
    sourceAfterRam: 51.2,
    bandwidthSavedGbps: 3.2,
    impactScore: 'Crypto Worker Relocation',
    status: 'PENDING'
  }
];

export function FtnSmartGridOptimizer({ onNavigateToJournal }: { onNavigateToJournal?: () => void }) {
  const [nodes, setNodes] = useState<NodeEfficiency[]>(INITIAL_NODES);
  const [candidates, setCandidates] = useState<RebalanceCandidate[]>(INITIAL_CANDIDATES);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [efficiencyScore, setEfficiencyScore] = useState(68.4);

  // Trigger one-click optimization workflow
  const handleRunOneClickOptimization = () => {
    setIsOptimizing(true);
    setIsCompleted(false);
    setOptimizationProgress(10);
    setCurrentStepText('Analyzing real-time CPU, RAM, and transit bandwidth matrices...');

    setTimeout(() => {
      setOptimizationProgress(35);
      setCurrentStepText('Calculating minimum-cost workload migration graph (CRIU Pre-copy)...');
      setCandidates(prev => prev.map((c, i) => i === 0 ? { ...c, status: 'EXECUTING' } : c));
    }, 900);

    setTimeout(() => {
      setOptimizationProgress(65);
      setCurrentStepText('Executing eBPF AF_XDP socket mirroring between Banani and Chittagong...');
      setCandidates(prev => prev.map((c, i) => i <= 1 ? { ...c, status: 'EXECUTING' } : c));
    }, 1800);

    setTimeout(() => {
      setOptimizationProgress(90);
      setCurrentStepText('Re-advertising BGP Anycast AS-Path metrics & verifying zero packet loss...');
      setCandidates(prev => prev.map(c => ({ ...c, status: 'COMPLETED' })));
    }, 2700);

    setTimeout(() => {
      setOptimizationProgress(100);
      setIsOptimizing(false);
      setIsCompleted(true);
      setEfficiencyScore(95.8);
      setCurrentStepText('One-Click Optimization Complete! Mesh efficiency improved by +27.4%.');
      // Apply new optimized metrics
      setNodes(prev => prev.map(n => ({
        ...n,
        beforeCpu: n.optimizedCpu,
        beforeRam: n.optimizedRam,
        beforeBw: n.optimizedBw,
        status: 'OPTIMAL'
      })));
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Big One-Click Optimization Button */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-emerald-950/40 border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
                <Zap className="w-3.5 h-3.5" />
                AUTONOMOUS SMART GRID OPTIMIZER
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Live CPU/RAM/Bandwidth Multi-Metric Balancer
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">
              FTN Smart Grid Optimizer
            </h1>
            <p className="text-sm text-gray-400 font-mono max-w-3xl leading-relaxed">
              Analyzes global telemetry across all mesh nodes to identify hot-spots and compute zero-downtime workload evacuations. One click redistributes active containers to balance compute and eliminate bottleneck latency.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleRunOneClickOptimization}
              disabled={isOptimizing}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl font-mono text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 cursor-pointer transition-all disabled:opacity-50"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Optimizing Mesh Grid ({optimizationProgress}%)...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  One-Click Optimization
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Progress Bar when Optimizing */}
        {isOptimizing && (
          <div className="mt-5 space-y-2 font-mono text-xs animate-in fade-in">
            <div className="flex items-center justify-between text-emerald-300">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                {currentStepText}
              </span>
              <span className="font-bold">{optimizationProgress}%</span>
            </div>
            <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden border border-gray-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${optimizationProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Completion Success Toast */}
        {isCompleted && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{currentStepText}</span>
            </div>
            {onNavigateToJournal && (
              <button
                onClick={onNavigateToJournal}
                className="text-xs text-white font-bold underline underline-offset-4 hover:text-emerald-200 cursor-pointer self-start sm:self-auto"
              >
                View in Migration Journal &rarr;
              </button>
            )}
          </div>
        )}
      </div>

      {/* KPI Optimization Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>GRID EFFICIENCY SCORE</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-display">{efficiencyScore}%</div>
          <div className="text-[11px] text-gray-500 mt-1">
            {isCompleted ? 'Optimal workload distribution' : 'Optimization suggested (+27.4% headroom)'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>PEAK NODE CPU STRESS</span>
            <Cpu className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white font-display">
            {isCompleted ? '52.1%' : '88.4%'}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            {isCompleted ? 'Banani stress normalized' : 'FTN-BANANI-EDGE-02 near choke point'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>TRANSIT BUFFER HEADROOM</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-display">
            {isCompleted ? '48.9%' : '12.5%'}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Bandwidth headroom on primary links
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>WORKLOADS BALANCED</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400 font-display">
            {isCompleted ? '3 / 3 Completed' : '3 Ready to Shift'}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            CRIU zero-packet-loss migration
          </div>
        </div>
      </div>

      {/* Layout: Planned Relocations on Left (7 cols), Node Stress Balancing Table on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-mono text-xs">
        {/* Left: Workload Rebalancing Plan (7 cols) */}
        <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div>
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Workload Redistribution Action Plan
              </h3>
              <p className="text-xs text-gray-400">
                Autonomous migration actions triggered by One-Click Optimization
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-bold">
              3 Operations Scheduled
            </span>
          </div>

          <div className="space-y-3">
            {candidates.map(cand => (
              <div
                key={cand.id}
                className="p-4 rounded-xl bg-gray-950 border border-gray-800 hover:border-gray-700 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{cand.workload}</span>
                    <span className="text-[10px] text-gray-500 font-mono">({cand.containerId})</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cand.status === 'COMPLETED'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : cand.status === 'EXECUTING'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                      : 'bg-gray-800 text-gray-400 border border-gray-700'
                  }`}>
                    {cand.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-rose-300 font-bold">{cand.sourceNode}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-emerald-300 font-bold">{cand.targetNode}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-800/80 text-[11px]">
                  <div>
                    <span className="text-gray-500 block">SOURCE CPU:</span>
                    <span className="text-rose-400 font-bold">{cand.sourceBeforeCpu}%</span> &rarr; <span className="text-emerald-400 font-bold">{cand.sourceAfterCpu}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">SOURCE RAM:</span>
                    <span className="text-rose-400 font-bold">{cand.sourceBeforeRam}%</span> &rarr; <span className="text-emerald-400 font-bold">{cand.sourceAfterRam}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">BANDWIDTH RELIEF:</span>
                    <span className="text-cyan-400 font-bold">+{cand.bandwidthSavedGbps} Gbps free</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Node Resource Balancing Table (5 cols) */}
        <div className="lg:col-span-5 bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div>
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Mesh Capacity Balance
              </h3>
              <p className="text-xs text-gray-400">Current node load distribution</p>
            </div>
          </div>

          <div className="space-y-3">
            {nodes.map(node => (
              <div key={node.id} className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-white text-xs">{node.name}</h5>
                    <span className="text-[10px] text-gray-500">{node.location}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    node.beforeCpu > 80
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : node.beforeCpu > 60
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {node.beforeCpu.toFixed(1)}% CPU
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-gray-500 block text-[10px]">RAM USED:</span>
                    <span className="text-gray-300 font-semibold">{node.beforeRam.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">TRANSIT FLOW:</span>
                    <span className="text-cyan-300 font-semibold">{node.beforeBw.toFixed(1)} Gbps</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
