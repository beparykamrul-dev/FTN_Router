import React from 'react';
import { Globe, RefreshCw, Globe2, HardDrive, Mail } from 'lucide-react';

export function DdnsManager() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center glass-panel border border-gray-800/60 rounded-xl relative overflow-hidden group p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30 mb-6">
        <RefreshCw className="w-8 h-8 text-green-400" />
      </div>
      <h2 className="text-2xl font-display font-bold text-white mb-2">DDNS Service</h2>
      <p className="text-gray-400 font-mono text-sm max-w-md">Dynamic DNS endpoint management, PPPoE tracking, and auto-failover IPs will be available here.</p>
    </div>
  );
}

export function DomainManager() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center glass-panel border border-gray-800/60 rounded-xl relative overflow-hidden group p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30 mb-6">
        <Globe2 className="w-8 h-8 text-purple-400" />
      </div>
      <h2 className="text-2xl font-display font-bold text-white mb-2">Domain Registration</h2>
      <p className="text-gray-400 font-mono text-sm max-w-md">Domain portfolio management, SSL certificates, and WHOIS privacy will be available here.</p>
    </div>
  );
}

export function HostingManager() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center glass-panel border border-gray-800/60 rounded-xl relative overflow-hidden group p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-orange-500/30 mb-6">
        <HardDrive className="w-8 h-8 text-orange-400" />
      </div>
      <h2 className="text-2xl font-display font-bold text-white mb-2">Cloud Hosting</h2>
      <p className="text-gray-400 font-mono text-sm max-w-md">Web server clusters, databases, CPanel alternatives, and storage arrays will be available here.</p>
    </div>
  );
}

export function GlobalGridManager() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center glass-panel border border-gray-800/60 rounded-xl relative overflow-hidden group p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center border border-indigo-500/30 mb-6">
        <Globe className="w-8 h-8 text-indigo-400" />
      </div>
      <h2 className="text-2xl font-display font-bold text-white mb-2">Global Grid & Web3</h2>
      <p className="text-gray-400 font-mono text-sm max-w-md">Memory-to-Memory Edge Caching, IPFS Nodes, and EVMbench research integrations.</p>
    </div>
  );
}

export function MailServiceManager() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center glass-panel border border-gray-800/60 rounded-xl relative overflow-hidden group p-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center border border-red-500/30 mb-6">
        <Mail className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="text-2xl font-display font-bold text-white mb-2">FTN Mail Service</h2>
      <p className="text-gray-400 font-mono text-sm max-w-md">Enterprise email routing, SMTP/IMAP configurations, and spam filtering policies will be available here.</p>
    </div>
  );
}
