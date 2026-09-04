import React, { useState, useMemo } from 'react';
import { 
  Server, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  ExternalLink, 
  Cpu, 
  HardDrive, 
  ShieldCheck, 
  Layers, 
  Terminal, 
  Globe, 
  Zap,
  ArrowUpRight,
  Database,
  Radio,
  Clock,
  X
} from 'lucide-react';

interface ServiceEndpoint {
  id: string;
  name: string;
  domain: string;
  category: 'carrier' | 'family' | 'ai' | 'edge' | 'security';
  container: string;
  port: number;
  protocol: 'HTTP/REST' | 'gRPC' | 'WireGuard' | 'DoH/DoQ' | 'mTLS' | 'BGP/EVPN';
  rbacTier: string;
  healthStatus: 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
  latencyMs: number;
  uptime: string;
  version: string;
  lastHealthCheck: string;
}

interface ContainerNode {
  id: string;
  name: string;
  image: string;
  podNode: string;
  cpuPercent: number;
  memoryMb: number;
  maxMemoryMb: number;
  restarts: number;
  status: 'running' | 'degraded' | 'restarting';
  livenessProbe: string;
  readinessProbe: string;
}

const INITIAL_SERVICES: ServiceEndpoint[] = [
  {
    id: 'svc-core-noc',
    name: 'FTN Core Router & Autonomous NOC',
    domain: 'noc.familytimenet.com',
    category: 'carrier',
    container: 'ftn-core-noc',
    port: 8080,
    protocol: 'gRPC',
    rbacTier: 'Super Admin / NOC Engineer',
    healthStatus: 'HEALTHY',
    latencyMs: 1.2,
    uptime: '99.998%',
    version: 'v3.8.4',
    lastHealthCheck: '5s ago'
  },
  {
    id: 'svc-bgp-gobgp',
    name: 'GoBGP AS64512 Route Reflector Engine',
    domain: 'bgp.familytimenet.com',
    category: 'carrier',
    container: 'ftn-gobgp-daemon',
    port: 179,
    protocol: 'BGP/EVPN',
    rbacTier: 'Carrier Peering / Internal',
    healthStatus: 'HEALTHY',
    latencyMs: 0.8,
    uptime: '100.00%',
    version: 'v3.12.0',
    lastHealthCheck: '2s ago'
  },
  {
    id: 'svc-gateway-mesh',
    name: 'FTN Polyglot API Gateway & eBPF Ingress',
    domain: 'api.familytimenet.com',
    category: 'edge',
    container: 'ftn-gateway-mesh',
    port: 8000,
    protocol: 'mTLS',
    rbacTier: 'Strict mTLS / Bearer Token',
    healthStatus: 'HEALTHY',
    latencyMs: 2.1,
    uptime: '99.995%',
    version: 'v2.4.1',
    lastHealthCheck: '4s ago'
  },
  {
    id: 'svc-smart-dns',
    name: 'FTN Smart Anycast DNS-over-HTTPS/QUIC',
    domain: 'dns.familytimenet.com',
    category: 'family',
    container: 'ftn-smart-dns-mesh',
    port: 853,
    protocol: 'DoH/DoQ',
    rbacTier: 'Public / Household SafeGuard',
    healthStatus: 'HEALTHY',
    latencyMs: 3.4,
    uptime: '99.999%',
    version: 'v1.9.8',
    lastHealthCheck: '1s ago'
  },
  {
    id: 'svc-ai-runtime',
    name: 'FTN AI Network Agent & Predictive NOC',
    domain: 'ai.familytimenet.com',
    category: 'ai',
    container: 'ftn-ai-runtime',
    port: 8090,
    protocol: 'HTTP/REST',
    rbacTier: 'Admin / NOC Engineer',
    healthStatus: 'HEALTHY',
    latencyMs: 14.8,
    uptime: '99.950%',
    version: 'v2.1.0',
    lastHealthCheck: '10s ago'
  },
  {
    id: 'svc-wireguard-mesh',
    name: 'WireGuard SD-WAN Multi-Protocol Tunnel Mesh',
    domain: 'vpn.familytimenet.com',
    category: 'edge',
    container: 'ftn-wireguard-mesh',
    port: 51820,
    protocol: 'WireGuard',
    rbacTier: 'Encrypted Peer Key / FIDO2',
    healthStatus: 'HEALTHY',
    latencyMs: 4.2,
    uptime: '99.992%',
    version: 'v1.0.2',
    lastHealthCheck: '3s ago'
  },
  {
    id: 'svc-opensearch-siem',
    name: 'OpenSearch Observability & Threat SIEM',
    domain: 'siem.familytimenet.com',
    category: 'security',
    container: 'ftn-opensearch-siem',
    port: 9200,
    protocol: 'HTTP/REST',
    rbacTier: 'Enterprise Admin',
    healthStatus: 'HEALTHY',
    latencyMs: 6.5,
    uptime: '99.980%',
    version: 'v2.11.1',
    lastHealthCheck: '8s ago'
  },
  {
    id: 'svc-olt-pon',
    name: 'Huawei/ZTE GPON OLT Telemetry Controller',
    domain: 'olt.familytimenet.com',
    category: 'carrier',
    container: 'ftn-olt-snmp-agent',
    port: 161,
    protocol: 'gRPC',
    rbacTier: 'NOC / Optical Engineer',
    healthStatus: 'DEGRADED',
    latencyMs: 24.1,
    uptime: '99.810%',
    version: 'v1.4.0',
    lastHealthCheck: '12s ago'
  },
  {
    id: 'svc-kopia-vault',
    name: 'Kopia Sovereign Encrypted Storage Vault',
    domain: 'vault.familytimenet.com',
    category: 'security',
    container: 'ftn-kopia-backup',
    port: 8443,
    protocol: 'mTLS',
    rbacTier: 'Family Head / Sovereign Admin',
    healthStatus: 'HEALTHY',
    latencyMs: 5.1,
    uptime: '100.00%',
    version: 'v0.15.0',
    lastHealthCheck: '7s ago'
  },
  {
    id: 'svc-subscriber-billing',
    name: 'FTN AAA Radius & Subscriber Billing',
    domain: 'billing.familytimenet.com',
    category: 'carrier',
    container: 'ftn-billing-daemon',
    port: 1812,
    protocol: 'HTTP/REST',
    rbacTier: 'Accountant / Billing Admin',
    healthStatus: 'HEALTHY',
    latencyMs: 3.9,
    uptime: '99.990%',
    version: 'v3.2.1',
    lastHealthCheck: '6s ago'
  }
];

