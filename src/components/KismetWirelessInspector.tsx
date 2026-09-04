import React, { useState, useEffect } from 'react';
import { 
  Radio, Wifi, ShieldAlert, Activity, Play, Pause, RefreshCw, 
  Download, Filter, Search, Terminal, AlertTriangle, CheckCircle2, 
  Antenna, Laptop, Lock, Unlock, Eye, Sparkles, Volume2, VolumeX,
  FileCode, Layers, ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, Cell 
} from 'recharts';
import { cn } from '../utils';

export interface WirelessDevice {
  bssid: string;
  essid: string;
  manufacturer: string;
  channel: number;
  frequency: string;
  signalDbm: number;
  clientsCount: number;
  encryption: 'WPA3-SAE' | 'WPA2-Enterprise' | 'WPA2-PSK' | 'OWE' | 'OPEN';
  packets: number;
  type: 'AP' | 'Client' | 'BLE' | 'SDR';
  lastSeen: string;
  flagged?: boolean;
  threatLevel?: 'SAFE' | 'SUSPICIOUS' | 'ROGUE';
}

export interface WidsAlert {
  id: string;
  timestamp: string;
  type: 'DEAUTH_FLOOD' | 'ROGUE_AP' | 'EVIL_TWIN' | 'KARMA_ATTACK' | 'WPS_BRUTE' | 'UNENCRYPTED_AUTH';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO';
  bssid: string;
  targetClient?: string;
  channel: number;
  description: string;
  mitigated: boolean;
}

const MOCK_DEVICES: WirelessDevice[] = [
  {
    bssid: 'E4:95:6E:4A:12:80',
    essid: 'FTN-Enterprise-Mesh-01',
    manufacturer: 'Ubiquiti Inc.',
    channel: 36,
    frequency: '5.180 GHz (802.11ax)',
    signalDbm: -42,
    clientsCount: 28,
    encryption: 'WPA3-SAE',
    packets: 482910,
    type: 'AP',
    lastSeen: '1s ago',
    threatLevel: 'SAFE'
  },
  {
    bssid: '2C:39:96:B8:F1:C4',
    essid: 'FTN-Guest-Secure',
    manufacturer: 'MikroTik Cloud Router',
    channel: 149,
    frequency: '5.745 GHz (802.11ac)',
    signalDbm: -48,
    clientsCount: 42,
    encryption: 'OWE',
    packets: 312040,
    type: 'AP',
    lastSeen: 'just now',
    threatLevel: 'SAFE'
  },
  {
    bssid: '00:14:6C:77:AA:99',
    essid: 'FTN-Enterprise-Mesh-01 [ROGUE]',
    manufacturer: 'Unknown (ESP32 / Marauder)',
    channel: 36,
    frequency: '5.180 GHz',
    signalDbm: -32,
    clientsCount: 3,
    encryption: 'WPA2-PSK',
    packets: 14520,
    type: 'AP',
    lastSeen: 'just now',
    flagged: true,
    threatLevel: 'ROGUE'
  },
  {
    bssid: 'AC:7F:3E:91:20:15',
    essid: 'Edge-Backhaul-P2P',
    manufacturer: 'Cisco Systems',
    channel: 6,
    frequency: '2.437 GHz (802.11n)',
    signalDbm: -58,
    clientsCount: 4,
    encryption: 'WPA2-Enterprise',
    packets: 98450,
    type: 'AP',
    lastSeen: '3s ago',
    threatLevel: 'SAFE'
  },
  {
    bssid: 'DC:A6:32:44:88:12',
    essid: 'FTN-IoT-Telemetry-Grid',
    manufacturer: 'Raspberry Pi Trading',
    channel: 11,
    frequency: '2.462 GHz (Zigbee/WiFi)',
    signalDbm: -63,
    clientsCount: 15,
    encryption: 'WPA2-PSK',
    packets: 67120,
    type: 'AP',
    lastSeen: '4s ago',
    threatLevel: 'SAFE'
  },
  {
    bssid: '74:83:C2:5B:3F:89',
    essid: 'Coffee-Free-WiFi-Fake',
    manufacturer: 'Pineapple Technologies',
    channel: 1,
    frequency: '2.412 GHz',
    signalDbm: -38,
    clientsCount: 9,
    encryption: 'OPEN',
    packets: 39800,
    type: 'AP',
    lastSeen: 'just now',
    flagged: true,
    threatLevel: 'SUSPICIOUS'
  },
  {
    bssid: 'F4:D4:88:9C:12:01',
    essid: 'FTN-6GHz-Backbone-Ultra',
    manufacturer: 'Aruba Networks',
    channel: 69,
    frequency: '6.295 GHz (Wi-Fi 6E)',
    signalDbm: -45,
    clientsCount: 19,
    encryption: 'WPA3-SAE',
    packets: 781290,
    type: 'AP',
    lastSeen: 'just now',
    threatLevel: 'SAFE'
  },
  {
    bssid: 'C8:69:CD:1F:90:3A',
    essid: 'BLE-Beacon-Asset-Node04',
    manufacturer: 'Nordic Semiconductor',
    channel: 37,
    frequency: '2.402 GHz (Bluetooth 5.2)',
    signalDbm: -72,
    clientsCount: 1,
    encryption: 'OPEN',
    packets: 8420,
    type: 'BLE',
    lastSeen: '2s ago',
    threatLevel: 'SAFE'
  }
];

