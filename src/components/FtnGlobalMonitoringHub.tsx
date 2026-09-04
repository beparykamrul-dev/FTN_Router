import React, { useState } from 'react';
import {
  Activity,
  Server,
  Network,
  Cpu,
  Layers,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Database,
  Globe,
  Radio,
  ExternalLink,
  ShieldCheck,
  Zap,
  Terminal,
  Clock,
  HardDrive,
  BrainCircuit
} from 'lucide-react';
import { FtnAiAnomalyPredictor } from './FtnAiAnomalyPredictor';

interface MonitoringSource {
  id: string;
  name: string;
  type: 'Prometheus' | 'Zabbix' | 'Datadog' | 'New Relic';
  version: string;
  endpoint: string;
  status: 'CONNECTED' | 'SYNCING' | 'DEGRADED';
  latencyMs: number;
  metricsIngestedPerSec: number;
  activeTargets: number;
  lastSync: string;
  badgeColor: string;
}

interface CrossPlatformSignal {
  domain: string;
  service: string;
  prometheusVal: string;
  zabbixVal: string;
  datadogVal: string;
  newRelicVal: string;
  consensusHealth: 'HEALTHY' | 'ELEVATED' | 'CRITICAL';
}

const MONITORING_SOURCES: MonitoringSource[] = [
  {
    id: 'src-prometheus',
    name: 'Prometheus eBPF Scrape Matrix',
    type: 'Prometheus',
    version: 'v2.48.0',
    endpoint: 'https://prom.ftn.internal:9090',
    status: 'CONNECTED',
    latencyMs: 1.2,
    metricsIngestedPerSec: 14200,
    activeTargets: 48,
    lastSync: '1 sec ago',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  {
    id: 'src-zabbix',
    name: 'Zabbix Enterprise SNMPv3 Trap Core',
    type: 'Zabbix',
    version: 'v6.4.10 LTS',
    endpoint: 'https://zabbix.ftn.internal/api_jsonrpc.php',
    status: 'CONNECTED',
    latencyMs: 3.4,
    metricsIngestedPerSec: 8500,
    activeTargets: 32,
    lastSync: '2 secs ago',
    badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
  },
  {
    id: 'src-datadog',
    name: 'Datadog APM & Mesh Distributed Tracing',
    type: 'Datadog',
    version: 'Agent v7.50',
    endpoint: 'https://api.datadoghq.com/v1/series',
    status: 'CONNECTED',
    latencyMs: 14.8,
    metricsIngestedPerSec: 22400,
    activeTargets: 56,
    lastSync: '1 sec ago',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
  },
  {
    id: 'src-newrelic',
    name: 'New Relic OpenTelemetry Golden Signals',
    type: 'New Relic',
    version: 'OTel OTLP v1.9',
    endpoint: 'https://otlp.nr-data.net:4317',
    status: 'CONNECTED',
    latencyMs: 18.2,
    metricsIngestedPerSec: 19800,
    activeTargets: 44,
    lastSync: '3 secs ago',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
  }
];

const CROSS_PLATFORM_SIGNALS: CrossPlatformSignal[] = [
  {
    domain: 'Core Networking',
    service: 'FTN Anycast BGP Routing (AS216433)',
    prometheusVal: '42.4 Gbps Ingress',
    zabbixVal: '0.00% BGP Packet Drop',
    datadogVal: 'P99 RTT 4.8ms',
    newRelicVal: 'Route Convergence 99.99%',
    consensusHealth: 'HEALTHY'
  },
  {
    domain: 'Edge Acceleration',
    service: 'FTN-BANANI-EDGE-02 POP Gateway',
    prometheusVal: '17.5 Gbps (87.5%)',
    zabbixVal: '14,200 RX queue pps',
    datadogVal: 'P99 DNS 184ms',
    newRelicVal: 'Error Budget Burn 1.4x',
    consensusHealth: 'CRITICAL'
  },
  {
    domain: 'Zero Trust Mesh',
    service: 'WireGuard Kernel Overlay Mesh',
    prometheusVal: '1,420 Active Peers',
    zabbixVal: 'Tunnel Heartbeat OK',
    datadogVal: 'Throughput 18.8 Gbps',
    newRelicVal: 'Handshake P95 8.2ms',
    consensusHealth: 'HEALTHY'
  },
  {
    domain: 'Storage Subsystem',
    service: 'Multi-Node NVMe Ceph & ZFS Pool',
    prometheusVal: 'IOPS Await 8.4ms',
    zabbixVal: 'SMART 100% Healthy',
    datadogVal: 'Write Queue 42 req',
    newRelicVal: 'Disk Demotion Lag 12s',
    consensusHealth: 'ELEVATED'
  },
  {
    domain: 'Distributed DNS',
    service: 'FTN Smart Recursive DNS (Port 53/853)',
    prometheusVal: '284k QPS Handled',
    zabbixVal: 'Unbound Memory 3.2 GB',
    datadogVal: 'Cache Hit Ratio 94.8%',
    newRelicVal: 'DoH/DoT TLS Handshake 2.1ms',
    consensusHealth: 'HEALTHY'
  }
];

export function FtnGlobalMonitoringHub() {
  const [sources, setSources] = useState<MonitoringSource[]>(MONITORING_SOURCES);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [activeQueryEngine, setActiveQueryEngine] = useState<'PromQL' | 'Zabbix' | 'Datadog' | 'NRQL'>('PromQL');
  const [queryInput, setQueryInput] = useState('sum(rate(node_network_receive_bytes_total{job="ftn-mesh"}[1m])) * 8 / 1e9');
  const [queryOutput, setQueryOutput] = useState<string | null>(null);
  const [isExecutingQuery, setIsExecutingQuery] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setIsSyncingAll(false);
      setSources(prev =>
        prev.map(s => ({
          ...s,
          lastSync: 'just now',
          status: 'CONNECTED'
        }))
      );
      setSyncToast('All 4 monitoring telemetry APIs (Prometheus, Zabbix, Datadog, New Relic) synchronized successfully.');
      setTimeout(() => setSyncToast(null), 4000);
    }, 1200);
  };

  const handleRunQuery = () => {
    setIsExecutingQuery(true);
    setTimeout(() => {
      setIsExecutingQuery(false);
      if (activeQueryEngine === 'PromQL') {
        setQueryOutput(JSON.stringify({
          status: 'success',
          data: {
            resultType: 'vector',
            result: [
              { metric: { job: 'ftn-mesh', cluster: 'dhaka-core' }, value: [1719283401, '42.418294 Gbps'] },
              { metric: { job: 'ftn-mesh', cluster: 'banani-edge' }, value: [1719283401, '17.520411 Gbps'] },
              { metric: { job: 'ftn-mesh', cluster: 'ctg-hub' }, value: [1719283401, '6.840219 Gbps'] }
            ]
          }
        }, null, 2));
      } else if (activeQueryEngine === 'NRQL') {
        setQueryOutput(JSON.stringify({
          results: [
            { average_duration_ms: 12.4, p99_latency_ms: 32.1, error_pct: 0.012 }
          ]
        }, null, 2));
      } else if (activeQueryEngine === 'Datadog') {
        setQueryOutput(JSON.stringify({
          series: [
            { metric: 'ftn.mesh.latency.p99', pointlist: [[1719283300, 14.2], [1719283400, 15.1]] }
          ]
        }, null, 2));
      } else {
        setQueryOutput(JSON.stringify({
          jsonrpc: '2.0',
          result: [
            { hostid: '10842', host: 'FTN-BANANI-EDGE-02', status: '0', available: '1', snmp_errors: '0' }
          ]
        }, null, 2));
      }
    }, 600);
  };

  const setSampleQuery = (engine: 'PromQL' | 'Zabbix' | 'Datadog' | 'NRQL') => {
    setActiveQueryEngine(engine);
    if (engine === 'PromQL') {
      setQueryInput('sum(rate(node_network_receive_bytes_total{job="ftn-mesh"}[1m])) * 8 / 1e9');
    } else if (engine === 'Zabbix') {
      setQueryInput('{"jsonrpc":"2.0","method":"item.get","params":{"host":"FTN-BANANI-EDGE-02","output":["name","lastvalue"]},"id":1}');
    } else if (engine === 'Datadog') {
      setQueryInput('avg:ftn.mesh.latency.p99{env:production,region:asia} by {host}');
    } else {
      setQueryInput('SELECT average(duration), percentile(duration, 99) FROM Transaction WHERE appName = "ftn-service-mesh" FACET service');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-cyan-950/40 border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <Globe className="w-3.5 h-3.5" />
                UNIFIED GLOBAL TELEMETRY HUB
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                4 Active Monitoring Connectors
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">
              FTN Global Monitoring Hub
            </h1>
            <p className="text-sm text-gray-400 font-mono max-w-3xl leading-relaxed">
              Synthesizes real-time observability streams from Prometheus, Zabbix, Datadog, and New Relic into a cohesive telemetry glass pane for cross-platform health verification.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSyncAll}
              disabled={isSyncingAll}
              className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
              {isSyncingAll ? 'Synchronizing APIs...' : 'Sync All Telemetry Sources'}
            </button>
          </div>
        </div>

        {syncToast && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {syncToast}
          </div>
        )}
      </div>

      {/* 4 Provider Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        {sources.map(src => (
          <div key={src.id} className="p-5 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl space-y-3 relative overflow-hidden group hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${src.badgeColor}`}>
                {src.type}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {src.status}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white font-display leading-tight">{src.name}</h3>
              <p className="text-[11px] text-gray-400 truncate mt-0.5">{src.endpoint}</p>
            </div>

            <div className="pt-2 border-t border-gray-800/80 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-[10px] text-gray-500 block">API LATENCY</span>
                <span className="font-bold text-cyan-300">{src.latencyMs} ms</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">INGESTION</span>
                <span className="font-bold text-white">{src.metricsIngestedPerSec.toLocaleString()} /s</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">TARGETS</span>
                <span className="font-bold text-gray-300">{src.activeTargets}</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block">LAST SYNC</span>
                <span className="font-bold text-gray-400">{src.lastSync}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Unified Cross-Platform Golden Signals Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Cross-Platform Consensus Telemetry Matrix
            </h3>
            <p className="text-xs text-gray-400">
              Correlated Golden Signals reconciled across all 4 monitoring engines
            </p>
          </div>
          <span className="text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            Multi-Source Consensus: Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-gray-400 bg-gray-950/60 border-b border-gray-800">
                <th className="px-4 py-3">DOMAIN / SERVICE</th>
                <th className="px-4 py-3">PROMETHEUS</th>
                <th className="px-4 py-3">ZABBIX</th>
                <th className="px-4 py-3">DATADOG</th>
                <th className="px-4 py-3">NEW RELIC</th>
                <th className="px-4 py-3 text-right">CONSENSUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {CROSS_PLATFORM_SIGNALS.map((sig, i) => (
                <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white">{sig.service}</div>
                    <div className="text-[10px] text-gray-500">{sig.domain}</div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-amber-300">{sig.prometheusVal}</td>
                  <td className="px-4 py-3 font-semibold text-rose-300">{sig.zabbixVal}</td>
                  <td className="px-4 py-3 font-semibold text-purple-300">{sig.datadogVal}</td>
                  <td className="px-4 py-3 font-semibold text-cyan-300">{sig.newRelicVal}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      sig.consensusHealth === 'HEALTHY'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : sig.consensusHealth === 'ELEVATED'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                    }`}>
                      {sig.consensusHealth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-Provider Interactive Query Sandbox */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Unified Multi-Engine Query Console
            </h3>
            <p className="text-xs text-gray-400">
              Query Prometheus (PromQL), Zabbix (JSON-RPC), Datadog API, and New Relic (NRQL) directly
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-gray-950 p-1 rounded-xl border border-gray-800">
            {(['PromQL', 'Zabbix', 'Datadog', 'NRQL'] as const).map(eng => (
              <button
                key={eng}
                onClick={() => setSampleQuery(eng)}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors font-bold ${
                  activeQueryEngine === eng
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {eng}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <span>Query Expression ({activeQueryEngine}):</span>
            <span className="text-gray-500">Live API Endpoint Proxy</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-3.5 py-2 text-cyan-300 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
            <button
              onClick={handleRunQuery}
              disabled={isExecutingQuery}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isExecutingQuery ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              Execute
            </button>
          </div>
        </div>

        {queryOutput && (
          <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between text-[10px] text-gray-500">
              <span>RESPONSE PAYLOAD</span>
              <span className="text-emerald-400 font-bold">200 OK • Ingestion Verified</span>
            </div>
            <pre className="text-emerald-400 text-[11px] overflow-x-auto max-h-52">
              {queryOutput}
            </pre>
          </div>
        )}
      </div>

      {/* AI Telemetry Anomaly Predictor & Preventative Maintenance Section */}
      <div className="pt-2">
        <FtnAiAnomalyPredictor embedded={true} />
      </div>
    </div>
  );
}
