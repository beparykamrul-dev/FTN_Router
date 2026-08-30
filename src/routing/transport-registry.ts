export type TransportKind = "TUNNEL" | "PROXY" | "VPN" | "QUIC" | "TLS" | "WEBSOCKET" | "SOCKET" | "OVERLAY" | "ROUTING" | "API" | "MANAGEMENT" | "OTHER";

export type TransportCapability = {
  id: string;
  kind: TransportKind;
  displayName: string;
  supportsTraffic: boolean;
  supportsManagement: boolean;
  healthy: boolean;
  latencyMs?: number;
  packetLossPct?: number;
  capacityScore?: number;
  priority?: number;
  metadata?: Record<string, unknown>;
};

export interface TransportAdapter {
  readonly id: string;
  capabilities(): Promise<TransportCapability>;
  health(): Promise<boolean>;
}

export class TransportRegistry {
  private readonly adapters = new Map<string, TransportAdapter>();

  register(adapter: TransportAdapter): void {
    if (this.adapters.has(adapter.id)) throw new Error(`transport adapter already registered: ${adapter.id}`);
    this.adapters.set(adapter.id, adapter);
  }

  unregister(id: string): boolean { return this.adapters.delete(id); }
  get(id: string): TransportAdapter | undefined { return this.adapters.get(id); }
  list(): TransportAdapter[] { return [...this.adapters.values()]; }

  async discover(): Promise<TransportCapability[]> {
    const results: TransportCapability[] = [];
    for (const adapter of this.adapters.values()) {
      const capability = await adapter.capabilities();
      results.push({ ...capability, healthy: capability.healthy && await adapter.health() });
    }
    return results;
  }
}
