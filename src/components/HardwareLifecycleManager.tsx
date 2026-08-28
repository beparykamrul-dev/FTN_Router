import React, { useState } from 'react';
import { Cpu, HardDrive, ThermometerSnowflake, AlertOctagon, Wrench, Clock, Activity, Zap } from 'lucide-react';
import { cn } from '../utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockHardware = [
  { id: 'RTR-CORE-01', type: 'Router', model: 'CCR2216-1G-12XS-2XQ', uptime: '412 days', temp: '54°C', eolDays: 840, status: 'Healthy', components: [
    { name: 'NPU (Marvell)', wear: 12, max: 100 },
    { name: 'RAM (DDR4)', wear: 8, max: 100 },
    { name: 'Cooling Fans', wear: 45, max: 100 }
  ]},
  { id: 'OLT-GPON-04', type: 'OLT', model: 'Huawei MA5800', uptime: '1,045 days', temp: '68°C', eolDays: 45, status: 'Critical', components: [
    { name: 'Control Board', wear: 88, max: 100 },
    { name: 'Power Supply A', wear: 92, max: 100 },
    { name: 'SFP+ Optics', wear: 40, max: 100 }
  ]},
  { id: 'SW-DIST-12', type: 'Switch', model: 'CRS354-48G-4S+2Q+RM', uptime: '210 days', temp: '48°C', eolDays: 1200, status: 'Healthy', components: [
    { name: 'Switch Chip', wear: 5, max: 100 },
    { name: 'PSU', wear: 15, max: 100 }
  ]},
];

const maintenanceLogs = [
  { date: '2026-08-20', device: 'OLT-GPON-04', action: 'Scheduled PSU Replacement', status: 'Pending', type: 'Hardware' },
  { date: '2026-08-15', device: 'RTR-CORE-01', action: 'Fan Dust Clearing', status: 'Completed', type: 'Maintenance' },
  { date: '2026-08-10', device: 'SW-DIST-12', action: 'Firmware Update v7.11', status: 'Completed', type: 'Software' },
];

const telemetryData = [
  { time: 'Week 1', wear: 82 },
  { time: 'Week 2', wear: 84 },
  { time: 'Week 3', wear: 86 },
  { time: 'Week 4', wear: 88 },
  { time: 'Week 5', wear: 90 },
  { time: 'Week 6', wear: 92 }, // Current state of OLT-GPON-04 Power Supply A
];

export function HardwareLifecycleManager() {
  const [selectedDevice, setSelectedDevice] = useState(mockHardware[1]); // Default to the critical one

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-wide flex items-center gap-2">
            <Cpu className="w-6 h-6 text-yellow-400" />
            Hardware Lifecycle & AI Telemetry
          </h2>
          <p className="text-gray-400 mt-1">Predictive component End-of-Life tracking and maintenance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-white font-medium mb-2">Tracked Infrastructure</h3>
          <div className="space-y-3">
            {mockHardware.map(hw => (
              <div 
                key={hw.id}
                onClick={() => setSelectedDevice(hw)}
                className={cn(
                  "p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center",
                  selectedDevice.id === hw.id ? "bg-gray-800/80 border-gray-600" : "bg-gray-900/40 border-gray-800 hover:bg-gray-800/50"
                )}
              >
                <div>
                  <h4 className="font-semibold text-gray-200">{hw.id}</h4>
                  <p className="text-xs text-gray-400">{hw.model}</p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full border",
                    hw.status === 'Healthy' ? "bg-[#00ff66]/10 border-[#00ff66]/30 text-[#00ff66]" : "bg-red-500/10 border-red-500/30 text-red-500"
                  )}>
                    {hw.status}
                  </span>
                  <p className="text-[10px] text-gray-500 mt-1">EOL in {hw.eolDays}d</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 glass-panel p-5 rounded-xl border border-gray-800/60">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              Proactive Maintenance
            </h3>
            <div className="space-y-3">
              {maintenanceLogs.map((log, i) => (
                <div key={i} className="flex justify-between items-center pb-2 border-b border-gray-800 last:border-0 last:pb-0">
                  <div>
                    <p className="text-xs text-gray-300">{log.action}</p>
                    <p className="text-[10px] font-mono text-gray-500">{log.device} | {log.date}</p>
                  </div>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded border uppercase", log.status === 'Completed' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20")}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Telemetry */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {selectedDevice.id} Telemetry
                  {selectedDevice.status === 'Critical' && <AlertOctagon className="w-5 h-5 text-red-500 animate-pulse" />}
                </h3>
                <p className="text-sm text-gray-400 font-mono mt-1">{selectedDevice.model} | Uptime: {selectedDevice.uptime}</p>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest">Core Temp</p>
                  <p className={cn("text-lg font-mono font-bold flex items-center justify-center gap-1", parseInt(selectedDevice.temp) > 65 ? "text-orange-400" : "text-[#00ff66]")}>
                    <ThermometerSnowflake className="w-4 h-4" /> {selectedDevice.temp}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest">Est. EOL</p>
                  <p className={cn("text-lg font-mono font-bold flex items-center justify-center gap-1", selectedDevice.eolDays < 90 ? "text-red-500" : "text-[#00f0ff]")}>
                    <Clock className="w-4 h-4" /> {selectedDevice.eolDays} Days
                  </p>
                </div>
              </div>
            </div>

            <h4 className="text-gray-300 font-medium mb-4">Component Wear Degradation (AI Predicted)</h4>
            <div className="space-y-4">
              {selectedDevice.components.map((comp, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{comp.name}</span>
                    <span className={cn("font-mono", comp.wear > 85 ? "text-red-500 font-bold" : "text-gray-300")}>{comp.wear}% Degraded</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={cn("h-2 rounded-full", comp.wear > 85 ? "bg-red-500" : comp.wear > 60 ? "bg-yellow-400" : "bg-[#00ff66]")} 
                      style={{ width: `${comp.wear}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {selectedDevice.status === 'Critical' && (
              <div className="mt-8 bg-red-500/10 border border-red-500/30 rounded-xl p-5">
                <h4 className="text-red-400 font-bold flex items-center gap-2 mb-3">
                  <AlertOctagon className="w-4 h-4" /> Wear Degradation Curve (Power Supply A)
                </h4>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={telemetryData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                      <XAxis dataKey="time" stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#ef4444' }} />
                      <Line type="monotone" dataKey="wear" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <p className="text-xs text-red-300">Predictive AI indicates power delivery failure within 45 days. Hardware replacement mandated.</p>
                  <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded flex items-center gap-2">
                    <Wrench className="w-4 h-4" /> Schedule Replacement
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
