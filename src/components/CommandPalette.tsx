import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Network, 
  Server, 
  ShieldAlert, 
  Cpu, 
  Activity, 
  Users, 
  FileCode2, 
  Command, 
  Globe, 
  Smartphone, 
  Globe2, 
  RefreshCw, 
  HardDrive, 
  Mail, 
  Search, 
  Lock, 
  Wrench, 
  Star, 
  Layers, 
  Phone, 
  CreditCard, 
  Bot, 
  Radio, 
  Database, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  Cloud, 
  ArrowRightLeft, 
  Rocket, 
  Settings, 
  BrainCircuit,
  Binary,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  Filter,
  BookOpen,
  BellRing,
  Flame,
  Zap,
  LayoutDashboard
} from 'lucide-react';
import { INITIAL_IP_POOLS } from '../data/ipamData';
import { INITIAL_JOBS } from '../data/jobJournalData';

export interface GlobalSearchItem {
  id: string;
  type: 'module' | 'service' | 'asset' | 'subnet' | 'job';
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  targetTab: string;
  icon: any;
  extraMeta?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export const NAV_ITEMS = [
  { id: 'dashboard', label: '🎛️ FTN Core Control Plane (Global Autonomous NOC)', icon: LayoutDashboard },
  { id: 'incident-correlator', label: '🚨 FTN AI Incident Correlator & Root Cause', icon: BrainCircuit },
  { id: 'zerotrust-gateway', label: '🛡️ FTN Zero Trust (ZTNA) Gateway & Posture', icon: ShieldCheck },
  { id: 'netflow-collector', label: '🌐 FTN NetFlow & IPFIX Collector', icon: Network },
  { id: 'pki-manager', label: '🔒 FTN Enterprise PKI & Certificate Authority', icon: Lock },
  { id: 'multi-server', label: '🖥️ FTN Multi-Server & Resource Load Balancer', icon: Server },
  { id: 'scaling-controller', label: '⚡ FTN Scaling Controller & Auto-Migration', icon: Activity },
  { id: 'resource-dashboard', label: '📊 FTN Hardware Resource Dashboard', icon: Layers },
  { id: 'smart-grid-optimizer', label: '⚡ FTN Smart Grid Optimizer (One-Click Rebalance)', icon: Zap },
  { id: 'network-heatmap', label: '🗺️ FTN Global Network Heatmap (D3 Vector Mesh)', icon: Flame },
  { id: 'migration-journal', label: '📜 FTN Migration Journal (Autonomous Workload Shifts)', icon: Layers },
  { id: 'anomaly-predictor', label: '🧠 FTN AI Anomaly & Failure Predictor', icon: BrainCircuit },
  { id: 'smart-alert-engine', label: '🔔 FTN Smart Alert Engine (AI Correlated)', icon: BellRing },
  { id: 'global-monitoring-hub', label: '🌐 FTN Global Monitoring Hub (Multi-API)', icon: Globe },
  { id: 'ecosystem-glossary', label: '📖 FTN Ecosystem Glossary', icon: BookOpen },
  { id: 'service-registry', label: '📋 FTN Unified Service Registry', icon: Server },
  { id: 'status-page', label: '📈 FTN Global System Status Page', icon: Activity },
  { id: 'architecture', label: '🏛️ FTN Complete Service Architecture (18 Domains)', icon: Layers },
  { id: 'job-journal', label: '📜 FTN Job Execution Journal (Autonomous)', icon: Activity },
  { id: 'ipam-manager', label: '🌐 FTN IPAM & Subnet Manager (OLT/Router)', icon: Network },
  { id: 'policy-engine', label: '🛡️ FTN Network Access Policy Engine (eBPF)', icon: ShieldAlert },
  { id: 'access-control', label: '🔐 FTN Access Control Matrix', icon: Lock },
  { id: 'telemetry', label: '📊 FTN Telemetry Dashboard', icon: Activity },
  { id: 'automation', label: '🤖 FTN Router Automation', icon: Bot },
  { id: 'smart-dns', label: '🧠 FTN Smart DNS', icon: Globe },
  { id: 'ai-noc', label: '🤖 FTN AI Predictive NOC', icon: Bot },
  { id: 'provisioning', label: '🚀 FTN Provisioning Wizard', icon: Rocket },
  { id: 'bgp-visualizer', label: '🕸️ FTN BGP Traffic Visualizer', icon: Network },
  { id: 'protocol-selector', label: '⚙️ FTN Protocol Selector', icon: Settings },
  { id: 'tunnel-health', label: '🩺 FTN Tunnel Health Widget', icon: Activity },
  { id: 'ai-proxy', label: '🧠 FTN AI Dynamic Proxy', icon: BrainCircuit },
  { id: 'vpn-mesh', label: '🌐 FTN Dynamic VPN Mesh', icon: Network },
  { id: 'cdn-edge', label: '🌍 Global CDN & Edge Anycast (Free Tier)', icon: Cloud },
  { id: 'sdwan-controller', label: '↔️ FTN SD-WAN Controller (Secure Mesh)', icon: ArrowRightLeft },
  { id: 'branding', label: '🎨 FTN Logo & Brand Identity Kit', icon: Sparkles },
  { id: 'shared-auth', label: '🛡️ FTN Shared Auth (One ID)', icon: ShieldCheck },
  { id: 'mystack', label: '🚀 My Stack & Starred Repos (56)', icon: Star },
  { id: 'kismet', label: '📡 Kismet Wireless & RF Inspector', icon: Radio },
  { id: 'kopia', label: '🔐 Kopia Encrypted Backup Vault', icon: HardDrive },
  { id: 'opensearch', label: '🔍 OpenSearch Observability & SIEM', icon: Database },
  { id: 'core-router', label: 'FTN Core Router', icon: Server },
  { id: 'dns', label: 'DNS Management', icon: Globe },
  { id: 'ddns', label: 'DDNS (DuckDNS / DNSPod)', icon: RefreshCw },
  { id: 'domain', label: 'Domain Management & PKI', icon: Globe2 },
  { id: 'hosting', label: 'Hosting & PgBouncer Offload', icon: HardDrive },
  { id: 'global', label: 'Global Grid & Web3 (EVMbench)', icon: Globe },
  { id: 'mail', label: 'FTN Mail Service & DKIM', icon: Mail },
  { id: 'ftn-dns', label: 'FTN DNS Architecture', icon: Globe },
  { id: 'ai-accounting', label: 'AI Autonomous Accounting', icon: DollarSign },
  { id: 'ai-call-center', label: 'AI Call Center', icon: Phone },
  { id: 'ai-billing', label: 'AI Billing Gateway', icon: CreditCard },
  { id: 'ai-network-agent', label: 'AI Network Agent', icon: Bot },
  { id: 'android', label: 'Android App & Omni OS', icon: Smartphone },
  { id: 'dashboard', label: 'Smart NOC Dashboard', icon: Activity },
  { id: 'mesh', label: 'Global API & Mesh', icon: Network },
  { id: 'crypto-pki', label: 'Crypto & PKI Engine', icon: Lock },
  { id: 'backup', label: 'One-Click Backups', icon: HardDrive },
  { id: 'simulator', label: 'Edge Traffic Simulator', icon: Activity },
  { id: 'lifecycle', label: 'Hardware Lifecycle', icon: Cpu },
  { id: 'drivers', label: 'Universal Device Drivers', icon: Wrench },
  { id: 'peering', label: 'Global Provider Peering', icon: Globe2 },
  { id: 'topology', label: 'GIS Fiber Topology', icon: Network },
  { id: 'olt', label: 'Multi-Vendor OLT', icon: Cpu },
  { id: 'subscribers', label: 'Subscriber & Billing', icon: Users },
  { id: 'ai', label: 'FTNDNS AI Assistant', icon: Command },
  { id: 'microservices', label: 'Microservices Matrix', icon: ShieldAlert },
  { id: 'compiler', label: 'Build Pipeline', icon: FileCode2 },
];

const PLATFORM_SERVICES: GlobalSearchItem[] = [
  {
    id: 'svc-incident-correlator',
    type: 'service',
    title: 'FTN AI Incident Correlator & Automated Root Cause Analysis',
    subtitle: 'Graph-based outage correlation across BGP, eBPF drop spikes & DB pools',
    badge: 'AI OPS',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    targetTab: 'incident-correlator',
    icon: BrainCircuit,
    extraMeta: 'RCA & Runbooks'
  },
  {
    id: 'svc-zerotrust-gateway',
    type: 'service',
    title: 'FTN Zero Trust Network Access (ZTNA) Gateway',
    subtitle: 'Continuous device posture verification, TPM 2.0 PCR attestation & mTLS enforcement',
    badge: 'SECURITY',
    badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    targetTab: 'zerotrust-gateway',
    icon: ShieldCheck,
    extraMeta: 'mTLS & ZTNA'
  },
  {
    id: 'svc-netflow-collector',
    type: 'service',
    title: 'FTN NetFlow & IPFIX Real-Time Collector',
    subtitle: 'High-velocity flow ingestion, top talker analysis & DSCP QoS inspection',
    badge: 'TELEMETRY',
    badgeColor: 'text-[#00f0ff] bg-[#00f0ff]/10 border-[#00f0ff]/30',
    targetTab: 'netflow-collector',
    icon: Network,
    extraMeta: 'RFC 7011 Flow Ingestion'
  },
  {
    id: 'svc-pki-manager',
    type: 'service',
    title: 'FTN Enterprise PKI & Certificate Authority',
    subtitle: 'Ed25519 root CA, intermediate mTLS, ACME automated renewals & CRL management',
    badge: 'PKI / CRYPTO',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    targetTab: 'pki-manager',
    icon: Lock,
    extraMeta: 'X.509 & ACME'
  },
  {
    id: 'svc-multi-server-mesh',
    type: 'service',
    title: 'FTN Multi-Server Resource Mesh & Autonomous Balancer',
    subtitle: 'Pooled RAM, NVMe, SSD, HDD & Bonded Network • Self-Balancing',
    badge: 'SERVICE',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    targetTab: 'multi-server',
    icon: Server,
    extraMeta: 'Hardware Balancer'
  },
  {
    id: 'svc-scaling-controller',
    type: 'service',
    title: 'FTN Scaling Controller & Auto-Migration Engine',
    subtitle: 'Autonomous capacity watcher, zero-downtime CRIU workload evacuation',
    badge: 'SERVICE',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    targetTab: 'scaling-controller',
    icon: Activity,
    extraMeta: 'Auto-Scaler'
  },
  {
    id: 'svc-resource-dashboard',
    type: 'service',
    title: 'FTN Hardware Resource Dashboard & Telemetry',
    subtitle: 'Per-node RAM, NVMe Gen5, SSD, ZFS HDD & One-Click Mesh Rebalance',
    badge: 'SERVICE',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    targetTab: 'resource-dashboard',
    icon: Layers,
    extraMeta: 'Hardware Deep Metrics'
  },
  {
    id: 'svc-smart-grid-optimizer',
    type: 'service',
    title: 'FTN Smart Grid Optimizer & One-Click Balancer',
    subtitle: 'Autonomous multi-server CPU, RAM, and transit bandwidth load equalizer',
    badge: 'OPTIMIZER',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    targetTab: 'smart-grid-optimizer',
    icon: Zap,
    extraMeta: 'Grid Optimizer'
  },
  {
    id: 'svc-network-heatmap',
    type: 'service',
    title: 'FTN Global Network Heatmap & Vector Mesh',
    subtitle: 'D3 vector topology, server density contours, thermal radiation & traffic spikes',
    badge: 'D3 HEATMAP',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    targetTab: 'network-heatmap',
    icon: Flame,
    extraMeta: 'D3 Vector Mesh'
  },
  {
    id: 'svc-migration-journal',
    type: 'service',
    title: 'FTN Migration Journal & State Audit Trail',
    subtitle: 'Immutable audit log of before/after states for all autonomous workload shifts',
    badge: 'AUDIT LOG',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    targetTab: 'migration-journal',
    icon: Layers,
    extraMeta: 'Migration Audit'
  },
  {
    id: 'svc-anomaly-predictor',
    type: 'service',
    title: 'FTN AI Anomaly & Failure Predictor',
    subtitle: 'Multi-week historical telemetry curves forecasting hardware wear & bottlenecks',
    badge: 'AI PREDICTOR',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    targetTab: 'anomaly-predictor',
    icon: BrainCircuit,
    extraMeta: 'Predictive Maintenance'
  },
  {
    id: 'svc-smart-alert-engine',
    type: 'service',
    title: 'FTN Smart Alert Engine & AI Anomaly Correlator',
    subtitle: 'Noise reduction clustering, root-cause attribution, and eBPF anomaly mitigation',
    badge: 'AI ENGINE',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    targetTab: 'smart-alert-engine',
    icon: BellRing,
    extraMeta: 'AI Alerts'
  },
  {
    id: 'svc-global-monitoring-hub',
    type: 'service',
    title: 'FTN Global Monitoring Hub & Unified Telemetry Pane',
    subtitle: 'Integrated Prometheus, Zabbix, Datadog & New Relic API observability matrix',
    badge: 'MONITORING',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    targetTab: 'global-monitoring-hub',
    icon: Globe,
    extraMeta: 'Telemetry Hub'
  },
  {
    id: 'svc-ecosystem-glossary',
    type: 'service',
    title: 'FTN Ecosystem Technical Glossary',
    subtitle: 'Deep dive into eBPF, CRIU, Anycast, NUMA, ZFS & mesh networking terminology',
    badge: 'SERVICE',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    targetTab: 'ecosystem-glossary',
    icon: BookOpen,
    extraMeta: 'Technical Index'
  },
  {
    id: 'svc-core-noc',
    type: 'service',
    title: 'FTN Core Router & Autonomous NOC',
    subtitle: 'noc.familytimenet.com • Port 8080 • gRPC • Health: 99.99%',
    badge: 'SERVICE',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    targetTab: 'service-registry',
    icon: Server,
    extraMeta: 'Carrier Core'
  },
  {
    id: 'svc-smart-dns',
    type: 'service',
    title: 'FTN Smart Anycast DNS-over-HTTPS/QUIC',
    subtitle: 'dns.familytimenet.com • Port 853 • DoH/DoQ • Latency: 2.4ms',
    badge: 'SERVICE',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    targetTab: 'smart-dns',
    icon: Globe,
    extraMeta: 'Family SafeGuard'
  },
  {
    id: 'svc-wireguard-mesh',
    type: 'service',
    title: 'WireGuard SD-WAN Multi-Protocol Mesh',
    subtitle: 'vpn.familytimenet.com • Port 51820 • WireGuard • 6 Tunnels Up',
    badge: 'SERVICE',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    targetTab: 'vpn-mesh',
    icon: Network,
    extraMeta: 'Zero-Trust Mesh'
  },
  {
    id: 'svc-opensearch-siem',
    type: 'service',
    title: 'OpenSearch Observability & Threat SIEM',
    subtitle: 'siem.familytimenet.com • Port 9200 • 14.8k eps Ingestion',
    badge: 'SERVICE',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    targetTab: 'opensearch',
    icon: Database,
    extraMeta: 'SIEM & Threat'
  },
  {
    id: 'svc-kopia-vault',
    type: 'service',
    title: 'Kopia Sovereign Encrypted Storage Vault',
    subtitle: 'vault.familytimenet.com • Port 8443 • Strict mTLS • 100% SLA',
    badge: 'SERVICE',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    targetTab: 'kopia',
    icon: HardDrive,
    extraMeta: 'Personal Sovereign'
  },
  {
    id: 'svc-ai-gateway',
    type: 'service',
    title: 'FTN AI Network Agent & Autonomous Reasoner',
    subtitle: 'ai.familytimenet.com • Port 8090 • Gemini 2.5 Flash-Lite Core',
    badge: 'SERVICE',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    targetTab: 'ai-noc',
    icon: Bot,
    extraMeta: 'AI Autonomy'
  }
];

const PLATFORM_ASSETS: GlobalSearchItem[] = [
  {
    id: 'asset-core-bdix',
    type: 'asset',
    title: 'CORE-BDIX Transit Peering Router',
    subtitle: 'IP: 103.145.0.1 • BGP AS64512 • CPU Load: 24% • ONLINE',
    badge: 'ASSET',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    targetTab: 'core-router',
    icon: Cpu,
    extraMeta: 'Hardware Router'
  },
  {
    id: 'asset-olt-huawei',
    type: 'asset',
    title: 'Huawei MA5800-ZoneA (Dhanmondi Central)',
    subtitle: 'IP: 172.16.100.2 • 3 PON Cards (122 ONTs Active) • ONLINE',
    badge: 'ASSET',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    targetTab: 'olt',
    icon: Server,
    extraMeta: 'GPON OLT'
  },
  {
    id: 'asset-olt-zte',
    type: 'asset',
    title: 'ZTE C320-ZoneB (Banani Access)',
    subtitle: 'IP: 172.16.100.3 • 2 PON Cards (235 ONTs Active) • ONLINE',
    badge: 'ASSET',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    targetTab: 'olt',
    icon: Server,
    extraMeta: 'GPON OLT'
  },
  {
    id: 'asset-cloudflare-edge',
    type: 'asset',
    title: 'SG-Cloudflare Peering Node (Singapore)',
    subtitle: 'IP: 1.1.1.1 • Anycast POP • Uptime: 112d • ONLINE',
    badge: 'ASSET',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    targetTab: 'peering',
    icon: Globe,
    extraMeta: 'Anycast Node'
  },
  {
    id: 'asset-rf-kismet',
    type: 'asset',
    title: 'Kismet SDR 2.4/5GHz RF Sensor Probe',
    subtitle: 'Location: NOC Roof Node-A • Channel Hopping Active • ONLINE',
    badge: 'ASSET',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    targetTab: 'kismet',
    icon: Radio,
    extraMeta: 'Wireless Sensor'
  }
];

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'services' | 'assets' | 'subnets' | 'jobs' | 'modules'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Subnets transformed into search items
  const subnetItems = useMemo<GlobalSearchItem[]>(() => {
    return INITIAL_IP_POOLS.map(pool => ({
      id: pool.id,
      type: 'subnet',
      title: `${pool.cidr} - ${pool.name}`,
      subtitle: `VLAN ${pool.vlanId} • GW: ${pool.gateway} • ${pool.usedAddresses}/${pool.totalAddresses} used (${pool.utilizationPct}%)`,
      badge: 'SUBNET',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      targetTab: 'ipam-manager',
      icon: Network,
      extraMeta: pool.status.toUpperCase()
    }));
  }, []);