const MOCK_ALERTS: WidsAlert[] = [
  {
    id: 'WIDS-9481',
    timestamp: '10:24:18',
    type: 'DEAUTH_FLOOD',
    severity: 'CRITICAL',
    bssid: 'E4:95:6E:4A:12:80',
    targetClient: 'FF:FF:FF:FF:FF:FF (Broadcast)',
    channel: 36,
    description: 'Deauthentication frame storm (>450 frames/sec) detected. Attempting to force 4-way handshake re-association.',
    mitigated: false
  },
  {
    id: 'WIDS-9482',
    timestamp: '10:23:42',
    type: 'EVIL_TWIN',
    severity: 'CRITICAL',
    bssid: '00:14:6C:77:AA:99',
    channel: 36,
    description: 'Evil Twin detected: Rogue AP impersonating "FTN-Enterprise-Mesh-01" with downgraded encryption (WPA2 vs WPA3-SAE).',
    mitigated: false
  },
  {
    id: 'WIDS-9483',
    timestamp: '10:20:05',
    type: 'KARMA_ATTACK',
    severity: 'HIGH',
    bssid: '74:83:C2:5B:3F:89',
    channel: 1,
    description: 'Wildcard probe response injection observed matching all client beacon requests (Pineapple Karma behavior).',
    mitigated: true
  },
  {
    id: 'WIDS-9484',
    timestamp: '10:14:29',
    type: 'WPS_BRUTE',
    severity: 'MEDIUM',
    bssid: 'AC:7F:3E:91:20:15',
    channel: 6,
    description: 'Repeated WPS M1-M4 registration exchange anomaly detected from external client MAC.',
    mitigated: true
  }
];

const CHANNEL_SPECTRUM_DATA = [
  { channel: 'Ch 1', count: 18, pps: 420, band: '2.4 GHz' },
  { channel: 'Ch 6', count: 24, pps: 680, band: '2.4 GHz' },
  { channel: 'Ch 11', count: 14, pps: 340, band: '2.4 GHz' },
  { channel: 'Ch 36', count: 32, pps: 1240, band: '5 GHz' },
  { channel: 'Ch 40', count: 19, pps: 810, band: '5 GHz' },
  { channel: 'Ch 44', count: 15, pps: 540, band: '5 GHz' },
  { channel: 'Ch 48', count: 22, pps: 920, band: '5 GHz' },
  { channel: 'Ch 149', count: 28, pps: 1100, band: '5 GHz' },
  { channel: 'Ch 153', count: 17, pps: 630, band: '5 GHz' },
  { channel: 'Ch 161', count: 12, pps: 490, band: '5 GHz' },
  { channel: 'Ch 69 (6G)', count: 26, pps: 1480, band: '6 GHz' }
];

