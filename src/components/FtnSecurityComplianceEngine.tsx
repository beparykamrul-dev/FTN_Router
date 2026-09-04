import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lock,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Play,
  Terminal,
  FileText,
  Sliders,
  Award,
  Globe,
  Network,
  Cpu,
  ArrowRight,
  Server
} from 'lucide-react';
import { cn } from '../utils';

export interface ComplianceTask {
  id: string;
  title: string;
  framework: 'RPKI BGP' | 'Zero Trust NIST' | 'Sovereign PKI' | 'Kernel eBPF';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  affectedNodes: string[];
  description: string;
  remediationPlan: string;
  status: 'PENDING' | 'REMEDIATING' | 'REMEDIATED';
  scoreImpact: number;
}

const INITIAL_TASKS: ComplianceTask[] = [
  {
    id: 'comp-01',
    title: 'RPKI Route Origin Authorization (ROA) Missing for AS64512 103.186.240.0/24',
    framework: 'RPKI BGP',
    severity: 'CRITICAL',
    affectedNodes: ['ftn-core-01 (Dhaka)', 'ftn-edge-fra-01'],
    description: 'BGP prefix announced without validated cryptographic ROA payload in APNIC RPKI repository, exposing traffic to sub-prefix hijacking.',
    remediationPlan: 'Auto-publish signed ROA via Routinator & sync to local BIRD2 route validation daemon.',
    status: 'PENDING',
    scoreImpact: 6
  },
  {
    id: 'comp-02',
    title: 'WireGuard Anti-Replay Sliding Window Sub-optimal (< 1024 packets)',
    framework: 'Zero Trust NIST',
    severity: 'HIGH',
    affectedNodes: ['ftn-edge-sgp-01', 'ftn-edge-lon-01'],
    description: 'Replay mitigation window set to legacy 256 packets, creating vulnerability to state-exhaustion replay bursts over high-bandwidth 10G links.',
    remediationPlan: 'Execute kernel sysctl patch: net.wireguard.anti_replay_window = 2048 on affected nodes.',
    status: 'PENDING',
    scoreImpact: 4
  },
  {
    id: 'comp-03',
    title: 'mTLS Node Intermediate CA Certificate Expiration Within 14 Days',
    framework: 'Sovereign PKI',
    severity: 'HIGH',
    affectedNodes: ['ftn-edge-nyc-02'],
    description: 'Intermediate certificate for NYC edge gateway requires sovereign root re-signing under CFSSL / Vault.',
    remediationPlan: 'Trigger automated zero-downtime ACME/Vault key rotation with Ed25519 sovereign CA.',
    status: 'PENDING',
    scoreImpact: 5
  },
  {
    id: 'comp-04',
    title: 'eBPF XDP SYN Flood Mitigation Threshold Exceeds Recommended SLA',
    framework: 'Kernel eBPF',
    severity: 'MEDIUM',
    affectedNodes: ['ftn-edge-fra-02', 'ftn-edge-tyo-01'],
    description: 'XDP kernel filter allows up to 150k pps before dropping illegitimate TCP SYN packets.',
    remediationPlan: 'Tune eBPF XDP maps drop rate threshold to 50k pps with dynamic IP reputation scoring.',
    status: 'PENDING',
    scoreImpact: 3
  },
  {
    id: 'comp-05',
    title: 'DNSSEC Key Tag 48218 ZSK Rollover Period Verification',
    framework: 'RPKI BGP',
    severity: 'LOW',
    affectedNodes: ['ftn-dns-anycast-grid'],
    description: 'Zone Signing Key has been active for 85 days; standard best practice recommends 90-day automated rollover.',
    remediationPlan: 'Enqueue automated DNSSEC ZSK rollover job in Knot/PowerDNS orchestrator.',
    status: 'PENDING',
    scoreImpact: 2
  }
];

