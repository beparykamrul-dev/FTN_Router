import React, { useState } from 'react';
import { Wrench, HardDrive, DownloadCloud, UploadCloud, CheckCircle2, AlertTriangle, RotateCcw, Cpu, Server, Activity, Search, Settings2, ShieldAlert } from 'lucide-react';
import { cn } from '../utils';

const mockDevices = [
  { id: 'RTR-CORE-01', type: 'Core Router', vendor: 'MikroTik', model: 'CCR2216', currentDriver: 'v7.11.2', latestDriver: 'v7.12.1', status: 'Update Available', lastUpdated: '2025-11-10' },
  { id: 'OLT-ZONE-A', type: 'OLT', vendor: 'Huawei', model: 'MA5800-X15', currentDriver: 'V100R019C10', latestDriver: 'V100R019C10', status: 'Up to Date', lastUpdated: '2026-02-15' },
  { id: 'SW-DIST-04', type: 'Switch', vendor: 'Cisco', model: 'Nexus 9300', currentDriver: 'NX-OS 9.3(8)', latestDriver: 'NX-OS 9.3(10)', status: 'Critical Update', lastUpdated: '2024-08-05' },
  { id: 'WLC-CTRL-01', type: 'Controller', vendor: 'Ubiquiti', model: 'UDM-Pro', currentDriver: '3.1.16', latestDriver: '3.2.7', status: 'Update Available', lastUpdated: '2025-12-01' },
  { id: 'BGP-EDGE-02', type: 'Edge Router', vendor: 'Juniper', model: 'MX204', currentDriver: 'Junos 21.4R3', latestDriver: 'Junos 21.4R3', status: 'Up to Date', lastUpdated: '2026-05-20' },
];

const driverLibrary = [
  { file: 'routeros-v7.12.1-arm64.npk', size: '14.2 MB', vendor: 'MikroTik', releaseDate: '2026-08-01', type: 'Stable' },
  { file: 'nxos.9.3.10.bin', size: '1.2 GB', vendor: 'Cisco', releaseDate: '2026-07-15', type: 'Security Patch' },
  { file: 'MA5800V100R020C00.bin', size: '450 MB', vendor: 'Huawei', releaseDate: '2026-06-10', type: 'Major Release' },
];

