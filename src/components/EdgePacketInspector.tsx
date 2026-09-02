import React, { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export function EdgePacketInspector() {
  const [data, setData] = useState([
    { proto: 'VXLAN', count: 1200 },
    { proto: 'IPsec', count: 800 },
    { proto: 'WireGuard', count: 2500 },
    { proto: 'Hysteria2', count: 1500 },
  ]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 h-full">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Cpu className="w-6 h-6 text-[#00f0ff]" />
        Edge Packet Inspector
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="proto" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip contentStyle={{ backgroundColor: '#111827', border: 'none' }} />
            <Bar dataKey="count" fill="#00f0ff" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center gap-2 text-red-400 text-sm">
        <ShieldAlert className="w-4 h-4" />
        Anomaly Detected: Unusual VXLAN spike in Node SIN-01
      </div>
    </div>
  );
}
