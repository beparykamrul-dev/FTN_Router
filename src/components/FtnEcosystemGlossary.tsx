import React, { useState } from 'react';
import { 
  Server, Cpu, Database, Network, Activity, Zap, ShieldCheck, 
  Globe, Terminal, Search, Copy, Check, ExternalLink, Filter, 
  Code2, Sparkles, Layers, Sliders, Shield, BookOpen, ChevronDown, 
  ChevronUp, Lock, CheckCircle2, Play
} from 'lucide-react';
import { ECOSYSTEM_CATEGORIES, ECOSYSTEM_TECHNOLOGIES, EcosystemTech } from '../data/ecosystemData';
import { cn } from '../utils';

export function FtnEcosystemGlossary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredTechs = ECOSYSTEM_TECHNOLOGIES.filter(tech => {
    const matchesCategory = selectedCategory === 'all' || tech.category === selectedCategory;
    const matchesSearch = 
      tech.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.technicalDetails.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.layer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tech.rfcOrSpec && tech.rfcOrSpec.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
      <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border border-gray-800/80 rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#00ff66]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00f0ff] to-[#00ff66] flex items-center justify-center text-gray-950 shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                <BookOpen className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white font-display tracking-tight flex items-center gap-3">
                  FTN Enterprise Technology Matrix & Taxonomy
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#00ff66]/10 text-[#00ff66] font-mono border border-[#00ff66]/30">
                    {ECOSYSTEM_TECHNOLOGIES.length} Verified Systems
                  </span>
                </h1>
                <p className="text-gray-400 font-mono text-xs lg:text-sm">
                  Authoritative protocol specifications, kernel modules, SiLK/YAF telemetry, PKI, SDN overlays, and Oly-7 multi-tunnel encryption standards.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-3 bg-gray-900/80 border border-gray-800 rounded-2xl p-3 px-4">
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-500 font-mono block">CATEGORIES</span>
              <span className="text-lg font-bold text-[#00f0ff] font-mono">{ECOSYSTEM_CATEGORIES.length - 1}</span>
            </div>
            <div className="h-8 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-500 font-mono block">ENCRYPTION</span>
              <span className="text-lg font-bold text-[#00ff66] font-mono">ChaCha20/mTLS</span>
            </div>
            <div className="h-8 w-px bg-gray-800" />
            <div className="text-center px-2">
              <span className="text-[10px] text-gray-500 font-mono block">TELEMETRY</span>
              <span className="text-lg font-bold text-amber-400 font-mono">IPFIX/SiLK</span>
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-6 pt-6 border-t border-gray-800/60 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search protocols, RFCs, tools (e.g., SiLK, YAF, Ansible, Hysteria2, PgBouncer, CAN_RAW, Kube-OVN, ACME)..."
                className="w-full bg-gray-950/70 border border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]/50 focus:ring-1 focus:ring-[#00f0ff]/50 font-mono transition-all"
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
              <span className="px-3 py-2.5 rounded-xl bg-gray-800/60 border border-gray-700/60 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-[#00f0ff]" />
                <span>Showing: <strong className="text-white">{filteredTechs.length}</strong> of {ECOSYSTEM_TECHNOLOGIES.length}</span>
              </span>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {ECOSYSTEM_CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-medium font-mono transition-all flex items-center gap-2 border",
                    isSelected
                      ? "bg-gradient-to-r from-[#00f0ff]/20 to-[#00ff66]/20 border-[#00f0ff]/50 text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                      : "bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200"
                  )}
                >
                  <span>{cat.label}</span>
                  <span className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                    isSelected ? "bg-[#00f0ff]/30 text-[#00f0ff]" : "bg-gray-800 text-gray-400"
                  )}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid of Technologies */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTechs.map(tech => {
          const isExpanded = expandedId === tech.id;
          return (
            <div
              key={tech.id}
              className={cn(
                "bg-gray-900/80 border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-xl group",
                isExpanded ? "border-[#00f0ff]/50 ring-1 ring-[#00f0ff]/30 bg-gray-900/95" : "border-gray-800/80 hover:border-gray-700"
              )}
            >
              <div>
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-gray-800 border border-gray-700/60 text-gray-300 font-bold tracking-wider inline-block mb-1.5">
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

                {/* Description */}
                <p className="text-xs text-gray-300 leading-relaxed mb-3">
                  {tech.shortDesc}
                </p>

                {/* Deep Technical Details */}
                <p className="text-[11px] text-gray-400 leading-normal mb-4 font-mono bg-gray-950/60 p-3 rounded-xl border border-gray-800/60">
                  {tech.technicalDetails}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tech.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800/60 text-gray-400 border border-gray-750"
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

              {/* Action and Expand Footer */}
              <div className="pt-3 border-t border-gray-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  {tech.repoOrDocUrl ? (
                    <a
                      href={tech.repoOrDocUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#00f0ff] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Docs / Source</span>
                    </a>
                  ) : (
                    <span className="text-gray-500 text-[11px]">{tech.categoryLabel}</span>
                  )}

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
                      className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5 text-[#00f0ff]" />
                      <span>{isExpanded ? 'Hide Config' : 'View Config'}</span>
                      {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Config & Command Snippets */}
                {isExpanded && (
                  <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {tech.configSnippet && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
                          <span>Configuration Snippet:</span>
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
                        <pre className="text-[11px] font-mono bg-black/90 text-gray-300 p-3 rounded-xl border border-gray-800 overflow-x-auto max-h-48 scrollbar-thin">
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
        <div className="text-center py-16 bg-gray-900/50 rounded-2xl border border-gray-800">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-300 font-mono text-base font-bold">No technologies match your search criteria</p>
          <p className="text-gray-500 text-xs font-mono mt-1">Try clearing your search query or selecting "All Technologies".</p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm font-mono text-[#00f0ff] rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
