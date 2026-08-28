import React, { useState } from 'react';
import { Activity, Play, Square, Settings2, Target, Route, RefreshCw, AlertTriangle, Cpu } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '../utils';

const scenarios = [
  { id: 'ddos', name: 'Volumetric DDoS', desc: 'Injects 100Gbps SYN flood towards edge nodes.', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  { id: 'flash', name: 'Flash Crowd', desc: 'Simulates viral traffic spike (+400%) on API gateways.', icon: Activity, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  { id: 'microburst', name: 'Microburst Analysis', desc: 'High-frequency sub-second bursts to test buffer depth.', icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'failover', name: 'Link Failure', desc: 'Simulates physical cut on primary transit link.', icon: Route, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
];

export function EdgeTrafficSimulator() {
  const [activeScenario, setActiveScenario] = useState('ddos');
  const [isRunning, setIsRunning] = useState(false);
  const [simData, setSimData] = useState<{time: string, normal: number, synthetic: number, mitigated: number}[]>([]);

  const startSimulation = () => {
    setIsRunning(true);
    setSimData([]);
    
    // Simulate data generation over time
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      setSimData(prev => {
        const newData = [...prev];
        const isSpike = tick > 2 && tick < 15;
        const syntheticLoad = isSpike ? Math.random() * 80 + 50 : Math.random() * 10;
        
        newData.push({
          time: `T+${tick}s`,
          normal: Math.random() * 15 + 10,
          synthetic: syntheticLoad,
          mitigated: isSpike ? syntheticLoad * 0.9 : 0 // AI mitigates 90%
        });
        if (newData.length > 20) newData.shift();
        return newData;
      });

      if (tick > 25) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-wide flex items-center gap-2">
            <Activity className="w-6 h-6 text-purple-400" />
            Edge Traffic Simulator & AI Resilience Testing
          </h2>
          <p className="text-gray-400 mt-1">Inject synthetic patterns to validate predictive rerouting</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenarios */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-5 rounded-xl border border-gray-800/60">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-gray-400" />
              Test Scenarios
            </h3>
            <div className="space-y-3">
              {scenarios.map(s => (
                <div 
                  key={s.id} 
                  onClick={() => !isRunning && setActiveScenario(s.id)}
                  className={cn(
                    "p-4 rounded-lg border transition-all cursor-pointer",
                    activeScenario === s.id ? `${s.bg} ${s.border}` : "bg-gray-900/40 border-gray-800 hover:bg-gray-800/50",
                    isRunning && activeScenario !== s.id && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <s.icon className={cn("w-5 h-5", activeScenario === s.id ? s.color : "text-gray-400")} />
                    <h4 className="font-semibold text-gray-200">{s.name}</h4>
                  </div>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <button 
                onClick={isRunning ? undefined : startSimulation}
                className={cn(
                  "w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all",
                  isRunning ? "bg-red-500 text-white animate-pulse" : "bg-purple-500 hover:bg-purple-400 text-white"
                )}
              >
                {isRunning ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                {isRunning ? 'Injecting Traffic...' : 'Execute Simulation'}
              </button>
            </div>
          </div>
        </div>

        {/* Telemetry View */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-gray-800/60 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-semibold text-gray-200">AI Mitigation Telemetry</h3>
              <p className="text-xs text-gray-400">Monitoring synthetic load vs AI predictive rerouting drops</p>
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Normal</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500"></div> Synthetic Load</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#00ff66]"></div> AI Mitigated</span>
            </div>
          </div>

          <div className="flex-1 min-h-[350px] relative flex items-center justify-center bg-gray-900/30 rounded-lg border border-gray-800/50">
            {simData.length === 0 ? (
              <div className="text-center text-gray-500">
                <Cpu className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Waiting for simulation trigger...</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%" className="p-4">
                <AreaChart data={simData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis dataKey="time" stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                  <YAxis stroke="#666" tick={{fill: '#888', fontSize: 10}} />
                  <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="normal" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Base Load" />
                  <Area type="monotone" dataKey="synthetic" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.5} name="Synthetic Attack" />
                  <Area type="monotone" dataKey="mitigated" stackId="3" stroke="#00ff66" fill="#00ff66" fillOpacity={0.7} name="AI Dropped/Rerouted" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
