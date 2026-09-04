import React, { useState } from 'react';
import { 
  DollarSign, TrendingUp, Receipt, PieChart, ArrowUpRight, 
  ArrowDownRight, RefreshCw, FileText, CheckCircle2, Sparkles, 
  CreditCard, ShieldCheck, Download
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { cn } from '../utils';

const REVENUE_EXPENSES_DATA = [
  { month: 'Apr', revenue: 42100, expenses: 18200 },
  { month: 'May', revenue: 48900, expenses: 19400 },
  { month: 'Jun', revenue: 54200, expenses: 21100 },
  { month: 'Jul', revenue: 61800, expenses: 22800 },
  { month: 'Aug', revenue: 73400, expenses: 24900 },
  { month: 'Sep (Est)', revenue: 84100, expenses: 26200 },
];

export function AiAccountingSystem() {
  const [isReconciling, setIsReconciling] = useState(false);
  const [reconciliationStatus, setReconciliationStatus] = useState('All 1,420 Ledger Transactions Reconciled');

  const handleReconcile = () => {
    setIsReconciling(true);
    setTimeout(() => {
      setIsReconciling(false);
      setReconciliationStatus('Autonomous AI Reconciliation Complete. Variance: $0.00');
      window.dispatchEvent(new CustomEvent('add-toast', {
        detail: {
          type: 'success',
          title: 'AI Accounting Reconciliation',
          message: 'General ledger synchronized with upstream transit billing and PgBouncer offload pools.'
        }
      }));
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-500 flex items-center justify-center text-gray-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-display text-white tracking-wide">
                  FTN Autonomous AI Accounting
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Continuous Double-Entry Ledger
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Real-time ISP IP transit cost accounting, automated multi-currency settlement, and AI revenue forecasting
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleReconcile}
              disabled={isReconciling}
              className="px-4 py-2 rounded-xl text-sm font-bold font-mono bg-amber-500 hover:bg-amber-400 text-gray-950 flex items-center gap-2 transition-all shadow-md"
            >
              <RefreshCw className={cn("w-4 h-4", isReconciling && "animate-spin")} />
              {isReconciling ? 'AI Reconciling...' : 'Run Auto Reconciliation'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800/60">
          <div className="bg-gray-900/60 p-3.5 rounded-xl border border-gray-800">
            <span className="text-xs font-mono text-gray-400 uppercase">Gross Monthly MRR</span>
            <p className="text-2xl font-bold font-mono text-white mt-1">$73,420 <span className="text-xs text-emerald-400 font-normal">+18.8%</span></p>
          </div>

          <div className="bg-gray-900/60 p-3.5 rounded-xl border border-gray-800">
            <span className="text-xs font-mono text-gray-400 uppercase">IP Transit Opex</span>
            <p className="text-2xl font-bold font-mono text-amber-400 mt-1">$14,280 <span className="text-xs text-gray-500 font-normal">Cogent/Telia</span></p>
          </div>

          <div className="bg-gray-900/60 p-3.5 rounded-xl border border-gray-800">
            <span className="text-xs font-mono text-gray-400 uppercase">Net Margin</span>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">66.1% <span className="text-xs text-gray-500 font-normal">High Yield</span></p>
          </div>

          <div className="bg-gray-900/60 p-3.5 rounded-xl border border-gray-800">
            <span className="text-xs font-mono text-gray-400 uppercase">Audit Status</span>
            <p className="text-sm font-bold font-mono text-emerald-400 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> GAAP / IFRS Ready
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-gray-800">
          <h3 className="text-base font-bold text-white font-display mb-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Revenue vs Infrastructure Expense Trajectory
          </h3>
          <p className="text-xs text-gray-400 font-mono mb-4">6-Month trailing ledger with autonomous AI projection</p>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_EXPENSES_DATA}>
                <XAxis dataKey="month" stroke="#6b7280" fontSize={11} />
                <YAxis stroke="#6b7280" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                  labelStyle={{ color: '#00f0ff', fontWeight: 'bold' }}
                />
                <Bar dataKey="revenue" name="Revenue ($)" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Infrastructure OPEX ($)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-4">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Receipt className="w-4 h-4 text-cyan-400" />
            Real-Time General Ledger
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {[
              { label: 'Carrier Peering (Equinix HK1)', amount: '-$4,800.00', type: 'DEBIT', time: '10m ago' },
              { label: 'Anycast DNS Enterprise Sub', amount: '+$12,450.00', type: 'CREDIT', time: '1h ago' },
              { label: 'Fiber Dark Core Lease (SIN-KUL)', amount: '-$3,100.00', type: 'DEBIT', time: '3h ago' },
              { label: 'Zero-Trust Mesh License Pool', amount: '+$8,900.00', type: 'CREDIT', time: '5h ago' }
            ].map((entry, idx) => (
              <div key={idx} className="p-3 bg-gray-900/80 rounded-lg border border-gray-800 flex justify-between items-center">
                <div>
                  <p className="text-gray-200 font-sans font-medium">{entry.label}</p>
                  <span className="text-[10px] text-gray-500">{entry.time}</span>
                </div>
                <span className={cn(
                  "font-bold",
                  entry.type === 'CREDIT' ? "text-emerald-400" : "text-amber-400"
                )}>
                  {entry.amount}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>{reconciliationStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
