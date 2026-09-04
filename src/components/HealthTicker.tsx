import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Server, 
  Globe, 
  Network, 
  ExternalLink,
  Cpu,
  Database,
  Layers
} from 'lucide-react';

export interface InfrastructureComponentHealth {
  id: string;
  name: string;
  shortLabel: string;
  status: 'green' | 'amber' | 'red';
  statusText: string;
  latency: string;
  loss: string;
  activeNodes: string;
  lastProbe: string;
  telemetryNote: string;
  targetTab: string;
}

const CRITICAL_COMPONENTS: InfrastructureComponentHealth[] = [
  {
    id: 'bgp-core',
    name: 'BGP Anycast Transit (AS64512)',
    shortLabel: 'BGP CORE',
    status: 'green',
    statusText: '24/24 Peers Established',
    latency: '1.1 ms',
    loss: '0.000%',
    activeNodes: '12 PoPs (Global)',
    lastProbe: '1s ago',
    telemetryNote: 'Full-mesh EVPN fabric operating at line-rate. Zero route flap.',
    targetTab: 'bgp-visualizer'
  },
  {
    id: 'ebpf-xdp',
    name: 'eBPF In-Kernel XDP Firewall',
    shortLabel: 'eBPF XDP',
    status: 'green',
    statusText: 'Line-Rate 100Gbps Filtering',
    latency: '0.2 ms',
    loss: '0.000%',
    activeNodes: 'Kernel Mode',
    lastProbe: '2s ago',
    telemetryNote: '14 syn-flood attack vectors autonomously dropped with zero CPU penalty.',
    targetTab: 'policy-engine'
  },
  {
    id: 'smart-dns',
    name: 'FTN Anycast Smart DNS Mesh',
    shortLabel: 'SMART DNS',
    status: 'green',
    statusText: 'DoH/DoQ TLS 1.3 Active',
    latency: '2.4 ms',
    loss: '0.000%',
    activeNodes: '16 Edge Resolvers',
    lastProbe: '1s ago',
    telemetryNote: 'Resolving family safe-search and enterprise split-horizon in 8.2ms p50.',
    targetTab: 'smart-dns'
  },
  {
    id: 'gpon-olt',
    name: 'Huawei & ZTE GPON OLT Access',
    shortLabel: 'GPON OLT',
    status: 'amber',
    statusText: 'Optical Margin Variance',
    latency: '18.4 ms',
    loss: '0.003%',
    activeNodes: '2 OLTs / 8 PON Ports',
    lastProbe: '4s ago',
    telemetryNote: 'PON 0/1/3 optical margin alert (-24.1 dBm) dampening applied.',
    targetTab: 'olt'
  },
  {
    id: 'vpn-mesh',
    name: 'Multi-Protocol WireGuard Mesh',
    shortLabel: 'VPN MESH',
    status: 'green',
    statusText: '6/6 Tunnels Active',
    latency: '3.8 ms',
    loss: '0.001%',
    activeNodes: '6 Dedicated Hubs',
    lastProbe: '2s ago',
    telemetryNote: 'Zero-trust dynamic tunnels syncing across residential and cloud nodes.',
    targetTab: 'vpn-mesh'
  },
  {
    id: 'siem-engine',
    name: 'OpenSearch SIEM & Observability',
    shortLabel: 'SIEM GRID',
    status: 'green',
    statusText: 'Ingesting 14.8k eps',
    latency: '5.2 ms',
    loss: '0.000%',
    activeNodes: '3 Cluster Nodes',
    lastProbe: '3s ago',
    telemetryNote: 'Real-time NetFlow IPFIX collection and autonomous behavioral heuristics.',
    targetTab: 'opensearch'
  },
  {
    id: 'server-mesh',
    name: 'Multi-Server Resource Load Balancer',
    shortLabel: 'SERVER MESH',
    status: 'green',
    statusText: '5/5 Nodes Auto-Balanced',
    latency: '0.9 ms',
    loss: '0.000%',
    activeNodes: '5 Fleet Nodes (RAM/NVMe/SSD/HDD/Net)',
    lastProbe: '1s ago',
    telemetryNote: 'Autonomous eBPF NUMA memory and I/O tiering rebalancing actively engaged.',
    targetTab: 'multi-server'
  }
];

