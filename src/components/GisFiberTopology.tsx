import React, { useState, useEffect } from 'react';
import { MapPin, Zap, AlertTriangle, Layers, Activity } from 'lucide-react';
import { cn } from '../utils';

export function GisFiberTopology() {
  const [activeLayer, setActiveLayer] = useState<'FIBER' | 'LATENCY'>('LATENCY');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setPulse(p => !p), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1 text-glow-blue">GIS Global Peering Topology</h1>
          <p className="text-gray-400 text-sm font-mono">Real-time Global BGP Latency Heatmap & Edge Nodes</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveLayer(activeLayer === 'FIBER' ? 'LATENCY' : 'FIBER')}
            className={cn("px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 border", activeLayer === 'LATENCY' ? "bg-purple-500/20 text-purple-400 border-purple-500/50" : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700")}
          >
            <Activity className="w-4 h-4" /> Heatmap View: {activeLayer}
          </button>
          <button className="bg-[#0088ff] hover:bg-[#0066cc] text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
            <Zap className="w-4 h-4" /> Refresh BGP Routes
          </button>
        </div>
      </div>

      <div className="flex-1 glass-panel border border-gray-800/60 rounded-xl relative overflow-hidden flex items-center justify-center group bg-[#050914]">
        
        {/* Simulated Map Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        
        {/* Heatmap Layer (Active when LATENCY is selected) */}
        {activeLayer === 'LATENCY' && (
          <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none transition-opacity duration-1000">
             <div className="absolute top-[20%] left-[30%] w-96 h-96 bg-purple-600 rounded-full blur-[100px]" />
             <div className="absolute top-[50%] left-[60%] w-[500px] h-[500px] bg-[#00f0ff] rounded-full blur-[120px] opacity-50" />
             <div className="absolute top-[30%] left-[70%] w-64 h-64 bg-red-600 rounded-full blur-[80px] opacity-30" />
          </div>
        )}

        {/* Simulated Map Elements */}
        <div className="relative z-10 w-full h-full p-8 flex items-center justify-center">
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 5px rgba(0,240,255,0.5))' }}>
             <defs>
               <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                 <stop offset="0%" stopColor="#00f0ff" />
                 <stop offset="100%" stopColor="#a855f7" />
               </linearGradient>
             </defs>
             <path d="M 300,300 L 500,200 L 700,350 L 900,250" fill="none" stroke="url(#grad1)" strokeWidth={activeLayer === 'LATENCY' ? 4 : 2} strokeDasharray={activeLayer === 'LATENCY' ? "none" : "5,5"} className={cn("transition-all duration-1000", activeLayer === 'LATENCY' ? "opacity-80" : "animate-[dash_20s_linear_infinite]")} />
             <path d="M 300,300 L 400,500 L 650,450" fill="none" stroke="#00ff66" strokeWidth={activeLayer === 'LATENCY' ? 3 : 2} className="transition-all duration-1000" />
             <path d="M 700,350 L 800,550" fill="none" stroke={activeLayer === 'LATENCY' ? "#ef4444" : "#ff4444"} strokeWidth={activeLayer === 'LATENCY' ? 6 : 2} strokeDasharray={activeLayer === 'LATENCY' ? "none" : "4,4"} className="transition-all duration-1000" />
          </svg>

          {/* Nodes */}
          <div className="absolute top-[300px] left-[300px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-6 h-6 bg-[#00f0ff] rounded shadow-[0_0_20px_#00f0ff] flex items-center justify-center animate-pulse z-20">
               <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="mt-2 text-xs font-mono text-[#00f0ff] bg-gray-900/80 px-2 py-0.5 rounded border border-[#00f0ff]/30 backdrop-blur">CORE-BDIX</span>
            {activeLayer === 'LATENCY' && <span className="text-[10px] text-purple-300 font-mono mt-0.5 bg-purple-900/50 px-1 rounded">1.2ms</span>}
          </div>

          <div className="absolute top-[200px] left-[500px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-5 h-5 bg-[#00ff66] rounded-full shadow-[0_0_15px_#00ff66] border-2 border-white z-20" />
            <span className="mt-2 text-xs font-mono text-[#00ff66] bg-gray-900/80 px-2 py-0.5 rounded border border-[#00ff66]/30 backdrop-blur">SG-Cloudflare</span>
            {activeLayer === 'LATENCY' && <span className="text-[10px] text-green-300 font-mono mt-0.5 bg-green-900/50 px-1 rounded">28ms</span>}
          </div>

          <div className="absolute top-[350px] left-[700px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="w-5 h-5 bg-[#00ff66] rounded-full shadow-[0_0_15px_#00ff66] border-2 border-white z-20" />
            <span className="mt-2 text-xs font-mono text-[#00ff66] bg-gray-900/80 px-2 py-0.5 rounded border border-[#00ff66]/30 backdrop-blur">IN-Akamai</span>
            {activeLayer === 'LATENCY' && <span className="text-[10px] text-yellow-300 font-mono mt-0.5 bg-yellow-900/50 px-1 rounded">45ms</span>}
          </div>

          <div className="absolute top-[550px] left-[800px] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className={cn("w-6 h-6 rounded-full border-2 border-white flex items-center justify-center z-20 transition-all", activeLayer === 'LATENCY' ? "bg-red-600 shadow-[0_0_30px_#dc2626]" : "bg-red-500 shadow-[0_0_20px_red] animate-bounce")}>
              {activeLayer === 'LATENCY' ? <Activity className="w-3 h-3 text-white animate-pulse" /> : <AlertTriangle className="w-3 h-3 text-white" />}
            </div>
            <span className="mt-2 text-xs font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-500/30 backdrop-blur">EU-Congestion</span>
            {activeLayer === 'LATENCY' && <span className="text-[10px] text-red-300 font-mono mt-0.5 bg-red-900/80 px-1 rounded font-bold">240ms (High)</span>}
          </div>

        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-6 left-6 glass-panel p-4 rounded-xl border border-gray-800/60 z-30">
          <h4 className="text-sm font-semibold text-gray-200 mb-3">Map Legend</h4>
          <div className="space-y-2 text-xs font-mono text-gray-400">
            <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#00f0ff] rounded shadow-[0_0_10px_#00f0ff]"></div> Local Autonomous Core</div>
            <div className="flex items-center gap-3"><div className="w-3 h-3 bg-[#00ff66] rounded-full shadow-[0_0_10px_#00ff66]"></div> Peered Provider Edge</div>
            <div className="flex items-center gap-3"><div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_red]"></div> High Latency / Congestion</div>
            <div className="flex items-center gap-3"><div className="w-4 h-0.5 bg-[#00ff66]"></div> Active BGP Session</div>
            <div className="flex items-center gap-3"><div className="w-4 h-0.5 bg-[#00f0ff] border-t border-dashed border-[#00f0ff]"></div> Dynamic Tunnel Path</div>
          </div>
        </div>

        {/* Telemetry Overlay */}
        <div className="absolute top-6 right-6 glass-panel p-4 rounded-xl border border-gray-800/60 w-64 z-30">
          <h4 className="text-sm font-semibold text-[#00f0ff] mb-3 flex items-center gap-2"><MapPin className="w-4 h-4" /> Selected Node: CORE-BDIX</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-400 font-mono mb-1">
                <span>Total Peers</span>
                <span className="text-gray-200">1,402</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 font-mono mb-1">
                <span>Avg Latency</span>
                <span className="text-yellow-400">1.2 ms</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-400 font-mono mb-1">
                <span>BGP Convergence</span>
                <span className="text-[#00ff66]">Optimal</span>
              </div>
            </div>
            <button className="w-full mt-2 bg-gray-800 hover:bg-gray-700 text-xs text-white py-1.5 rounded transition-colors border border-gray-700">View ASN Details</button>
          </div>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
      `}} />
    </div>
  );
}
