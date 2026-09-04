import React, { useState, useMemo } from 'react';
import {
  Shield,
  Key,
  Lock,
  UserCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Terminal,
  Clock,
  Globe,
  Radio,
  Zap,
  Trash2,
  Sliders,
  ExternalLink,
  Cpu,
  Layers,
  Fingerprint,
  Users,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { cn } from '../utils';

export interface ActiveSession {
  id: string;
  user: string;
  role: 'Super Admin' | 'NOC Engineer' | 'Edge mTLS Node' | 'AI Autonomous Agent' | 'Security Auditor';
  sessionType: 'mTLS v1.3' | 'OIDC / WebAuthn' | 'WireGuard Peer' | 'API Key Token';
  fingerprint: string;
  sourceIp: string;
  edgeGateway: string;
  location: string;
  flag: string;
  loginTime: string;
  lastActivity: string;
  status: 'ACTIVE' | 'FLAGGED' | 'ELEVATED' | 'TERMINATED';
  riskScore: number; // 0 to 100
  threatIndicator?: string;
}

export interface AccessLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  status: 'SUCCESS' | 'DENIED' | 'REVOKED' | 'CHALLENGED';
  ip: string;
  mfaMethod: string;
  riskScore: number;
}

const INITIAL_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-super-01',
    user: 'admin@familytimenet.com',
    role: 'Super Admin',
    sessionType: 'OIDC / WebAuthn',
    fingerprint: 'ed25519:7a:42:f8:b9:1c:3d',
    sourceIp: '103.186.240.15',
    edgeGateway: 'ftn-core-01 (HQ NOC)',
    location: 'Dhaka, Bangladesh',
    flag: '🇧🇩',
    loginTime: '2 hours ago',
    lastActivity: '12s ago',
    status: 'ELEVATED',
    riskScore: 2
  },
  {
    id: 'sess-mtls-fra',
    user: 'ftn-edge-fra-01.mgmt',
    role: 'Edge mTLS Node',
    sessionType: 'mTLS v1.3',
    fingerprint: 'sha256:d8:92:4a:1b:ee:ff',
    sourceIp: '185.122.45.10',
    edgeGateway: 'ftn-edge-fra-01',
    location: 'Frankfurt, Germany',
    flag: '🇩🇪',
    loginTime: '4 days ago',
    lastActivity: '1s ago',
    status: 'ACTIVE',
    riskScore: 0
  },
  {
    id: 'sess-noc-eng-02',
    user: 'tariq.noc@familytimenet.com',
    role: 'NOC Engineer',
    sessionType: 'OIDC / WebAuthn',
    fingerprint: 'ed25519:bc:41:99:a2:33:14',
    sourceIp: '194.26.29.84',
    edgeGateway: 'ftn-edge-lon-01',
    location: 'London, UK',
    flag: '🇬🇧',
    loginTime: '45 mins ago',
    lastActivity: '4m ago',
    status: 'ACTIVE',
    riskScore: 8
  },
  {
    id: 'sess-threat-rogue',
    user: 'ext-vendor-diag@carrier.net',
    role: 'Security Auditor',
    sessionType: 'API Key Token',
    fingerprint: 'rsa4096:55:aa:34:01:9f:7e',
    sourceIp: '45.154.255.89',
    edgeGateway: 'ftn-edge-nyc-02',
    location: 'Secaucus, US',
    flag: '🇺🇸',
    loginTime: '12 mins ago',
    lastActivity: '18s ago',
    status: 'FLAGGED',
    riskScore: 84,
    threatIndicator: 'Unusual bulk BGP route table query from unauthorized ASN'
  },
  {
    id: 'sess-ai-agent-01',
    user: 'ftn-ai-predictive-worker',
    role: 'AI Autonomous Agent',
    sessionType: 'mTLS v1.3',
    fingerprint: 'ed25519:11:ee:44:bb:77:88',
    sourceIp: '10.244.0.52 (Cluster Pod)',
    edgeGateway: 'ftn-k8s-mesh-01',
    location: 'Internal Mesh',
    flag: '🌐',
    loginTime: '14 hours ago',
    lastActivity: 'Sub-second',
    status: 'ACTIVE',
    riskScore: 1
  },
  {
    id: 'sess-mtls-sgp',
    user: 'ftn-edge-sgp-01.mgmt',
    role: 'Edge mTLS Node',
    sessionType: 'mTLS v1.3',
    fingerprint: 'sha256:33:44:ff:88:12:00',
    sourceIp: '139.180.142.66',
    edgeGateway: 'ftn-edge-sgp-01',
    location: 'Singapore',
    flag: '🇸🇬',
    loginTime: '6 days ago',
    lastActivity: '2s ago',
    status: 'ACTIVE',
    riskScore: 0
  }
];