export function FtnSecurityComplianceEngine({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [tasks, setTasks] = useState<ComplianceTask[]>(INITIAL_TASKS);
  const [isScanning, setIsScanning] = useState(false);
  const [activeRemediatingId, setActiveRemediatingId] = useState<string | null>(null);
  const [frameworkFilter, setFrameworkFilter] = useState<string>('ALL');

  // Dynamic score calculation
  const pendingImpact = tasks.filter(t => t.status !== 'REMEDIATED').reduce((sum, t) => sum + t.scoreImpact, 0);
  const score = Math.max(70, 100 - pendingImpact);
  const grade = score >= 95 ? 'A+' : score >= 90 ? 'A' : score >= 80 ? 'B' : 'C';

  // Run deep infrastructure scan
  const handleDeepScan = () => {
    setIsScanning(true);
    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          type: 'info',
          title: 'Deep Security Scan Initiated',
          message: 'Auditing 30 edge nodes across RPKI, ZeroTrust, and eBPF kernel rules...'
        }
      })
    );

    setTimeout(() => {
      setIsScanning(false);
      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: {
            type: 'success',
            title: 'Scan Complete',
            message: `Evaluated 64 security controls. Score calculated at ${score}/100.`
          }
        })
      );
    }, 1800);
  };

  // One-click Auto-Remediate
  const handleRemediateTask = (task: ComplianceTask) => {
    if (activeRemediatingId) return;
    setActiveRemediatingId(task.id);

    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          type: 'info',
          title: `Executing Auto-Remediation: ${task.framework}`,
          message: task.remediationPlan
        }
      })
    );

    setTimeout(() => {
      setTasks(prev =>
        prev.map(t =>
          t.id === task.id ? { ...t, status: 'REMEDIATED' } : t
        )
      );
      setActiveRemediatingId(null);

      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: {
            type: 'success',
            title: `Remediated: ${task.title.slice(0, 35)}...`,
            message: `Compliance rule passed. Security posture +${task.scoreImpact} points.`
          }
        })
      );
    }, 1600);
  };

  // Remediate all pending tasks
  const handleRemediateAll = () => {
    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          type: 'info',
          title: 'Batch Auto-Remediation Triggered',
          message: 'Executing RPKI signing, WireGuard tuning, and CA cert rotation across grid...'
        }
      })
    );

    setTimeout(() => {
      setTasks(prev => prev.map(t => ({ ...t, status: 'REMEDIATED' })));
      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: {
            type: 'success',
            title: 'All Compliance Checks Passed',
            message: 'Infrastructure achieved 100/100 Grade A+ Sovereign ZeroTrust posture.'
          }
        })
      );
    }, 2000);
  };

  const filteredTasks = tasks.filter(t => {
    if (frameworkFilter === 'ALL') return true;
    return t.framework === frameworkFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#091122] via-[#0b1730] to-[#080e1c] border border-gray-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00ff66] to-[#00f0ff] flex items-center justify-center text-gray-950 shadow-[0_0_25px_rgba(0,255,102,0.4)]">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight flex items-center gap-3">
                  FTN SECURITY &amp; RPKI COMPLIANCE ENGINE
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00ff66]/20 text-[#00ff66] font-mono border border-[#00ff66]/40">
                    NIST SP 800-207 &bull; RFC 6480
                  </span>
                </h1>
                <p className="text-gray-300 font-mono text-xs lg:text-sm">
                  Automated scanning of network nodes against ZeroTrust, RPKI ROA cryptographics, and sovereign PKI with one-click automated remediation.
                </p>
              </div>
            </div>
          </div>

          {/* Compliance Score Gauge */}
          <div className="flex items-center gap-4 bg-gray-950/80 border border-gray-800 rounded-2xl p-4">
            <div className="text-center px-3">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Posture Grade</span>
              <span className="text-3xl font-black text-[#00ff66] font-mono">{grade}</span>
            </div>
            <div className="h-12 w-px bg-gray-800" />
            <div className="text-center px-3">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Compliance Score</span>
              <span className="text-3xl font-black text-white font-mono flex items-center justify-center gap-1">
                {score}<span className="text-xs text-gray-500 font-normal">/100</span>
              </span>
            </div>
            <div className="h-12 w-px bg-gray-800" />
            <div className="text-center px-3">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Pending Tasks</span>
              <span className={cn("text-3xl font-black font-mono", pendingImpact > 0 ? "text-amber-400" : "text-[#00ff66]")}>
                {tasks.filter(t => t.status !== 'REMEDIATED').length}
              </span>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="mt-6 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'RPKI BGP', 'Zero Trust NIST', 'Sovereign PKI', 'Kernel eBPF'].map(cat => (
              <button
                key={cat}
                onClick={() => setFrameworkFilter(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border",
                  frameworkFilter === cat
                    ? "bg-white/10 text-white border-[#00f0ff]"
                    : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDeepScan}
              disabled={isScanning}
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white border border-gray-700 text-xs font-mono font-bold flex items-center gap-2 transition-all"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isScanning && "animate-spin text-[#00f0ff]")} />
              <span>{isScanning ? 'Auditing 30 Edge Nodes...' : 'Run Deep Infrastructure Scan'}</span>
            </button>

            {pendingImpact > 0 && (
              <button
                onClick={handleRemediateAll}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00f0ff] text-gray-950 font-mono font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,255,102,0.3)]"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Auto-Remediate All Findings</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Compliance Task Matrix */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Award className="w-4 h-4 text-[#00ff66]" />
            ACTIONABLE REMEDIATION TASKS ({filteredTasks.length})
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            {tasks.filter(t => t.status === 'REMEDIATED').length} of {tasks.length} checks satisfied
          </span>
        </div>

        <div className="space-y-3">
          {filteredTasks.map(task => {
            const isRemediated = task.status === 'REMEDIATED';
            const isBusy = activeRemediatingId === task.id;

            return (
              <div
                key={task.id}
                className={cn(
                  "p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4",
                  isRemediated
                    ? "bg-[#091122]/60 border-gray-800/80 opacity-75"
                    : task.severity === 'CRITICAL'
                    ? "bg-red-950/20 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20"
                    : task.severity === 'HIGH'
                    ? "bg-amber-950/15 border-amber-500/40"
                    : "bg-[#080e1c] border-gray-800 hover:border-gray-700"
                )}
              >
                {/* Left: Task Info */}
                <div className="space-y-2 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border",
                        task.severity === 'CRITICAL' ? "bg-red-500/20 text-red-400 border-red-500/40" :
                        task.severity === 'HIGH' ? "bg-amber-500/20 text-amber-400 border-amber-500/40" :
                        "bg-blue-500/20 text-blue-400 border-blue-500/40"
                      )}
                    >
                      {task.severity}
                    </span>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-300">
                      {task.framework}
                    </span>

                    <span
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border",
                        isRemediated ? "bg-emerald-500/10 text-[#00ff66] border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", isRemediated ? "bg-[#00ff66]" : "bg-amber-400")} />
                      {isRemediated ? 'REMEDIATED' : 'ACTION REQUIRED'}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-display">{task.title}</h3>
                  <p className="text-xs text-gray-300 font-mono leading-relaxed">{task.description}</p>

                  <div className="text-xs font-mono text-gray-400 bg-black/60 p-2.5 rounded-xl border border-gray-800">
                    <strong className="text-[#00f0ff]">Automated Remediation:</strong> {task.remediationPlan}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-gray-400 pt-1">
                    <span className="text-gray-500">Target Nodes:</span>
                    {task.affectedNodes.map(node => (
                      <span key={node} className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-300">
                        {node}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Score boost and Auto-Remediate Action (Requested feature) */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-800/80">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-gray-500 block uppercase">Posture Value</span>
                    <span className="text-sm font-bold font-mono text-[#00ff66]">+{task.scoreImpact} Score</span>
                  </div>

                  <button
                    onClick={() => handleRemediateTask(task)}
                    disabled={isRemediated || isBusy}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md flex-shrink-0",
                      isRemediated
                        ? "bg-emerald-500/15 text-[#00ff66] border border-emerald-500/30 cursor-default"
                        : isBusy
                        ? "bg-[#00f0ff]/30 text-white border border-[#00f0ff]/50 animate-pulse"
                        : "bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-gray-950 font-black shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
                    )}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {isRemediated ? 'Remediated & Verified' : isBusy ? 'Applying Ansible...' : 'Auto-Remediate'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
