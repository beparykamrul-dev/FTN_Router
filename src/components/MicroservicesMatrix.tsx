import React from 'react';
import { Database, Shield, Network, Server, Cloud, Terminal, Cpu } from 'lucide-react';
import { cn } from '../utils';

const canonicalServices = [
  { name: 'ACME Key Manager', cat: 'Security', icon: Shield, status: 'ONLINE' },
  { name: 'Akamai Global Edge', cat: 'CDN', icon: Cloud, status: 'ONLINE' },
  { name: 'Ansible / AWX', cat: 'Automation', icon: Terminal, status: 'ONLINE' },
  { name: 'BGP EVPN Orchestrator', cat: 'Routing', icon: Network, status: 'ONLINE' },
  { name: 'BGP Peering Engine', cat: 'Routing', icon: Network, status: 'ONLINE' },
  { name: 'Caddy Auto-HTTPS', cat: 'Proxy', icon: Server, status: 'ONLINE' },
  { name: 'CAN_RAW Filter', cat: 'Low-Level', icon: Cpu, status: 'STANDBY' },
  { name: 'SiLK Telemetry', cat: 'Analytics', icon: Database, status: 'ONLINE' },
  { name: 'Cygwin Subsystem', cat: 'Platform', icon: Terminal, status: 'OFFLINE' },
  { name: 'Decentralized Storage (IPFS)', cat: 'Storage', icon: Database, status: 'ONLINE' },
  { name: 'DMBS335/the-map', cat: 'Security', icon: Shield, status: 'ONLINE' },
  { name: 'DNSPod API', cat: 'DNS', icon: Cloud, status: 'ONLINE' },
  { name: 'Drip Policy Shaper', cat: 'QoS', icon: Network, status: 'ONLINE' },
  { name: 'DuckDNS Agent', cat: 'DNS', icon: Server, status: 'ONLINE' },
  { name: 'eBPF / XDP Mitigator', cat: 'Security', icon: Shield, status: 'ONLINE' },
  { name: 'Excalibur Tunnel', cat: 'VPN', icon: Network, status: 'ONLINE' },
  { name: 'EVMbench Auditor', cat: 'Blockchain', icon: Shield, status: 'STANDBY' },
  { name: 'Frigate AI NVR', cat: 'CCTV', icon: Server, status: 'ONLINE' },
  { name: 'FRR Controller', cat: 'Routing', icon: Network, status: 'ONLINE' },
  { name: 'Full Mesh Overlay', cat: 'Network', icon: Network, status: 'ONLINE' },
  { name: 'Go Certificate Authority', cat: 'Security', icon: Shield, status: 'ONLINE' },
  { name: 'GoDNS Client', cat: 'DNS', icon: Server, status: 'ONLINE' },
  { name: 'Gonc-GUI Tunnel', cat: 'VPN', icon: Terminal, status: 'ONLINE' },
  { name: 'Grafana NOC Dashboard', cat: 'UI', icon: Database, status: 'ONLINE' },
  { name: 'Guacamole Gateway', cat: 'Remote', icon: Server, status: 'ONLINE' },
  { name: 'IPFIX Collector', cat: 'Analytics', icon: Database, status: 'ONLINE' },
  { name: 'IPsec Core Tunnel', cat: 'VPN', icon: Network, status: 'ONLINE' },
  { name: 'Numa DNS Edge', cat: 'DNS', icon: Cloud, status: 'ONLINE' },
];

export function MicroservicesMatrix() {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1 text-glow">System Architecture Matrix</h1>
        <p className="text-gray-400 text-sm font-mono">Live status of 28 canonical FTNDNS microservices and daemons.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {canonicalServices.map((service, idx) => {
          const Icon = service.icon;
          return (
            <div key={idx} className="glass-panel p-4 rounded-xl border border-gray-800/60 flex items-start gap-4 hover:border-gray-600 transition-colors group">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shadow-lg border",
                service.status === 'ONLINE' ? "bg-[#00ff66]/10 border-[#00ff66]/30 text-[#00ff66]" :
                service.status === 'STANDBY' ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500" :
                "bg-red-500/10 border-red-500/30 text-red-500"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{service.name}</h4>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">{service.cat}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      service.status === 'ONLINE' ? "bg-[#00ff66] shadow-[0_0_5px_#00ff66]" :
                      service.status === 'STANDBY' ? "bg-yellow-500" : "bg-red-500"
                    )} />
                    <span className="text-[10px] text-gray-400 font-mono">{service.status}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
