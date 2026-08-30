import type { TransportCapability, TransportKind } from "./transport-registry";
import { selectBestPath, type PathSelectionPolicy } from "./path-selector";

export type CoreCapabilityClass =
  | "KERNEL" | "SECURE_TUNNEL" | "OVERLAY" | "ROUTING" | "DNS_PKI"
  | "TELEMETRY" | "SECURITY" | "PROXY" | "SERVICE" | "MANAGEMENT"
  | "CLIENT" | "EXPERIMENTAL";

export type CoreCapability = {
  id: string;
  name: string;
  class: CoreCapabilityClass;
  kind: TransportKind | "OTHER";
  enabled: boolean;
  policyRequired: true;
  approvalRequired: boolean;
  supportsTraffic: boolean;
  experimental?: boolean;
  notes?: string;
};

export type CoreRouterPolicy = PathSelectionPolicy & {
  allowedCapabilityIds: string[];
  autoEnabled: boolean;
  manualApprovalRequired: boolean;
};

export type CoreRouterDecision = {
  allowed: boolean;
  selectedPathId?: string;
  requiresApproval: boolean;
  reason: "POLICY_DENY" | "NO_HEALTHY_PATH" | "APPROVAL_REQUIRED" | "ALLOWED";
};

/**
 * Central defensive policy boundary for FTN Core Router.
 * This class selects eligible capabilities but intentionally exposes no route-mutation API.
 */
export class FtnCoreRouter {
  constructor(private readonly capabilities: CoreCapability[]) {}

  listCapabilities(): CoreCapability[] {
    return this.capabilities.map((capability) => ({ ...capability }));
  }

  decide(paths: TransportCapability[], policy: CoreRouterPolicy): CoreRouterDecision {
    const allowed = new Set(policy.allowedCapabilityIds);
    const eligible = paths.filter((path) => allowed.has(path.id));
    if (eligible.length === 0) {
      return { allowed: false, requiresApproval: false, reason: "POLICY_DENY" };
    }

    const selected = selectBestPath(eligible, policy);
    if (!selected) {
      return { allowed: false, requiresApproval: false, reason: "NO_HEALTHY_PATH" };
    }

    if (!policy.autoEnabled || policy.manualApprovalRequired) {
      return { allowed: true, selectedPathId: selected.id, requiresApproval: true, reason: "APPROVAL_REQUIRED" };
    }

    return { allowed: true, selectedPathId: selected.id, requiresApproval: false, reason: "ALLOWED" };
  }
}

/** Canonical FTN capability inventory. Availability is discovered at runtime; policy controls usage. */
export const FTN_CORE_CAPABILITIES: CoreCapability[] = [
  { id: "linux-kernel", name: "Linux Kernel networking", class: "KERNEL", kind: "OTHER", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: true },
  { id: "sock-raw", name: "SOCK_RAW", class: "KERNEL", kind: "SOCKET", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: true },
  { id: "can-raw", name: "CAN_RAW / can_filter", class: "KERNEL", kind: "SOCKET", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: false },
  { id: "wireguard", name: "WireGuard", class: "SECURE_TUNNEL", kind: "TUNNEL", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "amneziawg", name: "AmneziaWG", class: "SECURE_TUNNEL", kind: "TUNNEL", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "aether-core", name: "Aether-Core", class: "SECURE_TUNNEL", kind: "TUNNEL", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: true },
  { id: "hysteria2", name: "Hysteria2 / QUIC", class: "SECURE_TUNNEL", kind: "QUIC", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "shadowsocks", name: "Shadowsocks", class: "PROXY", kind: "PROXY", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "sing-box", name: "sing-box transport framework", class: "PROXY", kind: "PROXY", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "openvpn", name: "OpenVPN", class: "SECURE_TUNNEL", kind: "VPN", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "ipsec", name: "IPsec / IKEv2", class: "SECURE_TUNNEL", kind: "VPN", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "gre", name: "GRE", class: "OVERLAY", kind: "TUNNEL", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "vxlan", name: "VXLAN", class: "OVERLAY", kind: "OVERLAY", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "geneve", name: "Geneve", class: "OVERLAY", kind: "OVERLAY", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "kube-ovn", name: "Kube-OVN", class: "OVERLAY", kind: "OVERLAY", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "vpp", name: "FD.io / VPP", class: "OVERLAY", kind: "OVERLAY", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: true },
  { id: "gobgp", name: "GoBGP", class: "ROUTING", kind: "ROUTING", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: true },
  { id: "frr", name: "FRR", class: "ROUTING", kind: "ROUTING", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: true },
  { id: "bgp-evpn", name: "BGP EVPN", class: "ROUTING", kind: "ROUTING", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: true },
  { id: "isis", name: "IS-IS", class: "ROUTING", kind: "ROUTING", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: true },
  { id: "ftn-dns", name: "FTN DNS", class: "DNS_PKI", kind: "API", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: false },
  { id: "ftn-ddns", name: "FTN DDNS Mesh", class: "DNS_PKI", kind: "API", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: false },
  { id: "acme", name: "ACME certificate automation", class: "DNS_PKI", kind: "API", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: false },
  { id: "ftn-pki", name: "FTN PKI / mTLS", class: "DNS_PKI", kind: "TLS", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: false },
  { id: "netflow-ipfix", name: "NetFlow v5/v9 + IPFIX", class: "TELEMETRY", kind: "API", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: false },
  { id: "yaf-silk", name: "YAF / SiLK / rwflowpack", class: "TELEMETRY", kind: "API", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: false },
  { id: "pmacct-goflow2", name: "pmacct / GoFlow2", class: "TELEMETRY", kind: "API", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: false },
  { id: "opentelemetry", name: "OpenTelemetry / Jaeger", class: "TELEMETRY", kind: "API", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: false },
  { id: "zero-trust", name: "Zero Trust Gateway", class: "SECURITY", kind: "OTHER", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: true },
  { id: "anti-spoofing", name: "Anti-spoofing", class: "SECURITY", kind: "OTHER", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: true },
  { id: "wazuh", name: "Wazuh security telemetry", class: "SECURITY", kind: "API", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: false },
  { id: "xray", name: "Xray / next-gen transport adapter", class: "EXPERIMENTAL", kind: "PROXY", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: true, experimental: true },
  { id: "experimental-bypass", name: "Protocol parsing discrepancy research", class: "EXPERIMENTAL", kind: "OTHER", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: false, experimental: true, notes: "Research metadata only; no bypass automation or evasion routine." },
  { id: "ftn-rmd", name: "FTN RMD-to-RMD", class: "SERVICE", kind: "API", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "stun-nat", name: "STUN / NAT traversal", class: "CLIENT", kind: "SOCKET", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: true },
  { id: "ssh-management", name: "SSH management", class: "MANAGEMENT", kind: "MANAGEMENT", enabled: true, policyRequired: true, approvalRequired: true, supportsTraffic: false },
  { id: "ftn-app-services", name: "FTN application/service fabric", class: "SERVICE", kind: "API", enabled: true, policyRequired: true, approvalRequired: false, supportsTraffic: false },
];
