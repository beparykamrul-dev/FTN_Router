import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, FileBadge, Activity, RefreshCw, CheckCircle2, XCircle, Clock, Server, ArrowRightLeft, Globe, Users, Network, Waypoints, History, AlertTriangle, Cpu, TerminalSquare } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, PieChart, Pie, Cell } from 'recharts';
import { cn } from '../utils';

const throughputData = [
  { time: '00:00', global: 45, local: 42 },
  { time: '04:00', global: 52, local: 48 },
  { time: '08:00', global: 120, local: 115 },
  { time: '12:00', global: 145, local: 138 },
  { time: '16:00', global: 132, local: 128 },
  { time: '20:00', global: 85, local: 82 },
  { time: '24:00', global: 50, local: 48 },
];

const globalCerts = [
  { id: 1, domain: 'global-edge.ftndns.com', provider: 'Akamai Edge', type: 'goCrypto AES-256-GCM', purpose: 'Global Traffic Routing', expires: '180 days', status: 'Active', autoRenew: true },
  { id: 2, domain: 'transit.tier1.provider', provider: 'Akamai SSL', type: 'goCrypto TLS 1.3', purpose: 'Provider Trust Sync', expires: '345 days', status: 'Active', autoRenew: true },
  { id: 3, domain: 'cdn-delivery.global.net', provider: 'Akamai Edge', type: 'goCrypto AES-256-GCM', purpose: 'Trusted Global Delivery', expires: '89 days', status: 'Active', autoRenew: true },
];

const localCerts = [
  { id: 4, domain: 'identity.local.ftndns.com', provider: "Let's Encrypt", type: 'ECDSA P-384', purpose: 'Local Identity', expires: '45 days', status: 'Active', autoRenew: true },
  { id: 5, domain: 'remote-vpn.local.net', provider: "Let's Encrypt", type: 'RSA 4096', purpose: 'Remote Access', expires: '12 days', status: 'Renewing', autoRenew: true },
  { id: 6, domain: 'bgp-peer-01.local.net', provider: 'Internal PKI / ACME', type: 'mTLS Client', purpose: 'Local Peering', expires: '312 days', status: 'Active', autoRenew: false },
  { id: 7, domain: 'user-portal.local.net', provider: "Let's Encrypt", type: 'ECDSA P-384', purpose: 'User Network Portal', expires: '60 days', status: 'Active', autoRenew: true },
];

const auditLogs = [
  { id: 101, time: '10:42:05', event: 'mTLS Handshake', source: '10.0.4.55 (Edge)', target: '10.0.1.10 (Core API)', status: 'Success', detail: 'TLS 1.3 AES-256-GCM verified' },
  { id: 102, time: '10:38:12', event: 'Key Rotation', source: 'PKI Auto-Manager', target: 'transit.tier1.provider', status: 'Success', detail: 'Rotated session keys via goCrypto' },
  { id: 103, time: '10:15:00', event: 'Cert Validation', source: 'ACME Poller', target: 'remote-vpn.local.net', status: 'Warning', detail: 'Certificate expires in 12 days' },
  { id: 104, time: '09:55:22', event: 'mTLS Handshake', source: '192.168.1.5 (User)', target: 'identity.local.ftndns.com', status: 'Failed', detail: 'Invalid Client Certificate provided' },
  { id: 105, time: '09:30:10', event: 'Provider Sync', source: 'Akamai Trust Sync', target: 'cdn-delivery.global.net', status: 'Success', detail: 'Trust chain updated successfully' },
];

const pkiNodes = [
  { id: 'ca-master-01', location: 'Dhaka DC', role: 'Root CA Node', status: 'Online', latency: '2ms', load: '12%' },
  { id: 'ca-edge-01', location: 'Singapore Edge', role: 'Intermediate CA', status: 'Online', latency: '45ms', load: '38%' },
  { id: 'hsm-vault-01', location: 'Dhaka DC', role: 'Hardware Security', status: 'Online', latency: '1ms', load: '5%' },
  { id: 'ca-edge-02', location: 'London Edge', role: 'Intermediate CA', status: 'Degraded', latency: '142ms', load: '89%' },
];

