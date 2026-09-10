import React, { useState, useMemo } from 'react';
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
  Server,
  Bell,
  BellRing,
  Mail,
  Send,
  SlidersHorizontal,
  Check,
  ExternalLink,
  History,
  TrendingUp,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { cn } from '../utils';

export interface ComplianceTask {
  id: string;
  title: string;
  framework: 'RPKI BGP' | 'Zero Trust NIST' | 'Sovereign PKI' | 'Kernel eBPF';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  affectedNodes: string[];
  description: string;
  remediationPlan: string;
  remediationScript: string;
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
    remediationScript: 'krillc roas publish --asn 64512 --prefix 103.186.240.0/24 --maxlen 24 && birdc reload',
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
    remediationScript: 'sysctl -w net.wireguard.anti_replay_window=2048 && wg syncconf wg0 /etc/wireguard/wg0.conf',
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
    remediationScript: 'vault write pki/issue/sovereign-edge common_name=ftn-edge-nyc-02.familytimenet.com ttl=2160h',
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
    remediationScript: 'bpftool map update pinned /sys/fs/bpf/xdp_syn_thresh key 0 0 0 0 value 50000',
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
    remediationScript: 'knotc zone-key-rollover familytimenet.com zsk && pdns_control notify familytimenet.com',
    status: 'PENDING',
    scoreImpact: 2
  }
];

// Base historical 30-day compliance score trend data
const BASE_TREND_DATA = [
  { day: 'Day 1', date: 'Aug 07', score: 79 },
  { day: 'Day 3', date: 'Aug 09', score: 81 },
  { day: 'Day 6', date: 'Aug 12', score: 82 },
  { day: 'Day 9', date: 'Aug 15', score: 78 },
  { day: 'Day 12', date: 'Aug 18', score: 84 },
  { day: 'Day 15', date: 'Aug 21', score: 83 },
  { day: 'Day 18', date: 'Aug 24', score: 86 },
  { day: 'Day 21', date: 'Aug 27', score: 85 },
  { day: 'Day 24', date: 'Aug 30', score: 89 },
  { day: 'Day 27', date: 'Sep 02', score: 91 },
  { day: 'Day 29', date: 'Sep 04', score: 90 },
  { day: 'Day 30', date: 'Today', score: 92 }
];

