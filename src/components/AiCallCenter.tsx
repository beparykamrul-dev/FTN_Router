import React, { useState } from 'react';
import { Phone, Mic, MessageSquare, Bot } from 'lucide-react';

export function AiCallCenter() {
  const [logs, setLogs] = useState<{from: string, message: string}[]>([
    { from: 'System', message: 'FTN AI Call Center Online. Ready for voice/text input.' }
  ]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 h-full">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Phone className="w-6 h-6 text-[#00f0ff]" />
        AI Call Center
      </h2>
      <div className="bg-gray-900/50 p-4 rounded-xl h-64 overflow-y-auto mb-4 border border-gray-800 space-y-2">
        {logs.map((log, i) => (
          <div key={i} className="text-sm font-mono text-gray-300">
            <span className="text-[#00f0ff]">[{log.from}]:</span> {log.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="flex-1 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] p-3 rounded-xl border border-[#00f0ff]/30 flex items-center justify-center gap-2">
          <Mic className="w-5 h-5" /> Start Voice Session
        </button>
        <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-xl border border-gray-700 flex items-center justify-center gap-2">
          <MessageSquare className="w-5 h-5" /> Text Interface
        </button>
      </div>
    </div>
  );
}
