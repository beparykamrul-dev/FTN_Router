import React, { useState } from 'react';
import {
  ShieldAlert,
  Server,
  CalendarClock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { cn } from '../utils';

export interface PatchNode {
  id: string;
  hostname: string;
  os: string;
  kernel: string;
  vulnerabilities: number;
  lastPatched: string;
  status: 'VULNERABLE' | 'PATCHING' | 'SECURE';
  maintenanceWindow: string;
}

const MOCK_NODES: PatchNode[] = [
  { id: '1', hostname: 'ftn-edge-fra-01', os: 'Ubuntu 22.04', kernel: '5.15.0-101-generic', vulnerabilities: 3, lastPatched: '45 days ago', status: 'VULNERABLE', maintenanceWindow: 'Sat 02:00 UTC' },
  { id: '2', hostname: 'ftn-core-01', os: 'Debian 12', kernel: '6.1.0-21-amd64', vulnerabilities: 0, lastPatched: '2 days ago', status: 'SECURE', maintenanceWindow: 'Sun 01:00 UTC' },
  { id: '3', hostname: 'ftn-auth-db', os: 'Alpine 3.19', kernel: '6.6.22-0-lts', vulnerabilities: 1, lastPatched: '15 days ago', status: 'VULNERABLE', maintenanceWindow: 'Sat 04:00 UTC' },
];

export function FtnSystemPatchManager() {
  const [nodes, setNodes] = useState<PatchNode[]>(MOCK_NODES);
  const [isPatching, setIsPatching] = useState<string | null>(null);

  const handlePatch = (id: string) => {
    setIsPatching(id);
    setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'PATCHING' } : n));
    
    setTimeout(() => {
      setNodes(prev => prev.map(n => n.id === id ? { ...n, status: 'SECURE', vulnerabilities: 0, lastPatched: 'Just now' } : n));
      setIsPatching(null);
      
      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: { type: 'success', title: 'Patch Applied', message: 'Security updates installed and verified successfully.' }
        })
      );
    }, 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-gradient-to-br from-[#091122] via-[#0b1730] to-[#080e1c] border border-gray-800/90 rounded-3xl p-6 shadow-2xl">
         <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-[0_0_25px_rgba(239,68,68,0.4)]">
               <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
               <h1 className="text-2xl font-black text-white font-display">System Patch Manager</h1>
               <p className="text-gray-400 font-mono text-sm">Automated security remediation and OS vulnerability patching.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
               <Server className="w-8 h-8 text-gray-500" />
               <div>
                  <div className="text-2xl font-bold text-white">{nodes.length}</div>
                  <div className="text-xs text-gray-400 font-mono uppercase">Managed Nodes</div>
               </div>
            </div>
            <div className="bg-red-950/20 border border-red-900/50 rounded-xl p-4 flex items-center gap-4">
               <AlertTriangle className="w-8 h-8 text-red-500" />
               <div>
                  <div className="text-2xl font-bold text-red-400">{nodes.reduce((acc, n) => acc + n.vulnerabilities, 0)}</div>
                  <div className="text-xs text-gray-400 font-mono uppercase">Pending CVEs</div>
               </div>
            </div>
            <div className="bg-emerald-950/20 border border-emerald-900/50 rounded-xl p-4 flex items-center gap-4">
               <ShieldCheck className="w-8 h-8 text-[#00ff66]" />
               <div>
                  <div className="text-2xl font-bold text-[#00ff66]">{Math.round((nodes.filter(n => n.status === 'SECURE').length / nodes.length) * 100)}%</div>
                  <div className="text-xs text-gray-400 font-mono uppercase">Fleet Compliance</div>
               </div>
            </div>
         </div>

         <div className="space-y-3">
            {nodes.map(node => (
               <div key={node.id} className="bg-black/60 border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                     <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white font-display">{node.hostname}</span>
                        <span className={cn("text-[10px] font-bold font-mono px-2 py-0.5 rounded border", node.status === 'SECURE' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : node.status === 'PATCHING' ? "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse" : "bg-red-500/10 text-red-400 border-red-500/30")}>
                           {node.status}
                        </span>
                     </div>
                     <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-400">
                        <span>OS: <span className="text-gray-200">{node.os}</span></span>
                        <span>Kernel: <span className="text-gray-200">{node.kernel}</span></span>
                        <span>Last Patched: <span className="text-gray-200">{node.lastPatched}</span></span>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <div className="text-right hidden sm:block">
                        <div className="text-[10px] text-gray-500 font-mono uppercase">Maintenance Window</div>
                        <div className="text-xs font-mono text-[#00f0ff] flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> {node.maintenanceWindow}</div>
                     </div>
                     
                     <button
                        onClick={() => handlePatch(node.id)}
                        disabled={node.status === 'SECURE' || isPatching === node.id}
                        className={cn("px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-2", node.status === 'SECURE' ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]")}
                     >
                        {isPatching === node.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                        {node.status === 'SECURE' ? 'Up to Date' : isPatching === node.id ? 'Installing...' : `Patch ${node.vulnerabilities} CVEs`}
                     </button>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
