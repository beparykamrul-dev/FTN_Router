import React, { useState } from 'react';
import { 
  Cpu, 
  Server, 
  Layers, 
  Zap, 
  ArrowRightLeft, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Play, 
  Settings2, 
  ShieldCheck, 
  HardDrive, 
  Network, 
  TrendingUp,
  Activity,
  PlusCircle,
  Clock,
  Terminal,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Sparkles,
  Check,
  RotateCcw,
  Gauge
} from 'lucide-react';

interface ScalingRule {
  id: string;
  name: string;
  category: 'RAM' | 'CPU' | 'NETWORK' | 'STORAGE';
  triggerCondition: string;
  actionTaken: string;
  cooldownSec: number;
  enabled: boolean;
  lastTriggered: string;
}

interface ScalingEvent {
  id: string;
  timestamp: string;
  type: 'SCALE_OUT' | 'MIGRATE' | 'DRAIN' | 'SCALE_IN' | 'AUTO_BALANCE';
  targetWorkload: string;
  sourceNode: string;
  targetNode: string;
  triggerMetric: string;
  durationMs: number;
  status: 'SUCCESS' | 'EXECUTING' | 'SIMULATED';
}

interface NodeCapacity {
  id: string;
  name: string;
  location: string;
  ramUsagePct: number;
  cpuUsagePct: number;
  netUsagePct: number;
  diskUsagePct: number;
  workloads: string[];
  role: 'CORE' | 'EDGE' | 'HUB' | 'TRANSIT' | 'VAULT';
}

interface SuggestedMigration {
  id: string;
  workload: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceNodeName: string;
  targetNodeName: string;
  resourceGain: string;
  currentSourceLoad: number;
  projectedSourceLoad: number;
  currentTargetLoad: number;
  projectedTargetLoad: number;
  riskRating: 'VERY LOW' | 'LOW' | 'MEDIUM';
  status: 'PENDING' | 'MIGRATING' | 'COMPLETED';
}

const INITIAL_NODES: NodeCapacity[] = [
  {
    id: 'node-01',
    name: 'FTN-DHAKA-CORE-01',
    location: 'Dhaka DC',
    ramUsagePct: 64,
    cpuUsagePct: 42,
    netUsagePct: 36,
    diskUsagePct: 54,
    workloads: ['ftn-core-noc', 'ftn-gobgp-daemon', 'ftn-auth-gateway'],
    role: 'CORE'
  },
  {
    id: 'node-02',
    name: 'FTN-BANANI-EDGE-02',
    location: 'Dhaka Banani',
    ramUsagePct: 89,
    cpuUsagePct: 84,
    netUsagePct: 87,
    diskUsagePct: 78,
    workloads: ['ftn-ai-runtime', 'ftn-smart-dns-resolver', 'ftn-opensearch-ingest'],
    role: 'EDGE'
  },
  {
    id: 'node-03',
    name: 'FTN-CTG-HUB-03',
    location: 'Chittagong Coastal',
    ramUsagePct: 30,
    cpuUsagePct: 24,
    netUsagePct: 24,
    diskUsagePct: 28,
    workloads: ['ftn-coastal-cache'],
    role: 'HUB'
  },
  {
    id: 'node-04',
    name: 'FTN-SG-TRANSIT-04',
    location: 'Singapore Equinix',
    ramUsagePct: 44,
    cpuUsagePct: 38,
    netUsagePct: 52,
    diskUsagePct: 42,
    workloads: ['ftn-anycast-sg-pop'],
    role: 'TRANSIT'
  },
  {
    id: 'node-05',
    name: 'FTN-FRA-BACKUP-05',
    location: 'Frankfurt Vault',
    ramUsagePct: 34,
    cpuUsagePct: 18,
    netUsagePct: 24,
    diskUsagePct: 48,
    workloads: ['ftn-cold-archive-zfs'],
    role: 'VAULT'
  }
];

