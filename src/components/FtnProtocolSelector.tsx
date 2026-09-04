import React, { useState } from 'react';
import { 
  Shield, Lock, Zap, Activity, RefreshCw, Server, Globe, 
  Terminal, Sliders, CheckCircle2, AlertTriangle, ArrowRightLeft, 
  Copy, Check, HardDrive, Cpu, Radio, ShieldCheck, Database
} from 'lucide-react';
import { cn } from '../utils';

interface Oly7Tunnel {
  id: string;
  name: string;
  badge: string;
  protocolFamily: string;
  cipher: string;
  throughputGbps: number;
  rttMs: number;
  packetLossTolerated: string;
  status: 'ACTIVE' | 'STANDBY' | 'OPTIMIZING';
  keepaliveSec: number;
  mtu: number;
  useCase: string;
  antiSpoofing: boolean;
  dpiBypass: boolean;
  config: string;
}

const INITIAL_OLY7_TUNNELS: Oly7Tunnel[] = [
  {
    id: 'oly-amneziawg',
    name: 'AmneziaWG (Obfuscated WireGuard)',
    badge: 'OLY-7 PRIMARY',
    protocolFamily: 'Kernel Overlay / Noise IKpsk2',
    cipher: 'ChaCha20-Poly1305 + Junk Headers',
    throughputGbps: 9.6,
    rttMs: 8.2,
    packetLossTolerated: '< 15%',
    status: 'ACTIVE',
    keepaliveSec: 25,
    mtu: 1420,
    useCase: 'Hostile ISP circumvention, DPI bypass, zero-latency interconnect',
    antiSpoofing: true,
    dpiBypass: true,
    config: `[Interface]
PrivateKey = a0F9...
Address = 10.7.10.2/24
DNS = 10.7.10.1
Jc = 4
Jmin = 40
Jmax = 70
H1 = 1
H2 = 2
H3 = 3
H4 = 4

[Peer]
PublicKey = b8C2...
Endpoint = 103.145.10.1:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25`
  },
  {
    id: 'oly-hysteria2',
    name: 'Hysteria2 (QUIC Congestion Core)',
    badge: 'LOSS RESILIENT',
    protocolFamily: 'Custom QUIC / UDP',
    cipher: 'TLS 1.3 AES-256-GCM / ChaCha20',
    throughputGbps: 8.4,
    rttMs: 14.5,
    packetLossTolerated: 'Up to 45% (Zero Stalling)',
    status: 'ACTIVE',
    keepaliveSec: 15,
    mtu: 1350,
    useCase: 'Extreme packet loss lines, mobile 4G/5G failover, UDP acceleration',
    antiSpoofing: true,
    dpiBypass: true,
    config: `server: 103.145.10.1:443
auth: ftn-secure-token-2026
bandwidth:
  up: 500 mbps
  down: 1000 mbps
quic:
  initStreamReceiveWindow: 8388608
  maxStreamReceiveWindow: 8388608
fastOpen: true
masquerade:
  type: proxy
  proxy:
    url: https://cloudflare.com`
  },
  {
    id: 'oly-aether',
    name: 'Aether-Core Distributed Mesh',
    badge: 'P2P FULL MESH',
    protocolFamily: 'Decentralized SDN Fabric',
    cipher: 'Ed25519 + X25519 AEAD',
    throughputGbps: 7.8,
    rttMs: 11.0,
    packetLossTolerated: '< 20%',
    status: 'ACTIVE',
    keepaliveSec: 20,
    mtu: 9000,
    useCase: 'Multi-datacenter inter-router sync without central coordinator',
    antiSpoofing: true,
    dpiBypass: false,
    config: `node:
  identity: "aether://ed25519:7F9A..."
  listen: "0.0.0.0:4242"
  jumbo_frames: true
  mtu: 9000
  peers:
    - "103.145.10.10:4242"
    - "103.145.20.10:4242"
    - "103.145.30.10:4242"`
  },
  {
    id: 'oly-sslh',
    name: 'SSLH Port 443 Multiplexer & OpenVPN',
    badge: 'PORT 443 DEMUX',
    protocolFamily: 'L4 Multiplexing / SSL VPN',
    cipher: 'AES-256-GCM / TLS 1.3',
    throughputGbps: 6.2,
    rttMs: 16.4,
    packetLossTolerated: '< 10%',
    status: 'ACTIVE',
    keepaliveSec: 30,
    mtu: 1500,
    useCase: 'Conceals OpenVPN & WireGuard behind standard HTTPS 443 traffic',
    antiSpoofing: true,
    dpiBypass: true,
    config: `# /etc/default/sslh
DAEMON_OPTS="--user sslh --listen 0.0.0.0:443 \\
  --ssh 127.0.0.1:22 \\
  --ssl 127.0.0.1:8443 \\
  --openvpn 127.0.0.1:1194 \\
  --wireguard 127.0.0.1:51820 \\
  --timeout 2"`
  },
  {
    id: 'oly-multidb',
    name: 'Multi-Database Traffic Encryption (mTLS)',
    badge: 'mTLS DB WIRE',
    protocolFamily: 'L7 Transport Security',
    cipher: 'ECDSA P-384 + AES-256-GCM',
    throughputGbps: 10.0,
    rttMs: 2.1,
    packetLossTolerated: '< 5%',
    status: 'ACTIVE',
    keepaliveSec: 60,
    mtu: 9000,
    useCase: 'Encrypted PgBouncer, Redis & CockroachDB wire traffic across PoPs',
    antiSpoofing: true,
    dpiBypass: false,
    config: `# PostgreSQL clientcert verify-full
hostssl ftn_prod ftn_app 10.240.0.0/16 cert clientcert=verify-full
# CockroachDB secure node join
cockroach start --certs-dir=/certs --listen-addr=0.0.0.0:26257 --join=10.240.0.10:26257`
  },
  {
    id: 'oly-enterprise-vpn',
    name: 'Palo Alto GlobalProtect & FortiSSL Gateway',
    badge: 'CORP INTEROP',
    protocolFamily: 'IPsec / SSL Gateway',
    cipher: 'AES-256-CBC / SHA-256',
    throughputGbps: 5.5,
    rttMs: 18.0,
    packetLossTolerated: '< 8%',
    status: 'STANDBY',
    keepaliveSec: 45,
    mtu: 1400,
    useCase: 'Enterprise staff roaming and legacy corporate client interconnect',
    antiSpoofing: true,
    dpiBypass: false,
    config: `openconnect --protocol=gp vpn.corporate.ftndns.com \\
  --user=ftnadmin \\
  --servercert=pin-sha256:7B9... \\
  --csd-wrapper=/usr/libexec/openconnect/csd-wrapper.sh`
  },
  {
    id: 'oly-stun-cgnat',
    name: 'STUN / NAT Traversal (TrueNAS / Synology)',
    badge: 'CGNAT HOLE-PUNCH',
    protocolFamily: 'RFC 5389 STUN / RFC 8656 TURN',
    cipher: 'DTLS 1.2 / TLS 1.3',
    throughputGbps: 4.8,
    rttMs: 9.5,
    packetLossTolerated: '< 15%',
    status: 'ACTIVE',
    keepaliveSec: 15,
    mtu: 1450,
    useCase: 'CGNAT bypass for remote NAS management and QuickConnect bridging',
    antiSpoofing: true,
    dpiBypass: false,
    config: `listening-port=3478
tls-listening-port=5349
fingerprint
lt-cred-mech
realm=ftndns.com
cert=/etc/certs/turn.crt
pkey=/etc/certs/turn.key`
  }
];

