import React from 'react';
import { Network, Zap } from 'lucide-react';

export function DnsTopologyView() {
  const nodes = [
    { name: "PowerDNS Core", type: "Authoritative", health: "Healthy", latency: "2ms" },
    { name: "Technitium Rec", type: "Recursive", health: "Healthy", latency: "5ms" },
    { name: "CoreDNS Anycast", type: "Anycast", health: "Healthy", latency: "1ms" },
    { name: "dnsdist Load", type: "Load Balancer", health: "Healthy", latency: "0.5ms" },
  ];

  return (
    <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Network className="w-5 h-5 text-[#00f0ff]" />
        DNS Topology & Anycast Mesh
      </h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {nodes.map((node, i) => (
          <div key={i} className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
            <div className="text-sm font-bold text-white mb-1">{node.name}</div>
            <div className="text-xs text-gray-400 font-mono mb-2">{node.type}</div>
            <div className="flex justify-between text-[10px] font-mono">
              <span className="text-[#00ff66]">{node.health}</span>
              <span className="text-[#00f0ff]">{node.latency}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
