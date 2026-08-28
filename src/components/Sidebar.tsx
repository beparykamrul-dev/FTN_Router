import React from 'react';
import { Network, Server, ShieldAlert, Cpu, Activity, Users, FileCode2, Command, Globe, Smartphone, Globe2, RefreshCw, HardDrive } from 'lucide-react';
import { cn } from '../utils';
import { NAV_ITEMS } from './CommandPalette';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const navItems = NAV_ITEMS;

  return (
    <aside className="w-64 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800/50 flex flex-col h-full flex-shrink-0 z-20">
      <div className="h-16 flex items-center px-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#00ff66] to-[#00f0ff] flex items-center justify-center shadow-[0_0_15px_rgba(0,255,102,0.4)]">
            <Network className="w-5 h-5 text-gray-950" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-tight tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400">FTNDNS</span>
            <span className="text-[10px] text-[#00ff66] font-mono tracking-widest uppercase">Grid Engine</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden",
                isActive 
                  ? "bg-gradient-to-r from-gray-800 to-gray-800/40 text-white shadow-lg" 
                  : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00ff66] to-[#00f0ff]" />
              )}
              <Icon className={cn("w-5 h-5", isActive ? "text-[#00f0ff]" : "group-hover:text-gray-300")} />
              {item.label}
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-gray-800/50">
        <div className="glass-panel p-3 rounded-lg flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-[#00ff66] animate-ping opacity-50" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-mono">SYSTEM STATUS</span>
            <span className="text-sm text-[#00ff66] font-semibold tracking-wide">SECURE & ONLINE</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
