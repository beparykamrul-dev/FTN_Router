import React, { useState } from 'react';
import { Terminal, Cpu, Database, Activity, RefreshCw } from 'lucide-react';
import { mockNodes } from '../data/mockData';
import { cn } from '../utils';

export function MikroTikManager() {
  const router = mockNodes.find(n => n.type === 'CORE');
  const [terminalOutput, setTerminalOutput] = useState<string>('FTNDNS RouterOS API v7.14 (Core Gateway)\nadmin@172.16.0.1> /system resource print\n  uptime: 45d12h32m\n  version: 7.14.1 (stable)\n  build-time: Feb/28/2024\n  free-memory: 12.4GiB\n  total-memory: 16.0GiB\n  cpu: ARM64\n  cpu-count: 16\n  cpu-load: 24%\n  free-hdd-space: 8.2GiB\n  total-hdd-space: 16.0GiB\n');
  const [command, setCommand] = useState('');

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    
    setTerminalOutput(prev => prev + `\nadmin@172.16.0.1> ${command}\nProcessing... [OK]`);
    setCommand('');
  };

  const quickActions = [
    { label: 'Flush ARP', cmd: '/ip arp remove [find]' },
    { label: 'Print Active PPPoE', cmd: '/ppp active print count-only' },
    { label: 'BGP Prefix Refresh', cmd: '/routing bgp connection refresh [find]' },
    { label: 'Traffic Monitor', cmd: '/interface monitor-traffic ether1' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">RouterOS Auto Control</h1>
        <p className="text-gray-400 text-sm font-mono">Direct BRAS Orchestrator & BGP Peering Management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Router Stats */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-5 rounded-xl border border-gray-800/60">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-200 flex items-center gap-2"><ServerIcon className="w-4 h-4 text-[#00f0ff]" /> {router?.name}</h3>
              <span className="px-2 py-0.5 bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20 rounded text-[10px] font-mono">CONNECTED</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs text-gray-400 font-mono mb-1">
                  <span>CPU Load (16 Cores)</span>
                  <span className="text-[#00f0ff]">{router?.metrics.cpuLoad}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-[#00f0ff] h-2 rounded-full shadow-[0_0_10px_#00f0ff]" style={{ width: `${router?.metrics.cpuLoad}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-gray-400 font-mono mb-1">
                  <span>RAM Usage</span>
                  <span className="text-[#00ff66]">{router?.metrics.ramUsage}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-[#00ff66] h-2 rounded-full shadow-[0_0_10px_#00ff66]" style={{ width: `${router?.metrics.ramUsage}%` }}></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800/50 grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-gray-500 font-mono block">ACTIVE SESSIONS</span>
                  <span className="text-xl font-bold text-white font-display">{router?.metrics.activeSessions.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 font-mono block">THROUGHPUT</span>
                  <span className="text-xl font-bold text-white font-display">{router?.metrics.networkOut}G</span>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-gray-800/60">
            <h3 className="font-semibold text-gray-200 mb-3 text-sm">Quick Automations</h3>
            <div className="space-y-2">
              {quickActions.map((action, i) => (
                <button 
                  key={i}
                  onClick={() => setTerminalOutput(prev => prev + `\nadmin@172.16.0.1> ${action.cmd}\n[Executed via Quick Action]`)}
                  className="w-full flex items-center justify-between p-2 rounded bg-gray-800/40 hover:bg-gray-800/80 border border-gray-700/50 transition-colors text-left group"
                >
                  <span className="text-xs text-gray-300 font-medium">{action.label}</span>
                  <Terminal className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#00f0ff]" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* API Terminal */}
        <div className="lg:col-span-2 glass-panel p-0 rounded-xl border border-gray-800/60 flex flex-col overflow-hidden h-[500px]">
          <div className="bg-gray-900 px-4 py-2 border-b border-gray-800/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-mono text-gray-300">RouterOS API Secure Tunnel (SSH/mTLS)</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50 border border-red-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50 border border-yellow-500"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50 border border-green-500"></div>
            </div>
          </div>
          
          <div className="flex-1 bg-[#05070a] p-4 overflow-y-auto font-mono text-xs text-[#00ff66] leading-relaxed shadow-inner">
            <pre className="whitespace-pre-wrap">{terminalOutput}</pre>
          </div>
          
          <div className="bg-gray-900 border-t border-gray-800/50 p-2">
            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2">
              <span className="text-[#00f0ff] font-mono text-sm pl-2">admin@172.16.0.1&gt;</span>
              <input 
                type="text" 
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Type RouterOS command (e.g., /ip address print)..."
                className="flex-1 bg-transparent border-none outline-none text-gray-200 font-mono text-sm placeholder-gray-600 focus:ring-0"
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServerIcon(props: any) {
  return <Database {...props} />;
}
