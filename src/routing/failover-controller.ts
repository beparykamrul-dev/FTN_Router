export type PathState = "UP" | "DEGRADED" | "DOWN" | "UNKNOWN";

export type HealthSample = {
  state: PathState;
  latencyMs?: number;
  packetLossPct?: number;
  capacityScore?: number;
  observedAt: number;
};

export type CandidatePath = {
  id: string;
  priority?: number;
  health: HealthSample;
  policyEligible: boolean;
};

export type FailoverDecision = {
  selectedPathId?: string;
  changed: boolean;
  reason: "PRIMARY_HEALTHY" | "PRIMARY_FAILED" | "NO_ELIGIBLE_PATH";
};

export class FailoverController {
  private currentPathId?: string;

  constructor(private readonly now: () => number = Date.now) {}

  current(): string | undefined {
    return this.currentPathId;
  }

  evaluate(primaryId: string, paths: CandidatePath[]): FailoverDecision {
    const primary = paths.find((p) => p.id === primaryId);
    if (primary && primary.policyEligible && primary.health.state === "UP") {
      const changed = this.currentPathId !== primary.id;
      this.currentPathId = primary.id;
      return { selectedPathId: primary.id, changed, reason: "PRIMARY_HEALTHY" };
    }

    const candidates = paths
      .filter((p) => p.policyEligible && p.health.state === "UP")
      .sort((a, b) => this.score(b) - this.score(a));

    const selected = candidates[0];
    if (!selected) {
      return { changed: false, reason: "NO_ELIGIBLE_PATH" };
    }

    const changed = this.currentPathId !== selected.id;
    this.currentPathId = selected.id;
    return { selectedPathId: selected.id, changed, reason: "PRIMARY_FAILED" };
  }

  private score(path: CandidatePath): number {
    const latency = path.health.latencyMs ?? 1000;
    const loss = path.health.packetLossPct ?? 100;
    const capacity = path.health.capacityScore ?? 0;
    const priority = path.priority ?? 0;
    const freshness = Math.max(0, 1 - (this.now() - path.health.observedAt) / 60_000);
    return priority * 10 + capacity * 2 + freshness * 20 - latency * 0.05 - loss * 5;
  }
}
