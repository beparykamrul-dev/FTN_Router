import React, { useState } from 'react';
import { RefreshCw, Globe, Server, CheckCircle2, ShieldCheck, Copy, Check, Play, Pause, Activity, Radio, AlertTriangle } from 'lucide-react';
import { cn } from '../utils';

interface DdnsHost {
  id: string;
  hostname: string;
  provider: string;
  ip: string;
  lastUpdated: string;
  status: 'active' | 'updating' | 'offline';
  ttl: number;
  autoFailover: boolean;
}

export function DdnsManager() {
  const [hosts, setHosts] = useState<DdnsHost[]>([
    { id: '1', hostname: 'edge-gateway.ftn.duckdns.org', provider: 'DuckDNS', ip: '103.245.18.90', lastUpdated: '1 min ago', status: 'active', ttl: 60, autoFailover: true },
    { id: '2', hostname: 'core-bras.dnspod.net', provider: 'Tencent DNSPod', ip: '103.245.18.91', lastUpdated: '3 mins ago', status: 'active', ttl: 120, autoFailover: true },
    { id: '3', hostname: 'porkbun-relay.ftn.net', provider: 'Porkbun API', ip: '45.112.5.4', lastUpdated: '5 mins ago', status: 'active', ttl: 300, autoFailover: false },
    { id: '4', hostname: 'anycast-node.godns.me', provider: 'GoDNS (Self-Hosted)', ip: '185.220.101.5', lastUpdated: 'Just now', status: 'active', ttl: 60, autoFailover: true },
  ]);

  const [newHost, setNewHost] = useState({ hostname: '', provider: 'DuckDNS', ip: '', autoFailover: true });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSyncAll = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      window.dispatchEvent(new CustomEvent('add-toast', {
        detail: {
          type: 'success',
          title: 'DDNS Records Synchronized',
          message: 'All endpoints updated across DuckDNS, DNSPod, and Porkbun APIs.'
        }
      }));
    }, 1200);
  };

  const handleAddHost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHost.hostname || !newHost.ip) return;
    
    const hostItem: DdnsHost = {
      id: Date.now().toString(),
      hostname: newHost.hostname,
      provider: newHost.provider,
      ip: newHost.ip,
      lastUpdated: 'Just now',
      status: 'active',
      ttl: 60,
      autoFailover: newHost.autoFailover
    };

    setHosts([hostItem, ...hosts]);
    setNewHost({ hostname: '', provider: 'DuckDNS', ip: '', autoFailover: true });

    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'success',
        title: 'DDNS Endpoint Created',
        message: `${hostItem.hostname} added to active polling queue.`
      }
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-gray-800/80 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center text-gray-950 shadow-[0_0_20px_rgba(0,255,102,0.3)]">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-white tracking-wide">
              Dynamic DNS (DDNS) Service Hub
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Automated WAN IP tracking, multi-provider failover (DuckDNS, DNSPod, Porkbun, GoDNS), and PPPoE route hooks.
            </p>
          </div>
        </div>

        <button
          onClick={handleSyncAll}
          disabled={isUpdating}
          className="px-4 py-2.5 bg-[#00ff66] hover:bg-[#00ff66]/90 text-gray-950 font-bold rounded-xl text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)]"
        >
          <RefreshCw className={cn("w-4 h-4", isUpdating && "animate-spin")} />
          {isUpdating ? 'Synchronizing WAN IPs...' : 'Force Sync All Endpoints'}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Endpoints Table */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00ff66]" />
              Active Dynamic DNS Endpoints ({hosts.length})
            </h3>
            <span className="text-xs font-mono text-[#00ff66] bg-[#00ff66]/10 px-2.5 py-1 rounded-full border border-[#00ff66]/30">
              100% HEALTHY
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-gray-900/80 border-b border-gray-800 text-gray-400 uppercase">
                <tr>
                  <th className="px-4 py-3">Hostname</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Current WAN IP</th>
                  <th className="px-4 py-3">TTL</th>
                  <th className="px-4 py-3">Failover</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 text-gray-300">
                {hosts.map(host => (
                  <tr key={host.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-[#00ff66]" />
                      {host.hostname}
                    </td>
                    <td className="px-4 py-3.5 text-gray-400">{host.provider}</td>
                    <td className="px-4 py-3.5 text-[#00f0ff] font-bold">{host.ip}</td>
                    <td className="px-4 py-3.5 text-gray-400">{host.ttl}s</td>
                    <td className="px-4 py-3.5">
                      {host.autoFailover ? (
                        <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/30 px-2 py-0.5 rounded">
                          AUTO
                        </span>
                      ) : (
                        <span className="text-[10px] bg-gray-800 text-gray-400 border border-gray-700 px-2 py-0.5 rounded">
                          STATIC
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                        {host.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Endpoint Form */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-[#00f0ff]" />
            Add DDNS Endpoint
          </h3>

          <form onSubmit={handleAddHost} className="space-y-3 font-mono text-xs">
            <div>
              <label className="text-gray-400 block mb-1">Target Hostname</label>
              <input
                type="text"
                placeholder="node-01.ftn.duckdns.org"
                value={newHost.hostname}
                onChange={(e) => setNewHost({ ...newHost, hostname: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#00ff66]"
                required
              />
            </div>

            <div>
              <label className="text-gray-400 block mb-1">DDNS Provider</label>
              <select
                value={newHost.provider}
                onChange={(e) => setNewHost({ ...newHost, provider: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#00ff66]"
              >
                <option>DuckDNS</option>
                <option>Tencent DNSPod</option>
                <option>Porkbun API</option>
                <option>GoDNS (Self-Hosted)</option>
                <option>Cloudflare API</option>
              </select>
            </div>

            <div>
              <label className="text-gray-400 block mb-1">Target IP Address</label>
              <input
                type="text"
                placeholder="103.245.18.95"
                value={newHost.ip}
                onChange={(e) => setNewHost({ ...newHost, ip: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#00ff66]"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="failover"
                checked={newHost.autoFailover}
                onChange={(e) => setNewHost({ ...newHost, autoFailover: e.target.checked })}
                className="rounded bg-gray-900 border-gray-700 text-[#00ff66] focus:ring-0"
              />
              <label htmlFor="failover" className="text-gray-300">Enable Auto-Failover to Secondary BGP WAN</label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-lg transition-all shadow-md mt-2"
            >
              Add DDNS Host
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
