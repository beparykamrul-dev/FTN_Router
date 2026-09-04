import React, { useState, useEffect, useMemo } from 'react';
import { 
  Network, 
  Activity, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  RefreshCw, 
  Layers, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Globe, 
  Download, 
  SlidersHorizontal,
  Server,
  Zap,
  TrendingUp,
  Cpu,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { cn } from '../utils';

export interface NetFlowRecord {
  id: string;
  timestamp: string;
  exporter: string;
  srcIp: string;
  srcPort: number;
  srcHost?: string;
  dstIp: string;
  dstPort: number;
  dstHost?: string;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ESP' | 'GRE';
  application: string;
  packets: number;
  bytes: number;
  durationMs: number;
  tcpFlags: string;
  dscp: string;
  action: 'forwarded' | 'ebpf_dropped' | 'rate_limited';
}

const INITIAL_FLOWS: NetFlowRecord[] = [
  {
    id: 'fl-9021',
    timestamp: '10:22:15.102',
    exporter: 'core-router-sin-01',
    srcIp: '10.14.0.52',
    srcPort: 51820,
    srcHost: 'wg-mobile-kamrul',
    dstIp: '103.21.244.0',
    dstPort: 443,
    dstHost: 'edge-cloudflare.anycast',
    protocol: 'UDP',
    application: 'WireGuard Mesh',
    packets: 1420,
    bytes: 1845000,
    durationMs: 4500,
    tcpFlags: '-',
    dscp: 'CS6 (Network Control)',
    action: 'forwarded'
  },
  {
    id: 'fl-9022',
    timestamp: '10:22:15.098',
    exporter: 'vyos-edge-fra-02',
    srcIp: '185.220.101.44',
    srcPort: 41208,
    dstIp: '203.0.113.10',
    dstPort: 443,
    dstHost: 'api.familytimenet.com',
    protocol: 'TCP',
    application: 'HTTPS Ingress',
    packets: 840,
    bytes: 980200,
    durationMs: 1200,
    tcpFlags: 'SYN,ACK,PSH',
    dscp: 'EF (Expedited)',
    action: 'forwarded'
  },
  {
    id: 'fl-9023',
    timestamp: '10:22:15.084',
    exporter: 'cisco-asr9k-core',
    srcIp: '198.51.100.89',
    srcPort: 58820,
    dstIp: '203.0.113.88',
    dstPort: 443,
    protocol: 'TCP',
    application: 'SYN Flood Anomaly',
    packets: 8200,
    bytes: 492000,
    durationMs: 320,
    tcpFlags: 'SYN',
    dscp: 'DF (Default)',
    action: 'ebpf_dropped'
  },
  {
    id: 'fl-9024',
    timestamp: '10:22:15.050',
    exporter: 'core-router-sin-01',
    srcIp: '10.14.0.1',
    srcPort: 179,
    srcHost: 'gobgp-daemon',
    dstIp: '2001:470:1:1::1',
    dstPort: 179,
    dstHost: 'as6939-hurricane',
    protocol: 'TCP',
    application: 'BGP Routing Mesh',
    packets: 140,
    bytes: 84000,
    durationMs: 14200,
    tcpFlags: 'ACK',
    dscp: 'CS6 (Network Control)',
    action: 'forwarded'
  },
  {
    id: 'fl-9025',
    timestamp: '10:22:14.990',
    exporter: 'kube-ovn-fabric',
    srcIp: '10.244.2.14',
    srcPort: 6432,
    srcHost: 'pgbouncer-pool',
    dstIp: '10.244.4.88',
    dstPort: 5432,
    dstHost: 'postgres-db-01',
    protocol: 'TCP',
    application: 'PostgreSQL Offload',
    packets: 4800,
    bytes: 6200000,
    durationMs: 2400,
    tcpFlags: 'ACK,PSH',
    dscp: 'AF41 (High Priority)',
    action: 'forwarded'
  },
  {
    id: 'fl-9026',
    timestamp: '10:22:14.912',
    exporter: 'core-router-sin-01',
    srcIp: '10.14.0.8',
    srcPort: 53,
    srcHost: 'unbound-resolver',
    dstIp: '1.1.1.1',
    dstPort: 853,
    dstHost: 'cloudflare-dns-tls',
    protocol: 'TCP',
    application: 'DNS-over-TLS',
    packets: 210,
    bytes: 142000,
    durationMs: 800,
    tcpFlags: 'ACK',
    dscp: 'CS6 (Network Control)',
    action: 'forwarded'
  }
];

const TIME_SERIES_DATA = [
  { time: '10:17', wireguard: 4.8, https: 3.2, quic: 1.8, bgp: 0.4, dns: 0.3 },
  { time: '10:18', wireguard: 5.1, https: 3.4, quic: 2.1, bgp: 0.4, dns: 0.3 },
  { time: '10:19', wireguard: 5.6, https: 4.1, quic: 2.4, bgp: 0.5, dns: 0.4 },
  { time: '10:20', wireguard: 6.2, https: 4.8, quic: 2.9, bgp: 0.5, dns: 0.4 },
  { time: '10:21', wireguard: 5.9, https: 4.2, quic: 2.6, bgp: 0.4, dns: 0.3 },
  { time: '10:22', wireguard: 6.4, https: 4.6, quic: 2.8, bgp: 0.5, dns: 0.4 },
];

const PROTOCOL_DISTRIBUTION = [
  { name: 'WireGuard Mesh', value: 42, color: '#00ff66' },
  { name: 'HTTPS / TLS 1.3', value: 31, color: '#00f0ff' },
  { name: 'QUIC / Hysteria2', value: 18, color: '#8b5cf6' },
  { name: 'BGP / Peering', value: 5, color: '#f59e0b' },
  { name: 'DNS / DoT', value: 4, color: '#ec4899' },
];

const TOP_TALKERS = [
  { ip: '10.14.0.52', host: 'wg-mobile-kamrul', asn: 'AS64512 FTN', geo: 'SG', rxGb: '14.8', txGb: '8.4', flows: 4210, dscp: 'CS6' },
  { ip: '103.21.244.0/24', host: 'anycast-cloudflare', asn: 'AS13335', geo: 'GLOBAL', rxGb: '12.4', txGb: '18.2', flows: 8910, dscp: 'DF' },
  { ip: '10.244.2.14', host: 'pgbouncer-pool', asn: 'AS64512 Internal', geo: 'LOCAL', rxGb: '9.8', txGb: '9.2', flows: 14200, dscp: 'AF41' },
  { ip: '142.250.190.0/24', host: 'google-edge-transit', asn: 'AS15169', geo: 'US', rxGb: '8.2', txGb: '4.1', flows: 3120, dscp: 'DF' },
  { ip: '185.220.101.44', host: 'transit-he-as6939', asn: 'AS6939', geo: 'DE', rxGb: '6.4', txGb: '7.8', flows: 2980, dscp: 'EF' },
];

export function FtnNetFlowCollector() {
  const [flows, setFlows] = useState<NetFlowRecord[]>(INITIAL_FLOWS);
  const [isStreaming, setIsStreaming] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [exporterFilter, setExporterFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'flows' | 'top_talkers' | 'analytics'>('flows');

  // Simulated live flow generator
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const randomPort = [443, 51820, 8443, 53, 6432, 179][Math.floor(Math.random() * 6)];
      const randomProto = randomPort === 51820 || randomPort === 53 ? 'UDP' : 'TCP';
      const newRecord: NetFlowRecord = {
        id: `fl-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
        exporter: ['core-router-sin-01', 'vyos-edge-fra-02', 'cisco-asr9k-core', 'kube-ovn-fabric'][Math.floor(Math.random() * 4)],
        srcIp: `10.14.0.${Math.floor(Math.random() * 100) + 1}`,
        srcPort: Math.floor(1024 + Math.random() * 60000),
        dstIp: `203.0.113.${Math.floor(Math.random() * 250) + 1}`,
        dstPort: randomPort,
        protocol: randomProto,
        application: randomPort === 51820 ? 'WireGuard Mesh' : randomPort === 443 ? 'HTTPS Ingress' : randomPort === 179 ? 'BGP Peering' : 'PgBouncer Offload',
        packets: Math.floor(100 + Math.random() * 2000),
        bytes: Math.floor(50000 + Math.random() * 1500000),
        durationMs: Math.floor(200 + Math.random() * 3000),
        tcpFlags: randomProto === 'TCP' ? 'ACK,PSH' : '-',
        dscp: 'CS6 (Network Control)',
        action: Math.random() > 0.9 ? 'ebpf_dropped' : 'forwarded'
      };

      setFlows(prev => [newRecord, ...prev.slice(0, 24)]);
    }, 2200);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const filteredFlows = useMemo(() => {
    return flows.filter(flow => {
      const matchSearch = searchQuery === '' ||
        flow.srcIp.includes(searchQuery) ||
        flow.dstIp.includes(searchQuery) ||
        flow.application.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flow.exporter.toLowerCase().includes(searchQuery.toLowerCase());
      const matchAction = actionFilter === 'all' || flow.action === actionFilter;
      const matchExporter = exporterFilter === 'all' || flow.exporter === exporterFilter;
      return matchSearch && matchAction && matchExporter;
    });
  }, [flows, searchQuery, actionFilter, exporterFilter]);

  const stats = useMemo(() => {
    return {
      flowRate: '54,280 flows/s',
      aggregateBandwidth: '14.7 Gbps',
      activeExporters: 4,
      samplingRatio: '1:1000 NetFlow v9'
    };
  }, []);

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(flows, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `netflow_records_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'success',
        title: 'NetFlow Records Exported',
        message: 'Saved flow dataset in IPFIX standard JSON format.'
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gray-900/60 p-6 rounded-2xl border border-gray-800 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-blue-500/20 border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Network className="w-6 h-6 text-[#00f0ff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                FTN NetFlow & IPFIX Collector
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30">
                  RFC 7011 / NetFlow v9
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                Real-time multi-exporter flow ingestion, top talker identification & L4/L7 protocol profiling
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
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
                Live Ingestion Stream
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Stream Paused
              </>
            )}
          </button>

          <button
            onClick={handleExportJson}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Flow JSON
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Flow Ingestion Velocity</span>
            <Activity className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#00f0ff]">
            {stats.flowRate}
          </div>
          <span className="text-[11px] text-gray-400 font-mono">Sampling ratio {stats.samplingRatio}</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Mesh Aggregate Throughput</span>
            <TrendingUp className="w-4 h-4 text-[#00ff66]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#00ff66]">
            {stats.aggregateBandwidth}
          </div>
          <span className="text-[11px] text-gray-400 font-mono">Peak 9000-byte Jumbo frames</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Active Flow Exporters</span>
            <Server className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {stats.activeExporters} Exporters
          </div>
          <span className="text-[11px] text-gray-400 font-mono">MikroTik, VyOS, Cisco, OVN</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">eBPF Drop Mitigation</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            99.8% Clean
          </div>
          <span className="text-[11px] text-emerald-400/80 font-mono">Malformed &amp; SYN flood dropped</span>
        </div>
      </div>

      {/* Real-time Bandwidth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Throughput Area Chart */}
        <div className="lg:col-span-8 glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#00f0ff]" />
                Real-Time Bandwidth by Protocol (Gbps)
              </h3>
              <p className="text-xs text-gray-400">Aggregated egress &amp; ingress across carrier edge routers</p>
            </div>
            <span className="text-xs font-mono text-[#00ff66] font-bold">14.7 Gbps Total</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={TIME_SERIES_DATA}>
                <defs>
                  <linearGradient id="colorWg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff66" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00ff66" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHttps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} unit="G" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.75rem', fontSize: '11px' }} 
                />
                <Area type="monotone" dataKey="wireguard" name="WireGuard Mesh" stroke="#00ff66" fillOpacity={1} fill="url(#colorWg)" />
                <Area type="monotone" dataKey="https" name="HTTPS / TLS 1.3" stroke="#00f0ff" fillOpacity={1} fill="url(#colorHttps)" />
                <Area type="monotone" dataKey="quic" name="QUIC / Hysteria2" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protocol Usage Donut */}
        <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-gray-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              Protocol Usage Share
            </h3>
            <p className="text-xs text-gray-400">Byte breakdown across protocols</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PROTOCOL_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {PROTOCOL_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '0.5rem', fontSize: '11px' }} 
                  formatter={(val: any) => [`${val}%`, 'Usage']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-xs font-mono">
            {PROTOCOL_DISTRIBUTION.map(p => (
              <div key={p.name} className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                  {p.name}
                </span>
                <span className="font-bold">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <button
          onClick={() => setActiveTab('flows')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
            activeTab === 'flows'
              ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
          )}
        >
          <Activity className="w-3.5 h-3.5" />
          Live Flow Stream ({filteredFlows.length})
        </button>

        <button
          onClick={() => setActiveTab('top_talkers')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
            activeTab === 'top_talkers'
              ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
          )}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Top Talkers &amp; ASN Leaderboard
        </button>
      </div>

      {/* View 1: Live Flow Stream Table */}
      {activeTab === 'flows' && (
        <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter by IP, application, exporter..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-[#00f0ff] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:border-[#00f0ff] focus:outline-none"
              >
                <option value="all">All Actions</option>
                <option value="forwarded">Forwarded</option>
                <option value="ebpf_dropped">eBPF Dropped</option>
              </select>

              <select
                value={exporterFilter}
                onChange={(e) => setExporterFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:border-[#00f0ff] focus:outline-none"
              >
                <option value="all">All Exporters</option>
                <option value="core-router-sin-01">core-router-sin-01</option>
                <option value="vyos-edge-fra-02">vyos-edge-fra-02</option>
                <option value="cisco-asr9k-core">cisco-asr9k-core</option>
                <option value="kube-ovn-fabric">kube-ovn-fabric</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] text-gray-400 bg-gray-900/80 border-b border-gray-800 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Exporter</th>
                  <th className="py-2.5 px-3">Source &rarr; Destination</th>
                  <th className="py-2.5 px-3">Proto / App</th>
                  <th className="py-2.5 px-3">Packets / Bytes</th>
                  <th className="py-2.5 px-3">DSCP QoS</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredFlows.map((flow) => (
                  <tr key={flow.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-gray-400 whitespace-nowrap">{flow.timestamp}</td>
                    <td className="py-2.5 px-3 text-gray-300 whitespace-nowrap">{flow.exporter}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-bold">{flow.srcIp}:{flow.srcPort}</span>
                        <span className="text-gray-500">&rarr;</span>
                        <span className="text-[#00f0ff] font-bold">{flow.dstIp}:{flow.dstPort}</span>
                      </div>
                      {(flow.srcHost || flow.dstHost) && (
                        <div className="text-[10px] text-gray-500">
                          {flow.srcHost || 'src'} &rarr; {flow.dstHost || 'dst'}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-300 mr-1.5 text-[10px]">
                        {flow.protocol}
                      </span>
                      <span className="text-gray-200">{flow.application}</span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-white">{flow.packets.toLocaleString()} pkts</div>
                      <div className="text-[10px] text-gray-400 font-bold">
                        {(flow.bytes / 1024).toFixed(1)} KB
                      </div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-gray-400 text-[11px]">{flow.dscp}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                        flow.action === 'forwarded' 
                          ? "bg-emerald-500/10 text-[#00ff66] border border-emerald-500/30"
                          : "bg-red-500/10 text-red-400 border border-red-500/30"
                      )}>
                        {flow.action === 'forwarded' ? 'Forwarded' : 'eBPF Drop'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Top Talkers Leaderboard */}
      {activeTab === 'top_talkers' && (
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00ff66]" />
                Top Mesh Talkers &amp; Heavy Hitters
              </h3>
              <p className="text-xs text-gray-400">Categorized by ingress/egress bytes, ASN, and QoS traffic class</p>
            </div>
            <span className="text-xs font-mono text-gray-400">Past 1 Hour Window</span>
          </div>

          <div className="space-y-3">
            {TOP_TALKERS.map((talker, idx) => (
              <div key={talker.ip} className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center font-bold text-gray-300">
                    #{idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold">{talker.ip}</span>
                      <span className="text-gray-400">({talker.host})</span>
                      <span className="px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 text-[10px]">{talker.geo}</span>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      ASN: {talker.asn} • QoS Marking: <span className="text-amber-400">{talker.dscp}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-right">
                  <div>
                    <div className="text-gray-400 text-[10px]">TOTAL TRANSFERRED</div>
                    <div className="text-[#00ff66] font-bold">{parseFloat(talker.rxGb) + parseFloat(talker.txGb)} GB</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-[10px]">FLOW SESSIONS</div>
                    <div className="text-white font-bold">{talker.flows.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
