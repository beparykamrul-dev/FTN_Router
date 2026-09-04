export type Severity = 'INFO' | 'WARNING' | 'CRITICAL';
export type Status = 'ONLINE' | 'OFFLINE' | 'DEGRADED' | 'MAINTENANCE';

export interface Alert {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  severity: Severity;
  mitigationStatus?: 'PENDING' | 'MITIGATING' | 'RESOLVED';
}

export interface NodeMetrics {
  cpuLoad: number;
  ramUsage: number;
  networkIn: number; // Gbps
  networkOut: number; // Gbps
  activeSessions: number;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: 'CORE' | 'EDGE' | 'OLT' | 'SDN_CONTROLLER' | 'CACHE' | 'DNS' | 'DB_CLUSTER';
  ipAddress: string;
  status: Status;
  metrics: NodeMetrics;
  lastSync: string;
}

export interface Microservice {
  id: string;
  name: string;
  description: string;
  status: Status;
  uptime: string;
  version: string;
}

export interface OltPort {
  portId: string;
  status: 'UP' | 'DOWN';
  activeOnts: number;
  txPower: number; // dBm
  rxPower: number; // dBm
}

export interface OltDevice extends NetworkNode {
  vendor: 'HUAWEI' | 'ZTE' | 'FIBERHOME' | 'BDCOM';
  ports: OltPort[];
  uplinkUsage: number; // Percentage
}

export interface Subscriber {
  id: string;
  username: string;
  macAddress: string;
  ipAddress: string;
  plan: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'OFFLINE';
  lastSeen: string;
  rxBytes: number;
  txBytes: number;
}

export type FtnServiceCategory = 'all' | 'personal' | 'family' | 'enterprise';

export interface FtnRegisteredService {
  id: string;
  category: 'personal' | 'family' | 'enterprise';
  categoryLabel: string;
  name: string;
  tagline: string;
  description: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';
  endpoint: string;
  accessTier: string;
  icon: string;
  requiredRole: string[];
  latencyMs: number;
  healthScore: number;
  activeNodes: number;
}

export interface FtnIdentity {
  id: string;
  name: string;
  email: string;
  role: string;
  familyScope: string;
  ssoIdentity: string;
  mfaMethod: string;
  avatar: string;
  lastLogin: string;
  provisionedServiceIds: string[];
}

export interface FtnAuthSessionResponse {
  authenticated: boolean;
  identity: FtnIdentity | null;
  provisionedServiceIds: string[];
  policy: {
    selfRegistration: string;
    provisioningAuthority: string;
    storage: string;
  };
}

