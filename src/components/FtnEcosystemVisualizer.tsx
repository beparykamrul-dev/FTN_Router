import React, { useState, useMemo } from 'react';
import {
  Network,
  Server,
  Layers,
  Cpu,
  ShieldCheck,
  BrainCircuit,
  Database,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Activity,
  Terminal,
  Zap,
  Lock,
  Radio,
  Globe,
  ArrowRight,
  X,
  Play,
  Filter
} from 'lucide-react';
import { cn } from '../utils';

export interface VisualizerNode {
  id: string;
  name: string;
  layer: 'Core' | 'Network' | 'Security' | 'Registry' | 'Telemetry' | 'AI' | 'Edge';
  container: string;
  image: string;
  domain: string;
  port: number;
  protocol: string;
  status: 'HEALTHY' | 'DEGRADED' | 'STANDBY';
  latencyMs: number;
  uptime: string;
  cpuPercent: number;
  memoryMb: number;
  restarts: number;
  targetDashboard: string;
  dashboardLabel: string;
  dependencies: string[]; // Node IDs this service depends on
  x: number; // Staggered layout coordinate
  y: number;
}

const LAYER_CONFIG = {
  Core: { label: 'Core / Kernel', color: '#00f0ff', bg: 'rgba(0, 240, 255, 0.1)', border: 'rgba(0, 240, 255, 0.4)' },
  Network: { label: 'Network / ZTNA', color: '#00ff66', bg: 'rgba(0, 255, 102, 0.1)', border: 'rgba(0, 255, 102, 0.4)' },
  Security: { label: 'Security & PKI', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.4)' },
  Registry: { label: 'Service Registry', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.4)' },
  Telemetry: { label: 'Telemetry & Flows', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)', border: 'rgba(20, 184, 166, 0.4)' },
  AI: { label: 'AI & Cognitive', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.4)' },
  Edge: { label: 'Edge Applications', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)', border: 'rgba(236, 72, 153, 0.4)' }
};

