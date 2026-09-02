import React, { useState } from 'react';
import { Globe2, ShieldCheck, Lock, RefreshCw, Key, ArrowUpRight, Search, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '../utils';

interface DomainItem {
  id: string;
  domain: string;
  registrar: string;
  expiryDate: string;
  dnssec: boolean;
  sslStatus: 'Active (ACME)' | 'Expiring Soon' | 'Auto-Renew';
  nameservers: string[];
  autoRenew: boolean;
}

export function DomainManager() {
  const [domains, setDomains] = useState<DomainItem[]>([
    { id: '1', domain: 'ftndns.net', registrar: 'Porkbun / Tencent DNSPod', expiryDate: '2028-11-15', dnssec: true, sslStatus: 'Active (ACME)', nameservers: ['ns1.ftndns.net', 'ns2.ftndns.net'], autoRenew: true },
    { id: '2', domain: 'ftn.network', registrar: 'Akamai / Porkbun', expiryDate: '2027-04-20', dnssec: true, sslStatus: 'Active (ACME)', nameservers: ['anycast1.ftn.network', 'anycast2.ftn.network'], autoRenew: true },
    { id: '3', domain: 'beparykamrul.dev', registrar: 'Cloudflare Registrar', expiryDate: '2029-01-10', dnssec: true, sslStatus: 'Active (ACME)', nameservers: ['ns1.bepary.dev', 'ns2.bepary.dev'], autoRenew: true },
    { id: '4', domain: 'grid-telemetry.io', registrar: 'Porkbun API', expiryDate: '2027-09-01', dnssec: false, sslStatus: 'Auto-Renew', nameservers: ['ns1.ftn-grid.io', 'ns2.ftn-grid.io'], autoRenew: true },
  ]);

  const [search, setSearch] = useState('');

  const filteredDomains = domains.filter(d => 
    d.domain.toLowerCase().includes(search.toLowerCase()) || 
    d.registrar.toLowerCase().includes(search.toLowerCase())
  );

  const handleIssueCert = (domain: string) => {
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'success',
        title: 'ACME SSL Issued',
        message: `Wildcard TLS certificate issued for *.${domain} via Let's Encrypt / ZeroSSL ACME API.`
      }
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-gray-800/80 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <Globe2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-white tracking-wide">
              Domain Portfolio & ACME PKI Security
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Manage root domains, WHOIS privacy, DNSSEC ECDSA keys, and automated ACME SSL certificate renewals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search domains..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white text-xs rounded-xl pl-9 pr-4 py-2 font-mono focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDomains.map(item => (
          <div key={item.id} className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-4 hover:border-purple-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-mono">{item.domain}</h3>
                  <span className="text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono">
                    {item.registrar}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-mono mt-1">Expires: {item.expiryDate}</p>
              </div>

              <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {item.sslStatus}
              </span>
            </div>

            <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-xs font-mono text-gray-300 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">DNSSEC Status:</span>
                <span className={item.dnssec ? "text-[#00ff66]" : "text-yellow-400"}>
                  {item.dnssec ? "ECDSA P-256 (Protected)" : "Disabled"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Nameservers:</span>
                <span className="text-gray-200">{item.nameservers.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Auto-Renewal:</span>
                <span className="text-white">Enabled (Vault Linked)</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => handleIssueCert(item.domain)}
                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-mono rounded-lg transition-colors border border-gray-700 flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                Issue Wildcard SSL (*.{item.domain})
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
