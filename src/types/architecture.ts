export type ArchitectureSectionId =
  | '01-core-control'
  | '02-ai-platform'
  | '03-control-panels'
  | '04-network-isp'
  | '05-dns'
  | '06-traffic-observability'
  | '07-security'
  | '08-customer-isp'
  | '09-client-apps'
  | '10-iptv-media'
  | '11-edge-proxy-tunnel'
  | '12-provider-integration'
  | '13-data-database'
  | '14-backup-storage'
  | '15-deployment-infra'
  | '16-noc-operations'
  | '17-automation'
  | '18-governance';

export type ServiceHealthStatus = 'HEALTHY' | 'DEGRADED' | 'PROVISIONING' | 'CRITICAL';

export type ImplementationPriorityTier =
  | 'AI'
  | 'API'
  | 'Control Panel'
  | 'Subdomain/Reverse Proxy'
  | 'Auth/RBAC'
  | 'DB'
  | 'Docker/Health'
  | 'Integration Tests'
  | 'Extended Services';

export interface ServiceEndpointContract {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'WS' | 'GRPC' | 'UDP';
  description: string;
  authRequired: boolean;
  rateLimit: string;
}

export interface FtnArchitectureService {
  id: string;
  name: string;
  sectionId: ArchitectureSectionId;
  sectionNumber: string;
  sectionName: string;
  isNative: boolean; // FTN Native Service vs 3rd-Party Engine
  nativeServiceName?: string;
  underlyingEngine: string;
  canonicalSubdomain: string;
  containerName: string;
  internalPort: number;
  externalPort: number;
  protocol: 'HTTP/2' | 'HTTP/3 (QUIC)' | 'gRPC' | 'UDP' | 'TCP' | 'DNS' | 'SIP' | 'RTMP/HLS';
  reverseProxyRule: {
    routerType: 'Traefik' | 'Nginx' | 'FTN-Edge-Proxy';
    hostRule: string;
    pathPrefix: string;
    stripPrefix?: boolean;
    tlsResolver: 'Let\'s Encrypt ACME' | 'Internal PKI mTLS' | 'Custom Cloudflare Edge' | 'Full HSTS TLS 1.3' | 'Strict mTLS';
  };
  tlsConfig: {
    enabled: boolean;
    cipherSuite: string;
    minTlsVersion: '1.2' | '1.3';
    clientCertValidation: 'none' | 'optional' | 'required_mtls';
  };
  authRbac: {
    requiredRoles: Array<
      | 'Super Admin'
      | 'Admin'
      | 'NOC'
      | 'Engineer'
      | 'Employee'
      | 'Reseller'
      | 'Partner'
      | 'Upstream'
      | 'Customer'
      | 'Public'
    >;
    authType: 'SessionCookie' | 'BearerJWT' | 'mTLS' | 'APIKey' | 'None';
  };
  healthCheck: {
    endpoint: string;
    protocol: 'HTTP' | 'TCP' | 'DNS' | 'ICMP' | 'UDP' | 'gRPC';
    intervalSeconds: number;
    timeoutSeconds: number;
    currentStatus: ServiceHealthStatus;
    lastLatencyMs: number;
    lastChecked: string;
  };
  priorityTier: ImplementationPriorityTier;
  implementationState: 'PRODUCTION' | 'ACTIVE_SERVICE' | 'STAGED' | 'TEST_VALIDATED';
  description: string;
  keyCapabilities: string[];
}

export interface CanonicalNamespaceRoute {
  domain: string;
  label: string;
  targetServiceId: string;
  upstreamContainer: string;
  upstreamPort: number;
  publicPort: number;
  sslTlsMode: 'Strict mTLS' | 'Full HSTS TLS 1.3' | 'Let\'s Encrypt ACME';
  rbacTier: string;
  healthStatus: ServiceHealthStatus;
  reverseProxyPath: string;
  rateLimitRps: number;
  notes: string;
}

export interface HealthGateSummary {
  overallHealthScore: number;
  totalServices: number;
  healthyCount: number;
  degradedCount: number;
  stagedCount: number;
  nativeServicesCount: number;
  thirdPartyEnginesCount: number;
  timestamp: string;
}
