import React, { useState, useEffect } from 'react';
import { 
  Zap, ArrowRightLeft, Shield, Activity, RefreshCw, 
  CheckCircle2, AlertTriangle, Cpu, Network, Sliders, Play, Pause 
} from 'lucide-react';
import { cn } from '../utils';

interface RouteProfile {
  id: 'hysteria2' | 'wireguard' | 'v2ray';
  name: string;
  protocol: string;
  latencyMs: number;
  packetLossPct: number;
  throughputMbps: number;
  status: 'ACTIVE_OPTIMAL' | 'DEGRADED_FAILOVER' | 'STANDBY_READY';
  description: string;
  color: string;
}

export function TrafficProtocolOptimizer() {
  const [isAutoOptimize, setIsAutoOptimize] = useState(true);
  const [activeRoute, setActiveRoute] = useState<'hysteria2' | 'wireguard' | 'v2ray'>('hysteria2');
  const [isSimulatingCongestion, setIsSimulatingCongestion] = useState(false);
  const [switchLog, setSwitchLog] = useState<string[]>([
    '10:24:02 - Autonomous shift to Hysteria2: ISP throttled standard UDP (packet loss exceeded 3.5%).',
    '10:21:15 - WireGuard degraded on AS4837 (China Unicom) transit path.',
    '10:18:40 - Route evaluation: Hysteria2 Brutal CC sustained 480 Mbps with 0.05% loss.'
  ]);

  const [profiles, setProfiles] = useState<RouteProfile[]>([
    {
      id: 'hysteria2',
      name: 'Hysteria 2 (QUIC Brutal CC)',
      protocol: 'UDP / QUIC Port 443',
      latencyMs: 24,
      packetLossPct: 0.05,
      throughputMbps: 480,
      status: 'ACTIVE_OPTIMAL',
      description: 'Custom BBR/Brutal congestion control bypasses ISP rate limiting & packet drop',
      color: '#00ff66'
    },
    {
      id: 'wireguard',
      name: 'WireGuard Kernel Module',
      protocol: 'ChaCha20-Poly1305 UDP',
      latencyMs: 18,
      packetLossPct: isSimulatingCongestion ? 7.8 : 3.8,
      throughputMbps: 160,
      status: 'DEGRADED_FAILOVER',
      description: 'High kernel efficiency but vulnerable to ISP UDP throttling & active DPI drop',
      color: '#00f0ff'
    },
    {
      id: 'v2ray',
      name: 'V2Ray / VLESS + TLS',
      protocol: 'gRPC / WebSocket over HTTPS',
      latencyMs: 38,
      packetLossPct: 0.1,
      throughputMbps: 240,
      status: 'STANDBY_READY',
      description: 'Total TLS camouflage masquerading as legitimate HTTPS CDN traffic',
      color: '#a855f7'
    }
  ]);

  const handleSimulateCongestion = () => {
    setIsSimulatingCongestion(prev => !prev);
    const newLoss = !isSimulatingCongestion ? 8.4 : 1.2;
    
    setProfiles(prev => prev.map(p => {
      if (p.id === 'wireguard') {
        return {
          ...p,
          packetLossPct: newLoss,
          status: newLoss > 2.0 ? 'DEGRADED_FAILOVER' : 'ACTIVE_OPTIMAL'
        };
      }
      return p;
    }));

    if (!isSimulatingCongestion) {
      setActiveRoute('hysteria2');
      setSwitchLog(prev => [
        `${new Date().toLocaleTimeString()} - Dynamic trigger: WireGuard packet loss spiked to 8.4%! Traffic dynamically shifted to Hysteria2.`,
        ...prev.slice(0, 4)
      ]);
    }
  };

  const handleForceShift = (id: 'hysteria2' | 'wireguard' | 'v2ray') => {
    setActiveRoute(id);
    setSwitchLog(prev => [
      `${new Date().toLocaleTimeString()} - Manual route override: Transmitted active flow to ${id.toUpperCase()}.`,
      ...prev.slice(0, 4)
    ]);
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'info',
        title: 'Route Optimizer Shifted',
        message: `Traffic dynamically shifted to ${id.toUpperCase()}.`
      }
    }));
  };

  return (
    <div className="glass-panel p-5 rounded-xl border border-gray-800/80 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-gray-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
              Autonomous Traffic Protocol Optimizer
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                ACTIVE: {activeRoute.toUpperCase()}
              </span>
            </h3>
            <p className="text-xs text-gray-400">
              Real-time dynamic route shifting between Hysteria2, WireGuard, and V2Ray based on packet loss & ISP throttling
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateCongestion}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors flex items-center gap-1.5",
              isSimulatingCongestion 
                ? "bg-rose-500/20 text-rose-400 border-rose-500/40" 
                : "bg-gray-800/80 text-gray-300 border-gray-700 hover:bg-gray-700"
            )}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            {isSimulatingCongestion ? 'Clear ISP Throttling' : 'Simulate ISP Throttling'}
          </button>

          <button
            onClick={() => setIsAutoOptimize(!isAutoOptimize)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors flex items-center gap-1.5",
              isAutoOptimize ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-gray-800 text-gray-400 border-gray-700"
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            {isAutoOptimize ? 'Auto-Shift ON' : 'Manual'}
          </button>
        </div>
      </div>

      {/* Protocol Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {profiles.map(p => {
          const isCurrentActive = activeRoute === p.id;
          return (
            <div 
              key={p.id}
              onClick={() => handleForceShift(p.id)}
              className={cn(
                "p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden",
                isCurrentActive 
                  ? "bg-gray-900/90 border-cyan-500/60 shadow-[0_0_15px_rgba(0,240,255,0.15)] ring-1 ring-cyan-500/30" 
                  : "bg-gray-950/60 border-gray-800/80 hover:border-gray-700"
              )}
            >
              {isCurrentActive && (
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-cyan-500 text-gray-950 font-mono font-bold text-[9px] rounded-bl-lg">
                  ROUTING FLOW
                </div>
              )}

              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white font-sans">{p.name}</span>
              </div>

              <p className="text-[11px] text-gray-400 font-mono">{p.protocol}</p>

              <div className="grid grid-cols-3 gap-1 my-2.5 pt-2 border-t border-gray-800/80 font-mono text-center">
                <div className="bg-gray-900/80 p-1.5 rounded">
                  <span className="text-[9px] text-gray-400 block">RTT</span>
                  <span className="text-xs font-bold text-cyan-400">{p.latencyMs}ms</span>
                </div>
                <div className="bg-gray-900/80 p-1.5 rounded">
                  <span className="text-[9px] text-gray-400 block">LOSS</span>
                  <span className={cn(
                    "text-xs font-bold",
                    p.packetLossPct > 2.0 ? "text-rose-400" : "text-emerald-400"
                  )}>
                    {p.packetLossPct}%
                  </span>
                </div>
                <div className="bg-gray-900/80 p-1.5 rounded">
                  <span className="text-[9px] text-gray-400 block">BW</span>
                  <span className="text-xs font-bold text-white">{p.throughputMbps}M</span>
                </div>
              </div>

              <p className="text-[10px] text-gray-400 leading-tight">{p.description}</p>
            </div>
          );
        })}
      </div>

      {/* Real-time Optimizer Event Logs */}
      <div className="bg-gray-950 p-3 rounded-lg border border-gray-800/80 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-gray-400 mb-1 font-bold">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Autonomous Route Shift Telemetry Log:</span>
        </div>
        <div className="space-y-1 text-gray-400">
          {switchLog.map((log, i) => (
            <p key={i} className="truncate text-gray-300">
              <span className="text-emerald-400">❯</span> {log}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