const INITIAL_RULES: ScalingRule[] = [
  {
    id: 'rule-01',
    name: 'RAM Saturation Evacuation',
    category: 'RAM',
    triggerCondition: 'RAM utilization > 80% for > 60s',
    actionTaken: 'Autonomous CRIU memory pre-copy & live migrate microservice to coolest node',
    cooldownSec: 300,
    enabled: true,
    lastTriggered: '18 mins ago'
  },
  {
    id: 'rule-02',
    name: 'BGP Anycast Egress Offload',
    category: 'NETWORK',
    triggerCondition: 'Bonded NIC utilization > 85% (17+ Gbps)',
    actionTaken: 'Prepend AS-path to shift ingress traffic to secondary geographic POP',
    cooldownSec: 180,
    enabled: true,
    lastTriggered: '42 mins ago'
  },
  {
    id: 'rule-03',
    name: 'Ephemeral Cloud Node Scale-Out',
    category: 'CPU',
    triggerCondition: 'Aggregate Cluster vCPU load > 85% for > 180s',
    actionTaken: 'Auto-provision ephemeral edge node via Cloud API & join WireGuard mesh',
    cooldownSec: 900,
    enabled: true,
    lastTriggered: 'Never (Armed)'
  },
  {
    id: 'rule-04',
    name: 'Storage Tiering Auto-Demote',
    category: 'STORAGE',
    triggerCondition: 'NVMe Gen5 tier fill level > 75%',
    actionTaken: 'Demote cold logs and historical telemetry snapshots to ZFS HDD pool',
    cooldownSec: 600,
    enabled: true,
    lastTriggered: '2 hours ago'
  }
];

const INITIAL_EVENTS: ScalingEvent[] = [
  {
    id: 'ev-01',
    timestamp: 'Just now',
    type: 'MIGRATE',
    targetWorkload: 'ftn-ai-runtime (Predictive NOC Engine)',
    sourceNode: 'FTN-BANANI-EDGE-02',
    targetNode: 'FTN-CTG-HUB-03',
    triggerMetric: 'RAM exceeded 89% on Banani',
    durationMs: 142,
    status: 'SUCCESS'
  },
  {
    id: 'ev-02',
    timestamp: '14 mins ago',
    type: 'DRAIN',
    targetWorkload: 'Kopia Backup Daily Snapshot Array',
    sourceNode: 'FTN-DHAKA-CORE-01',
    targetNode: 'FTN-FRA-BACKUP-05',
    triggerMetric: 'Storage NVMe Tiering (1.4 TB Demotion)',
    durationMs: 4200,
    status: 'SUCCESS'
  },
  {
    id: 'ev-03',
    timestamp: '1 hour ago',
    type: 'SCALE_OUT',
    targetWorkload: 'ftn-anycast-edge-sg (DNS Resolver)',
    sourceNode: 'Global Mesh',
    targetNode: 'FTN-SG-TRANSIT-04',
    triggerMetric: 'DNS query burst (+40,000 qps)',
    durationMs: 840,
    status: 'SUCCESS'
  }
];