  // Jobs transformed into search items
  const jobItems = useMemo<GlobalSearchItem[]>(() => {
    return INITIAL_JOBS.map(job => ({
      id: job.id,
      type: 'job',
      title: job.name,
      subtitle: `${job.category} • Status: ${job.status.toUpperCase()} (${job.progressPct}%) • Node: ${job.executorNode}`,
      badge: 'JOB',
      badgeColor: job.status === 'running' 
        ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' 
        : 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      targetTab: 'job-journal',
      icon: Activity,
      extraMeta: job.priority.toUpperCase()
    }));
  }, []);

  // Navigation modules as search items
  const moduleItems = useMemo<GlobalSearchItem[]>(() => {
    return NAV_ITEMS.map(nav => ({
      id: nav.id,
      type: 'module',
      title: nav.label,
      subtitle: `FTN Platform Navigation View (${nav.id})`,
      badge: 'MODULE',
      badgeColor: 'text-gray-300 bg-gray-800 border-gray-700',
      targetTab: nav.id,
      icon: nav.icon,
    }));
  }, []);

  // Aggregated search items
  const allItems = useMemo<GlobalSearchItem[]>(() => {
    return [
      ...moduleItems,
      ...PLATFORM_SERVICES,
      ...PLATFORM_ASSETS,
      ...subnetItems,
      ...jobItems,
    ];
  }, [moduleItems, subnetItems, jobItems]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allItems.filter(item => {
      // Category filter match
      if (categoryFilter === 'services' && item.type !== 'service') return false;
      if (categoryFilter === 'assets' && item.type !== 'asset') return false;
      if (categoryFilter === 'subnets' && item.type !== 'subnet') return false;
      if (categoryFilter === 'jobs' && item.type !== 'job') return false;
      if (categoryFilter === 'modules' && item.type !== 'module') return false;

      // Query filter match
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.badge.toLowerCase().includes(q) ||
        (item.extraMeta && item.extraMeta.toLowerCase().includes(q))
      );
    });
  }, [allItems, search, categoryFilter]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setSearch('');
      setCategoryFilter('all');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search, categoryFilter]);

  const handleSelectItem = (item: GlobalSearchItem) => {
    onNavigate(item.targetTab);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter' && filteredItems.length > 0) {
      e.preventDefault();
      handleSelectItem(filteredItems[selectedIndex] || filteredItems[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] sm:pt-[15vh] bg-black/75 backdrop-blur-md animate-in fade-in duration-150" 
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-gray-900 border border-gray-700/90 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-800 bg-gray-950/90">
          <Search className="w-5 h-5 text-cyan-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder-gray-500 text-base font-mono"
            placeholder="Search services, assets, IP subnets, jobs, modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="text-xs text-gray-500 hover:text-gray-300 font-mono mr-2 px-1.5 py-0.5 rounded bg-gray-800"
            >
              Clear
            </button>
          )}
          <kbd className="hidden sm:block bg-gray-800 text-gray-400 px-2 py-0.5 rounded text-xs font-mono border border-gray-700">ESC</kbd>
        </div>

        {/* Global Search Category Filters */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-gray-800 bg-gray-950/50 overflow-x-auto text-xs font-mono">
          <span className="text-gray-500 flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              categoryFilter === 'all' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            All ({allItems.length})
          </button>
          <button
            onClick={() => setCategoryFilter('services')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              categoryFilter === 'services' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Services ({PLATFORM_SERVICES.length})
          </button>
          <button
            onClick={() => setCategoryFilter('assets')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              categoryFilter === 'assets' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Assets ({PLATFORM_ASSETS.length})
          </button>
          <button
            onClick={() => setCategoryFilter('subnets')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              categoryFilter === 'subnets' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Subnets ({subnetItems.length})
          </button>
          <button
            onClick={() => setCategoryFilter('jobs')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              categoryFilter === 'jobs' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Jobs ({jobItems.length})
          </button>
          <button
            onClick={() => setCategoryFilter('modules')}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              categoryFilter === 'modules' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Modules ({moduleItems.length})
          </button>
        </div>
        
        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 divide-y divide-gray-800/40">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500 font-mono text-sm space-y-2">
              <Search className="w-8 h-8 text-gray-600 mx-auto opacity-50" />
              <p>No results found for &ldquo;{search}&rdquo;</p>
              <p className="text-xs text-gray-600">Try searching for an IP, subnet (e.g. 103.145), BGP job, or service name.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelectItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-cyan-500/15 text-white border border-cyan-500/40 shadow-sm' 
                        : 'text-gray-300 hover:bg-gray-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-gray-800 text-gray-400'}`}>
                        <Icon className="w-4 h-4 flex-shrink-0" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm truncate">{item.title}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono font-bold flex-shrink-0 ${item.badgeColor}`}>
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 truncate font-mono mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.extraMeta && (
                        <span className="text-[10px] font-mono text-gray-500 hidden sm:inline-block px-1.5 py-0.5 rounded bg-gray-950 border border-gray-800">
                          {item.extraMeta}
                        </span>
                      )}
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-cyan-400 translate-x-0.5' : 'text-gray-600'} transition-transform`} />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2 bg-gray-950/80 text-[11px] text-gray-500 font-mono flex items-center justify-between border-t border-gray-800">
          <div className="flex items-center gap-3">
            <span><kbd className="bg-gray-800 text-gray-400 px-1 rounded">↑</kbd> <kbd className="bg-gray-800 text-gray-400 px-1 rounded">↓</kbd> to navigate</span>
            <span><kbd className="bg-gray-800 text-gray-400 px-1 rounded">Enter</kbd> to select</span>
            <span><kbd className="bg-gray-800 text-gray-400 px-1 rounded">ESC</kbd> to exit</span>
          </div>
          <span className="text-cyan-400 font-semibold">{filteredItems.length} items</span>
        </div>
      </div>
    </div>
  );
}
