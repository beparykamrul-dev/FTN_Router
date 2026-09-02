import React, { useState, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import * as d3 from 'd3';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export function GlobalMap() {
  const [nodes, setNodes] = useState([
    { name: "SIN-01", coordinates: [103.8198, 1.3521], traffic: 50 },
    { name: "FRA-02", coordinates: [8.6821, 50.1109], traffic: 80 },
    { name: "NRT-01", coordinates: [139.6917, 35.6895], traffic: 20 },
    { name: "DAC-01", coordinates: [90.4125, 23.8103], traffic: 95 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        traffic: Math.floor(Math.random() * 100)
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // D3 color scale: Low traffic (blue) to high traffic/threat (red)
  const colorScale = d3.scaleLinear<string>()
    .domain([0, 50, 100])
    .range(["#00f0ff", "#fbbf24", "#ef4444"]);

  return (
    <div className="w-full h-full bg-transparent">
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 100 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography key={geo.rsmKey} geography={geo} fill="#1f2937" stroke="#374151" />
            ))
          }
        </Geographies>
        {nodes.map(({ name, coordinates, traffic }) => (
          <Marker key={name} coordinates={coordinates as [number, number]}>
            <circle r={traffic > 80 ? 8 : 4} fill={colorScale(traffic)} className="transition-all duration-500" />
            <text textAnchor="middle" y={-10} className="text-[8px] fill-white font-mono">{name} ({traffic}%)</text>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
