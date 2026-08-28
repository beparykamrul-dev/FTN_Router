import React, { useState, useEffect, useRef } from 'react';
import { Network, Server, ShieldAlert, Cpu, Activity, Users, FileCode2, Command, Globe, Smartphone, Globe2, RefreshCw, HardDrive, Mail, Search, Lock, Wrench } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (id: string) => void;
}

export const NAV_ITEMS = [
  { id: 'core-router', label: 'FTN Core Router', icon: Server },
  { id: 'dns', label: 'DNS Management', icon: Globe },
  { id: 'ddns', label: 'DDNS', icon: RefreshCw },
  { id: 'domain', label: 'Domain Management', icon: Globe2 },
  { id: 'hosting', label: 'Hosting Services', icon: HardDrive },
  { id: 'global', label: 'Global Grid & Web3', icon: Globe },
  { id: 'mail', label: 'FTN Mail Service', icon: Mail },
  { id: 'android', label: 'Android App & Omni OS', icon: Smartphone },
  { id: 'dashboard', label: 'Smart NOC Dashboard', icon: Activity },
  { id: 'mesh', label: 'Global API & Mesh', icon: Network },
  { id: 'crypto-pki', label: 'Crypto & PKI Engine', icon: Lock },
  { id: 'backup', label: 'One-Click Backups', icon: HardDrive },
  { id: 'simulator', label: 'Edge Traffic Simulator', icon: Activity },
  { id: 'lifecycle', label: 'Hardware Lifecycle', icon: Cpu },
  { id: 'drivers', label: 'Universal Device Drivers', icon: Wrench },
  { id: 'peering', label: 'Global Provider Peering', icon: Globe2 },
  { id: 'topology', label: 'GIS Fiber Topology', icon: Network },
  { id: 'olt', label: 'Multi-Vendor OLT', icon: Cpu },
  { id: 'subscribers', label: 'Subscriber & Billing', icon: Users },
  { id: 'ai', label: 'FTNDNS AI Assistant', icon: Command },
  { id: 'microservices', label: 'Microservices Matrix', icon: ShieldAlert },
  { id: 'compiler', label: 'Build Pipeline', icon: FileCode2 },
];

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredItems = NAV_ITEMS.filter(item => 
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 10);
      setSearch('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-xl bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center px-4 py-3 border-b border-gray-800">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder-gray-500 text-lg font-mono"
            placeholder="Search modules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && filteredItems.length > 0) {
                onNavigate(filteredItems[0].id);
                onClose();
              }
            }}
          />
          <kbd className="hidden sm:block bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs font-mono border border-gray-700">ESC</kbd>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500 font-mono text-sm">No modules found.</div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${index === 0 && search.length > 0 ? 'bg-[#00f0ff]/10 text-[#00f0ff]' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
                  >
                    <Icon className={`w-5 h-5 mr-3 ${index === 0 && search.length > 0 ? 'text-[#00f0ff]' : 'text-gray-500'}`} />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
