import type { TransportAdapter, TransportCapability, TransportKind } from "./transport-registry";

export type AdapterProbe = () => Promise<boolean>;

export type StaticTransportAdapterOptions = {
  id: string;
  kind: TransportKind;
  displayName: string;
  supportsTraffic?: boolean;
  supportsManagement?: boolean;
  priority?: number;
  probe: AdapterProbe;
  metadata?: Record<string, unknown>;
};

/** Generic real adapter wrapper. The supplied probe must perform the actual transport-specific check. */
export class StaticTransportAdapter implements TransportAdapter {
  readonly id: string;
  private readonly options: StaticTransportAdapterOptions;

  constructor(options: StaticTransportAdapterOptions) {
    this.id = options.id;
    this.options = options;
  }

  async health(): Promise<boolean> {
    return this.options.probe();
  }

  async capabilities(): Promise<TransportCapability> {
    const healthy = await this.health();
    return {
      id: this.id,
      kind: this.options.kind,
      displayName: this.options.displayName,
      supportsTraffic: this.options.supportsTraffic ?? false,
      supportsManagement: this.options.supportsManagement ?? false,
      healthy,
      priority: this.options.priority,
      metadata: this.options.metadata,
    };
  }
}

export function createTransportAdapters(probes: Record<string, AdapterProbe>): TransportAdapter[] {
  const definitions: Array<Omit<StaticTransportAdapterOptions, "probe"> & { probeId: string }> = [
    { id: "wireguard", kind: "TUNNEL", displayName: "WireGuard", supportsTraffic: true, probeId: "wireguard", priority: 100 },
    { id: "amneziawg", kind: "TUNNEL", displayName: "AmneziaWG", supportsTraffic: true, probeId: "amneziawg", priority: 95 },
    { id: "openvpn", kind: "VPN", displayName: "OpenVPN", supportsTraffic: true, probeId: "openvpn", priority: 80 },
    { id: "quic", kind: "QUIC", displayName: "QUIC transport", supportsTraffic: true, probeId: "quic", priority: 75 },
    { id: "tls", kind: "TLS", displayName: "TLS transport", supportsTraffic: true, probeId: "tls", priority: 70 },
    { id: "websocket", kind: "WEBSOCKET", displayName: "WebSocket transport", supportsTraffic: true, probeId: "websocket", priority: 65 },
    { id: "tcp-socket", kind: "SOCKET", displayName: "TCP socket", supportsTraffic: true, probeId: "tcp-socket", priority: 50 },
    { id: "udp-socket", kind: "SOCKET", displayName: "UDP socket", supportsTraffic: true, probeId: "udp-socket", priority: 45 },
    { id: "bgp", kind: "ROUTING", displayName: "BGP/GoBGP", supportsTraffic: true, probeId: "bgp", priority: 90 },
    { id: "api", kind: "API", displayName: "FTN API", supportsManagement: true, probeId: "api", priority: 20 },
    { id: "ssh", kind: "MANAGEMENT", displayName: "SSH management", supportsManagement: true, probeId: "ssh", priority: 10 },
  ];

  return definitions
    .filter((definition) => typeof probes[definition.probeId] === "function")
    .map(({ probeId, ...definition }) => new StaticTransportAdapter({ ...definition, probe: probes[probeId] }));
}
