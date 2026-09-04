import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  FileCheck2, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Globe, 
  Plus, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Search, 
  Filter, 
  ShieldAlert, 
  Cpu, 
  CheckCircle,
  ExternalLink,
  ChevronDown,
  Layers,
  TerminalSquare
} from 'lucide-react';
import { cn } from '../utils';

export interface ManagedCertificate {
  id: string;
  domain: string;
  sans: string[];
  issuer: "Let's Encrypt (R3)" | "ZeroSSL ACME" | "FTN Sovereign Private CA v4" | "Akamai Edge PKI";
  caType: 'public_acme' | 'private_ca';
  algorithm: 'ECDSA P-384' | 'ECDSA P-256' | 'RSA 4096' | 'Post-Quantum ML-KEM-768';
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  status: 'active' | 'expiring_soon' | 'renewing' | 'expired';
  autoRenew: boolean;
  ocspStapling: boolean;
  ctLogVerified: boolean;
  tlsVersion: 'TLS 1.3 Strict' | 'TLS 1.3 / 1.2 Dual';
  serialNumber: string;
  sha256Fingerprint: string;
  assignedEndpoints: string[];
}

const INITIAL_CERTIFICATES: ManagedCertificate[] = [
  {
    id: 'cert-ftn-01',
    domain: 'api.familytimenet.com',
    sans: ['*.familytimenet.com', 'familytimenet.com', 'auth.familytimenet.com'],
    issuer: "Let's Encrypt (R3)",
    caType: 'public_acme',
    algorithm: 'ECDSA P-384',
    validFrom: '2026-07-01',
    validTo: '2026-09-29',
    daysRemaining: 25,
    status: 'active',
    autoRenew: true,
    ocspStapling: true,
    ctLogVerified: true,
    tlsVersion: 'TLS 1.3 Strict',
    serialNumber: '04:A9:E2:B7:61:99:43:08:C1',
    sha256Fingerprint: '9B:4F:72:11:8A:CE:30:19:D4:55:62:EE:90:21:BB:04:77:1A:83:29',
    assignedEndpoints: ['edge-sin-01.ftn.mesh:443', 'edge-lax-01.ftn.mesh:443']
  },
  {
    id: 'cert-ftn-02',
    domain: 'remote-vpn.local.ftn',
    sans: ['vpn-gw.ftn.mesh', 'bastion.ftn.mesh'],
    issuer: "Let's Encrypt (R3)",
    caType: 'public_acme',
    algorithm: 'RSA 4096',
    validFrom: '2026-06-15',
    validTo: '2026-09-14',
    daysRemaining: 10,
    status: 'expiring_soon',
    autoRenew: true,
    ocspStapling: true,
    ctLogVerified: true,
    tlsVersion: 'TLS 1.3 Strict',
    serialNumber: '09:88:2F:10:9C:AA:41:88:12',
    sha256Fingerprint: '41:9B:AA:88:F2:10:66:99:32:14:77:E1:98:C0:11:22:98:40:99:12',
    assignedEndpoints: ['vpn-fra-01.ftn.mesh:443', 'bastion-sin-01:443']
  },
  {
    id: 'cert-ftn-03',
    domain: 'core-router-bgp.mesh.ftn',
    sans: ['*.core.mesh.ftn', 'bgp-peer-01.mesh.ftn', 'bgp-peer-02.mesh.ftn'],
    issuer: "FTN Sovereign Private CA v4",
    caType: 'private_ca',
    algorithm: 'Post-Quantum ML-KEM-768',
    validFrom: '2026-01-01',
    validTo: '2027-01-01',
    daysRemaining: 119,
    status: 'active',
    autoRenew: true,
    ocspStapling: false,
    ctLogVerified: false,
    tlsVersion: 'TLS 1.3 Strict',
    serialNumber: '77:01:99:EE:44:12:00:81:AB',
    sha256Fingerprint: 'C2:90:11:AA:BB:44:88:99:11:77:22:33:44:55:66:77:88:99:00:11',
    assignedEndpoints: ['bgp-as64512-core:179', 'frr-daemon:8443']
  },
  {
    id: 'cert-ftn-04',
    domain: 'vault.familytimenet.com',
    sans: ['vault-api.familytimenet.com', 'kopia-sync.familytimenet.com'],
    issuer: "ZeroSSL ACME",
    caType: 'public_acme',
    algorithm: 'ECDSA P-384',
    validFrom: '2026-07-20',
    validTo: '2026-10-18',
    daysRemaining: 44,
    status: 'active',
    autoRenew: true,
    ocspStapling: true,
    ctLogVerified: true,
    tlsVersion: 'TLS 1.3 Strict',
    serialNumber: '33:88:14:BB:71:02:99:10:FA',
    sha256Fingerprint: 'AA:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33',
    assignedEndpoints: ['vault-fra-01:8200', 'kopia-repo-01:5151']
  },
  {
    id: 'cert-ftn-05',
    domain: 'pgbouncer-mTLS.internal.ftn',
    sans: ['db-primary.internal.ftn', 'db-replica.internal.ftn'],
    issuer: "FTN Sovereign Private CA v4",
    caType: 'private_ca',
    algorithm: 'ECDSA P-256',
    validFrom: '2026-05-10',
    validTo: '2026-09-08',
    daysRemaining: 4,
    status: 'expiring_soon',
    autoRenew: false,
    ocspStapling: false,
    ctLogVerified: false,
    tlsVersion: 'TLS 1.3 Strict',
    serialNumber: 'EE:09:12:34:56:78:90:AB:CD',
    sha256Fingerprint: '11:22:33:44:55:66:77:88:99:00:AA:BB:CC:DD:EE:FF:11:22:33:44',
    assignedEndpoints: ['pgbouncer-service:6432', 'cockroach-node-01:26257']
  },
  {
    id: 'cert-ftn-06',
    domain: 'cdn-edge.global.ftndns.com',
    sans: ['*.cdn-edge.global.ftndns.com'],
    issuer: "Akamai Edge PKI",
    caType: 'public_acme',
    algorithm: 'ECDSA P-384',
    validFrom: '2026-03-01',
    validTo: '2027-03-01',
    daysRemaining: 178,
    status: 'active',
    autoRenew: true,
    ocspStapling: true,
    ctLogVerified: true,
    tlsVersion: 'TLS 1.3 / 1.2 Dual',
    serialNumber: 'FF:AA:00:11:22:33:44:55:66',
    sha256Fingerprint: '77:88:99:00:11:22:33:44:55:66:77:88:99:00:AA:BB:CC:DD:EE:FF',
    assignedEndpoints: ['anycast-ingress:443']
  }
];