const ECOSYSTEM_NODES: VisualizerNode[] = [
  // Layer: Core (x: 100 - 180)
  {
    id: 'ftn-kernel',
    name: 'Linux Kernel & eBPF XDP',
    layer: 'Core',
    container: 'ftn-kernel-core',
    image: 'ftn/kernel-lkm:6.6-rt',
    domain: 'kernel.internal.lan',
    port: 0,
    protocol: 'Kernel / Ring 0',
    status: 'HEALTHY',
    latencyMs: 0.2,
    uptime: '99.999%',
    cpuPercent: 18,
    memoryMb: 512,
    restarts: 0,
    targetDashboard: 'core-router',
    dashboardLabel: 'Core Router & MikroTik',
    dependencies: [],
    x: 80,
    y: 160
  },
  {
    id: 'ftn-core-noc',
    name: 'FTN Core Autonomous NOC',
    layer: 'Core',
    container: 'ftn-core-noc',
    image: 'ftn/control-plane:v3.8',
    domain: 'noc.familytimenet.com',
    port: 8080,
    protocol: 'gRPC / HTTP/2',
    status: 'HEALTHY',
    latencyMs: 1.1,
    uptime: '99.998%',
    cpuPercent: 32,
    memoryMb: 1420,
    restarts: 0,
    targetDashboard: 'dashboard',
    dashboardLabel: 'Core Control Plane',
    dependencies: ['ftn-kernel'],
    x: 80,
    y: 340
  },

  // Layer: Security (x: 320)
  {
    id: 'ftn-iam-auth',
    name: 'IAM & Access Control Matrix',
    layer: 'Security',
    container: 'ftn-iam-rbac',
    image: 'ftn/auth-engine:v2.4',
    domain: 'iam.familytimenet.com',
    port: 9000,
    protocol: 'OAuth2 / mTLS',
    status: 'HEALTHY',
    latencyMs: 2.3,
    uptime: '99.995%',
    cpuPercent: 14,
    memoryMb: 768,
    restarts: 0,
    targetDashboard: 'access-control',
    dashboardLabel: 'Access Control Matrix',
    dependencies: ['ftn-core-noc'],
    x: 310,
    y: 120
  },
  {
    id: 'ftn-pki-vault',
    name: 'Sovereign Root PKI & CA',
    layer: 'Security',
    container: 'ftn-pki-vault',
    image: 'ftn/pki-hsm:v1.9',
    domain: 'pki.familytimenet.com',
    port: 8200,
    protocol: 'mTLS / ACME',
    status: 'HEALTHY',
    latencyMs: 1.8,
    uptime: '99.999%',
    cpuPercent: 9,
    memoryMb: 420,
    restarts: 0,
    targetDashboard: 'pki-manager',
    dashboardLabel: 'PKI & CA Manager',
    dependencies: ['ftn-core-noc'],
    x: 310,
    y: 270
  },
  {
    id: 'ftn-policy-engine',
    name: 'FTN ZTNA Policy Enforcer',
    layer: 'Security',
    container: 'ftn-policy-agent',
    image: 'ftn/policy-opa:v1.2',
    domain: 'policy.internal.lan',
    port: 8181,
    protocol: 'REST / JSON',
    status: 'HEALTHY',
    latencyMs: 1.4,
    uptime: '99.99%',
    cpuPercent: 16,
    memoryMb: 610,
    restarts: 0,
    targetDashboard: 'policy-engine',
    dashboardLabel: 'Policy Engine',
    dependencies: ['ftn-iam-auth'],
    x: 310,
    y: 420
  },

  // Layer: Network (x: 540)
  {
    id: 'ftn-wireguard-mesh',
    name: 'WireGuard Dynamic ZTNA Mesh',
    layer: 'Network',
    container: 'ftn-wireguard-mesh',
    image: 'ftn/wireguard-kmod:v2.1',
    domain: 'wg.familytimenet.com',
    port: 51820,
    protocol: 'WireGuard / ChaCha20',
    status: 'HEALTHY',
    latencyMs: 1.5,
    uptime: '99.997%',
    cpuPercent: 28,
    memoryMb: 1120,
    restarts: 0,
    targetDashboard: 'zerotrust-gateway',
    dashboardLabel: 'Zero Trust Gateway',
    dependencies: ['ftn-pki-vault', 'ftn-policy-engine'],
    x: 540,
    y: 160
  },
  {
    id: 'ftn-bgp-sdwan',
    name: 'BGP/EVPN & SD-WAN Controller',
    layer: 'Network',
    container: 'ftn-frr-routing',
    image: 'ftn/frr-sdwan:v9.1',
    domain: 'sdwan.internal.lan',
    port: 179,
    protocol: 'BGP / EVPN',
    status: 'HEALTHY',
    latencyMs: 2.1,
    uptime: '99.995%',
    cpuPercent: 22,
    memoryMb: 940,
    restarts: 0,
    targetDashboard: 'sdwan-controller',
    dashboardLabel: 'Autonomous SD-WAN',
    dependencies: ['ftn-wireguard-mesh', 'ftn-core-noc'],
    x: 540,
    y: 340
  },

  // Layer: Registry & DNS (x: 770)
  {
    id: 'ftn-service-registry',
    name: 'FTN Global Service Registry',
    layer: 'Registry',
    container: 'ftn-service-registry',
    image: 'ftn/registry-consul:v1.16',
    domain: 'registry.familytimenet.com',
    port: 8500,
    protocol: 'gRPC / HTTP/2',
    status: 'HEALTHY',
    latencyMs: 0.9,
    uptime: '99.998%',
    cpuPercent: 19,
    memoryMb: 890,
    restarts: 0,
    targetDashboard: 'service-registry',
    dashboardLabel: 'Service Registry',
    dependencies: ['ftn-wireguard-mesh', 'ftn-pki-vault'],
    x: 770,
    y: 120
  },
  {
    id: 'ftn-anycast-dns',
    name: 'PowerDNS Anycast Mesh',
    layer: 'Registry',
    container: 'ftn-powerdns-mesh',
    image: 'ftn/powerdns-auth:v4.8',
    domain: 'ns1.familytimenet.com',
    port: 53,
    protocol: 'DoH / DoQ / UDP',
    status: 'HEALTHY',
    latencyMs: 1.1,
    uptime: '99.999%',
    cpuPercent: 35,
    memoryMb: 1650,
    restarts: 0,
    targetDashboard: 'dns-platform',
    dashboardLabel: 'DNS Platform Mesh',
    dependencies: ['ftn-service-registry', 'ftn-bgp-sdwan'],
    x: 770,
    y: 280
  },
  {
    id: 'ftn-ipam-manager',
    name: 'Carrier IPAM Subnet Allocator',
    layer: 'Registry',
    container: 'ftn-ipam-daemon',
    image: 'ftn/ipam-mesh:v1.4',
    domain: 'ipam.internal.lan',
    port: 8088,
    protocol: 'REST / JSON',
    status: 'HEALTHY',
    latencyMs: 1.7,
    uptime: '99.99%',
    cpuPercent: 11,
    memoryMb: 520,
    restarts: 0,
    targetDashboard: 'ipam-manager',
    dashboardLabel: 'Carrier IPAM Manager',
    dependencies: ['ftn-service-registry'],
    x: 770,
    y: 440
  },

  // Layer: Telemetry & Flow Ingestion (x: 1000)
  {
    id: 'ftn-netflow-yaf',
    name: 'SiLK / YAF IPFIX Collector',
    layer: 'Telemetry',
    container: 'ftn-yaf-silk',
    image: 'ftn/yaf-collector:v3.0',
    domain: 'netflow.familytimenet.com',
    port: 2055,
    protocol: 'IPFIX / NetFlow v9',
    status: 'HEALTHY',
    latencyMs: 0.8,
    uptime: '99.996%',
    cpuPercent: 41,
    memoryMb: 2480,
    restarts: 0,
    targetDashboard: 'netflow-collector',
    dashboardLabel: 'NetFlow & IPFIX Collector',
    dependencies: ['ftn-bgp-sdwan'],
    x: 1000,
    y: 180
  },
  {
    id: 'ftn-opensearch',
    name: 'OpenSearch Cluster & Timeseries',
    layer: 'Telemetry',
    container: 'ftn-opensearch-node',
    image: 'opensearchproject/opensearch:2.11',
    domain: 'search.internal.lan',
    port: 9200,
    protocol: 'REST / HTTPS',
    status: 'HEALTHY',
    latencyMs: 2.8,
    uptime: '99.992%',
    cpuPercent: 46,
    memoryMb: 3850,
    restarts: 0,
    targetDashboard: 'opensearch',
    dashboardLabel: 'OpenSearch Analytics',
    dependencies: ['ftn-netflow-yaf'],
    x: 1000,
    y: 360
  },

  // Layer: AI Intelligence & Auto-Healing (x: 1220)
  {
    id: 'ftn-incident-correlator',
    name: 'Gemini AI Incident Correlator',
    layer: 'AI',
    container: 'ftn-ai-correlator',
    image: 'ftn/ai-noc-brain:v4.2',
    domain: 'ai.familytimenet.com',
    port: 8443,
    protocol: 'gRPC / Gemini API',
    status: 'HEALTHY',
    latencyMs: 24.5,
    uptime: '99.994%',
    cpuPercent: 38,
    memoryMb: 2100,
    restarts: 0,
    targetDashboard: 'incident-correlator',
    dashboardLabel: 'AI Incident Correlator',
    dependencies: ['ftn-netflow-yaf', 'ftn-opensearch', 'ftn-service-registry'],
    x: 1230,
    y: 160
  },
  {
    id: 'ftn-smart-alert-engine',
    name: 'Predictive NOC Alert Engine',
    layer: 'AI',
    container: 'ftn-alert-engine',
    image: 'ftn/alert-agent:v2.0',
    domain: 'alerts.internal.lan',
    port: 9093,
    protocol: 'Webhook / Kafka',
    status: 'HEALTHY',
    latencyMs: 1.9,
    uptime: '99.997%',
    cpuPercent: 19,
    memoryMb: 920,
    restarts: 0,
    targetDashboard: 'smart-alert-engine',
    dashboardLabel: 'Smart Alert Engine',
    dependencies: ['ftn-incident-correlator'],
    x: 1230,
    y: 340
  },

  // Layer: Edge Applications & User Gateways (x: 1450)
  {
    id: 'ftn-subscriber-billing',
    name: 'Subscriber & Carrier Billing',
    layer: 'Edge',
    container: 'ftn-billing-api',
    image: 'ftn/billing-service:v3.1',
    domain: 'billing.familytimenet.com',
    port: 8082,
    protocol: 'REST / Stripe',
    status: 'HEALTHY',
    latencyMs: 3.2,
    uptime: '99.99%',
    cpuPercent: 21,
    memoryMb: 1100,
    restarts: 0,
    targetDashboard: 'clients',
    dashboardLabel: 'Subscriber Billing',
    dependencies: ['ftn-service-registry', 'ftn-iam-auth'],
    x: 1450,
    y: 140
  },
  {
    id: 'ftn-ai-callcenter',
    name: 'AI Voice & Helpdesk Ingress',
    layer: 'Edge',
    container: 'ftn-ai-callcenter',
    image: 'ftn/callcenter-sip:v2.3',
    domain: 'voice.familytimenet.com',
    port: 5060,
    protocol: 'SIP / WebRTC',
    status: 'HEALTHY',
    latencyMs: 4.5,
    uptime: '99.98%',
    cpuPercent: 29,
    memoryMb: 1450,
    restarts: 0,
    targetDashboard: 'ai-call-center',
    dashboardLabel: 'AI Call Center',
    dependencies: ['ftn-incident-correlator', 'ftn-anycast-dns'],
    x: 1450,
    y: 320
  }
];