interface HealthTickerProps {
  onNavigate?: (tab: string) => void;
}

export function HealthTicker({ onNavigate }: HealthTickerProps) {
  const [metrics, setMetrics] = useState({
    uptime: '99.998%',
    latency: '1.2 ms',
    packetLoss: '0.001%',
  });

  const [selectedComponent, setSelectedComponent] = useState<InfrastructureComponentHealth | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        uptime: '99.998%',
        latency: `${(1.1 + Math.random() * 0.3).toFixed(1)} ms`,
        packetLoss: `${(0.001 + Math.random() * 0.001).toFixed(3)}%`,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const openDrillDown = (component?: InfrastructureComponentHealth) => {
    setSelectedComponent(component || CRITICAL_COMPONENTS[0]);
    setIsDrillDownOpen(true);
  };

  const handleNavigateToService = (tab: string) => {
    setIsDrillDownOpen(false);
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <>
      {/* Interactive Global Ticker Bar */}
      <div className="w-full bg-gray-950/90 backdrop-blur-md border-b border-gray-800/80 px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-gray-400">
        {/* Left Section: Live Grid Status & Visual Indicators */}
        <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
          <button
            onClick={() => openDrillDown(CRITICAL_COMPONENTS[0])}
            className="flex items-center gap-2 text-emerald-400 font-bold hover:text-emerald-300 transition-colors cursor-pointer group"
            title="Click to open infrastructure diagnostics"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="tracking-wide flex items-center gap-1">
              FTN GRID LIVE
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-gray-500" />
            </span>
          </button>

          <span className="hidden md:flex items-center gap-1.5 text-gray-400">
            <Clock className="w-3 h-3 text-cyan-400" /> {metrics.uptime}
          </span>

          <span className="hidden lg:flex items-center gap-1.5 text-gray-400">
            <Zap className="w-3 h-3 text-yellow-400" /> {metrics.latency}
          </span>

          <span className="hidden xl:flex items-center gap-1.5 text-gray-400">
            <AlertTriangle className="w-3 h-3 text-amber-500" /> LOSS: {metrics.packetLoss}
          </span>

          {/* Component Status Pills (Green / Amber / Red) */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-xl">
            {CRITICAL_COMPONENTS.map(comp => (
              <button
                key={comp.id}
                onClick={() => openDrillDown(comp)}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                  comp.status === 'green'
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-900/60'
                    : comp.status === 'amber'
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/40 hover:border-amber-400 hover:bg-amber-900/60 animate-pulse'
                    : 'bg-rose-950/60 text-rose-300 border-rose-500/40 hover:border-rose-400 hover:bg-rose-900/60'
                }`}
                title={`Click for ${comp.name} health report`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${
                  comp.status === 'green' ? 'bg-emerald-400' : comp.status === 'amber' ? 'bg-amber-400' : 'bg-rose-400'
                }`} />
                <span>{comp.shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Section: Action link to full status / registry */}
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <button
            onClick={() => openDrillDown()}
            className="px-2.5 py-1 rounded-md bg-gray-900 hover:bg-gray-800 text-cyan-400 border border-gray-800 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Activity className="w-3 h-3 text-cyan-400" />
            Diagnostics Report
          </button>
          {onNavigate && (
            <button
              onClick={() => onNavigate('status-page')}
              className="px-2 py-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-900 transition-colors cursor-pointer hidden sm:flex items-center gap-1"
            >
              Status Page
            </button>
          )}
        </div>
      </div>

      {/* Drill-down Health Diagnostics Modal */}
      {isDrillDownOpen && selectedComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsDrillDownOpen(false)}>
          <div 
            className="w-full max-w-3xl bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-950/80">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    FTN Infrastructure Health Diagnostics
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">
                    Real-time telemetry and autonomous component audit
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDrillDownOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Component Selector Tabs */}
            <div className="flex items-center gap-2 p-3 bg-gray-950/50 border-b border-gray-800/80 overflow-x-auto">
              {CRITICAL_COMPONENTS.map(comp => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComponent(comp)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer ${
                    selectedComponent.id === comp.id
                      ? 'bg-cyan-500 text-black font-bold shadow-md'
                      : 'bg-gray-900 text-gray-300 hover:bg-gray-800 border border-gray-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${
                    comp.status === 'green' ? 'bg-emerald-400' : comp.status === 'amber' ? 'bg-amber-400' : 'bg-rose-400'
                  } ${selectedComponent.id === comp.id ? 'bg-black' : ''}`} />
                  {comp.shortLabel}
                </button>
              ))}
            </div>

            {/* Selected Component Detailed Report */}
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-xl font-bold text-white">{selectedComponent.name}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold ${
                      selectedComponent.status === 'green'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : selectedComponent.status === 'amber'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}>
                      {selectedComponent.status === 'green' ? 'HEALTHY & VERIFIED' : 'ATTENTION REQUIRED'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    Status: <span className="text-white font-semibold">{selectedComponent.statusText}</span> • Last probe: {selectedComponent.lastProbe}
                  </p>
                </div>

                <button
                  onClick={() => handleNavigateToService(selectedComponent.targetTab)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold font-mono bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
                >
                  Drill Down into Module
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                  <span className="text-gray-500 block text-[10px]">ROUND TRIP LATENCY</span>
                  <span className="text-base font-bold text-cyan-400 mt-1 block">{selectedComponent.latency}</span>
                </div>
                <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                  <span className="text-gray-500 block text-[10px]">PACKET LOSS RATE</span>
                  <span className="text-base font-bold text-emerald-400 mt-1 block">{selectedComponent.loss}</span>
                </div>
                <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                  <span className="text-gray-500 block text-[10px]">DISTRIBUTED NODES</span>
                  <span className="text-base font-bold text-white mt-1 block">{selectedComponent.activeNodes}</span>
                </div>
                <div className="p-3 bg-gray-950 rounded-xl border border-gray-800">
                  <span className="text-gray-500 block text-[10px]">HEALTH SLA SCORE</span>
                  <span className="text-base font-bold text-emerald-400 mt-1 block">99.998%</span>
                </div>
              </div>

              {/* Telemetry Heuristic Note */}
              <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  AUTONOMOUS TELEMETRY & OBSERVABILITY LOG
                </span>
                <p className="text-xs text-gray-300 font-mono leading-relaxed">
                  {selectedComponent.telemetryNote}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-gray-950 border-t border-gray-800 text-xs font-mono">
              <div className="flex items-center gap-3">
                {onNavigate && (
                  <>
                    <button
                      onClick={() => handleNavigateToService('status-page')}
                      className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Activity className="w-3 h-3 text-cyan-400" />
                      Open Full Status Page
                    </button>
                    <span className="text-gray-700">•</span>
                    <button
                      onClick={() => handleNavigateToService('multi-server')}
                      className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Cpu className="w-3 h-3 text-amber-400" />
                      Multi-Server Balancer
                    </button>
                    <span className="text-gray-700">•</span>
                    <button
                      onClick={() => handleNavigateToService('scaling-controller')}
                      className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Activity className="w-3 h-3 text-cyan-400" />
                      Scaling Controller
                    </button>
                    <span className="text-gray-700">•</span>
                    <button
                      onClick={() => handleNavigateToService('resource-dashboard')}
                      className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Layers className="w-3 h-3 text-purple-400" />
                      Resource Dashboard
                    </button>
                    <button
                      onClick={() => handleNavigateToService('service-registry')}
                      className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <Server className="w-3 h-3 text-emerald-400" />
                      View Service Registry
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() => setIsDrillDownOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