export function FtnPkiManager() {
  const [certificates, setCertificates] = useState<ManagedCertificate[]>(INITIAL_CERTIFICATES);
  const [selectedCert, setSelectedCert] = useState<ManagedCertificate>(INITIAL_CERTIFICATES[1]); // Expiring cert default
  const [searchQuery, setSearchQuery] = useState('');
  const [issuerFilter, setIssuerFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRenewing, setIsRenewing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'crypto_health' | 'acme_automation'>('timeline');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showIssueModal, setShowIssueModal] = useState(false);

  // New Certificate Form State
  const [newDomain, setNewDomain] = useState('');
  const [newSans, setNewSans] = useState('');
  const [newIssuer, setNewIssuer] = useState<ManagedCertificate['issuer']>("Let's Encrypt (R3)");
  const [newAlgo, setNewAlgo] = useState<ManagedCertificate['algorithm']>('ECDSA P-384');

  const filteredCerts = useMemo(() => {
    return certificates.filter(cert => {
      const matchSearch = searchQuery === '' || 
        cert.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.sans.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        cert.assignedEndpoints.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchIssuer = issuerFilter === 'all' || cert.issuer === issuerFilter;
      const matchStatus = statusFilter === 'all' || cert.status === statusFilter;
      return matchSearch && matchIssuer && matchStatus;
    });
  }, [certificates, searchQuery, issuerFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = certificates.length;
    const expiring = certificates.filter(c => c.daysRemaining <= 15).length;
    const acmeCount = certificates.filter(c => c.caType === 'public_acme').length;
    const pqcReady = certificates.filter(c => c.algorithm.includes('Post-Quantum')).length;
    return {
      total,
      expiring,
      acmeCount,
      pqcReady,
      healthScore: '99.4% (Grade A+)'
    };
  }, [certificates]);

  const handleAutoRenew = (certId: string) => {
    setIsRenewing(certId);
    
    setTimeout(() => {
      setCertificates(prev => prev.map(c => {
        if (c.id === certId) {
          return {
            ...c,
            status: 'active',
            daysRemaining: 90,
            validTo: '2026-12-03',
            serialNumber: 'A1:88:' + Math.random().toString(16).substring(2, 8).toUpperCase()
          };
        }
        return c;
      }));

      if (selectedCert?.id === certId) {
        setSelectedCert(prev => ({
          ...prev,
          status: 'active',
          daysRemaining: 90,
          validTo: '2026-12-03'
        }));
      }

      setIsRenewing(null);

      window.dispatchEvent(new CustomEvent('add-toast', {
        detail: {
          type: 'success',
          title: 'Certificate Auto-Renewed',
          message: `ACME DNS-01 challenge verified. Certificate extended for 90 days.`
        }
      }));
    }, 1800);
  };

  const handleIssueCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomain) return;

    const newCert: ManagedCertificate = {
      id: `cert-custom-${Date.now().toString().slice(-4)}`,
      domain: newDomain,
      sans: newSans.split(',').map(s => s.trim()).filter(Boolean),
      issuer: newIssuer,
      caType: newIssuer.includes('Private') ? 'private_ca' : 'public_acme',
      algorithm: newAlgo,
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      daysRemaining: 90,
      status: 'active',
      autoRenew: true,
      ocspStapling: true,
      ctLogVerified: !newIssuer.includes('Private'),
      tlsVersion: 'TLS 1.3 Strict',
      serialNumber: 'FE:' + Math.random().toString(16).substring(2, 10).toUpperCase(),
      sha256Fingerprint: '99:AA:' + Math.random().toString(16).substring(2, 12).toUpperCase(),
      assignedEndpoints: ['edge-ingress.ftn.mesh:443']
    };

    setCertificates(prev => [newCert, ...prev]);
    setSelectedCert(newCert);
    setShowIssueModal(false);
    setNewDomain('');
    setNewSans('');

    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'success',
        title: 'New Certificate Issued',
        message: `Successfully provisioned TLS certificate for ${newDomain}`
      }
    }));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 bg-gray-900/60 p-6 rounded-2xl border border-gray-800 backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-[#00f0ff]/20 border border-emerald-500/40 shadow-[0_0_15px_rgba(0,255,102,0.2)]">
              <ShieldCheck className="w-6 h-6 text-[#00ff66]" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                FTN PKI & Certificate Manager
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30">
                  ACME + Sovereign CA
                </span>
              </h1>
              <p className="text-xs text-gray-400">
                Automated ACME DNS-01 / HTTP-01 renewals, cryptographic health audits, and post-quantum key governance
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowIssueModal(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#00f0ff] to-[#00ff66] text-gray-950 hover:opacity-95 transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Issue New Certificate
          </button>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('add-toast', {
                detail: {
                  type: 'info',
                  title: 'ACME Poller Polled',
                  message: 'Queried Let\'s Encrypt and step-ca endpoints. 2 certificates queued for renewal.'
                }
              }));
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-800/80 hover:bg-gray-700 border border-gray-700 text-gray-300 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Poll CAs
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Monitored Certificates</span>
            <FileCheck2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {stats.total} Active
          </div>
          <span className="text-[11px] text-blue-400/90 font-mono">{stats.acmeCount} via ACME automated</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Cryptographic Health</span>
            <Sparkles className="w-4 h-4 text-[#00ff66]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#00ff66]">
            {stats.healthScore}
          </div>
          <span className="text-[11px] text-gray-400 font-mono">100% TLS 1.3 / Perfect PFS</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Expiring in &lt; 15 Days</span>
            <AlertTriangle className={cn("w-4 h-4", stats.expiring > 0 ? "text-amber-400" : "text-gray-500")} />
          </div>
          <div className={cn("text-2xl font-bold font-mono", stats.expiring > 0 ? "text-amber-400" : "text-gray-400")}>
            {stats.expiring} Certificate{stats.expiring !== 1 ? 's' : ''}
          </div>
          <span className="text-[11px] text-amber-400/80 font-mono">Auto-renewal scheduled</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
          <div className="flex items-center justify-between text-gray-400 mb-1">
            <span className="text-xs font-medium">Post-Quantum Ready</span>
            <Cpu className="w-4 h-4 text-[#00f0ff]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#00f0ff]">
            {stats.pqcReady} Enabled
          </div>
          <span className="text-[11px] text-[#00f0ff]/80 font-mono">ML-KEM-768 Hybrid</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
        <button
          onClick={() => setActiveTab('timeline')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
            activeTab === 'timeline'
              ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
          )}
        >
          <Clock className="w-3.5 h-3.5" />
          Expiration Timelines & Registry ({filteredCerts.length})
        </button>

        <button
          onClick={() => setActiveTab('crypto_health')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
            activeTab === 'crypto_health'
              ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
          )}
        >
          <Key className="w-3.5 h-3.5" />
          Cryptographic Health & Quantum Audit
        </button>

        <button
          onClick={() => setActiveTab('acme_automation')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2",
            activeTab === 'acme_automation'
              ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
          )}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          ACME DNS-01 & Webhook Automations
        </button>
      </div>

      {/* Tab 1: Expiration Timeline & Registry */}
      {activeTab === 'timeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Certificate List */}
          <div className="lg:col-span-6 space-y-4">
            {/* Filter Bar */}
            <div className="glass-panel p-3 rounded-xl border border-gray-800 space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter by domain, SAN, endpoint..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900/80 border border-gray-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-[#00f0ff] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <span className="text-[11px] text-gray-500 font-mono">Issuer:</span>
                {(['all', "Let's Encrypt (R3)", "FTN Sovereign Private CA v4", "ZeroSSL ACME"] as const).map(iss => (
                  <button
                    key={iss}
                    onClick={() => setIssuerFilter(iss)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-mono whitespace-nowrap transition-colors",
                      issuerFilter === iss ? "bg-gray-700 text-white font-bold" : "text-gray-400 hover:text-white"
                    )}
                  >
                    {iss === 'all' ? 'All Issuers' : iss.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Cards */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {filteredCerts.map((cert) => {
                const isSelected = selectedCert?.id === cert.id;
                const isUrgent = cert.daysRemaining <= 7;
                const isWarning = cert.daysRemaining <= 30 && cert.daysRemaining > 7;

                return (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedCert(cert)}
                    className={cn(
                      "p-4 rounded-xl border transition-all cursor-pointer text-left relative",
                      isSelected
                        ? "bg-gray-800/90 border-[#00f0ff]/60 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                        : "bg-gray-900/50 border-gray-800/80 hover:bg-gray-850 hover:border-gray-700"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-[#00f0ff]" />
                        <span className="text-xs font-bold text-white font-mono">{cert.domain}</span>
                      </div>

                      <span className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded-full font-bold",
                        isUrgent ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse" :
                        isWarning ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" :
                        "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      )}>
                        {cert.daysRemaining} days remaining
                      </span>
                    </div>

                    {/* Expiration Progress Bar */}
                    <div className="space-y-1 my-2">
                      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all",
                            isUrgent ? "bg-red-500" : isWarning ? "bg-amber-400" : "bg-[#00ff66]"
                          )}
                          style={{ width: `${Math.min(100, Math.max(5, (cert.daysRemaining / 90) * 100))}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono pt-2 border-t border-gray-800/60">
                      <span className="text-gray-300">{cert.issuer}</span>
                      <span className="text-[#00f0ff]">{cert.algorithm}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificate Detailed Inspector */}
          <div className="lg:col-span-6 space-y-4">
            {selectedCert ? (
              <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
                {/* Header info */}
                <div className="flex items-start justify-between border-b border-gray-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-mono">{selectedCert.domain}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
                        {selectedCert.caType === 'public_acme' ? 'ACME Verified' : 'Private Mesh CA'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Issuer: <strong className="text-gray-200">{selectedCert.issuer}</strong>
                    </p>
                  </div>

                  <button
                    disabled={isRenewing === selectedCert.id}
                    onClick={() => handleAutoRenew(selectedCert.id)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#00ff66]/10 text-[#00ff66] hover:bg-[#00ff66]/20 border border-[#00ff66]/40 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className={cn("w-3.5 h-3.5", isRenewing === selectedCert.id && "animate-spin")} />
                    {isRenewing === selectedCert.id ? 'Verifying ACME...' : 'Auto-Renew Now'}
                  </button>
                </div>

                {/* Technical Properties Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 space-y-1">
                    <span className="text-gray-500 text-[10px]">KEY ALGORITHM</span>
                    <div className="text-white font-bold">{selectedCert.algorithm}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 space-y-1">
                    <span className="text-gray-500 text-[10px]">EXPIRATION COUNTDOWN</span>
                    <div className={cn("font-bold", selectedCert.daysRemaining <= 15 ? "text-amber-400" : "text-[#00ff66]")}>
                      {selectedCert.daysRemaining} Days ({selectedCert.validTo})
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 space-y-1">
                    <span className="text-gray-500 text-[10px]">TLS PROTOCOL</span>
                    <div className="text-white font-bold">{selectedCert.tlsVersion}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 space-y-1">
                    <span className="text-gray-500 text-[10px]">OCSP STAPLING / CT</span>
                    <div className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {selectedCert.ocspStapling ? 'Stapled & Verified' : 'Internal Mutual TLS'}
                    </div>
                  </div>
                </div>

                {/* SANs (Subject Alternative Names) */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-300">Subject Alternative Names (SANs)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCert.sans.map(san => (
                      <span key={san} className="px-2 py-1 rounded bg-gray-800/80 border border-gray-700 text-gray-300 font-mono text-[11px]">
                        {san}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Fingerprint & Serial */}
                <div className="space-y-2 p-3 rounded-xl bg-black/50 border border-gray-800/80 font-mono text-[11px]">
                  <div className="flex items-center justify-between text-gray-400">
                    <span>SHA-256 Fingerprint</span>
                    <button 
                      onClick={() => copyToClipboard(selectedCert.sha256Fingerprint, 'fp')}
                      className="text-[#00f0ff] hover:underline flex items-center gap-1 text-[10px]"
                    >
                      {copiedField === 'fp' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'fp' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-gray-300 break-all">{selectedCert.sha256Fingerprint}</div>

                  <div className="flex items-center justify-between text-gray-400 pt-2 border-t border-gray-800">
                    <span>Serial Number</span>
                    <span className="text-gray-300">{selectedCert.serialNumber}</span>
                  </div>
                </div>

                {/* Assigned Edge Ingress Nodes */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-300">Bound Gateway Endpoints</span>
                  <div className="space-y-1">
                    {selectedCert.assignedEndpoints.map(ep => (
                      <div key={ep} className="p-2 rounded-lg bg-gray-900/80 border border-gray-800 text-xs font-mono text-gray-300 flex items-center justify-between">
                        <span>{ep}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">mTLS Active</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500 font-mono">
                Select a certificate to inspect parameters.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Cryptographic Health Audit */}
      {activeTab === 'crypto_health' && (
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-[#00f0ff]" />
              Enterprise Cryptographic Health & Post-Quantum Compliance
            </h3>
            <p className="text-xs text-gray-400">
              NIST FIPS 203 (ML-KEM) readiness audit, TLS 1.3 cipher suite strengths, and DNS CAA record assertions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Quantum Resistance</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-[#00ff66]">PASS</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Core internal BGP and mesh tunnels deploy hybrid <strong>X25519 + ML-KEM-768</strong> key encapsulation, protecting against "Harvest Now, Decrypt Later" adversaries.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">DNS CAA Policy</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-[#00ff66]">ENFORCED</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Root DNS zone restricts issuance exclusively to <code>issue "letsencrypt.org"</code> and <code>issue "zerossl.com"</code> with real-time iodef reporting.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Cipher Suite Hardening</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-[#00ff66]">GRADE A+</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Legacy TLS 1.0, 1.1, and CBC ciphers disabled. Only AEAD ciphers <strong>TLS_AES_256_GCM_SHA384</strong> and <strong>TLS_CHACHA20_POLY1305_SHA256</strong> permitted.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: ACME DNS-01 Automations */}
      {activeTab === 'acme_automation' && (
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#00ff66]" />
              ACME Challenge Validation & Hook Workflows
            </h3>
            <p className="text-xs text-gray-400">
              Zero-downtime certificate renewal via DNS-01 TXT record automation across DNSPod, DuckDNS, and Cloudflare.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">DNS-01 Challenge Provider</div>
                <p className="text-xs text-gray-400 font-mono">Cloudflare API + Tencent DNSPod Auto-Record Injection</p>
              </div>
              <span className="text-xs text-[#00ff66] font-mono font-bold">Enabled (TTL 60s)</span>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-white">Post-Renewal Webhook Hook</div>
                <p className="text-xs text-gray-400 font-mono">Envoy Hot Restart + WireGuard Mesh Rekey Event Dispatch</p>
              </div>
              <span className="text-xs text-[#00f0ff] font-mono font-bold">0ms Packet Drop</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Issue Certificate */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#00ff66]" />
                Issue New TLS Certificate
              </h3>
              <button 
                onClick={() => setShowIssueModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueCertificate} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">Primary Domain Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. gateway.familytimenet.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#00f0ff] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">SANs (comma separated)</label>
                <input
                  type="text"
                  placeholder="*.gateway.familytimenet.com, auth.gateway.familytimenet.com"
                  value={newSans}
                  onChange={(e) => setNewSans(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#00f0ff] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">Certificate Authority</label>
                <select
                  value={newIssuer}
                  onChange={(e) => setNewIssuer(e.target.value as any)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                >
                  <option value="Let's Encrypt (R3)">Let's Encrypt (R3) - Public ACME</option>
                  <option value="ZeroSSL ACME">ZeroSSL ACME - Public EAB</option>
                  <option value="FTN Sovereign Private CA v4">FTN Sovereign Private CA v4 - mTLS</option>
                  <option value="Akamai Edge PKI">Akamai Edge PKI - CDN</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-gray-300 font-medium">Cryptographic Algorithm</label>
                <select
                  value={newAlgo}
                  onChange={(e) => setNewAlgo(e.target.value as any)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:border-[#00f0ff] focus:outline-none"
                >
                  <option value="ECDSA P-384">ECDSA P-384 (Recommended High Performance)</option>
                  <option value="ECDSA P-256">ECDSA P-256 (Fast Mobile mTLS)</option>
                  <option value="RSA 4096">RSA 4096 (Legacy Systems)</option>
                  <option value="Post-Quantum ML-KEM-768">Post-Quantum ML-KEM-768 (Quantum Resistant)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00ff66] text-gray-950 hover:bg-[#00ff66]/90 transition-all cursor-pointer"
                >
                  Confirm & Provision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