const INITIAL_ACCESS_LOGS: AccessLog[] = [
  {
    id: 'log-01',
    timestamp: '09:42:11 UTC',
    actor: 'admin@familytimenet.com',
    action: 'BGP_PEER_SET',
    resource: '/api/v3/bgp/asn64512/peers',
    status: 'SUCCESS',
    ip: '103.186.240.15',
    mfaMethod: 'FIDO2 Hardware Key',
    riskScore: 2
  },
  {
    id: 'log-02',
    timestamp: '09:41:58 UTC',
    actor: 'ext-vendor-diag@carrier.net',
    action: 'PROMISCUOUS_PROBE',
    resource: '/internal/core-router/flow-dump',
    status: 'DENIED',
    ip: '45.154.255.89',
    mfaMethod: 'None (Bearer Token)',
    riskScore: 84
  },
  {
    id: 'log-03',
    timestamp: '09:39:10 UTC',
    actor: 'ftn-edge-fra-01.mgmt',
    action: 'MTLS_HEARTBEAT',
    resource: '/grpc.health.v1.Health/Check',
    status: 'SUCCESS',
    ip: '185.122.45.10',
    mfaMethod: 'Client Cert (Ed25519)',
    riskScore: 0
  },
  {
    id: 'log-04',
    timestamp: '09:36:24 UTC',
    actor: 'tariq.noc@familytimenet.com',
    action: 'IPAM_ALLOCATE',
    resource: '/api/v2/ipam/subnets/10.140.0.0_22',
    status: 'SUCCESS',
    ip: '194.26.29.84',
    mfaMethod: 'WebAuthn TouchID',
    riskScore: 5
  },
  {
    id: 'log-05',
    timestamp: '09:31:02 UTC',
    actor: 'unknown-origin-bot',
    action: 'SSH_BRUTE_FORCE',
    resource: 'ssh://103.186.240.1:22',
    status: 'REVOKED',
    ip: '198.51.100.77',
    mfaMethod: 'Failed Password',
    riskScore: 98
  }
];

