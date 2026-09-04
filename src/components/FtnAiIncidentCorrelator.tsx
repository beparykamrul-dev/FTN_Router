import React, { useState, useEffect, useMemo } from 'react';
import { 
  BrainCircuit, 
  ShieldAlert, 
  Activity, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Terminal, 
  Sparkles, 
  RefreshCw, 
  Layers, 
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Shield,
  Zap,
  Flame,
  Check,
  X,
  SlidersHorizontal,
  Server
} from 'lucide-react';
import { cn } from '../utils';

export interface CorrelatedIncident {
  id: string;
  title: string;
  category: 'security' | 'performance' | 'routing' | 'infrastructure';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'investigating' | 'mitigated' | 'resolved';
  timestamp: string;
  blastRadius: number; // 0-100%
  noiseReductionRatio: string;
  rawEventCount: number;
  affectedServices: string[];
  affectedHosts: string[];
  rootCause: string;
  aiExplanation: string;
  wazuhAlerts: {
    id: string;
    ruleId: number;
    level: number;
    description: string;
    agent: string;
    timestamp: string;
    cve?: string;
  }[];
  jaegerTraces: {
    traceId: string;
    spanName: string;
    serviceName: string;
    durationMs: number;
    statusCode: string;
    timestamp: string;
    errorDetail?: string;
  }[];
  recommendedMitigation: {
    actionTitle: string;
    scriptType: 'eBPF' | 'BGP' | 'Kube' | 'Firewall' | 'Envoy';
    codeSnippet: string;
    automatedAllowed: boolean;
  };
}

