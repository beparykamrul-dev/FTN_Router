import React, { useState, useEffect } from 'react';
import { Shield, Lock, HardDrive, Clock, CheckCircle2, RefreshCw, UploadCloud, DownloadCloud, AlertTriangle, FileJson, Server, Key } from 'lucide-react';
import { cn } from '../utils';

interface BackupSnapshot {
  id: string;
  timestamp: string;
  size: string;
  type: 'router' | 'olt' | 'full';
  status: 'verified' | 'corrupted' | 'pending';
  encryption: 'AES-256-GCM';
}

const mockBackups: BackupSnapshot[] = [
  { id: 'snap-8x9q', timestamp: '2026-08-28 09:00:00', size: '4.2 MB', type: 'full', status: 'verified', encryption: 'AES-256-GCM' },
  { id: 'snap-1c4z', timestamp: '2026-08-21 09:00:00', size: '4.1 MB', type: 'full', status: 'verified', encryption: 'AES-256-GCM' },
  { id: 'snap-9m2p', timestamp: '2026-08-14 09:00:00', size: '3.9 MB', type: 'full', status: 'verified', encryption: 'AES-256-GCM' },
  { id: 'snap-2f8r', timestamp: '2026-08-07 09:00:00', size: '3.9 MB', type: 'verified', status: 'verified', encryption: 'AES-256-GCM' } as BackupSnapshot, // Cast for safety if type mismatch
];

export function ConfigBackupManager() {
  const [backups, setBackups] = useState<BackupSnapshot[]>(mockBackups);
  const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(true);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleManualBackup = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      const newBackup: BackupSnapshot = {
        id: `snap-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toLocaleString('sv').replace('T', ' '),
        size: '4.3 MB',
        type: 'full',
        status: 'verified',
        encryption: 'AES-256-GCM',
      };
      setBackups([newBackup, ...backups]);
      setIsBackingUp(false);
      
      window.dispatchEvent(new CustomEvent('add-toast', {
        detail: {
          type: 'success',
          title: 'Snapshot Created',
          message: 'Full network state encrypted and stored successfully.',
        }
      }));
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-white tracking-wide flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-[#00f0ff]" />
            Secure Configuration Vault
          </h2>
          <p className="text-gray-400 mt-1">Encrypted Snapshots for Routers & OLT Infrastructure</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleManualBackup}
            disabled={isBackingUp}
            className={cn(
              "px-4 py-2 text-gray-950 text-sm font-bold rounded-lg transition-all flex items-center gap-2",
              isBackingUp ? "bg-[#00f0ff]/50 cursor-not-allowed" : "bg-[#00f0ff] hover:bg-[#00f0ff]/90"
            )}
          >
            {isBackingUp ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
            {isBackingUp ? 'Creating Snapshot...' : 'One-Click Backup'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Settings & Status */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#00ff66]" />
              Automated Scheduling
            </h3>
            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
              <div>
                <p className="text-sm text-gray-200 font-medium">Weekly Full Snapshot</p>
                <p className="text-xs text-gray-400 mt-1">Sundays at 02:00 AM UTC</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={isAutoBackupEnabled} onChange={() => setIsAutoBackupEnabled(!isAutoBackupEnabled)} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00ff66]"></div>
              </label>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Last Auto-Backup</span>
                <span className="text-gray-300">2026-08-28 09:00:00</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Next Scheduled</span>
                <span className="text-gray-300">2026-09-04 02:00:00</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-gray-800/60">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              Vault Security Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
                <Key className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-200">KMS Encryption</p>
                  <p className="text-xs text-gray-400">AES-256-GCM enforced on all blobs</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-800 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-[#00ff66]" />
                <div>
                  <p className="text-sm text-gray-200">Zero-Trust Integrity</p>
                  <p className="text-xs text-gray-400">Checksum verification active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Snapshot History */}
        <div className="md:col-span-2 glass-panel p-6 rounded-xl border border-gray-800/60">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-medium flex items-center gap-2">
              <FileJson className="w-4 h-4 text-gray-400" />
              Snapshot Archive
            </h3>
            <span className="text-xs font-mono text-gray-400 bg-gray-900 px-2 py-1 rounded border border-gray-800">{backups.length} Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-400 uppercase bg-gray-900/50 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3">Snapshot ID</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Size</th>
                  <th className="px-4 py-3">Integrity</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {backups.map(backup => (
                  <tr key={backup.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-4 py-4 font-mono text-[#00f0ff] text-xs">{backup.id}</td>
                    <td className="px-4 py-4 text-gray-300 font-mono text-xs">{backup.timestamp}</td>
                    <td className="px-4 py-4">
                      <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-[10px] uppercase tracking-wider border border-gray-700">
                        {backup.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-400 text-xs">{backup.size}</td>
                    <td className="px-4 py-4">
                      <span className="flex items-center gap-1 text-[#00ff66] text-xs">
                        <CheckCircle2 className="w-3 h-3" /> {backup.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors" title="Download Decrypted">
                        <DownloadCloud className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded transition-colors" title="Restore to Production">
                        <UploadCloud className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
