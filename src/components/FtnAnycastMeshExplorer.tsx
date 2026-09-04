import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  Globe,
  Radio,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Zap,
  Play,
  Pause,
  Layers,
  ArrowRight,
  Shield,
  Server,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { cn } from '../utils';

export interface AnycastNode {
  id: string;
  name: string;
  city: string;
  country: string;
  flag: string;
  lat: number;
  lng: number;
  ip: string;
  ipv6: string;
  engine: string;
  qps: number;
  latencyAvg: number;
  status: 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
  bgpPeers: number;
  cacheHitRatio: number;
}

export interface ClientRegion {
  id: string;
  region: string;
  city: string;
  flag: string;
  lat: number;
  lng: number;
  routedNodeId: string;
  latencyMs: number;
  dnssecValid: boolean;
  status: 'OPTIMAL' | 'DEGRADED';
}

const ANYCAST_NODES: AnycastNode[] = [
  {
    id: 'ftn-dns-dac-01',
    name: 'FTN-DNS-DAC-01',
    city: 'Dhaka',
    country: 'Bangladesh',
    flag: '🇧🇩',
    lat: 23.8103,
    lng: 90.4125,
    ip: '103.186.240.53',
    ipv6: '2400:8902::53',
    engine: 'PowerDNS 4.8 + dnsdist',
    qps: 142500,
    latencyAvg: 3.8,
    status: 'HEALTHY',
    bgpPeers: 12,
    cacheHitRatio: 94.2
  },
  {
    id: 'ftn-dns-fra-01',
    name: 'FTN-DNS-FRA-01',
    city: 'Frankfurt',
    country: 'Germany',
    flag: '🇩🇪',
    lat: 50.1109,
    lng: 8.6821,
    ip: '103.186.240.53',
    ipv6: '2400:8902::53',
    engine: 'Knot DNS 3.3 + eBPF',
    qps: 218900,
    latencyAvg: 7.2,
    status: 'HEALTHY',
    bgpPeers: 28,
    cacheHitRatio: 96.5
  },
  {
    id: 'ftn-dns-lon-01',
    name: 'FTN-DNS-LON-01',
    city: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    lat: 51.5074,
    lng: -0.1278,
    ip: '103.186.240.53',
    ipv6: '2400:8902::53',
    engine: 'PowerDNS 4.8 + dnsdist',
    qps: 185400,
    latencyAvg: 9.5,
    status: 'HEALTHY',
    bgpPeers: 22,
    cacheHitRatio: 95.8
  },
  {
    id: 'ftn-dns-nyc-01',
    name: 'FTN-DNS-NYC-01',
    city: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    lat: 40.7128,
    lng: -74.0060,
    ip: '103.186.240.53',
    ipv6: '2400:8902::53',
    engine: 'Knot DNS 3.3 + eBPF',
    qps: 245000,
    latencyAvg: 11.4,
    status: 'HEALTHY',
    bgpPeers: 34,
    cacheHitRatio: 97.1
  },
  {
    id: 'ftn-dns-sgp-01',
    name: 'FTN-DNS-SGP-01',
    city: 'Singapore',
    country: 'Singapore',
    flag: '🇸🇬',
    lat: 1.3521,
    lng: 103.8198,
    ip: '103.186.240.53',
    ipv6: '2400:8902::53',
    engine: 'PowerDNS 4.8 + dnsdist',
    qps: 198200,
    latencyAvg: 6.9,
    status: 'HEALTHY',
    bgpPeers: 19,
    cacheHitRatio: 95.1
  },
  {
    id: 'ftn-dns-tyo-01',
    name: 'FTN-DNS-TYO-01',
    city: 'Tokyo',
    country: 'Japan',
    flag: '🇯🇵',
    lat: 35.6762,
    lng: 139.6503,
    ip: '103.186.240.53',
    ipv6: '2400:8902::53',
    engine: 'Knot DNS 3.3',
    qps: 164000,
    latencyAvg: 14.8,
    status: 'HEALTHY',
    bgpPeers: 16,
    cacheHitRatio: 93.9
  },
  {
    id: 'ftn-dns-sao-01',
    name: 'FTN-DNS-SAO-01',
    city: 'São Paulo',
    country: 'Brazil',
    flag: '🇧🇷',
    lat: -23.5505,
    lng: -46.6333,
    ip: '103.186.240.53',
    ipv6: '2400:8902::53',
    engine: 'CoreDNS + eBPF',
    qps: 89000,
    latencyAvg: 26.5,
    status: 'DEGRADED',
    bgpPeers: 8,
    cacheHitRatio: 89.2
  },
  {
    id: 'ftn-dns-syd-01',
    name: 'FTN-DNS-SYD-01',
    city: 'Sydney',
    country: 'Australia',
    flag: '🇦🇺',
    lat: -33.8688,
    lng: 151.2093,
    ip: '103.186.240.53',
    ipv6: '2400:8902::53',
    engine: 'PowerDNS 4.8',
    qps: 112000,
    latencyAvg: 19.4,
    status: 'HEALTHY',
    bgpPeers: 14,
    cacheHitRatio: 94.0
  }
];

