import React, { useState } from 'react';
import { 
  Globe2, 
  Zap, 
  Cloud, 
  ShieldCheck, 
  Activity, 
  RefreshCw, 
  CheckCircle2, 
  Server, 
  Network, 
  Settings2,
  Trash2,
  AlertCircle,
  ExternalLink,
  Plus,
  Play,
  Share2,
  Database,
  Cpu
} from 'lucide-react';
import { cn } from '../utils';

interface CdnProvider {
  id: string;
  name: string;
  tier: string;
  type: string;
  status: 'ACTIVE' | 'STANDBY' | 'DISCONNECTED';
  latency: number;
  cacheHitRatio: number;
  bandwidthSaved: string;
  icon: React.ElementType;
  color: string;
}

export function CdnEdgeManager() {
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'configuration'>('overview');

  const cdnProviders: CdnProvider[] = [
    {
      id: 'cloudflare',
      name: 'Cloudflare Edge',
      tier: 'Free Tier (Global Anycast)',
      type: 'Primary DNS & CDN',
      status: 'ACTIVE',
      latency: 12,
      cacheHitRatio: 94.2,
      bandwidthSaved: '2.4 TB',
      icon: Cloud,
      color: 'text-orange-400'
    },
    {
      id: 'gcore',
      name: 'Gcore CDN',
      tier: 'Free Tier (1000GB/mo)',
      type: 'Static Assets / Video',
      status: 'ACTIVE',
      latency: 18,
      cacheHitRatio: 88.5,
      bandwidthSaved: '840 GB',
      icon: Globe2,
      color: 'text-orange-500'
    },
    {
      id: 'fastly',
      name: 'Fastly Edge Compute',
      tier: 'Developer Free / OSS',
      type: 'WASM Edge Functions',
      status: 'STANDBY',
      latency: 15,
      cacheHitRatio: 0,
      bandwidthSaved: '0 GB',
      icon: Zap,
      color: 'text-red-500'
    },
    {
      id: 'byteplus',
      name: 'BytePlus (TikTok Edge)',
      tier: 'Free Trial / OSS',
      type: 'Video Streaming & TikTok API',
      status: 'ACTIVE',
      latency: 14,
      cacheHitRatio: 91.2,
      bandwidthSaved: '1.8 TB',
      icon: Play,
      color: 'text-[#00f0ff]'
    },
    {
      id: 'meta-edge',
      name: 'Meta Edge Network',
      tier: 'Social Graph Free',
      type: 'Social Media & Auth Cache',
      status: 'ACTIVE',
      latency: 19,
      cacheHitRatio: 86.4,
      bandwidthSaved: '620 GB',
      icon: Share2,
      color: 'text-blue-500'
    },
    {
      id: 'aws-cloudfront',
      name: 'AWS CloudFront',
      tier: 'Free Tier (1TB/mo)',
      type: 'Global S3 Edge Proxy',
      status: 'ACTIVE',
      latency: 24,
      cacheHitRatio: 82.1,
      bandwidthSaved: '950 GB',
      icon: Cloud,
      color: 'text-yellow-500'
    },
    {
      id: 'gcp-cdn',
      name: 'Google Cloud CDN',
      tier: 'Free Tier (Standard)',
      type: 'Premium Network Routing',
      status: 'STANDBY',
      latency: 17,
      cacheHitRatio: 0,
      bandwidthSaved: '0 GB',
      icon: Network,
      color: 'text-blue-400'
    },
    {
      id: 'vercel',
      name: 'Vercel Edge Network',
      tier: 'Hobby Free',
      type: 'SSR & Edge Middleware',
      status: 'ACTIVE',
      latency: 22,
      cacheHitRatio: 76.4,
      bandwidthSaved: '112 GB',
      icon: Server,
      color: 'text-white'
    },
    {
      id: 'supabase-edge',
      name: 'Supabase Edge (Deno)',
      tier: 'Free Tier (2M requests)',
      type: 'Database Edge Functions',
      status: 'ACTIVE',
      latency: 28,
      cacheHitRatio: 65.2,
      bandwidthSaved: '45 GB',
      icon: Database,
      color: 'text-[#00ff66]'
    },
    {
      id: 'netlify-edge',
      name: 'Netlify Edge',
      tier: 'Starter Free',
      type: 'Frontend & Functions',
      status: 'STANDBY',
      latency: 21,
      cacheHitRatio: 0,
      bandwidthSaved: '0 GB',
      icon: Zap,
      color: 'text-teal-400'
    },
    {
      id: 'bunny-cdn',
      name: 'BunnyCDN',
      tier: 'Pay-as-you-go ($0.01/GB)',
      type: 'Global Volume Delivery',
      status: 'ACTIVE',
      latency: 16,
      cacheHitRatio: 89.1,
      bandwidthSaved: '430 GB',
      icon: Cloud,
      color: 'text-yellow-400'
    },
    {
      id: 'alibaba-cdn',
      name: 'Alibaba Cloud CDN',
      tier: 'Free Trial (1TB)',
      type: 'Asia-Pacific Core Routing',
      status: 'STANDBY',
      latency: 11,
      cacheHitRatio: 0,
      bandwidthSaved: '0 GB',
      icon: Globe2,
      color: 'text-orange-600'
    },
    {
      id: 'akamai',
      name: 'Akamai Connected Cloud',
      tier: 'Linode Developer Tier',
      type: 'Enterprise Security Edge',
      status: 'ACTIVE',
      latency: 13,
      cacheHitRatio: 96.8,
      bandwidthSaved: '5.1 TB',
      icon: ShieldCheck,
      color: 'text-blue-600'
    }
  ];

  const handlePurgeCache = () => {
    setIsPurging(true);
    setPurgeSuccess(false);
    setTimeout(() => {
      setIsPurging(false);
      setPurgeSuccess(true);
      setTimeout(() => setPurgeSuccess(false), 4000);
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-white mb-1 flex items-center gap-3">
            <Network className="w-6 h-6 text-[#00f0ff]" /> Global CDN & Edge Adapters
          </h1>
          <p className="text-gray-400 text-sm font-mono max-w-2xl">
            Manage multi-CDN failover, Anycast routing, and Edge compute middleware across free-tier providers.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handlePurgeCache}
            disabled={isPurging}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all shadow-lg",
              purgeSuccess 
                ? "bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/40" 
                : "bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700/80 hover:border-gray-500"
            )}
          >
            {isPurging ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#00f0ff]" />
            ) : purgeSuccess ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Trash2 className="w-4 h-4 text-red-400" />
            )}
            {isPurging ? 'PURGING EDGE CACHE...' : purgeSuccess ? 'CACHE PURGED GLOBALLY' : 'PURGE ALL CACHES'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-4">
        <button
          onClick={() => setActiveTab('overview')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
            activeTab === 'overview' 
              ? "bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30 shadow-[0_0_10px_rgba(0,240,255,0.15)]" 
              : "text-gray-500 hover:text-gray-300 hover:bg-gray-900"
          )}
        >
          Fleet Overview
        </button>
        <button
          onClick={() => setActiveTab('configuration')}
          className={cn(
            "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
            activeTab === 'configuration' 
              ? "bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 shadow-[0_0_10px_rgba(0,255,102,0.15)]" 
              : "text-gray-500 hover:text-gray-300 hover:bg-gray-900"
          )}
        >
          Adapter Configs
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Edge Metrics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-gray-800 bg-gray-950/60 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Global Cache Hit</span>
                <Activity className="w-4 h-4 text-[#00ff66]" />
              </div>
              <div className="text-3xl font-display font-bold text-white">92.4<span className="text-lg text-gray-500">%</span></div>
              <div className="mt-2 text-[10px] text-[#00ff66] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" /> Optimal performance
              </div>
            </div>
            
            <div className="glass-panel p-5 rounded-2xl border border-gray-800 bg-gray-950/60 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Bandwidth Saved</span>
                <Cloud className="w-4 h-4 text-[#00f0ff]" />
              </div>
              <div className="text-3xl font-display font-bold text-white">3.35<span className="text-lg text-gray-500">TB</span></div>
              <div className="mt-2 text-[10px] text-[#00f0ff] font-mono flex items-center gap-1">
                Last 30 days combined
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-gray-800 bg-gray-950/60 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Avg Edge Latency</span>
                <Globe2 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-display font-bold text-white">16<span className="text-lg text-gray-500">ms</span></div>
              <div className="mt-2 text-[10px] text-purple-400 font-mono flex items-center gap-1">
                Worldwide Anycast Average
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-gray-800 bg-gray-950/60 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Active PoPs</span>
                <Network className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-3xl font-display font-bold text-white">312</div>
              <div className="mt-2 text-[10px] text-yellow-400 font-mono flex items-center gap-1">
                Nodes serving traffic
              </div>
            </div>
          </div>

          {/* CDN Fleet */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cdnProviders.map((cdn) => {
              const Icon = cdn.icon;
              return (
                <div key={cdn.id} className="glass-panel p-5 rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950 relative overflow-hidden group">
                  {cdn.status === 'ACTIVE' && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.5)]" />
                  )}
                  {cdn.status === 'STANDBY' && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-gray-950 border border-gray-800">
                        <Icon className={cn("w-5 h-5", cdn.color)} />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base flex items-center gap-2">
                          {cdn.name}
                        </h3>
                        <span className="text-[10px] text-[#00f0ff] font-mono border border-[#00f0ff]/30 bg-[#00f0ff]/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {cdn.tier}
                        </span>
                      </div>
                    </div>
                    <div className={cn(
                      "px-2.5 py-1 rounded text-[10px] font-mono font-bold flex items-center gap-1.5",
                      cdn.status === 'ACTIVE' ? "bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20" :
                      cdn.status === 'STANDBY' ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" :
                      "bg-gray-800 text-gray-400"
                    )}>
                      {cdn.status === 'ACTIVE' && <div className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />}
                      {cdn.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-800/80 text-xs font-mono">
                    <div>
                      <div className="text-gray-500 text-[10px] uppercase mb-1">Latency</div>
                      <div className="text-white">{cdn.latency}ms</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-[10px] uppercase mb-1">Cache Hit</div>
                      <div className="text-[#00ff66]">{cdn.cacheHitRatio}%</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-[10px] uppercase mb-1">B/W Saved</div>
                      <div className="text-[#00f0ff]">{cdn.bandwidthSaved}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-gray-800/50 flex justify-between items-center text-[10px] font-mono">
                    <span className="text-gray-500">Routing Profile: {cdn.type}</span>
                    <button className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                      Configure <Settings2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'configuration' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-900/60">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                <Settings2 className="w-4 h-4 text-[#00f0ff]" /> Cloudflare Configuration
              </h3>
              
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-gray-400 block mb-1">Global API Key</label>
                  <input 
                    type="password" 
                    value="********************************" 
                    readOnly
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-500 focus:outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 block mb-1">Zone ID (ftn.network)</label>
                    <input 
                      type="text" 
                      value="8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d" 
                      readOnly
                      className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 block mb-1">Cache Level</label>
                    <select className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-gray-300 focus:outline-none">
                      <option>Cache Everything</option>
                      <option>Standard</option>
                      <option>Bypass</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 pt-2">
                  <button className="px-4 py-2 rounded-lg bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 hover:bg-[#00ff66]/20 transition-colors font-bold">
                    Save Config
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-gray-900 text-gray-400 border border-gray-700 hover:text-white transition-colors">
                    Test Connection
                  </button>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gray-900/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-purple-400" /> Add New Edge Adapter
                </h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {['Tencent Cloud', 'KeyCDN', 'StackPath', 'Sucuri', 'CacheFly', 'Fastly Compute'].map(provider => (
                  <button key={provider} className="p-3 rounded-xl border border-gray-800 bg-gray-950 hover:border-gray-600 transition-colors flex flex-col items-center justify-center gap-2 group">
                    <Cloud className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                    <span className="text-[10px] font-mono text-gray-400 text-center">{provider}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
              <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4" /> Edge Routing Rules
              </h4>
              <p className="text-xs text-gray-400 font-sans leading-relaxed mb-4">
                You are currently utilizing Free Tier adapters. Multi-CDN load balancing is handled via Round-Robin DNS. To enable latency-based Anycast failover, upgrade your core router tier.
              </p>
              <ul className="space-y-2 text-[10px] font-mono text-gray-500">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-amber-500 rounded-full" /> API Routes: Bypassed
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#00ff66] rounded-full" /> Static Assets: Cloudflare + BunnyCDN
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-[#00f0ff] rounded-full" /> Video/Media: BytePlus (TikTok) + Meta
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-purple-400 rounded-full" /> Middleware: Vercel + Netlify
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-blue-400 rounded-full" /> Edge DB Logic: Supabase (Deno)
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
