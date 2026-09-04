import React, { useState, useMemo } from 'react';
import { 
  Server, Cpu, Database, Network, Activity, Zap, ShieldCheck, 
  Globe, Terminal, Search, Copy, Check, ExternalLink, Filter, 
  Code2, Sparkles, Layers, Sliders, Shield, BookOpen, ChevronDown, 
  ChevronUp, Lock, CheckCircle2, Play, Info, X, ArrowRight,
  BrainCircuit, GitBranch, Radio, KeyRound
} from 'lucide-react';
import { ECOSYSTEM_CATEGORIES, ECOSYSTEM_TECHNOLOGIES, EcosystemTech } from '../data/ecosystemData';
import { cn } from '../utils';

// Primary categories matching user prompt: Core, AI, Network, Security, Telemetry, Storage/Edge
const FILTER_CATEGORIES = [
  { id: 'all', label: 'All Categories', group: 'all' },
  { id: 'core', label: 'Core / Kernel', group: 'core-kernel' },
  { id: 'ai', label: 'AI & Cognitive', group: 'remote-automation-ai' },
  { id: 'network', label: 'Network & SDN', group: 'overlay-sdn' },
  { id: 'security', label: 'Security & PKI', group: 'dns-pki' },
  { id: 'telemetry', label: 'Telemetry (SiLK/YAF)', group: 'telemetry-monitoring' },
  { id: 'tunnels', label: 'Oly-7 Tunnels', group: 'oly7-tunnels' }
];

