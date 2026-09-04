import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Server, 
  Users, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Bell, 
  Database, 
  Layers, 
  BarChart2, 
  BrainCircuit, 
  Sliders, 
  FileCode2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Lock,
  Network,
  Zap,
  Radio,
  HardDrive,
  Shield,
  FileText
} from 'lucide-react';
import { cn } from '../utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: any;
  badge?: string | number;
  badgeColor?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'network-map', label: 'Network Map', icon: Globe },
  { id: 'routers', label: 'Routers', icon: Server },
  { id: 'clients', label: 'Clients', icon: Users },
  { id: 'ftnvpn', label: 'FTNVPN', icon: ShieldCheck },
  { id: 'monitoring', label: 'Monitoring', icon: Activity },
  { id: 'firmware', label: 'Firmware Center', icon: Cpu },
  { id: 'alerts', label: 'Alerts', icon: Bell, badge: 8, badgeColor: 'bg-emerald-500/20 text-[#00ff66] border border-emerald-500/40' },
  { id: 'dns-platform', label: 'DNS Platform', icon: Database },
  { id: 'servers', label: 'Servers', icon: Layers, badge: 30, badgeColor: 'bg-emerald-500/20 text-[#00ff66] border border-emerald-500/40' },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
  { id: 'ai-intelligence', label: 'AI Intelligence', icon: BrainCircuit },
  { id: 'settings', label: 'Settings', icon: Sliders },
  { id: 'audit-logs', label: 'Audit Logs', icon: FileCode2 },
];

export const EXTENDED_MODULES: NavItem[] = [
  { id: 'ecosystem-glossary', label: 'Ecosystem Glossary & Specs', icon: BookOpen },
  { id: 'zerotrust-gateway', label: 'Zero Trust (ZTNA) Gateway', icon: ShieldCheck },
  { id: 'netflow-collector', label: 'NetFlow & IPFIX Collector', icon: Network },
  { id: 'pki-manager', label: 'Enterprise PKI & Ed25519 CA', icon: Lock },
  { id: 'incident-correlator', label: 'AI Incident Correlator & RCA', icon: BrainCircuit },
  { id: 'sdwan-controller', label: 'Autonomous SD-WAN', icon: Zap },
  { id: 'ai-accounting', label: 'AI ISP Accounting & Ledger', icon: BarChart2 },
  { id: 'kopia', label: 'Kopia Encrypted Cloud Vault', icon: HardDrive },
  { id: 'kismet', label: 'Kismet WIDS & RF Sentinel', icon: Radio },
  { id: 'branding', label: 'FTN Brand Kit & Media Assets', icon: Shield },
];

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isExtendedOpen, setIsExtendedOpen] = useState(false);
  const [uptimeSeconds, setUptimeSeconds] = useState(1103552); // ~12d 18h 32m

  useEffect(() => {
    const timer = setInterval(() => {
      setUptimeSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatUptime = (secs: number) => {
    const d = Math.floor(secs / 86400);
    const h = Math.floor((secs % 86400) / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <aside className="w-64 bg-[#050914] border-r border-gray-800/70 flex flex-col h-full flex-shrink-0 z-20 select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-gray-800/80">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 w-full text-left group cursor-pointer"
        >
          {/* Glowing 3D Logo */}
          <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-[#00f0ff]/40 bg-[#070e1f] p-1 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.25)] group-hover:scale-105 transition-transform flex-shrink-0">
            <img 
              src="/ftn-logo.png" 
              alt="FTN Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00ff66]/10 to-[#00f0ff]/20 pointer-events-none" />
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-display font-extrabold text-xs tracking-wider text-white group-hover:text-[#00f0ff] transition-colors truncate uppercase">
              FAMILY TIME NETWORK
            </span>
            <span className="text-[9px] text-gray-400 font-mono tracking-tight leading-tight mt-0.5">
              CONNECTING THE WORLD, SECURING THE FUTURE
            </span>
          </div>
        </button>
      </div>

      {/* Navigation Links Scroll Area */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {MAIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group relative cursor-pointer",
                isActive 
                  ? "bg-[#0b1426] text-white border border-[#00f0ff]/30 shadow-[0_0_12px_rgba(0,240,255,0.15)] font-semibold" 
                  : "text-gray-400 hover:bg-gray-800/40 hover:text-gray-200"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-[#00f0ff] to-[#00ff66] rounded-r" />
                )}
                <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-[#00f0ff]" : "text-gray-500 group-hover:text-gray-300")} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={cn(
                  "text-[10px] font-mono px-1.5 py-0.2 rounded-full font-bold ml-2",
                  item.badgeColor || "bg-gray-800 text-gray-300"
                )}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Extended Enterprise Ecosystem Accordion */}
        <div className="pt-2 border-t border-gray-800/60 mt-2">
          <button
            onClick={() => setIsExtendedOpen(!isExtendedOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-mono text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 transition-colors"
          >
            <span className="uppercase tracking-wider text-[10px] text-[#00f0ff] font-bold flex items-center gap-1.5">
              <Layers className="w-3 h-3" />
              Extended Mesh Apps
            </span>
            {isExtendedOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>

          {isExtendedOpen && (
            <div className="mt-1 space-y-1 pl-2">
              {EXTENDED_MODULES.map((ext) => {
                const Icon = ext.icon;
                const isAct = activeTab === ext.id;
                return (
                  <button
                    key={ext.id}
                    onClick={() => setActiveTab(ext.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-mono transition-colors text-left",
                      isAct 
                        ? "bg-[#0b1426] text-[#00f0ff] font-bold border border-[#00f0ff]/30" 
                        : "text-gray-400 hover:bg-gray-800/40 hover:text-gray-200"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0 text-gray-500" />
                    <span className="truncate">{ext.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SYSTEM STATUS CARD (Matching image exact widget) */}
      <div className="p-3 border-t border-gray-800/80 bg-[#070d1a] space-y-2">
        <div className="bg-[#0b1222] p-3 rounded-xl border border-gray-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-wider">
              SYSTEM STATUS
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Circular Meter Ring 98.6% */}
            <div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-[#00ff66]"
                  strokeDasharray="98.6, 100"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold font-mono text-[#00ff66] leading-none">98.6%</span>
                <span className="text-[7px] text-gray-400 leading-none mt-0.5">Excellent</span>
              </div>
            </div>

            {/* Status Breakdown Legend */}
            <div className="space-y-0.5 text-[10px] font-mono flex-1">
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" /> Online
                </span>
                <span className="font-bold text-white">128</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Degraded
                </span>
                <span className="font-bold text-amber-400">6</span>
              </div>
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Offline
                </span>
                <span className="font-bold text-red-500">2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: FTN CORE Version & Uptime */}
        <div className="px-1 flex items-center justify-between text-[10px] font-mono text-gray-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
            <span className="text-white font-bold">FTN CORE</span>
          </div>
          <span className="text-[9px] text-gray-400">v2.6.0-Enterprise</span>
        </div>
        <div className="px-1 text-[9px] font-mono text-gray-400 text-right">
          Uptime: <span className="text-gray-300 font-semibold">{formatUptime(uptimeSeconds)}</span>
        </div>
      </div>
    </aside>
  );
}
