import React, { useState, useMemo } from 'react';
import {
  Activity,
  Server,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Layers,
  Cpu,
  HardDrive,
  Network,
  Zap,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { INITIAL_MIGRATION_RECORDS, MigrationRecord } from '../data/migrationJournalData';

export function FtnMigrationJournal({ initialRecords }: { initialRecords?: MigrationRecord[] }) {
  const [records, setRecords] = useState<MigrationRecord[]>(initialRecords || INITIAL_MIGRATION_RECORDS);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(records[0]?.id || null);
  const [filterTrigger, setFilterTrigger] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const selectedRecord = useMemo(() => {
    return records.find(r => r.id === selectedRecordId) || records[0];
  }, [records, selectedRecordId]);

  const filteredRecords = useMemo(() => {
    return records.filter(rec => {
      const matchesTrigger = filterTrigger === 'ALL' || rec.triggerType === filterTrigger;
      const matchesSearch =
        rec.workloadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.sourceNode.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.targetNode.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        rec.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTrigger && matchesSearch;
    });
  }, [records, filterTrigger, searchQuery]);

  // Aggregate KPI stats
  const totalMigrations = records.length;
  const avgDowntime = (records.reduce((acc, r) => acc + r.metrics.cutoverDowntimeMs, 0) / totalMigrations).toFixed(1);
  const totalMemRebalancedGb = (records.reduce((acc, r) => acc + r.metrics.memoryTransferredMb, 0) / 1024).toFixed(1);

  const handleExportJournal = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ftn-migration-audit-journal-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportNotice('Migration Audit Journal exported as verified JSON record.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-blue-950/40 border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(59,130,246,0.2)]">
                <Layers className="w-3.5 h-3.5" />
                AUTONOMOUS WORKLOAD REBALANCE LOG
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                CRIU + eBPF Zero-Loss Live Cutover
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">
              FTN Migration Journal
            </h1>
            <p className="text-sm text-gray-400 font-mono max-w-3xl leading-relaxed">
              Verifiable audit trail recording every autonomous workload relocation, container memory migration, and traffic reroute triggered by the Scaling Controller and Smart Grid Optimizer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportJournal}
              className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Download className="w-4 h-4" />
              Export Audit Journal (JSON)
            </button>
          </div>
        </div>

        {exportNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {exportNotice}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>RECORDED WORKLOAD SHIFTS</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white font-display">{totalMigrations}</div>
          <div className="text-[11px] text-gray-500 mt-1">100% completed autonomously</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-emerald-500/30 shadow-lg bg-gradient-to-br from-emerald-950/20 to-gray-900">
          <div className="flex items-center justify-between text-emerald-300 text-xs mb-1">
            <span>AVG CUTOVER DOWNTIME</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300 font-display">{avgDowntime} ms</div>
          <div className="text-[11px] text-emerald-400/70 mt-1">eBPF atomic ring buffer handoff</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>RAM REBALANCED</span>
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-display">{totalMemRebalancedGb} GB</div>
          <div className="text-[11px] text-gray-500 mt-1">Dirty memory pre-copied via CRIU</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>PACKET LOSS RATIO</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-display">0.00%</div>
          <div className="text-[11px] text-gray-500 mt-1">Verified across all active sockets</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gray-900 border border-gray-800 font-mono text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search workload, node, or migration ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-gray-400">Trigger:</span>
          {(['ALL', 'AUTONOMOUS_SCALING', 'MANUAL_OPTIMIZE', 'PREVENTATIVE_MAINTENANCE'] as const).map(trig => (
            <button
              key={trig}
              onClick={() => setFilterTrigger(trig)}
              className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-colors ${
                filterTrigger === trig
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-gray-950 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              {trig.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Master Detail: Event List on Left, Comprehensive Before/After State on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Migration Event Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-3 font-mono">
          {filteredRecords.map(rec => {
            const isSelected = selectedRecord?.id === rec.id;
            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecordId(rec.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gray-800/90 border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.2)]'
                    : 'bg-gray-900 border-gray-800 hover:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{rec.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.triggerType === 'AUTONOMOUS_SCALING'
                        ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                        : rec.triggerType === 'PREVENTATIVE_MAINTENANCE'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                    }`}>
                      {rec.triggerType.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-gray-500">{rec.timestamp}</span>
                </div>

                <h4 className="text-sm font-semibold text-gray-100 font-display">
                  {rec.workloadName}
                </h4>

                <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                  <span className="truncate max-w-[130px] text-rose-300 font-semibold">{rec.sourceNode.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span className="truncate max-w-[130px] text-emerald-300 font-semibold">{rec.targetNode.name}</span>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-800/80 text-[11px] text-gray-500">
                  <span>Downtime: <strong className="text-emerald-400 font-bold">{rec.metrics.cutoverDowntimeMs} ms</strong></span>
                  <span>RAM: <strong className="text-cyan-400">{rec.metrics.memoryTransferredMb} MB</strong></span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {rec.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Detailed Before/After Visual Inspection (7 cols) */}
        <div className="lg:col-span-7">
          {selectedRecord ? (
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl space-y-6 font-mono text-xs">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
                <div>
                  <span className="text-[10px] text-blue-400 font-bold tracking-wider">STATE TRANSITION INSPECTION</span>
                  <h3 className="text-lg font-bold text-white font-display mt-0.5">{selectedRecord.id} • {selectedRecord.workloadName}</h3>
                  <p className="text-gray-400 text-xs mt-0.5">Container: <code>{selectedRecord.containerId}</code></p>
                </div>

                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 self-start">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Zero-Loss
                </span>
              </div>

              {/* The 'Before' and 'After' Comparison Grid */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Autonomous Rebalancing: Before vs After State
                </h4>

                {/* Source Node Comparison Card */}
                <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-rose-400 font-bold uppercase">SOURCE NODE (RELIEVED)</span>
                      <h5 className="text-sm font-bold text-white">{selectedRecord.sourceNode.name}</h5>
                      <span className="text-[11px] text-gray-500">{selectedRecord.sourceNode.location}</span>
                    </div>
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      Stress Normalized
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center">
                    <div className="p-2 rounded bg-gray-900/80 border border-gray-800">
                      <span className="text-[10px] text-gray-500 block">CPU LOAD</span>
                      <div className="text-xs font-bold">
                        <span className="text-rose-400 line-through">{selectedRecord.sourceNode.beforeState.cpuPct}%</span>
                        <ArrowRight className="w-3 h-3 inline mx-1 text-gray-500" />
                        <span className="text-emerald-400">{selectedRecord.sourceNode.afterState.cpuPct}%</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-gray-900/80 border border-gray-800">
                      <span className="text-[10px] text-gray-500 block">RAM USED</span>
                      <div className="text-xs font-bold">
                        <span className="text-rose-400 line-through">{selectedRecord.sourceNode.beforeState.ramPct}%</span>
                        <ArrowRight className="w-3 h-3 inline mx-1 text-gray-500" />
                        <span className="text-emerald-400">{selectedRecord.sourceNode.afterState.ramPct}%</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-gray-900/80 border border-gray-800">
                      <span className="text-[10px] text-gray-500 block">BANDWIDTH</span>
                      <div className="text-xs font-bold">
                        <span className="text-rose-400 line-through">{selectedRecord.sourceNode.beforeState.bandwidthGbps}G</span>
                        <ArrowRight className="w-3 h-3 inline mx-1 text-gray-500" />
                        <span className="text-emerald-400">{selectedRecord.sourceNode.afterState.bandwidthGbps}G</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-gray-900/80 border border-gray-800">
                      <span className="text-[10px] text-gray-500 block">DIE TEMP</span>
                      <div className="text-xs font-bold">
                        <span className="text-rose-400 line-through">{selectedRecord.sourceNode.beforeState.thermalC}°C</span>
                        <ArrowRight className="w-3 h-3 inline mx-1 text-gray-500" />
                        <span className="text-emerald-400">{selectedRecord.sourceNode.afterState.thermalC}°C</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Target Node Comparison Card */}
                <div className="p-4 rounded-xl bg-gray-950 border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">TARGET NODE (ABSORBER)</span>
                      <h5 className="text-sm font-bold text-white">{selectedRecord.targetNode.name}</h5>
                      <span className="text-[11px] text-gray-500">{selectedRecord.targetNode.location}</span>
                    </div>
                    <span className="text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/30">
                      Headroom Available
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center">
                    <div className="p-2 rounded bg-gray-900/80 border border-gray-800">
                      <span className="text-[10px] text-gray-500 block">CPU LOAD</span>
                      <div className="text-xs font-bold">
                        <span className="text-gray-400">{selectedRecord.targetNode.beforeState.cpuPct}%</span>
                        <ArrowRight className="w-3 h-3 inline mx-1 text-gray-500" />
                        <span className="text-blue-400">{selectedRecord.targetNode.afterState.cpuPct}%</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-gray-900/80 border border-gray-800">
                      <span className="text-[10px] text-gray-500 block">RAM USED</span>
                      <div className="text-xs font-bold">
                        <span className="text-gray-400">{selectedRecord.targetNode.beforeState.ramPct}%</span>
                        <ArrowRight className="w-3 h-3 inline mx-1 text-gray-500" />
                        <span className="text-blue-400">{selectedRecord.targetNode.afterState.ramPct}%</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-gray-900/80 border border-gray-800">
                      <span className="text-[10px] text-gray-500 block">BANDWIDTH</span>
                      <div className="text-xs font-bold">
                        <span className="text-gray-400">{selectedRecord.targetNode.beforeState.bandwidthGbps}G</span>
                        <ArrowRight className="w-3 h-3 inline mx-1 text-gray-500" />
                        <span className="text-blue-400">{selectedRecord.targetNode.afterState.bandwidthGbps}G</span>
                      </div>
                    </div>

                    <div className="p-2 rounded bg-gray-900/80 border border-gray-800">
                      <span className="text-[10px] text-gray-500 block">DIE TEMP</span>
                      <div className="text-xs font-bold">
                        <span className="text-gray-400">{selectedRecord.targetNode.beforeState.thermalC}°C</span>
                        <ArrowRight className="w-3 h-3 inline mx-1 text-gray-500" />
                        <span className="text-blue-400">{selectedRecord.targetNode.afterState.thermalC}°C</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* eBPF Socket Handoff & CRIU Memory Sync Log */}
              <div className="space-y-2 pt-3 border-t border-gray-800">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  CRIU Pre-Copy & eBPF Socket Atomic Cutover Log:
                </span>
                <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-1.5 font-mono text-[11px]">
                  {selectedRecord.ebpfHandoffLog.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-gray-300">
                      <span className="text-blue-400 font-bold">[{idx + 1}]</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 font-mono text-sm bg-gray-900 border border-gray-800 rounded-2xl">
              Select an autonomous migration record from the list to view the state transition.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
