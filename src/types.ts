export interface ServiceStatus {
  id: string;
  name: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
  healthScore: number;
}

export interface AccessRole {
  id: string;
  name: string;
  services: string[];
}

export interface TelemetryMetric {
  timestamp: string;
  bgpPeers: number;
  trafficMbps: number;
  cpuUsage: number;
}

export interface RouterAutomationJob {
  id: string;
  scriptName: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  dryRun: boolean;
}

export interface AiNocAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
}

export interface ProvisioningJob {
  id: string;
  subscriberId: string;
  serviceType: string;
  status: 'pending' | 'provisioning' | 'tested' | 'completed';
}

export interface FtnRegisteredService {
  id: string;
  name: string;
}

export interface FtnIdentity {
  id: string;
  email: string;
  role: string;
  provisionedServiceIds: string[];
}

export interface FtnAuthSessionResponse {
  authenticated: boolean;
  identity: FtnIdentity | null;
  provisionedServiceIds: string[];
}

export interface NetworkNode {
  id: string;
  name: string;
}

export interface Microservice {
  id: string;
  name: string;
  description: string;
  status?: string;
  uptime?: string;
  version?: string;
}

export interface Alert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical' | 'WARNING' | 'CRITICAL' | 'INFO';
  source: string;
  timestamp: string;
  mitigationStatus: 'pending' | 'active' | 'resolved' | 'MITIGATING' | 'RESOLVED' | 'PENDING';
}

export interface PonPortInfo {
  portId: string;
  status: string;
  activeOnts: number;
  txPower: number;
  rxPower: number;
}

export interface OltDevice {
  id: string;
  name: string;
  ipAddress: string;
  vendor: string;
  status: 'online' | 'offline' | 'ONLINE' | 'OFFLINE';
  uplinkUsage: number;
  ports: PonPortInfo[];
  type: string;
  metrics?: Record<string, any>;
  lastSync?: string;
}

export interface Subscriber {
  id: string;
  name?: string;
  username: string;
  plan: string;
  ipAddress: string;
  macAddress: string;
  rxBytes: number;
  txBytes: number;
  status: 'active' | 'suspended' | 'ACTIVE' | 'SUSPENDED';
  lastSeen?: string;
}

export interface Tunnel {
  id: string;
  protocol: 'WireGuard' | 'Hysteria2' | 'Shadowsocks';
  status: 'active' | 'inactive';
  throughputMbps: number;
  packetLoss: number;
}

export interface ProtocolSettings {
  tunnelId: string;
  mtu: number;
  encryption: string;
}

export interface AiRoutingRule {
  id: string;
  path: string;
  priority: number;
  reliabilityScore: number;
}

export interface VpnNode {
  id: string;
  location: string;
  latencyMs: number;
  status: 'online' | 'offline';
}
