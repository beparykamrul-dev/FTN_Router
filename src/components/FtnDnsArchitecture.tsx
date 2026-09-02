import React from 'react';
import { Globe, Server, ShieldCheck, Database, LayoutDashboard, Zap, Network, Radio } from 'lucide-react';

export function FtnDnsArchitecture() {
  const layers = [
    { name: "Unified FTN DNS Core", icon: Server, components: ["PowerDNS (Authoritative)", "Unbound (Recursive)"] },
    { name: "Global Mesh", icon: Globe, components: ["Global DNS Mesh", "Anycast DNS"] },
    { name: "Anycast", icon: Radio, components: ["Global DNS Anycast"] },
    { name: "Authoritative + Recursive", icon: Database, components: ["Technitium DNS Enterprise", "CoreDNS"] },
    { name: "Guard", icon: ShieldCheck, components: ["Unbound (DNSSEC)", "Technitium (Policy)"] },
    { name: "Cache", icon: Zap, components: ["Unbound (Resolver Cache)", "dnsdist (Load-balancing/Caching)"] },
    { name: "Provider Mesh", icon: Network, components: ["DNSPod", "Cloudflare DNS", "Akamai DNS", "DuckDNS", "Porkbun", "Caddy DNS", "Let's Encrypt"] },
    { name: "Monitoring", icon: Activity, components: ["Prometheus/Grafana", "LibreNMS"] },
    { name: "Control Panel", icon: LayoutDashboard, components: ["GoDNS", "Hickory DNS", "Numa DNS"] },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="glass-panel p-6 rounded-2xl border border-gray-800">
        <h1 className="text-2xl font-bold font-display text-white mb-2">FTN DNS Unified Architecture</h1>
        <p className="text-gray-400">Hierarchical DNS management, recursive resolution, and global mesh anycast routing.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {layers.map((layer, index) => (
          <div key={index} className="glass-panel p-5 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <layer.icon className="w-6 h-6 text-[#00f0ff]" />
              <h2 className="text-lg font-bold text-white">{layer.name}</h2>
            </div>
            <ul className="space-y-2">
              {layer.components.map((comp, i) => (
                <li key={i} className="text-sm text-gray-400 font-mono bg-gray-900/50 p-2 rounded border border-gray-800">
                  {comp}
                </li>
              ))}
            </ul>
          </div>
        ))}
        
        {/* Separate Layer */}
        <div className="glass-panel p-5 rounded-2xl border border-orange-800 hover:border-orange-600 transition-colors">
            <div className="flex items-center gap-3 mb-4">
                <Network className="w-6 h-6 text-orange-400" />
                <h2 className="text-lg font-bold text-white">Edge Service Layer</h2>
            </div>
            <ul className="space-y-2">
                <li className="text-sm text-gray-400 font-mono bg-orange-900/20 p-2 rounded border border-orange-800">
                    netflix-proxy (Traffic Service)
                </li>
            </ul>
        </div>
      </div>
    </div>
  );
}
