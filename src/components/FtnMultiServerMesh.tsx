import React, { useState, useEffect, useMemo } from 'react';
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
  Sliders, 
  Layers, 
  Database, 
  Plus, 
  X, 
  ChevronRight,
  TrendingUp,
  Flame,
  Snowflake,
  BarChart3,
  Terminal,
  Globe
} from 'lucide-react';

interface ServerNode {
  id: string;
  name: string;
  location: string;
  ip: string;
  status: 'optimal' | 'warning' | 'rebalancing';
  cpuCores: number;
  cpuUsagePct: number;
  ramTotalGb: number;
  ramUsedGb: number;
  nvmeTotalTb: number;
  nvmeUsedTb: number;
  ssdTotalTb: number;
  ssdUsedTb: number;
  hddTotalTb: number;
  hddUsedTb: number;
  netSpeedGbps: number;
  netCurrentGbps: number;
  containers: string[];
  temperatureC: number;
}

interface RebalanceLog {
  id: string;
  timestamp: string;
  sourceNode: string;
  targetNode: string;
  workload: string;
  reason: string;
  resourceFreed: string;
  status: 'COMPLETED' | 'IN_TRANSIT';
}

const INITIAL_NODES: ServerNode[] = [
  {
    id: 'node-01',
    name: 'FTN-DHAKA-CORE-01',
    location: 'Dhaka (Dhanmondi DC)',
    ip: '103.145.0.10',
    status: 'optimal',
    cpuCores: 64,
    cpuUsagePct: 42,
    ramTotalGb: 128,
    ramUsedGb: 82,
    nvmeTotalTb: 3.84,
    nvmeUsedTb: 2.45,
    ssdTotalTb: 8.0,
    ssdUsedTb: 4.8,
    hddTotalTb: 60.0,
    hddUsedTb: 32.4,
    netSpeedGbps: 40,
    netCurrentGbps: 18.2,
    containers: ['ftn-core-noc', 'ftn-gobgp-daemon', 'ftn-smart-dns-mesh', 'ftn-gateway-mesh'],
    temperatureC: 44
  },
  {
    id: 'node-02',
    name: 'FTN-BANANI-EDGE-02',
    location: 'Dhaka (Banani POP)',
    ip: '103.145.0.12',
    status: 'warning',
    cpuCores: 48,
    cpuUsagePct: 84,
    ramTotalGb: 128,
    ramUsedGb: 114,
    nvmeTotalTb: 1.92,
    nvmeUsedTb: 1.72,
    ssdTotalTb: 8.0,
    ssdUsedTb: 6.2,
    hddTotalTb: 40.0,
    hddUsedTb: 26.8,
    netSpeedGbps: 20,
    netCurrentGbps: 17.5,
    containers: ['ftn-opensearch-siem', 'ftn-billing-daemon', 'ftn-ai-runtime'],
    temperatureC: 62
  },
  {
    id: 'node-03',
    name: 'FTN-CTG-HUB-03',
    location: 'Chittagong (Agrabad Coastal Hub)',
    ip: '103.145.0.14',
    status: 'optimal',
    cpuCores: 64,
    cpuUsagePct: 24,
    ramTotalGb: 128,
    ramUsedGb: 38,
    nvmeTotalTb: 1.92,
    nvmeUsedTb: 0.54,
    ssdTotalTb: 8.0,
    ssdUsedTb: 2.1,
    hddTotalTb: 40.0,
    hddUsedTb: 18.2,
    netSpeedGbps: 20,
    netCurrentGbps: 4.8,
    containers: ['ftn-wireguard-mesh', 'ftn-olt-snmp-agent'],
    temperatureC: 38
  },
  {
    id: 'node-04',
    name: 'FTN-SG-TRANSIT-04',
    location: 'Singapore (Equinix SG1 Transit)',
    ip: '103.145.0.18',
    status: 'optimal',
    cpuCores: 32,
    cpuUsagePct: 38,
    ramTotalGb: 64,
    ramUsedGb: 28,
    nvmeTotalTb: 0.96,
    nvmeUsedTb: 0.42,
    ssdTotalTb: 4.0,
    ssdUsedTb: 1.8,
    hddTotalTb: 20.0,
    hddUsedTb: 8.5,
    netSpeedGbps: 10,
    netCurrentGbps: 5.2,
    containers: ['ftn-anycast-edge-sg', 'ftn-cloudflare-bridge'],
    temperatureC: 36
  },
  {
    id: 'node-05',
    name: 'FTN-FRA-BACKUP-05',
    location: 'Frankfurt (Interxion Sovereign Vault)',
    ip: '103.145.0.22',
    status: 'optimal',
    cpuCores: 32,
    cpuUsagePct: 18,
    ramTotalGb: 64,
    ramUsedGb: 22,
    nvmeTotalTb: 0.96,
    nvmeUsedTb: 0.31,
    ssdTotalTb: 4.0,
    ssdUsedTb: 1.2,
    hddTotalTb: 80.0,
    hddUsedTb: 38.0,
    netSpeedGbps: 10,
    netCurrentGbps: 2.4,
    containers: ['ftn-kopia-backup', 'ftn-cold-archive-daemon'],
    temperatureC: 35
  }
];

const INITIAL_LOGS: RebalanceLog[] = [
  {
    id: 'log-01',
    timestamp: '2 mins ago',
    sourceNode: 'FTN-BANANI-EDGE-02',
    targetNode: 'FTN-CTG-HUB-03',
    workload: 'ftn-wireguard-mesh (Sub-Cluster)',
    reason: 'RAM saturation (89%) and high NIC rx throughput on Banani',
    resourceFreed: '16 GB RAM • 4.2 Gbps Net',
    status: 'COMPLETED'
  },
  {
    id: 'log-02',
    timestamp: '14 mins ago',
    sourceNode: 'FTN-DHAKA-CORE-01',
    targetNode: 'FTN-FRA-BACKUP-05',
    workload: 'Kopia Backup Cold Snapshot Array',
    reason: 'NVMe tiered eviction: demoted cold logs to HDD ZFS pool',
    resourceFreed: '1.4 TB NVMe freed',
    status: 'COMPLETED'
  },
  {
    id: 'log-03',
    timestamp: '38 mins ago',
    sourceNode: 'FTN-BANANI-EDGE-02',
    targetNode: 'FTN-DHAKA-CORE-01',
    workload: 'ftn-smart-dns-resolver-thread',
    reason: 'CPU hotspot (88%) mitigated via eBPF CPU affinity rebalance',
    resourceFreed: '18% CPU headroom',
    status: 'COMPLETED'
  }
];

