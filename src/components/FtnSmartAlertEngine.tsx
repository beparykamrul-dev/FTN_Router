import React, { useState, useMemo } from 'react';
import {
  Bell,
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Flame,
  BrainCircuit,
  Filter,
  Layers,
  ArrowRight,
  Sparkles,
  Zap,
  Activity,
  Server,
  Network,
  Clock,
  ShieldAlert,
  Search,
  ChevronRight,
  RefreshCw,
  Sliders,
  Check,
  X
} from 'lucide-react';

export interface TelemetryAlert {
  id: string;
  source: 'eBPF-probe' | 'Prometheus' | 'Zabbix' | 'Datadog' | 'New Relic' | 'Syslog';
  nodeId: string;
  nodeName: string;
  metric: string;
  value: string;
  threshold: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'warning' | 'info';
  category: 'network' | 'memory' | 'thermal' | 'disk' | 'bgp' | 'dns';
  clusterId?: string;
}

export interface ClusteredIncident {
  id: string;
  clusterTitle: string;
  rootCause: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  confidencePct: number;
  status: 'ACTIVE' | 'INVESTIGATING' | 'RESOLVED' | 'AUTO_MITIGATING';
  firstSeen: string;
  lastUpdated: string;
  rawAlertCount: number;
  noiseSuppressedPct: number;
  primaryNode: string;
  blastRadius: string[];
  impactedServices: string[];
  suggestedAction: string;
  actionCommand: string;
  telemetryAlerts: TelemetryAlert[];
}

