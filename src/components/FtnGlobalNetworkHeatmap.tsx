import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Activity,
  Layers,
  Flame,
  Network,
  Cpu,
  Server,
  HardDrive,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Radio,
  Sliders,
  X
} from 'lucide-react';

export interface GlobalHeatNode {
  id: string;
  name: string;
  region: string;
  location: string;
  x: number;
  y: number;
  cpuPct: number;
  ramPct: number;
  bandwidthGbps: number;
  bandwidthLimitGbps: number;
  thermalC: number;
  trafficSpikePct: number;
  rxPps: number;
  txPps: number;
  stressScore: number; // 0 to 100
  densityWeight: number; // number of micro-services/pods hosted
  status: 'OPTIMAL' | 'ELEVATED' | 'CRITICAL';
}

const GLOBAL_NODES: GlobalHeatNode[] = [
  {
    id: 'node-01',
    name: 'FTN-DHAKA-CORE-01',
    region: 'South Asia Core',
    location: 'Motijheel Core DC, Dhaka',
    x: 420,
    y: 260,
    cpuPct: 76.5,
    ramPct: 74.2,
    bandwidthGbps: 14.8,
    bandwidthLimitGbps: 40.0,
    thermalC: 56.8,
    trafficSpikePct: +14.2,
    rxPps: 842000,
    txPps: 690000,
    stressScore: 75,
    densityWeight: 24,
    status: 'ELEVATED'
  },
  {
    id: 'node-02',
    name: 'FTN-BANANI-EDGE-02',
    region: 'South Asia Edge',
    location: 'Banani POP, Dhaka',
    x: 435,
    y: 245,
    cpuPct: 88.4,
    ramPct: 89.1,
    bandwidthGbps: 17.5,
    bandwidthLimitGbps: 20.0,
    thermalC: 62.4,
    trafficSpikePct: +340.5,
    rxPps: 1420000,
    txPps: 1250000,
    stressScore: 92,
    densityWeight: 18,
    status: 'CRITICAL'
  },
  {
    id: 'node-03',
    name: 'FTN-CTG-HUB-03',
    region: 'South Asia Coastal',
    location: 'Agrabad DC, Chittagong',
    x: 455,
    y: 280,
    cpuPct: 22.0,
    ramPct: 34.2,
    bandwidthGbps: 4.8,
    bandwidthLimitGbps: 20.0,
    thermalC: 44.5,
    trafficSpikePct: -4.1,
    rxPps: 210000,
    txPps: 180000,
    stressScore: 24,
    densityWeight: 12,
    status: 'OPTIMAL'
  },
  {
    id: 'node-04',
    name: 'FTN-SGP-TRANSIT-04',
    region: 'Southeast Asia Transit',
    location: 'Equinix SG1, Singapore',
    x: 520,
    y: 330,
    cpuPct: 32.7,
    ramPct: 44.1,
    bandwidthGbps: 11.6,
    bandwidthLimitGbps: 40.0,
    thermalC: 45.1,
    trafficSpikePct: +8.2,
    rxPps: 780000,
    txPps: 640000,
    stressScore: 38,
    densityWeight: 16,
    status: 'OPTIMAL'
  },
  {
    id: 'node-05',
    name: 'FTN-FRA-BACKUP-05',
    region: 'Europe Central Vault',
    location: 'Interxion FRA1, Frankfurt',
    x: 270,
    y: 190,
    cpuPct: 36.8,
    ramPct: 46.2,
    bandwidthGbps: 9.8,
    bandwidthLimitGbps: 40.0,
    thermalC: 42.1,
    trafficSpikePct: +2.4,
    rxPps: 420000,
    txPps: 390000,
    stressScore: 41,
    densityWeight: 14,
    status: 'OPTIMAL'
  },
  {
    id: 'node-06',
    name: 'FTN-TYO-EDGE-06',
    region: 'East Asia Edge',
    location: 'Equinix TY2, Tokyo',
    x: 640,
    y: 220,
    cpuPct: 41.5,
    ramPct: 52.0,
    bandwidthGbps: 8.4,
    bandwidthLimitGbps: 20.0,
    thermalC: 46.8,
    trafficSpikePct: +12.0,
    rxPps: 510000,
    txPps: 480000,
    stressScore: 46,
    densityWeight: 15,
    status: 'OPTIMAL'
  },
  {
    id: 'node-07',
    name: 'FTN-LON-GW-07',
    region: 'Western Europe Gateway',
    location: 'Telehouse North, London',
    x: 240,
    y: 180,
    cpuPct: 48.2,
    ramPct: 58.4,
    bandwidthGbps: 12.1,
    bandwidthLimitGbps: 40.0,
    thermalC: 48.0,
    trafficSpikePct: +18.4,
    rxPps: 620000,
    txPps: 580000,
    stressScore: 52,
    densityWeight: 16,
    status: 'ELEVATED'
  },
  {
    id: 'node-08',
    name: 'FTN-IAD-CORE-08',
    region: 'North America East',
    location: 'Equinix DC2, Ashburn',
    x: 140,
    y: 210,
    cpuPct: 54.0,
    ramPct: 62.1,
    bandwidthGbps: 15.2,
    bandwidthLimitGbps: 40.0,
    thermalC: 50.2,
    trafficSpikePct: +22.8,
    rxPps: 890000,
    txPps: 810000,
    stressScore: 58,
    densityWeight: 20,
    status: 'ELEVATED'
  }
];

