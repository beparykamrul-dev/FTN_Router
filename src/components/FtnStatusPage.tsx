import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Server, 
  Globe, 
  RefreshCw, 
  ChevronRight, 
  ArrowUpRight,
  Wifi,
  Database,
  Lock,
  Radio,
  FileText
} from 'lucide-react';

interface SubsystemStatus {
  id: string;
  name: string;
  category: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  uptime90d: string;
  latencyMs: number;
  history: Array<'up' | 'degraded' | 'down'>;
  description: string;
}

interface IncidentRecord {
  id: string;
  title: string;
  date: string;
  severity: 'resolved' | 'monitoring' | 'investigating';
  affected: string[];
  duration: string;
  summary: string;
  updates: Array<{ time: string; text: string }>;
}

const SUBSYSTEMS: SubsystemStatus[] = [
  {
    id: 'sub-bgp',
    name: 'BGP Carrier Transit & Anycast Routing (AS64512)',
    category: 'Core Routing',
    status: 'OPERATIONAL',
    uptime90d: '99.999%',
    latencyMs: 1.1,
    history: Array(30).fill('up'),
    description: 'Full-mesh BGP peering with Tier-1 upstreams, EVPN overlay fabric, and BDIX interchange.'
  },
  {
    id: 'sub-vpn',
    name: 'Multi-Protocol Dynamic Tunnels (WireGuard / Hysteria2)',
    category: 'Secure Mesh',
    status: 'OPERATIONAL',
    uptime90d: '99.992%',
    latencyMs: 3.4,
    history: [...Array(28).fill('up'), 'up', 'up'],
    description: 'Kernel WireGuard & UDP-accelerated proxy tunnels linking all households and mobile endpoints.'
  },
  {
    id: 'sub-dns',
    name: 'Family Time Network SafeGuard & Smart DNS Anycast',
    category: 'DNS & Security',
    status: 'OPERATIONAL',
    uptime90d: '100.00%',
    latencyMs: 2.1,
    history: Array(30).fill('up'),
    description: 'Global 12-PoP Anycast DoH/DoQ resolvers with zero-latency threat protection and safe-search.'
  },
  {
    id: 'sub-ebpf',
    name: 'eBPF XDP Firewall & Anti-DDoS Scrubbing',
    category: 'Security Fabric',
    status: 'OPERATIONAL',
    uptime90d: '100.00%',
    latencyMs: 0.2,
    history: Array(30).fill('up'),
    description: 'Line-rate in-kernel packet filtering, syn-flood dropping, and autonomous ACL enforcement.'
  },
  {
    id: 'sub-siem',
    name: 'OpenSearch Observability & Threat SIEM Grid',
    category: 'Observability',
    status: 'OPERATIONAL',
    uptime90d: '99.985%',
    latencyMs: 6.8,
    history: [...Array(14).fill('up'), 'degraded', ...Array(15).fill('up')],
    description: 'Real-time telemetry ingestion, NetFlow/IPFIX collection, and autonomous security alerting.'
  },
  {
    id: 'sub-gpon',
    name: 'Huawei/ZTE GPON OLT Access Network',
    category: 'Fiber Access',
    status: 'DEGRADED',
    uptime90d: '99.940%',
    latencyMs: 18.2,
    history: [...Array(27).fill('up'), 'degraded', 'up', 'degraded'],
    description: 'Optical distribution network covering Dhanmondi & Banani zones. PON 0/1/3 optical margin alert isolated.'
  },
  {
    id: 'sub-ainoc',
    name: 'Autonomous AI Predictive NOC & Job Journal',
    category: 'AI Autonomy',
    status: 'OPERATIONAL',
    uptime90d: '99.970%',
    latencyMs: 14.5,
    history: Array(30).fill('up'),
    description: 'Gemini reasoning loops monitoring BGP flaps, optical anomalies, and executing zero-downtime jobs.'
  },
  {
    id: 'sub-billing',
    name: 'Subscriber AAA RADIUS & Cloudflare Edge CDN',
    category: 'Customer Gateway',
    status: 'OPERATIONAL',
    uptime90d: '99.995%',
    latencyMs: 4.1,
    history: Array(30).fill('up'),
    description: 'PPPoE/IPoE subscriber session orchestration, bandwidth rate-limiting, and web portal.'
  }
];

