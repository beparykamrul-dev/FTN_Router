import React, { useState } from 'react';
import { HardDrive, Database, Server, Cpu, Activity, ShieldCheck, RefreshCw, Zap, Radio } from 'lucide-react';
import { cn } from '../utils';

export function HostingManager() {
  const [offloadRate, setOffloadRate] = useState(62.8);
  const [dripRate, setDripRate] = useState(5000);
  const [activeTab, setActiveTab] = useState<'pools' | 'storage' | 'edge'>('pools');

  const handleAction = (msg: string) => {
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'info',
        title: 'Hosting Action Triggered',
        message: msg
      }
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-gray-800/80 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-white tracking-wide">
              Edge Cloud Hosting & Storage Arrays
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              PgBouncer connection pooling, 60% database offload, Drip rate-shaping, and TrueNAS / Synology QuickConnect storage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pools')}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-mono transition-all", activeTab === 'pools' ? "bg-orange-500 text-white font-bold" : "text-gray-400 hover:text-white bg-gray-900")}
          >
            PgBouncer & Drip
          </button>
          <button
            onClick={() => setActiveTab('storage')}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-mono transition-all", activeTab === 'storage' ? "bg-orange-500 text-white font-bold" : "text-gray-400 hover:text-white bg-gray-900")}
          >
            TrueNAS & Synology
          </button>
        </div>
      </div>

      {activeTab === 'pools' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-400" />
                PgBouncer Connection Pools & Memory-to-Memory Cache
              </h3>
              <span className="text-xs font-mono text-[#00ff66] bg-[#00ff66]/10 px-2.5 py-1 rounded-full border border-[#00ff66]/30">
                OFFLOADING ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-gray-900/80 rounded-xl border border-gray-800">
                <span className="text-[11px] text-gray-400 font-mono">BACKEND OFFLOAD</span>
                <div className="text-xl font-bold font-mono text-[#00ff66] mt-1">{offloadRate}%</div>
                <p className="text-[10px] text-gray-500 mt-1">Queries served from memory cache</p>
              </div>

              <div className="p-4 bg-gray-900/80 rounded-xl border border-gray-800">
                <span className="text-[11px] text-gray-400 font-mono">CLIENT CONCURRENCY</span>
                <div className="text-xl font-bold font-mono text-[#00f0ff] mt-1">12,480 conns</div>
                <p className="text-[10px] text-gray-500 mt-1">Pooled to 32 backend sockets</p>
              </div>

              <div className="p-4 bg-gray-900/80 rounded-xl border border-gray-800">
                <span className="text-[11px] text-gray-400 font-mono">DRIP RATE SHAPING</span>
                <div className="text-xl font-bold font-mono text-orange-400 mt-1">{dripRate} req/s</div>
                <p className="text-[10px] text-gray-500 mt-1">Strict token-bucket limiter</p>
              </div>
            </div>

            <div className="p-4 bg-black rounded-xl border border-gray-800 font-mono text-xs text-gray-300 space-y-2">
              <div className="text-gray-500 uppercase tracking-widest text-[10px] border-b border-gray-800 pb-1">Pool Status (SHOW POOLS)</div>
              <div className="grid grid-cols-5 text-gray-400 text-[11px]">
                <span>DATABASE</span>
                <span>USER</span>
                <span>CL_ACTIVE</span>
                <span>SV_ACTIVE</span>
                <span className="text-right">MAXWAIT</span>
              </div>
              <div className="grid grid-cols-5 text-white">
                <span className="text-[#00f0ff]">ftn_billing</span>
                <span>app_rw</span>
                <span>4,120</span>
                <span>8</span>
                <span className="text-right text-[#00ff66]">0.12 ms</span>
              </div>
              <div className="grid grid-cols-5 text-white">
                <span className="text-[#00f0ff]">ftn_telemetry</span>
                <span>goflow2</span>
                <span>6,910</span>
                <span>16</span>
                <span className="text-right text-[#00ff66]">0.08 ms</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Drip Policy Controls
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-mono block mb-1">Target Memory Cache Offload Ratio</label>
                <input
                  type="range"
                  min="40"
                  max="95"
                  value={offloadRate}
                  onChange={(e) => setOffloadRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 font-mono block mb-1">Token Bucket Burst Limit</label>
                <input
                  type="range"
                  min="1000"
                  max="20000"
                  step="500"
                  value={dripRate}
                  onChange={(e) => setDripRate(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                />
              </div>

              <button
                onClick={() => handleAction('PgBouncer Config Reloaded')}
                className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs rounded-lg transition-all shadow-md"
              >
                Apply Drip Policy & Reload
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'storage' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white font-mono">TrueNAS SCALE ZFS Cluster</h3>
              </div>
              <span className="text-xs font-mono text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/30">ONLINE</span>
            </div>
            <p className="text-xs text-gray-400">RAID-Z2 pool with 8x 18TB NVMe cached drives. Providing iSCSI and NFS volumes for Proxmox VE VMs.</p>
            <div className="p-3 bg-gray-900 rounded-xl text-xs font-mono text-gray-300 space-y-1">
              <div className="flex justify-between"><span>Pool Usage:</span><span className="text-[#00f0ff]">48.2 TB / 108 TB</span></div>
              <div className="flex justify-between"><span>ZFS ARC Cache Hit:</span><span className="text-[#00ff66]">99.4%</span></div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white font-mono">Synology QuickConnect & Resilio</h3>
              </div>
              <span className="text-xs font-mono text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/30">SYNCED</span>
            </div>
            <p className="text-xs text-gray-400">Offsite backup sync with automated Magic Wormhole tunnel fallback and ruTorrent seedbox offload.</p>
            <div className="p-3 bg-gray-900 rounded-xl text-xs font-mono text-gray-300 space-y-1">
              <div className="flex justify-between"><span>QuickConnect ID:</span><span className="text-white">ftn-edge-backup</span></div>
              <div className="flex justify-between"><span>Resilio Peer Count:</span><span className="text-[#00f0ff]">14 nodes active</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
