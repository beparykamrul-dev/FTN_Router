import React, { useState } from 'react';
import { Bot, Brain, RefreshCw } from 'lucide-react';

export function AiNetworkAgent() {
  const [remediation, setRemediation] = useState<string>('System stable. Awaiting telemetry input.');

  const runRemediation = () => {
    setRemediation('Analyzing edge tunnel telemetry... \n\n[DETECTED]: OLT-GPON-04 Power Supply A degradation.\n[ACTION]: Initiating failover to Redundant Supply B. Announcing BGP route update.');
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 h-full">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Bot className="w-6 h-6 text-purple-400" />
        AI Network Agent
      </h2>
      <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 text-sm font-mono text-purple-300 h-48 overflow-y-auto mb-4">
        {remediation}
      </div>
      <button 
        onClick={runRemediation}
        className="w-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 p-3 rounded-xl border border-purple-500/30 flex items-center justify-center gap-2"
      >
        <Brain className="w-5 h-5" /> Execute Remediation Plan
      </button>
    </div>
  );
}
