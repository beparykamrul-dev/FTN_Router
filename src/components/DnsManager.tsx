import React, { useState, useEffect } from 'react';
import { Globe, Server, Activity, ShieldCheck, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { DnsTopologyView } from './DnsTopologyView';

const REGIONS = ['North America', 'Europe', 'Asia-Pacific', 'South America', 'Africa', 'Middle East'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => `T-${24 - i}m`);

export function DnsManager() {
  const [heatmapData, setHeatmapData] = useState<{ region: string; data: number[] }[]>([]);

  useEffect(() => {
    // Generate initial heatmap data (mostly healthy < 20ms, occasional spikes)
    const data = REGIONS.map(region => ({
      region,
      data: Array.from({ length: 24 }, () => 
        Math.random() > 0.95 ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 15) + 2
      )
    }));
    setHeatmapData(data);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setHeatmapData(prev => prev.map(row => ({
        region: row.region,
        data: [...row.data.slice(1), Math.random() > 0.98 ? Math.floor(Math.random() * 100) + 50 : Math.floor(Math.random() * 15) + 2]
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getHeatColor = (latency: number) => {
    if (latency < 10) return 'bg-[#00ff66]/80'; // Excellent
    if (latency < 30) return 'bg-[#00f0ff]/80'; // Good
    if (latency < 70) return 'bg-yellow-400/80'; // Warning
    return 'bg-red-500/80'; // Critical / Outage
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Globe className="w-8 h-8 text-[#00f0ff]" />
            Global DNS Mesh
          </h1>
          <p className="text-gray-400 font-mono mt-1 text-sm">Anycast Node Latency & Global Route Heatmap</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-500 rounded-lg font-mono text-sm transition-colors flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Emergency Kill Switch
          </button>
          <button className="px-4 py-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/30 text-[#00f0ff] rounded-lg font-mono text-sm transition-colors">
            Force Global Sync
          </button>
        </div>
      </header>

      {/* Global Heatmap */}
      <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">DNS Node Latency Heatmap</h3>
            <p className="text-sm text-gray-400 font-mono">Real-time resolution latency across global regions</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#00ff66]/80 rounded-sm"></div><span className="text-gray-400">&lt;10ms</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#00f0ff]/80 rounded-sm"></div><span className="text-gray-400">&lt;30ms</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-yellow-400/80 rounded-sm"></div><span className="text-gray-400">&lt;70ms</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500/80 rounded-sm"></div><span className="text-gray-400">Critical</span></div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Heatmap Grid */}
            <div className="flex flex-col gap-2">
              {heatmapData.map((row, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-32 text-right text-xs font-mono text-gray-400 truncate">{row.region}</div>
                  <div className="flex-1 flex gap-1">
                    {row.data.map((latency, j) => (
                      <div 
                        key={j} 
                        className={`flex-1 h-8 rounded-sm ${getHeatColor(latency)} transition-colors duration-300 relative group cursor-crosshair`}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 w-max bg-gray-900 border border-gray-700 text-white text-xs py-1 px-2 rounded font-mono shadow-xl">
                          {latency}ms
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {/* Time axis */}
              <div className="flex items-center gap-4 mt-2">
                <div className="w-32"></div>
                <div className="flex-1 flex justify-between text-[10px] font-mono text-gray-500">
                  <span>Past 24m</span>
                  <span>Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DNS Topology View */}
      <DnsTopologyView />

      {/* DNS Policy Editor */}
      <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
        <h3 className="text-lg font-semibold text-white mb-4">DNS Policy Editor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm text-gray-300">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <label className="block mb-2">Load Balancing Strategy</label>
                <select className="w-full bg-gray-950 border border-gray-800 p-2 rounded text-white">
                    <option>Round Robin</option>
                    <option>Latency-based</option>
                    <option>Geographic</option>
                </select>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <label className="block mb-2">Failover Trigger Threshold</label>
                <input type="number" defaultValue={500} className="w-full bg-gray-950 border border-gray-800 p-2 rounded text-white" />
                <span className="text-[10px] text-gray-500">Latency in ms before failover</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
          <h3 className="text-lg font-semibold text-white mb-4">Anycast Routing Status</h3>
          <div className="space-y-4">
            {['Cloudflare (1.1.1.1) Peering', 'Google (8.8.8.8) Peering', 'Quad9 (9.9.9.9) Peering'].map((peer, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                <div className="flex items-center gap-3">
                  <Server className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-mono text-gray-200">{peer}</span>
                </div>
                <span className="text-xs font-mono px-2 py-1 bg-[#00ff66]/10 text-[#00ff66] rounded">IN-SYNC</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
          <h3 className="text-lg font-semibold text-white mb-4">Global Queries / Sec</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heatmapData[0]?.data.map((_, i) => ({ time: i, queries: Math.floor(Math.random() * 50000) + 100000 })) || []}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10,14,22,0.9)', borderColor: '#1f2937' }}
                  itemStyle={{ color: '#00f0ff' }}
                />
                <Area type="monotone" dataKey="queries" stroke="#00f0ff" fillOpacity={1} fill="url(#colorQueries)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
