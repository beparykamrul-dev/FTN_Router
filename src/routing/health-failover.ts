import { FailoverController, type CandidatePath, type FailoverDecision } from "./failover-controller";
import { HealthProbeRunner, type HealthProbe } from "./health-probe";

export type ManagedPath = {
  id: string;
  target: string;
  priority?: number;
  policyEligible: boolean;
};

export class HealthFailoverController {
  constructor(
    private readonly probes: HealthProbe[],
    private readonly failover = new FailoverController(),
  ) {}

  async evaluate(primaryId: string, paths: ManagedPath[]): Promise<FailoverDecision> {
    const runner = new HealthProbeRunner(this.probes);
    const candidates: CandidatePath[] = [];

    for (const path of paths) {
      const samples = await runner.probe(path.target);
      const health = this.aggregate(samples);
      candidates.push({ id: path.id, priority: path.priority, policyEligible: path.policyEligible, health });
    }

    return this.failover.evaluate(primaryId, candidates);
  }

  private aggregate(samples: Awaited<ReturnType<HealthProbeRunner["probe"]>>[number][]): CandidatePath["health"] {
    if (samples.length === 0) return { state: "UNKNOWN", observedAt: Date.now() };
    const up = samples.filter((s) => s.state === "UP");
    if (up.length === samples.length) {
      const latency = up.map((s) => s.latencyMs).filter((v): v is number => v !== undefined);
      const loss = up.map((s) => s.packetLossPct).filter((v): v is number => v !== undefined);
      const capacity = up.map((s) => s.capacityScore).filter((v): v is number => v !== undefined);
      return {
        state: "UP",
        latencyMs: latency.length ? Math.min(...latency) : undefined,
        packetLossPct: loss.length ? Math.max(...loss) : undefined,
        capacityScore: capacity.length ? Math.min(...capacity) : undefined,
        observedAt: Math.max(...up.map((s) => s.observedAt)),
      };
    }
    if (up.length > 0) return { state: "DEGRADED", observedAt: Math.max(...samples.map((s) => s.observedAt)) };
    if (samples.every((s) => s.state === "DOWN")) return { state: "DOWN", observedAt: Math.max(...samples.map((s) => s.observedAt)) };
    return { state: "UNKNOWN", observedAt: Math.max(...samples.map((s) => s.observedAt)) };
  }
}
