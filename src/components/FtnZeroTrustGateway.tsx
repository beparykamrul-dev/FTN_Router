import React, { useState, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  Unlock,
  Smartphone,
  Laptop,
  Server,
  UserCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Search,
  Fingerprint,
  Cpu,
  Globe,
  Sliders,
  Radio,
  FileCode,
  Layers,
  ArrowRight,
  ExternalLink,
  Ban
} from 'lucide-react';
import { cn } from '../utils';

export interface ZeroTrustSession {
  id: string;
  user: string;
  email: string;
  role: 'Mesh SuperAdmin' | 'NOC Engineer' | 'SecOps Auditor' | 'Family Member' | 'Edge Gateway Agent';
  device: string;
  deviceType: 'desktop' | 'mobile' | 'server';
  os: string;
  ipAddress: string;
  meshTunnelIp: string;
  tunnelType: 'AmneziaWG Obfuscated' | 'WireGuard mTLS' | 'Tailscale Disco' | 'Hysteria2 QUIC';
  mTLSCertExpiry: string;
  postureScore: number; // 0 - 100
  tpmAttestation: boolean;
  status: 'authenticated' | 'quarantined' | 'evaluating' | 'revoked';
  allowedEndpoints: string[];
  lastHandshake: string;
  bytesTransferred: string;
}

const INITIAL_SESSIONS: ZeroTrustSession[] = [
  {
    id: 'zt-sess-101',
    user: 'Kamrul Hasan (SysAdmin)',
    email: 'kamrul@familytimenet.com',
    role: 'Mesh SuperAdmin',
    device: 'ThinkPad X1 Carbon Gen 11',
    deviceType: 'desktop',
    os: 'Fedora Silverblue Linux 40 (Secure Boot + TPM 2.0)',
    ipAddress: '119.148.33.21',
    meshTunnelIp: '10.14.0.10',
    tunnelType: 'AmneziaWG Obfuscated',
    mTLSCertExpiry: '2026-12-31 (118d left)',
    postureScore: 98,
    tpmAttestation: true,
    status: 'authenticated',
    allowedEndpoints: ['k8s-api.cluster.ftn:6443', 'vault.internal:8200', 'vyos-fra-01:22', 'pgbouncer:6432'],
    lastHandshake: '4s ago',
    bytesTransferred: '4.8 GB'
  },
  {
    id: 'zt-sess-102',
    user: 'Amina Akter (Home Network)',
    email: 'amina@familytimenet.com',
    role: 'Family Member',
    device: 'iPhone 15 Pro Max',
    deviceType: 'mobile',
    os: 'iOS 18.3.1 (FaceID Enforced)',
    ipAddress: '103.145.118.84',
    meshTunnelIp: '10.14.0.18',
    tunnelType: 'WireGuard mTLS',
    mTLSCertExpiry: '2027-01-15 (133d left)',
    postureScore: 95,
    tpmAttestation: true,
    status: 'authenticated',
    allowedEndpoints: ['jellyfin.home.ftn:8096', 'nextcloud.ftn:443', 'adguard-dns.ftn:53'],
    lastHandshake: '18s ago',
    bytesTransferred: '1.2 GB'
  },
  {
    id: 'zt-sess-103',
    user: 'NOC Edge Relay Robot',
    email: 'service-account-noc@ftn.internal',
    role: 'Edge Gateway Agent',
    device: 'VyOS Edge Carrier Node',
    deviceType: 'server',
    os: 'VyOS 1.5-rolling-epoll (eBPF Kernel 6.6)',
    ipAddress: '194.26.29.11',
    meshTunnelIp: '10.14.0.2',
    tunnelType: 'AmneziaWG Obfuscated',
    mTLSCertExpiry: '2026-10-01 (27d left)',
    postureScore: 100,
    tpmAttestation: true,
    status: 'authenticated',
    allowedEndpoints: ['bgp-peering.mesh:179', 'telemetry-collector:4317', 'prometheus:9090'],
    lastHandshake: '2s ago',
    bytesTransferred: '18.4 GB'
  },
  {
    id: 'zt-sess-104',
    user: 'DevOps Sandbox Runner',
    email: 'runner-sg-runner-03@ci.ftn',
    role: 'NOC Engineer',
    device: 'Ubuntu Cloud VM (GCP SG)',
    deviceType: 'server',
    os: 'Ubuntu 24.04 LTS (Outdated OpenSSL build)',
    ipAddress: '34.87.112.50',
    meshTunnelIp: '10.14.0.44',
    tunnelType: 'Hysteria2 QUIC',
    mTLSCertExpiry: '2026-09-12 (8d left)',
    postureScore: 68,
    tpmAttestation: false,
    status: 'quarantined',
    allowedEndpoints: ['gitlab-runner.internal:443'],
    lastHandshake: '2m ago',
    bytesTransferred: '320 MB'
  }
];

