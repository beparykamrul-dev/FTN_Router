import React, { useState, useEffect } from 'react';
import { ShieldCheck, Server, Zap, Globe, Lock, AlertTriangle, RefreshCw } from 'lucide-react';

export function SecurityCompliancePanel() {
  const [scans, setScans] = useState([
    { id: 1, name: "WireGuard Cipher Suite", status: "Deprecated", severity: "High" },
    { id: 2, name: "DNSSEC Validation", status: "OK", severity: "Low" },
    { id: 3, name: "mTLS Rotation Interval", status: "Overdue", severity: "Critical" },
  ]);

  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-red-400" />
          Security Compliance Panel
        </h2>
        <button className="flex items-center gap-2 bg-[#00f0ff]/10 text-[#00f0ff] px-4 py-2 rounded-lg text-sm border border-[#00f0ff]/30">
          <RefreshCw className="w-4 h-4" /> Run Deep Scan
        </button>
      </div>
      <div className="space-y-4">
        {scans.map(scan => (
          <div key={scan.id} className="flex items-center justify-between bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <div>
              <p className="font-semibold text-white">{scan.name}</p>
              <span className={`text-xs px-2 py-1 rounded ${scan.status === "OK" ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                {scan.status}
              </span>
            </div>
            <button className="bg-white/5 hover:bg-white/10 px-3 py-1 rounded text-xs text-gray-300">
              One-Click Remediate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