const INITIAL_CLUSTERS: ClusteredIncident[] = [
  {
    id: 'INC-7041',
    clusterTitle: 'Banani Edge Transit Egress Saturation & Memory Cascading Pressure',
    rootCause: 'Sudden UDP traffic spike from peer AS13335 (Cloudflare transit) saturated NIC rx ring buffers on FTN-BANANI-EDGE-02, triggering memory cache ballooning and packet drops.',
    severity: 'CRITICAL',
    confidencePct: 96.8,
    status: 'ACTIVE',
    firstSeen: '4 mins ago',
    lastUpdated: '12 secs ago',
    rawAlertCount: 28,
    noiseSuppressedPct: 94.2,
    primaryNode: 'FTN-BANANI-EDGE-02',
    blastRadius: ['Dhaka Transit Ring', 'WireGuard Sub-cluster 02', 'Smart DNS Banani POP'],
    impactedServices: ['ftn-wireguard-mesh', 'ftn-smart-dns', 'edge-cdn-proxy'],
    suggestedAction: 'Execute Anycast BGP route prepend to divert 40% ingress traffic to Chittagong Hub and rebalance memory via CRIU container relocation.',
    actionCommand: 'ftn-mesh ctl rebalance --source FTN-BANANI-EDGE-02 --target FTN-CTG-HUB-03 --drain-udp',
    telemetryAlerts: [
      { id: 'al-101', source: 'eBPF-probe', nodeId: 'node-02', nodeName: 'FTN-BANANI-EDGE-02', metric: 'net_egress_gbps', value: '17.5 Gbps', threshold: '>16.0 Gbps', timestamp: '4 mins ago', severity: 'critical', category: 'network' },
      { id: 'al-102', source: 'Prometheus', nodeId: 'node-02', nodeName: 'FTN-BANANI-EDGE-02', metric: 'mem_used_pct', value: '89.1%', threshold: '>85.0%', timestamp: '3 mins ago', severity: 'critical', category: 'memory' },
      { id: 'al-103', source: 'Zabbix', nodeId: 'node-02', nodeName: 'FTN-BANANI-EDGE-02', metric: 'nic_rx_dropped_pps', value: '14,200 pps', threshold: '>1,000 pps', timestamp: '3 mins ago', severity: 'high', category: 'network' },
      { id: 'al-104', source: 'Datadog', nodeId: 'node-02', nodeName: 'FTN-BANANI-EDGE-02', metric: 'dns_p99_latency_ms', value: '184 ms', threshold: '>45 ms', timestamp: '2 mins ago', severity: 'high', category: 'dns' },
      { id: 'al-105', source: 'New Relic', nodeId: 'node-02', nodeName: 'FTN-BANANI-EDGE-02', metric: 'xdp_packet_queue_depth', value: '4,096 pkts', threshold: '>2,048 pkts', timestamp: '1 min ago', severity: 'critical', category: 'network' },
      { id: 'al-106', source: 'Syslog', nodeId: 'node-02', nodeName: 'FTN-BANANI-EDGE-02', metric: 'thermal_zone0_c', value: '62.4°C', threshold: '>60.0°C', timestamp: '45 secs ago', severity: 'warning', category: 'thermal' }
    ]
  },
  {
    id: 'INC-7042',
    clusterTitle: 'Dhaka Core NVMe Tier Demotion Lag & High IOPS Latency',
    rootCause: 'Async checkpointing backlog in OpenSearch SIEM indexers causing high NVMe write queue depth on FTN-DHAKA-CORE-01.',
    severity: 'HIGH',
    confidencePct: 91.4,
    status: 'ACTIVE',
    firstSeen: '16 mins ago',
    lastUpdated: '1 min ago',
    rawAlertCount: 14,
    noiseSuppressedPct: 88.5,
    primaryNode: 'FTN-DHAKA-CORE-01',
    blastRadius: ['Core Ceph Cluster', 'SIEM Storage Array'],
    impactedServices: ['ftn-opensearch-siem', 'kopia-backup-vault'],
    suggestedAction: 'Demote cold indices to HDD ZFS pool on Frankfurt Vault and trigger NVMe write barrier flush.',
    actionCommand: 'ftn-storage tier evict --source nvme0n1 --target zfs-cold-pool --threshold 75',
    telemetryAlerts: [
      { id: 'al-201', source: 'Prometheus', nodeId: 'node-01', nodeName: 'FTN-DHAKA-CORE-01', metric: 'nvme_iops_await_ms', value: '18.4 ms', threshold: '>5.0 ms', timestamp: '16 mins ago', severity: 'high', category: 'disk' },
      { id: 'al-202', source: 'Zabbix', nodeId: 'node-01', nodeName: 'FTN-DHAKA-CORE-01', metric: 'disk_queue_depth', value: '64 req', threshold: '>32 req', timestamp: '12 mins ago', severity: 'warning', category: 'disk' },
      { id: 'al-203', source: 'Datadog', nodeId: 'node-01', nodeName: 'FTN-DHAKA-CORE-01', metric: 'siem_indexing_lag_secs', value: '42 secs', threshold: '>15 secs', timestamp: '5 mins ago', severity: 'high', category: 'disk' }
    ]
  },
  {
    id: 'INC-7043',
    clusterTitle: 'Frankfurt Transit POP Inter-DC Latency Variance Wave',
    rootCause: 'Submarine cable terrestrial handoff flap in Marseille POP impacting transatlantic transit route BGP convergence.',
    severity: 'MEDIUM',
    confidencePct: 88.9,
    status: 'INVESTIGATING',
    firstSeen: '42 mins ago',
    lastUpdated: '8 mins ago',
    rawAlertCount: 19,
    noiseSuppressedPct: 91.2,
    primaryNode: 'FTN-FRA-BACKUP-05',
    blastRadius: ['EU-Asia Sync Gateway'],
    impactedServices: ['kopia-remote-replication', 'global-evm-node-sync'],
    suggestedAction: 'Switch backup replication path to secondary SingTel terrestrial transit line.',
    actionCommand: 'ftn-bgp route prefer --peer singtel-sg-transit --as 13335',
    telemetryAlerts: [
      { id: 'al-301', source: 'eBPF-probe', nodeId: 'node-05', nodeName: 'FTN-FRA-BACKUP-05', metric: 'inter_dc_rtt_ms', value: '148.5 ms', threshold: '>120 ms', timestamp: '42 mins ago', severity: 'warning', category: 'network' },
      { id: 'al-302', source: 'New Relic', nodeId: 'node-05', nodeName: 'FTN-FRA-BACKUP-05', metric: 'bgp_route_flaps_5m', value: '6 flaps', threshold: '>2 flaps', timestamp: '22 mins ago', severity: 'high', category: 'bgp' }
    ]
  }
];