const CLIENT_REGIONS: ClientRegion[] = [
  { id: 'cli-lhr', region: 'Europe West', city: 'London', flag: '🇬🇧', lat: 51.5, lng: -0.12, routedNodeId: 'ftn-dns-lon-01', latencyMs: 9.5, dnssecValid: true, status: 'OPTIMAL' },
  { id: 'cli-fra', region: 'Europe Central', city: 'Frankfurt', flag: '🇩🇪', lat: 50.1, lng: 8.68, routedNodeId: 'ftn-dns-fra-01', latencyMs: 7.2, dnssecValid: true, status: 'OPTIMAL' },
  { id: 'cli-nyc', region: 'US East', city: 'New York', flag: '🇺🇸', lat: 40.7, lng: -74.0, routedNodeId: 'ftn-dns-nyc-01', latencyMs: 11.4, dnssecValid: true, status: 'OPTIMAL' },
  { id: 'cli-sgp', region: 'Asia SE', city: 'Singapore', flag: '🇸🇬', lat: 1.35, lng: 103.8, routedNodeId: 'ftn-dns-sgp-01', latencyMs: 6.9, dnssecValid: true, status: 'OPTIMAL' },
  { id: 'cli-dac', region: 'South Asia', city: 'Dhaka', flag: '🇧🇩', lat: 23.8, lng: 90.4, routedNodeId: 'ftn-dns-dac-01', latencyMs: 3.8, dnssecValid: true, status: 'OPTIMAL' },
  { id: 'cli-tyo', region: 'East Asia', city: 'Tokyo', flag: '🇯🇵', lat: 35.6, lng: 139.6, routedNodeId: 'ftn-dns-tyo-01', latencyMs: 14.8, dnssecValid: true, status: 'OPTIMAL' },
  { id: 'cli-sao', region: 'South America', city: 'São Paulo', flag: '🇧🇷', lat: -23.5, lng: -46.6, routedNodeId: 'ftn-dns-sao-01', latencyMs: 26.5, dnssecValid: true, status: 'DEGRADED' },
  { id: 'cli-syd', region: 'Oceania', city: 'Sydney', flag: '🇦🇺', lat: -33.8, lng: 151.2, routedNodeId: 'ftn-dns-syd-01', latencyMs: 19.4, dnssecValid: true, status: 'OPTIMAL' }
];

