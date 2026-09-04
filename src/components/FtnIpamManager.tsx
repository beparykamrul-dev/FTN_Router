import React, { useState } from 'react';
import { 
  Network, 
  Server, 
  Globe, 
  Cpu, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Layers, 
  Zap, 
  Sliders, 
  Activity, 
  Check, 
  Copy, 
  ShieldCheck,
  Calculator,
  RefreshCw
} from 'lucide-react';
import { INITIAL_IP_POOLS, INITIAL_IPAM_STATS } from '../data/ipamData';
import { IpSubnetPool, IpVersion, SubnetType } from '../types/ipam';

export function FtnIpamManager() {
  const [pools, setPools] = useState<IpSubnetPool[]>(INITIAL_IP_POOLS);
  const [selectedPool, setSelectedPool] = useState<IpSubnetPool | null>(INITIAL_IP_POOLS[0]);
  const [ipVersionFilter, setIpVersionFilter] = useState<'all' | 'ipv4' | 'ipv6'>('all');
  const [subnetTypeFilter, setSubnetTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Subnet Calculator modal state
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [calcInputCidr, setCalcInputCidr] = useState<string>('103.145.15.0/24');
  const [calcResult, setCalcResult] = useState<any>(null);

  // Allocate new subnet state
  const [showAllocateModal, setShowAllocateModal] = useState<boolean>(false);
  const [newSubnetName, setNewSubnetName] = useState<string>('');
  const [newSubnetCidr, setNewSubnetCidr] = useState<string>('');
  const [newSubnetType, setNewSubnetType] = useState<SubnetType>('pppoe_pool');
  const [newVlanId, setNewVlanId] = useState<number>(105);
  const [newDeviceName, setNewDeviceName] = useState<string>('Huawei MA5608T (Dhanmondi Core)');
  const [newDeviceType, setNewDeviceType] = useState<'OLT' | 'Core Router'>('OLT');
  const [newPort, setNewPort] = useState<string>('GPON 0/1/4');

  const filteredPools = pools.filter(pool => {
    const matchesVersion = ipVersionFilter === 'all' || pool.ipVersion === ipVersionFilter;
    const matchesType = subnetTypeFilter === 'all' || pool.subnetType === subnetTypeFilter;
    const matchesSearch = 
      pool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.cidr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.binding.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.binding.interfaceOrPonPort.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesVersion && matchesType && matchesSearch;
  });

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const calculateCidr = (cidr: string) => {
    const parts = cidr.trim().split('/');
    if (parts.length !== 2) return null;
    const ip = parts[0];
    const prefix = parseInt(parts[1], 10);
    if (isNaN(prefix) || prefix < 0 || prefix > 32) return null;

    const totalHosts = Math.pow(2, 32 - prefix);
    const usableHosts = prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);

    return {
      cidr,
      prefix,
      ip,
      totalHosts,
      usableHosts,
      subnetMask: prefix === 24 ? '255.255.255.0' : prefix === 25 ? '255.255.255.128' : prefix === 22 ? '255.255.252.0' : '255.255.0.0',
      wildcardMask: prefix === 24 ? '0.0.0.255' : '0.0.0.127',
      networkAddress: ip,
      broadcastAddress: ip.replace(/\.\d+$/, '.255'),
    };
  };

  const handleRunCalculator = () => {
    const res = calculateCidr(calcInputCidr);
    setCalcResult(res);
  };

  const handleCreateSubnet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubnetName || !newSubnetCidr) return;

    const prefix = parseInt(newSubnetCidr.split('/')[1] || '24', 10);
    const total = Math.pow(2, 32 - prefix);

    const newPool: IpSubnetPool = {
      id: `pool-${Date.now()}`,
      name: newSubnetName,
      cidr: newSubnetCidr,
      ipVersion: newSubnetCidr.includes(':') ? 'ipv6' : 'ipv4',
      subnetType: newSubnetType,
      gateway: newSubnetCidr.split('/')[0].replace(/\.0$/, '.1'),
      networkAddress: newSubnetCidr.split('/')[0],
      subnetMask: '255.255.255.0',
      prefixLength: prefix,
      totalAddresses: total,
      usedAddresses: 1,
      reservedAddresses: 4,
      freeAddresses: total - 5,
      utilizationPct: 2.0,
      vlanId: newVlanId,
      binding: {
        deviceType: newDeviceType,
        deviceName: newDeviceName,
        managementIp: '10.100.2.11',
        vendor: 'Huawei',
        interfaceOrPonPort: newPort,
        vlanId: newVlanId,
      },
      status: 'active',
      dnsServers: ['103.145.12.1', '1.1.1.1'],
      dhcpEnabled: true,
      allocations: [],
    };

    setPools([newPool, ...pools]);
    setSelectedPool(newPool);
    setShowAllocateModal(false);
    setNewSubnetName('');
    setNewSubnetCidr('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Executive Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-900/90 to-[#071322] border border-gray-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f0ff]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-mono">
              <Network className="w-3.5 h-3.5" />
              <span>FTN IPAM CORE • ROUTER & OLT PON INTEGRATION</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
              IP Address Management & Subnet Allocation (IPAM)
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Coordinates public IPv4 blocks, RFC 6598 CGNAT pools, and IPv6 /48 Prefix Delegations with direct bindings to MikroTik Core Routers and Huawei/ZTE GPON OLT ports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setShowCalculator(true);
                handleRunCalculator();
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-800/80 hover:bg-gray-800 border border-gray-700 text-gray-200 text-xs font-medium transition-all shadow-sm"
            >
              <Calculator className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>CIDR Calculator</span>
            </button>
            <button
              onClick={() => setShowAllocateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00f0ff] hover:brightness-110 text-gray-950 font-bold text-xs transition-all shadow-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Allocate Subnet Pool</span>
            </button>
          </div>
        </div>

        {/* Global IPAM Stats Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-800/60">
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">PUBLIC IPV4 ALLOCATED</div>
            <div className="text-xl font-display font-bold text-white mt-0.5 flex items-center gap-2">
              <span>103.145.12.0/22</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">APNIC</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">ACTIVE SUBNET POOLS</div>
            <div className="text-xl font-display font-bold text-[#00f0ff] mt-0.5 flex items-center gap-2">
              <span>{pools.length}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-[#00f0ff]/10 text-[#00f0ff] font-mono">Managed</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">IPV4 UTILIZATION</div>
            <div className="text-xl font-display font-bold text-emerald-400 mt-0.5 flex items-center gap-2">
              <span>{INITIAL_IPAM_STATS.ipv4UtilizationPct}%</span>
              <span className="text-xs text-gray-400 font-normal">Optimal</span>
            </div>
          </div>
          <div className="bg-gray-950/40 rounded-xl p-3.5 border border-gray-800/40">
            <div className="text-[11px] text-gray-400 font-mono">ROUTER & OLT BINDINGS</div>
            <div className="text-xl font-display font-bold text-white mt-0.5">
              5 Hardware Devices
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 font-mono flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> PROTOCOL:
          </span>
          {(['all', 'ipv4', 'ipv6'] as const).map((ver) => (
            <button
              key={ver}
              onClick={() => setIpVersionFilter(ver)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                ipVersionFilter === ver
                  ? 'bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/40'
                  : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {ver.toUpperCase()}
            </button>
          ))}
          <span className="text-xs text-gray-500 font-mono ml-2">TYPE:</span>
          {['all', 'pppoe_pool', 'public_server', 'nat_cgnat', 'infra_mgmt', 'olt_pon'].map((t) => (
            <button
              key={t}
              onClick={() => setSubnetTypeFilter(t)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                subnetTypeFilter === t
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                  : 'bg-gray-900/80 text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {t === 'all' ? 'All Types' : t.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search CIDR, OLT port, device..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-900 border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00f0ff]"
          />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Subnet Pools List */}
        <div className="lg:col-span-6 space-y-3">
          {filteredPools.map((pool) => {
            const isSelected = selectedPool?.id === pool.id;
            return (
              <div
                key={pool.id}
                onClick={() => setSelectedPool(pool)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all relative ${
                  isSelected
                    ? 'bg-gray-900/90 border-[#00f0ff]/60 shadow-[0_0_20px_rgba(0,240,255,0.12)] ring-1 ring-[#00f0ff]/30'
                    : 'bg-gray-900/40 hover:bg-gray-900/70 border-gray-800/80 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                        {pool.ipVersion.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        VLAN {pool.vlanId}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {pool.subnetType.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <h3 className="text-base font-mono font-bold text-white leading-snug">
                      {pool.cidr}
                    </h3>
                    <div className="text-xs text-gray-300 font-sans">{pool.name}</div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-[#00f0ff]">
                      {pool.utilizationPct}%
                    </span>
                    <span className="text-[10px] text-gray-500 block font-mono">UTILIZED</span>
                  </div>
                </div>

                {/* Utilization Progress Bar */}
                <div className="mt-3 space-y-1">
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        pool.utilizationPct > 85 ? 'bg-amber-400' : 'bg-gradient-to-r from-[#00ff66] to-[#00f0ff]'
                      }`}
                      style={{ width: `${Math.min(100, pool.utilizationPct)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-0.5">
                    <span>Used: {pool.usedAddresses} / {pool.totalAddresses}</span>
                    <span>Free: {pool.freeAddresses}</span>
                  </div>
                </div>

                {/* Hardware Binding */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-800/50 text-[11px] font-mono text-gray-400">
                  <span className="text-gray-500">Hardware Integration:</span>
                  <span className="text-emerald-400">
                    {pool.binding.deviceName} • {pool.binding.interfaceOrPonPort}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Subnet Deep Inspector & Allocations */}
        <div className="lg:col-span-6 space-y-4">
          {selectedPool ? (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6 shadow-2xl">
              {/* Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono">
                      VLAN {selectedPool.vlanId}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                      STATUS: ACTIVE
                    </span>
                  </div>
                  <h2 className="text-xl font-mono font-bold text-white mt-1">
                    {selectedPool.cidr}
                  </h2>
                  <div className="text-xs text-gray-400">{selectedPool.name}</div>
                </div>
                <button
                  onClick={() => handleCopy(selectedPool.cidr)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-mono border border-gray-700"
                >
                  {copiedText === selectedPool.cidr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy CIDR</span>
                </button>
              </div>

              {/* Technical IP Parameters */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                  <span className="text-gray-500 text-[10px] block">GATEWAY</span>
                  <span className="text-white font-semibold">{selectedPool.gateway}</span>
                </div>
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                  <span className="text-gray-500 text-[10px] block">NETMASK</span>
                  <span className="text-gray-300">{selectedPool.subnetMask}</span>
                </div>
                <div className="bg-gray-950 p-3 rounded-xl border border-gray-800">
                  <span className="text-gray-500 text-[10px] block">TOTAL CAPACITY</span>
                  <span className="text-[#00f0ff] font-bold">{selectedPool.totalAddresses} IPs</span>
                </div>
              </div>

              {/* OLT / Router Binding Card */}
              <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2 text-xs font-mono">
                <div className="text-gray-400 font-semibold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>HARDWARE CHASSIS & PORT BINDING</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-gray-300 pt-1">
                  <div><span className="text-gray-500">Device:</span> {selectedPool.binding.deviceName}</div>
                  <div><span className="text-gray-500">Vendor:</span> {selectedPool.binding.vendor}</div>
                  <div><span className="text-gray-500">Interface/PON:</span> <span className="text-[#00f0ff]">{selectedPool.binding.interfaceOrPonPort}</span></div>
                  <div><span className="text-gray-500">Mgmt IP:</span> {selectedPool.binding.managementIp}</div>
                  <div className="col-span-2"><span className="text-gray-500">PPPoE Profile:</span> {selectedPool.pppoeProfile || 'Standard Profile'}</div>
                </div>
              </div>

              {/* Active Lease Allocations Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#00f0ff]" />
                    <span>Active Allocations & Leases ({selectedPool.allocations.length})</span>
                  </span>
                </div>

                {selectedPool.allocations.length > 0 ? (
                  <div className="space-y-2 font-mono text-xs">
                    {selectedPool.allocations.map((alloc) => (
                      <div key={alloc.id} className="bg-gray-950 p-3 rounded-xl border border-gray-800 flex items-center justify-between">
                        <div>
                          <div className="text-[#00f0ff] font-bold">{alloc.ipAddress}</div>
                          <div className="text-[11px] text-gray-400 font-sans">{alloc.assignedTo}</div>
                          {alloc.onuSerial && (
                            <div className="text-[10px] text-gray-500">ONU: {alloc.onuSerial} • MAC: {alloc.macAddress}</div>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded bg-gray-800 text-[10px] text-gray-300">
                            {alloc.leaseType.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-emerald-400 block mt-0.5">ACTIVE</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800 text-center text-xs font-mono text-gray-500">
                    No individual static host overrides configured. Pool managed dynamically via PPPoE/Radius.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-800 rounded-2xl text-gray-500">
              <Network className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-xs font-mono">Select an IP pool to view hardware bindings, gateway settings, and active subscriber allocations.</p>
            </div>
          )}
        </div>
      </div>

      {/* Subnet Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#00f0ff]" />
                <span>Subnet CIDR Calculator</span>
              </h3>
              <button onClick={() => setShowCalculator(false)} className="text-gray-500 hover:text-gray-300 text-sm">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-gray-400 mb-1">ENTER IP / CIDR</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={calcInputCidr}
                    onChange={(e) => setCalcInputCidr(e.target.value)}
                    placeholder="103.145.15.0/24"
                    className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                  <button
                    onClick={handleRunCalculator}
                    className="px-4 py-2 rounded-xl bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-gray-950 font-bold text-xs"
                  >
                    Calculate
                  </button>
                </div>
              </div>

              {calcResult && (
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-2 text-gray-300">
                    <div><span className="text-gray-500">Network Address:</span> {calcResult.networkAddress}</div>
                    <div><span className="text-gray-500">Broadcast:</span> {calcResult.broadcastAddress}</div>
                    <div><span className="text-gray-500">Subnet Mask:</span> {calcResult.subnetMask}</div>
                    <div><span className="text-gray-500">Prefix:</span> /{calcResult.prefix}</div>
                    <div><span className="text-gray-500">Total Hosts:</span> <span className="text-white font-bold">{calcResult.totalHosts}</span></div>
                    <div><span className="text-gray-500">Usable Hosts:</span> <span className="text-[#00f0ff] font-bold">{calcResult.usableHosts}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Allocate Subnet Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateSubnet} className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#00ff66]" />
                <span>Allocate New Subnet Pool</span>
              </h3>
              <button type="button" onClick={() => setShowAllocateModal(false)} className="text-gray-500 hover:text-gray-300 text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-gray-400 mb-1">SUBNET NAME & REGION</label>
                <input
                  type="text"
                  required
                  value={newSubnetName}
                  onChange={(e) => setNewSubnetName(e.target.value)}
                  placeholder="e.g. Uttara Sector-11 FTTH Cluster"
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">CIDR PREFIX</label>
                <input
                  type="text"
                  required
                  value={newSubnetCidr}
                  onChange={(e) => setNewSubnetCidr(e.target.value)}
                  placeholder="103.145.15.0/24"
                  className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">SUBNET TYPE</label>
                  <select
                    value={newSubnetType}
                    onChange={(e) => setNewSubnetType(e.target.value as any)}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                  >
                    <option value="pppoe_pool">PPPoE Pool</option>
                    <option value="public_server">Public Server</option>
                    <option value="olt_pon">OLT PON</option>
                    <option value="nat_cgnat">CGNAT</option>
                    <option value="infra_mgmt">Infra Mgmt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">VLAN ID</label>
                  <input
                    type="number"
                    value={newVlanId}
                    onChange={(e) => setNewVlanId(parseInt(e.target.value, 10))}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-400 mb-1">HARDWARE CHASSIS</label>
                  <select
                    value={newDeviceName}
                    onChange={(e) => setNewDeviceName(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                  >
                    <option value="Huawei MA5608T (Dhanmondi Core)">Huawei MA5608T</option>
                    <option value="ZTE C320 (Mirpur-10 PoP)">ZTE C320</option>
                    <option value="MikroTik CCR2004-16G-2S+">MikroTik CCR2004</option>
                    <option value="BDCOM GP3600-08">BDCOM GP3600</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">INTERFACE / PON PORT</label>
                  <input
                    type="text"
                    value={newPort}
                    onChange={(e) => setNewPort(e.target.value)}
                    placeholder="GPON 0/1/4"
                    className="w-full bg-gray-950 border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00ff66] to-[#00f0ff] hover:brightness-110 text-gray-950 font-bold text-xs transition-all shadow-lg mt-2"
              >
                Provision Subnet Pool
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
