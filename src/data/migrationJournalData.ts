export interface MigrationRecord {
  id: string;
  timestamp: string;
  workloadName: string;
  containerId: string;
  triggerType: 'AUTONOMOUS_SCALING' | 'MANUAL_OPTIMIZE' | 'PREVENTATIVE_MAINTENANCE' | 'FAILOVER';
  sourceNode: {
    id: string;
    name: string;
    location: string;
    beforeState: {
      cpuPct: number;
      ramPct: number;
      bandwidthGbps: number;
      thermalC: number;
    };
    afterState: {
      cpuPct: number;
      ramPct: number;
      bandwidthGbps: number;
      thermalC: number;
    };
  };
  targetNode: {
    id: string;
    name: string;
    location: string;
    beforeState: {
      cpuPct: number;
      ramPct: number;
      bandwidthGbps: number;
      thermalC: number;
    };
    afterState: {
      cpuPct: number;
      ramPct: number;
      bandwidthGbps: number;
      thermalC: number;
    };
  };
  metrics: {
    memoryTransferredMb: number;
    cutoverDowntimeMs: number;
    ebpfSocketHandoffMs: number;
    packetLossPct: number;
    durationSecs: number;
  };
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ROLLBACK' | 'SCHEDULED';
  ebpfHandoffLog: string[];
}