export function DeviceDriverManager() {
  const [searchTerm, setSearchTerm] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdate = (id: string) => {
    setUpdatingId(id);
    setTimeout(() => {
      setUpdatingId(null);
      window.dispatchEvent(new CustomEvent('add-toast', {
        detail: {
          type: 'success',
          title: 'Driver Updated',
          message: `Device ${id} firmware updated successfully. Device is rebooting.`,
        }
      }));
    }, 3000);
  };

  const handleRollback = (id: string) => {
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'info',
        title: 'Rollback Initiated',
        message: `Restoring previous driver image for ${id}...`,
      }
    }));
  };

  const filteredDevices = mockDevices.filter(d => 
    d.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-wide flex items-center gap-2">
            <Wrench className="w-6 h-6 text-[#00f0ff]" />
            Universal Device Driver Manager
          </h2>
          <p className="text-gray-400 mt-1">Centralized firmware and driver orchestration for ALL network hardware</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 border border-gray-700">
            <DownloadCloud className="w-4 h-4" />
            Download Diagnostics
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 border border-gray-700">
            <UploadCloud className="w-4 h-4" />
            Upload Custom Driver
          </button>
          <button className="px-4 py-2 bg-[#00f0ff] hover:bg-[#00f0ff]/90 text-gray-950 text-sm font-bold rounded-lg transition-all flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Sync Vendor Repos
          </button>
        </div>
      </div>

      {/* D3 Health Visualization Placeholder */}
      <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-400" />
          Driver Stability Metrics (D3 Visualization)
        </h3>
        <div id="driver-stability-d3" className="w-full h-48 bg-gray-950 rounded-lg border border-gray-800 flex items-center justify-center text-gray-600 text-sm italic">
          D3 Health Status Visualization Rendering...
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-gray-800/60 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30 text-blue-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Devices</p>
            <h3 className="text-2xl font-bold text-white font-mono">{mockDevices.length}</h3>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border border-gray-800/60 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30 text-[#00ff66]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Up to Date</p>
            <h3 className="text-2xl font-bold text-white font-mono">{mockDevices.filter(d => d.status === 'Up to Date').length}</h3>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border border-gray-800/60 flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30 text-yellow-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Updates Available</p>
            <h3 className="text-2xl font-bold text-white font-mono">{mockDevices.filter(d => d.status === 'Update Available').length}</h3>
          </div>
        </div>
        <div className="glass-panel p-5 rounded-xl border border-gray-800/60 flex items-center gap-4">
          <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/30 text-red-500">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Critical Updates</p>
            <h3 className="text-2xl font-bold text-white font-mono">{mockDevices.filter(d => d.status === 'Critical Update').length}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Driver List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-medium flex items-center gap-2">
                <Cpu className="w-4 h-4 text-gray-400" />
                Hardware Fleet Status
              </h3>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search devices or vendors..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#00f0ff] transition-colors w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-400 uppercase bg-gray-900/50 border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-3">Device / Type</th>
                    <th className="px-4 py-3">Vendor</th>
                    <th className="px-4 py-3">Current Driver</th>
                    <th className="px-4 py-3">Target Version</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredDevices.map(device => (
                    <tr key={device.id} className="hover:bg-gray-800/30 transition-colors">
                      <td className="px-4 py-4">
                        <div className="font-mono text-gray-200">{device.id}</div>
                        <div className="text-xs text-gray-500">{device.type} ({device.model})</div>
                      </td>
                      <td className="px-4 py-4 text-gray-400">{device.vendor}</td>
                      <td className="px-4 py-4 font-mono text-gray-300 text-xs">{device.currentDriver}</td>
                      <td className="px-4 py-4 font-mono text-gray-400 text-xs">{device.latestDriver}</td>
                      <td className="px-4 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-medium border uppercase tracking-wider whitespace-nowrap",
                          device.status === 'Up to Date' ? "bg-green-500/10 text-green-400 border-green-500/20" : 
                          device.status === 'Critical Update' ? "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse" :
                          "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        )}>
                          {device.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        {device.status !== 'Up to Date' ? (
                          <button 
                            onClick={() => handleUpdate(device.id)}
                            disabled={updatingId === device.id}
                            className="px-3 py-1.5 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 rounded text-xs transition-colors flex items-center justify-center gap-1 w-full max-w-[100px] ml-auto"
                          >
                            {updatingId === device.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <DownloadCloud className="w-3 h-3" />}
                            {updatingId === device.id ? 'Pushing...' : 'Update'}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRollback(device.id)}
                            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 border border-gray-700 rounded text-xs transition-colors flex items-center justify-center gap-1 w-full max-w-[100px] ml-auto"
                          >
                            <RotateCcw className="w-3 h-3" /> Rollback
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              Device Driver Audit & Vulnerability Scan
            </h3>
            <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
               <div className="flex items-center justify-between mb-2">
                 <span className="text-sm text-gray-300">Scan Status:</span>
                 <span className="text-sm text-[#00ff66]">Vulnerability Database Updated</span>
               </div>
               <div className="w-full bg-gray-800 rounded-full h-2">
                  <div className="bg-[#00f0ff] h-2 rounded-full w-[100%]"></div>
               </div>
               <p className="text-xs text-gray-500 mt-2">Audit complete. No deprecated drivers detected.</p>
            </div>
          </div>
        </div>

        {/* Central Driver Library */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-[#00ff66]" />
              Driver & Firmware Library
            </h3>
            <p className="text-xs text-gray-400 mb-4">Centrally managed binaries ready for deployment.</p>
            
            <div className="space-y-3">
              {driverLibrary.map((file, i) => (
                <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-800 flex justify-between items-start group">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono text-[#00f0ff] truncate" title={file.file}>{file.file}</p>
                    <div className="flex gap-2 mt-1 text-[10px] text-gray-500">
                      <span>{file.vendor}</span>
                      <span>•</span>
                      <span>{file.size}</span>
                    </div>
                  </div>
                  <span className="text-[10px] bg-gray-800 px-2 py-0.5 rounded text-gray-400 border border-gray-700 ml-2 whitespace-nowrap">
                    {file.type}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-2 border border-dashed border-gray-600 rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-400 hover:bg-gray-800/50 transition-colors flex items-center justify-center gap-2">
              <UploadCloud className="w-4 h-4" /> Add Driver Package
            </button>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-purple-400" />
              Automated Policy
            </h3>
            <div className="space-y-4">
              <label className="block text-xs text-gray-400">Update Policy</label>
              <select className="w-full bg-gray-900 border border-gray-700 text-white text-sm rounded-lg p-2.5">
                <option>Staged Rollout</option>
                <option>Emergency Patch</option>
                <option>Manual Approval</option>
              </select>
              <button className="w-full py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-lg text-sm transition-colors">
                Apply Global Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
