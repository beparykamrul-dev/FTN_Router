import React from 'react';
import { BrainCircuit } from 'lucide-react';

export const FtnAiDynamicProxy = () => (
  <div className="p-6 bg-[#0c1017] border border-[#1e2530] rounded-xl shadow-lg">
    <div className="flex items-center gap-2 mb-4">
      <BrainCircuit className="text-[#9f7aea]" />
      <h2 className="text-xl font-bold text-[#9f7aea]">FTN AI Dynamic Proxy</h2>
    </div>
    <p className="text-gray-400">AI path optimization active. Routing optimized for latency.</p>
  </div>
);
