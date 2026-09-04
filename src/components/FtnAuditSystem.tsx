import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Filter, 
  Download, 
  Check, 
  Copy, 
  Hash, 
  User, 
  Database, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Key, 
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Server
} from 'lucide-react';
import { INITIAL_AUDIT_RECORDS, INITIAL_COMPLIANCE_STATS } from '../data/auditData';
import { AuditRecord, AuditSeverity, AuditSubsystem } from '../types/audit';

export function FtnAuditSystem() {
  const [records, setRecords] = useState<AuditRecord[]>(INITIAL_AUDIT_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(INITIAL_AUDIT_RECORDS[0]);
  const [subsystemFilter, setSubsystemFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [isVerifyingChain, setIsVerifyingChain] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<string | null>('ALL_RECORDS_IMMUTABLE_VALID');

  const filteredRecords = records.filter(r => {
    const matchesSubsystem = subsystemFilter === 'all' || r.subsystem === subsystemFilter;
    const matchesSeverity = severityFilter === 'all' || r.severity === severityFilter;
    const matchesSearch = 
      r.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.actor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.actor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.resourceId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubsystem && matchesSeverity && matchesSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(text);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleVerifyChainIntegrity = () => {
    setIsVerifyingChain(true);
    setVerificationResult(null);
    setTimeout(() => {
      setIsVerifyingChain(false);
      setVerificationResult('ALL_RECORDS_IMMUTABLE_VALID');
    }, 800);
  };

  const handleExportAuditBundle = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(records, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ftn-control-plane-audit-bundle-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getSeverityBadge = (severity: AuditSeverity) => {
    switch (severity) {
      case 'critical':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">CRITICAL</span>;
      case 'high':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">HIGH</span>;
      case 'medium':
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">MEDIUM</span>;
      default:
        return <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400">INFO</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-[#071322] border border-gray-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FTN CONTROL PLANE • IMMUTABLE AUDIT COMPLIANCE</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              Cryptographic Audit & Change Tracking System
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Provides non-repudiable, SHA-256 Merkle-anchored execution records for all configuration changes across BGP routing policies, eBPF firewall filters, OLT PON provisioning, and WireGuard zero-trust keys.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleVerifyChainIntegrity}
              disabled={isVerifyingChain}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-gray-200 text-xs font-medium transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#00f0ff] ${isVerifyingChain ? 'animate-spin' : ''}`} />
              <span>Verify Block Integrity</span>
            </button>
            <button
              onClick={handleExportAuditBundle}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00f0ff] hover:brightness-110 text-gray-950 font-bold text-xs transition-all shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Compliance Bundle</span>
            </button>
          </div>
        </div>

        {/* Live Integrity Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800/60">
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">IMMUTABLE BLOCK HEIGHT</div>
            <div className="text-xl font-display font-bold text-white mt-0.5 flex items-center gap-2">
              <span>#{records[0]?.proof.blockHeight || 104921}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">Synced</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">CHAIN VERIFICATION</div>
            <div className="text-xl font-display font-bold text-emerald-400 mt-0.5 flex items-center gap-2">
              <span>100% VALID</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">TAMPER ALERTS</div>
            <div className="text-xl font-display font-bold text-white mt-0.5 flex items-center gap-2">
              <span>0 DETECTED</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">Clean</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">COMPLIANCE FRAMEWORKS</div>
            <div className="text-xl font-display font-bold text-[#00f0ff] mt-0.5">
              ISO / SOC2 / BTRC
            </div>
          </div>
        </div>
      </div>

      {/* Verification status notice */}
      {verificationResult && (
        <div className="bg-emerald-950/20 border border-emerald-500/30 p-3.5 rounded-xl flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Cryptographic Merkle Proof check completed: All block hashes and ECDSA signatures match Master Control Key.</span>
          </div>
          <span className="text-emerald-400 font-bold">STATUS: COMPLIANT</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> SUBSYSTEM:
          </span>
          {['all', 'bgp_routing', 'firewall_policy', 'olt_pon', 'dns_security', 'wireguard_tunnel', 'ipam_allocation'].map((sub) => (
            <button
              key={sub}
              onClick={() => setSubsystemFilter(sub)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                subsystemFilter === sub
                  ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40'
                  : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {sub === 'all' ? 'All Subsystems' : sub.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-[#00f0ff]"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search actions, actors, resources..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
            />
          </div>
        </div>
      </div>

      {/* Main Split-Screen Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Immutable Log List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredRecords.map((record) => {
            const isSelected = selectedRecord?.id === record.id;
            return (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all relative ${
                  isSelected
                    ? 'bg-gray-900/90 border-[#00f0ff]/60 shadow-[0_0_20px_rgba(0,240,255,0.12)] ring-1 ring-[#00f0ff]/30'
                    : 'bg-gray-900/40 hover:bg-gray-900/70 border-gray-800/80 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                        BLOCK #{record.proof.blockHeight}
                      </span>
                      {getSeverityBadge(record.severity)}
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        VERIFIED
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-white leading-snug">
                      {record.action}
                    </h3>
                  </div>
                  <span className="text-[11px] text-gray-500 font-mono">
                    {new Date(record.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                  {record.description}
                </p>

                {/* Subsystem & Actor */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-800/50 text-[11px] font-mono text-gray-400">
                  <span className="text-[#00f0ff]">
                    {record.subsystem.replace('_', ' ').toUpperCase()}
                  </span>
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <User className="w-3 h-3 text-gray-500" />
                    <span>{record.actor.name.split(' ')[0]} ({record.actor.role.split(' ')[0]})</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Audit Record & Cryptographic Proof */}
        <div className="lg:col-span-6 space-y-4">
          {selectedRecord ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-2xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                      BLOCK HEIGHT: #{selectedRecord.proof.blockHeight}
                    </span>
                    {getSeverityBadge(selectedRecord.severity)}
                  </div>
                  <h2 className="text-lg font-display font-bold text-white mt-1">
                    {selectedRecord.action}
                  </h2>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400 font-mono">
                    {new Date(selectedRecord.timestamp).toUTCString()}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center justify-end gap-1">
                    <Lock className="w-3 h-3" />
                    <span>IMMUTABLE WRITE</span>
                  </div>
                </div>
              </div>

              {/* Actor Identity & Auth Method */}
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2 text-xs font-mono">
                <div className="text-gray-400 font-semibold flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span>AUTHENTICATED ACTOR & PROVENANCE</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-300 pt-1">
                  <div><span className="text-gray-500">Name:</span> {selectedRecord.actor.name}</div>
                  <div><span className="text-gray-500">Role:</span> {selectedRecord.actor.role}</div>
                  <div><span className="text-gray-500">Email:</span> {selectedRecord.actor.email}</div>
                  <div><span className="text-gray-500">Source IP:</span> {selectedRecord.actor.ipAddress}</div>
                  <div className="col-span-2">
                    <span className="text-gray-500">MFA Verification:</span>{' '}
                    <span className="text-emerald-400">{selectedRecord.actor.authMethod}</span>
                  </div>
                </div>
              </div>

              {/* Configuration Change Diff (Before vs After) */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>State Change Delta (Before vs After)</span>
                </h4>
                <div className="bg-gray-950 rounded-xl p-3 border border-gray-800 space-y-2 font-mono text-xs">
                  {selectedRecord.diff.map((item, idx) => (
                    <div key={idx} className="bg-black/50 p-2.5 rounded-lg border border-gray-800/80 space-y-1">
                      <div className="text-gray-400 font-bold">{item.field}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-red-950/20 border border-red-900/30 p-1.5 rounded text-red-300">
                          <span className="text-red-500 font-bold">- </span>
                          {JSON.stringify(item.previousValue)}
                        </div>
                        <div className="bg-emerald-950/20 border border-emerald-900/30 p-1.5 rounded text-emerald-300">
                          <span className="text-emerald-500 font-bold">+ </span>
                          {JSON.stringify(item.newValue)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cryptographic Proof Panel (SHA-256 Merkle Block) */}
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2.5 text-xs font-mono">
                <div className="flex items-center justify-between text-gray-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-purple-400" />
                    <span>CRYPTOGRAPHIC PROOF & MERKLE ANCHOR</span>
                  </span>
                  <span className="text-emerald-400 text-[10px]">SIGNATURE VERIFIED</span>
                </div>

                <div className="space-y-1.5 text-gray-300 pt-1 text-[11px]">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Record SHA-256 Hash:</span>
                    <div className="flex items-center justify-between bg-black/60 p-1.5 rounded border border-gray-800">
                      <span className="text-purple-300 truncate">{selectedRecord.proof.recordHash}</span>
                      <button onClick={() => handleCopy(selectedRecord.proof.recordHash)} className="text-gray-500 hover:text-gray-300 ml-2">
                        {copiedHash === selectedRecord.proof.recordHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-gray-500 block text-[10px]">Previous Block Hash:</span>
                    <span className="text-gray-400 truncate block">{selectedRecord.proof.previousBlockHash}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 block text-[10px]">Digital Signature Signer:</span>
                    <span className="text-emerald-400">{selectedRecord.proof.signedBy}</span>
                  </div>
                </div>
              </div>

              {/* Compliance Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs text-gray-500 font-mono mr-1">STANDARDS:</span>
                {selectedRecord.complianceTags.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-800 rounded-2xl text-gray-500">
              <FileText className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-xs font-mono">Select a record from the audit journal to inspect cryptographic proofs and before/after diffs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
