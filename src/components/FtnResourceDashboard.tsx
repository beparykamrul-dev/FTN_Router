import React, { useState, useMemo } from 'react';
import { 
  Server, 
  Cpu, 
  HardDrive, 
  Network, 
  Activity, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRightLeft, 
  ShieldCheck, 
  Layers, 
  Database, 
  Sliders, 
  Download, 
  TrendingUp, 
  Globe, 
  BarChart3,
  Flame,
  Check,
  FileCode2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface NodeHardwareMetric {
  id: string;
  name: string;
  location: string;
  ip: string;
  status: 'OPTIMAL' | 'ELEVATED' | 'BALANCING';
  cpuModel: string;
  cores: number;
  cpuPct: number;
  ramTotalGb: number;
  ramUsedGb: number;
  ramCacheGb: number;
  numaBalance: string;
  nvmeModel: string;
  nvmeTotalTb: number;
  nvmeUsedTb: number;
  nvmeIops: number;
  nvmeLatencyMs: number;
  ssdTotalTb: number;
  ssdUsedTb: number;
  ssdWearPct: number;
  hddZfsPool: string;
  hddTotalTb: number;
  hddUsedTb: number;
  hddScrubStatus: string;
  netBond: string;
  netCapacityGbps: number;
  netLiveGbps: number;
  netPpsM: number;
  workloadCount: number;
}

const INITIAL_METRICS: NodeHardwareMetric[] = [
  {
    id: 'node-01',
    name: 'FTN-DHAKA-CORE-01',
    location: 'Dhaka (Dhanmondi DC)',
    ip: '103.145.0.10',
    status: 'OPTIMAL',
    cpuModel: 'AMD EPYC 9654 (96C/192T)',
    cores: 96,
    cpuPct: 42,
    ramTotalGb: 128,
    ramUsedGb: 82,
    ramCacheGb: 28,
    numaBalance: 'Node0: 41GB / Node1: 41GB (100% Balanced)',
    nvmeModel: 'Samsung PM1743 PCIe 5.0 NVMe',
    nvmeTotalTb: 3.84,
    nvmeUsedTb: 2.45,
    nvmeIops: 460000,
    nvmeLatencyMs: 0.06,
    ssdTotalTb: 8.0,
    ssdUsedTb: 4.8,
    ssdWearPct: 99.4,
    hddZfsPool: 'tank-zfs-raidz2 (12x 10TB)',
    hddTotalTb: 60.0,
    hddUsedTb: 32.4,
    hddScrubStatus: 'Passed with 0 errors (2d ago)',
    netBond: 'bond0: 2x 25GbE LACP (MLAG)',
    netCapacityGbps: 50,
    netLiveGbps: 18.2,
    netPpsM: 2.8,
    workloadCount: 8
  },
  {
    id: 'node-02',
    name: 'FTN-BANANI-EDGE-02',
    location: 'Dhaka (Banani POP)',
    ip: '103.145.0.12',
    status: 'ELEVATED',
    cpuModel: 'Intel Xeon Platinum 8480+ (56C/112T)',
    cores: 56,
    cpuPct: 84,
    ramTotalGb: 128,
    ramUsedGb: 114,
    ramCacheGb: 8,
    numaBalance: 'Node0: 68GB / Node1: 46GB (NUMA Skewed)',
    nvmeModel: 'KIOXIA CM7 Gen5 NVMe-oF',
    nvmeTotalTb: 1.92,
    nvmeUsedTb: 1.72,
    nvmeIops: 380000,
    nvmeLatencyMs: 0.14,
    ssdTotalTb: 8.0,
    ssdUsedTb: 6.2,
    ssdWearPct: 98.1,
    hddZfsPool: 'pool-edge-mirror (8x 10TB)',
    hddTotalTb: 40.0,
    hddUsedTb: 26.8,
    hddScrubStatus: 'Passed with 0 errors (5d ago)',
    netBond: 'bond0: 2x 10GbE Active-Backup',
    netCapacityGbps: 20,
    netLiveGbps: 17.5,
    netPpsM: 2.4,
    workloadCount: 6
  },
  {
    id: 'node-03',
    name: 'FTN-CTG-HUB-03',
    location: 'Chittagong (Agrabad Coastal POP)',
    ip: '103.145.0.14',
    status: 'OPTIMAL',
    cpuModel: 'AMD EPYC 7763 (64C/128T)',
    cores: 64,
    cpuPct: 24,
    ramTotalGb: 128,
    ramUsedGb: 38,
    ramCacheGb: 45,
    numaBalance: 'Node0: 19GB / Node1: 19GB (100% Balanced)',
    nvmeModel: 'Micron 7450 PRO PCIe 4.0 NVMe',
    nvmeTotalTb: 1.92,
    nvmeUsedTb: 0.54,
    nvmeIops: 180000,
    nvmeLatencyMs: 0.07,
    ssdTotalTb: 8.0,
    ssdUsedTb: 2.1,
    ssdWearPct: 99.8,
    hddZfsPool: 'ctg-storage-z1 (6x 10TB)',
    hddTotalTb: 40.0,
    hddUsedTb: 18.2,
    hddScrubStatus: 'Passed with 0 errors (1d ago)',
    netBond: 'bond0: 2x 10GbE LACP',
    netCapacityGbps: 20,
    netLiveGbps: 4.8,
    netPpsM: 0.9,
    workloadCount: 4
  },
  {
    id: 'node-04',
    name: 'FTN-SG-TRANSIT-04',
    location: 'Singapore (Equinix SG1 Gateway)',
    ip: '103.145.0.18',
    status: 'OPTIMAL',
    cpuModel: 'AMD EPYC 9354 (32C/64T)',
    cores: 32,
    cpuPct: 38,
    ramTotalGb: 64,
    ramUsedGb: 28,
    ramCacheGb: 22,
    numaBalance: 'Single NUMA Socket (Balanced)',
    nvmeModel: 'Solidigm D7-P5520 NVMe',
    nvmeTotalTb: 0.96,
    nvmeUsedTb: 0.42,
    nvmeIops: 120000,
    nvmeLatencyMs: 0.05,
    ssdTotalTb: 4.0,
    ssdUsedTb: 1.8,
    ssdWearPct: 99.1,
    hddZfsPool: 'sg-cloud-zfs (2x 10TB)',
    hddTotalTb: 20.0,
    hddUsedTb: 8.5,
    hddScrubStatus: 'Passed with 0 errors (3d ago)',
    netBond: 'eth0: 10GbE Optical Direct',
    netCapacityGbps: 10,
    netLiveGbps: 5.2,
    netPpsM: 1.1,
    workloadCount: 5
  },
  {
    id: 'node-05',
    name: 'FTN-FRA-BACKUP-05',
    location: 'Frankfurt (Interxion Sovereign Vault)',
    ip: '103.145.0.22',
    status: 'OPTIMAL',
    cpuModel: 'Intel Xeon Silver 4410Y (24C/48T)',
    cores: 24,
    cpuPct: 18,
    ramTotalGb: 64,
    ramUsedGb: 22,
    ramCacheGb: 26,
    numaBalance: 'Single NUMA Socket (Balanced)',
    nvmeModel: 'Samsung PM9A3 Gen4 NVMe',
    nvmeTotalTb: 0.96,
    nvmeUsedTb: 0.31,
    nvmeIops: 90000,
    nvmeLatencyMs: 0.06,
    ssdTotalTb: 4.0,
    ssdUsedTb: 1.2,
    ssdWearPct: 99.9,
    hddZfsPool: 'fra-vault-z3 (10x 16TB Enterprise)',
    hddTotalTb: 80.0,
    hddUsedTb: 38.0,
    hddScrubStatus: 'Passed with 0 errors (12h ago)',
    netBond: 'eth0: 10GbE Uplink',
    netCapacityGbps: 10,
    netLiveGbps: 2.4,
    netPpsM: 0.4,
    workloadCount: 3
  }
];

export function FtnResourceDashboard() {
  const [metrics, setMetrics] = useState<NodeHardwareMetric[]>(INITIAL_METRICS);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceResult, setRebalanceResult] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ram' | 'nvme' | 'ssd' | 'hdd' | 'network'>('all');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Aggregated totals
  const aggregate = useMemo(() => {
    return metrics.reduce(
      (acc, m) => ({
        ramTotal: acc.ramTotal + m.ramTotalGb,
        ramUsed: acc.ramUsed + m.ramUsedGb,
        ramCache: acc.ramCache + m.ramCacheGb,
        nvmeTotal: acc.nvmeTotal + m.nvmeTotalTb,
        nvmeUsed: acc.nvmeUsed + m.nvmeUsedTb,
        ssdTotal: acc.ssdTotal + m.ssdTotalTb,
        ssdUsed: acc.ssdUsed + m.ssdUsedTb,
        hddTotal: acc.hddTotal + m.hddTotalTb,
        hddUsed: acc.hddUsed + m.hddUsedTb,
        netCapacity: acc.netCapacity + m.netCapacityGbps,
        netLive: acc.netLive + m.netLiveGbps,
        totalCores: acc.totalCores + m.cores,
        totalWorkloads: acc.totalWorkloads + m.workloadCount,
        totalIops: acc.totalIops + m.nvmeIops,
        totalPpsM: acc.totalPpsM + m.netPpsM
      }),
      {
        ramTotal: 0,
        ramUsed: 0,
        ramCache: 0,
        nvmeTotal: 0,
        nvmeUsed: 0,
        ssdTotal: 0,
        ssdUsed: 0,
        hddTotal: 0,
        hddUsed: 0,
        netCapacity: 0,
        netLive: 0,
        totalCores: 0,
        totalWorkloads: 0,
        totalIops: 0,
        totalPpsM: 0
      }
    );
  }, [metrics]);

  // One-Click Global Mesh Rebalance
  const handleOneClickRebalance = () => {
    setIsRebalancing(true);
    setRebalanceResult(null);
    showToast('Executing One-Click Autonomous Global Mesh Rebalance across 5 servers...');

    setTimeout(() => {
      // Rebalance Banani load to Chittagong and Dhaka Core
      setMetrics(prev =>
        prev.map(node => {
          if (node.id === 'node-02') {
            return {
              ...node,
              status: 'OPTIMAL' as const,
              cpuPct: 56,
              ramUsedGb: 82,
              ramCacheGb: 22,
              nvmeUsedTb: 1.25,
              netLiveGbps: 11.4,
              numaBalance: 'Node0: 41GB / Node1: 41GB (Rebalanced)'
            };
          }
          if (node.id === 'node-03') {
            return {
              ...node,
              cpuPct: 44,
              ramUsedGb: 64,
              nvmeUsedTb: 0.88,
              netLiveGbps: 8.2
            };
          }
          return node;
        })
      );

      setIsRebalancing(false);
      setRebalanceResult('Cluster rebalance successful: Workloads distributed evenly across NUMA sockets & NIC bonds. Skew reduced from 42% to 3.4%.');
      showToast('Global Rebalance Complete! All nodes are now within optimal thresholds.');
    }, 1800);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border border-gray-800/80 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                GLOBAL HARDWARE TELEMETRY & REBALANCING
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                PROMETHEUS / eBPF EXPORTER
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-white tracking-tight">
              FTN Resource Dashboard
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl font-mono">
              Deep hardware aggregation (RAM, PCIe 5.0 NVMe, SSD, ZFS HDD array, Bonded 50G/20G Network) per node with one-click autonomous cluster rebalancing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileCode2 className="w-4 h-4 text-cyan-400" />
              OpenMetrics / Prometheus
            </button>
            <button
              onClick={handleOneClickRebalance}
              disabled={isRebalancing}
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${isRebalancing ? 'animate-spin' : ''}`} />
              {isRebalancing ? 'Rebalancing Cluster...' : 'One-Click Global Mesh Rebalance'}
            </button>
          </div>
        </div>

        {/* Rebalance Success Banner */}
        {rebalanceResult && (
          <div className="mt-5 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-mono text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{rebalanceResult}</span>
            </div>
            <button 
              onClick={() => setRebalanceResult(null)}
              className="text-gray-400 hover:text-white text-xs underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 5-Column Pooled Hardware Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-gray-800/80 font-mono text-xs">
          {/* RAM */}
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> RAM CAPACITY
              </span>
              <span className="text-cyan-400 font-bold">
                {Math.round((aggregate.ramUsed / aggregate.ramTotal) * 100)}%
              </span>
            </div>
            <div className="text-lg font-black text-white">
              {aggregate.ramUsed} <span className="text-xs font-normal text-gray-400">/ {aggregate.ramTotal} GB</span>
            </div>
            <span className="text-[10px] text-gray-500 block mt-1">
              {aggregate.ramCache} GB Kernel Page Cache
            </span>
          </div>

          {/* NVMe */}
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> NVMe GEN5 POOL
              </span>
              <span className="text-amber-400 font-bold">
                {Math.round((aggregate.nvmeUsed / aggregate.nvmeTotal) * 100)}%
              </span>
            </div>
            <div className="text-lg font-black text-white">
              {aggregate.nvmeUsed.toFixed(1)} <span className="text-xs font-normal text-gray-400">/ {aggregate.nvmeTotal.toFixed(1)} TB</span>
            </div>
            <span className="text-[10px] text-gray-500 block mt-1">
              {(aggregate.totalIops / 1000).toFixed(0)}k Aggregated IOPS
            </span>
          </div>

          {/* SSD */}
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300">
                <Database className="w-3.5 h-3.5 text-blue-400" /> ENTERPRISE SSD
              </span>
              <span className="text-blue-400 font-bold">
                {Math.round((aggregate.ssdUsed / aggregate.ssdTotal) * 100)}%
              </span>
            </div>
            <div className="text-lg font-black text-white">
              {aggregate.ssdUsed.toFixed(1)} <span className="text-xs font-normal text-gray-400">/ {aggregate.ssdTotal.toFixed(1)} TB</span>
            </div>
            <span className="text-[10px] text-gray-500 block mt-1">
              Avg 99.2% Drive Health
            </span>
          </div>

          {/* ZFS HDD */}
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300">
                <HardDrive className="w-3.5 h-3.5 text-purple-400" /> ZFS HDD POOL
              </span>
              <span className="text-purple-400 font-bold">
                {Math.round((aggregate.hddUsed / aggregate.hddTotal) * 100)}%
              </span>
            </div>
            <div className="text-lg font-black text-white">
              {aggregate.hddUsed.toFixed(1)} <span className="text-xs font-normal text-gray-400">/ {aggregate.hddTotal.toFixed(1)} TB</span>
            </div>
            <span className="text-[10px] text-emerald-400 block mt-1">
              100% Scrub Parity Match
            </span>
          </div>

          {/* Bonded Network */}
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300">
                <Network className="w-3.5 h-3.5 text-emerald-400" /> BONDED NETWORK
              </span>
              <span className="text-emerald-400 font-bold">
                {Math.round((aggregate.netLive / aggregate.netCapacity) * 100)}%
              </span>
            </div>
            <div className="text-lg font-black text-white">
              {aggregate.netLive.toFixed(1)} <span className="text-xs font-normal text-gray-400">/ {aggregate.netCapacity} Gbps</span>
            </div>
            <span className="text-[10px] text-gray-500 block mt-1">
              {aggregate.totalPpsM.toFixed(1)} Mpps In-Kernel XDP
            </span>
          </div>
        </div>
      </div>

      {/* Global Monitoring "Best-of-the-Best" Bar */}
      <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-white font-bold block">Carrier-Grade Global Mesh Health</span>
            <span className="text-gray-400 text-[11px]">
              BGP AS64512 • Full-Mesh WireGuard ChaCha20-Poly1305 • Zero packet drop across subsea lines
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <div className="text-right">
            <span className="text-gray-500 block text-[10px]">GLOBAL JITTER</span>
            <span className="text-emerald-400 font-bold">0.42 ms</span>
          </div>
          <div className="h-6 w-px bg-gray-800" />
          <div className="text-right">
            <span className="text-gray-500 block text-[10px]">REBALANCE SKEW</span>
            <span className="text-cyan-400 font-bold">&lt; 4.8%</span>
          </div>
          <div className="h-6 w-px bg-gray-800" />
          <div className="text-right">
            <span className="text-gray-500 block text-[10px]">XDP PACKET LOSS</span>
            <span className="text-emerald-400 font-bold">0.000%</span>
          </div>
        </div>
      </div>

      {/* Per-Node Hardware Breakdown Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Per-Node Hardware Telemetry Table</h2>
            <p className="text-xs text-gray-400 font-mono">Detailed component metrics including CPU model, NUMA layout, and ZFS scrub state</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            {metrics.length} Bare-Metal Nodes
          </span>
        </div>

        <div className="space-y-4">
          {metrics.map(node => (
            <div 
              key={node.id} 
              className={`bg-gray-900 border rounded-2xl p-5 shadow-xl transition-all ${
                node.status === 'ELEVATED' 
                  ? 'border-amber-500/50 bg-gradient-to-r from-amber-950/10 via-gray-900 to-gray-900' 
                  : 'border-gray-800/80 hover:border-gray-700'
              }`}
            >
              {/* Card Top */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-gray-800 text-cyan-400 border border-gray-700">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white font-mono">{node.name}</h3>
                      <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                        node.status === 'ELEVATED'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse'
                          : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {node.status}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">
                      {node.location} • {node.ip} • <span className="text-cyan-300">{node.cpuModel}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-gray-400">
                    Microservices: <span className="text-white font-bold">{node.workloadCount}</span>
                  </span>
                  <button
                    onClick={handleOneClickRebalance}
                    className="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 cursor-pointer transition-colors"
                  >
                    Rebalance Node
                  </button>
                </div>
              </div>

              {/* Hardware Spec Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 font-mono text-xs">
                {/* RAM & NUMA */}
                <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800/80 space-y-1.5">
                  <div className="flex justify-between text-gray-400 text-[11px]">
                    <span className="flex items-center gap-1 text-gray-300 font-bold">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" /> RAM Memory
                    </span>
                    <span className={node.ramUsedGb > 100 ? 'text-amber-400 font-bold' : 'text-cyan-400'}>
                      {node.ramUsedGb} / {node.ramTotalGb} GB
                    </span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${node.ramUsedGb > 100 ? 'bg-amber-400' : 'bg-cyan-400'}`}
                      style={{ width: `${(node.ramUsedGb / node.ramTotalGb) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 leading-tight">
                    NUMA: {node.numaBalance}
                  </div>
                </div>

                {/* NVMe PCIe 5.0 */}
                <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800/80 space-y-1.5">
                  <div className="flex justify-between text-gray-400 text-[11px]">
                    <span className="flex items-center gap-1 text-gray-300 font-bold">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> NVMe Gen5
                    </span>
                    <span className="text-amber-400">
                      {node.nvmeUsedTb} / {node.nvmeTotalTb} TB
                    </span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${(node.nvmeUsedTb / node.nvmeTotalTb) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 leading-tight">
                    {(node.nvmeIops / 1000).toFixed(0)}k IOPS • {node.nvmeLatencyMs}ms latency
                  </div>
                </div>

                {/* Enterprise SSD & ZFS HDD */}
                <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800/80 space-y-1.5">
                  <div className="flex justify-between text-gray-400 text-[11px]">
                    <span className="flex items-center gap-1 text-gray-300 font-bold">
                      <HardDrive className="w-3.5 h-3.5 text-purple-400" /> ZFS Storage
                    </span>
                    <span className="text-purple-400">
                      {node.hddUsedTb} / {node.hddTotalTb} TB
                    </span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-purple-400 rounded-full"
                      style={{ width: `${(node.hddUsedTb / node.hddTotalTb) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 leading-tight">
                    SSD: {node.ssdUsedTb}/{node.ssdTotalTb}TB • ZFS: {node.hddScrubStatus}
                  </div>
                </div>

                {/* Bonded Network Throughput */}
                <div className="p-3 bg-gray-950/80 rounded-xl border border-gray-800/80 space-y-1.5">
                  <div className="flex justify-between text-gray-400 text-[11px]">
                    <span className="flex items-center gap-1 text-gray-300 font-bold">
                      <Network className="w-3.5 h-3.5 text-emerald-400" /> Network Bond
                    </span>
                    <span className="text-emerald-400">
                      {node.netLiveGbps} / {node.netCapacityGbps} Gbps
                    </span>
                  </div>
                  <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${(node.netLiveGbps / node.netCapacityGbps) * 100}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 leading-tight truncate">
                    {node.netBond} • {node.netPpsM} Mpps
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Metrics Modal (Prometheus Format) */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in" onClick={() => setIsExportModalOpen(false)}>
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 font-mono text-xs" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <FileCode2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Prometheus & OpenMetrics Live Stream</h3>
                  <p className="text-xs text-gray-400">Endpoint: /metrics/ftn-mesh-telemetry</p>
                </div>
              </div>
              <button onClick={() => setIsExportModalOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-black border border-gray-800 text-gray-300 font-mono text-[11px] overflow-x-auto max-h-80 space-y-1">
              <div className="text-gray-500"># HELP ftn_mesh_ram_used_bytes Total RAM memory allocated per server</div>
              <div className="text-gray-500"># TYPE ftn_mesh_ram_used_bytes gauge</div>
              <div>ftn_mesh_ram_used_bytes&#123;node=&quot;FTN-DHAKA-CORE-01&quot;,ip=&quot;103.145.0.10&quot;&#125; 88046829568</div>
              <div>ftn_mesh_ram_used_bytes&#123;node=&quot;FTN-BANANI-EDGE-02&quot;,ip=&quot;103.145.0.12&quot;&#125; 122406567936</div>
              <div>ftn_mesh_ram_used_bytes&#123;node=&quot;FTN-CTG-HUB-03&quot;,ip=&quot;103.145.0.14&quot;&#125; 40802189312</div>
              <div className="text-gray-500 mt-2"># HELP ftn_mesh_nvme_iops Real-time NVMe IOPS per storage node</div>
              <div className="text-gray-500"># TYPE ftn_mesh_nvme_iops gauge</div>
              <div>ftn_mesh_nvme_iops&#123;node=&quot;FTN-DHAKA-CORE-01&quot;,tier=&quot;gen5&quot;&#125; 460000</div>
              <div>ftn_mesh_nvme_iops&#123;node=&quot;FTN-BANANI-EDGE-02&quot;,tier=&quot;gen5&quot;&#125; 380000</div>
              <div className="text-gray-500 mt-2"># HELP ftn_mesh_network_throughput_gbps Bonded NIC live bandwidth</div>
              <div className="text-gray-500"># TYPE ftn_mesh_network_throughput_gbps gauge</div>
              <div>ftn_mesh_network_throughput_gbps&#123;node=&quot;FTN-DHAKA-CORE-01&quot;,bond=&quot;bond0&quot;&#125; 18.2</div>
              <div>ftn_mesh_network_throughput_gbps&#123;node=&quot;FTN-BANANI-EDGE-02&quot;,bond=&quot;bond0&quot;&#125; 17.5</div>
            </div>

            <div className="mt-4 pt-3 flex justify-end gap-3 border-t border-gray-800">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('# HELP ftn_mesh_ram_used_bytes ...');
                  showToast('Prometheus metrics copied to clipboard!');
                  setIsExportModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold cursor-pointer"
              >
                Copy Metrics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
