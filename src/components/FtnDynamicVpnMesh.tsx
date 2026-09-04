import React from 'react';
import { Network } from 'lucide-react';

export const FtnDynamicVpnMesh = () => (
  <div className="p-6 bg-[#0c1017] border border-[#1e2530] rounded-xl shadow-lg">
    <div className="flex items-center gap-2 mb-4">
      <Network className="text-[#00f0ff]" />
      <h2 className="text-xl font-bold text-[#00f0ff]">FTN Dynamic VPN Mesh</h2>
    </div>
    <div className="text-white">Active Mesh Nodes: 14 | Protocol: Hybrid</div>
  </div>
);
