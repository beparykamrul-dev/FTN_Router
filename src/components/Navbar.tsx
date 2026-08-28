import React from 'react';
import { Bell, Search, Shield, Zap, Sun, Moon, Terminal } from 'lucide-react';

interface NavbarProps {
  isLightMode?: boolean;
  toggleTheme?: () => void;
  openCommandPalette?: () => void;
}

export function Navbar({ isLightMode, toggleTheme, openCommandPalette }: NavbarProps) {
  return (
    <header className="h-16 glass-panel border-b border-gray-800/50 flex items-center justify-between px-6 z-10 relative">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96 hidden md:block">
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
          
          <div className="flex items-center gap-3 pl-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-gray-600 flex items-center justify-center overflow-hidden">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin&backgroundColor=transparent" alt="Admin" className="w-full h-full object-cover opacity-80" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-200">System Admin</span>
              <span className="text-[10px] text-[#00f0ff] font-mono">AS12345</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
