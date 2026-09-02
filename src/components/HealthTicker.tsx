import React, { useState, useEffect } from 'react';
import { Activity, Clock, Zap, AlertTriangle } from 'lucide-react';

export function HealthTicker() {
  const [metrics, setMetrics] = useState({
    uptime: '99.998%',
    latency: '1.2 ms',
    packetLoss: '0.001%',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate small, realistic telemetry updates
      setMetrics({
        uptime: '99.998%',
        latency: `${(1.2 + Math.random() * 0.5).toFixed(1)} ms`,
        packetLoss: `${(0.001 + Math.random() * 0.002).toFixed(3)}%`,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800/60 px-6 py-2 flex items-center justify-between text-[11px] font-mono text-gray-400">
       <div className="flex items-center gap-6">
         <span className="flex items-center gap-2 text-[#00ff66]">
           <Activity className="w-3.5 h-3.5" /> FTN GRID LIVE
         </span>
         <span className="flex items-center gap-2">
           <Clock className="w-3.5 h-3.5" /> UPTIME: {metrics.uptime}
         </span>
       </div>
       <div className="flex items-center gap-6">
         <span className="flex items-center gap-2">
           <Zap className="w-3.5 h-3.5 text-[#00f0ff]" /> LATENCY: <span className="text-white">{metrics.latency}</span>
         </span>
         <span className="flex items-center gap-2">
           <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" /> LOSS: <span className="text-white">{metrics.packetLoss}</span>
         </span>
       </div>
    </div>
  );
}
