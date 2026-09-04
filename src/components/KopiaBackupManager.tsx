import React, { useState } from 'react';
import { 
  HardDrive, Shield, Lock, CheckCircle2, RefreshCw, 
  UploadCloud, DownloadCloud, Clock, AlertTriangle, FileJson, 
  Server, Key, Terminal, Database, Sparkles, Folder, Play, Check, Copy, ArrowUpRight
} from 'lucide-react';
import { cn } from '../utils';

export interface KopiaSnapshot {
  id: string;
  sourcePath: string;
  timestamp: string;
  fileCount: number;
  rawSize: string;
  compressedSize: string;
  status: 'VERIFIED' | 'COMPACTED' | 'RUNNING';
  policyRetention: 'HOURLY' | 'DAILY' | 'WEEKLY' | 'PINNED';
  hash: string;
}

const MOCK_SNAPSHOTS: KopiaSnapshot[] = [
  {
    id: 'k-snap-91024',
    sourcePath: '/etc/ftn/core-router (BGP/WireGuard/GoBGP)',
    timestamp: '2026-09-03 09:30:15',
    fileCount: 482,
    rawSize: '1.8 GB',
    compressedSize: '410 MB',
    status: 'VERIFIED',
    policyRetention: 'HOURLY',
    hash: 'k8f9a0c24e1b82736450d9e8'
  },
  {
    id: 'k-snap-91023',
    sourcePath: '/etc/dns/powerdns-unbound (Anycast DNS Zones)',
    timestamp: '2026-09-03 08:00:00',
    fileCount: 1420,
    rawSize: '8.4 GB',
    compressedSize: '2.1 GB',
    status: 'VERIFIED',
    policyRetention: 'HOURLY',
    hash: 'b174ef90342cd561728394a0'
  },
  {
    id: 'k-snap-91022',
    sourcePath: '/var/lib/opensearch/indices (SIEM Cluster Indexes)',
    timestamp: '2026-09-03 00:00:00',
    fileCount: 8910,
    rawSize: '48.2 GB',
    compressedSize: '14.6 GB',
    status: 'VERIFIED',
    policyRetention: 'DAILY',
    hash: 'f93c0192a837461520394857'
  },
  {
    id: 'k-snap-91021',
    sourcePath: '/etc/pki/mtls-certificates (FTN CA & Root Keys)',
    timestamp: '2026-09-02 12:00:00',
    fileCount: 64,
    rawSize: '12 MB',
    compressedSize: '3.8 MB',
    status: 'VERIFIED',
    policyRetention: 'PINNED',
    hash: 'c82736450192837465019283'
  },
  {
    id: 'k-snap-91020',
    sourcePath: '/opt/ftn/billing-accounting-db (PostgreSQL/PgBouncer)',
    timestamp: '2026-09-01 00:00:00',
    fileCount: 2190,
    rawSize: '19.4 GB',
    compressedSize: '5.2 GB',
    status: 'COMPACTED',
    policyRetention: 'WEEKLY',
    hash: 'd01928374650192837465019'
  }
];

