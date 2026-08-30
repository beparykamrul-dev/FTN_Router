import { describe, expect, it } from "vitest";
import { FailoverController, type CandidatePath } from "./failover-controller";

const path = (id: string, overrides: Partial<CandidatePath> = {}): CandidatePath => ({
  id,
  policyEligible: true,
  health: { state: "UP", latencyMs: 20, packetLossPct: 0, capacityScore: 80, observedAt: 1_000 },
  ...overrides,
});

describe("FailoverController", () => {
  it("keeps a healthy primary", () => {
    const c = new FailoverController(() => 1_000);
    const result = c.evaluate("primary", [path("primary"), path("backup")]);
    expect(result.selectedPathId).toBe("primary");
    expect(result.reason).toBe("PRIMARY_HEALTHY");
  });

  it("selects the best eligible path when primary is down", () => {
    const c = new FailoverController(() => 1_000);
    const result = c.evaluate("primary", [
      path("primary", { health: { state: "DOWN", observedAt: 1_000 } }),
      path("slow", { health: { state: "UP", latencyMs: 100, packetLossPct: 2, capacityScore: 40, observedAt: 1_000 } }),
      path("best", { health: { state: "UP", latencyMs: 10, packetLossPct: 0, capacityScore: 90, observedAt: 1_000 } }),
    ]);
    expect(result.selectedPathId).toBe("best");
    expect(result.reason).toBe("PRIMARY_FAILED");
  });

  it("ignores policy-ineligible paths", () => {
    const c = new FailoverController(() => 1_000);
    const result = c.evaluate("primary", [
      path("primary", { health: { state: "DOWN", observedAt: 1_000 } }),
      path("blocked", { policyEligible: false, health: { state: "UP", latencyMs: 1, capacityScore: 100, observedAt: 1_000 } }),
      path("allowed", { health: { state: "UP", latencyMs: 20, capacityScore: 50, observedAt: 1_000 } }),
    ]);
    expect(result.selectedPathId).toBe("allowed");
  });

  it("returns no eligible path instead of inventing one", () => {
    const c = new FailoverController(() => 1_000);
    const result = c.evaluate("primary", [
      path("primary", { health: { state: "DOWN", observedAt: 1_000 } }),
      path("backup", { health: { state: "DEGRADED", observedAt: 1_000 } }),
    ]);
    expect(result.selectedPathId).toBeUndefined();
    expect(result.reason).toBe("NO_ELIGIBLE_PATH");
  });
});
