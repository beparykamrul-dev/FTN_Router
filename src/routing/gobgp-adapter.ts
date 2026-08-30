import type { TransportAdapter, TransportCapability } from "./transport-registry";

export type GoBGPClient = {
  getServerState(): Promise<{ state: string }>;
  listPeers?(): Promise<unknown[]>;
};

export type GoBGPAdapterOptions = {
  client: GoBGPClient;
  id?: string;
  priority?: number;
};

/** Adapter boundary for a real GoBGP client. No routing mutation is exposed here. */
export class GoBGPAdapter implements TransportAdapter {
  readonly id: string;
  private readonly priority: number;
  private readonly client: GoBGPClient;

  constructor(options: GoBGPAdapterOptions) {
    this.id = options.id ?? "bgp";
    this.priority = options.priority ?? 90;
    this.client = options.client;
  }

  async health(): Promise<boolean> {
    try {
      const state = await this.client.getServerState();
      return ["UP", "ESTABLISHED", "ACTIVE"].includes(state.state.toUpperCase());
    } catch {
      return false;
    }
  }

  async capabilities(): Promise<TransportCapability> {
    const healthy = await this.health();
    let peerCount: number | undefined;
    if (this.client.listPeers) {
      try { peerCount = (await this.client.listPeers()).length; } catch { /* health remains authoritative */ }
    }
    return {
      id: this.id,
      kind: "ROUTING",
      displayName: "BGP/GoBGP",
      supportsTraffic: true,
      supportsManagement: true,
      healthy,
      priority: this.priority,
      metadata: peerCount === undefined ? undefined : { peerCount },
    };
  }
}
