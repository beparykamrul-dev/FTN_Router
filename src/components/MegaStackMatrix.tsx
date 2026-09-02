import React, { useState } from 'react';
import { 
  Server, Network, Shield, Cpu, Activity, Globe, Globe2, 
  Terminal, Database, Play, Pause, Download, CheckCircle2, 
  AlertTriangle, Filter, Sparkles, Copy, Check, Info, 
  Zap, Star, GitBranch, ArrowUpRight, Search, Layers, Radio, ShieldCheck, HardDrive
} from 'lucide-react';
import { STACK_REPOSITORIES, PROTOCOL_COMPARISONS, STACK_LISTS, RepoItem, ProtocolComparison } from '../data/stackData';
import { cn } from '../utils';

export function MegaStackMatrix() {
  const [activeView, setActiveView] = useState<'repos' | 'protocols' | 'telemetry' | 'kernel_ai' | 'sandbox'>('repos');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRepo, setSelectedRepo] = useState<RepoItem>(STACK_REPOSITORIES[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(true);
  const [flowCount, setFlowCount] = useState(482910);
  const [offloadRate, setOffloadRate] = useState(64.2);
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolComparison>(PROTOCOL_COMPARISONS[0]);

  const filteredRepos = STACK_REPOSITORIES.filter(repo => {
    const matchesCategory = selectedCategory === 'all' || selectedCategory === 'mystack' || repo.category === selectedCategory || repo.tags.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          repo.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          repo.language.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'success',
        title: 'Copied to Clipboard',
        message: text.length > 40 ? text.substring(0, 37) + '...' : text
      }
    }));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleTriggerAction = (actionName: string) => {
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'info',
        title: `${actionName} Executed`,
        message: `Task pipeline dispatched to FTN Grid worker nodes via mTLS.`
      }
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 glass-panel p-6 rounded-2xl border border-gray-800/80 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f0ff] to-[#00ff66] flex items-center justify-center text-gray-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-white tracking-wide flex items-center gap-2">
                FTN Global Tech Stack & Starred Ecosystem
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30">
                  53 Repositories • 32 Lists
                </span>
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                Real-time control matrix for High-Performance Flow Telemetry, Zero-Trust Overlay, Kernel Acceleration, and Web3 Peering.
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-gray-900/90 p-1.5 rounded-xl border border-gray-800">
          <button
            onClick={() => setActiveView('repos')}
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2",
              activeView === 'repos'
                ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            )}
          >
            <Star className="w-3.5 h-3.5" />
            Starred Repos ({STACK_REPOSITORIES.length})
          </button>

          <button
            onClick={() => setActiveView('protocols')}
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2",
              activeView === 'protocols'
                ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            )}
          >
            <Network className="w-3.5 h-3.5" />
            Mesh & Protocol Matrix
          </button>

          <button
            onClick={() => setActiveView('telemetry')}
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2",
              activeView === 'telemetry'
                ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            )}
          >
            <Activity className="w-3.5 h-3.5" />
            Flow Telemetry (NetFlow/SiLK)
          </button>

          <button
            onClick={() => setActiveView('kernel_ai')}
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2",
              activeView === 'kernel_ai'
                ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            )}
          >
            <Cpu className="w-3.5 h-3.5" />
            Kernel & AI Engines
          </button>

          <button
            onClick={() => setActiveView('sandbox')}
            className={cn(
              "px-3.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2",
              activeView === 'sandbox'
                ? "bg-[#00f0ff] text-gray-950 shadow-md font-bold"
                : "text-gray-400 hover:text-white hover:bg-gray-800/60"
            )}
          >
            <Terminal className="w-3.5 h-3.5" />
            Live Sandbox
          </button>
        </div>
      </div>

      {/* Quick Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-panel p-3.5 rounded-xl border border-gray-800/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 font-mono">FLOW INGESTION</span>
            <div className="text-lg font-bold font-mono text-[#00f0ff]">482k pkts/s</div>
          </div>
          <Radio className="w-5 h-5 text-[#00f0ff] animate-pulse" />
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-gray-800/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 font-mono">DB OFFLOAD (PGBOUNCER)</span>
            <div className="text-lg font-bold font-mono text-[#00ff66]">{offloadRate}%</div>
          </div>
          <Database className="w-5 h-5 text-[#00ff66]" />
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-gray-800/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 font-mono">FULL MESH NODES</span>
            <div className="text-lg font-bold font-mono text-purple-400">128 Active</div>
          </div>
          <Network className="w-5 h-5 text-purple-400" />
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-gray-800/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 font-mono">WHISPER / VISION ACCEL</span>
            <div className="text-lg font-bold font-mono text-yellow-400">AVX2 + Coral TPU</div>
          </div>
          <Cpu className="w-5 h-5 text-yellow-400" />
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-gray-800/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 font-mono">DNS ANYCAST LATENCY</span>
            <div className="text-lg font-bold font-mono text-emerald-400">0.82 ms</div>
          </div>
          <Globe className="w-5 h-5 text-emerald-400" />
        </div>

        <div className="glass-panel p-3.5 rounded-xl border border-gray-800/60 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-gray-400 font-mono">EVM BENCHMARK</span>
            <div className="text-lg font-bold font-mono text-blue-400">18.4k Mgas/s</div>
          </div>
          <Zap className="w-5 h-5 text-blue-400" />
        </div>
      </div>

      {/* VIEW 1: REPOSITORIES BROWSER */}
      {activeView === 'repos' && (
        <div className="space-y-6">
          {/* Lists & Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <span className="text-xs text-gray-400 font-mono uppercase flex items-center gap-1 flex-shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" /> Lists:
            </span>
            {STACK_LISTS.map(list => (
              <button
                key={list.id}
                onClick={() => setSelectedCategory(list.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border flex items-center gap-1.5",
                  selectedCategory === list.id
                    ? "bg-gray-800 text-white border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                    : "bg-gray-900/60 text-gray-400 border-gray-800 hover:border-gray-700 hover:text-gray-200"
                )}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: list.color }} />
                <span>{list.name}</span>
                <span className="text-[10px] bg-gray-950 px-1.5 py-0.2 rounded text-gray-400 border border-gray-800">
                  {list.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search & Actions Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 53 repositories, languages, or protocols..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00f0ff] transition-all font-mono placeholder:text-gray-500"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-gray-400 font-mono">
                Showing <strong className="text-white">{filteredRepos.length}</strong> of {STACK_REPOSITORIES.length}
              </span>
              <button 
                onClick={() => {
                  const allRepos = STACK_REPOSITORIES.map(r => `${r.name} - ${r.repo}`).join('\n');
                  handleCopy(allRepos, 'all-repos');
                }}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-xs text-gray-200 rounded-lg border border-gray-700 flex items-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Export Repo List
              </button>
            </div>
          </div>

          {/* Repos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => (
              <div
                key={repo.id}
                onClick={() => setSelectedRepo(repo)}
                className={cn(
                  "glass-panel p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group hover:border-[#00f0ff]/50 relative overflow-hidden",
                  selectedRepo.id === repo.id
                    ? "border-[#00f0ff] bg-gray-900/90 shadow-[0_0_15px_rgba(0,240,255,0.15)]"
                    : "border-gray-800/80 bg-gray-950/70 hover:bg-gray-900/60"
                )}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-gray-800/80 border border-gray-700 text-[#00f0ff]">
                        <GitBranch className="w-4 h-4" />
                      </span>
                      <h3 className="font-bold text-sm text-white group-hover:text-[#00f0ff] transition-colors font-mono line-clamp-1">
                        {repo.name}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono bg-gray-800 px-2 py-0.5 rounded text-gray-300 border border-gray-700 flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {repo.stars.toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
                    {repo.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {repo.tags.slice(0, 3).map((tag, i) => (
                      <span key={i} className="text-[10px] bg-gray-900 text-gray-300 px-2 py-0.5 rounded border border-gray-800 font-mono">
                        {tag}
                      </span>
                    ))}
                    {repo.tags.length > 3 && (
                      <span className="text-[10px] text-gray-500 font-mono px-1">
                        +{repo.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-800/60 flex items-center justify-between text-xs text-gray-500 font-mono">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-[#00ff66]" />
                    {repo.language}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(`git clone ${repo.repo}.git`, repo.id);
                      }}
                      className="p-1 hover:text-white rounded hover:bg-gray-800"
                      title="Copy clone command"
                    >
                      {copiedId === repo.id ? <Check className="w-3.5 h-3.5 text-[#00ff66]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={repo.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 hover:text-[#00f0ff] rounded hover:bg-gray-800"
                      title="Open on GitHub"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Repo Inspector Modal/Drawer */}
          {selectedRepo && (
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-950/95 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-[#00f0ff]/10 rounded-xl border border-[#00f0ff]/30 text-[#00f0ff]">
                    <GitBranch className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold text-white font-mono">{selectedRepo.name}</h2>
                      <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded border border-gray-700">
                        {selectedRepo.categoryLabel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-mono mt-0.5">Updated: {selectedRepo.updated} • Language: {selectedRepo.language}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(`git clone ${selectedRepo.repo}.git`, selectedRepo.id + '-modal')}
                    className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors"
                  >
                    {copiedId === selectedRepo.id + '-modal' ? <Check className="w-4 h-4 text-[#00ff66]" /> : <Copy className="w-4 h-4" />}
                    Copy Clone URL
                  </button>
                  <a
                    href={selectedRepo.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-gray-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                  >
                    View Source <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">Description</h4>
                    <p className="text-sm text-gray-200 leading-relaxed">{selectedRepo.description}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-2">Key Architecture Features</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedRepo.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 bg-gray-900/60 rounded-lg border border-gray-800 text-xs text-gray-300">
                          <CheckCircle2 className="w-4 h-4 text-[#00ff66] flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedRepo.commandDemo && (
                    <div>
                      <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">Execution Command</h4>
                      <div className="p-3 bg-black rounded-lg border border-gray-800 font-mono text-xs text-[#00ff66] flex items-center justify-between overflow-x-auto">
                        <code>{selectedRepo.commandDemo}</code>
                        <button
                          onClick={() => handleCopy(selectedRepo.commandDemo!, 'cmd')}
                          className="ml-2 p-1 text-gray-500 hover:text-white"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-900/70 rounded-xl border border-gray-800 space-y-3">
                    <h4 className="text-xs font-mono text-gray-300 font-bold uppercase">Telemetry & Node Binding</h4>
                    <div className="flex justify-between text-xs py-1 border-b border-gray-800">
                      <span className="text-gray-500">Protocol Engine</span>
                      <span className="text-gray-200 font-mono">{selectedRepo.protocolOrEngine || 'Standard POSIX'}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-gray-800">
                      <span className="text-gray-500">Full Mesh Status</span>
                      <span className="text-[#00ff66] font-mono">{selectedRepo.fullMeshSupport || 'Compatible'}</span>
                    </div>
                    <div className="flex justify-between text-xs py-1 border-b border-gray-800">
                      <span className="text-gray-500">Grid Status</span>
                      <span className="text-[#00f0ff] font-mono uppercase">ONLINE (SYNCED)</span>
                    </div>

                    <button
                      onClick={() => handleTriggerAction(`Deploy ${selectedRepo.name}`)}
                      className="w-full mt-2 py-2 bg-gradient-to-r from-[#0088ff] to-[#0055cc] hover:from-[#0099ff] hover:to-[#0066ee] text-white text-xs font-bold rounded-lg transition-all shadow-md"
                    >
                      Trigger Node Pipeline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 2: PROTOCOLS & FULL MESH MATRIX */}
      {activeView === 'protocols' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-[#00f0ff]" />
                  Zero-Trust Overlay & Mesh Routing Comparison Matrix
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Cross-referencing Sing-box, Tailscale, NetBird, Nebula, Hysteria2, cjdns, and AetherST across bandwidth, full-mesh topology, and anti-censorship traits.
                </p>
              </div>
              <button 
                onClick={() => handleTriggerAction('Mesh Health Audit')}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-mono text-white rounded-lg border border-gray-700 flex items-center gap-2"
              >
                <Radio className="w-3.5 h-3.5 text-[#00ff66]" /> Run Mesh Latency Audit
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-900/80 border-b border-gray-800 font-mono text-gray-400 uppercase">
                  <tr>
                    <th className="px-4 py-3">Platform / Protocol</th>
                    <th className="px-4 py-3">Core Features</th>
                    <th className="px-4 py-3">Full-Mesh Support</th>
                    <th className="px-4 py-3">Primary Use-Case</th>
                    <th className="px-4 py-3">Max Throughput</th>
                    <th className="px-4 py-3">Encryption Suite</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60 font-mono">
                  {PROTOCOL_COMPARISONS.map((proto, i) => (
                    <tr 
                      key={i} 
                      onClick={() => setSelectedProtocol(proto)}
                      className={cn(
                        "hover:bg-gray-800/40 transition-colors cursor-pointer",
                        selectedProtocol.name === proto.name ? "bg-gray-800/60" : ""
                      )}
                    >
                      <td className="px-4 py-3.5 font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#00f0ff]" />
                        {proto.name}
                      </td>
                      <td className="px-4 py-3.5 text-gray-300 font-sans">{proto.coreFeature}</td>
                      <td className="px-4 py-3.5">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold border",
                          proto.fullMesh.includes('Yes') 
                            ? "bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/30"
                            : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                        )}>
                          {proto.fullMesh}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-gray-400 font-sans">{proto.useCase}</td>
                      <td className="px-4 py-3.5 text-[#00f0ff] font-bold">{proto.throughput}</td>
                      <td className="px-4 py-3.5 text-gray-300 text-[11px]">{proto.encryption}</td>
                      <td className="px-4 py-3.5 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-200 border border-gray-700">
                          {proto.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Topology Sandbox for Selected Protocol */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-gray-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#00ff66]" />
                Live Mesh Peer Visualizer: {selectedProtocol.name}
              </h4>
              <div className="h-64 bg-gray-950 rounded-xl border border-gray-800/80 p-4 relative overflow-hidden flex items-center justify-center">
                {/* Visual mesh nodes simulation */}
                <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                
                <div className="grid grid-cols-3 gap-8 text-center relative z-10 w-full max-w-lg">
                  <div className="p-3 bg-gray-900 border border-[#00ff66]/40 rounded-xl shadow-[0_0_10px_rgba(0,255,102,0.2)]">
                    <span className="text-[10px] text-[#00ff66] font-mono">NODE 1 (Core BRAS)</span>
                    <div className="text-xs font-bold text-white mt-1">100.64.0.1</div>
                    <div className="text-[10px] text-gray-400 mt-1">0.4ms • 10 Gbps</div>
                  </div>

                  <div className="p-3 bg-gray-900 border border-[#00f0ff]/40 rounded-xl shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                    <span className="text-[10px] text-[#00f0ff] font-mono">LIGHTHOUSE / RELAY</span>
                    <div className="text-xs font-bold text-white mt-1">100.64.0.254</div>
                    <div className="text-[10px] text-gray-400 mt-1">WireGuard Noise</div>
                  </div>

                  <div className="p-3 bg-gray-900 border border-purple-500/40 rounded-xl shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                    <span className="text-[10px] text-purple-400 font-mono">NODE 2 (Edge OLT)</span>
                    <div className="text-xs font-bold text-white mt-1">100.64.0.12</div>
                    <div className="text-[10px] text-gray-400 mt-1">1.1ms • MTU 9000</div>
                  </div>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-gray-400">
                  <span>Transport: UDP Encapsulation (MASQUE / QUIC)</span>
                  <span className="text-[#00ff66]">Direct P2P Link Established (DERP Bypass: 100%)</span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#00f0ff]" />
                Mesh Parameters
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">MTU / Jumbo Frames</label>
                  <select className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-2 font-mono">
                    <option>9000 bytes (Jumbo Frames - LAN/VPC)</option>
                    <option>1420 bytes (WireGuard Default)</option>
                    <option>1280 bytes (IPv6 Minimal Safe)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">Keepalive Interval</label>
                  <select className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-2 font-mono">
                    <option>25 seconds (Persistent NAT traversal)</option>
                    <option>10 seconds (Aggressive edge mobile)</option>
                    <option>Off (Static public IP routes)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">Congestion Engine</label>
                  <select className="w-full bg-gray-900 border border-gray-700 text-white text-xs rounded-lg p-2 font-mono">
                    <option>Brutal CC (Hysteria2 50%+ Loss Fix)</option>
                    <option>BBR v3 (Google Pacing)</option>
                    <option>Cubic (Standard Kernel)</option>
                  </select>
                </div>

                <button
                  onClick={() => handleTriggerAction(`Deploy ${selectedProtocol.name} Config`)}
                  className="w-full py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-gray-950 text-xs font-bold rounded-lg transition-all mt-2"
                >
                  Apply Mesh Parameters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: FLOW TELEMETRY STREAM (NETFLOW, IPFIX, SILK, RUSTFLOW) */}
      {activeView === 'telemetry' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#00ff66]" />
                    Real-time Flow Telemetry Stream (RustFlow & NetSA YAF)
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Capturing NetFlow v9, IPFIX, and sFlow packets on UDP :2055 with SiLK DPI correlation.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsSimulating(!isSimulating)}
                    className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs font-mono text-white rounded-lg border border-gray-700 flex items-center gap-1.5"
                  >
                    {isSimulating ? <Pause className="w-3.5 h-3.5 text-yellow-400" /> : <Play className="w-3.5 h-3.5 text-[#00ff66]" />}
                    {isSimulating ? 'Pause Stream' : 'Resume Stream'}
                  </button>
                </div>
              </div>

              {/* Terminal Live Flow Table */}
              <div className="bg-black rounded-xl border border-gray-800 p-4 font-mono text-xs overflow-x-auto max-h-80">
                <table className="w-full text-left">
                  <thead className="text-gray-500 border-b border-gray-800 pb-2">
                    <tr>
                      <th className="pb-2">SRC IP:PORT</th>
                      <th className="pb-2">DST IP:PORT</th>
                      <th className="pb-2">PROTO</th>
                      <th className="pb-2">BYTES / PKTS</th>
                      <th className="pb-2">DPI TAG (YAF)</th>
                      <th className="pb-2">DSCP / QoS</th>
                      <th className="pb-2 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900 text-gray-300">
                    <tr className="hover:bg-gray-900/50">
                      <td className="py-2 text-[#00f0ff]">103.245.18.90:443</td>
                      <td className="py-2 text-gray-200">10.200.4.12:54820</td>
                      <td className="py-2 text-yellow-400">TCP (TLS1.3)</td>
                      <td className="py-2">1.4 MB / 1,290</td>
                      <td className="py-2 text-purple-400">HTTPS.Streaming</td>
                      <td className="py-2 text-[#00ff66]">EF (46) - High</td>
                      <td className="py-2 text-right text-emerald-400">Forwarded</td>
                    </tr>
                    <tr className="hover:bg-gray-900/50">
                      <td className="py-2 text-[#00f0ff]">45.112.5.4:8080</td>
                      <td className="py-2 text-gray-200">10.200.4.55:49112</td>
                      <td className="py-2 text-blue-400">UDP (QUIC)</td>
                      <td className="py-2">8.2 MB / 6,104</td>
                      <td className="py-2 text-purple-400">Hysteria2.Brutal</td>
                      <td className="py-2 text-[#00ff66]">AF41 (34)</td>
                      <td className="py-2 text-right text-emerald-400">Forwarded</td>
                    </tr>
                    <tr className="hover:bg-gray-900/50">
                      <td className="py-2 text-[#00f0ff]">185.220.101.5:9999</td>
                      <td className="py-2 text-gray-200">10.200.1.1:53</td>
                      <td className="py-2 text-red-400">UDP (DNS)</td>
                      <td className="py-2">480 KB / 9,400</td>
                      <td className="py-2 text-red-400">Anycast.Amplification</td>
                      <td className="py-2 text-gray-500">CS0 (00)</td>
                      <td className="py-2 text-right text-red-400 font-bold">RATE-LIMITED (Drip)</td>
                    </tr>
                    <tr className="hover:bg-gray-900/50">
                      <td className="py-2 text-[#00f0ff]">100.64.12.8:22</td>
                      <td className="py-2 text-gray-200">100.64.0.1:22</td>
                      <td className="py-2 text-green-400">TCP (SSH)</td>
                      <td className="py-2">45 KB / 182</td>
                      <td className="py-2 text-gray-400">Admin.mRemoteNG</td>
                      <td className="py-2 text-[#00ff66]">CS6 (48)</td>
                      <td className="py-2 text-right text-emerald-400">Forwarded</td>
                    </tr>
                    <tr className="hover:bg-gray-900/50">
                      <td className="py-2 text-[#00f0ff]">fc00:84fa::1</td>
                      <td className="py-2 text-gray-200">fc00:1102::9</td>
                      <td className="py-2 text-indigo-400">IPv6 (cjdns)</td>
                      <td className="py-2">320 KB / 420</td>
                      <td className="py-2 text-indigo-400">Encrypted.DHT</td>
                      <td className="py-2 text-gray-400">AF11 (10)</td>
                      <td className="py-2 text-right text-emerald-400">Forwarded</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#00f0ff]" />
                Flow Sinks & SiLK Filters
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">SiLK rwflowpack Storage</div>
                    <div className="text-[11px] text-gray-400">/var/log/silk/flows/ (ZSTD 19)</div>
                  </div>
                  <span className="text-xs text-[#00ff66] font-mono">1.4 TB / 8.0 TB</span>
                </div>

                <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">ClickHouse Flow Database</div>
                    <div className="text-[11px] text-gray-400">10M rows/s batch ingestion</div>
                  </div>
                  <span className="text-xs text-[#00f0ff] font-mono">HEALTHY</span>
                </div>

                <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">GoFlow2 BMP Augmentation</div>
                    <div className="text-[11px] text-gray-400">BGP ASN & AS-Path tagging</div>
                  </div>
                  <span className="text-xs text-purple-400 font-mono">ACTIVE</span>
                </div>

                <button
                  onClick={() => handleTriggerAction('SiLK Top Talkers Query')}
                  className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-xs font-mono rounded-lg transition-colors border border-gray-700"
                >
                  Run SiLK Top-10 Talkers Query
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 4: KERNEL, VPP & AI VISION ACCELERATORS */}
      {activeView === 'kernel_ai' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kernel & Acceleration Panel */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#00f0ff]" />
                Low-Level Kernel & Hardware Acceleration
              </h3>
              <p className="text-xs text-gray-400">
                Direct hooks for Linux Kernel SOCK_RAW, CAN_RAW, FD.io VPP vector packet processing, and OOM killer avoidance.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">FD.io VPP (Vector Packet Processor)</div>
                    <div className="text-[11px] text-gray-400">14.8 Mpps zero-copy DPDK driver</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#00ff66]/10 text-[#00ff66] text-xs font-mono border border-[#00ff66]/30">RUNNING</span>
                </div>

                <div className="p-3.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">Intel QSV / VAAPI Video Transcoder (H.265)</div>
                    <div className="text-[11px] text-gray-400">Zero-copy hardware IPTV packager (HWEncoderX)</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] text-xs font-mono border border-[#00f0ff]/30">GPU ACCEL</span>
                </div>

                <div className="p-3.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">CAN_RAW & Industrial Telemetry Filters</div>
                    <div className="text-[11px] text-gray-400">SocketCAN kernel socket interface for power & OLT sensors</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-xs font-mono border border-purple-500/30">MONITORED</span>
                </div>

                <div className="p-3.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">OOM Killer Tuning & Buffer Pacing</div>
                    <div className="text-[11px] text-gray-400">vm.panic_on_oom=0, net.core.rmem_max=64MB</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-300 text-xs font-mono border border-yellow-500/30">OPTIMIZED</span>
                </div>
              </div>
            </div>

            {/* AI Vision & Speech Processing Panel */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                Edge AI Vision, Speech & Context Engine
              </h3>
              <p className="text-xs text-gray-400">
                Whisper.cpp audio command transcription, Frigate AI NVR optical monitoring, and Jumbo Context agent memory.
              </p>

              <div className="space-y-3">
                <div className="p-3.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">Whisper.cpp (Speech Recognition)</div>
                    <div className="text-[11px] text-gray-400">Bengali & English voice command parser (GGML base)</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#00ff66]/10 text-[#00ff66] text-xs font-mono border border-[#00ff66]/30">ACTIVE</span>
                </div>

                <div className="p-3.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">Frigate AI NVR & AI Doorbin Vision</div>
                    <div className="text-[11px] text-gray-400">Google Coral TPU optical node surveillance</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] text-xs font-mono border border-[#00f0ff]/30">CORAL TPU</span>
                </div>

                <div className="p-3.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">Jumbo Context Orchestrator</div>
                    <div className="text-[11px] text-gray-400">FTN AI multi-turn memory and telemetry snapshot bridge</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 text-xs font-mono border border-purple-500/30">SYNCED</span>
                </div>

                <div className="p-3.5 bg-gray-900/80 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">PyTorch timm (Vision Models)</div>
                    <div className="text-[11px] text-gray-400">Fiber cut & core splice anomaly detection models</div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-xs font-mono border border-blue-500/30">LOADED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 5: LIVE SANDBOX & CONFIG GENERATOR */}
      {activeView === 'sandbox' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Config Generator */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#00ff66]" />
                Auto Configuration Generator
              </h3>
              <p className="text-xs text-gray-400">
                Generate production configurations for Sing-box, ZeroTier, cjdns, PgBouncer, or RouterOS in one click.
              </p>

              <div className="space-y-2">
                <div className="p-4 bg-black rounded-xl border border-gray-800 font-mono text-xs text-[#00ff66] overflow-x-auto">
                  <pre>{`// Sing-box + Hysteria2 Universal Edge Config
{
  "log": { "level": "info", "timestamp": true },
  "inbounds": [
    { "type": "tun", "tag": "tun-in", "interface_name": "tun0", "inet4_address": "172.19.0.1/30", "auto_route": true }
  ],
  "outbounds": [
    {
      "type": "hysteria2",
      "tag": "ftn-edge-hy2",
      "server": "edge.ftn.network",
      "server_port": 443,
      "up_mbps": 1000,
      "down_mbps": 1000,
      "password": "FTN-GRID-SECURE-TOKEN-2026",
      "brutal": true
    }
  ]
}`}</pre>
                </div>
                <button
                  onClick={() => handleCopy(`// Sing-box config...`, 'hy2-cfg')}
                  className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-mono rounded-lg border border-gray-700 flex items-center justify-center gap-2"
                >
                  <Copy className="w-3.5 h-3.5" /> Copy Sing-box JSON
                </button>
              </div>
            </div>

            {/* PgBouncer & Drip Policy Sandbox */}
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-5 h-5 text-[#00f0ff]" />
                PgBouncer Edge Cache & Drip Policy Engine
              </h3>
              <p className="text-xs text-gray-400">
                Memory-to-memory edge caching offloading up to 60%+ backend queries with fine-grained rate shaping.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-gray-400">Cache Hit / Traffic Offload</span>
                    <span className="text-[#00ff66] font-bold">{offloadRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    value={offloadRate}
                    onChange={(e) => setOffloadRate(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-[#00ff66]"
                  />
                </div>

                <div className="p-3 bg-gray-900/80 rounded-xl border border-gray-800 text-xs font-mono text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pooling Mode:</span>
                    <span className="text-white">Transaction (Session Isolated)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max Client Conns:</span>
                    <span className="text-white">20,000 active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Server Pool Size:</span>
                    <span className="text-white">50 dedicated sockets</span>
                  </div>
                </div>

                <button
                  onClick={() => handleTriggerAction('PgBouncer Drip Policy Flush')}
                  className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-lg transition-all shadow-md"
                >
                  Flush Edge Cache & Rebalance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