export function FtnEcosystemGlossary({ onNavigate }: { onNavigate?: (tab: string) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTechForDetails, setSelectedTechForDetails] = useState<EcosystemTech | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Category & search filtering
  const filteredTechs = useMemo(() => {
    return ECOSYSTEM_TECHNOLOGIES.filter(tech => {
      let matchesCategory = true;
      if (selectedCategory === 'core') {
        matchesCategory = tech.category === 'core-kernel';
      } else if (selectedCategory === 'ai') {
        matchesCategory = tech.category === 'remote-automation-ai' || tech.tags.includes('AI');
      } else if (selectedCategory === 'network') {
        matchesCategory = tech.category === 'overlay-sdn' || tech.category === 'web3-gaming-peering';
      } else if (selectedCategory === 'security') {
        matchesCategory = tech.category === 'dns-pki' || tech.tags.includes('Security') || tech.tags.includes('PKI');
      } else if (selectedCategory === 'telemetry') {
        matchesCategory = tech.category === 'telemetry-monitoring';
      } else if (selectedCategory === 'tunnels') {
        matchesCategory = tech.category === 'oly7-tunnels';
      }

      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery ||
        tech.name.toLowerCase().includes(q) ||
        tech.shortDesc.toLowerCase().includes(q) ||
        tech.technicalDetails.toLowerCase().includes(q) ||
        tech.layer.toLowerCase().includes(q) ||
        tech.tags.some(tag => tag.toLowerCase().includes(q)) ||
        (tech.rfcOrSpec && tech.rfcOrSpec.toLowerCase().includes(q)) ||
        tech.categoryLabel.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'success',
        title: 'Copied to Clipboard',
        message: text.length > 50 ? text.substring(0, 47) + '...' : text
      }
    }));
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExecuteVerification = (tech: EcosystemTech) => {
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'info',
        title: `Verification Dispatched: ${tech.name}`,
        message: tech.commandSnippet ? `Running: ${tech.commandSnippet}` : `Telemetry probe dispatched across active FTN nodes.`
      }
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#091122] via-[#0b1730] to-[#080e1c] border border-gray-800/90 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-[#00ff66] flex items-center justify-center text-gray-950 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                <BookOpen className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white font-display tracking-tight flex items-center gap-3">
                  FTN ECOSYSTEM GLOSSARY &amp; TAXONOMY
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00ff66]/15 text-[#00ff66] font-mono border border-[#00ff66]/30">
                    {ECOSYSTEM_TECHNOLOGIES.length} Verified Systems
                  </span>
                </h1>
                <p className="text-gray-300 font-mono text-xs lg:text-sm">
                  Central repository for all FTN-specific terminology, service definitions, architectural patterns, kernel modules, SiLK/YAF telemetry, and Oly-7 encryption standards.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats Strip */}
          <div className="flex items-center gap-3 bg-gray-950/80 border border-gray-800 rounded-2xl p-3 px-4">
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block">ENTRIES</span>
              <span className="text-xl font-black text-[#00f0ff] font-mono">{ECOSYSTEM_TECHNOLOGIES.length}</span>
            </div>
            <div className="h-8 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block">CORE ENCRYPTION</span>
              <span className="text-xl font-black text-[#00ff66] font-mono">ChaCha20</span>
            </div>
            <div className="h-8 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-400 font-mono block">TELEMETRY</span>
              <span className="text-xl font-black text-amber-400 font-mono">IPFIX / YAF</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-6 pt-6 border-t border-gray-800/80 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search definitions, protocols, RFCs, tools (e.g., SiLK, YAF, Ansible, Hysteria2, PgBouncer, Kube-OVN, ACME)..."
                className="w-full bg-gray-950/80 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-xs lg:text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/50 font-mono transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white px-2 py-0.5 rounded bg-gray-800"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
              <span className="px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-800 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>Showing: <strong className="text-white">{filteredTechs.length}</strong> of {ECOSYSTEM_TECHNOLOGIES.length}</span>
              </span>
            </div>
          </div>

          {/* Prompt-Specific Category Filter Pills: Core, AI, Network, Security, Telemetry, Oly-7 Tunnels */}
          <div className="flex flex-wrap gap-2 pt-1">
            {FILTER_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 border",
                    isSelected
                      ? "bg-gradient-to-r from-[#00f0ff]/20 to-[#00ff66]/20 border-[#00f0ff]/60 text-white shadow-[0_0_15px_rgba(0,240,255,0.25)]"
                      : "bg-[#091122] border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200"
                  )}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid-Based Card Layout Reflecting FTN Brand */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTechs.map(tech => {
          const isExpanded = expandedId === tech.id;
          return (
            <div
              key={tech.id}
              className={cn(
                "bg-[#080e1c] border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl group",
                isExpanded ? "border-[#00f0ff]/50 ring-1 ring-[#00f0ff]/30 bg-[#0a1224]" : "border-gray-800 hover:border-gray-700"
              )}
            >
              <div>
                {/* Top Badge & Status Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-[#00f0ff] font-bold tracking-wider inline-block mb-1.5">
                      {tech.badge}
                    </span>
                    <h3 className="text-base font-bold text-white group-hover:text-[#00f0ff] transition-colors leading-snug font-display">
                      {tech.name}
                    </h3>
                  </div>

                  <span className={cn(
                    "text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold flex-shrink-0 flex items-center gap-1",
                    tech.statusColor === 'emerald' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                    tech.statusColor === 'cyan' ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" :
                    "bg-gray-800 text-gray-400 border-gray-700"
                  )}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                    {tech.status}
                  </span>
                </div>

                {/* Layer and Specs */}
                <div className="flex items-center gap-2 mb-3 text-xs font-mono text-gray-400">
                  <span className="text-gray-500">Layer:</span>
                  <span className="text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/20">{tech.layer}</span>
                </div>

                {/* Short Definition */}
                <p className="text-xs text-gray-300 leading-relaxed mb-3 font-sans">
                  {tech.shortDesc}
                </p>

                {/* Technical Details Preview */}
                <p className="text-[11px] text-gray-400 leading-normal mb-4 font-mono bg-black/50 p-3 rounded-xl border border-gray-800/80 line-clamp-3">
                  {tech.technicalDetails}
                </p>

                {/* Tags & RFC */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tech.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-900 text-gray-400 border border-gray-800"
                    >
                      #{tag}
                    </span>
                  ))}
                  {tech.rfcOrSpec && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
                      {tech.rfcOrSpec}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: VIEW DETAILS + Quick Config */}
              <div className="pt-3 border-t border-gray-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  {/* VIEW DETAILS ACTION (Explicitly requested by user) */}
                  <button
                    onClick={() => setSelectedTechForDetails(tech)}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#00f0ff]/15 to-[#00ff66]/15 border border-[#00f0ff]/40 text-[#00f0ff] hover:text-white hover:border-[#00f0ff] flex items-center gap-1.5 transition-all font-bold group-hover:shadow-[0_0_10px_rgba(0,240,255,0.2)]"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExecuteVerification(tech)}
                      className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                      title="Run Live Verification Probe"
                    >
                      <Play className="w-3.5 h-3.5 text-[#00ff66]" />
                    </button>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : tech.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
                      title="Toggle Config Snippet"
                    >
                      <Code2 className="w-3.5 h-3.5 text-gray-400" />
                      <span>{isExpanded ? 'Hide' : 'Config'}</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Config & Command Snippets */}
                {isExpanded && (
                  <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {tech.configSnippet && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                          <span>Config Snippet:</span>
                          <button
                            onClick={() => handleCopy(tech.configSnippet!, `${tech.id}-cfg`)}
                            className="text-[#00f0ff] hover:text-white flex items-center gap-1"
                          >
                            {copiedId === `${tech.id}-cfg` ? (
                              <>
                                <Check className="w-3 h-3 text-[#00ff66]" />
                                <span className="text-[#00ff66]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="text-[11px] font-mono bg-black/90 text-gray-300 p-3 rounded-xl border border-gray-800 overflow-x-auto max-h-40 scrollbar-thin">
                          <code>{tech.configSnippet}</code>
                        </pre>
                      </div>
                    )}

                    {tech.commandSnippet && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                          <span>Verification CLI:</span>
                          <button
                            onClick={() => handleCopy(tech.commandSnippet!, `${tech.id}-cmd`)}
                            className="text-[#00ff66] hover:text-white flex items-center gap-1"
                          >
                            {copiedId === `${tech.id}-cmd` ? (
                              <>
                                <Check className="w-3 h-3 text-[#00ff66]" />
                                <span className="text-[#00ff66]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy CLI</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-black/80 border border-gray-800 rounded-xl p-2.5 flex items-center gap-2 font-mono text-[11px] text-[#00ff66]">
                          <Terminal className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
                          <code className="truncate">{tech.commandSnippet}</code>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredTechs.length === 0 && (
        <div className="text-center py-16 bg-[#080e1c] rounded-3xl border border-gray-800">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-300 font-mono text-base font-bold">No ecosystem technologies match your search criteria</p>
          <p className="text-gray-500 text-xs font-mono mt-1">Try clearing your search query or selecting "All Categories".</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-mono text-[#00f0ff] rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* DEEP VIEW DETAILS MODAL */}
      {selectedTechForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#091122] border border-gray-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800 flex items-start justify-between relative z-10">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-[#00ff66] flex items-center justify-center text-gray-950 font-bold shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                  <BookOpen className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase bg-gray-800 border border-gray-700 text-[#00f0ff]">
                      {selectedTechForDetails.badge}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-[#00ff66] border border-emerald-500/30 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                      {selectedTechForDetails.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white font-display mt-1">
                    {selectedTechForDetails.name}
                  </h2>
                  <p className="text-xs font-mono text-gray-400">
                    Category: {selectedTechForDetails.categoryLabel} &bull; Layer: {selectedTechForDetails.layer}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedTechForDetails(null)}
                className="p-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 relative z-10 scrollbar-thin">
              {/* Role in FTN Ecosystem */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-[#00f0ff] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  ROLE WITHIN THE FTN ECOSYSTEM
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed font-sans bg-black/40 p-4 rounded-2xl border border-gray-800/80">
                  {selectedTechForDetails.shortDesc}
                </p>
              </div>

              {/* Technical Specifications & Protocol Details */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-[#00ff66] flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  TECHNICAL SPECIFICATION &amp; ARCHITECTURAL PATTERN
                </h3>
                <p className="text-xs text-gray-300 font-mono leading-relaxed bg-black/60 p-4 rounded-2xl border border-gray-800/80">
                  {selectedTechForDetails.technicalDetails}
                </p>
              </div>

              {/* RFC / Spec Reference & Tags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-3 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block">RFC / PROTOCOL STANDARD</span>
                  <span className="text-xs font-mono text-cyan-300 font-bold">
                    {selectedTechForDetails.rfcOrSpec || 'FTN Sovereign Mesh Standard v3.8'}
                  </span>
                </div>
                <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-3 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-gray-400 block">CLASSIFICATION TAGS</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedTechForDetails.tags.map(t => (
                      <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Configuration Snippet */}
              {selectedTechForDetails.configSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Code2 className="w-4 h-4" />
                      SYSTEM CONFIGURATION BLUEPRINT
                    </h3>
                    <button
                      onClick={() => handleCopy(selectedTechForDetails.configSnippet!, 'modal-cfg')}
                      className="text-xs font-mono text-[#00f0ff] hover:text-white flex items-center gap-1"
                    >
                      {copiedId === 'modal-cfg' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                          <span className="text-[#00ff66]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Config</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-xs font-mono bg-black/90 text-gray-200 p-4 rounded-2xl border border-gray-800 overflow-x-auto max-h-48 scrollbar-thin">
                    <code>{selectedTechForDetails.configSnippet}</code>
                  </pre>
                </div>
              )}

              {/* CLI Command */}
              {selectedTechForDetails.commandSnippet && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-purple-400 flex items-center gap-1.5">
                      <Terminal className="w-4 h-4" />
                      VALIDATION &amp; TELEMETRY PROBE CLI
                    </h3>
                    <button
                      onClick={() => handleCopy(selectedTechForDetails.commandSnippet!, 'modal-cmd')}
                      className="text-xs font-mono text-[#00ff66] hover:text-white flex items-center gap-1"
                    >
                      {copiedId === 'modal-cmd' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                          <span className="text-[#00ff66]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy CLI</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-black/90 border border-gray-800 rounded-2xl p-3 flex items-center gap-2 font-mono text-xs text-[#00ff66]">
                    <Terminal className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <code className="select-all overflow-x-auto">{selectedTechForDetails.commandSnippet}</code>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10 bg-[#070c18]">
              {selectedTechForDetails.repoOrDocUrl ? (
                <a
                  href={selectedTechForDetails.repoOrDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#00f0ff] hover:underline flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Official Documentation &amp; Source Repository</span>
                </a>
              ) : (
                <span className="text-xs font-mono text-gray-500">
                  FTN Proprietary Kernel Standard
                </span>
              )}

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleExecuteVerification(selectedTechForDetails)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono font-bold flex items-center gap-2 transition-colors border border-gray-700"
                >
                  <Play className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span>Execute Telemetry Probe</span>
                </button>
                <button
                  onClick={() => setSelectedTechForDetails(null)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00ff66] text-gray-950 font-mono font-bold text-xs hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