const PAST_INCIDENTS: IncidentRecord[] = [
  {
    id: 'inc-01',
    title: 'Rogue ONT Laser Flap Isolated on GPON Port 0/1/3',
    date: 'September 4, 2026 - 06:45 UTC',
    severity: 'monitoring',
    affected: ['Huawei/ZTE GPON OLT Access Network'],
    duration: '14 minutes',
    summary: 'Autonomous OLT watchdog detected an abnormal optical transmission spike from an uncalibrated third-party ONT. The port was isolated via eBPF policy to protect the splitters.',
    updates: [
      { time: '06:59 UTC', text: 'Telemetry verified nominal optical budget (-19.2 dBm). Monitoring optical stability.' },
      { time: '06:50 UTC', text: 'Automated Job Journal executed laser dampening script; rogue ONT power dialed down.' },
      { time: '06:45 UTC', text: 'AI Predictive NOC detected +3.4 dBm deviation on PON splitter 0/1/3.' }
    ]
  },
  {
    id: 'inc-02',
    title: 'Upstream BGP Route Leak from AS9498 Filtered',
    date: 'September 2, 2026 - 18:20 UTC',
    severity: 'resolved',
    affected: ['BGP Carrier Transit & Anycast Routing (AS64512)'],
    duration: '3 minutes',
    summary: 'An external transit provider leaked unvalidated prefixes. FTN RPKI ROA validation engine autonomously discarded 14 invalid routes with zero customer packet drop.',
    updates: [
      { time: '18:23 UTC', text: 'Incident resolved. ROA cache verified with APNIC trust anchor.' },
      { time: '18:20 UTC', text: 'GoBGP autonomous filter engaged and dropped invalid prefixes.' }
    ]
  }
];

