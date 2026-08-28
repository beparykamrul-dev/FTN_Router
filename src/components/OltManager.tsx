import React from 'react';
import { Cpu, Wifi, Zap, Settings2 } from 'lucide-react';
import { mockOltDevices } from '../data/mockData';
import { cn } from '../utils';

export function OltManager() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-white mb-1">Multi-Vendor OLT Core</h1>
        <p className="text-gray-400 text-sm font-mono">Huawei, ZTE, Fiberhome & BDCOM Provisioning</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {mockOltDevices.map(olt => (
          <div key={olt.id} className="glass-panel p-5 rounded-xl border border-gray-800/60">
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-800/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Cpu className="w-5 h-5 text-[#00f0ff]" />
                  <h3 className="font-semibold text-gray-200 text-lg">{olt.name}</h3>
                </div>
                <p className="text-xs text-gray-500 font-mono">IP: {olt.ipAddress} | Vendor: <span className="text-white font-semibold">{olt.vendor}</span></p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={cn(
                  "px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider",
                  olt.status === 'ONLINE' ? "bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                )}>
                  {olt.status}
                </span>
                <span className="text-xs font-mono text-gray-400">Uplink: <span className="text-[#00f0ff]">{olt.uplinkUsage}%</span></span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-300">PON Port Status</h4>
              <div className="grid grid-cols-1 gap-3">
                {olt.ports.map(port => (
                  <div key={port.portId} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 border border-gray-700/40 hover:border-gray-600/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]",
                        port.status === 'UP' ? "bg-[#00ff66] text-[#00ff66]" : "bg-red-500 text-red-500"
                      )} />
                      <span className="font-mono text-sm text-gray-200 font-bold">{port.portId}</span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500 block uppercase">Active ONTs</span>
                        <span className="text-sm font-mono text-white">{port.activeOnts} / 128</span>
                      </div>
                      <div className="text-right w-16">
                        <span className="text-[10px] text-gray-500 block uppercase">TX Power</span>
                        <span className="text-sm font-mono text-yellow-400">{port.txPower}</span>
                      </div>
                      <div className="text-right w-16">
                        <span className="text-[10px] text-gray-500 block uppercase">RX Avg</span>
                        <span className="text-sm font-mono text-[#00f0ff]">{port.rxPower}</span>
                      </div>
                      <button className="p-1.5 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors" title="Port Configuration">
                        <Settings2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-800/50 flex gap-3">
              <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Wifi className="w-3.5 h-3.5" /> Find Unconfigured ONTs
              </button>
              <button className="flex-1 bg-[#0088ff] hover:bg-[#0066cc] text-white text-xs font-semibold py-2 rounded-lg transition-colors shadow-[0_0_15px_rgba(0,136,255,0.3)] flex items-center justify-center gap-2">
                <Zap className="w-3.5 h-3.5" /> Auto-Provision Profiles
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