export function FtnSmartAlertEngine() {
  const [incidents, setIncidents] = useState<ClusteredIncident[]>(INITIAL_CLUSTERS);
  const [selectedIncident, setSelectedIncident] = useState<ClusteredIncident | null>(INITIAL_CLUSTERS[0]);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [isAiCorrelating, setIsAiCorrelating] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Computed summary metrics
  const totalRawAlerts = useMemo(() => {
    return incidents.reduce((sum, inc) => sum + inc.rawAlertCount, 0);
  }, [incidents]);

  const activeIncidentsCount = useMemo(() => {
    return incidents.filter(i => i.status !== 'RESOLVED').length;
  }, [incidents]);

  const averageNoiseReductionPct = useMemo(() => {
    if (incidents.length === 0) return 0;
    const sum = incidents.reduce((acc, curr) => acc + curr.noiseSuppressedPct, 0);
    return Math.round(sum / incidents.length);
  }, [incidents]);

  // Execute AI re-clustering simulation
  const handleTriggerAiCorrelation = () => {
    setIsAiCorrelating(true);
    setTimeout(() => {
      setIsAiCorrelating(false);
      setActionSuccessMsg('AI Telemetry Engine re-correlated 142 live signals. 3 micro-alarms consolidated.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }, 1200);
  };

  // One-click mitigate incident
  const handleMitigateIncident = (id: string) => {
    setIncidents(prev =>
      prev.map(inc => {
        if (inc.id === id) {
          return {
            ...inc,
            status: 'AUTO_MITIGATING'
          };
        }
        return inc;
      })
    );

    setTimeout(() => {
      setIncidents(prev =>
        prev.map(inc => {
          if (inc.id === id) {
            return {
              ...inc,
              status: 'RESOLVED'
            };
          }
          return inc;
        })
      );
      setActionSuccessMsg(`Incident ${id} successfully mitigated via automated mesh control actions.`);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }, 2000);
  };

  const filteredIncidents = incidents.filter(inc => {
    if (severityFilter === 'ALL') return true;
    return inc.severity === severityFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-purple-950/40 border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(168,85,247,0.2)]">
                <BrainCircuit className="w-3.5 h-3.5" />
                AI TELEMETRY CORRELATION ENGINE
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                eBPF + Multi-Source Ingestion
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">
              FTN Smart Alert Engine & Anomaly Classifier
            </h1>
            <p className="text-sm text-gray-400 font-mono max-w-3xl leading-relaxed">
              Consolidates thousands of raw alerts from Prometheus, Zabbix, Datadog, New Relic, and eBPF kernel probes.
              Uses semantic graph clustering to eliminate alert fatigue and pinpoint true system-wide root causes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerAiCorrelation}
              disabled={isAiCorrelating}
              className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isAiCorrelating ? 'animate-spin' : ''}`} />
              {isAiCorrelating ? 'Correlating Telemetry...' : 'Run AI Correlation Scan'}
            </button>
          </div>
        </div>

        {/* Action success toast */}
        {actionSuccessMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {actionSuccessMsg}
          </div>
        )}
      </div>

      {/* KPI Alert Fatigue Reduction Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>RAW TELEMETRY ALERTS</span>
            <Bell className="w-4 h-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold text-white font-display">{totalRawAlerts}</div>
          <div className="text-[11px] text-gray-500 mt-1">Incoming from 5 sources (15m window)</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-purple-500/30 shadow-lg bg-gradient-to-br from-purple-950/20 to-gray-900">
          <div className="flex items-center justify-between text-purple-300 text-xs mb-1">
            <span>NOISE REDUCTION RATIO</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-300 font-display">{averageNoiseReductionPct}%</div>
          <div className="text-[11px] text-purple-400/80 mt-1">Alert fatigue eliminated by AI clustering</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>ACTIONABLE ROOT INCIDENTS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-display">{activeIncidentsCount}</div>
          <div className="text-[11px] text-gray-500 mt-1">Clustered from {totalRawAlerts} raw alarms</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>AI CORRELATION CONFIDENCE</span>
            <BrainCircuit className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-display">94.8%</div>
          <div className="text-[11px] text-cyan-400/70 mt-1">Weighted semantic & topology heuristics</div>
        </div>
      </div>

      {/* Main Layout: Incident Clusters list on left, Deep Investigation on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Clustered Incidents List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-800">
              <div>
                <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Correlated Incident Clusters ({filteredIncidents.length})
                </h3>
                <p className="text-xs text-gray-400 font-mono">
                  Grouped infrastructure anomalies with causality attribution
                </p>
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-1.5 bg-gray-950 p-1 rounded-xl border border-gray-800 font-mono text-xs">
                {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(sev => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-2.5 py-1 rounded-lg cursor-pointer transition-colors ${
                      severityFilter === sev
                        ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {/* Incident Cards */}
            <div className="space-y-3 font-mono">
              {filteredIncidents.map(inc => {
                const isSelected = selectedIncident?.id === inc.id;

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncident(inc)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gray-800/80 border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'bg-gray-950/60 border-gray-800/80 hover:bg-gray-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inc.severity === 'CRITICAL'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : inc.severity === 'HIGH'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          }`}>
                            {inc.severity}
                          </span>
                          <span className="text-xs text-white font-bold">{inc.id}</span>
                          <span className="text-gray-500 text-[11px]">• {inc.primaryNode}</span>
                          <span className="text-purple-400 text-[11px] bg-purple-500/10 px-1.5 py-0.2 rounded border border-purple-500/20">
                            {inc.confidencePct}% AI Confidence
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-gray-200 font-display leading-snug">
                          {inc.clusterTitle}
                        </h4>

                        <div className="flex items-center gap-4 text-[11px] text-gray-400 pt-1">
                          <span className="flex items-center gap-1">
                            <Bell className="w-3 h-3 text-gray-500" />
                            <strong className="text-white">{inc.rawAlertCount}</strong> raw alarms
                          </span>
                          <span className="text-emerald-400 font-bold">
                            {inc.noiseSuppressedPct}% noise suppressed
                          </span>
                          <span className="text-gray-500">{inc.firstSeen}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inc.status === 'ACTIVE'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                            : inc.status === 'AUTO_MITIGATING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-spin'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {inc.status}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-gray-500 transition-transform ${isSelected ? 'rotate-90 text-purple-400' : ''}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Deep Incident Investigation & Telemetry Drill-down (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedIncident ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-xl space-y-5 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <div>
                  <span className="text-[10px] text-purple-400 font-bold">INCIDENT INVESTIGATION</span>
                  <h3 className="text-base font-bold text-white font-display mt-0.5">{selectedIncident.id}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {selectedIncident.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleMitigateIncident(selectedIncident.id)}
                      className="px-3 py-1.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      Auto-Mitigate
                    </button>
                  )}
                </div>
              </div>

              {/* Root Cause AI Diagnosis */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <BrainCircuit className="w-4 h-4" />
                  AI Root Cause Determination ({selectedIncident.confidencePct}%)
                </div>
                <p className="text-gray-300 text-xs leading-relaxed font-sans">
                  {selectedIncident.rootCause}
                </p>
              </div>

              {/* Blast Radius & Impacted Services */}
              <div className="space-y-2">
                <span className="text-gray-400 text-[11px] font-bold uppercase">Estimated Blast Radius:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIncident.blastRadius.map((zone, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-gray-950 border border-gray-800 text-gray-300 text-[11px]">
                      {zone}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-gray-400 text-[11px] font-bold uppercase">Impacted FTN Services:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIncident.impactedServices.map((svc, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px]">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Suggested Remediation Command */}
              <div className="space-y-2">
                <span className="text-gray-400 text-[11px] font-bold uppercase">Suggested Autonomous Command:</span>
                <div className="p-2.5 rounded-xl bg-gray-950 border border-gray-800 text-emerald-400 overflow-x-auto select-all">
                  <code>{selectedIncident.actionCommand}</code>
                </div>
                <p className="text-[11px] text-gray-400 italic">
                  {selectedIncident.suggestedAction}
                </p>
              </div>

              {/* Raw Telemetry Alerts inside Cluster */}
              <div className="space-y-2 pt-2 border-t border-gray-800">
                <div className="flex items-center justify-between text-gray-400 text-[11px]">
                  <span className="font-bold uppercase">Raw Telemetry Clustered ({selectedIncident.telemetryAlerts.length})</span>
                  <span className="text-purple-400">Deduplicated</span>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {selectedIncident.telemetryAlerts.map(al => (
                    <div key={al.id} className="p-2 rounded-lg bg-gray-950/80 border border-gray-800/80 flex items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-800 text-cyan-400 font-bold">
                            {al.source}
                          </span>
                          <span className="text-white font-bold">{al.metric}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">
                          Value: <span className="text-rose-400 font-bold">{al.value}</span> (Thresh: {al.threshold})
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 whitespace-nowrap">{al.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-gray-900 border border-gray-800 text-center text-gray-500 font-mono text-xs">
              Select an incident from the left list to inspect telemetry correlations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