export function KopiaBackupManager() {
  const [activeTab, setActiveTab] = useState<'snapshots' | 'repository' | 'policies' | 'cli'>('snapshots');
  const [snapshots, setSnapshots] = useState<KopiaSnapshot[]>(MOCK_SNAPSHOTS);
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [selectedRepoType, setSelectedRepoType] = useState<'s3' | 'b2' | 'local' | 'sftp'>('s3');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);
  const [newSnapshotPath, setNewSnapshotPath] = useState('/etc/ftn/core-router');

  const handleCreateSnapshot = () => {
    setIsCreatingSnapshot(true);
    setTimeout(() => {
      const created: KopiaSnapshot = {
        id: `k-snap-${Math.floor(10000 + Math.random() * 90000)}`,
        sourcePath: newSnapshotPath,
        timestamp: new Date().toLocaleString('sv').replace('T', ' '),
        fileCount: Math.floor(200 + Math.random() * 800),
        rawSize: '2.4 GB',
        compressedSize: '590 MB',
        status: 'VERIFIED',
        policyRetention: 'HOURLY',
        hash: Math.random().toString(36).substring(2, 18)
      };

      setSnapshots([created, ...snapshots]);
      setIsCreatingSnapshot(false);

      window.dispatchEvent(new CustomEvent('add-toast', {
        detail: {
          type: 'success',
          title: 'Kopia Snapshot Created',
          message: `Zero-knowledge encrypted snapshot committed to ${selectedRepoType.toUpperCase()} storage vault.`
        }
      }));
    }, 1800);
  };

  const handleVerifySnapshot = (id: string) => {
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'info',
        title: 'Kopia Integrity Verification',
        message: `Running 100% block checksum validation for snapshot ${id}. All hashes match SHA-256.`
      }
    }));
  };

  const handleRestorePrompt = (snap: KopiaSnapshot) => {
    window.dispatchEvent(new CustomEvent('add-toast', {
      detail: {
        type: 'warning',
        title: 'Snapshot Restore Triggered',
        message: `Restore pipeline initialized for ${snap.sourcePath}. Target: /tmp/restore-${snap.id}`
      }
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(text);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-gray-950 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-display text-white tracking-wide">
                  Kopia Encrypted Backup Vault
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Kopia v0.17+ E2EE
                </span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Zero-knowledge client-side encryption, content-addressable deduplication & fast snapshot sync for FTN Core
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCreateSnapshot}
              disabled={isCreatingSnapshot}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold font-mono flex items-center gap-2 transition-all shadow-md",
                isCreatingSnapshot 
                  ? "bg-emerald-500/50 text-gray-950 cursor-not-allowed" 
                  : "bg-emerald-500 hover:bg-emerald-400 text-gray-950"
              )}
            >
              {isCreatingSnapshot ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {isCreatingSnapshot ? 'Deduplicating & Encrypting...' : 'Take Snapshot Now'}
            </button>
          </div>
        </div>

        {/* Vault Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-gray-800/60">
          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Encryption Standard</span>
            <span className="text-base font-bold font-mono text-cyan-400 flex items-center gap-1 mt-0.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              AES-256-GCM
            </span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Deduplication Ratio</span>
            <span className="text-xl font-bold font-mono text-emerald-400">3.44x <span className="text-xs text-gray-400 font-normal">saved 71%</span></span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Raw vs Storage</span>
            <span className="text-base font-bold font-mono text-white mt-0.5">77.8 GB <span className="text-xs text-gray-500">→</span> 22.3 GB</span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Compression Engine</span>
            <span className="text-base font-bold font-mono text-purple-400 mt-0.5">ZSTD-Fastest</span>
          </div>

          <div className="bg-gray-900/60 p-3 rounded-xl border border-gray-800/80">
            <span className="text-[11px] font-mono text-gray-400 block uppercase">Active Snapshots</span>
            <span className="text-xl font-bold font-mono text-white">{snapshots.length} Snapshots</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('snapshots')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
            activeTab === 'snapshots' 
              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          )}
        >
          <Clock className="w-4 h-4" />
          Snapshot Manifest ({snapshots.length})
        </button>

        <button
          onClick={() => setActiveTab('repository')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
            activeTab === 'repository' 
              ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          )}
        >
          <Server className="w-4 h-4" />
          Repository Storage Targets
        </button>

        <button
          onClick={() => setActiveTab('policies')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
            activeTab === 'policies' 
              ? "bg-purple-500/15 text-purple-400 border border-purple-500/30" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          )}
        >
          <Shield className="w-4 h-4" />
          Retention & Compaction Policies
        </button>

        <button
          onClick={() => setActiveTab('cli')}
          className={cn(
            "px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all",
            activeTab === 'cli' 
              ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" 
              : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/40"
          )}
        >
          <Terminal className="w-4 h-4" />
          Kopia CLI & Automation
        </button>
      </div>

      {/* Tab 1: Snapshots */}
      {activeTab === 'snapshots' && (
        <div className="space-y-4">
          <div className="glass-panel p-4 rounded-xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Folder className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono text-gray-300">Target Path:</span>
              <select
                value={newSnapshotPath}
                onChange={(e) => setNewSnapshotPath(e.target.value)}
                className="bg-gray-900 border border-gray-800 rounded-lg px-3 py-1 text-xs text-gray-200 font-mono focus:border-emerald-500"
              >
                <option value="/etc/ftn/core-router">/etc/ftn/core-router (BGP/WireGuard/GoBGP)</option>
                <option value="/etc/dns/powerdns-unbound">/etc/dns/powerdns-unbound (Anycast DNS Zones)</option>
                <option value="/var/lib/opensearch/indices">/var/lib/opensearch/indices (SIEM Cluster Indexes)</option>
                <option value="/etc/pki/mtls-certificates">/etc/pki/mtls-certificates (FTN CA & Root Keys)</option>
                <option value="/opt/ftn/billing-accounting-db">/opt/ftn/billing-accounting-db (PostgreSQL/PgBouncer)</option>
              </select>
            </div>

            <span className="text-xs text-gray-400 font-mono">
              Auto-compaction runs daily at 02:00 UTC
            </span>
          </div>

          <div className="glass-panel rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-800 bg-gray-900/70 text-xs font-mono uppercase text-gray-400">
                  <th className="p-3.5">Snapshot ID / Hash</th>
                  <th className="p-3.5">Source Path</th>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Files</th>
                  <th className="p-3.5">Raw / Deduplicated</th>
                  <th className="p-3.5">Retention</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60 font-mono text-xs">
                {snapshots.map(snap => (
                  <tr key={snap.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="p-3.5">
                      <span className="text-emerald-400 font-bold block">{snap.id}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{snap.hash.substring(0, 12)}...</span>
                    </td>
                    <td className="p-3.5 text-gray-200 font-sans font-medium text-xs">
                      {snap.sourcePath}
                    </td>
                    <td className="p-3.5 text-gray-400">{snap.timestamp}</td>
                    <td className="p-3.5 text-gray-300">{snap.fileCount.toLocaleString()} files</td>
                    <td className="p-3.5">
                      <span className="text-white font-bold">{snap.compressedSize}</span>
                      <span className="text-[10px] text-gray-500 block">from {snap.rawSize}</span>
                    </td>
                    <td className="p-3.5">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold border",
                        snap.policyRetention === 'PINNED' ? "bg-amber-950/40 text-amber-400 border-amber-500/30" :
                        snap.policyRetention === 'WEEKLY' ? "bg-purple-950/40 text-purple-400 border-purple-500/30" :
                        snap.policyRetention === 'DAILY' ? "bg-cyan-950/40 text-cyan-400 border-cyan-500/30" :
                        "bg-gray-800 text-gray-300 border-gray-700"
                      )}>
                        {snap.policyRetention}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 text-[10px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {snap.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleVerifySnapshot(snap.id)}
                        className="px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-sans transition-colors"
                        title="Verify Integrity"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => handleRestorePrompt(snap)}
                        className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-xs font-sans transition-colors"
                        title="Restore Snapshot"
                      >
                        Restore
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Repository Storage Targets */}
      {activeTab === 'repository' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              id: 's3',
              name: 'S3-Compatible Object Store (Wasabi / MinIO)',
              bucket: 'ftn-kopia-vault-asia-east1',
              endpoint: 's3.wasabisys.com',
              status: 'CONNECTED (Active Primary)',
              latency: '14ms',
              encryption: 'Kopia AES-256-GCM + S3 SSE-C'
            },
            {
              id: 'b2',
              name: 'Backblaze B2 Secondary Vault',
              bucket: 'ftn-router-disaster-recovery',
              endpoint: 's3.us-west-004.backblazeb2.com',
              status: 'SYNCED (Geo-Redundant)',
              latency: '52ms',
              encryption: 'Kopia ChaCha20-Poly1305'
            },
            {
              id: 'local',
              name: 'Air-Gapped Local NVMe Vault',
              bucket: '/mnt/storage/kopia-vault-local',
              endpoint: 'Direct PCIe NVMe Gen4 (RAID-10)',
              status: 'STANDBY READY',
              latency: '< 1ms',
              encryption: 'Kopia AES-256-GCM'
            }
          ].map(repo => (
            <div key={repo.id} className="glass-panel p-5 rounded-xl border border-gray-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-emerald-400 uppercase font-bold">{repo.id.toUpperCase()} STORAGE</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                  {repo.status.split(' ')[0]}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-white font-sans text-sm">{repo.name}</h4>
                <p className="text-xs text-gray-400 font-mono mt-1 truncate">{repo.bucket}</p>
              </div>

              <div className="space-y-1 text-xs font-mono text-gray-400 pt-2 border-t border-gray-800/80">
                <div className="flex justify-between">
                  <span>Endpoint:</span>
                  <span className="text-gray-300">{repo.endpoint.split(' ')[0]}</span>
                </div>
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-cyan-400">{repo.latency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cipher:</span>
                  <span className="text-purple-400">{repo.encryption.split(' ')[1]}</span>
                </div>
              </div>

              <button 
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('add-toast', {
                    detail: {
                      type: 'info',
                      title: 'Repository Sync Initiated',
                      message: `Syncing blobs with repository ${repo.name}.`
                    }
                  }));
                }}
                className="w-full py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs font-mono text-gray-200 transition-colors"
              >
                Sync Repository
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Policies */}
      {activeTab === 'policies' && (
        <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-6">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            Snapshot Retention & Compaction Rule Set
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Keep Latest', value: '10 Snapshots', desc: 'Guaranteed point-in-time rollbacks' },
              { label: 'Keep Hourly', value: '24 Hours', desc: 'High frequency router state' },
              { label: 'Keep Daily', value: '30 Days', desc: 'Nightly consolidated delta' },
              { label: 'Keep Weekly', value: '8 Weeks', desc: 'End-of-week verified snapshots' },
              { label: 'Keep Monthly', value: '12 Months', desc: 'Long-term compliance history' },
              { label: 'Keep Annual', value: '3 Years', desc: 'Statutory audit logs backup' },
            ].map(policy => (
              <div key={policy.label} className="bg-gray-900/80 p-4 rounded-xl border border-gray-800">
                <span className="text-xs font-mono text-gray-400 uppercase block">{policy.label}</span>
                <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">{policy.value}</span>
                <span className="text-[11px] text-gray-500 font-sans mt-1 block">{policy.desc}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-950 rounded-xl border border-gray-800 font-mono text-xs text-gray-300">
            <p className="text-cyan-400 font-bold mb-1"># Effective Kopia Retention Policy</p>
            <p className="text-gray-400">kopia policy set /etc/ftn --keep-latest 10 --keep-hourly 24 --keep-daily 30 --keep-weekly 8 --keep-monthly 12 --compression zstd-fastest</p>
          </div>
        </div>
      )}

      {/* Tab 4: CLI & Automation */}
      {activeTab === 'cli' && (
        <div className="glass-panel p-6 rounded-xl border border-gray-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            Kopia Native Terminal Commands
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {[
              { title: 'Connect to Encrypted S3 Repository', cmd: 'kopia repository connect s3 --bucket=ftn-kopia-vault --endpoint=s3.wasabisys.com --password=$KOPIA_MASTER_KEY' },
              { title: 'Create Zero-Knowledge Encrypted Snapshot', cmd: 'kopia snapshot create /etc/ftn/core-router --description="FTN BGP Route Table & WireGuard Keys"' },
              { title: 'Verify Blob Integrity & SHA-256 Hashes', cmd: 'kopia snapshot verify --verify-files-percent=100' },
              { title: 'Run Full Repository Compaction & GC', cmd: 'kopia maintenance run --full' },
              { title: 'Mount Encrypted Repository to Local Filesystem via FUSE', cmd: 'kopia mount all /mnt/kopia-inspect' }
            ].map(item => (
              <div key={item.title} className="bg-gray-950 p-3.5 rounded-xl border border-gray-800">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs text-gray-400 font-sans font-medium">{item.title}</span>
                  <button
                    onClick={() => copyToClipboard(item.cmd)}
                    className="text-gray-400 hover:text-cyan-400 text-[11px] flex items-center gap-1"
                  >
                    {copiedCmd === item.cmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCmd === item.cmd ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-emerald-400 select-all">$ {item.cmd}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