export function FtnSecurityComplianceEngine({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [tasks, setTasks] = useState<ComplianceTask[]>(INITIAL_TASKS);
  const [isScanning, setIsScanning] = useState(false);
  const [activeRemediatingId, setActiveRemediatingId] = useState<string | null>(null);
  const [frameworkFilter, setFrameworkFilter] = useState<string>('ALL');

  // Alert Notification System State
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(true);
  const [slackAlertsEnabled, setSlackAlertsEnabled] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState(80);
  const [emailRecipient, setEmailRecipient] = useState('noc-security@familytimenet.com');
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/FTN/B02/SecOpsAlerts');
  const [isSendingTestAlert, setIsSendingTestAlert] = useState(false);
  const [showAlertSettings, setShowAlertSettings] = useState(false);

  // Dynamic score calculation
  const pendingImpact = tasks.filter(t => t.status !== 'REMEDIATED').reduce((sum, t) => sum + t.scoreImpact, 0);
  const score = Math.max(70, 100 - pendingImpact);
  const grade = score >= 95 ? 'A+' : score >= 90 ? 'A' : score >= 80 ? 'B' : 'C';
  const isAlertConditionActive = (emailAlertsEnabled || slackAlertsEnabled) && score < alertThreshold;

  // 30-Day Score Trend data dynamically anchored to current score
  const trendData = useMemo(() => {
    return BASE_TREND_DATA.map((item, index) => {
      if (index === BASE_TREND_DATA.length - 1) {
        return { ...item, score };
      }
      return item;
    });
  }, [score]);

  // Donut chart distribution of passed vs. failed checks by security category
  const donutData = useMemo(() => {
    const categories: ('RPKI BGP' | 'Zero Trust NIST' | 'Sovereign PKI' | 'Kernel eBPF')[] = [
      'RPKI BGP',
      'Zero Trust NIST',
      'Sovereign PKI',
      'Kernel eBPF'
    ];

    return categories.map(cat => {
      const catTasks = tasks.filter(t => t.framework === cat);
      const passedCount = catTasks.filter(t => t.status === 'REMEDIATED').length + 8; // Baseline baseline verified checks
      const failedCount = catTasks.filter(t => t.status !== 'REMEDIATED').length;

      return {
        name: cat,
        passed: passedCount,
        failed: failedCount,
        total: passedCount + failedCount
      };
    });
  }, [tasks]);

  // Category Colors
  const CATEGORY_COLORS: Record<string, string> = {
    'RPKI BGP': '#00ff66',
    'Zero Trust NIST': '#00f0ff',
    'Sovereign PKI': '#a855f7',
    'Kernel eBPF': '#f59e0b'
  };

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

  // One-click Remediate Button handler
  const handleRemediateTask = (task: ComplianceTask) => {
    if (activeRemediatingId) return;
    setActiveRemediatingId(task.id);

    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          type: 'info',
          title: `Executing Automated Script: [${task.framework}]`,
          message: `Running: ${task.remediationScript}`
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
            message: `Configuration applied successfully. Compliance score +${task.scoreImpact} points!`
          }
        })
      );
    }, 1600);
  };

  // Remediate all pending tasks in batch
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

  // Send simulated test alert
  const handleSendTestAlert = () => {
    setIsSendingTestAlert(true);

    setTimeout(() => {
      setIsSendingTestAlert(false);
      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: {
            type: 'success',
            title: 'Test Alert Dispatched',
            message: `Sent test alert to Email (${emailRecipient}) and Slack (${slackWebhook.slice(0, 30)}...).`
          }
        })
      );
    }, 1200);
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

          {/* Compliance Score Gauge & Action links */}
          <div className="flex flex-wrap items-center gap-4">
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

            {/* Quick Links */}
            <div className="flex flex-col gap-2">
              {onNavigate && (
                <button
                  onClick={() => onNavigate('compliance-audit-trail')}
                  className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                >
                  <History className="w-4 h-4" />
                  <span>Audit Trail &amp; Reports</span>
                </button>
              )}

              <button
                onClick={() => setShowAlertSettings(!showAlertSettings)}
                className={cn(
                  "px-4 py-2 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all",
                  showAlertSettings
                    ? "bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/50"
                    : "bg-gray-900 hover:bg-gray-800 text-gray-300 border-gray-700"
                )}
              >
                <BellRing className="w-4 h-4 text-[#00f0ff]" />
                <span>Alert Notifications</span>
                <span className={cn(
                  "w-2 h-2 rounded-full",
                  isAlertConditionActive ? "bg-red-500 animate-ping" : (emailAlertsEnabled || slackAlertsEnabled) ? "bg-[#00ff66]" : "bg-gray-600"
                )} />
              </button>
            </div>
          </div>
        </div>

        {/* Live Alert Threshold Warning Banner */}
        {isAlertConditionActive && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-500/50 rounded-xl flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-2 text-xs font-mono text-red-300">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>
                <strong>CRITICAL ALERT ACTIVE:</strong> Current score ({score}%) has dropped below your configured threshold ({alertThreshold}%). Webhook &amp; Email dispatches have been triggered.
              </span>
            </div>
            <button
              onClick={handleRemediateAll}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-mono font-bold whitespace-nowrap"
            >
              Resolve All Issues
            </button>
          </div>
        )}

        {/* Global Filter Bar */}
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

      {/* Alert Notification Configuration Drawer / Panel */}
      {showAlertSettings && (
        <div className="bg-[#080e1c] border border-gray-800 rounded-3xl p-6 space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/20 text-[#00f0ff] flex items-center justify-center border border-[#00f0ff]/30">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white font-display">Compliance Alert Notification Settings</h3>
                <p className="text-xs text-gray-400 font-mono">
                  Automatically dispatch alerts to SecOps via Email or Slack when compliance score falls below threshold.
                </p>
              </div>
            </div>

            <button
              onClick={handleSendTestAlert}
              disabled={isSendingTestAlert}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white border border-gray-700 text-xs font-mono font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <Send className={cn("w-3.5 h-3.5 text-[#00f0ff]", isSendingTestAlert && "animate-pulse")} />
              <span>{isSendingTestAlert ? 'Sending Dispatch...' : 'Send Test Alert'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Threshold Slider */}
            <div className="bg-black/40 border border-gray-800 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-gray-400 uppercase font-bold">Alert Threshold</label>
                <span className={cn("text-base font-bold font-mono px-2 py-0.5 rounded", alertThreshold >= 85 ? "text-purple-400 bg-purple-500/10" : "text-[#00ff66] bg-emerald-500/10")}>
                  {alertThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={alertThreshold}
                onChange={e => setAlertThreshold(Number(e.target.value))}
                className="w-full accent-[#00f0ff] cursor-pointer"
              />
              <p className="text-[11px] text-gray-500 font-mono">
                Triggers alert when score drops &lt; {alertThreshold}%. Current score: <strong className={score < alertThreshold ? "text-red-400" : "text-[#00ff66]"}>{score}%</strong>.
              </p>
            </div>

            {/* Email Notification Toggle & Target */}
            <div className="bg-black/40 border border-gray-800 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-300 font-bold">
                  <Mail className="w-4 h-4 text-[#00ff66]" />
                  <span>Email Alerts</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailAlertsEnabled}
                    onChange={e => setEmailAlertsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#00ff66]"></div>
                </label>
              </div>
              <input
                type="email"
                value={emailRecipient}
                onChange={e => setEmailRecipient(e.target.value)}
                disabled={!emailAlertsEnabled}
                placeholder="secops@domain.com"
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-[#00ff66] disabled:opacity-40"
              />
              <span className="text-[10px] text-gray-500 font-mono block">SMTP dispatch over sovereign mTLS relay.</span>
            </div>

            {/* Slack Webhook Toggle & Target */}
            <div className="bg-black/40 border border-gray-800 p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-gray-300 font-bold">
                  <Network className="w-4 h-4 text-purple-400" />
                  <span>Slack Webhook Alerts</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={slackAlertsEnabled}
                    onChange={e => setSlackAlertsEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500"></div>
                </label>
              </div>
              <input
                type="text"
                value={slackWebhook}
                onChange={e => setSlackWebhook(e.target.value)}
                disabled={!slackAlertsEnabled}
                placeholder="https://hooks.slack.com/..."
                className="w-full bg-gray-900 border border-gray-800 rounded-lg px-3 py-1.5 text-xs font-mono text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 disabled:opacity-40"
              />
              <span className="text-[10px] text-gray-500 font-mono block">Posts to channel #ftn-secops-alerts.</span>
            </div>
          </div>
        </div>
      )}

      {/* Recharts Data Visualization Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Compliance Score Trend (Line Chart) */}
        <div className="lg:col-span-8 bg-[#080e1c] border border-gray-800 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00ff66]" />
              <div>
                <h3 className="text-base font-bold text-white font-display">Compliance Score Trend (Last 30 Days)</h3>
                <p className="text-xs text-gray-400 font-mono">Real-time telemetry and post-remediation posture tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-gray-300">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66]" /> Compliance %
              </span>
              <span className="flex items-center gap-1.5 text-red-400">
                <span className="w-2.5 h-0.5 bg-red-500" /> Threshold ({alertThreshold}%)
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#6b7280"
                  tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: '#374151' }}
                />
                <YAxis
                  domain={[60, 100]}
                  stroke="#6b7280"
                  tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: '#374151' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const val = payload[0].value;
                      return (
                        <div className="bg-gray-950 border border-gray-700 p-3 rounded-xl shadow-xl font-mono text-xs">
                          <div className="text-gray-400">{label}</div>
                          <div className="text-sm font-bold text-[#00ff66] mt-1">
                            Score: {val}/100
                          </div>
                          <div className="text-[10px] text-gray-500 mt-0.5">
                            Status: {Number(val) >= alertThreshold ? 'COMPLIANT' : 'BELOW THRESHOLD'}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={alertThreshold}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{ value: `Alert Threshold (${alertThreshold}%)`, fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#00ff66"
                  strokeWidth={3}
                  dot={{ fill: '#00ff66', r: 4, strokeWidth: 2, stroke: '#080e1c' }}
                  activeDot={{ r: 6, fill: '#00f0ff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Passed vs. Failed Checks by Security Category (Donut Chart) */}
        <div className="lg:col-span-4 bg-[#080e1c] border border-gray-800 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-[#00f0ff]" />
              <div>
                <h3 className="text-base font-bold text-white font-display">Checks by Category</h3>
                <p className="text-xs text-gray-400 font-mono">Passed vs. Failed distribution</p>
              </div>
            </div>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-gray-950 border border-gray-700 p-2.5 rounded-xl shadow-xl font-mono text-xs">
                          <div className="font-bold text-white">{d.name}</div>
                          <div className="text-[#00ff66] text-xs mt-1">Passed: {d.passed} checks</div>
                          <div className={cn("text-xs", d.failed > 0 ? "text-red-400 font-bold" : "text-gray-500")}>
                            Action Required: {d.failed}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Pie
                  data={donutData}
                  dataKey="passed"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                >
                  {donutData.map((entry) => (
                    <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#00f0ff'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-white font-mono">{score}%</span>
              <span className="text-[10px] text-gray-400 font-mono uppercase">Fleet Posture</span>
            </div>
          </div>

          {/* Custom Category Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-800/80 text-[11px] font-mono">
            {donutData.map(cat => (
              <div key={cat.name} className="flex items-center justify-between p-1 rounded bg-black/40 border border-gray-800">
                <span className="flex items-center gap-1.5 truncate text-gray-300">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CATEGORY_COLORS[cat.name] }} />
                  <span className="truncate">{cat.name}</span>
                </span>
                <span className="text-gray-400 font-bold ml-1">
                  <span className="text-[#00ff66]">{cat.passed}</span>/<span>{cat.total}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Compliance Task Matrix with One-Click Remediation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Award className="w-4 h-4 text-[#00ff66]" />
            ACTIONABLE REMEDIATION TASKS &amp; SCRIPTS ({filteredTasks.length})
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
                    ? "bg-[#091122]/60 border-gray-800/80 opacity-80"
                    : task.severity === 'CRITICAL'
                    ? "bg-red-950/20 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20"
                    : task.severity === 'HIGH'
                    ? "bg-amber-950/15 border-amber-500/40"
                    : "bg-[#080e1c] border-gray-800 hover:border-gray-700"
                )}
              >
                {/* Left: Task Info & Automated Script */}
                <div className="space-y-2.5 max-w-2xl flex-1">
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

                  {/* Remediation Plan and Shell Script Preview */}
                  <div className="space-y-1.5 bg-black/60 p-3 rounded-xl border border-gray-800">
                    <div className="text-xs font-mono text-gray-400">
                      <strong className="text-[#00f0ff]">Automated Fix:</strong> {task.remediationPlan}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-gray-300 bg-gray-950 p-2 rounded border border-gray-800/80 overflow-x-auto">
                      <Terminal className="w-3.5 h-3.5 text-[#00ff66] flex-shrink-0" />
                      <code className="text-[#00ff66] whitespace-nowrap">$ {task.remediationScript}</code>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-gray-400 pt-0.5">
                    <span className="text-gray-500">Target Nodes:</span>
                    {task.affectedNodes.map(node => (
                      <span key={node} className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-300">
                        {node}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Score boost and Remediate Button (Requested feature) */}
                <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-800/80 lg:pl-4">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-gray-500 block uppercase">Posture Value</span>
                    <span className="text-sm font-bold font-mono text-[#00ff66]">+{task.scoreImpact} Score</span>
                  </div>

                  <button
                    onClick={() => handleRemediateTask(task)}
                    disabled={isRemediated || isBusy}
                    className={cn(
                      "px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md flex-shrink-0",
                      isRemediated
                        ? "bg-emerald-500/15 text-[#00ff66] border border-emerald-500/30 cursor-default"
                        : isBusy
                        ? "bg-[#00f0ff]/30 text-white border border-[#00f0ff]/50 animate-pulse"
                        : "bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-gray-950 font-black shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
                    )}
                  >
                    {isRemediated ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Remediated &amp; Verified</span>
                      </>
                    ) : isBusy ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Executing Script...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Remediate</span>
                      </>
                    )}
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