export function FtnEcosystemVisualizer({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [selectedNode, setSelectedNode] = useState<VisualizerNode | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLayer, setSelectedLayer] = useState<string>('All');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSimulatingProbe, setIsSimulatingProbe] = useState(false);

  // Filter nodes
  const filteredNodes = useMemo(() => {
    return ECOSYSTEM_NODES.filter(node => {
      const matchLayer = selectedLayer === 'All' || node.layer === selectedLayer;
      const matchSearch =
        node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.container.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.layer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        node.protocol.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLayer && matchSearch;
    });
  }, [selectedLayer, searchQuery]);

  // Generate SVG link lines between nodes based on dependencies
  const links = useMemo(() => {
    const res: { from: VisualizerNode; to: VisualizerNode }[] = [];
    ECOSYSTEM_NODES.forEach(toNode => {
      toNode.dependencies.forEach(depId => {
        const fromNode = ECOSYSTEM_NODES.find(n => n.id === depId);
        if (fromNode) {
          res.push({ from: fromNode, to: toNode });
        }
      });
    });
    return res;
  }, []);

  const handleTestProbe = () => {
    if (!selectedNode) return;
    setIsSimulatingProbe(true);
    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          type: 'info',
          title: `Liveness Probe: ${selectedNode.name}`,
          message: `Sending synthetic health check probe to ${selectedNode.domain}:${selectedNode.port}...`
        }
      })
    );

    setTimeout(() => {
      setIsSimulatingProbe(false);
      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: {
            type: 'success',
            title: `Service Healthy (HTTP 200 / gRPC OK)`,
            message: `Response time: ${selectedNode.latencyMs} ms | Zero packet drop detected.`
          }
        })
      );
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#091122] via-[#0b1730] to-[#080e1c] border border-gray-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#a855f7]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-[#a855f7] flex items-center justify-center text-gray-950 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                <Network className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight flex items-center gap-3">
                  FTN ECOSYSTEM TOPOLOGY VISUALIZER
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00f0ff]/15 text-[#00f0ff] font-mono border border-[#00f0ff]/30">
                    Hierarchical Mesh
                  </span>
                </h1>
                <p className="text-gray-300 font-mono text-xs lg:text-sm">
                  Interactive node-link diagram mapping dependencies between Core, Network, Security, Service Registry, Telemetry, and AI services.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Summary Counts */}
          <div className="flex flex-wrap items-center gap-4 bg-gray-950/80 border border-gray-800 rounded-2xl p-4">
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Total Services</span>
              <span className="text-2xl font-black text-[#00f0ff] font-mono">{ECOSYSTEM_NODES.length}</span>
            </div>
            <div className="h-10 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Active Links</span>
              <span className="text-2xl font-black text-[#00ff66] font-mono">{links.length}</span>
            </div>
            <div className="h-10 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Mesh Health</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">99.99%</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-6 pt-6 border-t border-gray-800/80 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter node or container..."
              className="w-full bg-gray-950/80 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]/50"
            />
          </div>

          {/* Layer Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {['All', 'Core', 'Security', 'Network', 'Registry', 'Telemetry', 'AI', 'Edge'].map(layer => {
              const isSelected = selectedLayer === layer;
              const config = layer !== 'All' ? LAYER_CONFIG[layer as keyof typeof LAYER_CONFIG] : null;

              return (
                <button
                  key={layer}
                  onClick={() => setSelectedLayer(layer)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border",
                    isSelected
                      ? "bg-white/10 text-white border-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                      : "bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200"
                  )}
                  style={config && isSelected ? { borderColor: config.color, color: config.color } : {}}
                >
                  {layer}
                </button>
              );
            })}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono text-gray-400 w-12 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white"
              title="Reset Zoom"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Visualizer Stage */}
      <div className="relative bg-[#060a14] border border-gray-800/90 rounded-3xl overflow-hidden shadow-2xl min-h-[620px] flex flex-col">
        {/* Layer Header Guide */}
        <div className="grid grid-cols-7 border-b border-gray-800/70 bg-[#080e1c]/80 text-[10px] font-mono uppercase tracking-widest text-center py-2 text-gray-400">
          <div className="text-cyan-400 border-r border-gray-800/40">1. Core / Kernel</div>
          <div className="text-amber-400 border-r border-gray-800/40">2. Security &amp; PKI</div>
          <div className="text-emerald-400 border-r border-gray-800/40">3. Network &amp; ZTNA</div>
          <div className="text-blue-400 border-r border-gray-800/40">4. Service Registry</div>
          <div className="text-teal-400 border-r border-gray-800/40">5. Telemetry &amp; Flows</div>
          <div className="text-purple-400 border-r border-gray-800/40">6. AI Intelligence</div>
          <div className="text-pink-400">7. Edge Apps</div>
        </div>

        {/* Interactive SVG Diagram Canvas */}
        <div className="relative flex-1 overflow-x-auto overflow-y-hidden p-6 select-none">
          <div
            className="transition-transform duration-300 origin-top-left"
            style={{ transform: `scale(${zoomLevel})`, width: '1600px', height: '560px' }}
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1600 560"
            >
              <defs>
                <linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#00ff66" stopOpacity="0.6" />
                </linearGradient>

                <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Dependency Links */}
              {links.map((link, idx) => {
                const isHighlighted =
                  selectedNode &&
                  (selectedNode.id === link.from.id || selectedNode.id === link.to.id);

                // Bezier curve between nodes
                const x1 = link.from.x + 180;
                const y1 = link.from.y + 36;
                const x2 = link.to.x;
                const y2 = link.to.y + 36;
                const dx = (x2 - x1) * 0.5;

                const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

                return (
                  <g key={idx}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke={isHighlighted ? '#00f0ff' : 'rgba(255, 255, 255, 0.12)'}
                      strokeWidth={isHighlighted ? 2.5 : 1.2}
                      strokeDasharray={isHighlighted ? 'none' : '4 3'}
                      className="transition-all duration-300"
                    />

                    {/* Animated Flow Pulse Particle on active highlighted links */}
                    {isHighlighted && (
                      <circle r="3" fill="#00ff66">
                        <animateMotion path={pathData} dur="2s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Nodes Container */}
            <div className="absolute inset-0">
              {filteredNodes.map(node => {
                const isSelected = selectedNode?.id === node.id;
                const layerMeta = LAYER_CONFIG[node.layer];

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    style={{
                      position: 'absolute',
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                      width: '180px'
                    }}
                    className={cn(
                      "p-3 rounded-2xl border transition-all duration-200 cursor-pointer shadow-lg group select-none",
                      isSelected
                        ? "bg-[#0b1428] ring-2 ring-[#00f0ff] shadow-[0_0_25px_rgba(0,240,255,0.3)] z-30"
                        : "bg-[#091122]/90 hover:bg-[#0c1730] hover:border-gray-600 z-10",
                      "border-gray-800"
                    )}
                  >
                    {/* Node Header */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span
                        className="text-[9px] font-mono px-2 py-0.2 rounded font-bold uppercase"
                        style={{
                          backgroundColor: layerMeta.bg,
                          color: layerMeta.color,
                          borderColor: layerMeta.border
                        }}
                      >
                        {node.layer}
                      </span>

                      <span className="flex items-center gap-1 text-[9px] font-mono text-[#00ff66]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                        {node.status}
                      </span>
                    </div>

                    {/* Node Name */}
                    <h3 className="text-xs font-bold text-white group-hover:text-[#00f0ff] transition-colors leading-tight font-display truncate">
                      {node.name}
                    </h3>
                    <p className="text-[10px] font-mono text-gray-400 truncate mt-0.5">
                      {node.container}
                    </p>

                    {/* Quick Metrics Footer */}
                    <div className="mt-2 pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <span className="text-[#00f0ff]">{node.latencyMs}ms</span>
                      <span className="text-gray-500">{node.uptime}</span>
                      <span className="text-[#00ff66]">CPU {node.cpuPercent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Instruction Footer Bar */}
        <div className="bg-gray-950/90 border-t border-gray-800 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-gray-400">
          <span className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-[#00f0ff]" />
            Click on any service node to inspect its live container health &amp; open its Service Registry entry.
          </span>
          <span className="text-gray-500">
            Total Graph Layers: 7 | Active Mesh Links: {links.length}
          </span>
        </div>
      </div>

      {/* SERVICE REGISTRY HEALTH STATUS DRAWER / MODAL */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#091122] border border-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex items-start justify-between relative z-10">
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border text-lg font-bold"
                  style={{
                    backgroundColor: LAYER_CONFIG[selectedNode.layer].bg,
                    borderColor: LAYER_CONFIG[selectedNode.layer].border,
                    color: LAYER_CONFIG[selectedNode.layer].color
                  }}
                >
                  <Server className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase"
                      style={{
                        backgroundColor: LAYER_CONFIG[selectedNode.layer].bg,
                        color: LAYER_CONFIG[selectedNode.layer].color
                      }}
                    >
                      {selectedNode.layer} Layer
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#00ff66] border border-emerald-500/30 flex items-center gap-1 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                      {selectedNode.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white font-display mt-1">
                    {selectedNode.name}
                  </h2>
                  <p className="text-xs font-mono text-gray-400">
                    {selectedNode.domain} &bull; Container: {selectedNode.container}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Metrics & Service Registry Status */}
            <div className="p-6 space-y-5 relative z-10">
              {/* Telemetry Strip */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-black/60 border border-gray-800/80 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-gray-400 font-mono block">LATENCY</span>
                  <span className="text-lg font-black text-[#00f0ff] font-mono">{selectedNode.latencyMs} ms</span>
                </div>
                <div className="bg-black/60 border border-gray-800/80 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-gray-400 font-mono block">UPTIME</span>
                  <span className="text-lg font-black text-[#00ff66] font-mono">{selectedNode.uptime}</span>
                </div>
                <div className="bg-black/60 border border-gray-800/80 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-gray-400 font-mono block">CPU USAGE</span>
                  <span className="text-lg font-black text-amber-400 font-mono">{selectedNode.cpuPercent}%</span>
                </div>
                <div className="bg-black/60 border border-gray-800/80 rounded-2xl p-3 text-center">
                  <span className="text-[10px] text-gray-400 font-mono block">MEMORY</span>
                  <span className="text-lg font-black text-purple-400 font-mono">{selectedNode.memoryMb} MB</span>
                </div>
              </div>

              {/* Service Registry Diagnostics Grid */}
              <div className="bg-black/80 rounded-2xl border border-gray-800 p-4 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-gray-400 border-b border-gray-800 pb-2">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-[#00f0ff]" />
                    SERVICE REGISTRY HEALTH RECORD
                  </span>
                  <span className="text-gray-500">Port: {selectedNode.port || 'Socket Hook'}</span>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[11px]">
                  <div>
                    <span className="text-gray-500 block">OCI Image:</span>
                    <span className="text-gray-200">{selectedNode.image}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Transport Protocol:</span>
                    <span className="text-cyan-400">{selectedNode.protocol}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Liveness Probe:</span>
                    <span className="text-[#00ff66]">HTTP /healthz [200 OK] (5s interval)</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Restart Count:</span>
                    <span className="text-gray-200">{selectedNode.restarts} (Clean execution)</span>
                  </div>
                </div>

                {/* Dependencies List */}
                <div className="pt-2 border-t border-gray-800/80">
                  <span className="text-gray-500 block text-[10px] uppercase mb-1">
                    Upstream Dependencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.dependencies.length > 0 ? (
                      selectedNode.dependencies.map(dep => (
                        <span
                          key={dep}
                          className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-300 text-[10px]"
                        >
                          &rarr; {dep}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-[10px]">None (Root Master Service)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-6 pt-0 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
              <button
                onClick={handleTestProbe}
                disabled={isSimulatingProbe}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors border border-gray-700"
              >
                <Activity className={cn("w-3.5 h-3.5 text-[#00f0ff]", isSimulatingProbe && "animate-spin")} />
                <span>{isSimulatingProbe ? 'Probing...' : 'Dispatch Live Probe'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setSelectedNode(null);
                    onNavigate('service-registry');
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-[#00f0ff] hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors border border-gray-700"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Open Service Registry</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedNode(null);
                    onNavigate(selectedNode.targetDashboard);
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00ff66] text-gray-950 hover:brightness-110 text-xs font-mono font-black flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  <span>Launch {selectedNode.dashboardLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
