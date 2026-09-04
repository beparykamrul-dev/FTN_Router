export interface TelemetryForecast {
  id: string;
  targetComponent: string;
  nodeId: string;
  nodeName: string;
  anomalyType: 'HARDWARE_WEAR' | 'BOTTLENECK' | 'THERMAL_THROTTLE' | 'NETWORK_SATURATION' | 'MEMORY_LEAK';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  probabilityPct: number;
  timeToFailure: string;
  forecastWindowHours: number;
  currentValue: string;
  projectedCriticalValue: string;
  telemetrySignal: string;
  description: string;
  rootCauseAnalysis: string;
  preventativeAction: {
    title: string;
    description: string;
    impact: string;
    estimatedDowntime: string;
    actionCommand: string;
    autoExecutable: boolean;
  };
  status: 'FORECASTED' | 'MITIGATING' | 'RESOLVED' | 'DISMISSED';
}

export const INITIAL_PREDICTIONS: TelemetryForecast[] = [
  {
    id: 'PRED-401',
    targetComponent: 'NVMe Gen5 Enterprise SSD (nvme0n1)',
    nodeId: 'node-01',
    nodeName: 'FTN-DHAKA-CORE-01',
    anomalyType: 'HARDWARE_WEAR',
    severity: 'HIGH',
    probabilityPct: 93.4,
    timeToFailure: '4.8 hours',
    forecastWindowHours: 12,
    currentValue: '96.2% SMART wear leveling limit (8.4M write IOPS/day)',
    projectedCriticalValue: '100.0% Write Barrier Read-Only Lockout',
    telemetrySignal: 'nvme_media_wear_rate_derivative (Zabbix/eBPF)',
    description: 'High write amplification from unbuffered OpenSearch SIEM WAL logs is burning available spare flash blocks at 0.12% per hour.',
    rootCauseAnalysis: 'Async checkpointing backlog in OpenSearch cluster creates excessive write syncs without batch coalescing.',
    preventativeAction: {
      title: 'Demote Cold Indices & Flush NVMe Write Cache to ZFS Pool',
      description: 'Trigger zero-downtime block tier demotion to HDD array and throttle unbatched syslog ingestion.',
      impact: 'Reduces NVMe write IOPS by 74%, extending flash drive lifespan by 4.2 years.',
      estimatedDowntime: '0.0 ms (Live eBPF IO diversion)',
      actionCommand: 'ftn-storage tier evict --source nvme0n1 --target zfs-cold-pool --throttle-wal',
      autoExecutable: true
    },
    status: 'FORECASTED'
  },
  {
    id: 'PRED-402',
    targetComponent: 'Mellanox ConnectX-6 100GbE NIC (Port 1)',
    nodeId: 'node-02',
    nodeName: 'FTN-BANANI-EDGE-02',
    anomalyType: 'NETWORK_SATURATION',
    severity: 'CRITICAL',
    probabilityPct: 97.2,
    timeToFailure: '1.2 hours',
    forecastWindowHours: 4,
    currentValue: '17.5 Gbps / 20 Gbps transit ceiling (87.5%)',
    projectedCriticalValue: '21.4 Gbps (Ring Buffer Overflow & 18% Packet Loss)',
    telemetrySignal: 'ebpf_xdp_rx_buffer_saturation_slope (Prometheus)',
    description: 'Incoming UDP transit burst trend will breach NIC DMA ring buffer capacity during evening peak.',
    rootCauseAnalysis: 'Upstream transit peer AS13335 is routing all Bangladesh-bound cache traffic exclusively through Banani without ECMP splitting.',
    preventativeAction: {
      title: 'BGP Anycast Route Prepend & ECMP Load Shedding to Chittagong',
      description: 'Prepend 2 AS hops on Banani edge BGP speaker to shift 45% ingress flow to Chittagong Hub.',
      impact: 'Drops Banani transit load from 17.5 Gbps to 9.8 Gbps within 90 seconds.',
      estimatedDowntime: '0.0 ms (BGP soft-reconfiguration)',
      actionCommand: 'ftn-bgp prepend --peer as13335 --hops 2 --divert-target FTN-CTG-HUB-03',
      autoExecutable: true
    },
    status: 'FORECASTED'
  },
  {
    id: 'PRED-403',
    targetComponent: 'AMD EPYC 9654 Thermal Die Zone 2',
    nodeId: 'node-02',
    nodeName: 'FTN-BANANI-EDGE-02',
    anomalyType: 'THERMAL_THROTTLE',
    severity: 'HIGH',
    probabilityPct: 89.6,
    timeToFailure: '2.5 hours',
    forecastWindowHours: 6,
    currentValue: '62.4°C (Current) with +1.8°C/hr thermal slope',
    projectedCriticalValue: '68.0°C (Proximity to Thermal Throttle Threshold)',
    telemetrySignal: 'node_thermal_zone_gradient_celsius (Prometheus)',
    description: 'Chassis exhaust fan RPM plateau combined with sustained crypto hashing load is driving core die temperature up.',
    rootCauseAnalysis: 'WireGuard kernel crypto context switches and fan controller PWM curve lagging behind thermal spike.',
    preventativeAction: {
      title: 'Trigger Fan PWM Override & Rebalance WireGuard Crypto to Core 01',
      description: 'Set fan PWM to 85% aggressive profile and migrate 600 crypto worker threads.',
      impact: 'Reduces die temperature by 9.6°C within 4 minutes.',
      estimatedDowntime: '0.0 ms',
      actionCommand: 'ftn-hardware fan set-profile --mode aggressive --node FTN-BANANI-EDGE-02',
      autoExecutable: true
    },
    status: 'FORECASTED'
  },
  {
    id: 'PRED-404',
    targetComponent: 'Linux Kernel dentry slab allocation',
    nodeId: 'node-01',
    nodeName: 'FTN-DHAKA-CORE-01',
    anomalyType: 'MEMORY_LEAK',
    severity: 'MEDIUM',
    probabilityPct: 84.1,
    timeToFailure: '18.4 hours',
    forecastWindowHours: 24,
    currentValue: '48.2 GB slab memory consumed (Slope +1.2 GB/hr)',
    projectedCriticalValue: '96.0 GB (OOM Killer Trigger Risk)',
    telemetrySignal: 'meminfo_slab_unreclaimable_bytes (New Relic / Zabbix)',
    description: 'High rate of temporary DNS socket epoll registrations failing to deallocate dentry cache slabs cleanly.',
    rootCauseAnalysis: 'Unbound DNS daemon micro-thread recycling leak in version v1.18.2 kernel socket handler.',
    preventativeAction: {
      title: 'Execute Slab Cache Compaction & Worker Pool Clean Restart',
      description: 'Run kernel drop_caches level 2 (dentries and inodes) and hot-restart Unbound DNS thread pool.',
      impact: 'Reclaims 38.4 GB of RAM with zero dropped DNS lookups.',
      estimatedDowntime: '0.0 ms (eBPF socket handoff)',
      actionCommand: 'echo 2 > /proc/sys/vm/drop_caches && ftn-dns ctl recycle-pool',
      autoExecutable: true
    },
    status: 'FORECASTED'
  }
];