export const FtnProtocolSelector = () => {
  const [tunnels, setTunnels] = useState<Oly7Tunnel[]>(INITIAL_OLY7_TUNNELS);
  const [selectedTunnel, setSelectedTunnel] = useState<Oly7Tunnel>(INITIAL_OLY7_TUNNELS[0]);
  const [copied, setCopied] = useState(false);
  const [isJumboEnabled, setIsJumboEnabled] = useState(true);
  const [isAntiSpoofingActive, setIsAntiSpoofingActive] = useState(true);

  const handleToggleStatus = (id: string) => {
    setTunnels(prev => prev.map(t => {
      if (t.id === id) {
        const nextStatus = t.status === 'ACTIVE' ? 'STANDBY' : 'ACTIVE';
        return { ...t, status: nextStatus };
      }
      return t;
    }));
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'info',
        title: 'Tunnel State Toggled',
        message: `Updated tunnel runtime state for ${id}`
      }
    }));
  };

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(selectedTunnel.config);
    setCopied(true);
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'success',
        title: 'Config Copied',
        message: `${selectedTunnel.name} configuration copied to clipboard.`
      }
    }));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBenchmarkHandshake = () => {
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'info',
        title: 'Oly-7 Handshake Benchmark Dispatched',
        message: `Measuring RTT, MTU clamping, and ChaCha20 cipher speed across active nodes.`
      }
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Panel */}
      <div className="glass-panel p-6 lg:p-8 rounded-3xl border border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00ff66] to-[#00f0ff] flex items-center justify-center text-gray-950 shadow-[0_0_20px_rgba(0,255,102,0.4)]">
                <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white font-display flex items-center gap-3">
                  Oly-7 Multi-Protocol Tunnel Encryption Matrix
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#00f0ff]/10 text-[#00f0ff] font-mono border border-[#00f0ff]/30">
                    Oly-7 Protocol Engine
                  </span>
                </h1>
                <p className="text-gray-400 font-mono text-xs lg:text-sm mt-0.5">
                  Multi-tunnel orchestrator: WireGuard, AmneziaWG (DPI Bypass), Hysteria2 (QUIC), Aether-Core, SSLH (443 Demux), and mTLS database traffic encryption.
                </p>
              </div>
            </div>
          </div>

          {/* Global Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsJumboEnabled(!isJumboEnabled)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all border flex items-center gap-2",
                isJumboEnabled
                  ? "bg-[#00ff66]/15 border-[#00ff66]/40 text-[#00ff66]"
                  : "bg-gray-800 border-gray-700 text-gray-400"
              )}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Jumbo Frames (9000 MTU): {isJumboEnabled ? 'ENABLED' : 'STANDARD (1500)'}</span>
            </button>

            <button
              onClick={() => setIsAntiSpoofingActive(!isAntiSpoofingActive)}
              className={cn(
                "px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all border flex items-center gap-2",
                isAntiSpoofingActive
                  ? "bg-[#00f0ff]/15 border-[#00f0ff]/40 text-[#00f0ff]"
                  : "bg-gray-800 border-gray-700 text-gray-400"
              )}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Anti-Spoofing (uRPF): {isAntiSpoofingActive ? 'STRICT' : 'LOOSE'}</span>
            </button>

            <button
              onClick={handleBenchmarkHandshake}
              className="px-4 py-2 bg-gradient-to-r from-[#00ff66] to-[#00f0ff] hover:opacity-90 text-gray-950 font-mono font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              Benchmark Handshakes
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tunnels List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 px-1">
            <span>CONFIGURED OLY-7 TUNNELS ({tunnels.length})</span>
            <span>TOTAL AGGREGATE: 52.1 Gbps</span>
          </div>

          <div className="space-y-3">
            {tunnels.map(t => {
              const isSelected = selectedTunnel.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTunnel(t)}
                  className={cn(
                    "p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden",
                    isSelected
                      ? "bg-gray-900 border-[#00f0ff]/60 shadow-[0_0_20px_rgba(0,240,255,0.15)] ring-1 ring-[#00f0ff]/40"
                      : "bg-gray-900/60 border-gray-800/80 hover:border-gray-700 hover:bg-gray-900/90"
                  )}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 border border-gray-700 font-bold text-gray-300">
                          {t.badge}
                        </span>
                        {t.dpiBypass && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold">
                            DPI BYPASS
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-gray-500">MTU: {isJumboEnabled && t.mtu === 9000 ? 9000 : t.mtu}</span>
                      </div>
                      <h3 className="text-base font-bold text-white font-display">{t.name}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-mono px-2.5 py-1 rounded-full border font-bold flex items-center gap-1",
                        t.status === 'ACTIVE'
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      )}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {t.status}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(t.id);
                        }}
                        className="text-xs font-mono px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                      >
                        Toggle
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 mb-3 font-mono">{t.useCase}</p>

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-800/60 text-center font-mono">
                    <div className="bg-gray-950/60 p-2 rounded-xl border border-gray-800">
                      <span className="text-[9px] text-gray-500 block">THROUGHPUT</span>
                      <span className="text-xs font-bold text-[#00ff66]">{t.throughputGbps} Gbps</span>
                    </div>
                    <div className="bg-gray-950/60 p-2 rounded-xl border border-gray-800">
                      <span className="text-[9px] text-gray-500 block">RTT LATENCY</span>
                      <span className="text-xs font-bold text-[#00f0ff]">{t.rttMs} ms</span>
                    </div>
                    <div className="bg-gray-950/60 p-2 rounded-xl border border-gray-800">
                      <span className="text-[9px] text-gray-500 block">KEEPALIVE</span>
                      <span className="text-xs font-bold text-amber-400">{t.keepaliveSec}s</span>
                    </div>
                    <div className="bg-gray-950/60 p-2 rounded-xl border border-gray-800">
                      <span className="text-[9px] text-gray-500 block">LOSS RESIL</span>
                      <span className="text-xs font-bold text-gray-300 truncate">{t.packetLossTolerated}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Tunnel Deep Inspection & Config */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl space-y-5 sticky top-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-[#00f0ff] font-bold">
                  {selectedTunnel.badge}
                </span>
                <h3 className="text-lg font-bold text-white font-display mt-1">
                  {selectedTunnel.name}
                </h3>
                <span className="text-xs text-gray-400 font-mono block mt-0.5">
                  Protocol: {selectedTunnel.protocolFamily}
                </span>
              </div>

              <button
                onClick={handleCopyConfig}
                className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-mono text-[#00ff66] border border-gray-700 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Config'}</span>
              </button>
            </div>

            {/* Cryptographic Specifications */}
            <div className="space-y-2 bg-gray-950/80 p-4 rounded-2xl border border-gray-800/80 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-500">Encryption Cipher:</span>
                <span className="text-gray-200 font-bold">{selectedTunnel.cipher}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-500">Anti-Spoofing:</span>
                <span className="text-emerald-400 font-bold">uRPF Strict Reverse Check</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800">
                <span className="text-gray-500">Persistent Keepalive:</span>
                <span className="text-amber-400 font-bold">{selectedTunnel.keepaliveSec} seconds</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-500">DPI Obfuscation:</span>
                <span className={selectedTunnel.dpiBypass ? "text-purple-400 font-bold" : "text-gray-500"}>
                  {selectedTunnel.dpiBypass ? "Active (Junk Bytes)" : "Standard Header"}
                </span>
              </div>
            </div>

            {/* Live Config Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                <span>Production Configuration:</span>
                <span className="text-[10px] text-gray-500">Auto-generated</span>
              </div>
              <pre className="text-[11px] font-mono bg-black/90 text-gray-300 p-4 rounded-2xl border border-gray-800/80 overflow-x-auto max-h-72 scrollbar-thin">
                <code>{selectedTunnel.config}</code>
              </pre>
            </div>

            {/* Deployment Action */}
            <div className="pt-2">
              <button
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('add-toast', {
                    detail: {
                      type: 'success',
                      title: 'Tunnel Synced to Core FIB',
                      message: `${selectedTunnel.name} successfully deployed to all active FTN Edge Nodes.`
                    }
                  }));
                }}
                className="w-full py-3 bg-gradient-to-r from-[#00f0ff] to-[#00ff66] text-gray-950 font-bold font-mono text-xs rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Sync Tunnel to Core FIB & eBPF Datapath</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
