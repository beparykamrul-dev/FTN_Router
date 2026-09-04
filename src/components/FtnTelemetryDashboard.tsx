
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { timestamp: '10:00', traffic: 400, bgp: 24 },
  { timestamp: '10:05', traffic: 300, bgp: 24 },
  { timestamp: '10:10', traffic: 600, bgp: 25 },
  { timestamp: '10:15', traffic: 800, bgp: 25 },
];

export const FtnTelemetryDashboard = () => (
  <div className="p-6 bg-[#0c1017] border border-[#1e2530] rounded-xl shadow-lg">
    <h2 className="text-xl font-bold mb-4 text-[#00f0ff]">FTN Telemetry Dashboard</h2>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
          <XAxis dataKey="timestamp" stroke="#a0aec0" />
          <YAxis stroke="#a0aec0" />
          <Tooltip contentStyle={{ backgroundColor: '#1a202c', borderColor: '#4a5568' }} />
          <Line type="monotone" dataKey="traffic" stroke="#00f0ff" strokeWidth={2} />
          <Line type="monotone" dataKey="bgp" stroke="#f6ad55" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);
