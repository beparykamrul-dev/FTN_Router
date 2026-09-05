import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Search,
  Filter,
  Play,
  Pause,
  Download,
  AlertOctagon,
  Info,
  AlertTriangle,
  Server,
  Layers,
  Database
} from 'lucide-react';
import { cn } from '../utils';

export interface LogEntry {
  id: string;
  timestamp: string;
  source: 'WAZUH' | 'OPENSEARCH' | 'SYSLOG' | 'EBPF';
  service: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL';
  message: string;
  tenantId?: string;
}

const MOCK_LOGS: LogEntry[] = [
  { id: '1', timestamp: new Date(Date.now() - 5000).toISOString(), source: 'SYSLOG', service: 'wireguard-ui', level: 'INFO', message: 'Peer handshake completed successfully.' },
  { id: '2', timestamp: new Date(Date.now() - 4000).toISOString(), source: 'WAZUH', service: 'ossec-agent', level: 'WARN', message: 'Multiple failed SSH attempts detected from 198.51.100.23' },
  { id: '3', timestamp: new Date(Date.now() - 3000).toISOString(), source: 'EBPF', service: 'xdp-filter', level: 'INFO', message: 'Dropped 450 SYN packets matching blacklisted ASN.' },
  { id: '4', timestamp: new Date(Date.now() - 1000).toISOString(), source: 'OPENSEARCH', service: 'core-router', level: 'ERROR', message: 'BGP session flap on interface eth2, neighbor 10.0.0.1' },
];

export function FtnLogAggregator() {
  const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS);
  const [isTailing, setIsTailing] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');

  useEffect(() => {
    if (!isTailing) return;
    const timer = setInterval(() => {
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        source: ['WAZUH', 'OPENSEARCH', 'SYSLOG', 'EBPF'][Math.floor(Math.random() * 4)] as any,
        service: ['auth-gateway', 'dns-resolver', 'bgp-daemon', 'mtls-proxy'][Math.floor(Math.random() * 4)],
        level: Math.random() > 0.85 ? 'WARN' : Math.random() > 0.95 ? 'ERROR' : 'INFO',
        message: 'Routine health check ok. Metric published to influx.'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 200)); // Keep last 200
    }, 1500);
    return () => clearInterval(timer);
  }, [isTailing]);

  const filteredLogs = logs.filter(log => {
    if (selectedSource !== 'ALL' && log.source !== selectedSource) return false;
    if (selectedLevel !== 'ALL' && log.level !== selectedLevel) return false;
    if (searchTerm && !log.message.toLowerCase().includes(searchTerm.toLowerCase()) && !log.service.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-[#080e1c] border border-gray-800 rounded-3xl p-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
               <Database className="w-5 h-5" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-white font-display">Unified Log Aggregator</h2>
               <p className="text-gray-400 font-mono text-xs">Wazuh &bull; OpenSearch &bull; eBPF &bull; Syslog</p>
             </div>
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
             <div className="relative flex-1 lg:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                   type="text" 
                   placeholder="Search logs..." 
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-4 py-2 text-sm font-mono text-white placeholder-gray-600 focus:border-purple-500/50 focus:outline-none"
                />
             </div>
             <button
                onClick={() => setIsTailing(!isTailing)}
                className={cn("px-4 py-2 rounded-lg font-mono text-xs font-bold flex items-center gap-2 border transition-all", isTailing ? "bg-emerald-500/20 border-emerald-500/50 text-[#00ff66]" : "bg-gray-800 border-gray-700 text-gray-400 hover:text-white")}
             >
                {isTailing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isTailing ? 'Tailing...' : 'Paused'}
             </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
           {['ALL', 'INFO', 'WARN', 'ERROR', 'CRITICAL'].map(lvl => (
             <button
               key={lvl}
               onClick={() => setSelectedLevel(lvl)}
               className={cn("px-3 py-1 rounded border text-[10px] font-bold font-mono transition-colors", selectedLevel === lvl ? "bg-white/10 text-white border-gray-500" : "bg-gray-900 text-gray-500 border-gray-800 hover:text-gray-300")}
             >
               {lvl}
             </button>
           ))}
           <div className="w-px h-6 bg-gray-800 mx-2" />
           {['ALL', 'WAZUH', 'OPENSEARCH', 'SYSLOG', 'EBPF'].map(src => (
             <button
               key={src}
               onClick={() => setSelectedSource(src)}
               className={cn("px-3 py-1 rounded border text-[10px] font-bold font-mono transition-colors", selectedSource === src ? "bg-purple-500/20 text-purple-400 border-purple-500/50" : "bg-gray-900 text-gray-500 border-gray-800 hover:text-gray-300")}
             >
               {src}
             </button>
           ))}
        </div>

        <div className="bg-black/80 rounded-xl border border-gray-800 overflow-hidden">
           <div className="h-[600px] overflow-y-auto p-4 space-y-1.5 scrollbar-thin">
             {filteredLogs.map(log => (
                <div key={log.id} className="flex gap-4 font-mono text-[11px] leading-relaxed border-b border-gray-900/50 pb-1 hover:bg-white/5 p-1 rounded transition-colors">
                   <div className="text-gray-500 whitespace-nowrap flex-shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                   </div>
                   <div className={cn(
                      "w-20 flex-shrink-0 font-bold",
                      log.level === 'ERROR' || log.level === 'CRITICAL' ? 'text-red-400' :
                      log.level === 'WARN' ? 'text-amber-400' : 'text-emerald-400'
                   )}>
                      [{log.level}]
                   </div>
                   <div className="w-24 flex-shrink-0 text-purple-400">
                      {log.source}
                   </div>
                   <div className="w-32 flex-shrink-0 text-[#00f0ff]">
                      {log.service}
                   </div>
                   <div className="text-gray-300 flex-1 break-all">
                      {log.message}
                   </div>
                </div>
             ))}
             {filteredLogs.length === 0 && (
                <div className="text-center py-20 text-gray-500 font-mono text-xs">
                   No logs found matching current filters.
                </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