const INITIAL_CONTAINERS: ContainerNode[] = [
  {
    id: 'cnt-01',
    name: 'ftn-core-noc',
    image: 'ftn-registry.internal/noc-core:v3.8.4',
    podNode: 'ftn-k3s-node-01 (Dhanmondi)',
    cpuPercent: 18.4,
    memoryMb: 412,
    maxMemoryMb: 1024,
    restarts: 0,
    status: 'running',
    livenessProbe: 'HTTP /healthz 200 OK',
    readinessProbe: 'TCP 8080 ESTABLISHED'
  },
  {
    id: 'cnt-02',
    name: 'ftn-gobgp-daemon',
    image: 'ftn-registry.internal/gobgp-ebpf:v3.12.0',
    podNode: 'ftn-k3s-node-01 (Dhanmondi)',
    cpuPercent: 12.1,
    memoryMb: 256,
    maxMemoryMb: 512,
    restarts: 0,
    status: 'running',
    livenessProbe: 'TCP 179 BGP ESTABLISHED',
    readinessProbe: 'RIB INGEST PASS'
  },
  {
    id: 'cnt-03',
    name: 'ftn-gateway-mesh',
    image: 'ftn-registry.internal/gateway-ingress:v2.4.1',
    podNode: 'ftn-k3s-node-02 (Banani)',
    cpuPercent: 28.6,
    memoryMb: 580,
    maxMemoryMb: 2048,
    restarts: 0,
    status: 'running',
    livenessProbe: 'HTTP /ready 200 OK',
    readinessProbe: 'mTLS CERT VALID'
  },
  {
    id: 'cnt-04',
    name: 'ftn-smart-dns-mesh',
    image: 'ftn-registry.internal/dns-coredns:v1.9.8',
    podNode: 'ftn-edge-anycast-01 (Singapore)',
    cpuPercent: 9.4,
    memoryMb: 184,
    maxMemoryMb: 512,
    restarts: 0,
    status: 'running',
    livenessProbe: 'DNS udp/53 response in 1.1ms',
    readinessProbe: 'DoH/DoQ TLS active'
  },
  {
    id: 'cnt-05',
    name: 'ftn-ai-runtime',
    image: 'ftn-registry.internal/ai-orchestrator:v2.1.0',
    podNode: 'ftn-cloud-cluster-01',
    cpuPercent: 34.2,
    memoryMb: 890,
    maxMemoryMb: 4096,
    restarts: 0,
    status: 'running',
    livenessProbe: 'HTTP /ai/status 200 OK',
    readinessProbe: 'Gemini Agent loop synced'
  },
  {
    id: 'cnt-06',
    name: 'ftn-wireguard-mesh',
    image: 'ftn-registry.internal/wireguard-sdwan:v1.0.2',
    podNode: 'ftn-k3s-node-02 (Banani)',
    cpuPercent: 15.0,
    memoryMb: 310,
    maxMemoryMb: 1024,
    restarts: 0,
    status: 'running',
    livenessProbe: 'Kernel wg0 tunnel verified',
    readinessProbe: '6 dynamic peers up'
  },
  {
    id: 'cnt-07',
    name: 'ftn-olt-snmp-agent',
    image: 'ftn-registry.internal/olt-telemetry:v1.4.0',
    podNode: 'ftn-k3s-node-01 (Dhanmondi)',
    cpuPercent: 22.8,
    memoryMb: 340,
    maxMemoryMb: 512,
    restarts: 1,
    status: 'degraded',
    livenessProbe: 'SNMP v2c timeout on OLT-02',
    readinessProbe: 'Retry queued (1/3)'
  }
];

