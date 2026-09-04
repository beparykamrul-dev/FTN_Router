import React, { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Server,
  Network,
  Users,
  Wifi,
  Globe,
  Globe2,
  Cpu,
  HardDrive,
  Radio,
  Zap,
  RefreshCw,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  Crosshair,
  Layers,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Laptop,
  Smartphone,
  Tv,
  Monitor,
  Tablet,
  Check,
  Lock,
  Compass,
  Download,
  SlidersHorizontal,
  Bot,
  BookOpen
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '../utils';

// Real-Time 24H Traffic Analytics
const TRAFFIC_ANALYTICS_DATA = [
  { time: '00:00', inbound: 0.95, outbound: 0.72 },
  { time: '02:00', inbound: 1.10, outbound: 0.85 },
  { time: '04:00', inbound: 0.82, outbound: 0.65 },
  { time: '06:00', inbound: 1.25, outbound: 0.98 },
  { time: '08:00', inbound: 1.58, outbound: 1.20 },
  { time: '10:00', inbound: 1.82, outbound: 1.45 },
  { time: '12:00', inbound: 1.74, outbound: 1.38 },
  { time: '14:00', inbound: 1.95, outbound: 1.52 },
  { time: '16:00', inbound: 2.10, outbound: 1.68 },
  { time: '18:00', inbound: 2.25, outbound: 1.80 },
  { time: '20:00', inbound: 1.98, outbound: 1.62 },
  { time: '22:00', inbound: 1.65, outbound: 1.35 },
  { time: '24:00', inbound: 1.32, outbound: 1.13 },
];

// Top Applications
const TOP_APPLICATIONS = [
  { name: 'YouTube', traffic: '482 Gbps', percent: 85, color: '#3b82f6' },
  { name: 'Facebook', traffic: '321 Gbps', percent: 62, color: '#2563eb' },
  { name: 'Netflix', traffic: '256 Gbps', percent: 48, color: '#1d4ed8' },
  { name: 'TikTok', traffic: '198 Gbps', percent: 36, color: '#0284c7' },
  { name: 'WhatsApp', traffic: '175 Gbps', percent: 30, color: '#0ea5e9' },
];

// Threat Intelligence Breakdown
const THREAT_DATA = [
  { name: 'Malware', count: 8432, color: '#00f0ff' },
  { name: 'DDoS', count: 6812, color: '#3b82f6' },
  { name: 'Brute Force', count: 5421, color: '#00ff66' },
  { name: 'Intrusion', count: 3103, color: '#14b8a6' },
];

// Router Health Rows
const ROUTER_HEALTH_DATA = [
  { id: 'FTN-CORE-01', status: 'Online', cpu: '28%', ram: '46%', traffic: '1.25 Tbps', latency: '24.2 ms', isWarning: false },
  { id: 'FTN-EDGE-01', status: 'Online', cpu: '32%', ram: '49%', traffic: '982 Gbps', latency: '21.7 ms', isWarning: false },
  { id: 'FTN-EDGE-02', status: 'Online', cpu: '25%', ram: '42%', traffic: '812 Gbps', latency: '23.1 ms', isWarning: false },
  { id: 'FTN-EDGE-03', status: 'Degraded', cpu: '67%', ram: '72%', traffic: '673 Gbps', latency: '45.6 ms', isWarning: true },
  { id: 'FTN-EDGE-04', status: 'Online', cpu: '22%', ram: '37%', traffic: '512 Gbps', latency: '20.3 ms', isWarning: false },
];

// Firmware Pipeline Steps
const FIRMWARE_STEPS = [
  { title: 'Health Check', completed: true },
  { title: 'Profile Select', completed: true },
  { title: 'Build Firmware', completed: true },
  { title: 'Security Scan', completed: true },
  { title: 'Test & Validate', completed: true },
  { title: 'Deploy', completed: false, active: true },
];

// Global Mesh DNS Engines
const DNS_ENGINES = [
  { name: 'PowerDNS', desc: 'ns1.familytimenet.com\n103.52.87.1\n138.199.115.19', status: 'Online', color: '#00f0ff' },
  { name: 'Technitium', desc: 'Enterprise', status: 'Online', color: '#a855f7' },
  { name: 'CoreDNS', desc: 'Mesh K8s', status: 'Online', color: '#3b82f6' },
  { name: 'Unbound', desc: 'DoT/DoH', status: 'Online', color: '#10b981' },
  { name: 'dnsdist', desc: 'Balancing', status: 'Online', color: '#ec4899' },
  { name: 'GoDNS', desc: 'Dynamic', status: 'Online', color: '#06b6d4' },
  { name: 'Anycast DNS', desc: 'Global BGP', status: 'Online', color: '#00ff66' },
  { name: 'DNSPod', desc: 'Tencent Cloud', status: 'Online', color: '#f59e0b' },
  { name: 'Cloudflare DNS', desc: '1.1.1.1 Upstream', status: 'Online', color: '#f97316' },
  { name: 'Akamai DNS', desc: 'Edge Route', status: 'Online', color: '#38bdf8' },
];

// Global NOC Nodes for Interactive Map
const NOC_NODES = [
  { id: 'FTN-S01', name: 'Canada', type: 'Edge Router', x: 23, y: 26, ping: '22ms', traffic: '420 Gbps', ip: '198.51.100.12' },
  { id: 'FTN-DC01', name: 'USA West', type: 'Data Center', x: 19, y: 35, ping: '18ms', traffic: '890 Gbps', ip: '104.16.24.5' },
  { id: 'FTN-DC02', name: 'USA East', type: 'Data Center', x: 28, y: 37, ping: '19ms', traffic: '1.1 Tbps', ip: '172.67.12.80' },
  { id: 'FTN-S02', name: 'Brazil', type: 'Edge Router', x: 34, y: 68, ping: '48ms', traffic: '310 Gbps', ip: '185.199.108.1' },
  { id: 'FTN-CORE-01', name: 'Europe', type: 'Core Router', x: 52, y: 28, ping: '14ms', traffic: '1.65 Tbps', ip: '194.26.29.1' },
  { id: 'FTN-S03', name: 'South Africa', type: 'Edge Router', x: 55, y: 72, ping: '58ms', traffic: '190 Gbps', ip: '102.130.11.4' },
  { id: 'FTN-S04', name: 'Bangladesh', type: 'Edge Router', x: 74, y: 44, ping: '4ms', traffic: '950 Gbps', ip: '103.145.118.1' },
  { id: 'FTN-DC03', name: 'Singapore', type: 'Data Center', x: 78, y: 55, ping: '28ms', traffic: '1.4 Tbps', ip: '119.81.28.10' },
  { id: 'FTN-S05', name: 'Australia', type: 'Edge Router', x: 88, y: 76, ping: '62ms', traffic: '280 Gbps', ip: '139.130.4.5' },
];

const NOC_LINKS = [
  { from: 'FTN-S01', to: 'FTN-DC01' },
  { from: 'FTN-DC01', to: 'FTN-DC02' },
  { from: 'FTN-DC02', to: 'FTN-CORE-01' },
  { from: 'FTN-DC02', to: 'FTN-S02' },
  { from: 'FTN-CORE-01', to: 'FTN-S03' },
  { from: 'FTN-CORE-01', to: 'FTN-S04' },
  { from: 'FTN-S04', to: 'FTN-DC03' },
  { from: 'FTN-DC03', to: 'FTN-S05' },
  { from: 'FTN-DC01', to: 'FTN-DC03' },
];

export function FtnCoreControlPlane({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [is3DMode, setIs3DMode] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedNode, setSelectedNode] = useState<typeof NOC_NODES[0] | null>(NOC_NODES[4]); // Europe Core
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeDeviceView, setActiveDeviceView] = useState<'desktop' | 'laptop' | 'tablet' | 'mobile' | 'tv' | 'ultrawide'>('desktop');
  const [isBuildingFirmware, setIsBuildingFirmware] = useState(false);
  const [liveUptimeSeconds, setLiveUptimeSeconds] = useState(1103552); // ~12d 18h 32m

  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      setLiveUptimeSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [autoRefresh]);

  const formatUptime = (totalSecs: number) => {
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  };

  const handleBuildFirmware = () => {
    setIsBuildingFirmware(true);
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'info',
        title: 'Firmware Pipeline Initialized',
        message: 'Running automated security scan, compiler profile validation and image build.'
      }
    }));
    setTimeout(() => {
      setIsBuildingFirmware(false);
      window.dispatchEvent(new CustomEvent('add-toast', {
        detail: {
          type: 'success',
          title: 'Firmware Build Verified: v2.6.0-Enterprise',
          message: 'Zero Trust signed kernel ready for deployment across 30 active FTN nodes.'
        }
      }));
    }, 2500);
  };

  return (
    <div className="space-y-4 text-white select-none">
      {/* Top Banner Control Plane Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#080d1a]/95 p-4 rounded-2xl border border-[#00f0ff]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-[#00f0ff]/20 to-[#00ff66]/10 border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <Globe className="w-6 h-6 text-[#00f0ff] animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-black tracking-wider uppercase flex items-center gap-3 font-display">
              FTN CORE CONTROL PLANE
            </h1>
            <p className="text-[11px] text-gray-400 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
              Primary Autonomous Network Operating System • Global Multi-CDN &amp; Mesh Fabric
            </p>
          </div>
        </div>

        {/* Top Control Switches & Profile */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          {/* Quick Launch Buttons */}
          <div className="hidden xl:flex items-center gap-1.5 bg-[#091122] p-1 rounded-xl border border-gray-800 text-xs font-mono">
            <button
              onClick={() => onNavigate?.('setup-wizard')}
              className="px-2.5 py-1 rounded-lg bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 hover:border-[#00f0ff] flex items-center gap-1.5 transition-all text-[11px] font-bold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Setup Wizard</span>
            </button>
            <button
              onClick={() => onNavigate?.('ecosystem-visualizer')}
              className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-400 flex items-center gap-1.5 transition-all text-[11px] font-bold"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Visualizer</span>
            </button>
            <button
              onClick={() => onNavigate?.('ecosystem-glossary')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-[#00ff66] border border-emerald-500/30 hover:border-emerald-500 flex items-center gap-1.5 transition-all text-[11px] font-bold"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Glossary</span>
            </button>
          </div>

          {/* Auto Refresh Switch */}
          <div className="flex items-center gap-2 bg-[#0d1527] px-3 py-1.5 rounded-xl border border-gray-800 text-xs font-mono">
            <span className="text-gray-400 text-[11px]">Auto Refresh</span>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all flex items-center gap-1",
                autoRefresh 
                  ? "bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40" 
                  : "bg-gray-800 text-gray-400 border border-gray-700"
              )}
            >
              {autoRefresh ? <><span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" /> ON</> : 'OFF'}
            </button>
          </div>

          {/* Theme Indicator */}
          <button 
            className="p-2 rounded-xl bg-[#0d1527] border border-gray-800 text-gray-300 hover:text-[#00f0ff] hover:border-[#00f0ff]/40 transition-colors"
            title="Theme Active: Dark Cyber NOC"
          >
            <Moon className="w-4 h-4 text-[#00f0ff]" />
          </button>

          {/* Language */}
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0d1527] border border-gray-800 text-xs font-mono text-gray-300 hover:border-gray-700 transition-colors"
          >
            <Globe2 className="w-3.5 h-3.5 text-gray-400" />
            <span>Language</span>
            <ChevronDown className="w-3 h-3 text-gray-500" />
          </button>

          {/* Notifications */}
          <button 
            onClick={() => onNavigate?.('alerts')}
            className="relative p-2 rounded-xl bg-[#0d1527] border border-gray-800 text-gray-300 hover:text-white transition-colors"
            title="8 Active Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold font-mono bg-red-500 text-white shadow-[0_0_8px_rgba(239,68,68,0.7)]">
              12
            </span>
          </button>

          {/* Super Admin Profile */}
          <div className="flex items-center gap-2.5 bg-[#0d1527] pl-2.5 pr-3 py-1.5 rounded-xl border border-gray-800">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-[#00f0ff]/40 bg-[#0a1128] flex items-center justify-center font-bold text-xs text-[#00f0ff]">
              SA
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">Super Admin</span>
              <span className="text-[10px] text-gray-400 font-mono leading-tight">FTN Super Admin</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500 ml-1" />
          </div>
        </div>
      </header>

      {/* TOP 6 KPI METRICS STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Servers */}
        <div className="bg-[#0b1222]/90 p-4 rounded-xl border border-gray-800/80 hover:border-[#00f0ff]/30 transition-all shadow-md">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">TOTAL SERVERS</div>
          <div className="text-2xl font-black font-mono text-white mt-1">30</div>
          <div className="text-[11px] font-mono text-[#00ff66] flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
            Online 28
          </div>
        </div>

        {/* Total Clients */}
        <div className="bg-[#0b1222]/90 p-4 rounded-xl border border-gray-800/80 hover:border-[#00f0ff]/30 transition-all shadow-md">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">TOTAL CLIENTS</div>
          <div className="text-2xl font-black font-mono text-white mt-1">3,562</div>
          <div className="text-[11px] font-mono text-[#00ff66] flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
            Active 2,897
          </div>
        </div>

        {/* Total Traffic */}
        <div className="bg-[#0b1222]/90 p-4 rounded-xl border border-gray-800/80 hover:border-[#00f0ff]/30 transition-all shadow-md">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">TOTAL TRAFFIC</div>
          <div className="text-2xl font-black font-mono text-white mt-1">2.45 <span className="text-sm font-normal text-gray-300">Tbps</span></div>
          <div className="text-[11px] font-mono text-[#00ff66] flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3 text-[#00ff66]" />
            12.4%
          </div>
        </div>

        {/* Threats Blocked */}
        <div className="bg-[#0b1222]/90 p-4 rounded-xl border border-gray-800/80 hover:border-[#00f0ff]/30 transition-all shadow-md">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">THREATS BLOCKED</div>
          <div className="text-2xl font-black font-mono text-white mt-1">23,768</div>
          <div className="text-[11px] font-mono text-gray-400 mt-0.5">Today</div>
        </div>

        {/* System Health */}
        <div className="bg-[#0b1222]/90 p-4 rounded-xl border border-gray-800/80 hover:border-[#00f0ff]/30 transition-all shadow-md">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">SYSTEM HEALTH</div>
          <div className="text-2xl font-black font-mono text-white mt-1">98.6%</div>
          <div className="text-[11px] font-mono text-[#00ff66] mt-0.5 font-bold">Excellent</div>
        </div>

        {/* VPN Connections */}
        <div className="bg-[#0b1222]/90 p-4 rounded-xl border border-gray-800/80 hover:border-[#00f0ff]/30 transition-all shadow-md">
          <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">VPN CONNECTIONS</div>
          <div className="text-2xl font-black font-mono text-white mt-1">1,248</div>
          <div className="text-[11px] font-mono text-[#00ff66] mt-0.5">Active</div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT (70% Center Ops + 30% Right Telemetry) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT / CENTER COLUMN (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* GLOBAL NOC MAP - REAL TIME VIEW */}
          <div className="relative bg-[#070d1a] rounded-2xl border border-gray-800/90 overflow-hidden shadow-2xl">
            {/* Map Header Controls */}
            <div className="p-3.5 bg-[#091122]/90 border-b border-gray-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                  GLOBAL NOC MAP – REAL TIME VIEW
                </span>
              </div>

              {/* Map Legend */}
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-gray-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                  Core Router
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00ff66]" />
                  Edge Router
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Offline
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Data Center
                </span>
              </div>

              {/* Region & Fullscreen */}
              <div className="flex items-center gap-2">
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-[#0b1426] border border-gray-700 text-xs rounded-lg px-2.5 py-1 text-gray-200 focus:outline-none focus:border-[#00f0ff]"
                >
                  <option value="All Regions">All Regions</option>
                  <option value="North America">North America</option>
                  <option value="Europe">Europe</option>
                  <option value="Asia Pacific">Asia Pacific</option>
                  <option value="South America">South America</option>
                  <option value="Africa">Africa</option>
                </select>

                <button 
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg bg-[#0b1426] border border-gray-700 text-gray-400 hover:text-white"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Map Canvas with SVG World Overlay */}
            <div className={cn("relative w-full overflow-hidden bg-[#040814] flex items-center justify-center transition-all", isFullscreen ? "h-[560px]" : "h-[360px] sm:h-[400px]")}>
              {/* Background Cyber Grid */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, #00f0ff 1px, transparent 1px), linear-gradient(to bottom, #00f0ff 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }}
              />

              {/* Left Floating Controls (3D, 2D, +, -, Target) */}
              <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
                <button
                  onClick={() => setIs3DMode(true)}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-bold font-mono transition-all",
                    is3DMode 
                      ? "bg-[#00f0ff] text-gray-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]" 
                      : "bg-[#091122]/80 border border-gray-800 text-gray-400 hover:text-white"
                  )}
                >
                  3D
                </button>
                <button
                  onClick={() => setIs3DMode(false)}
                  className={cn(
                    "px-2.5 py-1 rounded text-xs font-bold font-mono transition-all",
                    !is3DMode 
                      ? "bg-[#00f0ff] text-gray-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]" 
                      : "bg-[#091122]/80 border border-gray-800 text-gray-400 hover:text-white"
                  )}
                >
                  2D
                </button>
                <div className="h-px bg-gray-800 my-1" />
                <button className="p-1.5 rounded bg-[#091122]/80 border border-gray-800 text-gray-400 hover:text-white">
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 rounded bg-[#091122]/80 border border-gray-800 text-gray-400 hover:text-white">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => setSelectedNode(NOC_NODES[4])}
                  className="p-1.5 rounded bg-[#091122]/80 border border-gray-800 text-gray-400 hover:text-[#00f0ff]"
                  title="Center View"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Interactive SVG World Topology */}
              <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <radialGradient id="meshCenterGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#040814" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="linkCyan" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00ff66" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Central Radial Atmosphere */}
                <circle cx="500" cy="250" r="380" fill="url(#meshCenterGlow)" />

                {/* Continents Simplified Outlines */}
                <g fill="#0b172e" stroke="#172b52" strokeWidth="1" opacity="0.85">
                  {/* North America */}
                  <path d="M150,100 Q200,80 280,110 Q320,160 270,220 Q200,260 170,200 Z" />
                  {/* South America */}
                  <path d="M280,260 Q340,290 330,380 Q290,420 270,350 Z" />
                  {/* Europe */}
                  <path d="M470,110 Q540,100 560,160 Q520,200 460,170 Z" />
                  {/* Africa */}
                  <path d="M470,200 Q560,210 560,320 Q500,380 460,280 Z" />
                  {/* Asia */}
                  <path d="M570,110 Q780,100 820,220 Q740,280 620,220 Z" />
                  {/* Australia */}
                  <path d="M800,340 Q880,330 890,410 Q810,420 790,360 Z" />
                </g>

                {/* Network Links with Glowing Arcs */}
                {NOC_LINKS.map((link, idx) => {
                  const src = NOC_NODES.find(n => n.id === link.from);
                  const dst = NOC_NODES.find(n => n.id === link.to);
                  if (!src || !dst) return null;
                  const x1 = src.x * 10;
                  const y1 = src.y * 5;
                  const x2 = dst.x * 10;
                  const y2 = dst.y * 5;
                  const mx = (x1 + x2) / 2;
                  const my = Math.min(y1, y2) - 30; // Curve arc upwards

                  return (
                    <g key={`link-${idx}`}>
                      <path
                        d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                        fill="none"
                        stroke="#00f0ff"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        opacity="0.6"
                      />
                      {/* Pulse particle along curve */}
                      <circle r="3" fill="#00ff66" filter="url(#glow)">
                        <animateMotion
                          path={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                          dur={`${3 + (idx % 3)}s`}
                          repeatCount="indefinite"
                        />
                      </circle>
                    </g>
                  );
                })}

                {/* NOC Hub Nodes */}
                {NOC_NODES.map((node) => {
                  const cx = node.x * 10;
                  const cy = node.y * 5;
                  const isCore = node.type === 'Core Router';
                  const isDC = node.type === 'Data Center';
                  const isSelected = selectedNode?.id === node.id;
                  const nodeColor = isCore ? '#00f0ff' : isDC ? '#3b82f6' : '#00ff66';

                  return (
                    <g
                      key={node.id}
                      className="cursor-pointer group"
                      onClick={() => setSelectedNode(node)}
                    >
                      {/* Outer pulse ring */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isCore ? 16 : 12}
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="1.5"
                        opacity="0.4"
                      >
                        <animate
                          attributeName="r"
                          values={isCore ? "14;24;14" : "10;18;10"}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.6;0;0.6"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Main Node Point */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={isCore ? 8 : 6}
                        fill={nodeColor}
                        stroke="#040814"
                        strokeWidth="2"
                        filter="url(#glow)"
                      />

                      {/* Node Label Card */}
                      <g transform={`translate(${cx}, ${cy - 14})`}>
                        <rect
                          x="-38"
                          y="-16"
                          width="76"
                          height="16"
                          rx="4"
                          fill="#081022"
                          stroke={isSelected ? '#00f0ff' : '#1f2d48'}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="-5"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          {node.id}
                        </text>
                      </g>
                      <text
                        x={cx}
                        y={cy + 18}
                        textAnchor="middle"
                        fill="#94a3b8"
                        fontSize="8"
                        fontFamily="sans-serif"
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Selected Node Inspector Overlay Bottom-Right */}
              {selectedNode && (
                <div className="absolute bottom-3 right-3 bg-[#081226]/95 border border-[#00f0ff]/40 p-3 rounded-xl shadow-xl backdrop-blur-md text-xs font-mono max-w-[240px]">
                  <div className="flex items-center justify-between gap-2 border-b border-gray-800 pb-1.5 mb-1.5">
                    <span className="font-bold text-[#00f0ff]">{selectedNode.id}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-[#00ff66] border border-emerald-500/30">
                      HEALTHY
                    </span>
                  </div>
                  <div className="space-y-1 text-[11px] text-gray-300">
                    <div>Region: <strong className="text-white">{selectedNode.name}</strong></div>
                    <div>Class: <strong className="text-white">{selectedNode.type}</strong></div>
                    <div>Latency: <strong className="text-[#00ff66]">{selectedNode.ping}</strong></div>
                    <div>Egress Load: <strong className="text-white">{selectedNode.traffic}</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 8-METRIC TELEMETRY RIBBON */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 bg-[#091122] p-3 rounded-xl border border-gray-800/80 text-center font-mono">
            <div className="p-1">
              <div className="text-[9px] uppercase text-gray-400 font-sans">LATENCY (AVG)</div>
              <div className="text-sm font-bold text-white mt-0.5">24.2 ms</div>
            </div>
            <div className="p-1 border-l border-gray-800">
              <div className="text-[9px] uppercase text-gray-400 font-sans">PACKET LOSS</div>
              <div className="text-sm font-bold text-white mt-0.5">0.18%</div>
            </div>
            <div className="p-1 border-l border-gray-800">
              <div className="text-[9px] uppercase text-gray-400 font-sans">BANDWIDTH (IN)</div>
              <div className="text-sm font-bold text-white mt-0.5">1.32 Tbps</div>
            </div>
            <div className="p-1 border-l border-gray-800">
              <div className="text-[9px] uppercase text-gray-400 font-sans">BANDWIDTH (OUT)</div>
              <div className="text-sm font-bold text-white mt-0.5">1.13 Tbps</div>
            </div>
            <div className="p-1 border-l border-gray-800">
              <div className="text-[9px] uppercase text-gray-400 font-sans">CPU USAGE (AVG)</div>
              <div className="text-sm font-bold text-white mt-0.5">32%</div>
            </div>
            <div className="p-1 border-l border-gray-800">
              <div className="text-[9px] uppercase text-gray-400 font-sans">MEMORY USAGE</div>
              <div className="text-sm font-bold text-white mt-0.5">48%</div>
            </div>
            <div className="p-1 border-l border-gray-800">
              <div className="text-[9px] uppercase text-gray-400 font-sans">STORAGE USED</div>
              <div className="text-sm font-bold text-white mt-0.5">1.25 PB / 3 PB</div>
            </div>
            <div className="p-1 border-l border-gray-800">
              <div className="text-[9px] uppercase text-red-400 font-sans font-bold">ACTIVE ALERTS</div>
              <div className="text-sm font-bold text-red-400 mt-0.5">8</div>
            </div>
          </div>

          {/* CENTER BOTTOM 3-CARD SPLIT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. TRAFFIC ANALYTICS (24H) */}
            <div className="bg-[#091122] p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase text-white tracking-wide">
                    TRAFFIC ANALYTICS (24H)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono text-gray-400 mb-2">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00f0ff]" /> Inbound
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#00ff66]" /> Outbound
                  </span>
                </div>
              </div>

              <div className="h-36 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={TRAFFIC_ANALYTICS_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00ff66" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#00ff66" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="2 2" stroke="#172238" vertical={false} />
                    <XAxis dataKey="time" stroke="#4b5563" fontSize={9} tickLine={false} />
                    <YAxis stroke="#4b5563" fontSize={9} tickLine={false} domain={[0, 2.5]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#091122', borderColor: '#1e293b', fontSize: '10px', borderRadius: '8px' }}
                    />
                    <Area type="monotone" dataKey="inbound" stroke="#00f0ff" strokeWidth={1.5} fill="url(#colorIn)" />
                    <Area type="monotone" dataKey="outbound" stroke="#00ff66" strokeWidth={1.5} fill="url(#colorOut)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="text-[10px] font-mono text-gray-500 text-right mt-1">
                Peak: 2.25 Tbps @ 18:00
              </div>
            </div>

            {/* 2. TOP APPLICATIONS */}
            <div className="bg-[#091122] p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase text-white tracking-wide block mb-3">
                  TOP APPLICATIONS
                </span>
                <div className="space-y-2.5">
                  {TOP_APPLICATIONS.map(app => (
                    <div key={app.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-gray-300">{app.name}</span>
                        <span className="text-white font-bold">{app.traffic}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-gray-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ width: `${app.percent}%`, backgroundColor: app.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[10px] font-mono text-gray-500 text-right mt-2">
                Deep Packet Inspection: Active
              </div>
            </div>

            {/* 3. THREAT INTELLIGENCE */}
            <div className="bg-[#091122] p-4 rounded-xl border border-gray-800 flex flex-col justify-between">
              <span className="text-xs font-bold uppercase text-white tracking-wide mb-2 block">
                THREAT INTELLIGENCE
              </span>

              <div className="flex items-center justify-between gap-2">
                {/* Radial Donut Gauge */}
                <div className="relative w-28 h-28 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={THREAT_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={36}
                        outerRadius={50}
                        paddingAngle={3}
                        dataKey="count"
                      >
                        {THREAT_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-xs font-bold font-mono text-white leading-tight">23,768</span>
                    <span className="text-[8px] text-gray-400 font-mono">Blocked Today</span>
                  </div>
                </div>

                {/* Legend List */}
                <div className="space-y-1.5 text-xs font-mono flex-1">
                  {THREAT_DATA.map(t => (
                    <div key={t.name} className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-300">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                        {t.name}
                      </span>
                      <span className="text-white font-bold">{t.count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] font-mono text-[#00ff66] text-right mt-1">
                eBPF XDP Mitigation: 99.8% Clean
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT TELEMETRY & OPERATIONS COLUMN (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* 1. AUTO DISPLAY ADJUST */}
          <div className="bg-[#091122] p-4 rounded-xl border border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">AUTO DISPLAY ADJUST</h3>
                <p className="text-[10px] text-gray-400 font-mono">Responsive • Adaptive • Optimized</p>
              </div>
            </div>

            <div className="grid grid-cols-6 gap-2 my-3 text-center">
              {[
                { id: 'ultrawide', icon: Monitor, label: 'Ultrawide' },
                { id: 'desktop', icon: Monitor, label: 'Desktop' },
                { id: 'laptop', icon: Laptop, label: 'Laptop' },
                { id: 'tablet', icon: Tablet, label: 'Tablet' },
                { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                { id: 'tv', icon: Tv, label: 'TV' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = activeDeviceView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveDeviceView(item.id as any)}
                    className={cn(
                      "p-2 rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer",
                      isSelected
                        ? "bg-[#00f0ff]/15 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                        : "bg-[#0b1426] border-gray-800 text-gray-400 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#00ff66]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Best View for Your Screen ({activeDeviceView.toUpperCase()})</span>
            </div>
          </div>

          {/* 2. FTN CORE ROUTER HEALTH TABLE */}
          <div className="bg-[#091122] p-4 rounded-xl border border-gray-800">
            <span className="text-xs font-bold uppercase tracking-wider text-white block mb-2">
              FTN CORE ROUTER HEALTH
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] font-mono text-left">
                <thead className="text-[10px] uppercase text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="pb-1.5">Router</th>
                    <th className="pb-1.5">Status</th>
                    <th className="pb-1.5">CPU</th>
                    <th className="pb-1.5">RAM</th>
                    <th className="pb-1.5">Traffic</th>
                    <th className="pb-1.5 text-right">Latency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  {ROUTER_HEALTH_DATA.map((router) => (
                    <tr key={router.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="py-1.5 text-white font-bold">{router.id}</td>
                      <td className="py-1.5">
                        <span className={router.isWarning ? "text-amber-400" : "text-[#00ff66]"}>
                          {router.status}
                        </span>
                      </td>
                      <td className="py-1.5 text-gray-300">{router.cpu}</td>
                      <td className="py-1.5 text-gray-300">{router.ram}</td>
                      <td className="py-1.5 text-gray-300">{router.traffic}</td>
                      <td className="py-1.5 text-right font-bold text-[#00f0ff]">{router.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. SMART FIRMWARE SYSTEM */}
          <div className="bg-[#091122] p-4 rounded-xl border border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                SMART FIRMWARE SYSTEM
              </span>
              <span className="text-[10px] font-mono text-[#00ff66] flex items-center gap-1">
                Status: <strong>Optimal</strong>
              </span>
            </div>

            {/* Stepper Pipeline */}
            <div className="flex items-center justify-between gap-1 py-1">
              {FIRMWARE_STEPS.map((step, idx) => (
                <React.Fragment key={step.title}>
                  <div className="flex flex-col items-center text-center">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border",
                      step.completed ? "bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66]" :
                      step.active ? "bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] animate-pulse" :
                      "bg-gray-800 border-gray-700 text-gray-400"
                    )}>
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    <span className="text-[8px] text-gray-400 font-mono mt-1 max-w-[42px] leading-tight truncate">
                      {step.title}
                    </span>
                  </div>
                  {idx < FIRMWARE_STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 bg-gray-800 -mt-3" />
                  )}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-gray-800 text-[11px] font-mono">
              <span className="text-gray-400">Last Build: <strong>v2.6.0-2026.05.20</strong></span>
              <button
                onClick={handleBuildFirmware}
                disabled={isBuildingFirmware}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-[#00f0ff] hover:bg-[#00c8d6] text-gray-950 transition-colors cursor-pointer flex items-center gap-1 shadow-md disabled:opacity-50"
              >
                <Zap className={cn("w-3 h-3", isBuildingFirmware && "animate-spin")} />
                {isBuildingFirmware ? 'Compiling...' : 'Build Now'}
              </button>
            </div>
          </div>

          {/* 4. DNS PLATFORM – GLOBAL MESH */}
          <div className="bg-[#091122] p-4 rounded-xl border border-gray-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                DNS PLATFORM – GLOBAL MESH
              </span>
              <button 
                onClick={() => onNavigate?.('dns-arch')}
                className="text-[10px] font-mono text-[#00f0ff] hover:underline"
              >
                Inspect Mesh &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {DNS_ENGINES.map((dns) => (
                <div key={dns.name} className="p-2 rounded-lg bg-[#0b1426] border border-gray-800/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-[11px]">{dns.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1 line-clamp-1">{dns.desc}</span>
                  <span className="text-[9px] text-[#00ff66] font-semibold mt-0.5">{dns.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5. GLOBAL SERVICES */}
          <div className="bg-[#091122] p-4 rounded-xl border border-gray-800">
            <span className="text-xs font-bold uppercase tracking-wider text-white block mb-2">
              GLOBAL SERVICES
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2 rounded-lg bg-[#0b1426] border border-gray-800">
                <span className="font-bold text-orange-400 block text-[11px]">Cloudflare</span>
                <span className="text-[10px] text-[#00ff66]">Online</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0b1426] border border-gray-800">
                <span className="font-bold text-red-500 block text-[11px]">Netflix</span>
                <span className="text-[10px] text-[#00ff66]">Online</span>
              </div>
              <div className="p-2 rounded-lg bg-[#0b1426] border border-gray-800">
                <span className="font-bold text-rose-400 block text-[11px]">Fastly</span>
                <span className="text-[10px] text-[#00ff66]">Online</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM SECTION: AUTO DISPLAY ADJUST - PERFECT ON EVERY DEVICE */}
      <div className="bg-[#080e1e] p-5 rounded-2xl border border-gray-800 space-y-4">
        <div className="text-center space-y-1">
          <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-purple-500/10 via-[#00f0ff]/10 to-purple-500/10 border border-purple-500/30 text-xs font-bold font-mono text-purple-300">
            AUTO DISPLAY ADJUST – PERFECT ON EVERY DEVICE
          </div>
        </div>

        {/* 6 Responsive Device Mockup Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { title: 'ULTRA WIDE DESKTOP', res: '3440x1440', type: 'ultrawide', icon: Monitor },
            { title: 'DESKTOP', res: '1920x1080', type: 'desktop', icon: Monitor },
            { title: 'LAPTOP', res: '1366x768', type: 'laptop', icon: Laptop },
            { title: 'TABLET', res: '1024x768', type: 'tablet', icon: Tablet },
            { title: 'MOBILE', res: '375x812', type: 'mobile', icon: Smartphone },
            { title: 'ANDROID TV', res: '1920x1080', type: 'tv', icon: Tv, extra: 'FTNVPN' },
          ].map((device) => {
            const isCur = activeDeviceView === device.type;
            const Icon = device.icon;
            return (
              <div
                key={device.title}
                onClick={() => setActiveDeviceView(device.type as any)}
                className={cn(
                  "p-3 rounded-xl border flex flex-col justify-between transition-all cursor-pointer",
                  isCur 
                    ? "bg-[#0e1830] border-[#00f0ff]/60 shadow-[0_0_15px_rgba(0,240,255,0.2)]" 
                    : "bg-[#091122]/70 border-gray-800 hover:border-gray-700"
                )}
              >
                {/* Mini mockup screen frame */}
                <div className="h-16 rounded-lg bg-[#040814] border border-gray-800/80 p-1.5 flex flex-col justify-between overflow-hidden relative">
                  <div className="flex items-center justify-between">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
                    <span className="text-[8px] font-mono text-gray-500">{device.extra || 'NOC'}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-[#00f0ff]/30 rounded-full" />
                    <div className="h-1 w-3/4 bg-[#00ff66]/30 rounded-full" />
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <div className="text-[10px] font-bold font-sans text-white truncate">{device.title}</div>
                  <div className="text-[9px] font-mono text-gray-400">{device.res}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Pills Strip & Brand Slogan */}
        <div className="pt-2 border-t border-gray-800/80 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-[10px] font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-[#00f0ff]" />
              UNIFIED CONTROL: One Panel, All Control
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 flex items-center gap-1.5">
              <Bot className="w-3 h-3 text-purple-400" />
              AI POWERED: Intelligent Network Ops
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-[#00ff66]" />
              AUTO HEALING: Self Healing Infrastructure
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-amber-400" />
              SECURE BY DESIGN: Military Grade Security
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 flex items-center gap-1.5">
              <Server className="w-3 h-3 text-blue-400" />
              SCALABLE: 20-30+ Servers as One
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 flex items-center gap-1.5">
              <Globe className="w-3 h-3 text-cyan-400" />
              GLOBAL BACKBONE: Anycast DNS &amp; Multi CDN
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              APPROVAL FIRST: Safe &amp; Controlled Actions
            </span>
          </div>

          <div className="flex items-center gap-2 font-display text-xs tracking-wider text-[#00ff66] font-bold flex-shrink-0">
            <div className="w-5 h-5 rounded overflow-hidden border border-[#00ff66]/40 flex items-center justify-center bg-gray-950">
              <img src="/ftn-logo.png" alt="FTN" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <span>FTN – ONE NETWORK, LIMITLESS POSSIBILITIES</span>
          </div>
        </div>
      </div>
    </div>
  );
}