export function FtnZeroTrustGateway() {
  const [sessions, setSessions] = useState<ZeroTrustSession[]>(INITIAL_SESSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedSession, setSelectedSession] = useState<ZeroTrustSession | null>(sessions[0]);
  const [isSimulatingPosture, setIsSimulatingPosture] = useState(false);

  const filteredSessions = useMemo(() => {
    return sessions.filter(s => {
      const matchQuery = searchQuery === '' || 
        s.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.meshTunnelIp.includes(searchQuery) ||
        s.device.toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'all' || s.role === roleFilter;
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchQuery && matchRole && matchStatus;
    });
  }, [sessions, searchQuery, roleFilter, statusFilter]);

  const handleRevokeSession = (sessionId: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === sessionId) {
        return { ...s, status: 'revoked', allowedEndpoints: [] };
      }
      return s;
    }));

    if (selectedSession?.id === sessionId) {
      setSelectedSession(prev => prev ? { ...prev, status: 'revoked', allowedEndpoints: [] } : null);
    }

    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'warning',
        title: 'Zero Trust Session Revoked',
        message: `CRL updated and WireGuard ephemeral public key cleared for ${sessionId}.`
      }
    }));
  };

  const handleReEvaluatePosture = (sessionId: string) => {
    setIsSimulatingPosture(true);
    setTimeout(() => {
      setSessions(prev => prev.map(s => {
        if (s.id === sessionId) {
          const newScore = Math.min(100, Math.floor(85 + Math.random() * 15));
          return {
            ...s,
            postureScore: newScore,
            status: newScore >= 80 ? 'authenticated' : 'quarantined',
            lastHandshake: 'Just now'
          };
        }
        return s;
      }));
      setIsSimulatingPosture(false);

      window.dispatchEvent(new CustomEvent('add-toast', {
        detail: {
          type: 'success',
          title: 'Device Posture Attested',
          message: 'Hardware TPM 2.0 PCR registers and mTLS certificate verified.'
        }
      }));
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gray-900/60 p-6 rounded-2xl border border-gray-800 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-[#00f0ff]/20 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <ShieldCheck className="w-6 h-6 text-[#00f0ff]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                FTN Zero Trust Network Access (ZTNA) Gateway
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                  mTLS + TPM 2.0 Attestation
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                Continuous device posture verification, ephemeral WireGuard key negotiation &amp; identity-aware edge policy enforcement
              </p>
            </div>
          </div>
        </div>

        {/* Global Security Metrics */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-xl bg-gray-800/80 border border-gray-700/80 text-xs font-mono text-gray-300 flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-[#00ff66]" />
            <span>IAP Auth Engine: <strong>ENFORCING</strong></span>
          </div>
          <button
            onClick={() => {
              if (selectedSession) handleReEvaluatePosture(selectedSession.id);
            }}
            disabled={isSimulatingPosture}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isSimulatingPosture && "animate-spin")} />
            Attest Active Postures
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Active Enforced Sessions</span>
            <Lock className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#00f0ff]">
            {sessions.filter(s => s.status === 'authenticated').length} / {sessions.length}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono">100% End-to-End Encrypted</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">TPM 2.0 Attested</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-400">
            {sessions.filter(s => s.tpmAttestation).length} Devices
          </div>
          <span className="text-[11px] text-gray-400 font-mono">Hardware PCR validation</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Quarantined Sessions</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400">
            {sessions.filter(s => s.status === 'quarantined').length} Isolated
          </div>
          <span className="text-[11px] text-amber-400 font-mono">Restricted micro-segment</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Avg Posture Rating</span>
            <Activity className="w-4 h-4 text-[#00ff66]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#00ff66]">
            {Math.round(sessions.reduce((acc, curr) => acc + curr.postureScore, 0) / sessions.length)}%
          </div>
          <span className="text-[11px] text-gray-400 font-mono">Policy compliance threshold: 80%</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Session Roster */}
        <div className="lg:col-span-7 glass-panel p-5 rounded-2xl border border-gray-800 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by user, email, mesh IP, device..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900/80 border border-gray-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-[#00f0ff] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:border-[#00f0ff] focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="authenticated">Authenticated</option>
                <option value="quarantined">Quarantined</option>
                <option value="revoked">Revoked</option>
              </select>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-gray-900 border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:border-[#00f0ff] focus:outline-none"
              >
                <option value="all">All Roles</option>
                <option value="Mesh SuperAdmin">Mesh SuperAdmin</option>
                <option value="NOC Engineer">NOC Engineer</option>
                <option value="Family Member">Family Member</option>
                <option value="Edge Gateway Agent">Edge Gateway Agent</option>
              </select>
            </div>
          </div>

          {/* Session Cards List */}
          <div className="space-y-3">
            {filteredSessions.map((session) => {
              const isSelected = selectedSession?.id === session.id;
              return (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={cn(
                    "p-4 rounded-xl border transition-all cursor-pointer",
                    isSelected
                      ? "bg-indigo-950/30 border-indigo-500/60 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                      : "bg-gray-900/60 border-gray-800/80 hover:bg-gray-800/40 hover:border-gray-700"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg border",
                        session.status === 'authenticated' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                        session.status === 'quarantined' ? "bg-amber-500/10 border-amber-500/30 text-amber-400" :
                        "bg-red-500/10 border-red-500/30 text-red-400"
                      )}>
                        {session.deviceType === 'desktop' ? <Laptop className="w-4 h-4" /> :
                         session.deviceType === 'mobile' ? <Smartphone className="w-4 h-4" /> :
                         <Server className="w-4 h-4" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{session.user}</span>
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-medium bg-gray-800 text-gray-300 border border-gray-700">
                            {session.role}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">
                          {session.device} • {session.meshTunnelIp}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className={cn(
                          "w-2 h-2 rounded-full",
                          session.status === 'authenticated' ? "bg-[#00ff66] animate-pulse" :
                          session.status === 'quarantined' ? "bg-amber-400" : "bg-red-500"
                        )} />
                        <span className="text-xs font-mono font-bold capitalize text-white">
                          {session.status}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-gray-400 mt-1">
                        Posture: <strong className={session.postureScore >= 80 ? "text-[#00ff66]" : "text-amber-400"}>{session.postureScore}/100</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Key className="w-3 h-3 text-[#00f0ff]" />
                      {session.tunnelType}
                    </span>
                    <span>Handshake: {session.lastHandshake}</span>
                    <span className="text-gray-300 font-semibold">{session.bytesTransferred}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Session Inspector & Policy Engine */}
        <div className="lg:col-span-5 space-y-6">
          {selectedSession ? (
            <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-5">
              <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-[#00f0ff]" />
                    Session Security Diagnostics
                  </h3>
                  <p className="text-xs text-gray-400 font-mono">{selectedSession.id}</p>
                </div>

                {selectedSession.status !== 'revoked' ? (
                  <button
                    onClick={() => handleRevokeSession(selectedSession.id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Ban className="w-3 h-3" />
                    Revoke Tunnel
                  </button>
                ) : (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                    ACCESS REVOKED
                  </span>
                )}
              </div>

              {/* Hardware Posture Checklist */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">Device Trust Vectors</span>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-purple-400" />
                      <span className="text-gray-300">TPM 2.0 Hardware Root of Trust</span>
                    </div>
                    {selectedSession.tpmAttestation ? (
                      <span className="flex items-center gap-1 text-[#00ff66] font-bold text-[11px]">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-400 font-bold text-[11px]">
                        <AlertTriangle className="w-3 h-3" /> BYPASSED
                      </span>
                    )}
                  </div>

                  <div className="p-2.5 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-[#00f0ff]" />
                      <span className="text-gray-300">Client mTLS Certificate</span>
                    </div>
                    <span className="text-gray-400 text-[11px]">{selectedSession.mTLSCertExpiry}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-gray-900/80 border border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-gray-300">OS Patch / Kernel Integrity</span>
                    </div>
                    <span className="text-gray-400 text-[11px] truncate max-w-[150px]">{selectedSession.os}</span>
                  </div>
                </div>
              </div>

              {/* Authorized Least-Privilege Micro-Routes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Authorized Mesh Endpoints ({selectedSession.allowedEndpoints.length})
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Dynamic ACL</span>
                </div>

                {selectedSession.allowedEndpoints.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedSession.allowedEndpoints.map(endpoint => (
                      <div key={endpoint} className="px-3 py-2 rounded-lg bg-gray-900/70 border border-gray-800 text-xs font-mono flex items-center justify-between">
                        <span className="text-[#00f0ff]">{endpoint}</span>
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-[#00ff66] text-[10px] border border-emerald-500/20">
                          PERMIT
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono text-center">
                    All routes dropped by Zero Trust IAP. No active permissions.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => handleReEvaluatePosture(selectedSession.id)}
                  disabled={isSimulatingPosture || selectedSession.status === 'revoked'}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-200 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isSimulatingPosture && "animate-spin")} />
                  Re-Attest Device
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl border border-gray-800 text-center text-gray-500 text-xs font-mono">
              Select a session from the roster to inspect Zero Trust compliance attributes.
            </div>
          )}

          {/* Zero Trust Architecture Spec Card */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
            <h4 className="text-xs font-bold text-indigo-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5" />
              FTN BeyondCorp Zero Trust Architecture
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Every request across the WireGuard / AmneziaWG overlay mesh is evaluated dynamically against context: caller identity, device posture, hardware TPM PCR integrity, and network locality. Access is never assumed based on IP perimeter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
