import { NetworkNode, Microservice, Alert, OltDevice, Subscriber } from '../types';

export const mockAlerts: Alert[] = [
  { id: 'AL-001', timestamp: new Date(Date.now() - 120000).toISOString(), source: 'BGP_EVPN_CORE', message: 'Prefix route flap detected on peer 103.145.0.1. Mitigating via Drip Policy.', severity: 'WARNING', mitigationStatus: 'MITIGATING' },
  { id: 'AL-002', timestamp: new Date(Date.now() - 340000).toISOString(), source: 'KUBE_OVN_SDN', message: 'High latency detected on Overlay Fabric tunnel to Edge-04.', severity: 'CRITICAL', mitigationStatus: 'PENDING' },
  { id: 'AL-003', timestamp: new Date(Date.now() - 890000).toISOString(), source: 'OLT_DHAKA_01', message: 'Rogue ONT laser detected on PON 0/1/3. Port isolation engaged.', severity: 'WARNING', mitigationStatus: 'RESOLVED' },
  { id: 'AL-004', timestamp: new Date(Date.now() - 1500000).toISOString(), source: 'ZERO_TRUST_GW', message: 'Failed authentication spikes from subnet 203.0.113.0/24. Dropped by eBPF XDP.', severity: 'INFO', mitigationStatus: 'RESOLVED' },
];

export const mockNodes: any[] = [
  { id: 'N-001', name: 'CORE-BDIX', type: 'CORE', ipAddress: '103.145.0.1', status: 'ONLINE', uptime: '45d', load: 35, metrics: { cpuLoad: 24, ramUsage: 45, networkIn: 18.4, networkOut: 18.2, activeSessions: 3042 } },
  { id: 'N-002', name: 'SG-Cloudflare', type: 'EDGE', ipAddress: '1.1.1.1', status: 'ONLINE', uptime: '112d', load: 62 },
  { id: 'N-003', name: 'IN-Akamai', type: 'EDGE', ipAddress: '23.192.0.1', status: 'ONLINE', uptime: '14d', load: 88 },
  { id: 'N-004', name: 'EU-Congestion', type: 'EDGE', ipAddress: '8.8.8.8', status: 'DEGRADED', uptime: '5d', load: 98 },
];

export const mockOltDevices: OltDevice[] = [
  {
    id: 'OLT-001', name: 'Huawei-MA5800-ZoneA', type: 'OLT', vendor: 'HUAWEI', ipAddress: '172.16.100.2', status: 'ONLINE', uplinkUsage: 45, metrics: { cpuLoad: 24, ramUsage: 45, networkIn: 18.4, networkOut: 18.2, activeSessions: 3042 }, lastSync: new Date().toISOString(),
    ports: [
      { portId: '0/1/0', status: 'UP', activeOnts: 64, txPower: 2.5, rxPower: -24.1 },
      { portId: '0/1/1', status: 'UP', activeOnts: 58, txPower: 2.4, rxPower: -22.8 },
      { portId: '0/1/2', status: 'DOWN', activeOnts: 0, txPower: -40.0, rxPower: -40.0 },
    ]
  },
  {
    id: 'OLT-002', name: 'ZTE-C320-ZoneB', type: 'OLT', vendor: 'ZTE', ipAddress: '172.16.100.3', status: 'ONLINE', uplinkUsage: 62, metrics: { cpuLoad: 24, ramUsage: 45, networkIn: 18.4, networkOut: 18.2, activeSessions: 3042 }, lastSync: new Date().toISOString(),
    ports: [
      { portId: '1/1/1', status: 'UP', activeOnts: 120, txPower: 3.1, rxPower: -19.5 },
      { portId: '1/1/2', status: 'UP', activeOnts: 115, txPower: 3.0, rxPower: -20.2 },
    ]
  }
];

export const mockSubscribers: Subscriber[] = [
  { id: 'SUB-1001', username: 'kamrul.corp', macAddress: '00:1A:2B:3C:4D:5E', ipAddress: '100.64.10.12', plan: 'Corp-Dedicated-100M', status: 'ACTIVE', lastSeen: new Date().toISOString(), rxBytes: 1024 * 1024 * 1024 * 45, txBytes: 1024 * 1024 * 1024 * 12 },
  { id: 'SUB-1002', username: 'home.dhaka.01', macAddress: 'A1:B2:C3:D4:E5:F6', ipAddress: '100.64.10.55', plan: 'Home-Standard-30M', status: 'ACTIVE', lastSeen: new Date().toISOString(), rxBytes: 1024 * 1024 * 1024 * 120, txBytes: 1024 * 1024 * 1024 * 5 },
  { id: 'SUB-1003', username: 'retail.pos.05', macAddress: '11:22:33:44:55:66', ipAddress: '100.64.11.02', plan: 'Biz-Basic-10M', status: 'SUSPENDED', lastSeen: new Date(Date.now() - 86400000 * 2).toISOString(), rxBytes: 1024 * 1024 * 500, txBytes: 1024 * 1024 * 50 },
];

export const mockMicroservices: Microservice[] = [
  { id: 'MS-01', name: 'FTN-BGP-Orchestrator', description: 'FRR BGP EVPN Autonomous Route Injector', status: 'ONLINE', uptime: '45d 12h', version: 'v2.4.1' },
  { id: 'MS-02', name: 'Numa-DNS-Core', description: 'High-Performance Edge DNS Resolver', status: 'ONLINE', uptime: '12d 4h', version: 'v1.9.0' },
  { id: 'MS-03', name: 'ZeroTrust-Auth-Gateway', description: 'NetBird/Tailscale Identity Proxy', status: 'ONLINE', uptime: '102d 1h', version: 'v3.0.2' },
  { id: 'MS-04', name: 'SiLK-Flow-Analyzer', description: 'IPFIX/NetFlow v9 Forensic Telemetry', status: 'ONLINE', uptime: '15d 8h', version: 'v4.1.0' },
  { id: 'MS-05', name: 'Cockroach-Sync-Agent', description: 'Distributed Consensus & Replication', status: 'ONLINE', uptime: '200d 0h', version: 'v22.2.0' },
  { id: 'MS-06', name: 'XDP-DDoS-Mitigator', description: 'eBPF In-Kernel Packet Dropper', status: 'ONLINE', uptime: '45d 12h', version: 'v1.1.5' },
  { id: 'MS-07', name: 'OOM-Panics-Preventer', description: 'Kernel Memory State Orchestrator', status: 'ONLINE', uptime: '45d 12h', version: 'v1.0.8' },
  { id: 'MS-08', name: 'FTN-AI-Agent-Core', description: 'LLM-powered Network Autonomous Engine', status: 'DEGRADED', uptime: '2d 4h', version: 'v0.9.beta' },
];
