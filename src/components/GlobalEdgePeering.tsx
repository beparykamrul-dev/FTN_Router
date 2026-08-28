import React from 'react';
import { Globe2, Server, Cpu, Database, Network, Zap, CheckCircle2 } from 'lucide-react';
import { cn } from '../utils';

const globalProviders = [
  {
    name: 'Cloudflare',
    asn: 'AS13335',
    ips: '1.1.1.1 / 1.0.0.1',
    dnsStrategy: 'Anycast DNS Sync via API',
    openSource: ['eBPF', 'Quiche (HTTP/3)', 'BoringSSL'],
    status: 'OPTIMIZED',
    latency: '8ms'
  },
  {
    name: 'Akamai',
    asn: 'AS20940',
    ips: '23.192.0.0/11',
    dnsStrategy: 'Edge DNS + Global Traffic Management',
    openSource: ['LVS (Linux Virtual Server)', 'Varnish'],
    status: 'OPTIMIZED',
    latency: '12ms'
  },
  {
    name: 'Tencent (DNSPod)',
    asn: 'AS132203',
    ips: '119.29.29.29',
    dnsStrategy: 'DNSPod API Integration',
    openSource: ['Kube-OVN', 'TencentOS Kernel'],
    status: 'OPTIMIZED',
    latency: '15ms'
  },
  {
    name: 'Fastly',
    asn: 'AS54113',
    ips: '151.101.0.0/16',
    dnsStrategy: 'Lucet / Compute@Edge',
    openSource: ['Varnish Configuration Language (VCL)', 'H2O'],
    status: 'OPTIMIZED',
    latency: '11ms'
  },
  {
    name: 'Google Edge',
    asn: 'AS15169',
    ips: '8.8.8.8 / 8.8.4.4',
    dnsStrategy: 'Cloud DNS Peering',
    openSource: ['BBR (TCP Congestion)', 'gRPC', 'Envoy'],
    status: 'OPTIMIZED',
    latency: '9ms'
  }
];

export function GlobalEdgePeering() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1 text-glow-blue flex items-center gap-3">
          <Globe2 className="w-6 h-6 text-[#00f0ff]" /> Global Provider BGP & DNS Peering
        </h1>
        <p className="text-gray-400 text-sm font-mono max-w-4xl">
          Direct backbone peering orchestrator. Manages API adjustments, DNS syncing, and open-source metric integrations for all major global providers to guarantee ultra-low latency via the FTN backbone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="glass-panel p-4 rounded-xl border border-gray-800/60 flex items-center gap-4">
          <div className="p-3 bg-[#00ff66]/10 rounded-lg border border-[#00ff66]/30 text-[#00ff66]">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-mono uppercase">Total Peer ASNs</p>
            <p className="text-xl font-bold text-white font-display">1,204</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gray-800/60 flex items-center gap-4">
          <div className="p-3 bg-[#00f0ff]/10 rounded-lg border border-[#00f0ff]/30 text-[#00f0ff]">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-mono uppercase">Global Avg Latency</p>
            <p className="text-xl font-bold text-white font-display">11.4 ms</p>
          </div>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gray-800/60 flex items-center gap-4">
          <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30 text-purple-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-mono uppercase">Active Open-Source Hooks</p>
            <p className="text-xl font-bold text-white font-display">42 Services</p>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl border border-gray-800/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-[10px] uppercase bg-gray-900/80 text-gray-400 font-mono border-b border-gray-800/50">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Provider & ASN</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Edge IPs / Ranges</th>
                <th className="px-6 py-4 font-semibold tracking-wider">FTN DNS Integration</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Open-Source Tech Utilized</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {globalProviders.map((provider, idx) => (
                <tr key={idx} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-200 mb-0.5">{provider.name}</div>
                    <div className="text-[10px] text-[#00f0ff] font-mono">{provider.asn}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">
                    {provider.ips}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-300 mb-1">{provider.dnsStrategy}</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#00ff66] font-mono">
                      <CheckCircle2 className="w-3 h-3" /> Synced to Local FTN Nodes
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {provider.openSource.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-800 border border-gray-700 rounded text-[10px] font-mono text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[10px] uppercase tracking-wider font-bold bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 px-3 py-1.5 rounded transition-colors">
                      Sync Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
