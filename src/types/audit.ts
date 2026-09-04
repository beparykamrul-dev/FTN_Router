export type AuditSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type AuditSubsystem = 
  | 'bgp_routing' 
  | 'firewall_policy' 
  | 'dns_security' 
  | 'iam_rbac' 
  | 'olt_pon' 
  | 'pki_certs' 
  | 'wireguard_tunnel' 
  | 'billing_checkout' 
  | 'ipam_allocation' 
  | 'system_kernel';

export interface AuditActor {
  id: string;
  name: string;
  email: string;
  role: string;
  ipAddress: string;
  ssoSubject?: string;
  authMethod: string;
}

export interface AuditDiffEntry {
  field: string;
  previousValue: any;
  newValue: any;
}

export interface CryptographicProof {
  blockHeight: number;
  recordHash: string; // SHA-256
  previousBlockHash: string;
  merkleRoot: string;
  signedBy: string;
  signature: string;
  verified: boolean;
  tamperDetected?: boolean;
}

export interface AuditRecord {
  id: string;
  timestamp: string;
  actor: AuditActor;
  subsystem: AuditSubsystem;
  action: string;
  resourceType: string;
  resourceId: string;
  severity: AuditSeverity;
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED';
  description: string;
  diff: AuditDiffEntry[];
  complianceTags: string[]; // e.g. 'ISO-27001-A.12.4', 'SOC2-CC6.1', 'BTRC-ISP-SEC'
  proof: CryptographicProof;
}

export interface AuditComplianceStats {
  totalRecords: number;
  cryptographicallyVerified: number;
  tamperAlerts: number;
  criticalSeverityCount: number;
  lastIntegrityAudit: string;
  chainIntegrityStatus: 'HEALTHY_IMMUTABLE' | 'DEGRADED_TAMPER_DETECTED';
}
