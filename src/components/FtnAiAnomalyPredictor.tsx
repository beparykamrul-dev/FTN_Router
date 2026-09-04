import React, { useState } from 'react';
import {
  BrainCircuit,
  AlertTriangle,
  Flame,
  HardDrive,
  Cpu,
  Network,
  Clock,
  CheckCircle2,
  Zap,
  RefreshCw,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Terminal,
  Activity
} from 'lucide-react';
import { INITIAL_PREDICTIONS, TelemetryForecast } from '../data/predictiveMaintenanceData';

interface FtnAiAnomalyPredictorProps {
  embedded?: boolean;
}

export function FtnAiAnomalyPredictor({ embedded = false }: FtnAiAnomalyPredictorProps) {
  const [predictions, setPredictions] = useState<TelemetryForecast[]>(INITIAL_PREDICTIONS);
  const [selectedPredictionId, setSelectedPredictionId] = useState<string>(INITIAL_PREDICTIONS[0].id);
  const [isSimulatingAnalysis, setIsSimulatingAnalysis] = useState(false);
  const [executingId, setExecutingId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const selectedPrediction = predictions.find(p => p.id === selectedPredictionId) || predictions[0];

  const handleRunAiAnalysis = () => {
    setIsSimulatingAnalysis(true);
    setTimeout(() => {
      setIsSimulatingAnalysis(false);
      setActionSuccessMsg('Historical telemetry model re-evaluated 4.8M metrics. Forecast confidence updated.');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }, 1200);
  };

  const handleExecuteMaintenance = (predId: string) => {
    setExecutingId(predId);
    setTimeout(() => {
      setExecutingId(null);
      setPredictions(prev =>
        prev.map(p => {
          if (p.id === predId) {
            return {
              ...p,
              status: 'RESOLVED',
              currentValue: 'Mitigated: Parameter returned to safe operational baseline'
            };
          }
          return p;
        })
      );
      setActionSuccessMsg(`Preventative maintenance action executed for ${predId}. Failure probability dropped to 1.2%.`);
      setTimeout(() => setActionSuccessMsg(null), 5000);
    }, 1800);
  };

  const activePredictions = predictions.filter(p => p.status !== 'RESOLVED');

  return (
    <div className={`space-y-6 ${embedded ? '' : ''}`}>
      {/* Header Banner (only show full banner if not embedded) */}
      {!embedded && (
        <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-amber-950/40 border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  PREDICTIVE TELEMETRY AI ENGINE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Continuous Hardware Wear & Bottleneck Forecast
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">
                FTN AI Anomaly & Failure Predictor
              </h1>
              <p className="text-sm text-gray-400 font-mono max-w-3xl leading-relaxed">
                Analyzes multi-week historical telemetry curves from Prometheus, Zabbix, and eBPF probes to anticipate hardware degradation, memory leaks, and network buffer exhaustion before they impact live production traffic.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleRunAiAnalysis}
                disabled={isSimulatingAnalysis}
                className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30 flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSimulatingAnalysis ? 'animate-spin' : ''}`} />
                {isSimulatingAnalysis ? 'Analyzing Historical Curves...' : 'Re-run Telemetry Forecast'}
              </button>
            </div>
          </div>

          {actionSuccessMsg && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {actionSuccessMsg}
            </div>
          )}
        </div>
      )}

      {/* Embedded banner notice */}
      {embedded && (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 font-mono">
          <div className="flex items-center gap-2.5">
            <BrainCircuit className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="text-sm font-bold text-white">AI Telemetry Bottleneck & Wear Predictor</h4>
              <p className="text-xs text-gray-400">Proactively projecting hardware stress & recommending preventative maintenance</p>
            </div>
          </div>
          <button
            onClick={handleRunAiAnalysis}
            disabled={isSimulatingAnalysis}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingAnalysis ? 'animate-spin' : ''}`} />
            {isSimulatingAnalysis ? 'Forecasting...' : 'Re-Evaluate'}
          </button>
        </div>
      )}

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>FORECASTED BOTTLENECKS</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 font-display">{activePredictions.length}</div>
          <div className="text-[11px] text-gray-500 mt-1">Pending preventative action</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>CRITICAL RISKS (&lt; 2h)</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 font-display">
            {predictions.filter(p => p.severity === 'CRITICAL' && p.status !== 'RESOLVED').length}
          </div>
          <div className="text-[11px] text-rose-400/70 mt-1">Immediate intervention advised</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>AVG PREDICTION ACCURACY</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400 font-display">95.4%</div>
          <div className="text-[11px] text-cyan-400/70 mt-1">Validated across 90-day history</div>
        </div>

        <div className="p-4 rounded-2xl bg-gray-900 border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
            <span>DOWNTIME AVERTED</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-display">100.0%</div>
          <div className="text-[11px] text-emerald-400/70 mt-1">Zero unplanned outages</div>
        </div>
      </div>

      {/* Main Grid: Forecast Cards list on left, Preventative Maintenance on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Forecast Items List (5 cols) */}
        <div className="lg:col-span-5 space-y-3 font-mono">
          {predictions.map(pred => {
            const isSelected = selectedPrediction.id === pred.id;
            return (
              <div
                key={pred.id}
                onClick={() => setSelectedPredictionId(pred.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gray-800/90 border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    : 'bg-gray-900 border-gray-800 hover:bg-gray-800/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      pred.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : pred.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}>
                      {pred.severity}
                    </span>
                    <span className="text-xs font-bold text-white">{pred.id}</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    pred.status === 'RESOLVED'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'text-amber-400 bg-amber-500/10'
                  }`}>
                    {pred.status === 'RESOLVED' ? 'MITIGATED' : `T - ${pred.timeToFailure}`}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-gray-100 font-display">
                  {pred.targetComponent}
                </h4>

                <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                  <span className="text-gray-300 font-semibold">{pred.nodeName}</span>
                  <span className="text-cyan-400 font-bold">{pred.probabilityPct}% Probability</span>
                </div>

                <div className="mt-2.5 pt-2 border-t border-gray-800/80 text-[11px] text-gray-500 truncate">
                  {pred.description}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Actionable Preventative Maintenance Details (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl space-y-5 font-mono text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
              <div>
                <span className="text-[10px] text-amber-400 font-bold tracking-wider">PREVENTATIVE MAINTENANCE SPECIFICATION</span>
                <h3 className="text-base sm:text-lg font-bold text-white font-display mt-0.5">
                  {selectedPrediction.id} • {selectedPrediction.targetComponent}
                </h3>
                <span className="text-gray-400 text-xs">Node: <strong className="text-white">{selectedPrediction.nodeName}</strong></span>
              </div>

              {selectedPrediction.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleExecuteMaintenance(selectedPrediction.id)}
                  disabled={executingId === selectedPrediction.id}
                  className="px-4 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all self-start"
                >
                  <Zap className={`w-4 h-4 ${executingId === selectedPrediction.id ? 'animate-spin' : ''}`} />
                  {executingId === selectedPrediction.id ? 'Executing Fix...' : 'Execute Preventative Fix'}
                </button>
              )}
            </div>

            {/* Diagnostic Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                <span className="text-[10px] text-gray-500 block">CURRENT TELEMETRY READING</span>
                <div className="text-amber-300 font-bold leading-snug">{selectedPrediction.currentValue}</div>
                <div className="text-[10px] text-gray-500">Signal: {selectedPrediction.telemetrySignal}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                <span className="text-[10px] text-gray-500 block">PROJECTED BREAKING THRESHOLD</span>
                <div className="text-rose-400 font-bold leading-snug">{selectedPrediction.projectedCriticalValue}</div>
                <div className="text-[10px] text-gray-500">Estimated window: ~{selectedPrediction.timeToFailure}</div>
              </div>
            </div>

            {/* Root Cause Analysis */}
            <div className="p-4 rounded-xl bg-gray-950/80 border border-gray-800 space-y-2">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                ROOT CAUSE ANALYSIS (TELEMETRY SLOPING)
              </span>
              <p className="text-gray-300 text-xs leading-relaxed font-sans">
                {selectedPrediction.rootCauseAnalysis}
              </p>
            </div>

            {/* Actionable Maintenance Recommendation Box */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/30 to-gray-950 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Recommended Action: {selectedPrediction.preventativeAction.title}</span>
              </div>

              <p className="text-gray-300 text-xs font-sans leading-relaxed">
                {selectedPrediction.preventativeAction.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-gray-800/80">
                <div>
                  <span className="text-gray-500 block">PROJECTED IMPACT:</span>
                  <span className="text-emerald-400 font-semibold">{selectedPrediction.preventativeAction.impact}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">ESTIMATED DOWNTIME:</span>
                  <span className="text-emerald-400 font-semibold">{selectedPrediction.preventativeAction.estimatedDowntime}</span>
                </div>
              </div>

              {/* Terminal command snippet */}
              <div className="space-y-1 pt-1">
                <span className="text-gray-500 text-[10px]">AUTONOMOUS CLI COMMAND:</span>
                <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-emerald-400 font-mono text-[11px] select-all overflow-x-auto">
                  <code>{selectedPrediction.preventativeAction.actionCommand}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
