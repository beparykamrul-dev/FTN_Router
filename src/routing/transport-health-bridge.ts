import type { CandidatePath, HealthSample } from "./failover-controller";
import type { TransportAdapter, TransportCapability } from "./transport-registry";

export type PathBinding = {
  pathId: string;
  adapterId: string;
  target: string;
  priority?: number;
  policyEligible: boolean;
};

export type ProbeFn = (adapter: TransportAdapter, target: string) => Promise<HealthSample>;

export class TransportHealthBridge {
  constructor(
    private readonly adapters: Map<string, TransportAdapter>,
    private readonly probe: ProbeFn,
  ) {}

  async buildCandidates(bindings: PathBinding[]): Promise<CandidatePath[]> {
    const candidates: CandidatePath[] = [];
    for (const binding of bindings) {
      const adapter = this.adapters.get(binding.adapterId);
      if (!adapter) continue;

      const capability: TransportCapability = await adapter.capabilities();
      const eligible = binding.policyEligible && capability.supportsTraffic;
      const health = eligible
        ? await this.probe(adapter, binding.target)
        : { state: "UNKNOWN" as const, observedAt: Date.now() };

      candidates.push({
        id: binding.pathId,
        priority: binding.priority ?? capability.priority,
        policyEligible: eligible,
        health,
      });
    }
    return candidates;
  }
}