export function FtnScalingController() {
  const [nodes, setNodes] = useState<NodeCapacity[]>(INITIAL_NODES);
  const [rules, setRules] = useState<ScalingRule[]>(INITIAL_RULES);
  const [events, setEvents] = useState<ScalingEvent[]>(INITIAL_EVENTS);
  const [isDryRunActive, setIsDryRunActive] = useState(false);
  const [isLiveMigrating, setIsLiveMigrating] = useState(false);
  const [migrationStep, setMigrationStep] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Auto-Balance Feature State
  const [isAnalyzingBalance, setIsAnalyzingBalance] = useState(false);
  const [isAutoBalancing, setIsAutoBalancing] = useState(false);
  const [autoBalanceProgress, setAutoBalanceProgress] = useState<string | null>(null);
  const [suggestedMigrations, setSuggestedMigrations] = useState<SuggestedMigration[]>([
    {
      id: 'sug-1',
      workload: 'ftn-ai-runtime (Predictive NOC Engine)',
      sourceNodeId: 'node-02',
      targetNodeId: 'node-03',
      sourceNodeName: 'FTN-BANANI-EDGE-02',
      targetNodeName: 'FTN-CTG-HUB-03',
      resourceGain: '-24% RAM & -28% CPU on Banani',
      currentSourceLoad: 89,
      projectedSourceLoad: 65,
      currentTargetLoad: 30,
      projectedTargetLoad: 48,
      riskRating: 'VERY LOW',
      status: 'PENDING'
    },
    {
      id: 'sug-2',
      workload: 'ftn-opensearch-ingest (Log Pipe)',
      sourceNodeId: 'node-02',
      targetNodeId: 'node-01',
      sourceNodeName: 'FTN-BANANI-EDGE-02',
      targetNodeName: 'FTN-DHAKA-CORE-01',
      resourceGain: '-14% Net & -12% NVMe on Banani',
      currentSourceLoad: 87,
      projectedSourceLoad: 73,
      currentTargetLoad: 64,
      projectedTargetLoad: 70,
      riskRating: 'LOW',
      status: 'PENDING'
    },
    {
      id: 'sug-3',
      workload: 'ftn-smart-dns-resolver (Anycast Thread)',
      sourceNodeId: 'node-02',
      targetNodeId: 'node-04',
      sourceNodeName: 'FTN-BANANI-EDGE-02',
      targetNodeName: 'FTN-SG-TRANSIT-04',
      resourceGain: '-16% Net BGP Egress to SG gateway',
      currentSourceLoad: 84,
      projectedSourceLoad: 58,
      currentTargetLoad: 52,
      projectedTargetLoad: 61,
      riskRating: 'VERY LOW',
      status: 'PENDING'
    }
  ]);

  // Threshold sliders
  const [highRamThreshold, setHighRamThreshold] = useState(80);
  const [highCpuThreshold, setHighCpuThreshold] = useState(85);
  const [highNetThreshold, setHighNetThreshold] = useState(85);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Toggle rule
  const toggleRule = (id: string) => {
    setRules(prev =>
      prev.map(r => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    showToast('Scaling rule configuration updated.');
  };

  // Run AI / Capacity-based Auto-Balance Analysis
  const runAutoBalanceAnalysis = () => {
    setIsAnalyzingBalance(true);
    showToast('Evaluating real-time hardware telemetry and generating optimal workload redistribution...');

    setTimeout(() => {
      setIsAnalyzingBalance(false);
      showToast('Optimal Workload Distribution Plan generated based on NUMA, RAM, and NIC capacity.');
    }, 900);
  };

  // Execute One-Click Auto-Balance Service Migrations
  const executeAutoBalancePlan = () => {
    setIsAutoBalancing(true);
    setAutoBalanceProgress('Phase 1/4: Analyzing real-time hardware capacity & selecting cooler mesh nodes...');

    setTimeout(() => {
      setAutoBalanceProgress('Phase 2/4: Initializing zero-downtime CRIU memory page pre-copy over WireGuard mesh...');
    }, 1000);

    setTimeout(() => {
      setAutoBalanceProgress('Phase 3/4: Seamless eBPF XDP socket handoff for 3 microservices (3.1ms cutover)...');
      setSuggestedMigrations(prev => prev.map(s => ({ ...s, status: 'MIGRATING' })));
    }, 2000);

    setTimeout(() => {
      setAutoBalanceProgress('Phase 4/4: Post-migration integrity verification complete. All socket queues optimal!');
      
      // Update node loads
      setNodes(prev => prev.map(n => {
        if (n.id === 'node-02') {
          return {
            ...n,
            ramUsagePct: 56,
            cpuUsagePct: 52,
            netUsagePct: 54,
            diskUsagePct: 50,
            workloads: ['ftn-core-edge-gw']
          };
        }
        if (n.id === 'node-03') {
          return {
            ...n,
            ramUsagePct: 48,
            cpuUsagePct: 44,
            netUsagePct: 38,
            workloads: [...n.workloads, 'ftn-ai-runtime']
          };
        }
        if (n.id === 'node-04') {
          return {
            ...n,
            netUsagePct: 59,
            workloads: [...n.workloads, 'ftn-smart-dns-resolver']
          };
        }
        if (n.id === 'node-01') {
          return {
            ...n,
            ramUsagePct: 69,
            workloads: [...n.workloads, 'ftn-opensearch-ingest']
          };
        }
        return n;
      }));

      setSuggestedMigrations(prev => prev.map(s => ({ ...s, status: 'COMPLETED' })));

      const newBalanceEvent: ScalingEvent = {
        id: `ev-balance-${Date.now()}`,
        timestamp: 'Just now',
        type: 'AUTO_BALANCE',
        targetWorkload: 'Mesh Global Balance (3 Services)',
        sourceNode: 'FTN-BANANI-EDGE-02',
        targetNode: 'FTN-CTG / SG / DHAKA',
        triggerMetric: 'One-Click Auto-Balance executed (Skew 59% -> 6%)',
        durationMs: 312,
        status: 'SUCCESS'
      };
      setEvents(prev => [newBalanceEvent, ...prev]);

      setTimeout(() => {
        setIsAutoBalancing(false);
        setAutoBalanceProgress(null);
        showToast('Autonomous Mesh Auto-Balance successfully executed across all 5 nodes!');
      }, 1200);
    }, 3200);
  };

  // Reset to simulated unbalanced state
  const resetToUnbalanced = () => {
    setNodes(INITIAL_NODES);
    setSuggestedMigrations(prev => prev.map(s => ({ ...s, status: 'PENDING' })));
    showToast('Reset nodes to initial capacity state with Banani high load.');
  };

  // Simulate Dry-Run Provisioning
  const runDryRunProvisioning = () => {
    setIsDryRunActive(true);
    showToast('Initiating dry-run autoscaling evaluation...');

    setTimeout(() => {
      const newEvent: ScalingEvent = {
        id: `ev-${Date.now()}`,
        timestamp: 'Just now',
        type: 'SCALE_OUT',
        targetWorkload: 'ftn-edge-ephemeral-pod (Simulated)',
        sourceNode: 'Cloud API Fabric',
        targetNode: 'FTN-SG-EPHEMERAL-07',
        triggerMetric: 'Simulated dry-run gate check: PASSED',
        durationMs: 310,
        status: 'SIMULATED'
      };
      setEvents(prev => [newEvent, ...prev]);
      setIsDryRunActive(false);
      showToast('Dry-run successful: Cloud API provisioning verified in 310ms with zero errors.');
    }, 1500);
  };

  // Simulate Step-by-Step Live-Migration
  const runTestLiveMigration = () => {
    setIsLiveMigrating(true);
    setMigrationStep('1/4: Initializing eBPF memory page checkpointing on Source Node...');

    setTimeout(() => {
      setMigrationStep('2/4: Delta sync dirty memory pages to Target Node over WireGuard mesh...');
    }, 800);

    setTimeout(() => {
      setMigrationStep('3/4: Diverting active network socket flows via eBPF XDP redirect (3ms cutover)...');
    }, 1600);

    setTimeout(() => {
      setMigrationStep('4/4: Container running seamlessly on Target Node. Verification complete!');
      const newEvent: ScalingEvent = {
        id: `ev-${Date.now()}`,
        timestamp: 'Just now',
        type: 'MIGRATE',
        targetWorkload: 'ftn-smart-dns-resolver-thread',
        sourceNode: 'FTN-BANANI-EDGE-02',
        targetNode: 'FTN-DHAKA-CORE-01',
        triggerMetric: 'Live Migration Test (Manual Trigger)',
        durationMs: 148,
        status: 'SUCCESS'
      };
      setEvents(prev => [newEvent, ...prev]);

      setTimeout(() => {
        setIsLiveMigrating(false);
        setMigrationStep(null);
        showToast('Zero-downtime microservice migration completed in 148ms!');
      }, 1000);
    }, 2400);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Main Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border border-gray-800/80 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                AUTONOMOUS SCALING & AUTO-BALANCE CONTROLLER
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ZERO-DOWNTIME eBPF CRIU
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-white tracking-tight">
              FTN Scaling Controller
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl font-mono">
              Autonomous capacity watcher that continuously inspects hardware headroom across physical nodes, generates optimal workload redistributions, and executes safe service migrations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={runDryRunProvisioning}
              disabled={isDryRunActive}
              className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-3.5 h-3.5 text-cyan-400 ${isDryRunActive ? 'animate-spin' : ''}`} />
              {isDryRunActive ? 'Evaluating...' : 'Dry-Run Scale-Out'}
            </button>
            <button
              onClick={executeAutoBalancePlan}
              disabled={isAutoBalancing}
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-black shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isAutoBalancing ? 'animate-spin' : ''}`} />
              {isAutoBalancing ? 'Balancing Mesh...' : 'One-Click Auto-Balance'}
            </button>
          </div>
        </div>

        {/* Live Step Progress Banner if migrating */}
        {migrationStep && (
          <div className="mt-6 p-4 rounded-xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 font-mono text-xs flex items-center gap-3 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>{migrationStep}</span>
          </div>
        )}

        {/* Live Auto-Balance Progress Banner */}
        {autoBalanceProgress && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-300 font-mono text-xs flex items-center justify-between gap-3 animate-pulse shadow-lg">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              <span className="font-bold">{autoBalanceProgress}</span>
            </div>
            <span className="text-[10px] bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/40 text-emerald-300">
              Safe Rollback Guard Armed
            </span>
          </div>
        )}

        {/* Capacity Gauges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-gray-800/80 font-mono text-xs">
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70">
            <span className="text-gray-400 text-[10px] block">GLOBAL MESH CAPACITY</span>
            <span className="text-lg font-bold text-white mt-1 block">58.2%</span>
            <span className="text-[10px] text-emerald-400">41.8% Headroom Available</span>
          </div>
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70">
            <span className="text-gray-400 text-[10px] block">MAX NODE IMBALANCE SKEW</span>
            <span className="text-lg font-bold text-amber-400 mt-1 block">
              {nodes.some(n => n.ramUsagePct > 80) ? '59.0% (Skew Detected)' : '6.4% (Optimal)'}
            </span>
            <span className="text-[10px] text-gray-500">Target Tolerance: &lt; 15%</span>
          </div>
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70">
            <span className="text-gray-400 text-[10px] block">CRIU CUTOVER SPEED</span>
            <span className="text-lg font-bold text-cyan-400 mt-1 block">3.1 ms</span>
            <span className="text-[10px] text-gray-500">Zero Socket Drops</span>
          </div>
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70">
            <span className="text-gray-400 text-[10px] block">ACTIVE SCALING ENGINE</span>
            <span className="text-lg font-bold text-emerald-400 mt-1 block">Nomad + eBPF CRIU</span>
            <span className="text-[10px] text-gray-500">WireGuard P2P Mesh</span>
          </div>
        </div>
      </div>

      {/* ONE-CLICK AUTO-BALANCE & WORKLOAD OPTIMIZER SECTION */}
      <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 text-cyan-400 border border-cyan-500/40">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white font-display">One-Click Auto-Balance Workload Optimizer</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  REAL-TIME CAPACITY HEURISTICS
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono">
                Suggests optimal workload distributions across physical nodes and safely executes live service migrations with zero packet loss.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runAutoBalanceAnalysis}
              disabled={isAnalyzingBalance || isAutoBalancing}
              className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isAnalyzingBalance ? 'animate-spin' : ''}`} />
              {isAnalyzingBalance ? 'Re-analyzing...' : 'Refresh Suggestions'}
            </button>
            <button
              onClick={resetToUnbalanced}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white bg-gray-800/80 hover:bg-gray-700 border border-gray-700 transition-colors cursor-pointer"
              title="Reset to unbalanced test state"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={executeAutoBalancePlan}
              disabled={isAutoBalancing}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <ArrowRightLeft className={`w-4 h-4 ${isAutoBalancing ? 'animate-spin' : ''}`} />
              {isAutoBalancing ? 'Executing Safe Auto-Balance...' : 'Execute Auto-Balance Plan'}
            </button>
          </div>
        </div>

        {/* Live Node Hardware Headroom Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
          {nodes.map(node => {
            const isHigh = node.ramUsagePct > 80 || node.cpuUsagePct > 80;
            return (
              <div 
                key={node.id} 
                className={`p-3.5 rounded-xl border transition-all ${
                  isHigh 
                    ? 'bg-amber-950/20 border-amber-500/50 shadow-lg shadow-amber-950/30' 
                    : 'bg-gray-950/70 border-gray-800/80'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-[11px] truncate">{node.name}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                    isHigh ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'
                  }`}>
                    {isHigh ? 'OVERBURDENED' : 'BALANCED'}
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div>
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>RAM</span>
                      <span className={node.ramUsagePct > 80 ? 'text-amber-400 font-bold' : 'text-gray-300'}>
                        {node.ramUsagePct}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-1 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${node.ramUsagePct > 80 ? 'bg-amber-400' : 'bg-cyan-400'}`} 
                        style={{ width: `${node.ramUsagePct}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>CPU</span>
                      <span className="text-gray-300">{node.cpuUsagePct}%</span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-1 overflow-hidden">
                      <div className="h-full bg-purple-400 rounded-full" style={{ width: `${node.cpuUsagePct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-gray-400 text-[10px]">
                      <span>NIC Load</span>
                      <span className="text-gray-300">{node.netUsagePct}%</span>
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-1 overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${node.netUsagePct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-gray-800 text-[10px] text-gray-400 truncate">
                  Services: <span className="text-cyan-300 font-semibold">{node.workloads.length}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Suggested Migration Workload Redistribution Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-gray-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Suggested Workload Redistribution Schedule ({suggestedMigrations.length} Optimizations)
            </h4>
            <span className="text-[11px] font-mono text-emerald-400">Zero Socket Drops (CRIU Hot-Sync)</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 font-mono text-xs">
            {suggestedMigrations.map(sug => (
              <div 
                key={sug.id} 
                className="bg-gray-950 p-4 rounded-xl border border-gray-800/90 hover:border-cyan-500/40 transition-all space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-white font-bold block text-sm">{sug.workload}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{sug.resourceGain}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    sug.status === 'COMPLETED'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : sug.status === 'MIGRATING'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse'
                      : 'bg-gray-800 text-gray-300 border border-gray-700'
                  }`}>
                    {sug.status}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-gray-900/90 border border-gray-800/80 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-400">Source:</span>
                    <span className="font-semibold text-rose-300 truncate">{sug.sourceNodeName}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Load Projection:</span>
                    <span>{sug.currentSourceLoad}% &rarr; <span className="text-emerald-400 font-bold">{sug.projectedSourceLoad}%</span></span>
                  </div>
                  <div className="border-t border-gray-800/60 my-1" />
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-400">Target:</span>
                    <span className="font-semibold text-cyan-300 truncate">{sug.targetNodeName}</span>
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Load Projection:</span>
                    <span>{sug.currentTargetLoad}% &rarr; <span className="text-amber-300 font-bold">{sug.projectedTargetLoad}%</span></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-[10px] text-gray-400">
                  <span>Risk Level: <span className="text-emerald-400 font-bold">{sug.riskRating}</span></span>
                  <button
                    onClick={() => {
                      showToast(`Migrating ${sug.workload} individually...`);
                      setTimeout(() => {
                        setSuggestedMigrations(prev => prev.map(item => item.id === sug.id ? { ...item, status: 'COMPLETED' } : item));
                        showToast(`Migrated ${sug.workload} safely!`);
                      }, 1000);
                    }}
                    disabled={sug.status === 'COMPLETED' || isAutoBalancing}
                    className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-cyan-300 border border-gray-700 disabled:opacity-40 cursor-pointer"
                  >
                    {sug.status === 'COMPLETED' ? 'Migrated' : 'Migrate Service'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threshold Sliders Configuration */}
      <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">Autoscaling & Migration Threshold Policy</h3>
              <p className="text-xs text-gray-400 font-mono">Tune the limits that trigger automatic container evacuation or edge provisioning</p>
            </div>
          </div>
          <button
            onClick={() => showToast('Policy limits persisted to local cluster state.')}
            className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-gray-800 hover:bg-gray-700 text-cyan-300 border border-gray-700 cursor-pointer"
          >
            Save Policy
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono text-xs pt-1">
          {/* RAM Threshold */}
          <div className="space-y-2 p-3.5 rounded-xl bg-gray-950 border border-gray-800">
            <div className="flex justify-between text-gray-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> RAM High Watermark
              </span>
              <span className="text-cyan-400 font-bold">{highRamThreshold}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              value={highRamThreshold}
              onChange={(e) => setHighRamThreshold(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-gray-500 block">
              Triggers live CRIU migration when any node RAM stays above {highRamThreshold}%
            </span>
          </div>

          {/* CPU Threshold */}
          <div className="space-y-2 p-3.5 rounded-xl bg-gray-950 border border-gray-800">
            <div className="flex justify-between text-gray-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Activity className="w-3.5 h-3.5 text-amber-400" /> CPU Core Threshold
              </span>
              <span className="text-amber-400 font-bold">{highCpuThreshold}%</span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={highCpuThreshold}
              onChange={(e) => setHighCpuThreshold(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <span className="text-[10px] text-gray-500 block">
              Rebalances CPU affinity or offloads worker threads above {highCpuThreshold}%
            </span>
          </div>

          {/* Network Threshold */}
          <div className="space-y-2 p-3.5 rounded-xl bg-gray-950 border border-gray-800">
            <div className="flex justify-between text-gray-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Network className="w-3.5 h-3.5 text-emerald-400" /> Network Saturation Gate
              </span>
              <span className="text-emerald-400 font-bold">{highNetThreshold}%</span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              value={highNetThreshold}
              onChange={(e) => setHighNetThreshold(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
            <span className="text-[10px] text-gray-500 block">
              Triggers Anycast BGP route prepending above {highNetThreshold}% interface load
            </span>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-base font-bold text-white font-display">Autonomous Scaling Policies ({rules.length})</h3>
            <p className="text-xs text-gray-400 font-mono">Live rule-driven execution matrix for multi-server auto-scaling</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            eBPF Telemetry Hooked
          </span>
        </div>

        <div className="divide-y divide-gray-800/80 font-mono text-xs">
          {rules.map(rule => (
            <div key={rule.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{rule.name}</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-gray-800 text-cyan-400">
                    {rule.category}
                  </span>
                  <span className="text-gray-500 text-[10px]">Cooldown: {rule.cooldownSec}s</span>
                </div>
                <div className="text-gray-300 text-xs">
                  <span className="text-amber-400 font-semibold">IF</span> {rule.triggerCondition} &rarr;{' '}
                  <span className="text-emerald-400 font-semibold">THEN</span> {rule.actionTaken}
                </div>
                <div className="text-[10px] text-gray-500">Last triggered: {rule.lastTriggered}</div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  onClick={() => toggleRule(rule.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-colors ${
                    rule.enabled
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {rule.enabled ? 'ACTIVE' : 'DISABLED'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Scaling & Migration Event Stream */}
      <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Real-Time Scaling & Service Migration Audit
            </h3>
            <p className="text-xs text-gray-400 font-mono">Chronological record of autonomous auto-scaling events and container relocations</p>
          </div>
          <span className="text-xs font-mono text-gray-500">Autonomous Driver</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="text-gray-400 bg-gray-950/60 border-b border-gray-800">
                <th className="px-4 py-3">TIMESTAMP</th>
                <th className="px-4 py-3">EVENT TYPE</th>
                <th className="px-4 py-3">TARGET WORKLOAD</th>
                <th className="px-4 py-3">ROUTE</th>
                <th className="px-4 py-3">TRIGGER METRIC</th>
                <th className="px-4 py-3">CUTOVER DURATION</th>
                <th className="px-4 py-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {events.map(ev => (
                <tr key={ev.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{ev.timestamp}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ev.type === 'AUTO_BALANCE'
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    }`}>
                      {ev.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-white">{ev.targetWorkload}</td>
                  <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                    {ev.sourceNode} &rarr; {ev.targetNode}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{ev.triggerMetric}</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold whitespace-nowrap">
                    {ev.durationMs} ms
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      {ev.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

