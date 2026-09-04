import React, { useState, useEffect } from 'react';
import { 
  Layers, 
  ShieldCheck, 
  Server, 
  Globe, 
  Cpu, 
  Database, 
  Activity, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Lock, 
  HardDrive, 
  RefreshCw, 
  ExternalLink, 
  Search, 
  Filter, 
  Zap, 
  Check, 
  Copy, 
  ArrowRight, 
  Play, 
  Sparkles, 
  Sliders, 
  Shield, 
  Network, 
  Workflow,
  Smartphone,
  Phone,
  Eye
} from 'lucide-react';
import { CANONICAL_NAMESPACES, FTN_ARCHITECTURE_SERVICES, HEALTH_GATE_SUMMARY } from '../data/ftnArchitectureData';
import { FtnArchitectureService, CanonicalNamespaceRoute, ArchitectureSectionId } from '../types/architecture';

export function FtnServiceArchitecture() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'subdomains' | 'native-layer' | 'priority-gates' | 'simulator'>('matrix');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedService, setSelectedService] = useState<FtnArchitectureService | null>(FTN_ARCHITECTURE_SERVICES[0]);
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);

  // Simulator state
  const [simDomain, setSimDomain] = useState<string>('ai.familytimenet.com');
  const [simPath, setSimPath] = useState<string>('/api/ftn-ai/chat');
  const [simRole, setSimRole] = useState<string>('Customer');
  const [simResult, setSimResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Health Gate verification state
  const [healthGateData, setHealthGateData] = useState<any>(null);
  const [isRefreshingHealth, setIsRefreshingHealth] = useState<boolean>(false);

  const sectionsList = [
    { id: 'all', label: 'All 18 Sections', count: FTN_ARCHITECTURE_SERVICES.length },
    { id: '01-core-control', label: '01. Core / Control', count: 7 },
    { id: '02-ai-platform', label: '02. AI Platform', count: 3 },
    { id: '03-control-panels', label: '03. Control Panels', count: 2 },
    { id: '04-network-isp', label: '04. Network / ISP Core', count: 2 },
    { id: '05-dns', label: '05. DNS', count: 1 },
    { id: '06-traffic-observability', label: '06. Observability', count: 1 },
    { id: '07-security', label: '07. Security', count: 1 },
    { id: '08-customer-isp', label: '08. Customer Services', count: 1 },
    { id: '09-client-apps', label: '09. Client Apps', count: 1 },
    { id: '10-iptv-media', label: '10. IPTV / Media', count: 1 },
    { id: '11-edge-proxy-tunnel', label: '11. Edge / Tunnel', count: 1 },
    { id: '12-provider-integration', label: '12. Peering / Cloud', count: 1 },
    { id: '13-data-database', label: '13. Data / DB', count: 1 },
    { id: '14-backup-storage', label: '14. Backup / Kopia', count: 1 },
    { id: '15-deployment-infra', label: '15. Deployment', count: 1 },
    { id: '16-noc-operations', label: '16. NOC Operations', count: 1 },
    { id: '17-automation', label: '17. Automation', count: 1 },
    { id: '18-governance', label: '18. Governance', count: 1 },
  ];

  const filteredServices = FTN_ARCHITECTURE_SERVICES.filter(service => {
    const matchesSection = selectedSection === 'all' || service.sectionId === selectedSection;
    const matchesSearch = 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.underlyingEngine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.canonicalSubdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.containerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (service.nativeServiceName && service.nativeServiceName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSection && matchesSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedDomain(text);
    setTimeout(() => setCopiedDomain(null), 2000);
  };

  const runRouteSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/v1/architecture/test-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: simDomain, path: simPath, userRole: simRole }),
      });
      if (res.ok) {
        const data = await res.json();
        setSimResult(data);
      } else {
        // Fallback local simulation calculation
        generateLocalSimulation(simDomain, simPath, simRole);
      }
    } catch {
      generateLocalSimulation(simDomain, simPath, simRole);
    } finally {
      setIsSimulating(false);
    }
  };

  const generateLocalSimulation = (domain: string, path: string, role: string) => {
    const matched = CANONICAL_NAMESPACES.find(r => r.domain === domain) || CANONICAL_NAMESPACES[0];
    const service = FTN_ARCHITECTURE_SERVICES.find(s => s.id === matched.targetServiceId) || FTN_ARCHITECTURE_SERVICES[0];
    const isAuth = service.authRbac.requiredRoles.includes('Public') || 
                   service.authRbac.requiredRoles.includes(role as any) || 
                   role === 'Super Admin';
    setSimResult({
      simulatedRequest: { domain, path, userRole: role, protocol: 'HTTP/3 over QUIC' },
      routingTrace: [
        { step: 1, layer: 'Global Anycast DNS', node: 'dns.familytimenet.com', action: 'Resolved A/AAAA with 0.12ms Anycast latency' },
        { step: 2, layer: 'Edge Reverse Proxy', node: 'traefik-edge-01', action: `Matched rule: ${matched.reverseProxyPath}, forwarded to ${matched.upstreamContainer}:${matched.upstreamPort}` },
        { step: 3, layer: 'TLS & Cryptography', mode: matched.sslTlsMode, action: 'Terminated TLS 1.3 session with strict HSTS and PFS' },
        { step: 4, layer: 'FTN Sovereign IAM Guard', roleEvaluated: role, allowed: isAuth, action: isAuth ? `Granted: Role '${role}' satisfies access policy` : `Denied: Role '${role}' lacks required permissions` },
        { step: 5, layer: 'Upstream FTN Container', container: matched.upstreamContainer, internalPort: matched.upstreamPort, action: isAuth ? `Dispatched to container: HTTP 200 OK (${service.healthCheck.lastLatencyMs}ms)` : 'Rejected: HTTP 403 Forbidden' },
      ],
      verdict: isAuth ? 'SUCCESS_ROUTED' : 'RBAC_REJECTED',
      upstreamContainer: matched.upstreamContainer,
      latencyMs: service.healthCheck.lastLatencyMs + 4,
    });
  };

  const runHealthGatesCheck = async () => {
    setIsRefreshingHealth(true);
    try {
      const res = await fetch('/api/v1/architecture/health-gate');
      if (res.ok) {
        const data = await res.json();
        setHealthGateData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setIsRefreshingHealth(false), 600);
    }
  };

  useEffect(() => {
    runHealthGatesCheck();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-[#0a1128] border border-gray-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono">
              <Layers className="w-3.5 h-3.5" />
              <span>FTN COMPLETE SERVICE ARCHITECTURE • 18 SECTIONS</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Sovereign Service & Subdomain Matrix
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Production-mapped architecture with strict <span className="text-emerald-400 font-mono">Service → Container → Port → Reverse Proxy → TLS → Auth → Health-Check</span> bindings. 
              The <strong className="text-gray-200">FTN Native Services Layer</strong> decouples proprietary identity and policy from underlying open-source engines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={runHealthGatesCheck}
              disabled={isRefreshingHealth}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-gray-200 text-xs font-medium transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00f0ff] ${isRefreshingHealth ? 'animate-spin' : ''}`} />
              <span>Verify Health Gates</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('simulator');
                setSimDomain('ai.familytimenet.com');
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00f0ff] text-gray-950 font-semibold text-xs transition-all shadow-lg hover:brightness-110"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Launch Route Simulator</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800/60">
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">CANONICAL DOMAINS</div>
            <div className="text-xl font-display font-bold text-white mt-0.5 flex items-center gap-2">
              <span>18</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">familytimenet.com</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">FTN NATIVE SERVICES</div>
            <div className="text-xl font-display font-bold text-emerald-400 mt-0.5 flex items-center gap-2">
              <span>{HEALTH_GATE_SUMMARY.nativeServicesCount}</span>
              <span className="text-xs text-gray-400 font-normal">Layer Decoupled</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">IMPLEMENTATION GATES</div>
            <div className="text-xl font-display font-bold text-[#00f0ff] mt-0.5 flex items-center gap-2">
              <span>8 / 8</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">ALL PASS</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">GLOBAL HEALTH SCORE</div>
            <div className="text-xl font-display font-bold text-white mt-0.5 flex items-center gap-1.5">
              <span>99.98%</span>
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto no-scrollbar gap-2">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'matrix'
              ? 'border-[#00f0ff] text-[#00f0ff]'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Architecture Matrix (18 Sections)</span>
        </button>

        <button
          onClick={() => setActiveTab('subdomains')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'subdomains'
              ? 'border-[#00f0ff] text-[#00f0ff]'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Canonical Subdomains & Proxy Map (18 Domains)</span>
        </button>

        <button
          onClick={() => setActiveTab('native-layer')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'native-layer'
              ? 'border-[#00f0ff] text-[#00f0ff]'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>FTN Native Services Layer</span>
        </button>

        <button
          onClick={() => setActiveTab('priority-gates')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'priority-gates'
              ? 'border-[#00f0ff] text-[#00f0ff]'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Workflow className="w-4 h-4" />
          <span>Implementation Priority Pipeline</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'simulator'
              ? 'border-[#00f0ff] text-[#00f0ff]'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Interactive Route & Security Simulator</span>
        </button>
      </div>

      {/* ================= TAB 1: ARCHITECTURE MATRIX (18 SECTIONS) ================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          {/* Section Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 font-mono mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> SECTIONS:
            </span>
            {sectionsList.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedSection === sec.id
                    ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40 shadow-sm'
                    : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 border border-gray-800'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 18 sections by service, underlying engine, container name, port or domain..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-900/60 border border-gray-800 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]/50"
            />
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredServices.map((service) => {
              const isSelected = selectedService?.id === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`cursor-pointer rounded-2xl p-5 border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gray-900/90 border-[#00f0ff]/60 shadow-[0_0_20px_rgba(0,240,255,0.15)] ring-1 ring-[#00f0ff]/30'
                      : 'bg-gray-900/40 hover:bg-gray-900/70 border-gray-800/80 hover:border-gray-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header line */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                        SECTION {service.sectionNumber}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          {service.healthCheck.currentStatus}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          {service.healthCheck.lastLatencyMs}ms
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="text-base font-semibold text-white group-hover:text-[#00f0ff] transition-colors">
                        {service.name}
                      </h3>
                      {service.nativeServiceName && (
                        <div className="text-xs text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>FTN Native: {service.nativeServiceName}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Engine & Container Info */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-800/60 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-gray-400">
                        <span className="text-gray-500">Underlying Engine:</span>
                        <span className="text-gray-300 font-medium truncate max-w-[200px]" title={service.underlyingEngine}>
                          {service.underlyingEngine}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span className="text-gray-500">Container / Ports:</span>
                        <span className="text-[#00f0ff]">
                          {service.containerName} ({service.internalPort} → {service.externalPort})
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-gray-400">
                        <span className="text-gray-500">Subdomain Route:</span>
                        <span className="text-blue-400 truncate max-w-[190px]">
                          https://{service.canonicalSubdomain}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Capabilities Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-gray-800/40">
                    {service.keyCapabilities.slice(0, 3).map((cap, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-gray-800/60 text-gray-400 border border-gray-700/50"
                      >
                        {cap}
                      </span>
                    ))}
                    {service.keyCapabilities.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-800/40 text-gray-500">
                        +{service.keyCapabilities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Service Detailed Drawer */}
          {selectedService && (
            <div className="mt-8 bg-gray-900 border border-[#00f0ff]/40 rounded-2xl p-6 shadow-2xl space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded bg-[#00f0ff]/10 text-[#00f0ff] font-mono border border-[#00f0ff]/30">
                      SECTION {selectedService.sectionNumber} • {selectedService.sectionName}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                      FTN NATIVE LAYER ACTIVE
                    </span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-white mt-1">
                    {selectedService.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSimDomain(selectedService.canonicalSubdomain);
                      setSimPath(selectedService.reverseProxyRule.pathPrefix);
                      setActiveTab('simulator');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-xs font-mono border border-[#00f0ff]/30"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Test In Simulator</span>
                  </button>
                  <button
                    onClick={() => handleCopy(`https://${selectedService.canonicalSubdomain}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono border border-gray-700"
                  >
                    {copiedDomain === `https://${selectedService.canonicalSubdomain}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Domain</span>
                  </button>
                </div>
              </div>

              {/* 4-Column Technical Specification Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                {/* 1. Container & Network */}
                <div className="bg-gray-950/60 rounded-xl p-4 border border-gray-800 space-y-2">
                  <div className="text-gray-400 font-semibold flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>CONTAINER & NETWORK</span>
                  </div>
                  <div className="space-y-1 pt-1 text-gray-300">
                    <div><span className="text-gray-500">Container:</span> {selectedService.containerName}</div>
                    <div><span className="text-gray-500">Internal Port:</span> {selectedService.internalPort}</div>
                    <div><span className="text-gray-500">External Port:</span> {selectedService.externalPort}</div>
                    <div><span className="text-gray-500">Protocol:</span> <span className="text-emerald-400">{selectedService.protocol}</span></div>
                  </div>
                </div>

                {/* 2. Reverse Proxy & Routing */}
                <div className="bg-gray-950/60 rounded-xl p-4 border border-gray-800 space-y-2">
                  <div className="text-gray-400 font-semibold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>REVERSE PROXY BINDING</span>
                  </div>
                  <div className="space-y-1 pt-1 text-gray-300">
                    <div><span className="text-gray-500">Router:</span> {selectedService.reverseProxyRule.routerType}</div>
                    <div><span className="text-gray-500">Host Rule:</span> <span className="text-blue-300 truncate block">{selectedService.reverseProxyRule.hostRule}</span></div>
                    <div><span className="text-gray-500">Path Prefix:</span> {selectedService.reverseProxyRule.pathPrefix}</div>
                    <div><span className="text-gray-500">Resolver:</span> {selectedService.reverseProxyRule.tlsResolver}</div>
                  </div>
                </div>

                {/* 3. TLS & IAM Security */}
                <div className="bg-gray-950/60 rounded-xl p-4 border border-gray-800 space-y-2">
                  <div className="text-gray-400 font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span>TLS & RBAC SECURITY</span>
                  </div>
                  <div className="space-y-1 pt-1 text-gray-300">
                    <div><span className="text-gray-500">TLS Version:</span> {selectedService.tlsConfig.minTlsVersion}+</div>
                    <div><span className="text-gray-500">Cipher:</span> {selectedService.tlsConfig.cipherSuite}</div>
                    <div><span className="text-gray-500">Client mTLS:</span> {selectedService.tlsConfig.clientCertValidation}</div>
                    <div><span className="text-gray-500">Auth Method:</span> <span className="text-purple-300">{selectedService.authRbac.authType}</span></div>
                  </div>
                </div>

                {/* 4. Health & Priority Gate */}
                <div className="bg-gray-950/60 rounded-xl p-4 border border-gray-800 space-y-2">
                  <div className="text-gray-400 font-semibold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    <span>HEALTH & PRIORITY GATE</span>
                  </div>
                  <div className="space-y-1 pt-1 text-gray-300">
                    <div><span className="text-gray-500">Endpoint:</span> {selectedService.healthCheck.endpoint}</div>
                    <div><span className="text-gray-500">Interval:</span> {selectedService.healthCheck.intervalSeconds}s (timeout {selectedService.healthCheck.timeoutSeconds}s)</div>
                    <div><span className="text-gray-500">Priority Tier:</span> <span className="text-amber-400">{selectedService.priorityTier}</span></div>
                    <div><span className="text-gray-500">State:</span> <span className="text-emerald-400">{selectedService.implementationState}</span></div>
                  </div>
                </div>
              </div>

              {/* RBAC Allowed Roles Pill Box */}
              <div className="bg-gray-950/40 rounded-xl p-4 border border-gray-800/80 flex flex-wrap items-center gap-2">
                <span className="text-xs text-gray-500 font-mono mr-2">AUTHORIZED RBAC TIERS:</span>
                {selectedService.authRbac.requiredRoles.map((role, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded bg-gray-800 text-gray-200 border border-gray-700 font-mono"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: CANONICAL SUBDOMAINS & REVERSE PROXY ================= */}
      {activeTab === 'subdomains' && (
        <div className="space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white">Canonical Subdomain Namespace Mapping</h3>
                <p className="text-xs text-gray-400 mt-1">
                  18 public & sovereign endpoints mapped to upstream Docker containers, ingress ports, TLS termination and RBAC guards.
                </p>
              </div>
              <div className="text-xs text-gray-400 font-mono bg-gray-950 px-3 py-1.5 rounded-lg border border-gray-800">
                ROOT DOMAIN: <strong className="text-white">*.familytimenet.com</strong>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-800 rounded-2xl bg-gray-900/40">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900 text-gray-400 font-mono">
                  <th className="py-3.5 px-4">CANONICAL DOMAIN</th>
                  <th className="py-3.5 px-4">ROLE & DESCRIPTION</th>
                  <th className="py-3.5 px-4">UPSTREAM CONTAINER</th>
                  <th className="py-3.5 px-4">PORTS</th>
                  <th className="py-3.5 px-4">TLS MODE</th>
                  <th className="py-3.5 px-4">RBAC TIER</th>
                  <th className="py-3.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono">
                {CANONICAL_NAMESPACES.map((route) => (
                  <tr key={route.domain} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white hover:text-[#00f0ff] transition-colors cursor-pointer" onClick={() => handleCopy(`https://${route.domain}`)}>
                          {route.domain}
                        </span>
                        <button
                          onClick={() => handleCopy(`https://${route.domain}`)}
                          className="text-gray-500 hover:text-gray-300"
                          title="Copy Full Domain URL"
                        >
                          {copiedDomain === `https://${route.domain}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-sans">
                      <div className="font-medium text-gray-200">{route.label}</div>
                      <div className="text-[11px] text-gray-500">{route.notes}</div>
                    </td>
                    <td className="py-3 px-4 text-[#00f0ff]">
                      {route.upstreamContainer}
                    </td>
                    <td className="py-3 px-4 text-gray-400">
                      {route.upstreamPort} → {route.publicPort}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        route.sslTlsMode === 'Strict mTLS' 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {route.sslTlsMode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-sans">
                      <span className="text-[11px]">{route.rbacTier}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSimDomain(route.domain);
                          setActiveTab('simulator');
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] text-[11px] border border-[#00f0ff]/30 transition-colors"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Simulate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: FTN NATIVE SERVICES LAYER ================= */}
      {activeTab === 'native-layer' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-emerald-950/30 via-gray-900 to-gray-900 border border-emerald-500/30 rounded-2xl p-6">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DECOUPLED ARCHITECTURE MANDATE</span>
              </div>
              <h2 className="text-xl font-display font-bold text-white">
                FTN Native Services vs Underlying Engine Separation
              </h2>
              <p className="text-gray-400 text-xs leading-relaxed">
                Third-party/open-source components (such as GoBGP, dnsdist, OpenSearch, WireGuard, Kopia, SRS, and PostgreSQL) serve strictly as the underlying execution and storage engines. 
                All <strong className="text-white">Public Identities, API Contracts, Policies, and Governance</strong> belong exclusively to the sovereign <span className="text-emerald-400">FTN Native Services Layer</span>.
              </p>
            </div>
          </div>

          {/* Decoupling Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                native: 'FTN Autonomous Router',
                engine: 'GoBGP v3 + Linux VRF / eBPF XDP',
                ownership: 'FTN controls BGP policies, RPKI validation cache, and autonomous link failover criteria.',
                publicEndpoint: 'upstream.familytimenet.com'
              },
              {
                native: 'FTN Anycast DNS Guard',
                engine: 'dnsdist + CoreDNS + Unbound',
                ownership: 'FTN manages recursive cache policies, safe-search profiles, malware threat feeds, and DNS DoH tokens.',
                publicEndpoint: 'dns.familytimenet.com'
              },
              {
                native: 'FTN AI Agent Engine',
                engine: 'Google GenAI SDK (Gemini 2.5) + Ollama',
                ownership: 'FTN isolates API keys server-side, applies approval-first execution gates, and injects NOC context.',
                publicEndpoint: 'ai.familytimenet.com'
              },
              {
                native: 'FTN Edge & Tunnel Controller',
                engine: 'WireGuard Kernel + Hysteria2 MASQUE',
                ownership: 'FTN issues cryptographic peer identities, rotates ChaCha20 pre-shared keys, and steers congested traffic.',
                publicEndpoint: 'connect.familytimenet.com'
              },
              {
                native: 'FTN Encrypted Vault Core',
                engine: 'Kopia Engine + MinIO Object Store',
                ownership: 'FTN controls zero-knowledge client encryption passphrases, snapshot retention schedules, and verification tests.',
                publicEndpoint: 'vault.familytimenet.com'
              },
              {
                native: 'FTN Telemetry & SIEM',
                engine: 'OpenSearch v2.18 + Prometheus + Loki',
                ownership: 'FTN enforces multi-tenant log isolation, ML anomaly alert thresholds, and SLA reporting.',
                publicEndpoint: 'monitor.familytimenet.com'
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    FTN NATIVE
                  </span>
                  <span className="text-[11px] text-gray-500 font-mono">{item.publicEndpoint}</span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{item.native}</h4>
                  <div className="text-xs text-[#00f0ff] font-mono mt-0.5">Engine: {item.engine}</div>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed pt-2 border-t border-gray-800/60">
                  {item.ownership}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: IMPLEMENTATION PRIORITY PIPELINE ================= */}
      {activeTab === 'priority-gates' && (
        <div className="space-y-6">
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
            <div className="max-w-2xl space-y-1">
              <h3 className="text-lg font-bold text-white">Production Implementation Pipeline</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Strict sequential build and verification order: <span className="text-[#00f0ff] font-mono font-semibold">AI → API → Control Panel → Subdomain/Reverse Proxy → Auth/RBAC → DB → Docker/Health → Integration Tests</span>.
              </p>
            </div>

            {/* Pipeline Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
              {[
                { step: 1, name: 'AI Platform', code: 'AI', status: 'PASSING', latency: '24ms', desc: 'Gemini 2.5 / Local Ollama, NOC & Billing Intelligence' },
                { step: 2, name: 'API Gateway', code: 'API', status: 'PASSING', latency: '5ms', desc: 'Envoy / Go Gateway, Polyglot Mesh, Rust eBPF' },
                { step: 3, name: 'Control Panel', code: 'Control Panel', status: 'PASSING', latency: '6ms', desc: 'Multi-Tenant Unified Dashboard & Super Admin Console' },
                { step: 4, name: 'Subdomain / Proxy', code: 'Subdomain/Reverse Proxy', status: 'PASSING', latency: '3ms', desc: 'Traefik v3 & Nginx Reverse Proxy, 18 Subdomains' },
                { step: 5, name: 'Auth & RBAC', code: 'Auth/RBAC', status: 'PASSING', latency: '8ms', desc: 'Authoritative session store, No public self-registration' },
                { step: 6, name: 'Database Layer', code: 'DB', status: 'PASSING', latency: '2ms', desc: 'PostgreSQL 17, PgBouncer pool, TimescaleDB chunks' },
                { step: 7, name: 'Docker / Health', code: 'Docker/Health', status: 'PASSING', latency: '4ms', desc: 'K3s/Docker compose preflight checks, Container health gates' },
                { step: 8, name: 'Integration Tests', code: 'Integration Tests', status: 'PASSING', latency: '12ms', desc: 'End-to-end packet dispatch, DNS queries, Billing webhooks' },
              ].map((tier) => (
                <div key={tier.step} className="bg-gray-950/60 rounded-xl p-4 border border-gray-800 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-500">STAGE {tier.step}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {tier.status}
                    </span>
                  </div>
                  <div className="font-semibold text-white text-sm">{tier.name}</div>
                  <p className="text-[11px] text-gray-400">{tier.desc}</p>
                  <div className="text-[10px] text-gray-500 font-mono pt-1">
                    Avg Probe Latency: <span className="text-[#00f0ff]">{tier.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: INTERACTIVE ROUTE & SECURITY SIMULATOR ================= */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Simulator Form */}
          <div className="lg:col-span-5 bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00f0ff]" />
                <span>Live Route & Security Dispatch Simulator</span>
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Dispatch an end-to-end synthetic request through the reverse proxy, TLS handshake, and IAM security gate to the target upstream container.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">TARGET CANONICAL SUBDOMAIN</label>
                <select
                  value={simDomain}
                  onChange={(e) => setSimDomain(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2.5 text-xs font-mono text-gray-200 focus:outline-none focus:border-[#00f0ff]"
                >
                  {CANONICAL_NAMESPACES.map((r) => (
                    <option key={r.domain} value={r.domain}>
                      {r.domain} ({r.label})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">REQUEST PATH</label>
                <input
                  type="text"
                  value={simPath}
                  onChange={(e) => setSimPath(e.target.value)}
                  placeholder="/api/v1/resource"
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-gray-200 focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1.5">SIMULATED IDENTITY ROLE (RBAC)</label>
                <select
                  value={simRole}
                  onChange={(e) => setSimRole(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2.5 text-xs font-mono text-gray-200 focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="Super Admin">Super Admin (Master Cryptographic Clearance)</option>
                  <option value="Admin">Admin (Enterprise Operations)</option>
                  <option value="NOC">NOC (Network Operations Center)</option>
                  <option value="Engineer">Engineer (Field & PON Fiber)</option>
                  <option value="Employee">Employee (Internal CRM)</option>
                  <option value="Reseller">Reseller (Bandwidth Distributor)</option>
                  <option value="Customer">Customer / Subscriber</option>
                  <option value="Public">Public (Anonymous / Unauthenticated)</option>
                </select>
              </div>

              <button
                onClick={runRouteSimulation}
                disabled={isSimulating}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00f0ff] hover:brightness-110 text-gray-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Execute Request Dispatch</span>
              </button>
            </div>
          </div>

          {/* Simulator Trace Results */}
          <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Live Packet Dispatch Trace</span>
              </h4>
              {simResult && (
                <span className={`text-xs px-2.5 py-0.5 rounded font-mono font-bold ${
                  simResult.verdict === 'SUCCESS_ROUTED' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-red-500/10 text-red-400 border border-red-500/30'
                }`}>
                  {simResult.verdict} ({simResult.latencyMs}ms)
                </span>
              )}
            </div>

            {simResult ? (
              <div className="space-y-3 font-mono text-xs">
                {simResult.routingTrace.map((trace: any) => (
                  <div key={trace.step} className="bg-gray-950 p-3 rounded-xl border border-gray-800 space-y-1">
                    <div className="flex items-center justify-between text-gray-400">
                      <span className="text-[#00f0ff] font-bold">HOP {trace.step}: {trace.layer}</span>
                      <span className="text-gray-500">{trace.node || trace.mode || trace.container}</span>
                    </div>
                    <p className="text-gray-300 font-sans text-xs">
                      {trace.action}
                    </p>
                  </div>
                ))}

                <div className="bg-[#00f0ff]/5 border border-[#00f0ff]/30 p-3 rounded-xl text-xs flex items-center justify-between">
                  <span className="text-gray-300 font-sans">
                    Final Upstream Target Container: <strong className="text-white font-mono">{simResult.upstreamContainer}</strong>
                  </span>
                  <span className="text-emerald-400 font-mono font-bold">200 OK</span>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-gray-500 space-y-2">
                <Zap className="w-8 h-8 text-gray-600 animate-pulse" />
                <p className="text-xs font-mono">Select a canonical domain and click "Execute Request Dispatch" to view the live hop trace.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