export function FtnIdentityControlCenter({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [sessions, setSessions] = useState<ActiveSession[]>(INITIAL_SESSIONS);
  const [logs, setLogs] = useState<AccessLog[]>(INITIAL_ACCESS_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'sessions' | 'logs'>('sessions');
  const [killingSessionId, setKillingSessionId] = useState<string | null>(null);

  // Stats calculation
  const activeCount = sessions.filter(s => s.status !== 'TERMINATED').length;
  const mtlsCount = sessions.filter(s => s.sessionType === 'mTLS v1.3' && s.status !== 'TERMINATED').length;
  const flaggedCount = sessions.filter(s => s.status === 'FLAGGED').length;

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchesRole = roleFilter === 'ALL' || s.role === roleFilter || (roleFilter === 'FLAGGED' && s.status === 'FLAGGED');
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        s.user.toLowerCase().includes(q) ||
        s.sourceIp.toLowerCase().includes(q) ||
        s.edgeGateway.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.fingerprint.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [sessions, roleFilter, searchQuery]);

  // Kill Session action: Immediate threat response
  const handleKillSession = (session: ActiveSession) => {
    setKillingSessionId(session.id);

    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          type: 'error',
          title: `Broadcasting Kill Command: ${session.user}`,
          message: `Revoking CRL token & pushing iptables drop across 30 edge nodes...`
        }
      })
    );

    setTimeout(() => {
      setSessions(prev =>
        prev.map(s =>
          s.id === session.id
            ? { ...s, status: 'TERMINATED', threatIndicator: 'Terminated by Operator via Identity Control Center' }
            : s
        )
      );

      // Append access log
      const newLog: AccessLog = {
        id: `kill-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString() + ' UTC',
        actor: 'Super Admin',
        action: `SESSION_KILL_ORDER [${session.id}]`,
        resource: session.user,
        status: 'REVOKED',
        ip: session.sourceIp,
        mfaMethod: 'Admin Override',
        riskScore: 100
      };
      setLogs(prev => [newLog, ...prev]);

      setKillingSessionId(null);

      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: {
            type: 'success',
            title: `Session Terminated & Revoked`,
            message: `Ed25519 thumbprint blacklisted in memory. All active sockets dropped in < 45ms.`
          }
        })
      );
    }, 1200);
  };

  // Kill all flagged sessions
  const handleKillAllFlagged = () => {
    const flagged = sessions.filter(s => s.status === 'FLAGGED');
    if (flagged.length === 0) return;

    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          type: 'error',
          title: `Emergency Sweep: Terminating ${flagged.length} Flagged Sessions`,
          message: 'Pushed global BGP flowspec and CRL revocation across all edge POPs.'
        }
      })
    );

    setSessions(prev =>
      prev.map(s =>
        s.status === 'FLAGGED'
          ? { ...s, status: 'TERMINATED', threatIndicator: 'Terminated during Emergency Sweep' }
          : s
      )
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#091122] via-[#0b1730] to-[#080e1c] border border-gray-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-red-500 flex items-center justify-center text-gray-950 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                <ShieldAlert className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight flex items-center gap-3">
                  FTN IDENTITY &amp; ACCESS CONTROL CENTER
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono border border-red-500/40">
                    Real-Time ZeroTrust
                  </span>
                </h1>
                <p className="text-gray-300 font-mono text-xs lg:text-sm">
                  Unified control plane for active mTLS 1.3 handshakes, IAM sessions, and user access telemetry with instant edge-wide session termination.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 bg-gray-950/80 border border-gray-800 rounded-2xl p-4">
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Active Sessions</span>
              <span className="text-2xl font-black text-[#00f0ff] font-mono">{activeCount}</span>
            </div>
            <div className="h-10 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">mTLS Handshakes</span>
              <span className="text-2xl font-black text-[#00ff66] font-mono">{mtlsCount}</span>
            </div>
            <div className="h-10 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Flagged Threats</span>
              <span className={cn("text-2xl font-black font-mono", flaggedCount > 0 ? "text-red-400 animate-pulse" : "text-gray-400")}>
                {flaggedCount}
              </span>
            </div>
            <div className="h-10 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Revocation Latency</span>
              <span className="text-2xl font-black text-amber-400 font-mono">&lt;45ms</span>
            </div>
          </div>
        </div>

        {/* Global Controls & Emergency Sweep */}
        <div className="mt-6 pt-6 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('sessions')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border",
                activeTab === 'sessions'
                  ? "bg-[#00f0ff]/20 border-[#00f0ff]/60 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
              )}
            >
              <Users className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>Active Sessions ({sessions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border",
                activeTab === 'logs'
                  ? "bg-[#00f0ff]/20 border-[#00f0ff]/60 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white"
              )}
            >
              <Activity className="w-3.5 h-3.5 text-[#00ff66]" />
              <span>Access &amp; Audit Logs ({logs.length})</span>
            </button>
          </div>

          {flaggedCount > 0 && (
            <button
              onClick={handleKillAllFlagged}
              className="px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/50 text-xs font-mono font-bold flex items-center gap-2 transition-all animate-pulse"
            >
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span>Emergency: Kill All {flaggedCount} Flagged Threat Sessions</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'sessions' ? (
        <div className="space-y-4">
          {/* Filters and Search Bar */}
          <div className="bg-[#080e1c] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search user, IP, gateway, fingerprint..."
                className="w-full bg-gray-950/80 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {['ALL', 'Super Admin', 'NOC Engineer', 'Edge mTLS Node', 'AI Autonomous Agent', 'FLAGGED'].map(rf => (
                <button
                  key={rf}
                  onClick={() => setRoleFilter(rf)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border",
                    roleFilter === rf
                      ? "bg-white/10 text-white border-[#00f0ff]"
                      : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white",
                    rf === 'FLAGGED' && "text-red-400 border-red-500/40"
                  )}
                >
                  {rf}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions Table / Cards */}
          <div className="space-y-3">
            {filteredSessions.map(session => {
              const isTerminated = session.status === 'TERMINATED';
              const isFlagged = session.status === 'FLAGGED';
              const isBusy = killingSessionId === session.id;

              return (
                <div
                  key={session.id}
                  className={cn(
                    "p-5 rounded-2xl border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative overflow-hidden",
                    isTerminated
                      ? "bg-gray-950/50 border-gray-900 opacity-60"
                      : isFlagged
                      ? "bg-red-950/20 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)] ring-1 ring-red-500/20"
                      : "bg-[#080e1c] border-gray-800 hover:border-gray-700"
                  )}
                >
                  {/* Left: User details and badges */}
                  <div className="space-y-2 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-white font-display flex items-center gap-2">
                        <span>{session.flag}</span>
                        <span>{session.user}</span>
                      </span>

                      <span
                        className={cn(
                          "text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase border",
                          session.role === 'Super Admin' ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                          session.role === 'Edge mTLS Node' ? "bg-cyan-500/10 text-[#00f0ff] border-cyan-500/30" :
                          session.role === 'AI Autonomous Agent' ? "bg-purple-500/10 text-purple-400 border-purple-500/30" :
                          "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        )}
                      >
                        {session.role}
                      </span>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-300">
                        {session.sessionType}
                      </span>

                      <span
                        className={cn(
                          "text-[10px] font-mono px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border",
                          session.status === 'ACTIVE' ? "bg-emerald-500/10 text-[#00ff66] border-emerald-500/30" :
                          session.status === 'ELEVATED' ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                          session.status === 'FLAGGED' ? "bg-red-500/20 text-red-400 border-red-500/50 animate-pulse" :
                          "bg-gray-800 text-gray-500 border-gray-700"
                        )}
                      >
                        <span className={cn("w-1.5 h-1.5 rounded-full", isTerminated ? "bg-gray-500" : isFlagged ? "bg-red-500" : "bg-[#00ff66]")} />
                        {session.status}
                      </span>
                    </div>

                    {/* Metadata strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-gray-400">
                      <div>
                        <span className="text-gray-500 block">Source IP:</span>
                        <span className="text-white">{session.sourceIp}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Gateway:</span>
                        <span className="text-cyan-400">{session.edgeGateway}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Location:</span>
                        <span className="text-gray-300">{session.location}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">Last Active:</span>
                        <span className="text-[#00ff66]">{session.lastActivity}</span>
                      </div>
                    </div>

                    {/* Fingerprint key hash */}
                    <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400 bg-black/60 px-3 py-1.5 rounded-lg border border-gray-800/80">
                      <Fingerprint className="w-3.5 h-3.5 text-[#00f0ff] flex-shrink-0" />
                      <span className="text-gray-500">Thumbprint:</span>
                      <span className="text-gray-300 truncate">{session.fingerprint}</span>
                    </div>

                    {session.threatIndicator && (
                      <p className="text-xs font-mono text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-500/30 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{session.threatIndicator}</span>
                      </p>
                    )}
                  </div>

                  {/* Right: Risk score & Kill session trigger */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-gray-800/80">
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-gray-500 block uppercase">Threat Risk</span>
                      <span
                        className={cn(
                          "text-lg font-black font-mono",
                          session.riskScore > 50 ? "text-red-400" :
                          session.riskScore > 20 ? "text-amber-400" :
                          "text-[#00ff66]"
                        )}
                      >
                        {session.riskScore} / 100
                      </span>
                    </div>

                    {/* KILL SESSION ACTION BUTTON (Requested feature) */}
                    <button
                      onClick={() => handleKillSession(session)}
                      disabled={isTerminated || isBusy}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md",
                        isTerminated
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700"
                          : isBusy
                          ? "bg-red-500/30 text-red-200 border border-red-500/50 animate-pulse"
                          : "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
                      )}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isTerminated ? 'Session Revoked' : isBusy ? 'Broadcasting Kill...' : 'Kill Session'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Access & Audit Logs View */
        <div className="bg-[#080e1c] border border-gray-800 rounded-3xl p-6 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00ff66]" />
              CHRONOLOGICAL USER &amp; EDGE ACCESS AUDIT LOGS
            </h3>
            <span className="text-[11px] text-gray-500">Real-Time Ingestion (ZeroTrust Engine)</span>
          </div>

          <div className="space-y-2">
            {logs.map(log => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-black/60 border border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{log.timestamp}</span>
                    <span className="text-white font-bold">{log.actor}</span>
                    <span className="text-[#00f0ff]">&rarr; {log.action}</span>
                    <span
                      className={cn(
                        "px-2 py-0.2 rounded text-[9px] font-bold uppercase",
                        log.status === 'SUCCESS' ? "bg-emerald-500/20 text-[#00ff66]" :
                        log.status === 'DENIED' ? "bg-amber-500/20 text-amber-400" :
                        "bg-red-500/20 text-red-400"
                      )}
                    >
                      {log.status}
                    </span>
                  </div>
                  <div className="text-gray-400">
                    Target: <code className="text-gray-300">{log.resource}</code> &bull; Source: {log.ip} &bull; Auth: {log.mfaMethod}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={cn("text-xs font-bold font-mono", log.riskScore > 50 ? "text-red-400" : "text-emerald-400")}>
                    Risk {log.riskScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
