import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Disc, Shield, Cpu, Activity, Play, CheckCircle2, Server, HardDrive, RefreshCw } from 'lucide-react';
import { cn } from '../utils';

type BuildTarget = 'ANDROID' | 'EXE' | 'ISO' | 'FIREWALL';

export function OmniBuilder() {
  const [target, setTarget] = useState<BuildTarget>('ANDROID');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildStep, setBuildStep] = useState(0);
  const [androidStatus, setAndroidStatus] = useState<any>(null);
  const [isLoadingAndroidStatus, setIsLoadingAndroidStatus] = useState(false);

  const fetchAndroidStatus = async () => {
    setIsLoadingAndroidStatus(true);
    try {
      const res = await fetch('/api/v1/ftn/android/status', {
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        setAndroidStatus(data);
      }
    } catch (e: any) {
      setAndroidStatus({ error: e.message });
    } finally {
      setIsLoadingAndroidStatus(false);
    }
  };

  useEffect(() => {
    if (target === 'ANDROID') {
      fetchAndroidStatus();
    }
  }, [target]);

  const startBuild = () => {
    setIsBuilding(true);
    setBuildStep(0);
    
    // Simulate build pipeline
    const intervals = [1500, 3000, 4500, 6000];
    intervals.forEach((time, index) => {
      setTimeout(() => setBuildStep(index + 1), time);
    });
    setTimeout(() => setIsBuilding(false), 7000);
  };

  const targets = [
    { id: 'ANDROID', name: 'Android App', icon: Smartphone, desc: 'Native Kotlin/Go Mobile Client' },
    { id: 'EXE', name: 'Windows .exe', icon: Monitor, desc: 'Compiled Go/Rust Executable' },
    { id: 'ISO', name: 'Bootable .iso', icon: Disc, desc: 'Custom FTN Linux OS Image' },
    { id: 'FIREWALL', name: 'Router Firewall', icon: Shield, desc: 'OPNsense/MikroTik Ruleset' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-white mb-1 text-glow flex items-center gap-3">
          <Server className="w-6 h-6 text-[#00ff66]" /> Backbone SiLK Omni-Builder
        </h1>
        <p className="text-gray-400 text-sm font-mono max-w-3xl">
          Automated cross-platform compiler. Analyzes local device drivers, telemetry metrics, and SiLK flows to generate highly optimized, low-latency client apps, OS images, and firewall logic.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Target Selection */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-gray-300 font-mono text-sm tracking-widest uppercase border-b border-gray-800 pb-2">Select Target</h3>
          
          <div className="space-y-3">
            {targets.map(t => {
              const Icon = t.icon;
              const isActive = target === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => !isBuilding && setTarget(t.id as BuildTarget)}
                  disabled={isBuilding}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 group",
                    isActive 
                      ? "bg-[#00f0ff]/10 border-[#00f0ff]/50 shadow-[0_0_15px_rgba(0,240,255,0.15)]" 
                      : "glass-panel border-gray-800/60 hover:border-gray-600 opacity-70 hover:opacity-100"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isActive ? "bg-[#00f0ff]/20 text-[#00f0ff]" : "bg-gray-800 text-gray-400 group-hover:text-gray-200"
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={cn("font-bold", isActive ? "text-white" : "text-gray-300")}>{t.name}</h4>
                    <p className="text-[10px] text-gray-500 font-mono">{t.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Driver Analysis & Build Console */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-gray-300 font-mono text-sm tracking-widest uppercase border-b border-gray-800 pb-2 flex justify-between items-center">
            <span>Hardware & Metric Analysis</span>
            <span className="text-[10px] text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/30">LIVE TELEMETRY</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-gray-800/60">
              <div className="flex items-center gap-2 mb-3 text-gray-300 font-semibold text-sm">
                <Cpu className="w-4 h-4 text-[#00f0ff]" /> Kernel & Driver Profiling
              </div>
              <ul className="space-y-2 text-xs font-mono text-gray-400">
                <li className="flex justify-between"><span>Architecture:</span> <span className="text-white">x86_64 / ARM64</span></li>
                <li className="flex justify-between"><span>Network Offload:</span> <span className="text-[#00ff66]">Available (DPDK)</span></li>
                <li className="flex justify-between"><span>GPU Acceleration:</span> <span className="text-yellow-400">VAAPI/QSV Active</span></li>
              </ul>
            </div>
            
            <div className="glass-panel p-4 rounded-xl border border-gray-800/60">
              <div className="flex items-center gap-2 mb-3 text-gray-300 font-semibold text-sm">
                <Activity className="w-4 h-4 text-purple-400" /> SiLK Flow Metrics
              </div>
              <ul className="space-y-2 text-xs font-mono text-gray-400">
                <li className="flex justify-between"><span>Avg Local Latency:</span> <span className="text-white">2.4ms</span></li>
                <li className="flex justify-between"><span>Jumbo Frames:</span> <span className="text-[#00ff66]">Enabled (9000 MTU)</span></li>
                <li className="flex justify-between"><span>BGP Convergence:</span> <span className="text-white">Optimal</span></li>
              </ul>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-xl border border-gray-800/60 bg-gray-950 flex flex-col min-h-[250px]">
             <div className="flex justify-between items-center mb-4">
               <h4 className="font-bold text-gray-200 text-sm">Compiler Pipeline</h4>
               <button 
                 onClick={startBuild}
                 disabled={isBuilding}
                 className="bg-gradient-to-r from-[#00ff66] to-[#00cc55] hover:from-[#00ff66] hover:to-[#00aa44] text-gray-950 font-bold px-4 py-1.5 rounded text-xs transition-all shadow-[0_0_10px_rgba(0,255,102,0.3)] disabled:opacity-50 flex items-center gap-2"
               >
                 <Play className="w-3.5 h-3.5" /> Execute Build
               </button>
             </div>

             <div className="flex-1 space-y-4">
               {[
                 { step: 1, label: 'Profiling local hardware drivers & SiLK metrics...' },
                 { step: 2, label: `Injecting Go/Rust optimizations for ${target}...` },
                 { step: 3, label: 'Compiling binaries and bundling assets...' },
                 { step: 4, label: 'Signing package and deploying to edge cache.' },
               ].map(s => (
                 <div key={s.step} className="flex items-center gap-3">
                   <div className={cn(
                     "w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-bold transition-colors",
                     buildStep > s.step ? "bg-[#00ff66] border-[#00ff66] text-black" :
                     buildStep === s.step ? "bg-transparent border-[#00f0ff] text-[#00f0ff] animate-pulse" :
                     "bg-transparent border-gray-700 text-gray-600"
                   )}>
                     {buildStep > s.step ? <CheckCircle2 className="w-4 h-4" /> : s.step}
                   </div>
                   <span className={cn(
                     "text-xs font-mono transition-colors",
                     buildStep >= s.step ? "text-gray-300" : "text-gray-600"
                   )}>
                     {s.label}
                   </span>
                 </div>
               ))}
             </div>

             {buildStep > 4 && (
               <div className="mt-4 p-3 bg-[#00ff66]/10 border border-[#00ff66]/30 rounded-lg flex items-center justify-between">
                 <span className="text-[#00ff66] text-xs font-mono font-bold">Build Successful! Artifact ready for deployment.</span>
                 <button className="text-xs text-gray-900 font-bold bg-[#00ff66] px-3 py-1 rounded">Download {target}</button>
               </div>
             )}
          </div>

          {target === 'ANDROID' && (
            <div className="glass-panel p-5 rounded-xl border border-gray-800 bg-gray-950/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#00f0ff]" />
                  <span className="text-sm font-semibold text-white">Flutter Mobile Client (FTNEnterpriseApp)</span>
                  <span className="text-[10px] bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 px-2 py-0.5 rounded font-mono">
                    /api/v1/ftn/android/status
                  </span>
                </div>
                <button
                  onClick={fetchAndroidStatus}
                  className="p-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                  title="Refresh status"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", isLoadingAndroidStatus && "animate-spin text-[#00f0ff]")} />
                </button>
              </div>

              {androidStatus && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800">
                    <span className="text-gray-500 block text-[10px]">SERVICE STATUS</span>
                    <span className="text-[#00ff66] font-semibold">{androidStatus.service} - {androidStatus.status}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800">
                    <span className="text-gray-500 block text-[10px]">INTEGRATED MODULES</span>
                    <span className="text-[#00f0ff] font-semibold">{androidStatus.tools?.length ?? 0} Modules Reported</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-gray-900 border border-gray-800">
                    <span className="text-gray-500 block text-[10px]">TRANSPORT PROTOCOL</span>
                    <span className="text-purple-400 font-semibold">{androidStatus.protocol ?? 'WireGuard/QUIC'}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