export function KismetWirelessInspector() {
  const [activeTab, setActiveTab] = useState<'devices' | 'wids' | 'spectrum' | 'capture'>('devices');
  const [isCapturing, setIsCapturing] = useState(true);
  const [selectedInterface, setSelectedInterface] = useState('wlan0mon (Alfa RTL8812AU)');
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedBand, setSelectedBand] = useState<string>('ALL');
  const [devices, setDevices] = useState<WirelessDevice[]>(MOCK_DEVICES);
  const [alerts, setAlerts] = useState<WidsAlert[]>(MOCK_ALERTS);
  const [selectedDevice, setSelectedDevice] = useState<WirelessDevice | null>(null);
  const [audioAlerts, setAudioAlerts] = useState(true);
  const [packetRate, setPacketRate] = useState(3840);
  const [currentChannel, setCurrentChannel] = useState(36);

  useEffect(() => {
    if (!isCapturing) return;
    const interval = setInterval(() => {
      setPacketRate(prev => Math.floor(prev + (Math.random() * 400 - 200)));
      setCurrentChannel([1, 6, 11, 36, 40, 44, 48, 149, 153, 161, 69][Math.floor(Math.random() * 11)]);
      
      setDevices(prev => prev.map(d => ({
        ...d,
        packets: d.packets + Math.floor(Math.random() * 25)
      })));
    }, 1200);

    return () => clearInterval(interval);
  }, [isCapturing]);

  const handleMitigate = (alertId: string) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, mitigated: true } : a));
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'success',
        title: 'Mitigation Dispatched',
        message: `Radio frequency isolation and targeted deauth guard enabled for ${alertId}.`
      }
    }));
  };

  const handleExportPcap = () => {
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'info',
        title: 'PCAP-NG Export Initialized',
        message: `Generating Kismet capture dump: kismet_dump_${new Date().toISOString().replace(/[:.]/g, '-')}.pcapng`
      }
    }));
  };

  const filteredDevices = devices.filter(d => {
    const matchesSearch = d.essid.toLowerCase().includes(filterQuery.toLowerCase()) || 
                          d.bssid.toLowerCase().includes(filterQuery.toLowerCase()) ||
                          d.manufacturer.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesBand = selectedBand === 'ALL' || 
                        (selectedBand === '2.4' && d.frequency.includes('2.4')) ||
                        (selectedBand === '5' && d.frequency.includes('5')) ||
                        (selectedBand === '6' && d.frequency.includes('6')) ||
                        (selectedBand === 'BLE' && d.type === 'BLE');
    return matchesSearch && matchesBand;
  });

  const activeAlertsCount = alerts.filter(a => !a.mitigated).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Kismet Header */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-gray-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold font-display text-white tracking-wide">
                    Kismet Wireless & RF Inspector
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    v2026.08-GIT
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">
                  Autonomous 802.11 Wi-Fi, Bluetooth LE & RTL-SDR Packet Sniffer and WIDS Intrusion Detection Engine
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsCapturing(!isCapturing)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-md",
                isCapturing 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30" 
                  : "bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30"
              )}
            >
              {isCapturing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isCapturing ? 'Capturing (Active)' : 'Capture Paused'}
            </button>

            <button
              onClick={handleExportPcap}
              className="px-3.5 py-2 rounded-xl text-sm font-medium bg-gray-800/80 hover:bg-gray-800 text-gray-200 border border-gray-700/60 flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              Export .pcapng
            </button>

            <button
              onClick={() => setAudioAlerts(!audioAlerts)}
              className={cn(
                "p-2 rounded-xl border transition-colors",
                audioAlerts 
                  ? "bg-gray-800/80 text-cyan-400 border-cyan-500/30" 
                  : "bg-gray-900 text-gray-500 border-gray-800"
              )}
              title={audioAlerts ? "Sound Alerts Enabled" : "Sound Alerts Muted"}
            >
              {audioAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Telemetry quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-6 pt-6 border-t border-gray-800/60">
          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Packet Rate</span>
            <span className="text-xl font-bold font-mono text-cyan-400">{packetRate.toLocaleString()} <span className="text-xs text-gray-500 font-normal">pkts/s</span></span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Active Channel</span>
            <span className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-1.5">
              <Antenna className="w-4 h-4 text-emerald-400 animate-pulse" />
              Ch {currentChannel}
            </span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Detected BSSIDs</span>
            <span className="text-xl font-bold font-mono text-white">{devices.length} APs</span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Active Clients</span>
            <span className="text-xl font-bold font-mono text-purple-400">118 Clients</span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">WIDS Threats</span>
            <span className={cn(
              "text-xl font-bold font-mono flex items-center gap-1.5",
              activeAlertsCount > 0 ? "text-rose-400" : "text-emerald-400"
            )}>
              <ShieldAlert className="w-4 h-4" />
              {activeAlertsCount} Unmitigated
            </span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Interface</span>
            <span className="text-xs font-mono text-gray-300 truncate block mt-1" title={selectedInterface}>
              {selectedInterface.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('devices')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
            activeTab === 'devices' 
              ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          )}
        >
          <Wifi className="w-4 h-4" />
          Wireless Network Grid ({filteredDevices.length})
        </button>

        <button
          onClick={() => setActiveTab('wids')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all relative",
            activeTab === 'wids' 
              ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          )}
        >
          <ShieldAlert className="w-4 h-4" />
          WIDS Intrusion Matrix
          {activeAlertsCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-rose-500 text-white font-mono font-bold">
              {activeAlertsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('spectrum')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
            activeTab === 'spectrum' 
              ? "bg-purple-500/15 text-purple-400 border border-purple-500/30" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          )}
        >
          <Activity className="w-4 h-4" />
          RF Spectrum & Channels
        </button>

        <button
          onClick={() => setActiveTab('capture')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
            activeTab === 'capture' 
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          )}
        >
          <Terminal className="w-4 h-4" />
          KismetDB & Source Capture
        </button>
      </div>

      {/* Tab: Devices Grid */}
      {activeTab === 'devices' && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 glass-panel p-4 rounded-xl border border-gray-800">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text"
                placeholder="Filter by SSID, BSSID, or Vendor..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full bg-gray-900/90 border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <span className="text-xs font-mono text-gray-400">Band:</span>
              {['ALL', '2.4', '5', '6', 'BLE'].map(band => (
                <button
                  key={band}
                  onClick={() => setSelectedBand(band)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-mono transition-colors",
                    selectedBand === band 
                      ? "bg-cyan-500 text-gray-950 font-bold" 
                      : "bg-gray-800/80 text-gray-400 hover:text-white"
                  )}
                >
                  {band === 'ALL' ? 'All Bands' : band === 'BLE' ? 'BLE 5.2' : `${band} GHz`}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-900/70 text-xs font-mono uppercase text-gray-400">
                    <th className="p-3.5">ESSID / Network</th>
                    <th className="p-3.5">BSSID (MAC)</th>
                    <th className="p-3.5">Vendor</th>
                    <th className="p-3.5">Ch / Frequency</th>
                    <th className="p-3.5">Signal (dBm)</th>
                    <th className="p-3.5">Security</th>
                    <th className="p-3.5">Clients</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono text-xs">
                  {filteredDevices.map(dev => {
                    const isRogue = dev.threatLevel === 'ROGUE';
                    const isSuspicious = dev.threatLevel === 'SUSPICIOUS';
                    return (
                      <tr 
                        key={dev.bssid} 
                        className={cn(
                          "transition-colors hover:bg-gray-800/40",
                          isRogue && "bg-rose-950/20 hover:bg-rose-950/30",
                          isSuspicious && "bg-amber-950/15 hover:bg-amber-950/25"
                        )}
                      >
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            {dev.type === 'BLE' ? (
                              <Antenna className="w-4 h-4 text-purple-400 flex-shrink-0" />
                            ) : (
                              <Wifi className={cn(
                                "w-4 h-4 flex-shrink-0",
                                isRogue ? "text-rose-400" : isSuspicious ? "text-amber-400" : "text-cyan-400"
                              )} />
                            )}
                            <div>
                              <span className={cn(
                                "font-sans font-semibold text-sm block",
                                isRogue ? "text-rose-300" : "text-gray-100"
                              )}>
                                {dev.essid}
                              </span>
                              <span className="text-[11px] text-gray-500 font-mono">{dev.type} • {dev.packets.toLocaleString()} packets</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-gray-300">{dev.bssid}</td>
                        <td className="p-3.5 text-gray-400 font-sans text-xs">{dev.manufacturer}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                            Ch {dev.channel}
                          </span>
                          <span className="block text-[10px] text-gray-500 mt-0.5">{dev.frequency.split(' ')[0]}</span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-bold",
                              dev.signalDbm > -50 ? "text-emerald-400" : dev.signalDbm > -65 ? "text-cyan-400" : "text-amber-400"
                            )}>
                              {dev.signalDbm} dBm
                            </span>
                            <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  dev.signalDbm > -50 ? "bg-emerald-400" : dev.signalDbm > -65 ? "bg-cyan-400" : "bg-amber-400"
                                )}
                                style={{ width: `${Math.min(100, Math.max(10, 100 + dev.signalDbm))}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-semibold border inline-flex items-center gap-1",
                            dev.encryption === 'WPA3-SAE' ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/30" :
                            dev.encryption === 'WPA2-Enterprise' ? "bg-cyan-950/40 text-cyan-400 border-cyan-500/30" :
                            dev.encryption === 'OWE' ? "bg-purple-950/40 text-purple-400 border-purple-500/30" :
                            dev.encryption === 'WPA2-PSK' ? "bg-blue-950/40 text-blue-400 border-blue-500/30" :
                            "bg-rose-950/40 text-rose-400 border-rose-500/30"
                          )}>
                            {dev.encryption === 'OPEN' ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                            {dev.encryption}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-gray-300">{dev.clientsCount} assoc</td>
                        <td className="p-3.5">
                          {isRogue ? (
                            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold">
                              ROGUE AP
                            </span>
                          ) : isSuspicious ? (
                            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[10px] font-bold">
                              SUSPICIOUS
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                              VERIFIED
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => setSelectedDevice(dev)}
                            className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-sans transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: WIDS Intrusion Matrix */}
      {activeTab === 'wids' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-panel p-4 rounded-xl border border-rose-900/40 bg-rose-950/10">
              <span className="text-xs font-mono text-rose-400 uppercase">Critical Threat Events</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">2 Active Floods</p>
              <span className="text-xs text-rose-300/80 mt-1 block">Deauth Storm & Evil Twin Beaconing</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-amber-900/40 bg-amber-950/10">
              <span className="text-xs font-mono text-amber-400 uppercase">Automated Mitigations</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">2 Remediated</p>
              <span className="text-xs text-amber-300/80 mt-1 block">Karma AP and WPS Brute Force blocked</span>
            </div>

            <div className="glass-panel p-4 rounded-xl border border-cyan-900/40 bg-cyan-950/10">
              <span className="text-xs font-mono text-cyan-400 uppercase">WIDS Guard Engine</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">802.11w PMF</p>
              <span className="text-xs text-cyan-300/80 mt-1 block">Protected Management Frames Enforced</span>
            </div>
          </div>

          <div className="space-y-3">
            {alerts.map(alert => (
              <div 
                key={alert.id}
                className={cn(
                  "glass-panel p-5 rounded-xl border transition-all",
                  alert.mitigated 
                    ? "border-gray-800/80 bg-gray-900/40 opacity-70" 
                    : alert.severity === 'CRITICAL' 
                    ? "border-rose-800/60 bg-rose-950/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]" 
                    : "border-amber-800/60 bg-amber-950/20"
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2.5 rounded-xl flex-shrink-0 mt-0.5",
                      alert.mitigated ? "bg-gray-800 text-gray-400" :
                      alert.severity === 'CRITICAL' ? "bg-rose-500/20 text-rose-400 border border-rose-500/40" :
                      "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    )}>
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{alert.id}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[11px] font-mono font-bold",
                          alert.severity === 'CRITICAL' ? "bg-rose-900/60 text-rose-300" : "bg-amber-900/60 text-amber-300"
                        )}>
                          {alert.type}
                        </span>
                        <span className="text-xs font-mono text-gray-400">@ {alert.timestamp} on Ch {alert.channel}</span>
                        {alert.mitigated && (
                          <span className="px-2 py-0.5 rounded bg-emerald-900/40 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> MITIGATED
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 mt-1.5 font-sans leading-relaxed">
                        {alert.description}
                      </p>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs font-mono text-gray-400">
                        <span>Source BSSID: <span className="text-cyan-400">{alert.bssid}</span></span>
                        {alert.targetClient && (
                          <span>Target Client: <span className="text-purple-400">{alert.targetClient}</span></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:flex-shrink-0">
                    {!alert.mitigated ? (
                      <button
                        onClick={() => handleMitigate(alert.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold font-mono bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20 transition-all flex items-center gap-2"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Execute Mitigation
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Filter Rules Applied
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: RF Spectrum & Channels */}
      {activeTab === 'spectrum' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-gray-800">
            <h3 className="text-lg font-bold text-white font-display mb-1 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Channel Density & Packet Activity Distribution
            </h3>
            <p className="text-xs text-gray-400 mb-6 font-mono">
              Live RF spectrum sweep over 2.4 GHz, 5 GHz UNII-1/UNII-3 and 6 GHz Wi-Fi 6E bands
            </p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHANNEL_SPECTRUM_DATA}>
                  <XAxis dataKey="channel" stroke="#6b7280" fontSize={11} />
                  <YAxis stroke="#6b7280" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                    labelStyle={{ color: '#00f0ff', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="pps" name="Packets / Sec" fill="#00f0ff" radius={[4, 4, 0, 0]}>
                    {CHANNEL_SPECTRUM_DATA.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.band === '6 GHz' ? '#10b981' : entry.band === '5 GHz' ? '#00f0ff' : '#a855f7'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-500 inline-block" /> 2.4 GHz Band</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-cyan-400 inline-block" /> 5 GHz Band</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> 6 GHz (Wi-Fi 6E/7)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Capture & KismetDB */}
      {activeTab === 'capture' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Kismet Capture Interface Pipeline
            </h3>
            
            <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 font-mono text-xs text-gray-300 space-y-2">
              <p className="text-gray-500"># Start Kismet wireless server daemon with Alfa 802.11ac adapter</p>
              <p className="text-cyan-400">$ kismet -c wlan0mon:type=linuxwifi,name=alfa0 -c sdr0:type=rtl433,name=rtlsdr</p>
              <p className="text-gray-400">[INFO] Source wlan0mon: Opened Wi-Fi monitor interface on phy0</p>
              <p className="text-gray-400">[INFO] Source sdr0: Listening on 433.92MHz for ISM/Zigbee sensor packets</p>
              <p className="text-emerald-400">[READY] Database: writing to /var/log/kismet/Kismet-20260903-ftn.kismetdb</p>
              <p className="text-cyan-300">[HTTP] Web UI and REST API listening on 0.0.0.0:2501</p>
              <p className="text-gray-500"># Direct PCAP stream pipe to FTN eBPF inspector</p>
              <p className="text-purple-400">$ kismet_cap_linux_wifi --source wlan0 --fifo /tmp/kismet_fifo | ftn-packet-catcher</p>
            </div>

            <div className="pt-2">
              <label className="text-xs font-mono text-gray-400 block mb-1">Select Active Hardware Source Interface</label>
              <select 
                value={selectedInterface}
                onChange={(e) => setSelectedInterface(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg p-2.5 text-sm text-gray-200 font-mono focus:border-cyan-500"
              >
                <option>wlan0mon (Alfa RTL8812AU - 802.11ac 2x2 MIMO)</option>
                <option>wlan1mon (Intel Wi-Fi 6E AX210 - 2.4/5/6 GHz)</option>
                <option>sdr0 (RTL-SDR v4 - 24MHz-1.7GHz SDR)</option>
                <option>hci0 (Intel AX210 Bluetooth 5.2 LE)</option>
              </select>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              KismetDB Storage Engine
            </h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-gray-900/70 rounded-lg border border-gray-800">
                <span className="text-xs text-gray-400 font-mono block">Current SQLite KismetDB</span>
                <span className="text-sm font-mono font-bold text-white mt-0.5 block">Kismet-20260903-ftn.kismetdb</span>
                <span className="text-xs text-cyan-400 font-mono mt-1 block">Size: 418.4 MB (48,290 frames)</span>
              </div>

              <div className="p-3 bg-gray-900/70 rounded-lg border border-gray-800">
                <span className="text-xs text-gray-400 font-mono block">GPS / Geolocation Tracking</span>
                <span className="text-sm font-mono font-bold text-emerald-400 mt-0.5 block">GPSD Connected (37.7749° N, 122.4194° W)</span>
                <span className="text-xs text-gray-500 font-mono mt-1 block">Accurate Wardrive / Signal Mapping</span>
              </div>

              <button
                onClick={handleExportPcap}
                className="w-full py-2.5 rounded-xl font-mono text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-gray-950 flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Download className="w-4 h-4" /> Download Raw .kismetdb
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Device Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-white font-display text-lg">{selectedDevice.essid}</h3>
              </div>
              <button 
                onClick={() => setSelectedDevice(null)}
                className="text-gray-400 hover:text-white text-lg font-mono"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-gray-800/60">
                <span className="text-gray-400">BSSID:</span>
                <span className="text-cyan-400 font-bold">{selectedDevice.bssid}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Manufacturer:</span>
                <span className="text-gray-200">{selectedDevice.manufacturer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Frequency / Channel:</span>
                <span className="text-gray-200">{selectedDevice.frequency} (Ch {selectedDevice.channel})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Signal Strength:</span>
                <span className="text-emerald-400 font-bold">{selectedDevice.signalDbm} dBm</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Encryption Standard:</span>
                <span className="text-purple-400 font-bold">{selectedDevice.encryption}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-800/60">
                <span className="text-gray-400">Packets Captured:</span>
                <span className="text-white">{selectedDevice.packets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-400">Threat Assessment:</span>
                <span className={cn(
                  "font-bold",
                  selectedDevice.threatLevel === 'ROGUE' ? "text-rose-400" :
                  selectedDevice.threatLevel === 'SUSPICIOUS' ? "text-amber-400" : "text-emerald-400"
                )}>
                  {selectedDevice.threatLevel}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDevice(null)}
                className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-mono"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
