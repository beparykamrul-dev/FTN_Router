export type ProbeResult = {
  state: "UP" | "DEGRADED" | "DOWN" | "UNKNOWN";
  latencyMs?: number;
  packetLossPct?: number;
  capacityScore?: number;
  observedAt: number;
};

export interface HealthProbe {
  readonly id: string;
  probe(target: string): Promise<ProbeResult>;
}

export class HealthProbeRunner {
  constructor(private readonly probes: HealthProbe[]) {}

  async probe(target: string): Promise<ProbeResult[]> {
    return Promise.all(this.probes.map((probe) => this.safeProbe(probe, target)));
  }

  private async safeProbe(probe: HealthProbe, target: string): Promise<ProbeResult> {
    try {
      return await probe.probe(target);
    } catch {
      return { state: "UNKNOWN", observedAt: Date.now() };
    }
  }
}