export function FtnMultiServerMesh() {
  const [nodes, setNodes] = useState<ServerNode[]>(INITIAL_NODES);
  const [logs, setLogs] = useState<RebalanceLog[]>(INITIAL_LOGS);
  const [isAutoBalancing, setIsAutoBalancing] = useState(true);
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<ServerNode | null>(null);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [activeResourceFilter, setActiveResourceFilter] = useState<'all' | 'ram' | 'nvme' | 'ssd' | 'hdd' | 'network'>('all');
  const [meshViewMode, setMeshViewMode] = useState<'grid' | 'heatmap' | 'latency-matrix'>('heatmap');
  const [topologyHeatmapLayer, setTopologyHeatmapLayer] = useState<'stress' | 'latency' | 'bandwidth'>('stress');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Form for adding new node
  const [newNodeForm, setNewNodeForm] = useState({
    name: '',
    location: '',
    ip: '',
    cpuCores: 64,
    ramTotalGb: 128,
    nvmeTotalTb: 3.84,
    ssdTotalTb: 8.0,
    hddTotalTb: 40.0,
    netSpeedGbps: 40
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Aggregated Resource Calculations across all servers
  const clusterTotals = useMemo(() => {
    return nodes.reduce(
      (acc, node) => ({
        ramTotal: acc.ramTotal + node.ramTotalGb,
        ramUsed: acc.ramUsed + node.ramUsedGb,
        nvmeTotal: acc.nvmeTotal + node.nvmeTotalTb,
        nvmeUsed: acc.nvmeUsed + node.nvmeUsedTb,
        ssdTotal: acc.ssdTotal + node.ssdTotalTb,
        ssdUsed: acc.ssdUsed + node.ssdUsedTb,
        hddTotal: acc.hddTotal + node.hddTotalTb,
        hddUsed: acc.hddUsed + node.hddUsedTb,
        netCapacity: acc.netCapacity + node.netSpeedGbps,
        netThroughput: acc.netThroughput + node.netCurrentGbps,
        totalCores: acc.totalCores + node.cpuCores,
        totalContainers: acc.totalContainers + node.containers.length
      }),
      {
        ramTotal: 0,
        ramUsed: 0,
        nvmeTotal: 0,
        nvmeUsed: 0,
        ssdTotal: 0,
        ssdUsed: 0,
        hddTotal: 0,
        hddUsed: 0,
        netCapacity: 0,
        netThroughput: 0,
        totalCores: 0,
        totalContainers: 0
      }
    );
  }, [nodes]);

  // Simulate Autonomous Rebalancing Engine trigger
  const triggerAutonomousRebalance = () => {
    setIsRebalancing(true);
    showToast('Autonomous eBPF engine analyzing RAM, NVMe, SSD, HDD, and Network pressure...');

    setTimeout(() => {
      // Find the most loaded node and the least loaded node
      setNodes(prevNodes => {
        const banani = prevNodes.find(n => n.id === 'node-02');
        const ctg = prevNodes.find(n => n.id === 'node-03');

        if (!banani || !ctg) return prevNodes;

        // Shift a container from Banani to Chittagong
        const containerToShift = 'ftn-ai-runtime';
        const updatedNodes = prevNodes.map(node => {
          if (node.id === 'node-02') {
            return {
              ...node,
              status: 'optimal' as const,
              ramUsedGb: 88,
              cpuUsagePct: 54,
              netCurrentGbps: 11.2,
              containers: node.containers.filter(c => c !== containerToShift),
              temperatureC: 48
            };
          }
          if (node.id === 'node-03') {
            return {
              ...node,
              ramUsedGb: node.ramUsedGb + 26,
              cpuUsagePct: node.cpuUsagePct + 24,
              netCurrentGbps: node.netCurrentGbps + 6.3,
              containers: [...node.containers, containerToShift],
              temperatureC: 45
            };
          }
          return node;
        });

        return updatedNodes;
      });

      // Add a live log
      const newLog: RebalanceLog = {
        id: `log-${Date.now()}`,
        timestamp: 'Just now',
        sourceNode: 'FTN-BANANI-EDGE-02',
        targetNode: 'FTN-CTG-HUB-03',
        workload: 'ftn-ai-runtime (Autonomous Inference Loop)',
        reason: 'Autonomous balancing: Alleviated high RAM (114GB -> 88GB) & eBPF Net overload',
        resourceFreed: '26 GB RAM • 6.3 Gbps Net • 30% CPU',
        status: 'COMPLETED'
      };

      setLogs(prev => [newLog, ...prev]);
      setIsRebalancing(false);
      showToast('Autonomous Load-Balancing successful: Fleet workloads redistributed perfectly!');
    }, 1600);
  };

  // Simulate Workload Spike on a node to show real-time detection
  const simulateWorkloadSpike = () => {
    setNodes(prev => 
      prev.map(node => {
        if (node.id === 'node-02') {
          return {
            ...node,
            status: 'warning' as const,
            ramUsedGb: 118,
            cpuUsagePct: 91,
            netCurrentGbps: 18.8,
            temperatureC: 68
          };
        }
        return node;
      })
    );
    showToast('Injected artificial load spike on FTN-BANANI-EDGE-02! Watch autonomous balancing engage.');
  };

  // Add new server node
  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeForm.name || !newNodeForm.ip) return;

    const newNode: ServerNode = {
      id: `node-${Date.now()}`,
      name: newNodeForm.name,
      location: newNodeForm.location || 'Local FTN Cluster',
      ip: newNodeForm.ip,
      status: 'optimal',
      cpuCores: Number(newNodeForm.cpuCores),
      cpuUsagePct: 15,
      ramTotalGb: Number(newNodeForm.ramTotalGb),
      ramUsedGb: Math.round(Number(newNodeForm.ramTotalGb) * 0.2),
      nvmeTotalTb: Number(newNodeForm.nvmeTotalTb),
      nvmeUsedTb: Math.round(Number(newNodeForm.nvmeTotalTb) * 0.1 * 10) / 10,
      ssdTotalTb: Number(newNodeForm.ssdTotalTb),
      ssdUsedTb: Math.round(Number(newNodeForm.ssdTotalTb) * 0.2 * 10) / 10,
      hddTotalTb: Number(newNodeForm.hddTotalTb),
      hddUsedTb: Math.round(Number(newNodeForm.hddTotalTb) * 0.25 * 10) / 10,
      netSpeedGbps: Number(newNodeForm.netSpeedGbps),
      netCurrentGbps: 2.1,
      containers: ['ftn-node-agent', 'ftn-mesh-router'],
      temperatureC: 38
    };

    setNodes(prev => [...prev, newNode]);
    setIsAddNodeOpen(false);
    setNewNodeForm({
      name: '',
      location: '',
      ip: '',
      cpuCores: 64,
      ramTotalGb: 128,
      nvmeTotalTb: 3.84,
      ssdTotalTb: 8.0,
      hddTotalTb: 40.0,
      netSpeedGbps: 40
    });
    showToast(`Server node ${newNode.name} added and registered to mesh!`);
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

      {/* Main Header Card */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border border-gray-800/80 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                MULTI-SERVER AGGREGATION & LOAD BALANCER
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AUTONOMOUS eBPF REBALANCING
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-white tracking-tight">
              FTN Multi-Server Autonomous Resource Mesh
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              Unified aggregation of RAM, NVMe cache, enterprise SSD, cold HDD ZFS pools, and bonded Network interfaces with autonomous cross-server load-balancing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={simulateWorkloadSpike}
              className="px-3.5 py-2 rounded-xl text-xs font-mono font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Simulate high load spike on a node to test auto-balancing"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              Simulate Spike
            </button>
            <button
              onClick={triggerAutonomousRebalance}
              disabled={isRebalancing}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRebalancing ? 'animate-spin' : ''}`} />
              {isRebalancing ? 'Rebalancing...' : 'Force Auto-Balance'}
            </button>
            <button
              onClick={() => setIsAddNodeOpen(true)}
              className="px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              Add Node
            </button>
          </div>
        </div>

        {/* Unified Resource Pools Grid (RAM, NVMe, SSD, HDD, Network) */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6 pt-6 border-t border-gray-800/80 font-mono text-xs">
          {/* RAM Pool */}
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" /> POOLED RAM
              </span>
              <span className="text-cyan-400 font-bold">
                {Math.round((clusterTotals.ramUsed / clusterTotals.ramTotal) * 100)}%
              </span>
            </div>
            <div className="text-lg font-black text-white">
              {clusterTotals.ramUsed} <span className="text-xs font-normal text-gray-400">/ {clusterTotals.ramTotal} GB</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="h-full bg-cyan-400 rounded-full transition-all duration-500" 
                style={{ width: `${(clusterTotals.ramUsed / clusterTotals.ramTotal) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 block mt-1.5 truncate">Auto-NUMA Distributed</span>
          </div>

          {/* NVMe Tier */}
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> NVMe GEN5 CACHE
              </span>
              <span className="text-amber-400 font-bold">
                {Math.round((clusterTotals.nvmeUsed / clusterTotals.nvmeTotal) * 100)}%
              </span>
            </div>
            <div className="text-lg font-black text-white">
              {clusterTotals.nvmeUsed.toFixed(1)} <span className="text-xs font-normal text-gray-400">/ {clusterTotals.nvmeTotal.toFixed(1)} TB</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="h-full bg-amber-400 rounded-full transition-all duration-500" 
                style={{ width: `${(clusterTotals.nvmeUsed / clusterTotals.nvmeTotal) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 block mt-1.5 truncate">1.2M IOPS Tier-0</span>
          </div>

          {/* SSD Tier */}
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300">
                <Database className="w-3.5 h-3.5 text-blue-400" /> ENTERPRISE SSD
              </span>
              <span className="text-blue-400 font-bold">
                {Math.round((clusterTotals.ssdUsed / clusterTotals.ssdTotal) * 100)}%
              </span>
            </div>
            <div className="text-lg font-black text-white">
              {clusterTotals.ssdUsed.toFixed(1)} <span className="text-xs font-normal text-gray-400">/ {clusterTotals.ssdTotal.toFixed(1)} TB</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="h-full bg-blue-400 rounded-full transition-all duration-500" 
                style={{ width: `${(clusterTotals.ssdUsed / clusterTotals.ssdTotal) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 block mt-1.5 truncate">Container Disks & VMs</span>
          </div>

          {/* HDD Tier */}
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300">
                <HardDrive className="w-3.5 h-3.5 text-purple-400" /> COLD ZFS HDD
              </span>
              <span className="text-purple-400 font-bold">
                {Math.round((clusterTotals.hddUsed / clusterTotals.hddTotal) * 100)}%
              </span>
            </div>
            <div className="text-lg font-black text-white">
              {clusterTotals.hddUsed.toFixed(1)} <span className="text-xs font-normal text-gray-400">/ {clusterTotals.hddTotal.toFixed(1)} TB</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="h-full bg-purple-400 rounded-full transition-all duration-500" 
                style={{ width: `${(clusterTotals.hddUsed / clusterTotals.hddTotal) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 block mt-1.5 truncate">Kopia Sovereign Backups</span>
          </div>

          {/* Bonded Network Pool */}
          <div className="bg-gray-950/80 p-3.5 rounded-xl border border-gray-800/70 relative overflow-hidden col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-gray-400 mb-1">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-300">
                <Network className="w-3.5 h-3.5 text-emerald-400" /> BONDED NETWORK
              </span>
              <span className="text-emerald-400 font-bold">
                {Math.round((clusterTotals.netThroughput / clusterTotals.netCapacity) * 100)}%
              </span>
            </div>
            <div className="text-lg font-black text-white">
              {clusterTotals.netThroughput.toFixed(1)} <span className="text-xs font-normal text-gray-400">/ {clusterTotals.netCapacity} Gbps</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                style={{ width: `${(clusterTotals.netThroughput / clusterTotals.netCapacity) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 block mt-1.5 truncate">eBPF XDP Line-Rate</span>
          </div>
        </div>
      </div>

      {/* Autonomous Load Balancer Policy Strip */}
      <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Autonomous Self-Balancing Engine
              <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ACTIVE
              </span>
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Auto-evacuates nodes exceeding 80% RAM or 85% CPU; tier-migrates stale data from NVMe to SSD to HDD
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-gray-300">
            <span className="text-gray-500">Auto-Balancing:</span>
            <button
              onClick={() => {
                setIsAutoBalancing(!isAutoBalancing);
                showToast(`Auto-Balancing is now ${!isAutoBalancing ? 'ENABLED' : 'PAUSED'}`);
              }}
              className={`font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                isAutoBalancing ? 'bg-emerald-500 text-black' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {isAutoBalancing ? 'ON (Self-Balancing)' : 'PAUSED'}
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-900/90 border border-gray-800 p-2.5 rounded-2xl">
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={() => setMeshViewMode('grid')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              meshViewMode === 'grid'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Fleet Grid
          </button>
          <button
            onClick={() => setMeshViewMode('heatmap')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              meshViewMode === 'heatmap'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            Real-Time Heat Map (Bottlenecks)
          </button>
          <button
            onClick={() => setMeshViewMode('latency-matrix')}
            className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              meshViewMode === 'latency-matrix'
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            Global Latency Matrix
          </button>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" /> &lt;50% Normal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400" /> 50-69% Nominal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> 70-84% Elevated
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> &gt;85% Bottleneck
          </span>
        </div>
      </div>

      {/* View Mode 1: Real-Time Heat Map Layer */}
      {meshViewMode === 'heatmap' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Active Bottleneck Diagnostic Banner */}
          <div className="bg-gradient-to-r from-amber-950/40 via-gray-900 to-rose-950/30 border border-amber-500/40 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400">BOTTLENECK DETECTED</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    FTN-BANANI-EDGE-02
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-mono mt-1">
                  Egress Network at <span className="text-rose-400 font-bold">87.5% capacity (17.5/20 Gbps)</span> and RAM pressure at <span className="text-amber-400 font-bold">89.1%</span>. Risk of packet buffer queues.
                </p>
              </div>
            </div>

            <button
              onClick={triggerAutonomousRebalance}
              className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Auto-Resolve Bottleneck
            </button>
          </div>

          {/* VISUAL NETWORK TOPOLOGY HEATMAP */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    Visual Network Topology Heatmap
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    OPTICAL MESH GRAPH
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono">
                  Color-coded intensity mapping across global edge POPs and core datacenters
                </p>
              </div>

              {/* Intensity Mapping Metric Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-gray-950 rounded-xl border border-gray-800 font-mono text-xs">
                <button
                  onClick={() => setTopologyHeatmapLayer('stress')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                    topologyHeatmapLayer === 'stress'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Hardware Stress
                </button>
                <button
                  onClick={() => setTopologyHeatmapLayer('latency')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                    topologyHeatmapLayer === 'latency'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Latency (RTT)
                </button>
                <button
                  onClick={() => setTopologyHeatmapLayer('bandwidth')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-semibold ${
                    topologyHeatmapLayer === 'bandwidth'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Bandwidth Flow
                </button>
              </div>
            </div>

            {/* SVG Interactive Topology Canvas */}
            <div className="relative w-full bg-gray-950/90 rounded-xl border border-gray-800/80 p-4 overflow-hidden">
              <svg 
                viewBox="0 0 840 400" 
                className="w-full h-auto max-h-[460px] select-none font-mono"
              >
                <defs>
                  {/* Glowing gradients for stress aura */}
                  <radialGradient id="stress-rose" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.7" />
                    <stop offset="60%" stopColor="#f43f5e" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="stress-cyan" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.5" />
                    <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="stress-emerald" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
                    <stop offset="60%" stopColor="#10b981" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="stress-amber" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
                    <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                  </radialGradient>

                  {/* Filter for glow */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Grid Background Lines */}
                <pattern id="topo-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1f2937" strokeWidth="0.5" strokeOpacity="0.4" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#topo-grid)" />

                {/* TOPOLOGY INTER-NODE LINKS */}
                {/* 1. Dhaka Core <-> Banani Edge */}
                <g>
                  <line 
                    x1="260" y1="160" x2="380" y2="100" 
                    stroke={topologyHeatmapLayer === 'latency' ? '#10b981' : topologyHeatmapLayer === 'bandwidth' ? '#f43f5e' : '#f59e0b'} 
                    strokeWidth={topologyHeatmapLayer === 'bandwidth' ? '4' : '2'}
                    strokeDasharray={topologyHeatmapLayer === 'latency' ? '4 3' : 'none'}
                    className={topologyHeatmapLayer === 'latency' ? 'animate-pulse' : ''}
                  />
                  <rect x="300" y="115" width="46" height="18" rx="4" fill="#030712" stroke="#374151" strokeWidth="0.8" />
                  <text x="323" y="128" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">0.8 ms</text>
                </g>

                {/* 2. Dhaka Core <-> Chittagong Hub */}
                <g>
                  <line 
                    x1="260" y1="160" x2="480" y2="230" 
                    stroke={topologyHeatmapLayer === 'latency' ? '#10b981' : topologyHeatmapLayer === 'bandwidth' ? '#06b6d4' : '#10b981'} 
                    strokeWidth="2.5"
                    strokeDasharray="5 3"
                  />
                  <rect x="350" y="185" width="46" height="18" rx="4" fill="#030712" stroke="#374151" strokeWidth="0.8" />
                  <text x="373" y="198" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">5.2 ms</text>
                </g>

                {/* 3. Banani Edge <-> Chittagong Hub */}
                <g>
                  <line 
                    x1="380" y1="100" x2="480" y2="230" 
                    stroke={topologyHeatmapLayer === 'latency' ? '#10b981' : topologyHeatmapLayer === 'bandwidth' ? '#06b6d4' : '#f59e0b'} 
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  <rect x="420" y="155" width="46" height="18" rx="4" fill="#030712" stroke="#374151" strokeWidth="0.8" />
                  <text x="443" y="168" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="bold">5.9 ms</text>
                </g>

                {/* 4. Chittagong Hub <-> Singapore Transit */}
                <g>
                  <line 
                    x1="480" y1="230" x2="710" y2="280" 
                    stroke={topologyHeatmapLayer === 'latency' ? '#06b6d4' : topologyHeatmapLayer === 'bandwidth' ? '#10b981' : '#06b6d4'} 
                    strokeWidth={topologyHeatmapLayer === 'bandwidth' ? '3' : '2'}
                    strokeDasharray="6 3"
                  />
                  <rect x="580" y="245" width="50" height="18" rx="4" fill="#030712" stroke="#374151" strokeWidth="0.8" />
                  <text x="605" y="258" fill="#06b6d4" fontSize="9" textAnchor="middle" fontWeight="bold">28.1 ms</text>
                </g>

                {/* 5. Dhaka Core <-> Singapore Transit */}
                <g>
                  <line 
                    x1="260" y1="160" x2="710" y2="280" 
                    stroke={topologyHeatmapLayer === 'latency' ? '#06b6d4' : topologyHeatmapLayer === 'bandwidth' ? '#06b6d4' : '#06b6d4'} 
                    strokeWidth="2"
                    strokeDasharray="3 3"
                  />
                  <rect x="470" y="208" width="50" height="18" rx="4" fill="#030712" stroke="#374151" strokeWidth="0.8" />
                  <text x="495" y="221" fill="#06b6d4" fontSize="9" textAnchor="middle" fontWeight="bold">32.4 ms</text>
                </g>

                {/* 6. Dhaka Core <-> Frankfurt Vault */}
                <g>
                  <line 
                    x1="260" y1="160" x2="110" y2="290" 
                    stroke={topologyHeatmapLayer === 'latency' ? '#f59e0b' : topologyHeatmapLayer === 'bandwidth' ? '#10b981' : '#06b6d4'} 
                    strokeWidth="2"
                    strokeDasharray="5 5"
                  />
                  <rect x="160" y="220" width="54" height="18" rx="4" fill="#030712" stroke="#374151" strokeWidth="0.8" />
                  <text x="187" y="233" fill="#f59e0b" fontSize="9" textAnchor="middle" fontWeight="bold">114.2 ms</text>
                </g>

                {/* 7. Singapore Transit <-> Frankfurt Vault */}
                <g>
                  <line 
                    x1="710" y1="280" x2="110" y2="290" 
                    stroke="#374151" 
                    strokeWidth="1"
                    strokeDasharray="2 4"
                    strokeOpacity="0.6"
                  />
                  <rect x="390" y="295" width="54" height="18" rx="4" fill="#030712" stroke="#374151" strokeWidth="0.8" />
                  <text x="417" y="308" fill="#9ca3af" fontSize="9" textAnchor="middle">138.5 ms</text>
                </g>

                {/* TOPOLOGY NODES */}
                {/* NODE 1: DHAKA CORE (x=260, y=160) */}
                <g 
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => {
                    const node = nodes.find(n => n.id === 'node-01');
                    if (node) setSelectedNode(node);
                  }}
                  onMouseEnter={() => setHoveredNodeId('node-01')}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  <circle cx="260" cy="160" r="38" fill="url(#stress-cyan)" />
                  <circle cx="260" cy="160" r="18" fill="#030712" stroke="#06b6d4" strokeWidth="2.5" />
                  <circle cx="260" cy="160" r="6" fill="#06b6d4" />
                  <text x="260" y="200" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">DHAKA CORE</text>
                  <text x="260" y="214" fill="#9ca3af" fontSize="9" textAnchor="middle">42% CPU • 44°C</text>
                </g>

                {/* NODE 2: BANANI EDGE (x=380, y=100) - HOT / CRITICAL STRESS */}
                <g 
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => {
                    const node = nodes.find(n => n.id === 'node-02');
                    if (node) setSelectedNode(node);
                  }}
                  onMouseEnter={() => setHoveredNodeId('node-02')}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  <circle cx="380" cy="100" r="54" fill="url(#stress-rose)" className="animate-pulse" />
                  <circle cx="380" cy="100" r="22" fill="#030712" stroke="#f43f5e" strokeWidth="3" />
                  <circle cx="380" cy="100" r="7" fill="#f43f5e" />
                  <rect x="408" y="76" width="70" height="20" rx="4" fill="#881337" stroke="#f43f5e" strokeWidth="1" />
                  <text x="443" y="90" fill="#fecdd3" fontSize="9" fontWeight="bold" textAnchor="middle">HOT (89% RAM)</text>
                  <text x="380" y="142" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">BANANI EDGE</text>
                  <text x="380" y="156" fill="#f43f5e" fontSize="9" fontWeight="bold" textAnchor="middle">84% CPU • 62°C (17.5G)</text>
                </g>

                {/* NODE 3: CHITTAGONG COASTAL HUB (x=480, y=230) */}
                <g 
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => {
                    const node = nodes.find(n => n.id === 'node-03');
                    if (node) setSelectedNode(node);
                  }}
                  onMouseEnter={() => setHoveredNodeId('node-03')}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  <circle cx="480" cy="230" r="34" fill="url(#stress-emerald)" />
                  <circle cx="480" cy="230" r="16" fill="#030712" stroke="#10b981" strokeWidth="2" />
                  <circle cx="480" cy="230" r="5" fill="#10b981" />
                  <text x="480" y="266" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">CHITTAGONG HUB</text>
                  <text x="480" y="280" fill="#10b981" fontSize="9" textAnchor="middle">24% CPU • 30% RAM</text>
                </g>

                {/* NODE 4: SINGAPORE TRANSIT POP (x=710, y=280) */}
                <g 
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => {
                    const node = nodes.find(n => n.id === 'node-04');
                    if (node) setSelectedNode(node);
                  }}
                  onMouseEnter={() => setHoveredNodeId('node-04')}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  <circle cx="710" cy="280" r="36" fill="url(#stress-cyan)" />
                  <circle cx="710" cy="280" r="17" fill="#030712" stroke="#06b6d4" strokeWidth="2" />
                  <circle cx="710" cy="280" r="5" fill="#06b6d4" />
                  <text x="710" y="318" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">SINGAPORE TRANSIT</text>
                  <text x="710" y="332" fill="#9ca3af" fontSize="9" textAnchor="middle">Equinix SG1 • 44% RAM</text>
                </g>

                {/* NODE 5: FRANKFURT VAULT (x=110, y=290) */}
                <g 
                  className="cursor-pointer transition-transform hover:scale-105"
                  onClick={() => {
                    const node = nodes.find(n => n.id === 'node-05');
                    if (node) setSelectedNode(node);
                  }}
                  onMouseEnter={() => setHoveredNodeId('node-05')}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  <circle cx="110" cy="290" r="32" fill="url(#stress-cyan)" />
                  <circle cx="110" cy="290" r="16" fill="#030712" stroke="#3b82f6" strokeWidth="2" />
                  <circle cx="110" cy="290" r="5" fill="#3b82f6" />
                  <text x="110" y="326" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">FRANKFURT VAULT</text>
                  <text x="110" y="340" fill="#9ca3af" fontSize="9" textAnchor="middle">ZFS Cold Storage • 39°C</text>
                </g>
              </svg>

              {/* Real-time Heat Legend & Telemetry Bar */}
              <div className="mt-3 pt-3 border-t border-gray-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono">
                <div className="flex items-center gap-4 text-gray-400">
                  <span className="text-gray-300 font-bold uppercase">Intensity Scale:</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> &lt;30ms / &lt;50% Normal
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> 30-50ms / 50-69% Nominal
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> 50-100ms / 70-84% Elevated
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> &gt;100ms / &gt;85% Critical Heat
                  </span>
                </div>

                <div className="flex items-center gap-3 text-gray-400">
                  <span>Min RTT: <span className="text-emerald-400 font-bold">0.8 ms</span></span>
                  <span>Cross-Border: <span className="text-cyan-400 font-bold">28.1 ms (SG)</span></span>
                  <span>Transit Load: <span className="text-rose-400 font-bold">17.5 Gbps (Peak)</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Heat Map Matrix Table */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-base font-bold text-white font-display">Multi-Dimensional Server Heat Map</h3>
                <p className="text-xs text-gray-400 font-mono">Real-time thermal, network saturation, memory, and disk I/O heat signature</p>
              </div>
              <span className="text-xs font-mono text-cyan-400">Sampling: 1000ms eBPF telemetry</span>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800 bg-gray-950/60">
                    <th className="px-3.5 py-3">SERVER NODE</th>
                    <th className="px-3.5 py-3 text-center">CPU LOAD</th>
                    <th className="px-3.5 py-3 text-center">RAM PRESSURE</th>
                    <th className="px-3.5 py-3 text-center">NVMe I/O</th>
                    <th className="px-3.5 py-3 text-center">SSD DISK</th>
                    <th className="px-3.5 py-3 text-center">HDD ZFS</th>
                    <th className="px-3.5 py-3 text-center">NET INGRESS</th>
                    <th className="px-3.5 py-3 text-center">NET EGRESS</th>
                    <th className="px-3.5 py-3 text-center">PACKET QUEUE</th>
                    <th className="px-3.5 py-3 text-center">THERMAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {nodes.map(node => {
                    const ramPct = Math.round((node.ramUsedGb / node.ramTotalGb) * 100);
                    const nvmePct = Math.round((node.nvmeUsedTb / node.nvmeTotalTb) * 100);
                    const ssdPct = Math.round((node.ssdUsedTb / node.ssdTotalTb) * 100);
                    const hddPct = Math.round((node.hddUsedTb / node.hddTotalTb) * 100);
                    const netPct = Math.round((node.netCurrentGbps / node.netSpeedGbps) * 100);

                    // Helper to generate color class
                    const getHeatBadge = (val: number, label: string) => {
                      let color = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
                      if (val >= 85) color = 'bg-rose-500/25 text-rose-300 border-rose-500/60 shadow-[0_0_8px_rgba(244,63,94,0.3)] animate-pulse font-bold';
                      else if (val >= 70) color = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
                      else if (val >= 45) color = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';

                      return (
                        <span className={`px-2.5 py-1 rounded-lg border inline-block min-w-[58px] text-center ${color}`}>
                          {label}
                        </span>
                      );
                    };

                    return (
                      <tr key={node.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="px-3.5 py-3.5">
                          <div className="font-bold text-white">{node.name}</div>
                          <div className="text-[10px] text-gray-500">{node.location}</div>
                        </td>
                        <td className="px-3.5 py-3.5 text-center">
                          {getHeatBadge(node.cpuUsagePct, `${node.cpuUsagePct}%`)}
                        </td>
                        <td className="px-3.5 py-3.5 text-center">
                          {getHeatBadge(ramPct, `${ramPct}%`)}
                        </td>
                        <td className="px-3.5 py-3.5 text-center">
                          {getHeatBadge(nvmePct, `${nvmePct}%`)}
                        </td>
                        <td className="px-3.5 py-3.5 text-center">
                          {getHeatBadge(ssdPct, `${ssdPct}%`)}
                        </td>
                        <td className="px-3.5 py-3.5 text-center">
                          {getHeatBadge(hddPct, `${hddPct}%`)}
                        </td>
                        <td className="px-3.5 py-3.5 text-center">
                          {getHeatBadge(Math.round(netPct * 0.6), `${(node.netCurrentGbps * 0.6).toFixed(1)}G`)}
                        </td>
                        <td className="px-3.5 py-3.5 text-center">
                          {getHeatBadge(netPct, `${node.netCurrentGbps.toFixed(1)}G`)}
                        </td>
                        <td className="px-3.5 py-3.5 text-center">
                          {getHeatBadge(node.status === 'warning' ? 88 : 12, node.status === 'warning' ? 'HIGH' : '0 DROPS')}
                        </td>
                        <td className="px-3.5 py-3.5 text-center">
                          {getHeatBadge(node.temperatureC > 60 ? 86 : 35, `${node.temperatureC}°C`)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View Mode 2: Global Latency Matrix Layer */}
      {meshViewMode === 'latency-matrix' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div>
              <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                Global Inter-Node Latency & Bottleneck Grid
              </h3>
              <p className="text-xs text-gray-400 font-mono">Real-time round-trip time (RTT) and optical transit path health</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">Optical BGP DWDM Mesh</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center font-mono text-xs">
              <thead>
                <tr className="text-gray-400 bg-gray-950/60 border-b border-gray-800">
                  <th className="px-4 py-3 text-left">FROM / TO</th>
                  <th className="px-4 py-3">DHAKA CORE</th>
                  <th className="px-4 py-3">BANANI EDGE</th>
                  <th className="px-4 py-3">CHITTAGONG HUB</th>
                  <th className="px-4 py-3">SINGAPORE TRANSIT</th>
                  <th className="px-4 py-3">FRANKFURT VAULT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                <tr>
                  <td className="px-4 py-3 text-left font-bold text-white">DHAKA CORE</td>
                  <td className="px-4 py-3 text-gray-600">—</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold bg-emerald-950/10">0.8 ms</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold bg-emerald-950/10">5.2 ms</td>
                  <td className="px-4 py-3 text-cyan-400 font-bold bg-cyan-950/10">32.4 ms</td>
                  <td className="px-4 py-3 text-cyan-400 font-bold bg-cyan-950/10">114.2 ms</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-left font-bold text-white">BANANI EDGE</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold bg-emerald-950/10">0.8 ms</td>
                  <td className="px-4 py-3 text-gray-600">—</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold bg-emerald-950/10">5.9 ms</td>
                  <td className="px-4 py-3 text-amber-400 font-bold bg-amber-950/20 border border-amber-500/30">
                    44.8 ms <span className="text-[10px] block text-amber-400">(Jitter 8ms)</span>
                  </td>
                  <td className="px-4 py-3 text-cyan-400 font-bold bg-cyan-950/10">116.5 ms</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-left font-bold text-white">CHITTAGONG HUB</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold bg-emerald-950/10">5.2 ms</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold bg-emerald-950/10">5.9 ms</td>
                  <td className="px-4 py-3 text-gray-600">—</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold bg-emerald-950/10">28.1 ms</td>
                  <td className="px-4 py-3 text-cyan-400 font-bold bg-cyan-950/10">118.0 ms</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-left font-bold text-white">SINGAPORE TRANSIT</td>
                  <td className="px-4 py-3 text-cyan-400 font-bold bg-cyan-950/10">32.4 ms</td>
                  <td className="px-4 py-3 text-amber-400 font-bold bg-amber-950/20">44.8 ms</td>
                  <td className="px-4 py-3 text-emerald-400 font-bold bg-emerald-950/10">28.1 ms</td>
                  <td className="px-4 py-3 text-gray-600">—</td>
                  <td className="px-4 py-3 text-cyan-400 font-bold bg-cyan-950/10">138.5 ms</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-left font-bold text-white">FRANKFURT VAULT</td>
                  <td className="px-4 py-3 text-cyan-400 font-bold bg-cyan-950/10">114.2 ms</td>
                  <td className="px-4 py-3 text-cyan-400 font-bold bg-cyan-950/10">116.5 ms</td>
                  <td className="px-4 py-3 text-cyan-400 font-bold bg-cyan-950/10">118.0 ms</td>
                  <td className="px-4 py-3 text-cyan-400 font-bold bg-cyan-950/10">138.5 ms</td>
                  <td className="px-4 py-3 text-gray-600">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Multi-Server Fleet Grid */}
      {meshViewMode === 'grid' && (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Server Fleet Node Matrix</h2>
            <p className="text-xs text-gray-400 font-mono">Live hardware telemetry and allocated workloads per physical machine</p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            {nodes.length} Nodes Online • {clusterTotals.totalCores} vCPUs • {clusterTotals.totalContainers} Microservices
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes.map(node => {
            const ramPct = Math.round((node.ramUsedGb / node.ramTotalGb) * 100);
            const nvmePct = Math.round((node.nvmeUsedTb / node.nvmeTotalTb) * 100);
            const ssdPct = Math.round((node.ssdUsedTb / node.ssdTotalTb) * 100);
            const hddPct = Math.round((node.hddUsedTb / node.hddTotalTb) * 100);
            const netPct = Math.round((node.netCurrentGbps / node.netSpeedGbps) * 100);

            const isHighLoad = ramPct > 80 || node.cpuUsagePct > 80;

            return (
              <div 
                key={node.id}
                className={`bg-gray-900 border rounded-2xl p-5 shadow-xl transition-all flex flex-col justify-between ${
                  isHighLoad 
                    ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/10 to-gray-900 shadow-amber-500/5' 
                    : 'border-gray-800/80 hover:border-gray-700'
                }`}
              >
                <div>
                  {/* Node Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono text-sm">{node.name}</span>
                        <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                          isHighLoad
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {isHighLoad ? 'HOT / REBALANCING' : 'OPTIMAL'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 font-mono mt-0.5 flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-gray-500" />
                        {node.location} • {node.ip}
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs">
                      <span className={`text-xs font-bold ${node.temperatureC > 60 ? 'text-amber-400' : 'text-gray-400'}`}>
                        {node.temperatureC}°C
                      </span>
                      <span className="block text-[10px] text-gray-500">{node.cpuCores} Cores</span>
                    </div>
                  </div>

                  {/* Hardware Resource Sliders */}
                  <div className="space-y-3 font-mono text-xs my-4">
                    {/* RAM */}
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-cyan-400" /> RAM
                        </span>
                        <span className={ramPct > 80 ? 'text-amber-400 font-bold' : 'text-white'}>
                          {node.ramUsedGb} / {node.ramTotalGb} GB ({ramPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-950 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            ramPct > 80 ? 'bg-amber-400' : 'bg-cyan-400'
                          }`} 
                          style={{ width: `${ramPct}%` }} 
                        />
                      </div>
                    </div>

                    {/* NVMe */}
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" /> NVMe Cache
                        </span>
                        <span className="text-white">
                          {node.nvmeUsedTb} / {node.nvmeTotalTb} TB ({nvmePct}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-950 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${nvmePct}%` }} />
                      </div>
                    </div>

                    {/* SSD & HDD in 2 cols */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div>
                        <div className="flex justify-between text-gray-400 mb-1 text-[10px]">
                          <span>SSD App Disks</span>
                          <span className="text-white font-bold">{ssdPct}%</span>
                        </div>
                        <div className="w-full bg-gray-950 rounded-full h-1 overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${ssdPct}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-gray-400 mb-1 text-[10px]">
                          <span>ZFS Cold HDD</span>
                          <span className="text-white font-bold">{hddPct}%</span>
                        </div>
                        <div className="w-full bg-gray-950 rounded-full h-1 overflow-hidden">
                          <div className="h-full bg-purple-400 rounded-full" style={{ width: `${hddPct}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Network Throughput */}
                    <div>
                      <div className="flex justify-between text-gray-400 mb-1 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Network className="w-3 h-3 text-emerald-400" /> Net Bandwidth
                        </span>
                        <span className="text-white">
                          {node.netCurrentGbps} / {node.netSpeedGbps} Gbps ({netPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-950 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${netPct}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Active Containers & Workloads */}
                  <div className="pt-2 border-t border-gray-800/80">
                    <span className="text-[10px] text-gray-500 font-mono block mb-1.5">
                      HOSTED MICROSERVICES ({node.containers.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {node.containers.map((cnt, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded-md bg-gray-950 border border-gray-800 text-[10px] font-mono text-cyan-300"
                        >
                          {cnt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedNode(node);
                      showToast(`Opened hardware telemetry diagnostics for ${node.name}`);
                    }}
                    className="flex-1 py-1.5 rounded-lg text-xs font-mono font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer text-center"
                  >
                    Inspect Hardware
                  </button>
                  <button
                    onClick={() => {
                      triggerAutonomousRebalance();
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors cursor-pointer"
                    title="Migrate workloads to cool nodes"
                  >
                    Rebalance
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Autonomous Rebalancing Log Stream */}
      <div className="bg-gray-900 border border-gray-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
              Autonomous Migration & Rebalance Journal
            </h3>
            <p className="text-xs text-gray-400 font-mono">
              Real-time audit log of automated RAM, storage tiering, and network traffic shifts
            </p>
          </div>
          <span className="text-xs font-mono text-gray-500">Live eBPF Engine Feed</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="text-gray-400 bg-gray-950/60 border-b border-gray-800">
              <tr>
                <th className="px-4 py-3">TIMESTAMP</th>
                <th className="px-4 py-3">WORKLOAD / CONTAINER</th>
                <th className="px-4 py-3">MIGRATION ROUTE</th>
                <th className="px-4 py-3">AUTONOMOUS REASON</th>
                <th className="px-4 py-3">RESOURCES FREED</th>
                <th className="px-4 py-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3.5 text-gray-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3.5 text-cyan-300 font-bold">{log.workload}</td>
                  <td className="px-4 py-3.5 text-gray-300 whitespace-nowrap">
                    <span className="text-amber-400">{log.sourceNode}</span> &rarr; <span className="text-emerald-400">{log.targetNode}</span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-300">{log.reason}</td>
                  <td className="px-4 py-3.5 text-emerald-400 whitespace-nowrap">{log.resourceFreed}</td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Server Node Modal */}
      {isAddNodeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Join Server Node to Mesh</h3>
                  <p className="text-xs text-gray-400 font-mono">Aggregates RAM, NVMe, SSD, HDD, and Network</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddNodeOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddNode} className="mt-4 space-y-3 font-mono text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Server Hostname</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FTN-SYLHET-NODE-06"
                  value={newNodeForm.name}
                  onChange={(e) => setNewNodeForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">IP Address / Mesh Subnet</label>
                  <input
                    type="text"
                    required
                    placeholder="103.145.0.30"
                    value={newNodeForm.ip}
                    onChange={(e) => setNewNodeForm(p => ({ ...p, ip: e.target.value }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Data Center / Location</label>
                  <input
                    type="text"
                    placeholder="Sylhet (Zindabazar Hub)"
                    value={newNodeForm.location}
                    onChange={(e) => setNewNodeForm(p => ({ ...p, location: e.target.value }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">CPU Cores</label>
                  <input
                    type="number"
                    value={newNodeForm.cpuCores}
                    onChange={(e) => setNewNodeForm(p => ({ ...p, cpuCores: Number(e.target.value) }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Total RAM (GB)</label>
                  <input
                    type="number"
                    value={newNodeForm.ramTotalGb}
                    onChange={(e) => setNewNodeForm(p => ({ ...p, ramTotalGb: Number(e.target.value) }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">NVMe (TB)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newNodeForm.nvmeTotalTb}
                    onChange={(e) => setNewNodeForm(p => ({ ...p, nvmeTotalTb: Number(e.target.value) }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">SSD (TB)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newNodeForm.ssdTotalTb}
                    onChange={(e) => setNewNodeForm(p => ({ ...p, ssdTotalTb: Number(e.target.value) }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">HDD ZFS (TB)</label>
                  <input
                    type="number"
                    step="1"
                    value={newNodeForm.hddTotalTb}
                    onChange={(e) => setNewNodeForm(p => ({ ...p, hddTotalTb: Number(e.target.value) }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Bonded NIC Throughput (Gbps)</label>
                <input
                  type="number"
                  value={newNodeForm.netSpeedGbps}
                  onChange={(e) => setNewNodeForm(p => ({ ...p, netSpeedGbps: Number(e.target.value) }))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsAddNodeOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  Add Node & Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Node Details Inspection Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in" onClick={() => setSelectedNode(null)}>
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">{selectedNode.name}</h3>
                  <p className="text-xs text-gray-400 font-mono">{selectedNode.location} • {selectedNode.ip}</p>
                </div>
              </div>
              <button onClick={() => setSelectedNode(null)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                  <span className="text-gray-500 block text-[10px]">CPU CORES / USAGE</span>
                  <span className="text-sm font-bold text-white mt-1 block">{selectedNode.cpuCores} Cores ({selectedNode.cpuUsagePct}%)</span>
                </div>
                <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                  <span className="text-gray-500 block text-[10px]">TOTAL RAM</span>
                  <span className="text-sm font-bold text-cyan-400 mt-1 block">{selectedNode.ramUsedGb} / {selectedNode.ramTotalGb} GB</span>
                </div>
                <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                  <span className="text-gray-500 block text-[10px]">STORAGE (NVMe+SSD+HDD)</span>
                  <span className="text-sm font-bold text-amber-400 mt-1 block">{(selectedNode.nvmeTotalTb + selectedNode.ssdTotalTb + selectedNode.hddTotalTb).toFixed(1)} TB</span>
                </div>
                <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                  <span className="text-gray-500 block text-[10px]">THERMAL STATUS</span>
                  <span className="text-sm font-bold text-emerald-400 mt-1 block">{selectedNode.temperatureC}°C (Nominal)</span>
                </div>
              </div>

              <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-2">
                <span className="text-xs font-bold text-gray-300 block">HOSTED ACTIVE MICROSERVICES</span>
                <div className="flex flex-wrap gap-2">
                  {selectedNode.containers.map((c, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-700 text-cyan-300">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-gray-800">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    triggerAutonomousRebalance();
                  }}
                  className="px-4 py-2 rounded-xl font-semibold bg-cyan-500 hover:bg-cyan-400 text-black cursor-pointer"
                >
                  Trigger Targeted Rebalance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
