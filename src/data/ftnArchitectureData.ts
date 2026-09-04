import { 
  FtnArchitectureService, 
  CanonicalNamespaceRoute, 
  HealthGateSummary 
} from '../types/architecture';

export const CANONICAL_NAMESPACES: CanonicalNamespaceRoute[] = [
  {
    domain: 'familytimenet.com',
    label: 'FTN Portal & Web Root',
    targetServiceId: 'ftn-portal-web',
    upstreamContainer: 'ftn-web-portal',
    upstreamPort: 3000,
    publicPort: 443,
    sslTlsMode: 'Full HSTS TLS 1.3',
    rbacTier: 'Public / Authenticated Session',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`familytimenet.com`)',
    rateLimitRps: 500,
    notes: 'Primary consumer portal, company root, and onboarding gateway'
  },
  {
    domain: 'ai.familytimenet.com',
    label: 'FTN AI Core & Agent Gateway',
    targetServiceId: 'ftn-ai-gateway',
    upstreamContainer: 'ftn-ai-runtime',
    upstreamPort: 8090,
    publicPort: 443,
    sslTlsMode: 'Full HSTS TLS 1.3',
    rbacTier: 'Super Admin / NOC / Customer / Member',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`ai.familytimenet.com`)',
    rateLimitRps: 120,
    notes: 'Autonomous network reasoning, Gemini 2.5/Flash-Lite runtime & approval engine'
  },
  {
    domain: 'api.familytimenet.com',
    label: 'FTN Central API Gateway',
    targetServiceId: 'ftn-api-gateway',
    upstreamContainer: 'ftn-gateway-mesh',
    upstreamPort: 8000,
    publicPort: 443,
    sslTlsMode: 'Strict mTLS',
    rbacTier: 'APIKey / BearerJWT / Super Admin',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`api.familytimenet.com`)',
    rateLimitRps: 2500,
    notes: 'Polyglot microservices mesh, Go core dispatcher & Rust eBPF ingress'
  },
  {
    domain: 'panel.familytimenet.com',
    label: 'FTN Multi-Tenant Control Panel',
    targetServiceId: 'ftn-control-panel-unified',
    upstreamContainer: 'ftn-web-panel',
    upstreamPort: 3000,
    publicPort: 443,
    sslTlsMode: 'Full HSTS TLS 1.3',
    rbacTier: 'Admin / Engineer / Employee / Reseller',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`panel.familytimenet.com`)',
    rateLimitRps: 300,
    notes: 'Consolidated single-pane-of-glass operations interface'
  },
  {
    domain: 'admin.familytimenet.com',
    label: 'FTN Super Admin Console',
    targetServiceId: 'ftn-super-admin-console',
    upstreamContainer: 'ftn-admin-master',
    upstreamPort: 8443,
    publicPort: 443,
    sslTlsMode: 'Strict mTLS',
    rbacTier: 'Super Admin (Hardware FIDO2 MFA)',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`admin.familytimenet.com`)',
    rateLimitRps: 100,
    notes: 'Root cryptographic keys, tenant provisioning, system emergency overrides'
  },
  {
    domain: 'portal.familytimenet.com',
    label: 'Customer Self-Care Portal',
    targetServiceId: 'ftn-customer-portal',
    upstreamContainer: 'ftn-customer-selfcare',
    upstreamPort: 8081,
    publicPort: 443,
    sslTlsMode: 'Full HSTS TLS 1.3',
    rbacTier: 'Customer / Subscriber',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`portal.familytimenet.com`)',
    rateLimitRps: 600,
    notes: 'Bandwidth usage, package renewals, invoices, ticket support'
  },
  {
    domain: 'employee.familytimenet.com',
    label: 'Employee Workspace & Internal CRM',
    targetServiceId: 'ftn-employee-crm',
    upstreamContainer: 'ftn-crm-internal',
    upstreamPort: 8082,
    publicPort: 443,
    sslTlsMode: 'Full HSTS TLS 1.3',
    rbacTier: 'Employee / Staff / Support Agent',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`employee.familytimenet.com`)',
    rateLimitRps: 200,
    notes: 'Internal ticket queue, employee attendance, subscriber KYC processing'
  },
  {
    domain: 'engineer.familytimenet.com',
    label: 'Field Engineer & Fiber Operations',
    targetServiceId: 'ftn-engineer-console',
    upstreamContainer: 'ftn-engineer-app',
    upstreamPort: 8083,
    publicPort: 443,
    sslTlsMode: 'Full HSTS TLS 1.3',
    rbacTier: 'Engineer / Field Technician',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`engineer.familytimenet.com`)',
    rateLimitRps: 200,
    notes: 'GIS fiber joint mapping, PON optical dBm meters, ONU provisioning'
  },
  {
    domain: 'reseller.familytimenet.com',
    label: 'ISP Reseller & Partner Distributor',
    targetServiceId: 'ftn-reseller-portal',
    upstreamContainer: 'ftn-reseller-hub',
    upstreamPort: 8084,
    publicPort: 443,
    sslTlsMode: 'Full HSTS TLS 1.3',
    rbacTier: 'Reseller / Distributor',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`reseller.familytimenet.com`)',
    rateLimitRps: 250,
    notes: 'Sub-account creation, wholesale bandwidth allocation, wallet balance'
  },
  {
    domain: 'partner.familytimenet.com',
    label: 'Carrier Partner & IX Peering',
    targetServiceId: 'ftn-partner-hub',
    upstreamContainer: 'ftn-partner-portal',
    upstreamPort: 8085,
    publicPort: 443,
    sslTlsMode: 'Strict mTLS',
    rbacTier: 'Partner / Carrier Representative',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`partner.familytimenet.com`)',
    rateLimitRps: 150,
    notes: 'BDIX, Equinix, SGIX peering telemetry and cross-connect contracts'
  },
  {
    domain: 'upstream.familytimenet.com',
    label: 'BGP Upstream & Transit Gateway',
    targetServiceId: 'ftn-upstream-telemetry',
    upstreamContainer: 'ftn-bgp-upstream',
    upstreamPort: 8086,
    publicPort: 443,
    sslTlsMode: 'Strict mTLS',
    rbacTier: 'NOC / Upstream / Super Admin',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`upstream.familytimenet.com`)',
    rateLimitRps: 300,
    notes: 'Real-time Tier-1 transit routing (Tata, Telia, Hurricane Electric) & RPKI ROA'
  },
  {
    domain: 'dns.familytimenet.com',
    label: 'FTN Anycast DNS & Encrypted Resolver',
    targetServiceId: 'ftn-dns-anycast',
    upstreamContainer: 'ftn-dnsdist-edge',
    upstreamPort: 5300,
    publicPort: 53,
    sslTlsMode: 'Full HSTS TLS 1.3',
    rbacTier: 'Public / Encrypted DNS (DoH/DoT/DoQ)',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`dns.familytimenet.com`) || PathPrefix(`/dns-query`)',
    rateLimitRps: 15000,
    notes: 'Anycast DNS with dnsdist, CoreDNS, and Unbound high-entropy cache'
  },
  {
    domain: 'noc.familytimenet.com',
    label: 'Smart NOC & Network Operations Center',
    targetServiceId: 'ftn-smart-noc',
    upstreamContainer: 'ftn-noc-dashboard',
    upstreamPort: 8087,
    publicPort: 443,
    sslTlsMode: 'Strict mTLS',
    rbacTier: 'NOC / Engineer / Super Admin',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`noc.familytimenet.com`)',
    rateLimitRps: 400,
    notes: 'Live BGP routes, eBPF drop counters, OLT optical power, dynamic failover'
  },
  {
    domain: 'monitor.familytimenet.com',
    label: 'Observability & OpenSearch SIEM',
    targetServiceId: 'ftn-observability-mesh',
    upstreamContainer: 'ftn-opensearch-grafana',
    upstreamPort: 3001,
    publicPort: 443,
    sslTlsMode: 'Strict mTLS',
    rbacTier: 'NOC / Admin / Super Admin',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`monitor.familytimenet.com`)',
    rateLimitRps: 800,
    notes: 'Prometheus metrics, Loki logs, OpenSearch PPL, Grafana dashboards'
  },
  {
    domain: 'billing.familytimenet.com',
    label: 'Automated Billing & bKash/Nagad Merchant',
    targetServiceId: 'ftn-billing-engine',
    upstreamContainer: 'ftn-billing-service',
    upstreamPort: 8088,
    publicPort: 443,
    sslTlsMode: 'Full HSTS TLS 1.3',
    rbacTier: 'Customer / Reseller / Admin',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`billing.familytimenet.com`)',
    rateLimitRps: 500,
    notes: 'Double-entry accounting, automated invoices, payment webhook handlers'
  },
  {
    domain: 'status.familytimenet.com',
    label: 'Public Status Page & Incident Journal',
    targetServiceId: 'ftn-public-status',
    upstreamContainer: 'ftn-status-service',
    upstreamPort: 8089,
    publicPort: 443,
    sslTlsMode: 'Let\'s Encrypt ACME',
    rbacTier: 'Public',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`status.familytimenet.com`)',
    rateLimitRps: 2000,
    notes: 'Independent public status page cached on global CDN edge nodes'
  },
  {
    domain: 'download.familytimenet.com',
    label: 'Client Applications & App Store',
    targetServiceId: 'ftn-app-download',
    upstreamContainer: 'ftn-app-distribution',
    upstreamPort: 8091,
    publicPort: 443,
    sslTlsMode: 'Let\'s Encrypt ACME',
    rbacTier: 'Public / Customer',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`download.familytimenet.com`)',
    rateLimitRps: 1000,
    notes: 'FTN Connect Android APK, PC WireGuard config, Smart TV M3U profile'
  },
  {
    domain: 'connect.familytimenet.com',
    label: 'ZeroTrust Ingress & WireGuard Mesh',
    targetServiceId: 'ftn-connect-mesh',
    upstreamContainer: 'ftn-wireguard-gateway',
    upstreamPort: 51820,
    publicPort: 51820,
    sslTlsMode: 'Strict mTLS',
    rbacTier: 'Customer / Employee / Member',
    healthStatus: 'HEALTHY',
    reverseProxyPath: 'Host(`connect.familytimenet.com`) || UDP(51820)',
    rateLimitRps: 5000,
    notes: 'Post-quantum ChaCha20-Poly1305 kernel tunnel with Hysteria2 MASQUE fallback'
  }
];

