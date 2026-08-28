import React, { useState, useEffect } from 'react';
import { ArrowRight, Code2, Cpu, CheckCircle2, PlayCircle, FolderGit2, Disc, Monitor, Download } from 'lucide-react';
import { cn } from '../utils';

export function CompilerPipelineView() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedArtifact, setSelectedArtifact] = useState<'ISO' | 'EXE' | 'APK'>('ISO');
  const [includeTelemetry, setIncludeTelemetry] = useState(true);

  // Simulate an automated pipeline progressing
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    { name: 'Intent Lexer & Parser', desc: 'Translating natural language into Abstract Syntax Trees (AST).', icon: Code2 },
    { name: 'Architecture Planner', desc: 'Determining optimal microservice mapping and dependency resolution.', icon: Cpu },
    { name: 'Code Generator', desc: 'Compiling core binaries with embedded DPDK and kernel drivers.', icon: PlayCircle },
    { name: 'Filesystem Builder', desc: 'Scaffolding directories and writing physical files to disk.', icon: FolderGit2 },
    { name: 'Artifact Bundler', desc: 'Generating final deployment image.', icon: CheckCircle2 },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-8 flex gap-8">
      
      <div className="flex-1 space-y-6">
        <div className="mb-10">
          <h1 className="text-3xl font-display font-bold text-white mb-3 text-glow-blue">Node Artifact Compiler</h1>
          <p className="text-gray-400 text-sm font-mono">Automated generation of pre-configured OS images and executables for edge deployment.</p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[27px] top-8 bottom-8 w-1 bg-gray-800 z-0"></div>
          {/* Animated fill line */}
          <div 
            className="absolute left-[27px] top-8 w-1 bg-gradient-to-b from-[#00f0ff] to-[#00ff66] z-0 transition-all duration-1000 ease-in-out"
            style={{ height: `${Math.min(100, (activeStep / (steps.length - 1)) * 100)}%` }}
          ></div>

          <div className="space-y-8 relative z-10">
            {steps.map((step, idx) => {
              const isCompleted = idx < activeStep;
              const isActive = idx === activeStep;
              const Icon = step.icon;

              return (
                <div key={idx} className="flex items-start gap-6">
                  <div className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center border-4 flex-shrink-0 transition-all duration-500",
                    isCompleted ? "bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.4)]" :
                    isActive ? "bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.4)] animate-pulse" :
                    "bg-gray-900 border-gray-700 text-gray-500"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className={cn(
                    "glass-panel p-5 rounded-xl border flex-1 transition-all duration-500",
                    isActive ? "border-[#00f0ff]/50 bg-gray-800/80 shadow-[0_0_30px_rgba(0,240,255,0.1)]" : "border-gray-800/60"
                  )}>
                    <h3 className={cn(
                      "text-lg font-bold mb-1",
                      isCompleted ? "text-[#00ff66]" : isActive ? "text-[#00f0ff]" : "text-gray-400"
                    )}>{step.name}</h3>
                    <p className="text-sm text-gray-400 font-mono">{step.desc}</p>
                    
                    {isActive && (
                      <div className="mt-4 bg-black/50 p-3 rounded border border-gray-800">
                        <div className="flex gap-1.5 mb-2">
                          <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                          <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                        </div>
                        <span className="text-xs font-mono text-[#00f0ff] animate-pulse">Building {selectedArtifact} target...</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-96 flex-shrink-0 space-y-6">
         <div className="glass-panel p-5 rounded-xl border border-gray-800/60">
            <h3 className="text-white font-bold mb-4 font-display">Artifact Configuration</h3>
            
            <div className="space-y-4">
               <div>
                  <label className="text-xs text-gray-400 font-mono uppercase block mb-2">Target Format</label>
                  <div className="grid grid-cols-3 gap-2">
                     <button 
                        onClick={() => setSelectedArtifact('ISO')}
                        className={cn("p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors", selectedArtifact === 'ISO' ? "border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff]" : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500")}
                     >
                        <Disc className="w-5 h-5" />
                        <span className="text-[10px] font-bold font-mono">FTN OS (.iso)</span>
                     </button>
                     <button 
                        onClick={() => setSelectedArtifact('EXE')}
                        className={cn("p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors", selectedArtifact === 'EXE' ? "border-[#00ff66] bg-[#00ff66]/10 text-[#00ff66]" : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500")}
                     >
                        <Monitor className="w-5 h-5" />
                        <span className="text-[10px] font-bold font-mono">Agent (.exe)</span>
                     </button>
                     <button 
                        onClick={() => setSelectedArtifact('APK')}
                        className={cn("p-3 rounded-lg border flex flex-col items-center gap-2 transition-colors", selectedArtifact === 'APK' ? "border-purple-500 bg-purple-500/10 text-purple-400" : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-500")}
                     >
                        <Monitor className="w-5 h-5" />
                        <span className="text-[10px] font-bold font-mono">Mobile (.apk)</span>
                     </button>
                  </div>
               </div>

               <div>
                  <label className="text-xs text-gray-400 font-mono uppercase block mb-2">Pre-Configured Integrations & Drivers</label>
                  <div className="space-y-2">
                     <label className="flex items-center gap-3 p-2 rounded bg-gray-800/50 border border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors">
                        <input type="checkbox" checked readOnly className="rounded border-gray-600 text-[#00f0ff] focus:ring-[#00f0ff] bg-gray-900" />
                        <span className="text-xs text-gray-200 font-mono">Device Drivers & Hardware Accelerators</span>
                     </label>
                     <label className="flex items-center gap-3 p-2 rounded bg-gray-800/50 border border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors">
                        <input type="checkbox" checked readOnly className="rounded border-gray-600 text-[#00f0ff] focus:ring-[#00f0ff] bg-gray-900" />
                        <span className="text-xs text-gray-200 font-mono">ZeroTrust PKI & Local Firewall</span>
                     </label>
                     <label className="flex items-center gap-3 p-2 rounded bg-gray-800/50 border border-gray-700 cursor-pointer hover:bg-gray-800 transition-colors">
                        <input type="checkbox" checked={includeTelemetry} onChange={(e) => setIncludeTelemetry(e.target.checked)} className="rounded border-gray-600 text-[#00f0ff] focus:ring-[#00f0ff] bg-gray-900" />
                        <span className="text-xs text-gray-200 font-mono">SiLK Telemetry & eBPF Agent</span>
                     </label>
                  </div>
               </div>
               
               <button 
                  onClick={() => setActiveStep(0)}
                  disabled={activeStep < 4}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-[#0088ff] hover:bg-[#0066cc] disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-lg transition-colors"
               >
                  <Download className="w-4 h-4" /> 
                  {activeStep < 4 ? 'Build in Progress...' : `Download ${selectedArtifact}`}
               </button>
            </div>
         </div>
      </div>
      
    </div>
  );
}
