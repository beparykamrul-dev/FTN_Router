import React, { useState } from 'react';
import { 
  Network, 
  ShieldCheck, 
  Activity, 
  Globe, 
  Server, 
  Zap, 
  Lock, 
  RefreshCw, 
  Plus,
  ArrowRightLeft
} from 'lucide-react';
import { cn } from '../utils';

interface SdWanNode {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  latency: string;
  bandwidth: string;
  tunnels: number;
}

export function FtnSdWanController() {
  const [nodes] = useState<SdWanNode[]>([
    { id: 'node-01', name: 'FTN Central Core', status: 'ONLINE', latency: '4ms', bandwidth: '10 Gbps', tunnels: 12 },
    { id: 'node-02', name: 'Edge Node - Asia', status: 'ONLINE', latency: '22ms', bandwidth: '1 Gbps', tunnels: 4 },
    { id: 'node-03', name: 'Edge Node - Europe', status: 'DEGRADED', latency: '145ms', bandwidth: '500 Mbps', tunnels: 3 },
    { id: 'node-04', name: 'Edge Node - Home Lab', status: 'OFFLINE', latency: '-', bandwidth: '-', tunnels: 0 },
  ]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1 flex items-center gap-3">
            <ArrowRightLeft className="w-6 h-6 text-[#00f0ff]" /> FTN SD-WAN Controller
          </h1>
          <p className="text-gray-400 text-sm font-mono">
            Sovereign Secure Tunneling Mesh & Edge Agent Orchestration
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 hover:bg-[#00ff66]/20 font-mono font-bold text-xs">
          <Plus className="w-4 h-4" /> Provision New Edge Agent
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topology Overview */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-950/60">
          <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <Network className="w-4 h-4 text-purple-400" /> Active Tunnel Topology
          </h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-800 rounded-xl bg-gray-900/40 text-gray-600 font-mono text-xs">
            [Visual Topology Graph (Active Nodes Mesh)]
          </div>
        </div>

        {/* Node Status List */}
        <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-950/60">
          <h2 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <Server className="w-4 h-4 text-[#00f0ff]" /> Edge Node Status
          </h2>
          <div className="space-y-4">
            {nodes.map(node => (
              <div key={node.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-900 border border-gray-800">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    node.status === 'ONLINE' ? "bg-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.5)]" : 
                    node.status === 'DEGRADED' ? "bg-amber-500" : "bg-red-500"
                  )} />
                  <span className="text-xs font-mono text-gray-200">{node.name}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{node.latency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
