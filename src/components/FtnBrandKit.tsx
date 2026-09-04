import React, { useState } from 'react';
import { 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Layers, 
  Palette, 
  Type, 
  Maximize2, 
  Code2, 
  FileImage, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '../utils';

export function FtnBrandKit() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<'3d-official' | 'monochrome' | 'badge' | 'typography'>('3d-official');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const triggerDownload = (filename: string, href: string) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const brandColors = [
    { 
      name: 'FTN Neon Green', 
      hex: '#00FF66', 
      rgb: '0, 255, 102', 
      usage: 'Letter "N", Ascending Vector Arrow, Active Telemetry, Carrier Growth',
      textColor: 'text-black'
    },
    { 
      name: 'Cyber Cyan', 
      hex: '#00F0FF', 
      rgb: '0, 240, 255', 
      usage: 'Orbital Light Trails, Grid Fiber Optics, Glow Auras, "T" Highlight',
      textColor: 'text-black'
    },
    { 
      name: 'Polished Chrome Silver', 
      hex: '#E2E8F0', 
      rgb: '226, 232, 240', 
      usage: 'Letters "F" & "T", Metallic Outer Rings, Aerospace Bevels',
      textColor: 'text-black'
    },
    { 
      name: 'Deep Space Navy', 
      hex: '#0A1128', 
      rgb: '10, 17, 40', 
      usage: 'Atmospheric Vignette, NOC Canvas Backdrop, Globe Core',
      textColor: 'text-white'
    },
    { 
      name: 'Terminal Onyx', 
      hex: '#030712', 
      rgb: '3, 7, 18', 
      usage: 'High-contrast base panels, deep borders, code surfaces',
      textColor: 'text-white'
    },
    { 
      name: 'Verified Consensus Emerald', 
      hex: '#10B981', 
      rgb: '16, 185, 129', 
      usage: 'ZeroTrust compliance, cryptographic signatures, BGP convergence',
      textColor: 'text-black'
    }
  ];

  const typographySpecs = [
    {
      role: 'Display & Primary Brand Headings',
      font: 'Orbitron',
      weights: 'Bold (700), Black (900)',
      sample: 'FAMILY TIME NETWORK',
      class: 'font-display uppercase tracking-widest',
      notes: 'Used for wordmarks, hero titles, sovereign authority designations, and system badges.'
    },
    {
      role: 'Interface & Body Typography',
      font: 'Inter / Plus Jakarta Sans',
      weights: 'Regular (400), Medium (500), SemiBold (600)',
      sample: 'Autonomous edge routing grid with real-time SiLK telemetry and decentralized identity.',
      class: 'font-sans',
      notes: 'Engineered for dense NOC consoles, service registry grids, and multi-tenant security panels.'
    },
    {
      role: 'Telemetry & Monospace Code',
      font: 'Fira Code',
      weights: 'Medium (500), Bold (700)',
      sample: 'did:ftn:sov:kamrul-bepary :: 192.168.10.1/24 -> AS12345 (2.4ms)',
      class: 'font-mono text-sm',
      notes: 'Applied to IP tables, ASN numbers, cryptographic public keys, and SiLK packet flows.'
    }
  ];

  const anatomyElements = [
    {
      title: 'Metallic "F" & "T"',
      color: '#E2E8F0',
      description: 'Aerodynamic chrome steel beveled glyphs. Engineered with directional light reflections representing bulletproof carrier reliability, structural strength, and enterprise resilience.'
    },
    {
      title: 'Neon "N" & Growth Vector Arrow',
      color: '#00FF66',
      description: 'The right stem of the letter "N" dynamically angles into an upward-pointing hypersonic arrow. Represents perpetual expansion, continuous throughput growth, and technological sovereignty.'
    },
    {
      title: 'Cybernetic Earth Globe',
      color: '#00F0FF',
      description: 'High-tech sphere inscribed with glowing cyan-blue latitude/longitude grid coordinates and fiber-optic constellation nodes, visualizing worldwide low-latency packet routing.'
    },
    {
      title: 'Swirling Orbital Rings',
      color: '#A0AEC0',
      description: 'Twin polished metallic rings encircling the planet at dual inclinations, symbolizing the multi-tenant federation bridging Household SafeGuard, Sovereign Personal nodes, and Carrier Core networks.'
    },
    {
      title: 'Atmospheric Studio Grounding',
      color: '#0A1128',
      description: 'Luminous cyan-green concentric rings projected on a dark navy floor, establishing visual weight, depth, and enterprise grade credibility.'
    }
  ];

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> OFFICIAL VISUAL IDENTITY SYSTEM
            </span>
            <span className="text-xs text-gray-500 font-mono">v3.8 Sovereign Brand Kit</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-wide flex items-center gap-3">
            FTN <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff66] to-[#00f0ff]">FAMILY TIME NETWORK</span>
          </h1>
          <p className="text-gray-400 text-sm font-sans mt-1 max-w-2xl">
            The unified corporate branding, 3D emblem anatomy, color tokens, and asset specifications for the FTN Autonomous Grid, DNS Engine, and Sovereign Service Ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerDownload('ftn-official-logo.png', '/ftn-logo.png')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00cc55] hover:from-[#00ff66] hover:to-[#00aa44] text-gray-950 font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(0,255,102,0.35)] cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download Logo PNG
          </button>
          <button
            onClick={() => copyToClipboard('<img src="https://ftn.network/ftn-logo.png" alt="FTN Family Time Network" />', 'embed-code')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700/80 text-xs font-mono transition-colors"
          >
            {copiedKey === 'embed-code' ? <Check className="w-4 h-4 text-[#00ff66]" /> : <Copy className="w-4 h-4 text-gray-400" />}
            <span>Embed HTML</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-[#00ff66]/15 border border-[#00ff66]/40 rounded-xl text-xs font-mono text-[#00ff66] flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>Downloaded <strong>{downloadSuccess}</strong> successfully. Ready for deployment across NOC monitors, mobile splash screens, and official media.</span>
        </div>
      )}

      {/* Hero 3D Emblem Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Interactive 3D Canvas / Visual Frame */}
        <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-gray-800 bg-gradient-to-b from-[#0a1128]/80 via-gray-950/90 to-gray-950 relative overflow-hidden flex flex-col items-center justify-center min-h-[460px] group shadow-2xl">
          {/* Subtle Cyber Grid & Glowing Aura Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(0,240,255,0.12),transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_55%,rgba(0,255,102,0.1),transparent_65%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* The Official 3D Emblem Image */}
            <div className="relative mb-6 transform transition-transform duration-500 group-hover:scale-105">
              <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-2xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-gray-700/50 bg-[#0a1128] relative flex items-center justify-center">
                <img 
                  src="/ftn-logo.png" 
                  alt="FTN - Family Time Network Official Logo Branding" 
                  className="w-full h-full object-cover select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Pulsing ring indicator */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00ff66]/30 via-[#00f0ff]/30 to-[#00ff66]/30 blur-sm -z-10 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Typography Lockup Label */}
            <div className="space-y-1">
              <div className="font-display font-black text-xl tracking-widest text-white flex items-center justify-center gap-1.5">
                <span>FAMILY</span>
                <span className="text-[#00f0ff]">T</span>
                <span>IME</span>
                <span className="text-[#00ff66]">NETWORK</span>
              </div>
              <p className="text-xs text-gray-400 font-mono tracking-wider">
                AUTONOMOUS CARRIER GRID & BULLWORK NOC ENGINE
              </p>
            </div>

            {/* Quick Badge Stats */}
            <div className="flex items-center gap-3 mt-4 text-[11px] font-mono">
              <span className="px-2.5 py-1 rounded bg-gray-900/90 text-gray-300 border border-gray-800">
                Format: <strong>PNG / RGB 3D</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-gray-900/90 text-[#00ff66] border border-[#00ff66]/30">
                Aspect: <strong>1:1 Square</strong>
              </span>
              <span className="px-2.5 py-1 rounded bg-gray-900/90 text-[#00f0ff] border border-[#00f0ff]/30">
                Theme: <strong>Dark Cyber</strong>
              </span>
            </div>
          </div>

          <div className="absolute bottom-3 right-4 flex items-center gap-2 text-[10px] text-gray-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00ff66]" /> Authentic Verified Brand Emblem
          </div>
        </div>

        {/* Right: Brand Story & Design Anatomy */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4 bg-gray-900/50">
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00ff66]" /> Symbology & Design Philosophy
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed font-sans">
              The <strong>FTN (Family Time Network)</strong> insignia reconciles consumer household security with carrier-grade backbone networking. It communicates high availability, unshakeable encryption, and limitless forward momentum through tactile 3D aerospace metals and futuristic chromatic light paths.
            </p>

            <div className="space-y-3 pt-2">
              {anatomyElements.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-gray-950/70 border border-gray-800/80 hover:border-gray-700 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-gray-200 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">LAYER 0{idx + 1}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Official Color Palette Tokens */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-[#00f0ff]" /> Official Brand Color System
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Tested for WCAG AA/AAA legibility across both dark NOC monitors and light theme variants.
            </p>
          </div>
          <span className="text-[11px] text-gray-500 font-mono">Click swatch or code to copy</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brandColors.map((color) => {
            const isCopied = copiedKey === color.hex;
            return (
              <div 
                key={color.hex}
                onClick={() => copyToClipboard(color.hex, color.hex)}
                className="glass-panel p-4 rounded-xl border border-gray-800 hover:border-gray-600 transition-all cursor-pointer group bg-gray-950/60"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-lg shadow-md flex items-center justify-center font-bold text-xs border border-white/20 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: color.hex }}
                  >
                    <span className={color.textColor}>FTN</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-white truncate">{color.name}</h4>
                      {isCopied ? (
                        <span className="text-[10px] text-[#00ff66] font-mono flex items-center gap-0.5">
                          <Check className="w-3 h-3" /> Copied
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-gray-300 block">{color.hex}</span>
                  </div>
                </div>

                <div className="space-y-1 text-[11px] font-mono border-t border-gray-800/80 pt-2">
                  <div className="flex justify-between text-gray-400">
                    <span>RGB:</span> <span className="text-gray-200">{color.rgb}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-sans line-clamp-2 pt-0.5">
                    {color.usage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Typography & Fonts */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Type className="w-5 h-5 text-purple-400" /> Typography System & Hierarchies
          </h2>
          <p className="text-xs text-gray-400 font-mono">
            Standardized Google Fonts stack configured in index.html and Tailwind typography tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {typographySpecs.map((spec, i) => (
            <div key={i} className="glass-panel p-5 rounded-xl border border-gray-800 bg-gray-950/50 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#00f0ff] tracking-wider block">{spec.role}</span>
                  <h3 className="font-bold text-white text-base mt-0.5">{spec.font}</h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">{spec.weights}</span>
              </div>

              <div className="p-3 bg-gray-900/90 rounded-lg border border-gray-800">
                <p className={cn("text-gray-100", spec.class)}>
                  {spec.sample}
                </p>
              </div>

              <p className="text-xs text-gray-400 font-sans leading-relaxed">
                {spec.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Guidelines: Dos and Don'ts */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-950/70 space-y-4">
        <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#00ff66]" /> Identity Brand Guidelines & Compliance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Dos */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00ff66] uppercase tracking-wider font-mono">
              <CheckCircle2 className="w-4 h-4" /> Recommended Usage
            </div>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] mt-1.5 flex-shrink-0" />
                <span>Display the emblem on deep dark or dark-navy surfaces (`#0a1128`, `#030712`) to preserve the cyan/emerald glow luminosity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] mt-1.5 flex-shrink-0" />
                <span>Maintain a minimum clear-space margin of 20% around the perimeter of the outer orbital rings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] mt-1.5 flex-shrink-0" />
                <span>Pair the logo with the full typography wordmark "FAMILY TIME NETWORK" for public portals, carrier peering contracts, and app store listings.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] mt-1.5 flex-shrink-0" />
                <span>Ensure the upward vector arrow on the letter "N" maintains its sharp 45-degree trajectory.</span>
              </li>
            </ul>
          </div>

          {/* Don'ts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider font-mono">
              <AlertCircle className="w-4 h-4" /> Restricted Misuses
            </div>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <span>Do not change the neon green color (`#00ff66`) of the letter "N" or replace it with generic gray.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <span>Do not stretch, skew, or artificially distort the aspect ratio of the orbital rings or globe.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <span>Do not place low-resolution renders in print or 4K NOC wallboard displays; always use the master 3D render.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                <span>Do not detach the "T" highlight from the primary wordmark when presenting official legal documentation.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Media Kit & Download Catalog */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-950/60 space-y-4">
        <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
          <FileImage className="w-4 h-4 text-[#00f0ff]" /> Production Media Assets & Deployments
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-mono text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/20">WEB & PWA</span>
              <h4 className="font-bold text-sm text-white mt-2">Favicon & App Icon</h4>
              <p className="text-[11px] text-gray-400 font-mono mt-1">/favicon.png (32x32 to 512x512)</p>
            </div>
            <button
              onClick={() => triggerDownload('favicon.png', '/favicon.png')}
              className="w-full py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Asset
            </button>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-mono text-[#00f0ff] bg-[#00f0ff]/10 px-2 py-0.5 rounded border border-[#00f0ff]/20">MOBILE CLIENT</span>
              <h4 className="font-bold text-sm text-white mt-2">Flutter Splash Emblem</h4>
              <p className="text-[11px] text-gray-400 font-mono mt-1">Native Android & iOS assets</p>
            </div>
            <button
              onClick={() => triggerDownload('ftn-mobile-splash.png', '/ftn-logo.png')}
              className="w-full py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Asset
            </button>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20">NOC WALLBOARD</span>
              <h4 className="font-bold text-sm text-white mt-2">Carrier 3D Master</h4>
              <p className="text-[11px] text-gray-400 font-mono mt-1">High-def render for control rooms</p>
            </div>
            <button
              onClick={() => triggerDownload('ftn-3d-master.png', '/ftn-logo.png')}
              className="w-full py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" /> Download Asset
            </button>
          </div>

          <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[10px] font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">CSS TOKENS</span>
              <h4 className="font-bold text-sm text-white mt-2">Tailwind & CSS Tokens</h4>
              <p className="text-[11px] text-gray-400 font-mono mt-1">--color-ftn-neon: #00ff66</p>
            </div>
            <button
              onClick={() => copyToClipboard(`:root {
  --color-ftn-neon: #00ff66;
  --color-ftn-cyan: #00f0ff;
  --color-ftn-chrome: #e2e8f0;
  --color-ftn-navy: #0a1128;
  --color-ftn-onyx: #030712;
}`, 'css-vars')}
              className="w-full py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-200 transition-colors flex items-center justify-center gap-1.5"
            >
              {copiedKey === 'css-vars' ? <Check className="w-3.5 h-3.5 text-[#00ff66]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy CSS Vars</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
