import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Cpu, HardDrive, Network, AlertTriangle, ShieldCheck, Zap, Server } from 'lucide-react';
import { mockAlerts } from '../data/mockData';
import { cn } from '../utils';
import { SecurityCompliancePanel } from './SecurityCompliancePanel';
import { EdgePacketInspector } from './EdgePacketInspector';
import { DnsTopologyView } from './DnsTopologyView';
import { GlobalMap } from './GlobalMap';
import { TrafficProtocolOptimizer } from './TrafficProtocolOptimizer';

const PROTOCOL_DATA = [
  { name: 'TCP', value: 65, color: '#00f0ff' },
  { name: 'UDP', value: 25, color: '#00ff66' },
  { name: 'ICMP', value: 7, color: '#ef4444' },
  { name: 'OTHER', value: 3, color: '#a855f7' },
];

const generateTrafficData = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: new Date(Date.now() - (19 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    in: Math.random() * 8 + 10,
    out: Math.random() * 6 + 8,
    ebpfDropped: Math.floor(Math.random() * 500) + 50,
  }));
};

export function SmartNocDashboard() {
  const [trafficData, setTrafficData] = useState(generateTrafficData());

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          in: Math.random() * 8 + 10,
          out: Math.random() * 6 + 8,
          ebpfDropped: Math.floor(Math.random() * 500) + 50,
        });
        return newData;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1 text-glow">Global Operations Center</h1>
          <p className="text-gray-400 text-sm font-mono">Real-time Autonomous Grid Telemetry</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00ff66]" />
            <span className="text-xs font-mono text-gray-300">SiLK Anomaly Det: <span className="text-[#00ff66]">PASS</span></span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-lg flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00f0ff]" />
            <span className="text-xs font-mono text-gray-300">AI Watchdog: <span className="text-[#00f0ff]">ACTIVE</span></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Core CPU Load', value: '24.5%', sub: 'Cluster Avg', icon: Cpu, color: 'text-[#00f0ff]', bg: 'from-[#00f0ff]/20' },
          { label: 'Memory Orchestrator', value: '45.2 GB', sub: 'RAM-to-RAM Sync', icon: HardDrive, color: 'text-[#00ff66]', bg: 'from-[#00ff66]/20' },
          { label: 'Global Traffic', value: '18.4 Gbps', sub: 'BDIX + INTL', icon: Network, color: 'text-purple-400', bg: 'from-purple-500/20' },
          { label: 'eBPF Filter Drops', value: '1.2k/s', sub: 'In-Kernel Mitigations', icon: ShieldCheck, color: 'text-red-400', bg: 'from-red-500/20' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-5 rounded-xl border border-gray-800/60 relative overflow-hidden group">
            <div className={cn("absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl to-transparent opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500", stat.bg)} />
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-gray-400 text-xs font-mono mb-1">{stat.label}</p>
                <h3 className={cn("text-3xl font-bold font-display tracking-wider", stat.color)}>{stat.value}</h3>
                <p className="text-gray-500 text-[10px] mt-1 uppercase tracking-widest">{stat.sub}</p>
              </div>
              <div className={cn("p-2 rounded-lg bg-gray-800/50", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-5 rounded-xl border border-gray-800/60 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#00ff66]/10 border-b border-x border-[#00ff66]/30 px-4 py-1 rounded-b-lg flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-[#00ff66]" />
            <span className="text-[10px] text-[#00ff66] font-mono font-bold tracking-widest uppercase">eBPF Active Traffic Routing</span>
          </div>
          <div className="flex justify-between items-center mb-6 mt-4">
            <h3 className="font-semibold text-gray-200">NetFlow v9 & eBPF Telemetry</h3>
            <div className="flex gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00f0ff]"></div> Ingress (Gbps)</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00ff66]"></div> Egress (Gbps)</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> eBPF Drops (pkts)</span>
            </div>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff66" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00ff66" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}G`} />
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" fontSize={10} tickLine={false} axisLine={false} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10, 14, 22, 0.9)', borderColor: 'rgba(0, 240, 255, 0.3)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area yAxisId="left" type="monotone" dataKey="in" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorIn)" />
                <Area yAxisId="left" type="monotone" dataKey="out" stroke="#00ff66" strokeWidth={2} fillOpacity={1} fill="url(#colorOut)" />
                <Line yAxisId="right" type="stepAfter" dataKey="ebpfDropped" stroke="#ef4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-gray-800/60 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-200">Autonomous Incident Triage</h3>
            <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded font-mono border border-red-500/30">Live Alerts</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {mockAlerts.map(alert => (
              <div key={alert.id} className="p-3 rounded-lg bg-gray-800/40 border border-gray-700/50 hover:bg-gray-800/60 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {alert.severity === 'CRITICAL' ? (
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                    ) : alert.severity === 'WARNING' ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Activity className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-xs font-mono text-gray-300">{alert.source}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-gray-300 leading-snug mb-3">{alert.message}</p>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700/50">
                  <span className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded",
                    alert.mitigationStatus === 'RESOLVED' ? "bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20" :
                    alert.mitigationStatus === 'MITIGATING' ? "bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/20 animate-pulse" :
                    "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                  )}>
                    {alert.mitigationStatus}
                  </span>
                  <button className="text-[10px] text-gray-400 hover:text-white uppercase tracking-wider">Details →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TrafficProtocolOptimizer />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EdgePacketInspector />
        <SecurityCompliancePanel />
      </div>

      <div className="grid grid-cols-1 gap-6">
         <DnsTopologyView />
      </div>

      {/* Global Map Overlay */}
      <div className="glass-panel p-5 rounded-xl border border-gray-800/60 h-96">
        <h3 className="font-semibold text-gray-200 mb-4">FTN Network Global Grid</h3>
        <GlobalMap />
      </div>

      {/* Protocol, Node Health & Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-xl border border-gray-800/60 lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-200">FTN Edge Nodes Congestion & Latency Heatmap</h3>
              <p className="text-xs text-gray-400 mt-1">Real-time bandwidth congestion (size) and latency (color) bottlenecks</p>
            </div>
            <div className="flex gap-4 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-[#00ff66]"></div> Low Latency</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-yellow-400"></div> Moderate</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded bg-red-500"></div> High Latency</span>
            </div>
          </div>
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2 h-48 overflow-y-auto pr-2 no-scrollbar">
            {Array.from({ length: 72 }).map((_, i) => {
              const baseLatency = Math.random() * 100;
              const congestion = Math.random() * 100; // 0-100% bandwidth usage
              let colorClass = "bg-[#00ff66]/20 border-[#00ff66]/40 text-[#00ff66]";
              if (baseLatency > 75) colorClass = "bg-red-500/20 border-red-500/40 text-red-500";
              else if (baseLatency > 40) colorClass = "bg-yellow-400/20 border-yellow-400/40 text-yellow-400";

              return (
                <div key={i} className="group relative">
                  <div 
                    className={cn(
                      "w-full h-full min-h-[2rem] rounded flex items-center justify-center border text-[8px] font-mono transition-all duration-300 cursor-pointer hover:scale-110 hover:z-10",
                      colorClass
                    )}
                    style={{ opacity: 0.4 + (congestion / 100) * 0.6 }}
                  >
                    N{i+1}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-gray-900 border border-gray-700 text-white text-xs rounded p-2 pointer-events-none z-20 transition-opacity">
                    <div className="font-bold border-b border-gray-700 pb-1 mb-1">Node N{i+1}</div>
                    <div className="flex justify-between"><span>Lat:</span><span className={colorClass.split(' ')[2]}>{baseLatency.toFixed(1)}ms</span></div>
                    <div className="flex justify-between"><span>BW:</span><span>{congestion.toFixed(1)}%</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-gray-800/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-200">Protocol Distribution</h3>
            <Network className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-40 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PROTOCOL_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {PROTOCOL_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(10, 14, 22, 0.9)', borderColor: 'rgba(0, 240, 255, 0.3)', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`${value}%`, 'Traffic']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-display font-bold text-white">45<span className="text-sm">G</span></span>
              <span className="text-[10px] font-mono text-gray-400">TOTAL</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {PROTOCOL_DATA.map((p, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
                <span className="text-xs font-mono text-gray-300">{p.name}</span>
                <span className="text-xs font-mono text-gray-500 ml-auto">{p.value}%</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="glass-panel p-5 rounded-xl border border-gray-800/60 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-200">FTN Core Nodes Health</h3>
            <Server className="w-4 h-4 text-gray-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-40">
            {/* CPU Gauge */}
            <div className="flex flex-col items-center justify-center bg-gray-800/30 rounded-lg border border-gray-700/30 p-4">
              <div className="h-24 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{value: 45, fill: '#00f0ff'}, {value: 55, fill: '#1f2937'}]} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} dataKey="value" stroke="none" />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-0 left-0 w-full text-center">
                  <span className="text-2xl font-bold font-mono text-[#00f0ff]">45%</span>
                </div>
              </div>
              <span className="text-xs font-mono text-gray-400 mt-2 flex items-center gap-1"><Cpu className="w-3 h-3"/> CPU UTILIZATION</span>
            </div>
            
            {/* RAM Gauge */}
            <div className="flex flex-col items-center justify-center bg-gray-800/30 rounded-lg border border-gray-700/30 p-4">
              <div className="h-24 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{value: 78, fill: '#00ff66'}, {value: 22, fill: '#1f2937'}]} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} dataKey="value" stroke="none" />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-0 left-0 w-full text-center">
                  <span className="text-2xl font-bold font-mono text-[#00ff66]">78%</span>
                </div>
              </div>
              <span className="text-xs font-mono text-gray-400 mt-2 flex items-center gap-1"><Activity className="w-3 h-3"/> MEMORY USAGE</span>
            </div>
            
            {/* Disk Gauge */}
            <div className="flex flex-col items-center justify-center bg-gray-800/30 rounded-lg border border-gray-700/30 p-4">
              <div className="h-24 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{value: 32, fill: '#a855f7'}, {value: 68, fill: '#1f2937'}]} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} dataKey="value" stroke="none" />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute bottom-0 left-0 w-full text-center">
                  <span className="text-2xl font-bold font-mono text-[#a855f7]">32%</span>
                </div>
              </div>
              <span className="text-xs font-mono text-gray-400 mt-2 flex items-center gap-1"><HardDrive className="w-3 h-3"/> DISK I/O</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
