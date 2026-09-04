import React, { useState, useEffect } from 'react';
import { 
  Search, Database, Activity, ShieldAlert, Terminal, 
  RefreshCw, Filter, Clock, ChevronRight, ChevronDown, 
  Copy, Check, AlertTriangle, CheckCircle2, Play, Pause, 
  Layers, Server, Download, FileText, ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, Cell 
} from 'recharts';
import { cn } from '../utils';

export interface OpenSearchLog {
  id: string;
  timestamp: string;
  index: string;
  severity: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  node: string;
  service: string;
  message: string;
  rawJson: Record<string, any>;
}

const MOCK_LOGS: OpenSearchLog[] = [
  {
    id: 'os-log-109481',
    timestamp: '2026-09-03T10:24:18.102Z',
    index: 'ftn-router-syslog-2026.09.03',
    severity: 'CRITICAL',
    node: 'edge-sin-01.ftn.mesh',
    service: 'gobgp-adapter',
    message: 'BGP Peer AS64512 state transition: ESTABLISHED -> IDLE (HoldTimerExpired, prefix withdrawn: 103.14.22.0/24)',
    rawJson: {
      timestamp: '2026-09-03T10:24:18.102Z',
      peer_as: 64512,
      peer_ip: '198.51.100.1',
      event: 'HOLD_TIMER_EXPIRED',
      withdrawn_prefixes: ['103.14.22.0/24'],
      router_id: '10.0.0.1',
      severity: 'CRITICAL'
    }
  },
  {
    id: 'os-log-109480',
    timestamp: '2026-09-03T10:24:12.441Z',
    index: 'ftn-dns-queries-2026.09.03',
    severity: 'WARN',
    node: 'dns-anycast-tyo-02',
    service: 'unbound-resolver',
    message: 'Suspicious DNS high-entropy subdomains detected: 894a8f9c1e.tunnel.darknet.co (DNS Tunneling attempt blocked)',
    rawJson: {
      query: '894a8f9c1e.tunnel.darknet.co',
      qtype: 'TXT',
      client_ip: '203.0.113.88',
      response_code: 'REFUSED',
      entropy_score: 4.88,
      action: 'BLOCKED'
    }
  },
  {
    id: 'os-log-109479',
    timestamp: '2026-09-03T10:23:55.918Z',
    index: 'ftn-zerotrust-auth-2026.09.03',
    severity: 'INFO',
    node: 'auth-sgp-gateway',
    service: 'ztna-controller',
    message: 'WireGuard peer authentication successful for device posture: macOS 15.6 / Hardware TPM Verified / mTLS cert OK',
    rawJson: {
      peer_public_key: 'xK9f8...2M=',
      allocated_ip: '10.88.0.42',
      posture: { os: 'macOS 15.6', tpm: true, firewall: true },
      session_ttl_sec: 28800
    }
  },
  {
    id: 'os-log-109478',
    timestamp: '2026-09-03T10:23:40.120Z',
    index: 'ftn-packet-catcher-2026.09.03',
    severity: 'ERROR',
    node: 'edge-fra-03.ftn.mesh',
    service: 'ebpf-xdp-filter',
    message: 'SYN Flood anomaly: 184,000 pkts/s on interface eth1: port 443. XDP_DROP activated for CIDR 198.18.44.0/22',
    rawJson: {
      interface: 'eth1',
      pps: 184000,
      protocol: 'TCP SYN',
      action: 'XDP_DROP',
      filter_id: 'xdp-ddos-guard-v4',
      dropped_packets: 492019
    }
  },
  {
    id: 'os-log-109477',
    timestamp: '2026-09-03T10:22:15.602Z',
    index: 'ftn-kopia-backup-2026.09.03',
    severity: 'INFO',
    node: 'core-storage-node',
    service: 'kopia-agent',
    message: 'Snapshot k-snap-91024 committed: deduplicated 1.8 GB to 410 MB (ZSTD compression, AES-256-GCM encrypted)',
    rawJson: {
      snapshot_id: 'k-snap-91024',
      raw_size_bytes: 1932735283,
      stored_bytes: 429916160,
      dedup_ratio: 4.49,
      duration_ms: 1840
    }
  }
];

