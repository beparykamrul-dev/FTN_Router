import React, { useState } from 'react';
import { Bot, AlertTriangle, Zap, Activity } from 'lucide-react';
import { AiNocAlert } from '../types.js';

export const FtnAiPredictiveNoc = () => {
  const [alerts, setAlerts] = useState<AiNocAlert[]>([
    { id: '1', severity: 'high', message: 'Degradation detected in BGP Peer AS64512', timestamp: '10:05' },
    { id: '2', severity: 'medium', message: 'High CPU on Core Router-A', timestamp: '09:55' },
  ]);

  return (
    <div className="p-6 bg-[#0c1017] border border-[#1e2530] rounded-xl shadow-lg space-y-4">
      <div className="flex items-center gap-2">
        <Bot className="text-[#9f7aea]" />
        <h2 className="text-xl font-bold text-[#9f7aea]">FTN AI Predictive NOC</h2>
      </div>
      <div className="space-y-2">
        {alerts.map(a => (
          <div key={a.id} className="p-3 bg-[#1a202c] rounded-lg border border-[#2d3748] flex items-center gap-3">
            <AlertTriangle className={a.severity === 'high' ? 'text-red-500' : 'text-yellow-500'} />
            <div>
              <p className="font-medium text-white">{a.message}</p>
              <p className="text-xs text-gray-400">{a.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