export function CryptoPkiManager() {
  const [activeTab, setActiveTab] = useState<'global' | 'local' | 'topology' | 'logs' | 'sla'>('global');
  const [logFilter, setLogFilter] = useState<'All' | 'mTLS' | 'Key Rotation' | 'Validation'>('All');

  // Background Polling Service for Certificate Alerts
  useEffect(() => {
    const pollInterval = setInterval(() => {
      // Check for expiring certs (simulating background poll)
      const hasExpiring = localCerts.some(c => c.expires === '12 days');
      if (hasExpiring) {
        window.dispatchEvent(new CustomEvent('add-toast', {
          detail: {
            type: 'critical',
            title: 'PKI Certificate Alert',
            message: 'remote-vpn.local.net certificate is expiring in 12 days. Auto-renewal initiated.',
          }
        }));
      }

      // Check node degradation
      const hasDegraded = pkiNodes.some(n => n.status === 'Degraded');
      if (hasDegraded) {
        window.dispatchEvent(new CustomEvent('add-toast', {
          detail: {
            type: 'info',
            title: 'SLA Node Warning',
            message: 'ca-edge-02 (London) is experiencing high load (89%). Scaling PKI workers.',
          }
        }));
      }
    }, 25000); // Poll every 25s for demonstration

    return () => clearInterval(pollInterval);
  }, []);

  const filteredLogs = auditLogs.filter(log => {
    if (logFilter === 'All') return true;
    if (logFilter === 'mTLS' && log.event.includes('Handshake')) return true;
    if (logFilter === 'Key Rotation' && log.event.includes('Rotation')) return true;
    if (logFilter === 'Validation' && (log.event.includes('Validation') || log.event.includes('Sync'))) return true;
    return false;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-wide flex items-center gap-2">
            <Lock className="w-6 h-6 text-[#00ff66]" />
            Dual-Tier Cryptography & PKI Engine
          </h2>
          <p className="text-gray-400 mt-1">Akamai & goCrypto for Global Trust | Let's Encrypt & PKI for Local Infrastructure</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00ff66]/10 border border-[#00ff66]/30 text-[#00ff66]">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">AES-256-GCM Enforced</span>
          </div>
          <button className="px-4 py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-gray-950 text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sync Certificates
          </button>
        </div>
      </div>

      {/* Detail Tabs */}
      <div className="glass-panel rounded-xl border border-gray-800/60 overflow-hidden">
        <div className="flex border-b border-gray-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'global', label: 'Global Traffic (Akamai)', icon: Globe, color: '#00ff66' },
            { id: 'local', label: 'Local (Let\'s Encrypt)', icon: Shield, color: '#00f0ff' },
            { id: 'topology', label: 'Trust Topology Map', icon: Waypoints, color: '#a855f7' },
            { id: 'sla', label: 'SLA Security Dashboard', icon: Activity, color: '#f59e0b' },
            { id: 'logs', label: 'Audit Logs', icon: History, color: '#64748b' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex-1 px-4 py-4 text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2 whitespace-nowrap",
                activeTab === tab.id 
                  ? "text-white bg-gray-800/30" 
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/10"
              )}
              style={{ borderColor: activeTab === tab.id ? tab.color : 'transparent' }}
            >
              <tab.icon className="w-4 h-4" style={{ color: activeTab === tab.id ? tab.color : '' }} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'global' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-panel p-5 rounded-xl border border-gray-800/60 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00ff66] to-[#00aa44] opacity-5 rounded-full blur-3xl" />
                  <p className="text-sm text-gray-400 font-medium">Global Trust Tunnels</p>
                  <h3 className="text-2xl font-bold text-white mt-1 font-mono tracking-tight">3,492</h3>
                  <span className="text-[#00ff66] text-xs font-mono mt-2 block">goCrypto / Akamai</span>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-gray-800/60 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00ff66] to-[#00aa44] opacity-5 rounded-full blur-3xl" />
                  <p className="text-sm text-gray-400 font-medium">Crypto Throughput</p>
                  <h3 className="text-2xl font-bold text-white mt-1 font-mono tracking-tight">185 Gbps</h3>
                  <span className="text-[#00ff66] text-xs font-mono mt-2 block">AES-256-GCM Global Avg</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-white font-medium">Global Provider & Edge Trust</h4>
                  <p className="text-sm text-gray-400 mt-1">Utilizing goCrypto and Akamai Certificates to build trust and route traffic seamlessly with international providers.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Target Domain / Provider</th>
                      <th className="px-4 py-3">Crypto Engine</th>
                      <th className="px-4 py-3">Purpose</th>
                      <th className="px-4 py-3">Expires In</th>
                      <th className="px-4 py-3 rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {globalCerts.map((cert) => (
                      <tr key={cert.id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-gray-200">{cert.domain}</td>
                        <td className="px-4 py-3 text-[#00ff66]">{cert.provider} <span className="text-gray-500">|</span> {cert.type}</td>
                        <td className="px-4 py-3 text-gray-300">{cert.purpose}</td>
                        <td className="px-4 py-3 font-mono text-gray-300 flex items-center gap-2">
                          <Clock className="w-3 h-3 text-gray-500" />
                          {cert.expires}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium border",
                            cert.status === 'Active' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          )}>
                            {cert.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'local' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="glass-panel p-5 rounded-xl border border-gray-800/60 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00f0ff] to-[#0088ff] opacity-5 rounded-full blur-3xl" />
                  <p className="text-sm text-gray-400 font-medium">Local PKI / ACME</p>
                  <h3 className="text-2xl font-bold text-white mt-1 font-mono tracking-tight">845</h3>
                  <span className="text-[#00f0ff] text-xs font-mono mt-2 block">Let's Encrypt Auto-Renew</span>
                </div>
                <div className="glass-panel p-5 rounded-xl border border-gray-800/60 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00f0ff] to-[#0088ff] opacity-5 rounded-full blur-3xl" />
                  <p className="text-sm text-gray-400 font-medium">Local Identity & Remote</p>
                  <h3 className="text-2xl font-bold text-white mt-1 font-mono tracking-tight">Secured</h3>
                  <span className="text-[#00f0ff] text-xs font-mono mt-2 block">mTLS Enforced</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-white font-medium">Local Infrastructure & User Trust</h4>
                  <p className="text-sm text-gray-400 mt-1">Let's Encrypt and Internal PKI securing local network peering, user identity, remote access, and local services.</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-900/50">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">Internal Domain</th>
                      <th className="px-4 py-3">Certificate Source</th>
                      <th className="px-4 py-3">Operation / Purpose</th>
                      <th className="px-4 py-3">Expires In</th>
                      <th className="px-4 py-3 rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {localCerts.map((cert) => (
                      <tr key={cert.id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-gray-200">{cert.domain}</td>
                        <td className="px-4 py-3 text-[#00f0ff]">{cert.provider} <span className="text-gray-500">|</span> {cert.type}</td>
                        <td className="px-4 py-3 text-gray-300">{cert.purpose}</td>
                        <td className="px-4 py-3 font-mono text-gray-300 flex items-center gap-2">
                          <Clock className="w-3 h-3 text-gray-500" />
                          {cert.expires}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium border",
                            cert.status === 'Active' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          )}>
                            {cert.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'topology' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h4 className="text-white font-medium">Trust Path Topology</h4>
                  <p className="text-sm text-gray-400 mt-1">Visualizing the cryptographic chain of trust from external providers to internal core services.</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-900/50 rounded-xl border border-gray-800/80 p-8 flex flex-col md:flex-row items-center justify-between relative min-h-[400px]">
                {/* Background Connecting Lines */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block">
                  <svg className="w-full h-full text-gray-800" preserveAspectRatio="none">
                    <path d="M 150 200 C 300 200, 300 100, 450 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M 150 200 C 300 200, 300 300, 450 300" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M 450 100 C 600 100, 600 200, 750 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M 450 300 C 600 300, 600 200, 750 200" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>

                {/* Left - External/Peers */}
                <div className="z-10 flex flex-col gap-6">
                  <div className="glass-panel p-4 rounded-lg border border-[#00ff66]/40 bg-[#00ff66]/5 flex flex-col items-center w-40 text-center">
                    <Globe className="w-8 h-8 text-[#00ff66] mb-2" />
                    <h5 className="font-semibold text-white text-sm">Remote Peers</h5>
                    <p className="text-[10px] text-gray-400 mt-1">Akamai / goCrypto TLS</p>
                  </div>
                  <div className="glass-panel p-4 rounded-lg border border-[#00f0ff]/40 bg-[#00f0ff]/5 flex flex-col items-center w-40 text-center">
                    <Users className="w-8 h-8 text-[#00f0ff] mb-2" />
                    <h5 className="font-semibold text-white text-sm">Local Users (VPN)</h5>
                    <p className="text-[10px] text-gray-400 mt-1">Let's Encrypt ACME</p>
                  </div>
                </div>

                {/* Middle - CA Mesh */}
                <div className="z-10 flex flex-col items-center">
                  <div className="glass-panel p-5 rounded-xl border border-purple-500/50 bg-purple-500/10 flex flex-col items-center w-56 text-center relative shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                    <div className="absolute -top-3 -right-3 bg-green-500 text-gray-950 text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-gray-900 animate-pulse">
                      Active
                    </div>
                    <Shield className="w-10 h-10 text-purple-400 mb-3" />
                    <h5 className="font-bold text-white text-md">Certificate Authority</h5>
                    <p className="text-xs text-purple-300 mt-1 mb-3">Internal Root & Intermediate</p>
                    <div className="flex gap-2 w-full">
                      <div className="flex-1 bg-gray-900/80 p-2 rounded text-[10px] text-gray-400 border border-gray-700">HSM Backed</div>
                      <div className="flex-1 bg-gray-900/80 p-2 rounded text-[10px] text-gray-400 border border-gray-700">Auto Renew</div>
                    </div>
                  </div>
                </div>

                {/* Right - Internal Services */}
                <div className="z-10 flex flex-col gap-6">
                  <div className="glass-panel p-4 rounded-lg border border-orange-400/40 bg-orange-400/5 flex flex-col items-center w-40 text-center">
                    <Server className="w-8 h-8 text-orange-400 mb-2" />
                    <h5 className="font-semibold text-white text-sm">FTN Core API</h5>
                    <p className="text-[10px] text-gray-400 mt-1">mTLS Required</p>
                  </div>
                  <div className="glass-panel p-4 rounded-lg border border-orange-400/40 bg-orange-400/5 flex flex-col items-center w-40 text-center">
                    <Network className="w-8 h-8 text-orange-400 mb-2" />
                    <h5 className="font-semibold text-white text-sm">Internal BGP Peers</h5>
                    <p className="text-[10px] text-gray-400 mt-1">mTLS Required</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sla' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="text-white font-medium">SLA Security & Node Health</h4>
                  <p className="text-sm text-gray-400 mt-1">Real-time PKI infrastructure status and connection compliance.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Metric Circular Charts */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="glass-panel p-6 rounded-xl border border-gray-800/60 flex items-center justify-between">
                    <div>
                      <h5 className="text-gray-400 text-sm font-medium">Active mTLS Connections</h5>
                      <h2 className="text-3xl font-mono text-white mt-2">99.8%</h2>
                      <p className="text-xs text-[#00ff66] mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Within SLA (99.9%)</p>
                    </div>
                    <div className="w-20 h-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[{value: 99.8}, {value: 0.2}]} innerRadius={25} outerRadius={35} dataKey="value" stroke="none">
                            <Cell fill="#00ff66" />
                            <Cell fill="#374151" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-xl border border-gray-800/60 flex items-center justify-between">
                    <div>
                      <h5 className="text-gray-400 text-sm font-medium">Certificate Validity Score</h5>
                      <h2 className="text-3xl font-mono text-white mt-2">100%</h2>
                      <p className="text-xs text-[#00f0ff] mt-1">0 Expired Certificates</p>
                    </div>
                    <div className="w-20 h-20">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={[{value: 100}]} innerRadius={25} outerRadius={35} dataKey="value" stroke="none">
                            <Cell fill="#00f0ff" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Node Health Grid */}
                <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-gray-800/60">
                  <h5 className="text-white font-medium mb-4 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-gray-400" />
                    PKI Infrastructure Nodes
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {pkiNodes.map(node => (
                      <div key={node.id} className={`p-4 rounded-lg border ${node.status === 'Online' ? 'border-gray-700 bg-gray-800/30' : 'border-orange-500/40 bg-orange-500/10'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-xs text-gray-400 font-mono block mb-1">{node.role}</span>
                            <h6 className="text-white font-medium text-sm">{node.id}</h6>
                          </div>
                          <span className={cn("text-[10px] px-2 py-0.5 rounded-full border", 
                            node.status === 'Online' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          )}>
                            {node.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700/50">
                          <div className="text-xs text-gray-400">
                            Location: <span className="text-gray-300">{node.location}</span>
                          </div>
                          <div className="flex gap-4">
                            <div className="text-xs text-gray-400">
                              Lat: <span className={node.latency.includes('142') ? 'text-orange-400' : 'text-gray-300'}>{node.latency}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              Load: <span className={node.load.includes('89') ? 'text-orange-400' : 'text-gray-300'}>{node.load}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h4 className="text-white font-medium">Security Compliance & Audit Logs</h4>
                  <p className="text-sm text-gray-400 mt-1">Tracking cryptographic operations, key rotations, and mTLS handshakes.</p>
                </div>
                <div className="flex gap-2">
                  {['All', 'mTLS', 'Key Rotation', 'Validation'].map(filter => (
                    <button
                      key={filter}
                      onClick={() => setLogFilter(filter as any)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                        logFilter === filter 
                          ? "bg-gray-700 text-white border-gray-600" 
                          : "bg-transparent text-gray-400 border-gray-800 hover:bg-gray-800/50"
                      )}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-900 border-b border-gray-800">
                    <tr>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Event Type</th>
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3">Target</th>
                      <th className="px-4 py-3">Details</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-800/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-gray-400 text-xs">{log.time}</td>
                        <td className="px-4 py-3 text-gray-300 font-medium">
                          {log.event.includes('Handshake') && <Lock className="w-3 h-3 inline mr-1 text-[#00f0ff]" />}
                          {log.event.includes('Rotation') && <RefreshCw className="w-3 h-3 inline mr-1 text-purple-400" />}
                          {log.event.includes('Validation') && <Shield className="w-3 h-3 inline mr-1 text-[#00ff66]" />}
                          {log.event}
                        </td>
                        <td className="px-4 py-3 font-mono text-gray-400 text-xs">{log.source}</td>
                        <td className="px-4 py-3 font-mono text-gray-400 text-xs">{log.target}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs truncate max-w-[200px]">{log.detail}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-2 py-1 rounded text-[10px] font-medium border uppercase tracking-wider",
                            log.status === 'Success' ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                            log.status === 'Warning' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                            "bg-red-500/10 text-red-400 border-red-500/20"
                          )}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