const MESH_LINKS = [
  { source: 'node-01', target: 'node-02', trafficGbps: 17.5 },
  { source: 'node-01', target: 'node-03', trafficGbps: 4.8 },
  { source: 'node-01', target: 'node-04', trafficGbps: 11.6 },
  { source: 'node-04', target: 'node-06', trafficGbps: 8.4 },
  { source: 'node-01', target: 'node-05', trafficGbps: 9.8 },
  { source: 'node-05', target: 'node-07', trafficGbps: 12.1 },
  { source: 'node-07', target: 'node-08', trafficGbps: 15.2 },
  { source: 'node-04', target: 'node-08', trafficGbps: 6.2 }
];

export function FtnGlobalNetworkHeatmap() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<GlobalHeatNode | null>(GLOBAL_NODES[1]);
  const [showDensityHeatmap, setShowDensityHeatmap] = useState(true);
  const [showTrafficArcs, setShowTrafficArcs] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  // Initialize and update D3 SVG Visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 480;

    svg.selectAll('*').remove();

    // Defs for gradients and glow filters
    const defs = svg.append('defs');

    // Glow filter
    const filter = defs.append('filter').attr('id', 'd3-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Heat gradient definitions for nodes
    const critGrad = defs.append('radialGradient').attr('id', 'heat-critical');
    critGrad.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(244, 63, 94, 0.85)');
    critGrad.append('stop').attr('offset', '60%').attr('stop-color', 'rgba(225, 29, 72, 0.3)');
    critGrad.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(225, 29, 72, 0)');

    const elevGrad = defs.append('radialGradient').attr('id', 'heat-elevated');
    elevGrad.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(245, 158, 11, 0.8)');
    elevGrad.append('stop').attr('offset', '60%').attr('stop-color', 'rgba(217, 119, 6, 0.25)');
    elevGrad.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(217, 119, 6, 0)');

    const optGrad = defs.append('radialGradient').attr('id', 'heat-optimal');
    optGrad.append('stop').attr('offset', '0%').attr('stop-color', 'rgba(16, 185, 129, 0.7)');
    optGrad.append('stop').attr('offset', '60%').attr('stop-color', 'rgba(5, 150, 105, 0.2)');
    optGrad.append('stop').attr('offset', '100%').attr('stop-color', 'rgba(5, 150, 105, 0)');

    // Background Container
    const mainGroup = svg.append('g').attr('class', 'main-zoom-group');

    // Subtle Grid background in D3
    const gridG = mainGroup.append('g').attr('class', 'grid-lines').attr('opacity', 0.15);
    for (let x = 0; x <= width; x += 40) {
      gridG.append('line').attr('x1', x).attr('y1', 0).attr('x2', x).attr('y2', height).attr('stroke', '#38bdf8').attr('stroke-width', 0.5);
    }
    for (let y = 0; y <= height; y += 40) {
      gridG.append('line').attr('x1', 0).attr('y1', y).attr('x2', width).attr('y2', y).attr('stroke', '#38bdf8').attr('stroke-width', 0.5);
    }

    // Density Heatmap Layer
    if (showDensityHeatmap) {
      const heatGroup = mainGroup.append('g').attr('class', 'heat-density-layer');
      GLOBAL_NODES.forEach(node => {
        const radius = Math.max(35, node.stressScore * 0.8 + node.densityWeight * 1.5);
        const gradId = node.status === 'CRITICAL' ? '#heat-critical' : node.status === 'ELEVATED' ? '#heat-elevated' : '#heat-optimal';

        heatGroup.append('circle')
          .attr('cx', node.x)
          .attr('cy', node.y)
          .attr('r', radius)
          .attr('fill', `url(${gradId})`)
          .attr('opacity', 0.75);
      });
    }

    // Network Link Arcs
    if (showTrafficArcs) {
      const linksGroup = mainGroup.append('g').attr('class', 'mesh-links');
      const nodeMap = new Map(GLOBAL_NODES.map(n => [n.id, n]));

      MESH_LINKS.forEach(link => {
        const s = nodeMap.get(link.source);
        const t = nodeMap.get(link.target);
        if (!s || !t) return;

        const isHotLink = link.trafficGbps > 14.0;
        const strokeColor = isHotLink ? '#f43f5e' : link.trafficGbps > 10.0 ? '#f59e0b' : '#38bdf8';
        const strokeWidth = Math.max(1.5, Math.min(4.5, link.trafficGbps * 0.25));

        // Curvature arc
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.2;

        linksGroup.append('path')
          .attr('d', `M${s.x},${s.y}A${dr},${dr} 0 0,1 ${t.x},${t.y}`)
          .attr('fill', 'none')
          .attr('stroke', strokeColor)
          .attr('stroke-width', strokeWidth)
          .attr('stroke-opacity', isHotLink ? 0.9 : 0.45)
          .attr('stroke-dasharray', isHotLink ? '4,3' : 'none');
      });
    }

    // Node Markers & Pins
    const nodesGroup = mainGroup.append('g').attr('class', 'mesh-nodes');

    GLOBAL_NODES.forEach(node => {
      const nodeG = nodesGroup.append('g')
        .attr('class', 'node-item')
        .attr('transform', `translate(${node.x},${node.y})`)
        .style('cursor', 'pointer')
        .on('click', (event) => {
          event.stopPropagation();
          handleZoomToNode(node);
        });

      const color = node.status === 'CRITICAL' ? '#f43f5e' : node.status === 'ELEVATED' ? '#f59e0b' : '#10b981';

      // Outer pulse ring if elevated or critical
      if (node.status !== 'OPTIMAL') {
        nodeG.append('circle')
          .attr('r', 18)
          .attr('fill', 'none')
          .attr('stroke', color)
          .attr('stroke-width', 1.5)
          .attr('opacity', 0.6)
          .attr('stroke-dasharray', '3,3');
      }

      // Main Pin circle
      nodeG.append('circle')
        .attr('r', node.status === 'CRITICAL' ? 11 : 9)
        .attr('fill', color)
        .attr('filter', 'url(#d3-glow)')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2);

      // Core center
      nodeG.append('circle')
        .attr('r', 3)
        .attr('fill', '#ffffff');

      // Label text
      const text = nodeG.append('text')
        .attr('y', 20)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-family', 'ui-monospace, monospace')
        .attr('font-weight', 'bold')
        .attr('fill', '#e2e8f0');

      text.append('tspan').text(node.name.replace('FTN-', ''));
    });

    // Setup D3 Zoom & Pan
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.8, 4])
      .on('zoom', (event) => {
        mainGroup.attr('transform', event.transform);
        setZoomLevel(Math.round(event.transform.k * 100) / 100);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

  }, [showDensityHeatmap, showTrafficArcs]);

  // Zoom into specific node
  const handleZoomToNode = (node: GlobalHeatNode) => {
    setSelectedNode(node);
    if (!svgRef.current || !zoomBehaviorRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 480;

    const targetX = width / 2 - node.x * 2.2;
    const targetY = height / 2 - node.y * 2.2;

    svg.transition()
      .duration(750)
      .call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity.translate(targetX, targetY).scale(2.2)
      );
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(500)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomBehaviorRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(300)
      .call(zoomBehaviorRef.current.scaleBy, 0.7);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-rose-950/40 border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1.5 shadow-[0_0_12px_rgba(244,63,94,0.2)]">
                <Flame className="w-3.5 h-3.5" />
                D3 GEOGRAPHIC NETWORK HEATMAP
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Radio className="w-3.5 h-3.5" />
                Interactive Zoom & Real-Time Traffic Spike Inspector
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white font-display">
              FTN Global Network Heatmap
            </h1>
            <p className="text-sm text-gray-400 font-mono max-w-3xl leading-relaxed">
              D3-powered vector canvas mapping global node density, thermal radiation, and transit saturation. Zoom into any edge POP or core DC to examine microsecond packet rates and hardware choke points.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            <button
              onClick={() => setShowDensityHeatmap(!showDensityHeatmap)}
              className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 cursor-pointer transition-colors ${
                showDensityHeatmap ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-gray-900 text-gray-400 border-gray-800'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Density Heatmap
            </button>

            <button
              onClick={() => setShowTrafficArcs(!showTrafficArcs)}
              className={`px-3 py-2 rounded-xl border flex items-center gap-1.5 cursor-pointer transition-colors ${
                showTrafficArcs ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-gray-900 text-gray-400 border-gray-800'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              Traffic Arcs
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: D3 Map Canvas on Left (7 cols), Selected Node Deep Inspector on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* D3 Canvas Container */}
        <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-2xl p-4 shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Top Controls Overlay */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b border-gray-800/80 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Global Grid Zoom:</span>
              <span className="text-cyan-400 font-bold">{Math.round(zoomLevel * 100)}%</span>
            </div>

            <div className="flex items-center gap-1.5 bg-gray-950 p-1 rounded-xl border border-gray-800">
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetZoom}
                className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
                title="Reset View"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* D3 SVG Canvas */}
          <div ref={containerRef} className="w-full flex-1 min-h-[380px] bg-gray-950 rounded-xl overflow-hidden relative border border-gray-800/60">
            <svg
              ref={svgRef}
              viewBox="0 0 800 480"
              className="w-full h-full select-none cursor-grab active:cursor-grabbing"
            />

            {/* Quick Node Selector Pills at bottom */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 overflow-x-auto pb-1 pointer-events-auto">
              {GLOBAL_NODES.map(node => (
                <button
                  key={node.id}
                  onClick={() => handleZoomToNode(node)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono whitespace-nowrap border transition-all cursor-pointer ${
                    selectedNode?.id === node.id
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-bold'
                      : 'bg-gray-900/90 text-gray-400 border-gray-800 hover:text-white'
                  }`}
                >
                  {node.name.replace('FTN-', '')} ({node.stressScore}%)
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Node Real-Time Hardware Status & Traffic Spikes */}
        <div className="lg:col-span-5">
          {selectedNode ? (
            <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 shadow-xl space-y-5 font-mono text-xs">
              <div className="flex items-start justify-between pb-3 border-b border-gray-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-rose-400 font-bold">NODE TELEMETRY DRILLDOWN</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedNode.status === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                        : selectedNode.status === 'ELEVATED'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {selectedNode.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display mt-1">{selectedNode.name}</h3>
                  <p className="text-gray-400 text-xs">{selectedNode.location} • {selectedNode.region}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-gray-500 block">STRESS SCORE</span>
                  <span className="text-xl font-bold text-rose-400 font-display">{selectedNode.stressScore}/100</span>
                </div>
              </div>

              {/* Traffic Spike Callout Banner */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                selectedNode.trafficSpikePct > 50
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  : 'bg-gray-950 border-gray-800 text-gray-300'
              }`}>
                <div className="flex items-center gap-2.5">
                  <TrendingUp className={`w-5 h-5 ${selectedNode.trafficSpikePct > 50 ? 'text-rose-400 animate-bounce' : 'text-cyan-400'}`} />
                  <div>
                    <span className="font-bold text-xs block">
                      {selectedNode.trafficSpikePct > 0 ? `+${selectedNode.trafficSpikePct}% Traffic Surge` : `${selectedNode.trafficSpikePct}% Bandwidth Trend`}
                    </span>
                    <span className="text-[11px] text-gray-400">Past 5-minute rolling window</span>
                  </div>
                </div>

                <span className="text-xs font-bold font-display px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800">
                  {selectedNode.bandwidthGbps} / {selectedNode.bandwidthLimitGbps} Gbps
                </span>
              </div>

              {/* Real-time Hardware Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                  <span className="text-[10px] text-gray-500 flex items-center justify-between">
                    <span>CPU UTILIZATION</span>
                    <Cpu className="w-3.5 h-3.5 text-gray-500" />
                  </span>
                  <div className="text-lg font-bold text-white">{selectedNode.cpuPct}%</div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${selectedNode.cpuPct > 80 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                      style={{ width: `${selectedNode.cpuPct}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                  <span className="text-[10px] text-gray-500 flex items-center justify-between">
                    <span>RAM ALLOCATION</span>
                    <Activity className="w-3.5 h-3.5 text-gray-500" />
                  </span>
                  <div className="text-lg font-bold text-white">{selectedNode.ramPct}%</div>
                  <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${selectedNode.ramPct > 80 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                      style={{ width: `${selectedNode.ramPct}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                  <span className="text-[10px] text-gray-500 flex items-center justify-between">
                    <span>THERMAL READING</span>
                    <Flame className="w-3.5 h-3.5 text-gray-500" />
                  </span>
                  <div className={`text-lg font-bold ${selectedNode.thermalC > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {selectedNode.thermalC}°C
                  </div>
                  <span className="text-[10px] text-gray-500">T-Junction Max 85°C</span>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-1">
                  <span className="text-[10px] text-gray-500 flex items-center justify-between">
                    <span>MICRO-SERVICES</span>
                    <Layers className="w-3.5 h-3.5 text-gray-500" />
                  </span>
                  <div className="text-lg font-bold text-white">{selectedNode.densityWeight} Pods</div>
                  <span className="text-[10px] text-cyan-400">Active Workloads</span>
                </div>
              </div>

              {/* Interface Packet Rate Details */}
              <div className="p-3.5 rounded-xl bg-gray-950 border border-gray-800 space-y-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider block">
                  NETWORK INTERFACE PACKET RATE (PPS)
                </span>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">RX Ingress:</span>
                  <span className="font-bold text-white">{selectedNode.rxPps.toLocaleString()} pps</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">TX Egress:</span>
                  <span className="font-bold text-white">{selectedNode.txPps.toLocaleString()} pps</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500 font-mono text-xs bg-gray-900 border border-gray-800 rounded-2xl">
              Click any node in the global D3 canvas to inspect real-time hardware status and traffic spikes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