export function FtnStatusPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'resolved' | 'monitoring'>('all');
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const filteredIncidents = PAST_INCIDENTS.filter(inc => {
    if (activeFilter === 'all') return true;
    return inc.severity === activeFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-gray-900 to-gray-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <h1 className="text-2xl font-bold font-display text-white tracking-tight">
                  All Core Systems Fully Operational
                </h1>
              </div>
              <p className="text-sm text-gray-400 mt-1 max-w-2xl">
                The FTN Carrier & Family Network Grid is operating within nominal thresholds. Minor optical monitoring active on Dhanmondi Zone-A.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end font-mono">
            <span className="text-xs text-gray-400">90-DAY AGGREGATE UPTIME</span>
            <span className="text-3xl font-black text-emerald-400">99.994%</span>
            <span className="text-[10px] text-gray-500 mt-0.5">Updated real-time • Edge AS64512</span>
          </div>
        </div>

        {/* Global Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800/80 font-mono text-sm">
          <div className="bg-gray-950/70 p-3.5 rounded-xl border border-gray-800/60">
            <span className="text-xs text-gray-500 block">GLOBAL DNS LATENCY</span>
            <span className="text-lg font-bold text-cyan-400 mt-0.5 block flex items-baseline gap-1">
              8.2 <span className="text-xs text-gray-400 font-normal">ms (p50)</span>
            </span>
          </div>

          <div className="bg-gray-950/70 p-3.5 rounded-xl border border-gray-800/60">
            <span className="text-xs text-gray-500 block">PACKET LOSS SLA</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">
              &lt; 0.001%
            </span>
          </div>

          <div className="bg-gray-950/70 p-3.5 rounded-xl border border-gray-800/60">
            <span className="text-xs text-gray-500 block">BGP PEER SESSIONS</span>
            <span className="text-lg font-bold text-white mt-0.5 block">
              24 / 24 <span className="text-xs text-emerald-400 font-normal">ESTABLISHED</span>
            </span>
          </div>

          <div className="bg-gray-950/70 p-3.5 rounded-xl border border-gray-800/60">
            <span className="text-xs text-gray-500 block">AUTONOMOUS MTTR</span>
            <span className="text-lg font-bold text-cyan-400 mt-0.5 block">
              8.4 <span className="text-xs text-gray-400 font-normal">seconds</span>
            </span>
          </div>
        </div>
      </div>

      {/* Subsystem Health & 90-Day Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white font-display">Subsystem Operational Status</h2>
            <p className="text-xs text-gray-400 font-mono">Real-time health telemetry with 30-day continuous history</p>
          </div>
          <span className="text-xs font-mono text-gray-500 hidden sm:inline-block">
            30 Days Ago &larr; &rarr; Today
          </span>
        </div>

        <div className="bg-gray-900 border border-gray-800/80 rounded-2xl divide-y divide-gray-800/60 overflow-hidden shadow-xl">
          {SUBSYSTEMS.map(system => (
            <div key={system.id} className="p-5 hover:bg-gray-800/30 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-white text-sm">{system.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold ${
                      system.status === 'OPERATIONAL'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {system.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">{system.description}</p>
                </div>

                {/* 30-Day Timeline Bars */}
                <div className="flex flex-col items-start lg:items-end gap-1.5 font-mono text-xs">
                  <div className="flex items-center gap-1">
                    {system.history.map((dayStatus, idx) => (
                      <div
                        key={idx}
                        title={`Day -${30 - idx}: ${dayStatus.toUpperCase()}`}
                        className={`w-2 sm:w-2.5 h-7 rounded-sm transition-all hover:scale-125 cursor-pointer ${
                          dayStatus === 'up'
                            ? 'bg-emerald-500/80 hover:bg-emerald-400'
                            : dayStatus === 'degraded'
                            ? 'bg-amber-400 hover:bg-amber-300'
                            : 'bg-rose-500 hover:bg-rose-400'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between w-full text-[10px] text-gray-500">
                    <span>Latency: {system.latencyMs}ms</span>
                    <span className="font-bold text-gray-300">{system.uptime90d} uptime</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Status Section */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white font-display">System Incident History & Post-Mortems</h2>
            <p className="text-xs text-gray-400 font-mono">Autonomous remediation reports triggered by FTN AI NOC</p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-gray-900 border border-gray-800 rounded-xl text-xs font-mono">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'all' ? 'bg-cyan-500 text-black font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              All Incidents
            </button>
            <button
              onClick={() => setActiveFilter('monitoring')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'monitoring' ? 'bg-amber-500 text-black font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Active / Monitoring
            </button>
            <button
              onClick={() => setActiveFilter('resolved')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeFilter === 'resolved' ? 'bg-emerald-500 text-black font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredIncidents.map(incident => (
            <div 
              key={incident.id} 
              className="bg-gray-900 border border-gray-800/80 rounded-2xl p-6 shadow-xl space-y-4 hover:border-gray-700 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl border ${
                    incident.severity === 'resolved'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {incident.severity === 'resolved' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{incident.title}</h3>
                    <p className="text-xs text-gray-400 font-mono">{incident.date} • Duration: {incident.duration}</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-semibold self-start sm:self-auto ${
                  incident.severity === 'resolved'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                }`}>
                  {incident.severity.toUpperCase()}
                </span>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {incident.summary}
              </p>

              <div className="flex flex-wrap gap-2 text-xs font-mono">
                <span className="text-gray-500">Affected Services:</span>
                {incident.affected.map((aff, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-gray-950 border border-gray-800 text-cyan-300">
                    {aff}
                  </span>
                ))}
              </div>

              {/* Update Log */}
              <div className="bg-gray-950/70 p-3.5 rounded-xl border border-gray-800/60 space-y-2 font-mono text-xs">
                <span className="text-gray-500 block font-semibold text-[11px]">TELEMETRY & REMEDIATION LOGS</span>
                {incident.updates.map((update, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-cyan-400 whitespace-nowrap">{update.time}</span>
                    <span className="text-gray-300">{update.text}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