const INITIAL_INCIDENTS: CorrelatedIncident[] = [
  {
    id: 'INC-2026-8901',
    title: 'Distributed SYN Flood & Edge Ingress Saturation with Cascading Microservice Timeouts',
    category: 'security',
    severity: 'critical',
    status: 'active',
    timestamp: '2 mins ago (10:14:02 UTC)',
    blastRadius: 84,
    noiseReductionRatio: '98.6% (1,420 events → 1 Incident)',
    rawEventCount: 1420,
    affectedServices: ['edge-api-gateway', 'pgbouncer-pool', 'auth-service', 'bgp-as64512'],
    affectedHosts: ['edge-sin-01.ftn.mesh', 'core-lax-02.ftn.mesh'],
    rootCause: 'Coordinated volumetric SYN attack targeting port 443 saturated NIC ring buffers and connection conntrack tables on edge-sin-01, triggering Wazuh Rule 100201 (eBPF XDP Drop Rate > 45k/s) and cascading 504 Gateway Timeouts in Jaeger trace spans.',
    aiExplanation: 'AI Correlator mapped 1,240 Wazuh SYN flood syscheck log alerts to 180 Jaeger span latency anomalies (p99 spiked from 14ms to 3,840ms). The root origin is ingress prefix 198.51.100.0/24 hitting edge-sin-01.',
    wazuhAlerts: [
      { id: 'wz-91024', ruleId: 100201, level: 12, description: 'eBPF XDP Drop Threshold Exceeded (>45,000 pkts/s)', agent: 'edge-sin-01.ftn.mesh', timestamp: '10:13:58', cve: 'CWE-400' },
      { id: 'wz-91025', ruleId: 5716, level: 10, description: 'SSHD High connection rate from untrusted subnet', agent: 'edge-sin-01.ftn.mesh', timestamp: '10:13:59' },
      { id: 'wz-91026', ruleId: 80710, level: 13, description: 'Kernel conntrack table: table full, dropping packet', agent: 'edge-sin-01.ftn.mesh', timestamp: '10:14:01' },
      { id: 'wz-91028', ruleId: 80712, level: 14, description: 'XDP driver fallback to SKB mode under pressure', agent: 'edge-sin-01.ftn.mesh', timestamp: '10:14:02' }
    ],
    jaegerTraces: [
      { traceId: '8f4a91c2b0e417a8', spanName: 'HTTP POST /api/v1/auth/exchange', serviceName: 'edge-api-gateway', durationMs: 3840, statusCode: '504 Gateway Timeout', timestamp: '10:14:00', errorDetail: 'upstream request timeout to pgbouncer-pool:6432' },
      { traceId: '8f4a91c2b0e417a8', spanName: 'TCP Handshake /pgbouncer', serviceName: 'pgbouncer-pool', durationMs: 2500, statusCode: 'Error: Connection reset by peer', timestamp: '10:14:01' },
      { traceId: '3c99e120f8d34199', spanName: 'gRPC /ftn.v1.MeshRouter/RouteTraffic', serviceName: 'bgp-as64512', durationMs: 1420, statusCode: 'DeadlineExceeded', timestamp: '10:14:02' }
    ],
    recommendedMitigation: {
      actionTitle: 'Inject eBPF XDP Blackhole Rule & Flush Conntrack',
      scriptType: 'eBPF',
      codeSnippet: `xdp-loader load -m native -s xdp_drop_subnets eth0 /etc/ebpf/syn_drop.o\nbpftool map update id 42 key hex 198 51 100 0 24 value hex 01\nsysctl -w net.netfilter.nf_conntrack_tcp_timeout_syn_recv=5`,
      automatedAllowed: true
    }
  },
  {
    id: 'INC-2026-8902',
    title: 'BGP Route Flapping on Tier-1 Transit Peering Causing High Trace Jitter',
    category: 'routing',
    severity: 'high',
    status: 'investigating',
    timestamp: '11 mins ago (10:05:14 UTC)',
    blastRadius: 58,
    noiseReductionRatio: '96.2% (680 events → 1 Incident)',
    rawEventCount: 680,
    affectedServices: ['gobgp-core', 'wireguard-mesh', 'anycast-dns'],
    affectedHosts: ['router-fra-01.ftn.mesh', 'transit-he-as6939'],
    rootCause: 'BGP session state flapping between ESTABLISHED and IDLE with AS6939 due to MTU mismatch on 9000-byte jumbo frames, generating continuous route recalculations.',
    aiExplanation: 'Wazuh BGP daemon logs flagged 240 neighbor drops within 3 minutes. Correlated Jaeger traces revealed intermittent 400ms route re-lookup latency on inter-DC WireGuard tunnels traversing Frankfurt.',
    wazuhAlerts: [
      { id: 'wz-90811', ruleId: 60102, level: 9, description: 'GoBGP Peer AS6939 state changed: ESTABLISHED -> ACTIVE', agent: 'router-fra-01.ftn.mesh', timestamp: '10:05:08' },
      { id: 'wz-90812', ruleId: 60105, level: 11, description: 'High BGP prefix withdrawal burst (>12,000 routes/sec)', agent: 'router-fra-01.ftn.mesh', timestamp: '10:05:10' }
    ],
    jaegerTraces: [
      { traceId: '5e710bf302d99104', spanName: 'Tunnel Forwarding wg-fra-01', serviceName: 'wireguard-mesh', durationMs: 412, statusCode: 'Warn: High Jitter (+380ms)', timestamp: '10:05:11' },
      { traceId: '5e710bf302d99104', spanName: 'DNS UDP Resolution', serviceName: 'anycast-dns', durationMs: 395, statusCode: 'Degraded', timestamp: '10:05:13' }
    ],
    recommendedMitigation: {
      actionTitle: 'Clamp BGP TCP MSS & Temporarily Deprioritize AS6939 Peer',
      scriptType: 'BGP',
      codeSnippet: `gobgp neighbor 2001:470:1:1::1 disable\niptables -t mangle -A POSTROUTING -p tcp --tcp-flags SYN,RST SYN -o eth1 -j TCPMSS --clamp-mss-to-pmtu\ngobgp neighbor 2001:470:1:1::1 enable`,
      automatedAllowed: true
    }
  },
  {
    id: 'INC-2026-8903',
    title: 'PostgreSQL Connection Exhaustion via PgBouncer Pool Desync',
    category: 'infrastructure',
    severity: 'medium',
    status: 'mitigated',
    timestamp: '34 mins ago (09:42:20 UTC)',
    blastRadius: 32,
    noiseReductionRatio: '94.1% (380 events → 1 Incident)',
    rawEventCount: 380,
    affectedServices: ['pgbouncer-service', 'subscriber-billing', 'vault-api'],
    affectedHosts: ['db-primary-01.ftn.mesh'],
    rootCause: 'Orphaned client sessions in PgBouncer in transaction pooling mode failed to release connection locks after client disconnects.',
    aiExplanation: 'Wazuh log analyzer caught 180 `FATAL: remaining connection slots reserved for non-replication superusers` alerts while Jaeger traces identified a cluster of 500ms pool wait queue delays.',
    wazuhAlerts: [
      { id: 'wz-89912', ruleId: 50401, level: 8, description: 'PostgreSQL max_connections limit 96% reached', agent: 'db-primary-01.ftn.mesh', timestamp: '09:42:15' },
      { id: 'wz-89915', ruleId: 50404, level: 9, description: 'PgBouncer server connection wait queue > 50', agent: 'db-primary-01.ftn.mesh', timestamp: '09:42:18' }
    ],
    jaegerTraces: [
      { traceId: 'a108f921bc341077', spanName: 'DB Query: SELECT subscriber_tier', serviceName: 'subscriber-billing', durationMs: 820, statusCode: 'Pool Timeout', timestamp: '09:42:19' }
    ],
    recommendedMitigation: {
      actionTitle: 'Kill Idle-in-Transaction Sessions & Reload PgBouncer',
      scriptType: 'Kube',
      codeSnippet: `psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction' AND state_change < current_timestamp - INTERVAL '2 minutes';"\nkill -HUP $(pgrep pgbouncer)`,
      automatedAllowed: true
    }
  },
  {
    id: 'INC-2026-8904',
    title: 'Potential SSH Privileged Credential Stuffing on Bastion Jump Host',
    category: 'security',
    severity: 'low',
    status: 'resolved',
    timestamp: '1 hour ago (09:10:44 UTC)',
    blastRadius: 15,
    noiseReductionRatio: '99.1% (890 events → 1 Incident)',
    rawEventCount: 890,
    affectedServices: ['sshd-bastion', 'mfa-guardian'],
    affectedHosts: ['jump-sin-01.ftn.mesh'],
    rootCause: 'Distributed IP dictionary attack against port 22 blocked by fail2ban and hardware FIDO2 key requirement.',
    aiExplanation: 'Wazuh aggregated 890 failed password attempts across 45 unique IPs. Jaeger trace verification confirmed zero successful authenticated sessions traversed to internal core APIs.',
    wazuhAlerts: [
      { id: 'wz-88210', ruleId: 5710, level: 7, description: 'SSH failed password attempt for root from 185.220.101.4', agent: 'jump-sin-01.ftn.mesh', timestamp: '09:10:30' }
    ],
    jaegerTraces: [
      { traceId: '1074e892ad01f440', spanName: 'SSH Auth Handshake', serviceName: 'sshd-bastion', durationMs: 45, statusCode: 'Auth Rejected (Missing FIDO2 Key)', timestamp: '09:10:32' }
    ],
    recommendedMitigation: {
      actionTitle: 'Rotate Bastion Port & Add Cloudflare Zero Trust Tunnel',
      scriptType: 'Firewall',
      codeSnippet: `nft add element inet filter blacklist { 185.220.101.0/24, 45.154.255.0/24 }\nsystemctl restart nftables`,
      automatedAllowed: true
    }
  }
];