export function FtnServiceRegistry() {
  const [services, setServices] = useState<ServiceEndpoint[]>(INITIAL_SERVICES);
  const [containers, setContainers] = useState<ContainerNode[]>(INITIAL_CONTAINERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'carrier' | 'family' | 'ai' | 'edge' | 'security'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE'>('all');
  const [activeTab, setActiveTab] = useState<'endpoints' | 'containers'>('endpoints');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isProbing, setIsProbing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    category: 'carrier' as 'carrier' | 'family' | 'ai' | 'edge' | 'security',
    container: '',
    port: 8080,
    protocol: 'HTTP/REST' as 'HTTP/REST' | 'gRPC' | 'WireGuard' | 'DoH/DoQ' | 'mTLS' | 'BGP/EVPN',
    rbacTier: 'Admin / Engineer',
  });

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRegisterService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.domain || !formData.container) return;

    const newEndpoint: ServiceEndpoint = {
      id: `svc-${Date.now()}`,
      name: formData.name,
      domain: formData.domain,
      category: formData.category,
      container: formData.container,
      port: Number(formData.port),
      protocol: formData.protocol,
      rbacTier: formData.rbacTier,
      healthStatus: 'HEALTHY',
      latencyMs: Math.floor(Math.random() * 8) + 2,
      uptime: '100.00%',
      version: 'v1.0.0',
      lastHealthCheck: 'Just now'
    };

    setServices(prev => [newEndpoint, ...prev]);
    setIsRegisterModalOpen(false);
    setFormData({
      name: '',
      domain: '',
      category: 'carrier',
      container: '',
      port: 8080,
      protocol: 'HTTP/REST',
      rbacTier: 'Admin / Engineer',
    });
    showNotification(`Registered endpoint '${newEndpoint.name}' successfully!`);
  };

  const triggerClusterHealthProbe = () => {
    setIsProbing(true);
    setTimeout(() => {
      setServices(prev => 
        prev.map(s => ({
          ...s,
          lastHealthCheck: 'Just now',
          latencyMs: +(s.latencyMs + (Math.random() * 1.5 - 0.75)).toFixed(1)
        }))
      );
      setContainers(prev => 
        prev.map(c => ({
          ...c,
          cpuPercent: +(c.cpuPercent + (Math.random() * 4 - 2)).toFixed(1)
        }))
      );
      setIsProbing(false);
      showNotification('Global health probe completed. All 10 endpoints verified.');
    }, 1200);
  };

  const restartContainer = (id: string, name: string) => {
    setContainers(prev => 
      prev.map(c => c.id === id ? { ...c, status: 'restarting' as const } : c)
    );
    showNotification(`Initiated safe container restart for ${name}...`);
    setTimeout(() => {
      setContainers(prev => 
        prev.map(c => c.id === id ? { ...c, status: 'running' as const, restarts: c.restarts + 1 } : c)
      );
      showNotification(`Container ${name} restarted and healthy.`);
    }, 2000);
  };

  const filteredServices = useMemo(() => {
    return services.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.container.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.protocol.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || s.healthStatus === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [services, searchQuery, categoryFilter, statusFilter]);

  const healthyCount = services.filter(s => s.healthStatus === 'HEALTHY').length;
  const runningContainersCount = containers.filter(c => c.status === 'running').length;
  const avgLatency = (services.reduce((acc, curr) => acc + curr.latencyMs, 0) / services.length).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-gray-950 border border-gray-800/80 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                SERVICE MESH DISCOVERY
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AUTONOMOUS CONSUL / K3S
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold font-display text-white tracking-tight">
              FTN Service Registry & Container Discovery
            </h1>
            <p className="text-gray-400 text-sm mt-1 max-w-2xl">
              Unified registry for microservices, zero-trust container health monitoring, dynamic endpoints, and polyglot protocol bindings across the FTN edge.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={triggerClusterHealthProbe}
              disabled={isProbing}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isProbing ? 'animate-spin text-cyan-400' : ''}`} />
              {isProbing ? 'Probing Mesh...' : 'Health Probe'}
            </button>
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Register Endpoint
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800/80 font-mono text-sm">
          <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800/60">
            <span className="text-xs text-gray-500 block">REGISTERED SERVICES</span>
            <span className="text-xl font-bold text-white mt-1 block flex items-baseline gap-2">
              {services.length}
              <span className="text-xs font-normal text-emerald-400 font-sans">({healthyCount} Healthy)</span>
            </span>
          </div>

          <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800/60">
            <span className="text-xs text-gray-500 block">CONTAINER NODES</span>
            <span className="text-xl font-bold text-white mt-1 block flex items-baseline gap-2">
              {runningContainersCount} / {containers.length}
              <span className="text-xs font-normal text-cyan-400 font-sans">Active Pods</span>
            </span>
          </div>

          <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800/60">
            <span className="text-xs text-gray-500 block">AVG SERVICE LATENCY</span>
            <span className="text-xl font-bold text-cyan-400 mt-1 block">
              {avgLatency} <span className="text-xs text-gray-400 font-normal">ms</span>
            </span>
          </div>

          <div className="bg-gray-950/60 p-3.5 rounded-xl border border-gray-800/60">
            <span className="text-xs text-gray-500 block">MESH UPTIME SLA</span>
            <span className="text-xl font-bold text-emerald-400 mt-1 block">
              99.998%
            </span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* View switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-900 border border-gray-800 rounded-xl">
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
              activeTab === 'endpoints' 
                ? 'bg-cyan-500 text-black shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Registered Endpoints ({services.length})
          </button>
          <button
            onClick={() => setActiveTab('containers')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all cursor-pointer ${
              activeTab === 'containers' 
                ? 'bg-cyan-500 text-black shadow-md' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Container Health ({containers.length})
          </button>
        </div>

        {/* Search and Category Filters */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name, container, domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="bg-gray-900 border border-gray-800 text-xs font-mono text-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Domains</option>
            <option value="carrier">Carrier Core</option>
            <option value="family">Family Time Network</option>
            <option value="ai">AI Autonomous</option>
            <option value="edge">Edge & VPN Mesh</option>
            <option value="security">Security & Vaults</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-gray-900 border border-gray-800 text-xs font-mono text-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="HEALTHY">Healthy</option>
            <option value="DEGRADED">Degraded</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'endpoints' ? (
        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-950/80 text-gray-400 font-mono text-xs border-b border-gray-800">
                <tr>
                  <th className="px-5 py-3.5">SERVICE & DOMAIN</th>
                  <th className="px-4 py-3.5">UPSTREAM CONTAINER</th>
                  <th className="px-4 py-3.5">PROTOCOL / PORT</th>
                  <th className="px-4 py-3.5">RBAC SECURITY TIER</th>
                  <th className="px-4 py-3.5">HEALTH & LATENCY</th>
                  <th className="px-4 py-3.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-sans">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-500 font-mono">
                      No services match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map(service => (
                    <tr key={service.id} className="hover:bg-gray-800/40 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-gray-800/80 border border-gray-700/60 mt-0.5 text-cyan-400">
                            <Server className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                              {service.name}
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400 font-mono border border-gray-700">
                                {service.version}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
                              <Globe className="w-3 h-3 text-gray-500" />
                              {service.domain}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 font-mono text-xs text-gray-300">
                        <span className="px-2 py-1 rounded-md bg-gray-950 border border-gray-800 text-cyan-300">
                          {service.container}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            {service.protocol}
                          </span>
                          <span className="text-gray-400">:{service.port}</span>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          {service.rbacTier}
                        </span>
                      </td>

                      <td className="px-4 py-4 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full font-semibold ${
                            service.healthStatus === 'HEALTHY' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                              : service.healthStatus === 'DEGRADED'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              service.healthStatus === 'HEALTHY' ? 'bg-emerald-400' : 'bg-amber-400'
                            }`} />
                            {service.healthStatus}
                          </span>
                          <span className="text-gray-400">{service.latencyMs}ms</span>
                        </div>
                        <span className="text-[10px] text-gray-500 block mt-1">Uptime: {service.uptime}</span>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => showNotification(`Pinged ${service.name} at ${service.domain}. Result: 200 OK (${service.latencyMs}ms)`)}
                          className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors cursor-pointer"
                        >
                          Ping Test
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Container Health Section */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {containers.map(container => (
            <div 
              key={container.id} 
              className="bg-gray-900 border border-gray-800/80 rounded-2xl p-5 shadow-xl hover:border-gray-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                      {container.name}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-semibold ${
                        container.status === 'running'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : container.status === 'degraded'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 animate-pulse'
                      }`}>
                        {container.status.toUpperCase()}
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 font-mono mt-0.5">{container.podNode}</p>
                  </div>
                  <div className="p-2 bg-gray-950 rounded-lg border border-gray-800 text-gray-400">
                    <Terminal className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs my-4">
                  <div>
                    <div className="flex justify-between text-gray-400 mb-1">
                      <span className="flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-cyan-400" /> CPU Load</span>
                      <span className="text-white font-bold">{container.cpuPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-950 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${container.cpuPercent > 30 ? 'bg-amber-400' : 'bg-cyan-400'}`} 
                        style={{ width: `${Math.min(container.cpuPercent * 2, 100)}%` }} 
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-gray-400 mb-1">
                      <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5 text-blue-400" /> Memory Usage</span>
                      <span className="text-white font-bold">{container.memoryMb} MB / {container.maxMemoryMb} MB</span>
                    </div>
                    <div className="w-full bg-gray-950 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-blue-400" 
                        style={{ width: `${(container.memoryMb / container.maxMemoryMb) * 100}%` }} 
                      />
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-gray-950/70 border border-gray-800 text-[11px] space-y-1">
                    <div className="text-gray-400 flex items-center justify-between">
                      <span>Liveness Probe:</span>
                      <span className="text-emerald-400">{container.livenessProbe}</span>
                    </div>
                    <div className="text-gray-400 flex items-center justify-between">
                      <span>Readiness:</span>
                      <span className="text-gray-300">{container.readinessProbe}</span>
                    </div>
                    <div className="text-gray-400 flex items-center justify-between">
                      <span>Restarts (48h):</span>
                      <span className="text-white font-bold">{container.restarts}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-gray-800/80">
                <button
                  onClick={() => restartContainer(container.id, container.name)}
                  disabled={container.status === 'restarting'}
                  className="flex-1 py-1.5 rounded-lg text-xs font-mono font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3 h-3 ${container.status === 'restarting' ? 'animate-spin' : ''}`} />
                  Safe Restart
                </button>
                <button
                  onClick={() => showNotification(`Logs retrieved for ${container.name}: All subsystems normal.`)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-gray-950 hover:bg-gray-800 text-cyan-400 border border-gray-800 transition-colors cursor-pointer"
                >
                  Logs
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Register Service Endpoint</h3>
                  <p className="text-xs text-gray-400 font-mono">Binds new microservice to FTN Anycast Ingress</p>
                </div>
              </div>
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterService} className="mt-4 space-y-4 font-mono text-xs">
              <div>
                <label className="block text-gray-300 font-medium mb-1">Service Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FTN Telemetry Collector"
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Domain / Namespace</label>
                  <input
                    type="text"
                    required
                    placeholder="telemetry.familytimenet.com"
                    value={formData.domain}
                    onChange={(e) => setFormData(p => ({ ...p, domain: e.target.value }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(p => ({ ...p, category: e.target.value as any }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="carrier">Carrier Core</option>
                    <option value="family">Family Time Network</option>
                    <option value="ai">AI Autonomous</option>
                    <option value="edge">Edge & Mesh</option>
                    <option value="security">Security & Vaults</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-gray-300 font-medium mb-1">Upstream Container Name</label>
                  <input
                    type="text"
                    required
                    placeholder="ftn-telemetry-collector"
                    value={formData.container}
                    onChange={(e) => setFormData(p => ({ ...p, container: e.target.value }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">Internal Port</label>
                  <input
                    type="number"
                    required
                    value={formData.port}
                    onChange={(e) => setFormData(p => ({ ...p, port: Number(e.target.value) }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-medium mb-1">Ingress Protocol</label>
                  <select
                    value={formData.protocol}
                    onChange={(e) => setFormData(p => ({ ...p, protocol: e.target.value as any }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="HTTP/REST">HTTP/REST</option>
                    <option value="gRPC">gRPC</option>
                    <option value="WireGuard">WireGuard</option>
                    <option value="DoH/DoQ">DoH/DoQ</option>
                    <option value="mTLS">mTLS</option>
                    <option value="BGP/EVPN">BGP/EVPN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-medium mb-1">RBAC Security Tier</label>
                  <input
                    type="text"
                    value={formData.rbacTier}
                    onChange={(e) => setFormData(p => ({ ...p, rbacTier: e.target.value }))}
                    className="w-full bg-gray-950 border border-gray-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  Register Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