export function FtnAnycastMeshExplorer({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [nodes, setNodes] = useState<AnycastNode[]>(ANYCAST_NODES);
  const [regions, setRegions] = useState<ClientRegion[]>(CLIENT_REGIONS);
  const [selectedNode, setSelectedNode] = useState<AnycastNode | null>(ANYCAST_NODES[0]);
  const [isRotating, setIsRotating] = useState(true);
  const [isTestingLatency, setIsTestingLatency] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef<[number, number]>([-40, -15]); // yaw, pitch
  const isDraggingRef = useRef(false);
  const lastMousePos = useRef<[number, number]>([0, 0]);

  // Total grid QPS
  const totalQps = nodes.reduce((acc, n) => acc + n.qps, 0);

  // D3 Globe Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const width = canvas.width;
    const height = canvas.height;
    const radius = Math.min(width, height) / 2 - 25;

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([width / 2, height / 2])
      .clipAngle(90);

    const path = d3.geoPath(projection, ctx);
    const graticule = d3.geoGraticule10();

    const render = () => {
      if (isRotating && !isDraggingRef.current) {
        rotationRef.current[0] += 0.35; // rotate yaw
      }

      projection.rotate(rotationRef.current);
      ctx.clearRect(0, 0, width, height);

      // 1. Globe Background / Atmospheric Glow
      const grad = ctx.createRadialGradient(
        width / 2 - 30,
        height / 2 - 30,
        radius * 0.2,
        width / 2,
        height / 2,
        radius
      );
      grad.addColorStop(0, '#0f224a');
      grad.addColorStop(0.85, '#081024');
      grad.addColorStop(1, '#020612');

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, 2 * Math.PI);
      ctx.fillStyle = grad;
      ctx.fill();

      // Atmospheric Outer Ring
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius + 2, 0, 2 * Math.PI);
      ctx.strokeStyle = '#00f0ff44';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // 2. Graticule Lat/Lng Grid Lines
      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // 3. Equator and Prime Meridian Accent
      ctx.beginPath();
      path({ type: 'Sphere' });
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 4. Anycast Route Arcs (Great-Circle Arcs)
      regions.forEach(reg => {
        const destNode = nodes.find(n => n.id === reg.routedNodeId);
        if (destNode) {
          const geoLine = {
            type: 'LineString',
            coordinates: [
              [reg.lng, reg.lat],
              [destNode.lng, destNode.lat]
            ]
          };

          ctx.beginPath();
          // @ts-ignore
          path(geoLine);
          ctx.strokeStyle = reg.status === 'DEGRADED' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(0, 255, 102, 0.45)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      // 5. Anycast DNS Nodes (Pulsing Targets)
      nodes.forEach(node => {
        const coords = projection([node.lng, node.lat]);
        if (coords) {
          const isSelected = selectedNode?.id === node.id;
          const [cx, cy] = coords;

          // Pulse ring
          ctx.beginPath();
          ctx.arc(cx, cy, isSelected ? 12 : 8, 0, 2 * Math.PI);
          ctx.strokeStyle =
            node.status === 'HEALTHY'
              ? 'rgba(0, 255, 102, 0.6)'
              : 'rgba(245, 158, 11, 0.6)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Solid core
          ctx.beginPath();
          ctx.arc(cx, cy, isSelected ? 6 : 4, 0, 2 * Math.PI);
          ctx.fillStyle = isSelected
            ? '#00f0ff'
            : node.status === 'HEALTHY'
            ? '#00ff66'
            : '#f59e0b';
          ctx.fill();

          // Label
          ctx.font = '10px monospace';
          ctx.fillStyle = '#e2e8f0';
          ctx.fillText(node.city, cx + 8, cy - 4);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [nodes, regions, selectedNode, isRotating]);

  // Pointer drag controls for rotation
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    lastMousePos.current = [e.clientX, e.clientY];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastMousePos.current[0];
    const dy = e.clientY - lastMousePos.current[1];
    lastMousePos.current = [e.clientX, e.clientY];

    rotationRef.current[0] += dx * 0.5;
    rotationRef.current[1] = Math.max(-80, Math.min(80, rotationRef.current[1] - dy * 0.5));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Run Global Latency Ping Test
  const handleRunGlobalPing = () => {
    setIsTestingLatency(true);
    window.dispatchEvent(
      new CustomEvent('add-toast', {
        detail: {
          type: 'info',
          title: 'Testing Anycast Latency Across 8 Regions',
          message: 'Dispatching DNS query probes to 103.186.240.53 Anycast IP...'
        }
      })
    );

    setTimeout(() => {
      setRegions(prev =>
        prev.map(r => ({
          ...r,
          latencyMs: +(r.latencyMs * (0.85 + Math.random() * 0.25)).toFixed(1),
          status: 'OPTIMAL'
        }))
      );
      setIsTestingLatency(false);

      window.dispatchEvent(
        new CustomEvent('add-toast', {
          detail: {
            type: 'success',
            title: 'Global Latency Probe Complete',
            message: 'Average Anycast response time: 11.2ms with 100% DNSSEC validation.'
          }
        })
      );
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#091122] via-[#0b1730] to-[#080e1c] border border-gray-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-[#00ff66] flex items-center justify-center text-gray-950 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                <Globe className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight flex items-center gap-3">
                  FTN ANYCAST DNS MESH EXPLORER
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00f0ff]/20 text-[#00f0ff] font-mono border border-[#00f0ff]/40">
                    BGP Anycast AS64512
                  </span>
                </h1>
                <p className="text-gray-300 font-mono text-xs lg:text-sm">
                  Interactive 3D D3 globe visualization tracking global Anycast DNS nodes, sub-millisecond edge routing, and real-time DNSSEC health.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex flex-wrap items-center gap-4 bg-gray-950/80 border border-gray-800 rounded-2xl p-4">
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Global Anycast IP</span>
              <span className="text-sm font-black text-[#00f0ff] font-mono">103.186.240.53</span>
            </div>
            <div className="h-10 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Total Throughput</span>
              <span className="text-lg font-black text-[#00ff66] font-mono">{(totalQps / 1000).toFixed(0)}k QPS</span>
            </div>
            <div className="h-10 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block uppercase">Global Median</span>
              <span className="text-lg font-black text-white font-mono">9.8 ms</span>
            </div>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="mt-6 pt-6 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsRotating(!isRotating)}
              className="px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition-all"
            >
              {isRotating ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-[#00ff66]" />}
              <span>{isRotating ? 'Pause Globe Rotation' : 'Auto-Rotate Globe'}</span>
            </button>

            <span className="text-xs text-gray-500 font-mono hidden md:inline">
              Tip: Drag with mouse/touch to rotate globe
            </span>
          </div>

          <button
            onClick={handleRunGlobalPing}
            disabled={isTestingLatency}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00ff66] text-gray-950 font-mono font-black text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", isTestingLatency && "animate-spin")} />
            <span>{isTestingLatency ? 'Pinging All Anycast POPs...' : 'Run Global Latency Audit'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: D3 Globe + Latency & POP Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Globe Container (7 cols) */}
        <div className="lg:col-span-7 bg-[#080e1c] border border-gray-800 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[460px]">
          <div className="w-full flex items-center justify-between text-xs font-mono text-gray-400 mb-2">
            <span className="flex items-center gap-2 text-white font-bold">
              <Globe className="w-4 h-4 text-[#00f0ff]" />
              INTERACTIVE 3D D3 ANYCAST GLOBE
            </span>
            <span className="text-[#00ff66] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
              {nodes.length} Active POPs Online
            </span>
          </div>

          {/* D3 Canvas Element */}
          <canvas
            ref={canvasRef}
            width={480}
            height={440}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="cursor-grab active:cursor-grabbing max-w-full touch-none select-none rounded-2xl"
          />

          <div className="w-full flex flex-wrap items-center justify-center gap-6 mt-3 text-[11px] font-mono text-gray-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66]" />
              <span>Healthy Anycast POP</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Degraded Transit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#00ff66]/60 border-t border-dashed border-[#00ff66]" />
              <span>Client Anycast Ingress Route</span>
            </div>
          </div>
        </div>

        {/* Selected POP Detail & Global Region Latency Matrix (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Selected POP Inspector Card */}
          {selectedNode && (
            <div className="bg-[#080e1c] border border-gray-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedNode.flag}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">{selectedNode.name}</h3>
                    <span className="text-xs text-gray-400 font-mono">{selectedNode.city}, {selectedNode.country}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-[#00ff66] text-[10px] font-mono font-bold border border-emerald-500/40">
                  {selectedNode.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-black/60 p-2.5 rounded-xl border border-gray-800/80">
                  <span className="text-gray-500 block text-[10px]">DNS Engine</span>
                  <span className="text-white font-bold">{selectedNode.engine}</span>
                </div>
                <div className="bg-black/60 p-2.5 rounded-xl border border-gray-800/80">
                  <span className="text-gray-500 block text-[10px]">Throughput</span>
                  <span className="text-[#00f0ff] font-bold">{(selectedNode.qps / 1000).toFixed(0)}k QPS</span>
                </div>
                <div className="bg-black/60 p-2.5 rounded-xl border border-gray-800/80">
                  <span className="text-gray-500 block text-[10px]">Average Latency</span>
                  <span className="text-[#00ff66] font-bold">{selectedNode.latencyAvg} ms</span>
                </div>
                <div className="bg-black/60 p-2.5 rounded-xl border border-gray-800/80">
                  <span className="text-gray-500 block text-[10px]">Cache Hit Rate</span>
                  <span className="text-purple-400 font-bold">{selectedNode.cacheHitRatio}%</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-gray-400 bg-gray-950/80 p-2 rounded-xl border border-gray-800 flex justify-between">
                <span>Anycast IPv4: <strong className="text-white">{selectedNode.ip}</strong></span>
                <span>BGP Peers: <strong className="text-cyan-400">{selectedNode.bgpPeers}</strong></span>
              </div>
            </div>
          )}

          {/* Global Client Region Latency Matrix */}
          <div className="bg-[#080e1c] border border-gray-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-800">
              <h3 className="text-xs font-bold text-white font-display flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#00ff66]" />
                GLOBAL REGION VANTAGE LATENCIES
              </h3>
              <span className="text-[10px] text-gray-500 font-mono">Anycast Routed</span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
              {regions.map(region => (
                <div
                  key={region.id}
                  onClick={() => {
                    const node = nodes.find(n => n.id === region.routedNodeId);
                    if (node) setSelectedNode(node);
                  }}
                  className="p-2.5 rounded-xl bg-gray-950/80 hover:bg-gray-900 border border-gray-800/80 flex items-center justify-between text-xs font-mono cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2">
                    <span>{region.flag}</span>
                    <span className="text-white font-bold">{region.city}</span>
                    <span className="text-gray-500 text-[10px]">({region.region})</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-[10px]">&rarr; {region.routedNodeId.split('-')[2]?.toUpperCase()}</span>
                    <span className={cn("font-bold", region.latencyMs < 15 ? "text-[#00ff66]" : "text-amber-400")}>
                      {region.latencyMs} ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid Node Table */}
      <div className="bg-[#080e1c] border border-gray-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
          <Server className="w-4 h-4 text-[#00f0ff]" />
          ANYCAST DNS GRID NODE FLEET ({nodes.length} POPs)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {nodes.map(node => (
            <div
              key={node.id}
              onClick={() => setSelectedNode(node)}
              className={cn(
                "p-4 rounded-2xl border transition-all cursor-pointer",
                selectedNode?.id === node.id
                  ? "bg-[#00f0ff]/10 border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                  : "bg-[#091122] border-gray-800 hover:border-gray-700"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{node.flag}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-[#00ff66] font-bold">
                  {node.status}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white font-display">{node.name}</h4>
              <p className="text-xs text-gray-400 font-mono mb-3">{node.city}, {node.country}</p>

              <div className="space-y-1 text-xs font-mono text-gray-400 border-t border-gray-800/80 pt-2">
                <div className="flex justify-between">
                  <span>QPS:</span>
                  <span className="text-[#00f0ff]">{(node.qps / 1000).toFixed(0)}k</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Latency:</span>
                  <span className="text-[#00ff66]">{node.latencyAvg} ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Peers:</span>
                  <span className="text-white">{node.bgpPeers} BGP</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
