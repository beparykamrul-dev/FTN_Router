import React from 'react';
import { CreditCard, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

export function AiBillingGateway() {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-gray-800 h-full">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-green-400" />
        AI Billing Gateway
      </h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Monthly Usage</p>
          <p className="text-2xl font-bold text-white">$1,240.50</p>
        </div>
        <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Next Settlement</p>
          <p className="text-2xl font-bold text-white">12 Days</p>
        </div>
      </div>
      <div className="space-y-4">
        <button className="w-full flex items-center justify-between bg-green-500/10 hover:bg-green-500/20 text-green-400 p-4 rounded-xl border border-green-500/30">
          <span className="flex items-center gap-2"><Zap className="w-5 h-5" /> Automated Settlement</span>
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
