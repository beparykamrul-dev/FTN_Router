import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

export const FtnBgpTrafficVisualizer = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg.append('circle').attr('cx', 100).attr('cy', 100).attr('r', 20).attr('fill', '#00f0ff');
  }, []);

  return (
    <div className="p-6 bg-[#0c1017] border border-[#1e2530] rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-[#4299e1]">BGP Traffic Flow (D3.js)</h2>
      <svg ref={svgRef} width="400" height="200" />
    </div>
  );
};
