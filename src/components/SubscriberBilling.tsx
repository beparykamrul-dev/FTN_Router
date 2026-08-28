import React from 'react';
import { Users, Search, CreditCard, PowerOff, CheckCircle2 } from 'lucide-react';
import { mockSubscribers } from '../data/mockData';
import { cn } from '../utils';

export function SubscriberBilling() {
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1">Subscriber & Billing Engine</h1>
          <p className="text-gray-400 text-sm font-mono">PPPoE Accounts, Automated Invoicing & Cut-offs</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors border border-gray-700 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Generate Invoices
          </button>
          <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] flex items-center gap-2">
            <PowerOff className="w-4 h-4" /> Auto-Suspend Overdue (2)
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl border border-gray-800/60 overflow-hidden">
        <div className="p-4 border-b border-gray-800/50 flex justify-between items-center bg-gray-900/50">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search by Username, IP, or MAC..." 
              className="w-full bg-gray-950 border border-gray-800 text-gray-300 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#00ff66] transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-gray-950 border border-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-[#00ff66]">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="text-xs uppercase bg-gray-900/80 text-gray-400 font-mono border-b border-gray-800/50">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Subscriber Details</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Assigned Plan</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Network Binding</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Data Usage (RX/TX)</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-center">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {mockSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white mb-0.5">{sub.username}</div>
                    <div className="text-[10px] text-gray-500 font-mono">ID: {sub.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs border border-gray-700 font-medium">
                      {sub.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-400 space-y-1">
                    <div className="flex items-center gap-2"><span className="text-gray-500">IP:</span> <span className="text-[#00f0ff]">{sub.ipAddress}</span></div>
                    <div className="flex items-center gap-2"><span className="text-gray-500">MAC:</span> <span>{sub.macAddress}</span></div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-xs">
                    <div className="text-[#00f0ff]">{formatBytes(sub.rxBytes)}</div>
                    <div className="text-[#00ff66]">{formatBytes(sub.txBytes)}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider inline-flex items-center gap-1.5 border",
                      sub.status === 'ACTIVE' ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/20" : 
                      "bg-red-500/10 text-red-500 border-red-500/20"
                    )}>
                      {sub.status === 'ACTIVE' && <CheckCircle2 className="w-3 h-3" />}
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-white transition-colors text-xs font-semibold px-3 py-1 bg-gray-800 rounded">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-900/50 border-t border-gray-800/50 flex justify-between items-center text-xs text-gray-400 font-mono">
          <span>Showing {mockSubscribers.length} of 3,042 subscribers</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 transition-colors border border-gray-700">Prev</button>
            <button className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700 transition-colors border border-gray-700">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
