import React, { useState, useEffect } from 'react';
import { Cpu, RotateCcw, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface AutoHealLog {
  id: number;
  time: string;
  node: string;
  issue: string;
  action: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export function AutoHealingPanel() {
  const [logs, setLogs] = useState<AutoHealLog[]>([
    { id: 1, time: new Date(Date.now() - 120000).toLocaleTimeString(), node: 'SG-Edge-01', issue: 'Memory Leak Detected (>90%)', action: 'Garbage Collection & Service Restart', status: 'SUCCESS' },
    { id: 2, time: new Date(Date.now() - 450000).toLocaleTimeString(), node: 'BGP-Route-Core', issue: 'High Latency on Peer AS9498', action: 'Traffic Rerouted to Backup Transit', status: 'SUCCESS' },
  ]);
  const [systemHealth, setSystemHealth] = useState(99.9);

  // Simulate AI detecting and fixing an issue
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSystemHealth(94.2);
      
      const newLog: AutoHealLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        node: 'DNS-Mesh-EU',
        issue: 'Response Time > 50ms',
        action: 'Scaling up Anycast Pods...',
        status: 'PENDING'
      };
      
      setLogs(prev => [newLog, ...prev]);

      // Resolve it after 3 seconds
      setTimeout(() => {
        setLogs(prev => prev.map(log => log.id === newLog.id ? { ...log, action: 'Scaled up Anycast Pods (Resolved)', status: 'SUCCESS' } : log));
        setSystemHealth(99.99);
      }, 3000);

    }, 8000); // trigger anomaly 8s after mount

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="glass-panel p-6 rounded-xl border border-gray-800/60 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#a855f7]" />
            AI Auto-Healing Engine
          </h3>
          <p className="text-sm text-gray-400 font-mono">Real-time anomaly detection & autonomous remediation</p>
        </div>
        <div className={`px-3 py-1.5 rounded flex items-center gap-2 font-mono text-xs border ${systemHealth > 99 ? 'bg-[#00ff66]/10 border-[#00ff66]/30 text-[#00ff66]' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
          {systemHealth > 99 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />}
          AI Confidence: {systemHealth}%
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-gray-900/60 border border-gray-800 rounded-lg p-3 text-sm font-mono">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[#00f0ff]">{log.node}</span>
              <span className="text-gray-500 text-xs">{log.time}</span>
            </div>
            <div className="text-gray-300 mb-1 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-yellow-500" />
              {log.issue}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-gray-400 flex items-center gap-2">
                <RotateCcw className={`w-3.5 h-3.5 ${log.status === 'PENDING' ? 'animate-spin text-purple-400' : 'text-gray-500'}`} />
                {log.action}
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded ${
                log.status === 'SUCCESS' ? 'bg-[#00ff66]/10 text-[#00ff66]' :
                log.status === 'PENDING' ? 'bg-purple-500/10 text-purple-400' :
                'bg-red-500/10 text-red-500'
              }`}>
                {log.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
