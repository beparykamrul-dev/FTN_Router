import React from 'react';
import { Bell, Search, Shield, Zap, Sun, Moon, Terminal } from 'lucide-react';

interface NavbarProps {
  isLightMode?: boolean;
  toggleTheme?: () => void;
  openCommandPalette?: () => void;
  onOpenSharedAuth?: () => void;
  onOpenBrandKit?: () => void;
}

export function Navbar({ isLightMode, toggleTheme, openCommandPalette, onOpenSharedAuth, onOpenBrandKit }: NavbarProps) {
  return (
    <header className="h-16 glass-panel border-b border-gray-800/50 flex items-center justify-between px-6 z-10 relative">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onOpenBrandKit}
          className="flex items-center gap-2.5 p-1.5 px-2.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 border border-gray-700/60 hover:border-[#00ff66]/60 transition-all group cursor-pointer"
          title="FTN Family Time Network - Official Brand Kit & Guidelines"
        >
          <div className="w-7 h-7 rounded-md overflow-hidden bg-[#0a1128] border border-gray-700 group-hover:border-[#00ff66] transition-colors flex items-center justify-center">
            <img src="/ftn-logo.png" alt="FTN Logo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-gray-200 group-hover:text-white font-display">FTN BRAND</span>
              <span className="text-[8px] px-1 py-0.2 rounded bg-[#00ff66]/10 text-[#00ff66] font-mono border border-[#00ff66]/30">3D</span>
            </div>
            <span className="text-[9px] text-[#00f0ff] font-mono leading-none">Family Time Net</span>
          </div>
        </button>

        <div className="relative w-80 lg:w-96 hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Universal Search (IP, MAC, NID, Logs)..." 
            className="w-full bg-gray-950/50 border border-gray-800 text-gray-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]/50 transition-all font-mono cursor-pointer"
            onClick={openCommandPalette}
            readOnly
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
            <kbd className="bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded text-[10px] font-mono border border-gray-700">Ctrl</kbd>
            <kbd className="bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded text-[10px] font-mono border border-gray-700">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 text-gray-400 hover:text-white transition-colors"
          title="Toggle NOC Theme"
        >
          {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>ZeroTrust: Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>eBPF: Filtering</span>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-800" />

        <div className="flex items-center gap-4">
          <button className="relative text-gray-400 hover:text-white transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-900" />
          </button>
          <button className="relative text-gray-400 hover:text-[#00ff66] transition-colors">
            <Terminal className="w-5 h-5" />
          </button>
          
          <button
            onClick={onOpenSharedAuth}
            className="flex items-center gap-3 pl-2 group hover:bg-gray-800/40 p-1.5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-gray-700/60"
            title="Open FTN Shared Authentication & Service Federation"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-gray-600 group-hover:border-[#00ff66] flex items-center justify-center overflow-hidden transition-colors">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Kamrul&backgroundColor=transparent" alt="Admin" className="w-full h-full object-cover opacity-90" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-200 group-hover:text-[#00ff66] transition-colors">Kamrul Bepary</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-[#00ff66]/10 text-[#00ff66] font-mono border border-[#00ff66]/30">One ID</span>
              </div>
              <span className="text-[10px] text-[#00f0ff] font-mono">FTN Shared Auth</span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