export const INITIAL_MIGRATION_RECORDS: MigrationRecord[] = [
  {
    id: 'MIG-2026-0941',
    timestamp: '8 mins ago',
    workloadName: 'ftn-smart-dns:v2.4',
    containerId: 'cntr-dns-banani-904',
    triggerType: 'AUTONOMOUS_SCALING',
    sourceNode: {
      id: 'node-02',
      name: 'FTN-BANANI-EDGE-02',
      location: 'Banani POP, Dhaka',
      beforeState: { cpuPct: 88.4, ramPct: 89.1, bandwidthGbps: 17.5, thermalC: 62.4 },
      afterState: { cpuPct: 44.1, ramPct: 52.3, bandwidthGbps: 10.2, thermalC: 51.0 }
    },
    targetNode: {
      id: 'node-03',
      name: 'FTN-CTG-HUB-03',
      location: 'Agrabad DC, Chittagong',
      beforeState: { cpuPct: 22.0, ramPct: 34.2, bandwidthGbps: 4.8, thermalC: 44.5 },
      afterState: { cpuPct: 38.6, ramPct: 48.9, bandwidthGbps: 11.4, thermalC: 47.2 }
    },
    metrics: {
      memoryTransferredMb: 1420,
      cutoverDowntimeMs: 0.8,
      ebpfSocketHandoffMs: 1.4,
      packetLossPct: 0.00,
      durationSecs: 3.2
    },
    status: 'COMPLETED',
    ebpfHandoffLog: [
      'CRIU pre-copy iteration 1: transferred 1,280 MB dirty pages',
      'XDP eBPF socket table mirror established between Banani and Chittagong',
      'CRIU final sync (140 MB) paused thread for 0.8ms',
      'Anycast BGP AS-Path metric shifted to route UDP port 53 to Chittagong',
      'Atomic cutover verified: 0 dropped packets on ring buffer'
    ]
  },
  {
    id: 'MIG-2026-0940',
    timestamp: '24 mins ago',
    workloadName: 'edge-cdn-proxy:v1.8',
    containerId: 'cntr-cdn-cache-332',
    triggerType: 'MANUAL_OPTIMIZE',
    sourceNode: {
      id: 'node-01',
      name: 'FTN-DHAKA-CORE-01',
      location: 'Motijheel Core DC',
      beforeState: { cpuPct: 76.5, ramPct: 74.2, bandwidthGbps: 14.8, thermalC: 56.8 },
      afterState: { cpuPct: 52.1, ramPct: 54.0, bandwidthGbps: 9.1, thermalC: 49.2 }
    },
    targetNode: {
      id: 'node-04',
      name: 'FTN-SGP-TRANSIT-04',
      location: 'Equinix SG1, Singapore',
      beforeState: { cpuPct: 18.2, ramPct: 28.5, bandwidthGbps: 6.2, thermalC: 42.0 },
      afterState: { cpuPct: 32.7, ramPct: 44.1, bandwidthGbps: 11.6, thermalC: 45.1 }
    },
    metrics: {
      memoryTransferredMb: 2840,
      cutoverDowntimeMs: 1.2,
      ebpfSocketHandoffMs: 2.1,
      packetLossPct: 0.00,
      durationSecs: 4.8
    },
    status: 'COMPLETED',
    ebpfHandoffLog: [
      'CRIU live pre-copy pipeline initialized across SingTel dark fiber trunk',
      'eBPF socket redirection active on AF_XDP interface eth1',
      'Zero socket disconnect reported by 8,420 active HTTP/3 TLS connections',
      'Memory balloon reclaimed on Motijheel Core DC'
    ]
  },
  {
    id: 'MIG-2026-0939',
    timestamp: '1 hour ago',
    workloadName: 'kopia-remote-vault:v0.15',
    containerId: 'cntr-backup-sgp-110',
    triggerType: 'PREVENTATIVE_MAINTENANCE',
    sourceNode: {
      id: 'node-04',
      name: 'FTN-SGP-TRANSIT-04',
      location: 'Equinix SG1, Singapore',
      beforeState: { cpuPct: 68.0, ramPct: 62.4, bandwidthGbps: 18.2, thermalC: 54.2 },
      afterState: { cpuPct: 24.1, ramPct: 31.0, bandwidthGbps: 7.4, thermalC: 43.8 }
    },
    targetNode: {
      id: 'node-05',
      name: 'FTN-FRA-BACKUP-05',
      location: 'Interxion FRA1, Frankfurt',
      beforeState: { cpuPct: 14.5, ramPct: 21.0, bandwidthGbps: 2.1, thermalC: 38.4 },
      afterState: { cpuPct: 36.8, ramPct: 46.2, bandwidthGbps: 9.8, thermalC: 42.1 }
    },
    metrics: {
      memoryTransferredMb: 3650,
      cutoverDowntimeMs: 2.4,
      ebpfSocketHandoffMs: 3.0,
      packetLossPct: 0.00,
      durationSecs: 6.1
    },
    status: 'COMPLETED',
    ebpfHandoffLog: [
      'SingTel submarine cable scheduled maintenance forecasted',
      'Autonomous eviction of cold sync containers triggered',
      'Storage ZFS snapshot incremental send verified at target',
      'Cutover completed with zero journal inconsistencies'
    ]
  },
  {
    id: 'MIG-2026-0938',
    timestamp: '3 hours ago',
    workloadName: 'ftn-wireguard-mesh:v2.1',
    containerId: 'cntr-wg-tunnel-092',
    triggerType: 'AUTONOMOUS_SCALING',
    sourceNode: {
      id: 'node-02',
      name: 'FTN-BANANI-EDGE-02',
      location: 'Banani POP, Dhaka',
      beforeState: { cpuPct: 91.2, ramPct: 84.5, bandwidthGbps: 18.9, thermalC: 64.1 },
      afterState: { cpuPct: 48.0, ramPct: 51.2, bandwidthGbps: 11.2, thermalC: 52.3 }
    },
    targetNode: {
      id: 'node-01',
      name: 'FTN-DHAKA-CORE-01',
      location: 'Motijheel Core DC',
      beforeState: { cpuPct: 35.0, ramPct: 42.0, bandwidthGbps: 8.5, thermalC: 48.0 },
      afterState: { cpuPct: 54.2, ramPct: 61.4, bandwidthGbps: 14.8, thermalC: 53.2 }
    },
    metrics: {
      memoryTransferredMb: 980,
      cutoverDowntimeMs: 0.4,
      ebpfSocketHandoffMs: 0.9,
      packetLossPct: 0.00,
      durationSecs: 2.4
    },
    status: 'COMPLETED',
    ebpfHandoffLog: [
      'eBPF wireguard peer crypto table synchronized with target kernel',
      'Handshake keys preserved without renegotiation (0ms tunnel drop)',
      'NIC rx ring buffer recovered from 98% saturation'
    ]
  }
];