const INGESTION_TIMELINE_DATA = [
  { time: '10:00', total: 18400, errors: 42, warnings: 120 },
  { time: '10:05', total: 21200, errors: 38, warnings: 154 },
  { time: '10:10', total: 24800, errors: 51, warnings: 198 },
  { time: '10:15', total: 29400, errors: 84, warnings: 310 },
  { time: '10:20', total: 38900, errors: 210, warnings: 580 },
  { time: '10:25', total: 34200, errors: 120, warnings: 420 }
];

export function OpenSearchAnalytics() {
  const [activeTab, setActiveTab] = useState<'discover' | 'indices' | 'anomalies' | 'devtools'>('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [logs, setLogs] = useState<OpenSearchLog[]>(MOCK_LOGS);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const randomServices = ['dns-resolver', 'gobgp-adapter', 'wireguard-mesh', 'ebpf-filter'];
      const randomSvc = randomServices[Math.floor(Math.random() * randomServices.length)];
      
      const newLog: OpenSearchLog = {
        id: `os-log-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
        index: `ftn-telemetry-${new Date().toISOString().slice(0, 10).replace(/-/g, '.')}`,
        severity: Math.random() > 0.8 ? 'WARN' : 'INFO',
        node: ['edge-sin-01', 'core-tok-02', 'dns-us-east', 'edge-fra-03'][Math.floor(Math.random() * 4)],
        service: randomSvc,
        message: `Heartbeat & flow verification OK. Latency: ${(Math.random() * 12 + 2).toFixed(1)}ms, Flow active: ${Math.floor(Math.random() * 5000)} sessions.`,
        rawJson: {
          timestamp: new Date().toISOString(),
          service: randomSvc,
          flow_rate: Math.floor(Math.random() * 10000),
          status: 'HEALTHY'
        }
      };

      setLogs(prev => [newLog, ...prev.slice(0, 24)]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const filteredLogs = logs.filter(log => {
    const matchesQuery = searchQuery === '' || 
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.node.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = selectedSeverity === 'ALL' || log.severity === selectedSeverity;
    return matchesQuery && matchesSeverity;
  });

  const handleCopyJson = (log: OpenSearchLog) => {
    navigator.clipboard.writeText(JSON.stringify(log.rawJson, null, 2));
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* OpenSearch Header */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-gray-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-display text-white tracking-wide">
                  OpenSearch Observability & SIEM
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Cluster: GREEN (v2.18)
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Distributed Log Analytics, DNS Query Audits, eBPF Packet Telemetry & Real-Time Anomaly Detection
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold font-mono flex items-center gap-2 transition-all shadow-md",
                isLiveStreaming 
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" 
                  : "bg-gray-800 text-gray-400 border border-gray-700"
              )}
            >
              {isLiveStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isLiveStreaming ? 'Live Stream Active' : 'Live Stream Paused'}
            </button>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('add-toast', {
                  detail: {
                    type: 'success',
                    title: 'Indices Refreshed',
                    message: 'OpenSearch cluster indices synchronized.'
                  }
                }));
              }}
              className="px-3.5 py-2 rounded-xl text-sm font-medium bg-gray-800/80 hover:bg-gray-800 text-gray-200 border border-gray-700/60 flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
              Refresh
            </button>
          </div>
        </div>

        {/* Cluster Telemetry Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-gray-800/60">
          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Cluster Health</span>
            <span className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              GREEN (0 Unassigned)
            </span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Active Nodes</span>
            <span className="text-xl font-bold font-mono text-white">5 Nodes</span>
            <span className="text-[10px] text-gray-500 font-mono">3 Master / 2 Hot Data</span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Total Documents</span>
            <span className="text-xl font-bold font-mono text-cyan-400">14.82M docs</span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Primary Storage</span>
            <span className="text-xl font-bold font-mono text-purple-400">42.1 GB</span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">JVM Heap Usage</span>
            <span className="text-xl font-bold font-mono text-emerald-400">54% (8.6 GB)</span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Search Latency</span>
            <span className="text-xl font-bold font-mono text-cyan-400">2.1 ms</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('discover')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
            activeTab === 'discover' 
              ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          )}
        >
          <Search className="w-4 h-4" />
          Discover & SIEM Logs ({filteredLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('indices')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
            activeTab === 'indices' 
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          )}
        >
          <Database className="w-4 h-4" />
          Index Management & ISM
        </button>

        <button
          onClick={() => setActiveTab('anomalies')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
            activeTab === 'anomalies' 
              ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          )}
        >
          <ShieldAlert className="w-4 h-4" />
          Anomaly Detectors (ML)
        </button>

        <button
          onClick={() => setActiveTab('devtools')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
            activeTab === 'devtools' 
              ? "bg-purple-500/15 text-purple-400 border border-purple-500/30" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          )}
        >
          <Terminal className="w-4 h-4" />
          Dev Tools & REST Console
        </button>
      </div>

      {/* Tab 1: Discover & Logs */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          {/* Query Bar */}
          <div className="glass-panel p-4 rounded-xl border border-gray-800 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                <input
                  type="text"
                  placeholder="Lucene or PPL Query (e.g., severity:CRITICAL OR service:gobgp-adapter OR event:SYN_FLOOD)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 font-mono placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['ALL', 'CRITICAL', 'ERROR', 'WARN', 'INFO'].map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSelectedSeverity(sev)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-colors",
                      selectedSeverity === sev 
                        ? sev === 'CRITICAL' ? "bg-rose-500 text-white" :
                          sev === 'ERROR' ? "bg-red-500 text-white" :
                          sev === 'WARN' ? "bg-amber-500 text-gray-950" :
                          sev === 'INFO' ? "bg-cyan-500 text-gray-950" :
                          "bg-cyan-500 text-gray-950"
                        : "bg-gray-800/80 text-gray-400 hover:text-white"
                    )}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ingestion Timeline Chart */}
          <div className="glass-panel p-5 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Log Ingestion Volume (Events / 5 Min Window)
              </h3>
              <span className="text-xs font-mono text-gray-400">Peak: 38,900 docs/5m</span>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={INGESTION_TIMELINE_DATA}>
                  <defs>
                    <linearGradient id="totalColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="errColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    labelStyle={{ color: '#00f0ff', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="total" name="Total Ingested" stroke="#00f0ff" fillOpacity={1} fill="url(#totalColor)" />
                  <Area type="monotone" dataKey="errors" name="Critical / Errors" stroke="#f43f5e" fillOpacity={1} fill="url(#errColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Log Stream Table */}
          <div className="glass-panel rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/70 text-xs font-mono uppercase text-gray-400">
                    <th className="p-3 w-10"></th>
                    <th className="p-3 w-44">Timestamp</th>
                    <th className="p-3 w-24">Severity</th>
                    <th className="p-3 w-36">Node / Host</th>
                    <th className="p-3 w-36">Service</th>
                    <th className="p-3">Message Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono text-xs">
                  {filteredLogs.map(log => {
                    const isExpanded = expandedLogId === log.id;
                    return (
                      <React.Fragment key={log.id}>
                        <tr 
                          onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                          className={cn(
                            "cursor-pointer hover:bg-gray-800/40 transition-colors",
                            log.severity === 'CRITICAL' && "bg-rose-950/20",
                            log.severity === 'ERROR' && "bg-red-950/20",
                            log.severity === 'WARN' && "bg-amber-950/15"
                          )}
                        >
                          <td className="p-3 text-gray-400">
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4" />}
                          </td>
                          <td className="p-3 text-gray-400 truncate">{log.timestamp.split('T')[1]}</td>
                          <td className="p-3">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold border",
                              log.severity === 'CRITICAL' ? "bg-rose-900/50 text-rose-300 border-rose-500/40" :
                              log.severity === 'ERROR' ? "bg-red-900/50 text-red-300 border-red-500/40" :
                              log.severity === 'WARN' ? "bg-amber-900/50 text-amber-300 border-amber-500/40" :
                              "bg-cyan-900/30 text-cyan-300 border-cyan-500/30"
                            )}>
                              {log.severity}
                            </span>
                          </td>
                          <td className="p-3 text-gray-300 font-sans">{log.node}</td>
                          <td className="p-3 text-cyan-400">{log.service}</td>
                          <td className="p-3 text-gray-200 font-sans truncate max-w-xl">{log.message}</td>
                        </tr>

                        {isExpanded && (
                          <tr className="bg-gray-950/90 border-b border-gray-800">
                            <td colSpan={6} className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-mono text-cyan-400 font-bold">
                                  Document ID: {log.id} • Index: {log.index}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyJson(log);
                                  }}
                                  className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono flex items-center gap-1.5"
                                >
                                  {copiedId === log.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  {copiedId === log.id ? 'Copied' : 'Copy JSON'}
                                </button>
                              </div>
                              <pre className="p-3 bg-gray-900 rounded-lg text-[11px] text-gray-300 overflow-x-auto border border-gray-800">
                                {JSON.stringify(log.rawJson, null, 2)}
                              </pre>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Index Management & ISM */}
      {activeTab === 'indices' && (
        <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-400" />
            Index State Management (ISM) & Shard Topology
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'ftn-router-syslog-*', docs: '4.82M', primary: '14.2 GB', replicas: '1 (Active)', state: 'HOT' },
              { name: 'ftn-dns-queries-*', docs: '6.91M', primary: '18.4 GB', replicas: '1 (Active)', state: 'HOT' },
              { name: 'ftn-packet-catcher-*', docs: '2.14M', primary: '7.1 GB', replicas: '1 (Active)', state: 'WARM' },
              { name: 'ftn-zerotrust-auth-*', docs: '950K', primary: '2.4 GB', replicas: '1 (Active)', state: 'HOT' }
            ].map(idx => (
              <div key={idx.name} className="bg-gray-900/80 p-4 rounded-xl border border-gray-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-cyan-400 font-bold truncate">{idx.name}</span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-mono font-bold",
                    idx.state === 'HOT' ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  )}>
                    {idx.state}
                  </span>
                </div>
                <div className="space-y-1 text-xs font-mono text-gray-400 pt-1">
                  <div className="flex justify-between"><span>Docs:</span> <span className="text-white">{idx.docs}</span></div>
                  <div className="flex justify-between"><span>Size:</span> <span className="text-emerald-400">{idx.primary}</span></div>
                  <div className="flex justify-between"><span>Replication:</span> <span className="text-gray-300">{idx.replicas}</span></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 font-mono text-xs text-gray-300">
            <p className="text-emerald-400 font-bold mb-1"># Automated Rollover Policy (ISM)</p>
            <p className="text-gray-400">Rollover when index reaches 50GB OR 7 days age → Transition to WARM (UltraWarm) → Delete after 90 days retention.</p>
          </div>
        </div>
      )}

      {/* Tab 3: Anomalies */}
      {activeTab === 'anomalies' && (
        <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Random Cut Forest (RCF) Real-Time Anomaly Detectors
          </h3>

          <div className="space-y-3">
            {[
              { name: 'DNS Tunneling Entropy Detector', status: 'ACTIVE', anomalyGrade: '0.88 (HIGH)', metric: 'Entropy Score > 4.5 on Subdomains' },
              { name: 'SYN Flood / DDoS Rate Spike Detector', status: 'ACTIVE', anomalyGrade: '0.94 (CRITICAL)', metric: 'Interface PPS > 150,000' },
              { name: 'BGP Flap & Prefix Hijack Monitor', status: 'ACTIVE', anomalyGrade: '0.12 (NORMAL)', metric: 'AS Path Length & State Transitions' }
            ].map(detector => (
              <div key={detector.name} className="p-4 bg-gray-900/80 rounded-xl border border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-white font-sans text-sm">{detector.name}</h4>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{detector.metric}</p>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="text-gray-400">Anomaly Grade: <span className="text-rose-400 font-bold">{detector.anomalyGrade}</span></span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 text-[10px]">
                    {detector.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Dev Tools */}
      {activeTab === 'devtools' && (
        <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            OpenSearch Dev Tools Console
          </h3>

          <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 font-mono text-xs space-y-3">
            <div>
              <p className="text-cyan-400 font-bold">GET _cluster/health</p>
              <pre className="text-gray-300 mt-1 pl-4 border-l-2 border-gray-800">
{`{
  "cluster_name": "ftn-siem-cluster",
  "status": "green",
  "timed_out": false,
  "number_of_nodes": 5,
  "number_of_data_nodes": 2,
  "active_primary_shards": 24,
  "active_shards": 48,
  "relocating_shards": 0,
  "initializing_shards": 0,
  "unassigned_shards": 0
}`}
              </pre>
            </div>

            <div>
              <p className="text-purple-400 font-bold">POST ftn-router-syslog-*/_search</p>
              <pre className="text-gray-400 mt-1 pl-4 border-l-2 border-gray-800">
{`{
  "query": {
    "bool": {
      "must": [{ "match": { "severity": "CRITICAL" } }],
      "filter": [{ "range": { "@timestamp": { "gte": "now-1h" } } }]
    }
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
