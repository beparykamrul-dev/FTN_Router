export type PolicyAction = 
  | 'permit' 
  | 'deny' 
  | 'rate_limit' 
  | 'divert_honeypot' 
  | 'quarantine' 
  | 'inspect_dpi';

export type PolicyProtocol = 'TCP' | 'UDP' | 'ICMP' | 'DNS' | 'HTTP' | 'HTTPS' | 'QUIC' | 'ANY';

export type EnforcementLayer = 
  | 'eBPF/XDP Kernel' 
  | 'Envoy Mesh Gateway' 
  | 'WireGuard CryptKey' 
  | 'Linux Conntrack' 
  | 'Traefik Sovereign Guard';

export interface PolicyConditions {
  timeOfDay?: {
    enabled: boolean;
    start: string; // HH:mm
    end: string;   // HH:mm
    days: string[];
  };
  requireMtls: boolean;
  minTlsVersion?: '1.2' | '1.3';
  maxThreatScore?: number; // 0 - 100
  geoFence?: {
    enabled: boolean;
    allowedCountries: string[];
    blockedCountries: string[];
  };
  requireFido2Mfa?: boolean;
}

export interface NetworkPolicyRule {
  id: string;
  ruleNumber: number;
  name: string;
  description: string;
  priority: number; // 10 - 1000 (lower number = evaluated first)
  enabled: boolean;
  source: {
    zone: 'WAN' | 'LAN' | 'DMZ' | 'PON_CLIENTS' | 'MGMT_CORE' | 'BGP_PEER' | 'ANY';
    cidr?: string;
    iamRoles: string[]; // e.g. ['Super Admin', 'NOC', 'Engineer', 'Employee', 'Customer', 'Public']
    userGroups?: string[];
  };
  destination: {
    zone: 'CONTROL_PLANE' | 'AI_RUNTIME' | 'DATABASE_CORE' | 'INTERNET' | 'OLT_PON' | 'API_GATEWAY';
    services: string[]; // e.g. ['ai.familytimenet.com', 'api.familytimenet.com', 'dns.familytimenet.com']
    ports: string;      // e.g. "443, 8080" or "53"
    protocol: PolicyProtocol;
  };
  conditions: PolicyConditions;
  action: PolicyAction;
  rateLimit?: {
    requestsPerSecond: number;
    burst: number;
  };
  enforcementLayer: EnforcementLayer;
  hitCount: number;
  lastMatchedAt?: string;
  version: number;
  updatedBy: string;
  updatedAt: string;
}

export interface PolicySimulationRequest {
  sourceIp: string;
  sourceZone: string;
  userRole: string;
  destinationHost: string;
  destinationPort: number;
  protocol: PolicyProtocol;
  threatScore?: number;
  hasMtls: boolean;
}

export interface PolicySimulationResult {
  allowed: boolean;
  verdict: PolicyAction;
  matchedRuleId?: string;
  matchedRuleName?: string;
  evaluationSteps: {
    ruleNumber: number;
    ruleName: string;
    priority: number;
    matched: boolean;
    reason: string;
  }[];
  appliedEnforcementLayer: string;
  latencyMicroseconds: number;
}