export const FTN_ARCHITECTURE_SERVICES: FtnArchitectureService[] = [
  // ================= 01. CORE / CONTROL PLANE =================
  {
    id: 'ftn-core-control-plane',
    name: 'FTN Core Control Plane',
    sectionId: '01-core-control',
    sectionNumber: '01',
    sectionName: 'Core / Control Plane',
    isNative: true,
    nativeServiceName: 'FTN Control Plane Engine',
    underlyingEngine: 'Go Core Daemon & ETCD Cluster',
    canonicalSubdomain: 'panel.familytimenet.com',
    containerName: 'ftn-core-control',
    internalPort: 8080,
    externalPort: 443,
    protocol: 'gRPC',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`panel.familytimenet.com`)',
      pathPrefix: '/control-plane',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin'],
      authType: 'mTLS'
    },
    healthCheck: {
      endpoint: '/healthz',
      protocol: 'HTTP',
      intervalSeconds: 10,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 3,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'Control Panel',
    implementationState: 'PRODUCTION',
    description: 'Master autonomous orchestration engine managing nodes, tenants, state transitions and event distribution across FTN clusters.',
    keyCapabilities: ['Stateful Raft consensus', 'Cluster membership', 'Distributed lock manager', 'Zero-downtime leader election']
  },
  {
    id: 'ftn-api-gateway-mesh',
    name: 'FTN API Gateway',
    sectionId: '01-core-control',
    sectionNumber: '01',
    sectionName: 'Core / Control Plane',
    isNative: true,
    nativeServiceName: 'FTN API Gateway',
    underlyingEngine: 'Envoy / Go Gateway & Rust eBPF',
    canonicalSubdomain: 'api.familytimenet.com',
    containerName: 'ftn-api-gateway',
    internalPort: 8000,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`api.familytimenet.com`)',
      pathPrefix: '/',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_CHACHA20_POLY1305_SHA256',
      minTlsVersion: '1.3',
      clientCertValidation: 'optional'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin', 'NOC', 'Engineer', 'Employee', 'Customer'],
      authType: 'BearerJWT'
    },
    healthCheck: {
      endpoint: '/api/health',
      protocol: 'HTTP',
      intervalSeconds: 10,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 5,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'API',
    implementationState: 'PRODUCTION',
    description: 'Central API router proxying client requests, enforcing strict rate-limits, mTLS validation, and token translation.',
    keyCapabilities: ['Circuit breaking', 'Dynamic upstream pool routing', 'WAF packet inspection', 'JWT validation cache']
  },
  {
    id: 'ftn-auth-iam-rbac',
    name: 'Authentication / IAM / RBAC',
    sectionId: '01-core-control',
    sectionNumber: '01',
    sectionName: 'Core / Control Plane',
    isNative: true,
    nativeServiceName: 'FTN Identity & IAM',
    underlyingEngine: 'FTN Authoritative Session Store & FIDO2 WebAuthn',
    canonicalSubdomain: 'panel.familytimenet.com',
    containerName: 'ftn-iam-auth',
    internalPort: 8001,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`panel.familytimenet.com`)',
      pathPrefix: '/api/v1/auth',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'none'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin', 'Employee', 'Customer'],
      authType: 'SessionCookie'
    },
    healthCheck: {
      endpoint: '/api/v1/auth/session',
      protocol: 'HTTP',
      intervalSeconds: 10,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 8,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'Auth/RBAC',
    implementationState: 'PRODUCTION',
    description: 'Server-authoritative session manager enforcing Single Sovereign Identity without public self-registration vulnerabilities.',
    keyCapabilities: ['HttpOnly SameSite cookies', 'Hardware FIDO2 passkeys', 'Role-based capability matrices', 'Federated token minting']
  },
  {
    id: 'ftn-tenant-management',
    name: 'Tenant Management',
    sectionId: '01-core-control',
    sectionNumber: '01',
    sectionName: 'Core / Control Plane',
    isNative: true,
    nativeServiceName: 'FTN Multi-Tenant Core',
    underlyingEngine: 'PostgreSQL Schema Isolation & Row-Level Security',
    canonicalSubdomain: 'admin.familytimenet.com',
    containerName: 'ftn-tenant-svc',
    internalPort: 8002,
    externalPort: 443,
    protocol: 'gRPC',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`admin.familytimenet.com`)',
      pathPrefix: '/api/v1/tenants',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Super Admin'],
      authType: 'mTLS'
    },
    healthCheck: {
      endpoint: '/tenants/healthz',
      protocol: 'HTTP',
      intervalSeconds: 15,
      timeoutSeconds: 3,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 6,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'Control Panel',
    implementationState: 'PRODUCTION',
    description: 'Multi-tenant organization boundary isolation for ISP franchises, corporate branches, and personal household groups.',
    keyCapabilities: ['Tenant data compartmentalization', 'Quota & resource limits', 'Custom branding per tenant', 'Isolated audit streams']
  },
  {
    id: 'ftn-approval-change-mgmt',
    name: 'Approval & Change Management',
    sectionId: '01-core-control',
    sectionNumber: '01',
    sectionName: 'Core / Control Plane',
    isNative: true,
    nativeServiceName: 'FTN Approval Engine',
    underlyingEngine: 'FTN Immutable Journal & Dual-Key Approval Guard',
    canonicalSubdomain: 'admin.familytimenet.com',
    containerName: 'ftn-approval-engine',
    internalPort: 8003,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`admin.familytimenet.com`)',
      pathPrefix: '/api/v1/approvals',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin'],
      authType: 'mTLS'
    },
    healthCheck: {
      endpoint: '/approvals/healthz',
      protocol: 'HTTP',
      intervalSeconds: 15,
      timeoutSeconds: 3,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 4,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'Control Panel',
    implementationState: 'PRODUCTION',
    description: 'Approval-first governance policy for all network routing changes, BGP modifications, and billing tariff adjustments.',
    keyCapabilities: ['Dual-custody signing', 'Time-locked change execution', 'Automated pre-flight risk analysis', 'Instant rollback hooks']
  },
  {
    id: 'ftn-job-execution-engine',
    name: 'Job / Execution Engine',
    sectionId: '01-core-control',
    sectionNumber: '01',
    sectionName: 'Core / Control Plane',
    isNative: true,
    nativeServiceName: 'FTN Job Orchestrator',
    underlyingEngine: 'Redis Stream Worker & Go Queue',
    canonicalSubdomain: 'panel.familytimenet.com',
    containerName: 'ftn-job-worker',
    internalPort: 8004,
    externalPort: 443,
    protocol: 'gRPC',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`panel.familytimenet.com`)',
      pathPrefix: '/api/v1/jobs',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'none'
    },
    authRbac: {
      requiredRoles: ['Admin', 'NOC', 'Engineer'],
      authType: 'BearerJWT'
    },
    healthCheck: {
      endpoint: '/jobs/healthz',
      protocol: 'HTTP',
      intervalSeconds: 15,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 7,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'Docker/Health',
    implementationState: 'PRODUCTION',
    description: 'High-throughput async job execution pipeline for OLT provisioning, subscriber billing runs, and backup syncs.',
    keyCapabilities: ['Idempotent job execution', 'Exponential backoff retry', 'Cron scheduling', 'Real-time telemetry event bus']
  },
  {
    id: 'ftn-service-registry',
    name: 'Service Registry & Discovery',
    sectionId: '01-core-control',
    sectionNumber: '01',
    sectionName: 'Core / Control Plane',
    isNative: true,
    nativeServiceName: 'FTN Service Registry',
    underlyingEngine: 'Consul / CoreDNS Internal Mesh',
    canonicalSubdomain: 'panel.familytimenet.com',
    containerName: 'ftn-service-registry',
    internalPort: 8500,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`panel.familytimenet.com`)',
      pathPrefix: '/api/v1/services/registry',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'none'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin', 'NOC', 'Engineer', 'Employee', 'Customer'],
      authType: 'SessionCookie'
    },
    healthCheck: {
      endpoint: '/api/v1/services/registry',
      protocol: 'HTTP',
      intervalSeconds: 10,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 4,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'API',
    implementationState: 'PRODUCTION',
    description: 'Authoritative catalog of all 18 service layers with dynamic health score evaluation and endpoint resolution.',
    keyCapabilities: ['Dynamic health probing', 'Multi-datacenter awareness', 'Zero-config auto-discovery', 'Tag-based service routing']
  },

  // ================= 02. AI PLATFORM =================
  {
    id: 'ftn-ai-core',
    name: 'FTN AI Core & Agent Runtime',
    sectionId: '02-ai-platform',
    sectionNumber: '02',
    sectionName: 'AI Platform',
    isNative: true,
    nativeServiceName: 'FTN AI Agent Engine',
    underlyingEngine: 'Google GenAI SDK (gemini-2.5-flash-lite / pro) & Local Ollama Fallback',
    canonicalSubdomain: 'ai.familytimenet.com',
    containerName: 'ftn-ai-core',
    internalPort: 8090,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`ai.familytimenet.com`)',
      pathPrefix: '/',
      tlsResolver: 'Let\'s Encrypt ACME'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'none'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin', 'NOC', 'Customer'],
      authType: 'SessionCookie'
    },
    healthCheck: {
      endpoint: '/api/ftn-ai/chat',
      protocol: 'HTTP',
      intervalSeconds: 15,
      timeoutSeconds: 5,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 24,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'AI',
    implementationState: 'PRODUCTION',
    description: 'High-speed reasoning agent automating BGP route selection, subscriber anomaly diagnosis, and double-entry accounting reconciliation.',
    keyCapabilities: ['Server-side Gemini API isolation', 'Local Ollama zero-egress fallback', 'Context-aware NOC telemetry embeddings', 'Approval-first action staging']
  },
  {
    id: 'ftn-ai-noc-intel',
    name: 'AI NOC & Network Intelligence',
    sectionId: '02-ai-platform',
    sectionNumber: '02',
    sectionName: 'AI Platform',
    isNative: true,
    nativeServiceName: 'FTN AI NOC Intelligence',
    underlyingEngine: 'OpenSearch ML Anomaly Detector & NetFlow Vector Analysis',
    canonicalSubdomain: 'ai.familytimenet.com',
    containerName: 'ftn-ai-noc',
    internalPort: 8092,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`ai.familytimenet.com`)',
      pathPrefix: '/noc-intel',
      tlsResolver: 'Let\'s Encrypt ACME'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'none'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin', 'NOC'],
      authType: 'BearerJWT'
    },
    healthCheck: {
      endpoint: '/ai/noc/healthz',
      protocol: 'HTTP',
      intervalSeconds: 15,
      timeoutSeconds: 3,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 18,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'AI',
    implementationState: 'PRODUCTION',
    description: 'Predictive fiber degradation detector, optical power fluctuation forecaster, and BGP route flap dampening advisor.',
    keyCapabilities: ['Optical attenuation trend analysis', 'DDoS pattern recognition', 'Pre-emptive link rerouting', 'Root cause clustering']
  },
  {
    id: 'ftn-ai-billing-intel',
    name: 'AI Billing Intelligence & Ledger Reconciliation',
    sectionId: '02-ai-platform',
    sectionNumber: '02',
    sectionName: 'AI Platform',
    isNative: true,
    nativeServiceName: 'FTN AI Billing Intelligence',
    underlyingEngine: 'FTN Double-Entry GAAP Ledger & ML Fraud Guard',
    canonicalSubdomain: 'billing.familytimenet.com',
    containerName: 'ftn-ai-billing',
    internalPort: 8093,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`billing.familytimenet.com`)',
      pathPrefix: '/ai-intel',
      tlsResolver: 'Full HSTS TLS 1.3'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'none'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin'],
      authType: 'SessionCookie'
    },
    healthCheck: {
      endpoint: '/billing/ai/healthz',
      protocol: 'HTTP',
      intervalSeconds: 20,
      timeoutSeconds: 3,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 29,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'AI',
    implementationState: 'PRODUCTION',
    description: 'Reconciles bKash/Nagad transactions, flags suspicious billing voids, predicts bandwidth revenue margins.',
    keyCapabilities: ['Instant multi-currency exchange balancing', 'Subscriber churn prediction', 'Payment gateway fee optimization', 'Audit trail certification']
  },

  // ================= 03. CONTROL PANELS =================
  {
    id: 'ftn-panel-superadmin',
    name: 'Super Admin Control Center',
    sectionId: '03-control-panels',
    sectionNumber: '03',
    sectionName: 'Control Panels',
    isNative: true,
    nativeServiceName: 'FTN SuperAdmin Master',
    underlyingEngine: 'FTN React 19 / Tailwind / Server Session',
    canonicalSubdomain: 'admin.familytimenet.com',
    containerName: 'ftn-panel-master',
    internalPort: 3000,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`admin.familytimenet.com`)',
      pathPrefix: '/',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Super Admin'],
      authType: 'mTLS'
    },
    healthCheck: {
      endpoint: '/healthz',
      protocol: 'HTTP',
      intervalSeconds: 10,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 6,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'Control Panel',
    implementationState: 'PRODUCTION',
    description: 'Master sovereign control plane for root administrator: key revocation, cluster scale, emergency lockdown.',
    keyCapabilities: ['Hardware security token enforce', 'System wide health gating', 'Master database migration trigger', 'Global configuration rollbacks']
  },
  {
    id: 'ftn-panel-noc-ops',
    name: 'NOC & Operations Panel',
    sectionId: '03-control-panels',
    sectionNumber: '03',
    sectionName: 'Control Panels',
    isNative: true,
    nativeServiceName: 'FTN NOC Console',
    underlyingEngine: 'FTN Smart NOC Dashboard & GIS Fiber Engine',
    canonicalSubdomain: 'noc.familytimenet.com',
    containerName: 'ftn-panel-noc',
    internalPort: 3000,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`noc.familytimenet.com`)',
      pathPrefix: '/',
      tlsResolver: 'Strict mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'optional'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin', 'NOC', 'Engineer'],
      authType: 'SessionCookie'
    },
    healthCheck: {
      endpoint: '/api/v1/services/registry',
      protocol: 'HTTP',
      intervalSeconds: 10,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 8,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'Control Panel',
    implementationState: 'PRODUCTION',
    description: 'Real-time telemetry, BGP peer status, MikroTik router health, OLT optical status, and live incident room.',
    keyCapabilities: ['Sub-second NetFlow visualization', 'BGP neighbor reset with approval', 'OLT port bounce', 'Emergency SMS broadcast to NOC']
  },

  // ================= 04. NETWORK / ISP CORE =================
  {
    id: 'ftn-core-router-bgp',
    name: 'FTN Core Router & GoBGP Engine',
    sectionId: '04-network-isp',
    sectionNumber: '04',
    sectionName: 'Network / ISP Core',
    isNative: true,
    nativeServiceName: 'FTN Autonomous Router',
    underlyingEngine: 'GoBGP v3 & Linux Kernel VRF / eBPF XDP',
    canonicalSubdomain: 'upstream.familytimenet.com',
    containerName: 'ftn-core-router',
    internalPort: 179,
    externalPort: 179,
    protocol: 'TCP',
    reverseProxyRule: {
      routerType: 'Nginx',
      hostRule: 'TCP Stream 179',
      pathPrefix: '/',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'NOC'],
      authType: 'mTLS'
    },
    healthCheck: {
      endpoint: 'bgp-check',
      protocol: 'TCP',
      intervalSeconds: 5,
      timeoutSeconds: 1,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 2,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'Docker/Health',
    implementationState: 'PRODUCTION',
    description: 'AS64512 Full-mesh BGP daemon peering with Upstream Transits, IXPs, RPKI validation cache, and multi-carrier load distribution.',
    keyCapabilities: ['RPKI ROA validation', 'BFD sub-second link failure detection', 'IPv4/IPv6 dual-stack anycast', 'eBPF DDoS packet drop']
  },
  {
    id: 'ftn-olt-onu-manager',
    name: 'OLT/ONU GPON Integration & Auto-Provisioning',
    sectionId: '04-network-isp',
    sectionNumber: '04',
    sectionName: 'Network / ISP Core',
    isNative: true,
    nativeServiceName: 'FTN OLT Provisioner',
    underlyingEngine: 'Universal GPON Driver (Huawei, ZTE, FiberHome, BDCOM)',
    canonicalSubdomain: 'engineer.familytimenet.com',
    containerName: 'ftn-olt-engine',
    internalPort: 8083,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`engineer.familytimenet.com`)',
      pathPrefix: '/olt',
      tlsResolver: 'Full HSTS TLS 1.3'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'none'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin', 'Engineer'],
      authType: 'SessionCookie'
    },
    healthCheck: {
      endpoint: '/olt/healthz',
      protocol: 'HTTP',
      intervalSeconds: 10,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 12,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'Docker/Health',
    implementationState: 'PRODUCTION',
    description: 'Hardware abstraction layer for multi-vendor OLTs supporting auto-discovery of unconfigured ONUs and optical budget telemetry.',
    keyCapabilities: ['OMCI profile push', 'Optical Rx/Tx dBm monitoring', 'Auto VLAN assignment', 'Rogue ONU quarantine']
  },

  // ================= 05. DNS =================
  {
    id: 'ftn-dns-architecture-mesh',
    name: 'FTN Anycast DNS (dnsdist + CoreDNS + Unbound)',
    sectionId: '05-dns',
    sectionNumber: '05',
    sectionName: 'DNS',
    isNative: true,
    nativeServiceName: 'FTN Anycast DNS Guard',
    underlyingEngine: 'dnsdist (frontend load-balancer) + CoreDNS (authoritative) + Unbound (recursor)',
    canonicalSubdomain: 'dns.familytimenet.com',
    containerName: 'ftn-dns-stack',
    internalPort: 5300,
    externalPort: 53,
    protocol: 'DNS',
    reverseProxyRule: {
      routerType: 'FTN-Edge-Proxy',
      hostRule: 'Host(`dns.familytimenet.com`) || UDP/TCP 53',
      pathPrefix: '/dns-query',
      tlsResolver: 'Full HSTS TLS 1.3'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_CHACHA20_POLY1305_SHA256',
      minTlsVersion: '1.3',
      clientCertValidation: 'none'
    },
    authRbac: {
      requiredRoles: ['Public'],
      authType: 'None'
    },
    healthCheck: {
      endpoint: '127.0.0.1:5300',
      protocol: 'DNS',
      intervalSeconds: 5,
      timeoutSeconds: 1,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 4,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'Subdomain/Reverse Proxy',
    implementationState: 'PRODUCTION',
    description: 'High-entropy DoH/DoT/DoQ resolver filtering malicious malware, phishing, and enforcing safe-search for family subscribers.',
    keyCapabilities: ['0.00ms cached response latency', 'DNSSEC validation', 'DoH over HTTP/3 (RFC 9250)', 'Rate-limiting & DNS amplificaton drop']
  },

  // ================= 06. TRAFFIC / OBSERVABILITY =================
  {
    id: 'ftn-observability-stack',
    name: 'Observability (Prometheus + Grafana + OpenSearch SIEM)',
    sectionId: '06-traffic-observability',
    sectionNumber: '06',
    sectionName: 'Traffic / Observability',
    isNative: true,
    nativeServiceName: 'FTN Telemetry & SIEM',
    underlyingEngine: 'Prometheus v3 + OpenSearch v2.18 + Loki + Telegraf',
    canonicalSubdomain: 'monitor.familytimenet.com',
    containerName: 'ftn-monitor-stack',
    internalPort: 9200,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`monitor.familytimenet.com`)',
      pathPrefix: '/',
      tlsResolver: 'Strict mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'optional'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin', 'NOC'],
      authType: 'SessionCookie'
    },
    healthCheck: {
      endpoint: '/_cluster/health',
      protocol: 'HTTP',
      intervalSeconds: 15,
      timeoutSeconds: 3,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 14,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'Control Panel',
    implementationState: 'PRODUCTION',
    description: 'Full-stack observability capturing NetFlow v9/IPFIX, router SNMP, container cAdvisor stats, and syslog SIEM correlations.',
    keyCapabilities: ['PPL structured querying', 'Random Cut Forest anomaly detection', 'Zero-loss log shipping', 'SLA latency heatmaps']
  },

  // ================= 07. SECURITY =================
  {
    id: 'ftn-security-nftables-ebpf',
    name: 'FTN Security & eBPF/XDP Firewall Controller',
    sectionId: '07-security',
    sectionNumber: '07',
    sectionName: 'Security',
    isNative: true,
    nativeServiceName: 'FTN Firewall Controller',
    underlyingEngine: 'nftables & Rust Aya eBPF/XDP Kernel Hooks',
    canonicalSubdomain: 'panel.familytimenet.com',
    containerName: 'ftn-firewall-core',
    internalPort: 8010,
    externalPort: 443,
    protocol: 'gRPC',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`panel.familytimenet.com`)',
      pathPrefix: '/security/firewall',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'NOC'],
      authType: 'mTLS'
    },
    healthCheck: {
      endpoint: '/api/mesh/rust-filter',
      protocol: 'HTTP',
      intervalSeconds: 10,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 2,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'Auth/RBAC',
    implementationState: 'PRODUCTION',
    description: 'Hardware NIC-level packet mitigation dropping SYN floods, UDP amplification, and malformed fragments at line-rate.',
    keyCapabilities: ['100Gbps line-rate drop', 'Stateful connection tracking', 'Strict RPF anti-spoofing', 'mTLS internal PKI certificate authority']
  },

  // ================= 08. CUSTOMER / ISP SERVICES =================
  {
    id: 'ftn-customer-billing-services',
    name: 'Customer Portal, Billing & bKash/Nagad Gateway',
    sectionId: '08-customer-isp',
    sectionNumber: '08',
    sectionName: 'Customer / ISP Services',
    isNative: true,
    nativeServiceName: 'FTN Customer Service Core',
    underlyingEngine: 'FTN Subscriber Core & bKash/Nagad Merchant APIs',
    canonicalSubdomain: 'billing.familytimenet.com',
    containerName: 'ftn-customer-billing',
    internalPort: 8088,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`billing.familytimenet.com`) || Host(`portal.familytimenet.com`)',
      pathPrefix: '/billing',
      tlsResolver: 'Full HSTS TLS 1.3'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'none'
    },
    authRbac: {
      requiredRoles: ['Customer', 'Reseller', 'Admin'],
      authType: 'SessionCookie'
    },
    healthCheck: {
      endpoint: '/billing/healthz',
      protocol: 'HTTP',
      intervalSeconds: 15,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 9,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'Subdomain/Reverse Proxy',
    implementationState: 'PRODUCTION',
    description: 'End-to-end subscriber billing cycle with instant bKash Tokenized Checkout, auto-renewal, and WhatsApp payment notifications.',
    keyCapabilities: ['Instant payment webhook confirmation', 'PPPoE bandwidth profile unblock', 'Automated PDF tax invoices', 'SMS reminder scheduler']
  },

  // ================= 09. CLIENT APPLICATIONS =================
  {
    id: 'ftn-client-apps-distribution',
    name: 'FTN Client Apps (Android APK, PC Tunnel, Smart TV)',
    sectionId: '09-client-apps',
    sectionNumber: '09',
    sectionName: 'Client Applications',
    isNative: true,
    nativeServiceName: 'FTN Application Distribution',
    underlyingEngine: 'Flutter Android SDK + WireGuard Go + Tauri Desktop',
    canonicalSubdomain: 'download.familytimenet.com',
    containerName: 'ftn-apps-distribution',
    internalPort: 8091,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`download.familytimenet.com`)',
      pathPrefix: '/',
      tlsResolver: 'Let\'s Encrypt ACME'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'none'
    },
    authRbac: {
      requiredRoles: ['Public', 'Customer'],
      authType: 'None'
    },
    healthCheck: {
      endpoint: '/api/v1/ftn/android/status',
      protocol: 'HTTP',
      intervalSeconds: 10,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 14,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'Subdomain/Reverse Proxy',
    implementationState: 'PRODUCTION',
    description: 'Signed mobile applications providing Zero-Trust mesh connection, live ping diagnostics, and one-click bill payment.',
    keyCapabilities: ['Android WireGuard kernel service', 'Biometric login passkeys', 'Live telemetry ping test', 'OTA background updates']
  },

  // ================= 10. IPTV / MEDIA =================
  {
    id: 'ftn-iptv-media-srs',
    name: 'FTN IPTV & Stream Distribution (SRS + Tokenized M3U)',
    sectionId: '10-iptv-media',
    sectionNumber: '10',
    sectionName: 'IPTV / Media',
    isNative: true,
    nativeServiceName: 'FTN IPTV Core',
    underlyingEngine: 'SRS (Simple Realtime Server) v6 & Flussonic Edge',
    canonicalSubdomain: 'familytimenet.com',
    containerName: 'ftn-iptv-streamer',
    internalPort: 1935,
    externalPort: 8443,
    protocol: 'RTMP/HLS',
    reverseProxyRule: {
      routerType: 'Nginx',
      hostRule: 'Host(`familytimenet.com`)',
      pathPrefix: '/live/m3u',
      tlsResolver: 'Full HSTS TLS 1.3'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'none'
    },
    authRbac: {
      requiredRoles: ['Customer', 'Admin'],
      authType: 'BearerJWT'
    },
    healthCheck: {
      endpoint: '/api/v1/vhosts',
      protocol: 'HTTP',
      intervalSeconds: 15,
      timeoutSeconds: 3,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 11,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'Extended Services',
    implementationState: 'ACTIVE_SERVICE',
    description: 'Sub-second low-latency HLS/DASH media streaming over FTN ISP internal optical backbone with encrypted token authorization.',
    keyCapabilities: ['H.265/HEVC hardware transcoding', 'Tokenized M3U expiration', 'Zero-buffer internal CDN caching', 'EPG program guide injection']
  },

  // ================= 11. EDGE / PROXY / TUNNEL =================
  {
    id: 'ftn-edge-wireguard-tunnel',
    name: 'FTN Edge, Reverse Proxy & Zero-Trust WireGuard Tunnel',
    sectionId: '11-edge-proxy-tunnel',
    sectionNumber: '11',
    sectionName: 'Edge / Proxy / Tunnel',
    isNative: true,
    nativeServiceName: 'FTN Edge & Tunnel Controller',
    underlyingEngine: 'Linux WireGuard Kernel + Hysteria2 (QUIC) + AmneziaWG',
    canonicalSubdomain: 'connect.familytimenet.com',
    containerName: 'ftn-edge-proxy',
    internalPort: 51820,
    externalPort: 51820,
    protocol: 'HTTP/3 (QUIC)',
    reverseProxyRule: {
      routerType: 'FTN-Edge-Proxy',
      hostRule: 'Host(`connect.familytimenet.com`)',
      pathPrefix: '/',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_CHACHA20_POLY1305_SHA256',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Customer', 'Employee', 'Admin'],
      authType: 'mTLS'
    },
    healthCheck: {
      endpoint: 'wg-ping',
      protocol: 'UDP',
      intervalSeconds: 5,
      timeoutSeconds: 1,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 6,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'Subdomain/Reverse Proxy',
    implementationState: 'PRODUCTION',
    description: 'Global Edge Ingress point providing post-quantum WireGuard encryption and UDP obfuscation against Deep Packet Inspection.',
    keyCapabilities: ['Kernel-level WireGuard routing', 'Hysteria2 MASQUE anti-censorship', 'Zero packet loss under 20% jitter', 'Dynamic Anycast failover']
  },

  // ================= 12. PROVIDER / EXTERNAL INTEGRATION =================
  {
    id: 'ftn-provider-integrations',
    name: 'Provider & External Integration (Cloudflare, Akamai, BDIX, GGC)',
    sectionId: '12-provider-integration',
    sectionNumber: '12',
    sectionName: 'Provider / External Integration',
    isNative: true,
    nativeServiceName: 'FTN Provider Peering Gateway',
    underlyingEngine: 'BGP EVPN Peering & Cloud API Connectors',
    canonicalSubdomain: 'partner.familytimenet.com',
    containerName: 'ftn-provider-hub',
    internalPort: 8085,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`partner.familytimenet.com`)',
      pathPrefix: '/peering',
      tlsResolver: 'Strict mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'NOC', 'Partner'],
      authType: 'mTLS'
    },
    healthCheck: {
      endpoint: '/peering/healthz',
      protocol: 'HTTP',
      intervalSeconds: 15,
      timeoutSeconds: 3,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 16,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'Extended Services',
    implementationState: 'PRODUCTION',
    description: 'Direct peering agreements, Google Global Cache (GGC) node telemetry, and Akamai content synchronization interfaces.',
    keyCapabilities: ['BDIX latency optimization (<5ms)', 'Cloudflare Railgun bypass', 'Direct S3 edge ingress', 'Upstream SLA continuous verification']
  },

  // ================= 13. DATA / DATABASE =================
  {
    id: 'ftn-database-timescale-pg',
    name: 'Data Layer (PostgreSQL + PgBouncer + TimescaleDB)',
    sectionId: '13-data-database',
    sectionNumber: '13',
    sectionName: 'Data / Database',
    isNative: true,
    nativeServiceName: 'FTN Database Engine',
    underlyingEngine: 'PostgreSQL 17 + TimescaleDB 2.17 + PgBouncer Pooler',
    canonicalSubdomain: 'hosting.familytimenet.com',
    containerName: 'ftn-postgres-cluster',
    internalPort: 5432,
    externalPort: 6432,
    protocol: 'TCP',
    reverseProxyRule: {
      routerType: 'Nginx',
      hostRule: 'TCP Stream 6432',
      pathPrefix: '/',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Super Admin'],
      authType: 'mTLS'
    },
    healthCheck: {
      endpoint: 'pg_isready',
      protocol: 'TCP',
      intervalSeconds: 5,
      timeoutSeconds: 1,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 2,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'DB',
    implementationState: 'PRODUCTION',
    description: 'High-availability primary database with automated partition compression, PgBouncer connection pooling, and sub-millisecond hypertable queries.',
    keyCapabilities: ['10,000 pooled connections', 'Time-series NetFlow chunk compression', 'Row-Level Security (RLS)', 'Point-in-Time Recovery (PITR)']
  },

  // ================= 14. BACKUP / STORAGE =================
  {
    id: 'ftn-kopia-backup-storage',
    name: 'Backup & Storage (Kopia Deduplication Vault + S3)',
    sectionId: '14-backup-storage',
    sectionNumber: '14',
    sectionName: 'Backup / Storage',
    isNative: true,
    nativeServiceName: 'FTN Encrypted Vault Core',
    underlyingEngine: 'Kopia CLI Engine & MinIO S3 Object Store',
    canonicalSubdomain: 'vault.familytimenet.com',
    containerName: 'ftn-kopia-vault',
    internalPort: 51515,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`vault.familytimenet.com`)',
      pathPrefix: '/',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin'],
      authType: 'SessionCookie'
    },
    healthCheck: {
      endpoint: '/api/v1/kopia/status',
      protocol: 'HTTP',
      intervalSeconds: 20,
      timeoutSeconds: 3,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 18,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'Docker/Health',
    implementationState: 'PRODUCTION',
    description: 'Zero-knowledge end-to-end encrypted backup repository with content-addressable deduplication and cross-region disaster recovery replication.',
    keyCapabilities: ['AES-256-GCM encryption', 'ZSTD level-3 compression', 'Automated snapshot verification', 'Instant file-level mount & restore']
  },

  // ================= 15. DEPLOYMENT / INFRASTRUCTURE =================
  {
    id: 'ftn-deployment-k3s-proxmox',
    name: 'Deployment & Infrastructure (Docker Compose + K3s + Health Gates)',
    sectionId: '15-deployment-infra',
    sectionNumber: '15',
    sectionName: 'Deployment / Infrastructure',
    isNative: true,
    nativeServiceName: 'FTN Deployment Manager',
    underlyingEngine: 'Docker Compose v2.30 & K3s Light Kubernetes',
    canonicalSubdomain: 'panel.familytimenet.com',
    containerName: 'ftn-deploy-manager',
    internalPort: 8095,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`panel.familytimenet.com`)',
      pathPrefix: '/deploy',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin'],
      authType: 'mTLS'
    },
    healthCheck: {
      endpoint: '/deploy/healthz',
      protocol: 'HTTP',
      intervalSeconds: 15,
      timeoutSeconds: 3,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 7,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'Docker/Health',
    implementationState: 'PRODUCTION',
    description: 'One-click production deploy controller with preflight port checks, migration dry-runs, and automated canary rollbacks.',
    keyCapabilities: ['Preflight port & storage validation', 'Zero-downtime rolling restart', 'CI/CD container build gates', 'Immutable release checksums']
  },

  // ================= 16. NOC / OPERATIONS =================
  {
    id: 'ftn-smart-noc-operations',
    name: 'Smart NOC, GIS Fiber Topology & Incident Management',
    sectionId: '16-noc-operations',
    sectionNumber: '16',
    sectionName: 'NOC / Operations',
    isNative: true,
    nativeServiceName: 'FTN Smart NOC Engine',
    underlyingEngine: 'FTN GIS Fiber Core & Incident Telemetry Engine',
    canonicalSubdomain: 'noc.familytimenet.com',
    containerName: 'ftn-noc-core',
    internalPort: 8087,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`noc.familytimenet.com`)',
      pathPrefix: '/',
      tlsResolver: 'Strict mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'optional'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin', 'NOC', 'Engineer'],
      authType: 'SessionCookie'
    },
    healthCheck: {
      endpoint: '/noc/healthz',
      protocol: 'HTTP',
      intervalSeconds: 10,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 10,
      lastChecked: '2026-09-03 23:05:00'
    },
    priorityTier: 'Control Panel',
    implementationState: 'PRODUCTION',
    description: 'Map-based visualization of optical fiber routes, splice enclosure joints, OLT splitter loss, and automated ticket escalation.',
    keyCapabilities: ['GIS interactive fiber map', 'OTDR distance break calculation', 'Auto ticket creation upon alarm', 'Live SLA tracking']
  },

  // ================= 17. AUTOMATION =================
  {
    id: 'ftn-automation-engine',
    name: 'Autonomous Provisioning & Auto-Health Recovery',
    sectionId: '17-automation',
    sectionNumber: '17',
    sectionName: 'Automation',
    isNative: true,
    nativeServiceName: 'FTN Automation Engine',
    underlyingEngine: 'FTN Event Bus & Approval-Controlled Script Runner',
    canonicalSubdomain: 'panel.familytimenet.com',
    containerName: 'ftn-automation-svc',
    internalPort: 8096,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`panel.familytimenet.com`)',
      pathPrefix: '/automation',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Super Admin', 'Admin', 'NOC'],
      authType: 'SessionCookie'
    },
    healthCheck: {
      endpoint: '/automation/healthz',
      protocol: 'HTTP',
      intervalSeconds: 15,
      timeoutSeconds: 3,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 5,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'AI',
    implementationState: 'PRODUCTION',
    description: 'Zero-touch provisioning discovering new MikroTik switches and Huawei ONUs, self-healing degraded routing paths.',
    keyCapabilities: ['Zero-touch auto discovery', 'Approval-gated script execution', 'Auto configuration push via SSH/API', 'Self-healing service reboot']
  },

  // ================= 18. GOVERNANCE =================
  {
    id: 'ftn-governance-audit-compliance',
    name: 'Governance, Immutable Audit Trail & Policy Enforcement',
    sectionId: '18-governance',
    sectionNumber: '18',
    sectionName: 'Governance',
    isNative: true,
    nativeServiceName: 'FTN Governance & Audit Core',
    underlyingEngine: 'Cryptographic Hash-Chained Audit Ledger',
    canonicalSubdomain: 'admin.familytimenet.com',
    containerName: 'ftn-governance-ledger',
    internalPort: 8097,
    externalPort: 443,
    protocol: 'HTTP/2',
    reverseProxyRule: {
      routerType: 'Traefik',
      hostRule: 'Host(`admin.familytimenet.com`)',
      pathPrefix: '/governance',
      tlsResolver: 'Internal PKI mTLS'
    },
    tlsConfig: {
      enabled: true,
      cipherSuite: 'TLS_AES_256_GCM_SHA384',
      minTlsVersion: '1.3',
      clientCertValidation: 'required_mtls'
    },
    authRbac: {
      requiredRoles: ['Super Admin'],
      authType: 'mTLS'
    },
    healthCheck: {
      endpoint: '/governance/healthz',
      protocol: 'HTTP',
      intervalSeconds: 20,
      timeoutSeconds: 2,
      currentStatus: 'HEALTHY',
      lastLatencyMs: 4,
      lastChecked: '2026-09-03 23:00:00'
    },
    priorityTier: 'Auth/RBAC',
    implementationState: 'PRODUCTION',
    description: 'Tamper-evident cryptographic ledger recording every configuration edit, user login, and automated execution with SHA-256 chain.',
    keyCapabilities: ['Immutable append-only journal', 'Non-repudiation cryptographic signatures', 'Regulatory ISP compliance reports', 'SOC2 / ISO 27001 export']
  }
];

export const HEALTH_GATE_SUMMARY: HealthGateSummary = {
  overallHealthScore: 99.98,
  totalServices: FTN_ARCHITECTURE_SERVICES.length,
  healthyCount: FTN_ARCHITECTURE_SERVICES.filter(s => s.healthCheck.currentStatus === 'HEALTHY').length,
  degradedCount: FTN_ARCHITECTURE_SERVICES.filter(s => s.healthCheck.currentStatus === 'DEGRADED').length,
  stagedCount: FTN_ARCHITECTURE_SERVICES.filter(s => s.healthCheck.currentStatus === 'PROVISIONING').length,
  nativeServicesCount: FTN_ARCHITECTURE_SERVICES.filter(s => s.isNative).length,
  thirdPartyEnginesCount: FTN_ARCHITECTURE_SERVICES.length, // Each service binds an underlying engine
  timestamp: new Date().toISOString()
};
