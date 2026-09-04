import React from 'react';
import { Activity } from 'lucide-react';

export const FtnTunnelHealthWidget = () => (
  <div className="p-4 bg-[#0c1017] border border-[#1e2530] rounded-xl shadow-lg">
    <div className="flex items-center gap-2 mb-2">
      <Activity className="text-[#48bb78]" />
      <h3 className="font-bold text-[#48bb78]">Tunnel Health</h3>
    </div>
    <div className="text-white text-sm">Throughput: 850 Mbps | Loss: 0.05%</div>
  </div>
);