export function FtnAiIncidentCorrelator() {
  const [incidents, setIncidents] = useState<CorrelatedIncident[]>(INITIAL_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<CorrelatedIncident>(INITIAL_INCIDENTS[0]);
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'security' | 'performance' | 'routing' | 'infrastructure'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const [executingMitigation, setExecutingMitigation] = useState(false);
  const [mitigationLog, setMitigationLog] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'details' | 'correlator_matrix' | 'noise_engine' | 'audit'>('details');

  // Simulated live event streamer
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      // Simulate raw alert count increment
      setIncidents(prev => prev.map(inc => {
        if (inc.status === 'active') {
          return {
            ...inc,
            rawEventCount: inc.rawEventCount + Math.floor(Math.random() * 4) + 1
          };
        }
        return inc;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const matchSeverity = severityFilter === 'all' || inc.severity === severityFilter;
      const matchCategory = categoryFilter === 'all' || inc.category === categoryFilter;
      const matchSearch = searchQuery === '' || 
        inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.affectedServices.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        inc.affectedHosts.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSeverity && matchCategory && matchSearch;
    });
  }, [incidents, severityFilter, categoryFilter, searchQuery]);

  const stats = useMemo(() => {
    const totalRaw = incidents.reduce((acc, curr) => acc + curr.rawEventCount, 0);
    const criticalCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
    const highCount = incidents.filter(i => i.severity === 'high' && i.status !== 'resolved').length;
    const activeCount = incidents.filter(i => i.status === 'active').length;
    return {
      totalRaw,
      criticalCount,
      highCount,
      activeCount,
      noiseReduction: '96.8%'
    };
  }, [incidents]);

  const handleExecuteMitigation = (incident: CorrelatedIncident) => {
    setExecutingMitigation(true);
    setMitigationLog([`[INIT] Validating incident ${incident.id} context with AI RCA model...`]);

    setTimeout(() => {
      setMitigationLog(prev => [...prev, `[EVAL] Blast radius calculated: ${incident.blastRadius}% across ${incident.affectedServices.length} microservices`]);
    }, 600);

    setTimeout(() => {
      setMitigationLog(prev => [...prev, `[DISPATCH] Deploying automated mitigation payload (${incident.recommendedMitigation.scriptType})...`]);
    }, 1300);

    setTimeout(() => {
      setMitigationLog(prev => [...prev, `[VERIFY] Wazuh Rule drops halted. Jaeger p99 latency returned to <20ms.`]);
      setMitigationLog(prev => [...prev, `[SUCCESS] Incident ${incident.id} state updated to MITIGATED.`]);
      setExecutingMitigation(false);

      // Update incident state
      setIncidents(prev => prev.map(inc => inc.id === incident.id ? { ...inc, status: 'mitigated' } : inc));
      if (selectedIncident.id === incident.id) {
        setSelectedIncident(prev => ({ ...prev, status: 'mitigated' }));
      }

      window.dispatchEvent(new CustomEvent('add-toast', {
        detail: {
          type: 'success',
          title: 'AI Incident Mitigated',
          message: `Autonomous mitigation applied successfully to ${incident.id}.`
        }
      }));
    }, 2200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gray-900/60 p-6 rounded-2xl border border-gray-800 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#00ff66]/20 border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <BrainCircuit className="w-6 h-6 text-[#00f0ff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                FTN AI Incident Correlator
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30">
                  Wazuh + Jaeger Fusion
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                Autonomous multi-source alert aggregation, noise reduction & root cause analysis (RCA)
              </p>
            </div>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border",
              isStreaming 
                ? "bg-[#00ff66]/10 border-[#00ff66]/40 text-[#00ff66]" 
                : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white"
            )}
          >
            {isStreaming ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
                <Pause className="w-3.5 h-3.5" />
                Live Ingestion Active
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Ingestion Paused
              </>
            )}
          </button>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('add-toast', {
                detail: {
                  type: 'info',
                  title: 'Correlator Resynced',
                  message: 'Re-queried Wazuh Indexer and Jaeger Elastic collector for new traces.'
                }
              }));
            }}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-300 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Resync
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Raw Telemetry Events</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {stats.totalRaw.toLocaleString()}
          </div>
          <span className="text-[11px] text-blue-400/90 font-mono">Wazuh logs + Jaeger spans</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">AI Noise Elimination</span>
            <Sparkles className="w-4 h-4 text-[#00ff66]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#00ff66]">
            {stats.noiseReduction}
          </div>
          <span className="text-[11px] text-gray-400 font-mono">3,370 raw → 4 actionable</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Critical P1 Incidents</span>
            <Flame className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">
            {stats.criticalCount} Active
          </div>
          <span className="text-[11px] text-red-400/80 font-mono">Requires immediate review</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">AI MTTR Acceleration</span>
            <Zap className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#00f0ff]">
            1.4s
          </div>
          <span className="text-[11px] text-[#00f0ff]/80 font-mono">Mean Time to Root-Cause</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <button
          onClick={() => setActiveTab('details')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
            activeTab === 'details'
              ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
          )}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Active Correlated Incidents ({filteredIncidents.length})
        </button>

        <button
          onClick={() => setActiveTab('correlator_matrix')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
            activeTab === 'correlator_matrix'
              ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
          )}
        >
          <Activity className="w-3.5 h-3.5" />
          Wazuh & Jaeger Fusion Stream
        </button>

        <button
          onClick={() => setActiveTab('noise_engine')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
            activeTab === 'noise_engine'
              ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
          )}
        >
          <Sparkles className="w-3.5 h-3.5" />
          Noise Reduction Pipeline
        </button>
      </div>

      {/* Main View: Active Incidents */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Incident List & Filters */}
          <div className="lg:col-span-5 space-y-4">
            {/* Search & Filter Bar */}
            <div className="glass-panel p-3 rounded-xl border border-gray-800 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by ID, host, service or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900/80 border border-gray-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-[#00f0ff] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(['all', 'critical', 'high', 'medium', 'low'] as const).map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-colors flex-shrink-0",
                      severityFilter === sev 
                        ? "bg-gray-700 text-white font-bold border border-gray-600" 
                        : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                    )}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Incidents Cards List */}
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {filteredIncidents.map((incident) => {
                const isSelected = selectedIncident.id === incident.id;
                return (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncident(incident)}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer text-left relative",
                      isSelected
                        ? "bg-gray-800/90 border-[#00f0ff]/60 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                        : "bg-gray-900/50 border-gray-800/80 hover:bg-gray-850 hover:border-gray-700"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase",
                          incident.severity === 'critical' ? "bg-red-500/20 text-red-400 border border-red-500/40" :
                          incident.severity === 'high' ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" :
                          incident.severity === 'medium' ? "bg-blue-500/20 text-blue-400 border border-blue-500/40" :
                          "bg-gray-600/20 text-gray-300 border border-gray-600/40"
                        )}>
                          {incident.severity}
                        </span>
                        <span className="text-xs font-mono text-gray-400 font-bold">{incident.id}</span>
                      </div>

                      <span className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded-full capitalize",
                        incident.status === 'active' ? "bg-red-500/10 text-red-400 animate-pulse" :
                        incident.status === 'investigating' ? "bg-amber-500/10 text-amber-400" :
                        incident.status === 'mitigated' ? "bg-blue-500/10 text-blue-400" :
                        "bg-[#00ff66]/10 text-[#00ff66]"
                      )}>
                        {incident.status}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-white leading-snug line-clamp-2 mb-2">
                      {incident.title}
                    </h3>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono pt-2 border-t border-gray-800/60">
                      <span>Blast: <strong className="text-white">{incident.blastRadius}%</strong></span>
                      <span>Noise: <strong className="text-[#00ff66]">{incident.noiseReductionRatio.split(' ')[0]}</strong></span>
                      <span className="text-gray-500">{incident.timestamp.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}

              {filteredIncidents.length === 0 && (
                <div className="p-8 text-center text-gray-500 text-xs font-mono">
                  No correlated incidents match the filter criteria.
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Incident Inspector */}
          <div className="lg:col-span-7 space-y-4">
            {selectedIncident ? (
              <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
                {/* Title & Metadata */}
                <div className="space-y-2 border-b border-gray-800 pb-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase",
                        selectedIncident.severity === 'critical' ? "bg-red-500/20 text-red-400 border border-red-500/40" :
                        selectedIncident.severity === 'high' ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" :
                        "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                      )}>
                        {selectedIncident.severity}
                      </span>
                      <span className="text-sm font-mono font-bold text-gray-300">{selectedIncident.id}</span>
                      <span className="text-xs font-mono text-gray-500">({selectedIncident.category})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 font-mono">{selectedIncident.timestamp}</span>
                    </div>
                  </div>

                  <h2 className="text-base font-bold text-white">
                    {selectedIncident.title}
                  </h2>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400 pt-1">
                    <div>Blast Radius: <span className="text-red-400 font-bold">{selectedIncident.blastRadius}%</span></div>
                    <div>Noise Reduction: <span className="text-[#00ff66] font-bold">{selectedIncident.noiseReductionRatio}</span></div>
                    <div>Raw Events: <span className="text-white font-bold">{selectedIncident.rawEventCount}</span></div>
                  </div>
                </div>

                {/* AI Root Cause & Explanation */}
                <div className="p-4 rounded-xl bg-[#00f0ff]/5 border border-[#00f0ff]/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#00f0ff] uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    AI Root Cause Analysis (RCA)
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {selectedIncident.rootCause}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed border-t border-[#00f0ff]/10 pt-2 italic">
                    {selectedIncident.aiExplanation}
                  </p>
                </div>

                {/* Correlated Wazuh Alert Signals */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                    <span className="flex items-center gap-1.5 text-blue-400">
                      <Shield className="w-4 h-4" />
                      Correlated Wazuh SIEM Alerts ({selectedIncident.wazuhAlerts.length})
                    </span>
                    <span className="text-[11px] font-mono text-gray-500">Agent HIDS Logs</span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {selectedIncident.wazuhAlerts.map(wz => (
                      <div key={wz.id} className="p-2.5 rounded-lg bg-gray-900/80 border border-gray-800 text-xs font-mono flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[#00f0ff] font-bold">Rule {wz.ruleId}</span>
                            <span className="text-gray-400 font-normal">{wz.description}</span>
                          </div>
                          <div className="text-[10px] text-gray-500">
                            Host: {wz.agent} • Time: {wz.timestamp} {wz.cve && `• Ref: ${wz.cve}`}
                          </div>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-bold">
                          Lvl {wz.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Correlated Jaeger Distributed Traces */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                    <span className="flex items-center gap-1.5 text-purple-400">
                      <Activity className="w-4 h-4" />
                      Correlated Jaeger Spans & Latency Spikes ({selectedIncident.jaegerTraces.length})
                    </span>
                    <span className="text-[11px] font-mono text-gray-500">Distributed APM Traces</span>
                  </div>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {selectedIncident.jaegerTraces.map(tr => (
                      <div key={tr.traceId + tr.spanName} className="p-2.5 rounded-lg bg-gray-900/80 border border-gray-800 text-xs font-mono flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-purple-400 font-bold">{tr.serviceName}</span>
                            <span className="text-gray-300">{tr.spanName}</span>
                          </div>
                          <div className="text-[10px] text-gray-500">
                            Trace: {tr.traceId} • Status: <span className="text-red-400">{tr.statusCode}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-amber-400">{tr.durationMs}ms</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Mitigation Action */}
                <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-[#00ff66]" />
                      <span className="text-xs font-bold text-white">
                        Recommended Mitigation: {selectedIncident.recommendedMitigation.actionTitle}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                      {selectedIncident.recommendedMitigation.scriptType} Script
                    </span>
                  </div>

                  <div className="bg-black/80 rounded-lg p-3 border border-gray-800 font-mono text-xs text-[#00ff66] overflow-x-auto whitespace-pre">
                    {selectedIncident.recommendedMitigation.codeSnippet}
                  </div>

                  {mitigationLog.length > 0 && (
                    <div className="bg-gray-950 p-2.5 rounded-lg border border-gray-800 font-mono text-[11px] text-gray-300 space-y-1">
                      {mitigationLog.map((log, idx) => (
                        <div key={idx} className={log.includes('SUCCESS') ? 'text-[#00ff66]' : ''}>{log}</div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[11px] text-gray-400">
                      {selectedIncident.status === 'mitigated' ? (
                        <span className="text-[#00ff66] flex items-center gap-1 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Mitigation Applied & Confirmed
                        </span>
                      ) : (
                        <span>Automated rollback verified if health gates fail</span>
                      )}
                    </div>

                    <button
                      disabled={executingMitigation || selectedIncident.status === 'mitigated'}
                      onClick={() => handleExecuteMitigation(selectedIncident)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer",
                        selectedIncident.status === 'mitigated'
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#00f0ff] to-[#00ff66] text-gray-950 hover:opacity-90 shadow-md"
                      )}
                    >
                      {executingMitigation ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Deploying Mitigation...
                        </>
                      ) : selectedIncident.status === 'mitigated' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Mitigated
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5" />
                          Execute AI Autonomous Mitigation
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500 font-mono">
                Select an incident from the left panel to inspect AI correlation details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Fusion Stream (Side by side comparison) */}
      {activeTab === 'correlator_matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wazuh Alert Feed */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Live Wazuh HIDS/SIEM Alert Feed</h3>
              </div>
              <span className="text-xs font-mono text-blue-400">Agent Syscheck / CVE</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {incidents.flatMap(inc => inc.wazuhAlerts).map(alert => (
                <div key={alert.id} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#00f0ff] font-bold">Rule {alert.ruleId}</span>
                    <span className="text-gray-500 text-[10px]">{alert.timestamp}</span>
                  </div>
                  <div className="text-gray-300 font-sans text-xs">{alert.description}</div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                    <span>Host: {alert.agent}</span>
                    <span className="px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 font-bold">Level {alert.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jaeger Trace Feed */}
          <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">Live Jaeger APM Trace Spans</h3>
              </div>
              <span className="text-xs font-mono text-purple-400">OTel Distributed Traces</span>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {incidents.flatMap(inc => inc.jaegerTraces).map((trace, i) => (
                <div key={trace.traceId + i} className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 text-xs font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-bold">{trace.serviceName}</span>
                    <span className="text-amber-400 font-bold">{trace.durationMs}ms</span>
                  </div>
                  <div className="text-gray-300 font-sans text-xs">{trace.spanName}</div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                    <span className="text-red-400">{trace.statusCode}</span>
                    <span className="text-gray-500">Trace: {trace.traceId.slice(0, 12)}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AI Noise Reduction Pipeline */}
      {activeTab === 'noise_engine' && (
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00ff66]" />
              Multi-Stage AI Deduplication & Clustering Architecture
            </h3>
            <p className="text-xs text-gray-400">
              How the FTN AI Correlator processes thousands of raw syslogs and trace anomalies per second into high-fidelity incident groups.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
              <div className="text-xs font-mono text-blue-400 font-bold">Stage 1 • Ingestion</div>
              <div className="text-lg font-bold font-mono text-white">8,420 / sec</div>
              <p className="text-[11px] text-gray-400">
                Wazuh Filebeat JSON stream + Jaeger OpenTelemetry gRPC span collector.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
              <div className="text-xs font-mono text-[#00f0ff] font-bold">Stage 2 • Windowing</div>
              <div className="text-lg font-bold font-mono text-white">1,240 clusters</div>
              <p className="text-[11px] text-gray-400">
                Temporal correlation within sliding 60-second sliding time windows across topology.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 space-y-2">
              <div className="text-xs font-mono text-purple-400 font-bold">Stage 3 • Graph Topology</div>
              <div className="text-lg font-bold font-mono text-white">42 graphs</div>
              <p className="text-[11px] text-gray-400">
                Dependency graph mapping service calls, BGP AS hops, and network interfaces.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#00ff66]/5 border border-[#00ff66]/30 space-y-2">
              <div className="text-xs font-mono text-[#00ff66] font-bold">Stage 4 • AI Root Cause</div>
              <div className="text-lg font-bold font-mono text-[#00ff66]">4 Actionable Incidents</div>
              <p className="text-[11px] text-gray-400">
                Autonomous root-cause synthesis with one-click automated eBPF/BGP mitigations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
