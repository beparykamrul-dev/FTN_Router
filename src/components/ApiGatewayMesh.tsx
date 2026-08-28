import React, { useState, useEffect } from 'react';
import { Network, Shield, Cpu, Cloud, Database, Globe, ArrowDown, Activity, Server, ArrowRight } from 'lucide-react';
import { cn } from '../utils';

export function ApiGatewayMesh() {
  const [goStats, setGoStats] = useState<any>(null);
  const [rustStats, setRustStats] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      const [goRes, rustRes, provRes] = await Promise.all([
        fetch('/api/mesh/go-core').then(res => res.json()),
        fetch('/api/mesh/rust-filter').then(res => res.json()),
        fetch('/api/mesh/providers').then(res => res.json())
      ]);
      setGoStats(goRes);
      setRustStats(rustRes);
      setProviders(provRes);
    } catch (error) {
      console.error("Failed to fetch mesh stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1 text-glow-blue flex items-center gap-3">
          <Globe className="w-6 h-6 text-[#00f0ff]" /> Global API Gateway & Polyglot Mesh
        </h1>
        <p className="text-gray-400 text-sm font-mono max-w-3xl">
          Enterprise FTN Architecture utilizing Golang as the primary orchestration engine, Rust for zero-copy memory-safe packet filtering, and integrations with top-tier global providers.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative">
        
        {/* Left Column: Edge & Proxies */}
        <div className="space-y-6">
          <h3 className="text-gray-300 font-mono text-sm tracking-widest uppercase border-b border-gray-800 pb-2">Edge & Global Proxies</h3>
          
          <div className="glass-panel p-5 rounded-xl border border-gray-800/60 relative group hover:border-[#00f0ff]/50 transition-colors">
             <div className="flex justify-between items-start mb-3">
               <div className="flex items-center gap-3">
                 <Cloud className="w-6 h-6 text-[#00f0ff]" />
                 <div>
                   <h4 className="font-bold text-gray-200">Cloudflare Enterprise</h4>
                   <p className="text-[10px] text-gray-500 font-mono">Global CDN & WAF</p>
                 </div>
               </div>
               <span className="px-2 py-0.5 bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20 rounded text-[10px] font-mono animate-pulse">ACTIVE</span>
             </div>
             <p className="text-xs text-gray-400 font-mono">Routing external requests directly to internal API gateway via Anycast BGP.</p>
          </div>

          <div className="flex justify-center -my-2 relative z-10 text-gray-600">
             <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          <div className="glass-panel p-5 rounded-xl border border-gray-800/60 group hover:border-gray-600 transition-colors bg-gradient-to-b from-gray-900/80 to-black/80">
             <div className="flex justify-between items-start mb-3">
               <div className="flex items-center gap-3">
                 <Server className="w-6 h-6 text-gray-300" />
                 <div>
                   <h4 className="font-bold text-gray-200">Node.js API Gateway</h4>
                   <p className="text-[10px] text-gray-500 font-mono">BFF (Backend for Frontend)</p>
                 </div>
               </div>
               <span className="px-2 py-0.5 bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20 rounded text-[10px] font-mono">ONLINE</span>
             </div>
             <p className="text-xs text-gray-400 font-mono">Express.js router dispatching requests to Polyglot microservices.</p>
          </div>
        </div>

        {/* Middle Column: Core Backend (Go + Rust) */}
        <div className="xl:col-span-2 space-y-6">
           <h3 className="text-gray-300 font-mono text-sm tracking-widest uppercase border-b border-gray-800 pb-2">Polyglot Internal Mesh</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Golang Core */}
              <div className="glass-panel p-5 rounded-xl border border-[#00f0ff]/30 relative overflow-hidden shadow-[0_0_20px_rgba(0,240,255,0.05)]">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Network className="w-24 h-24 text-[#00f0ff]" />
                 </div>
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display text-xl font-bold text-white flex items-center gap-2">
                         <span className="text-[#00f0ff]">Go</span> Core Engine
                      </h4>
                      <span className="bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 px-2 py-1 rounded text-xs font-mono font-bold">PRIMARY</span>
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-6 font-mono leading-relaxed h-12">
                      High-concurrency orchestration handling BGP route injections, IPFIX parsing, and primary state management.
                    </p>

                    <div className="space-y-3 bg-black/40 p-3 rounded-lg border border-gray-800/50">
                       <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-gray-500">Status</span>
                          <span className="text-[#00ff66]">{goStats?.status || 'LOADING...'}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-gray-500">Active Goroutines</span>
                          <span className="text-[#00f0ff] font-bold">{goStats?.goroutines?.toLocaleString() || '--'}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-gray-500">Internal Latency</span>
                          <span className="text-yellow-400">{goStats?.latencyMs || '--'}ms</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Rust Middleware */}
              <div className="glass-panel p-5 rounded-xl border border-[#ff4444]/30 relative overflow-hidden shadow-[0_0_20px_rgba(255,68,68,0.05)]">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Shield className="w-24 h-24 text-[#ff4444]" />
                 </div>
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-display text-xl font-bold text-white flex items-center gap-2">
                         <span className="text-[#ff4444]">Rust</span> Middleware
                      </h4>
                      <span className="bg-[#ff4444]/20 text-[#ff4444] border border-[#ff4444]/30 px-2 py-1 rounded text-xs font-mono font-bold">IN-KERNEL</span>
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-6 font-mono leading-relaxed h-12">
                      Memory-safe eBPF / XDP integration for ultra-low latency packet inspection and ZeroTrust filtering.
                    </p>

                    <div className="space-y-3 bg-black/40 p-3 rounded-lg border border-gray-800/50">
                       <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-gray-500">Memory Safe</span>
                          <span className="text-[#00ff66]">VERIFIED</span>
                       </div>
                       <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-gray-500">Packets Dropped (XDP)</span>
                          <span className="text-[#ff4444] font-bold">{rustStats?.droppedPackets?.toLocaleString() || '--'}</span>
                       </div>
                       <div className="flex justify-between items-center text-xs font-mono">
                          <span className="text-gray-500">Version</span>
                          <span className="text-gray-300">{rustStats?.language || '--'}</span>
                       </div>
                    </div>
                 </div>
              </div>

           </div>

           {/* Metrics & External APMs */}
           <div className="mt-8">
              <h3 className="text-gray-300 font-mono text-sm tracking-widest uppercase border-b border-gray-800 pb-2 mb-4">Global Providers & APM Metrics</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {providers.map((prov, i) => (
                    <div key={i} className="bg-gray-800/30 border border-gray-700/50 p-4 rounded-xl flex flex-col hover:bg-gray-800/50 transition-colors">
                       <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-gray-200">{prov.provider}</span>
                          <Activity className="w-4 h-4 text-gray-500" />
                       </div>
                       <span className="text-[10px] text-gray-400 font-mono mb-3">{prov.type}</span>
                       <div className="mt-auto flex justify-between items-center">
                          <span className={cn(
                             "text-[10px] font-mono px-2 py-0.5 rounded",
                             prov.status === 'Active' ? "text-[#00ff66] bg-[#00ff66]/10" : "text-yellow-500 bg-yellow-500/10"
                          )}>
                             {prov.status}
                          </span>
                          <span className="text-xs font-mono text-[#00f0ff]">{prov.latency}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}
