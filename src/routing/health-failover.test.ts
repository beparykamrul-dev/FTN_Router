import { describe, expect, it } from "vitest";
import { HealthFailoverController } from "./health-failover";
import type { HealthProbe } from "./health-probe";

describe("HealthFailoverController", () => {
  it("uses live probe results to fail over to the best healthy path", async () => {
    const probes: HealthProbe[] = [{
      id: "probe",
      probe: async (target) => target === "primary"
        ? { state: "DOWN", observedAt: Date.now() }
        : { state: "UP", latencyMs: 5, packetLossPct: 0, capacityScore: 90, observedAt: Date.now() },
    }];

    const controller = new HealthFailoverController(probes);
    const result = await controller.evaluate("p", [
      { id: "p", target: "primary", policyEligible: true },
      { id: "b", target: "backup", policyEligible: true },
    ]);

    expect(result.selectedPathId).toBe("b");
    expect(result.reason).toBe("PRIMARY_FAILED");
  });

  it("does not select a policy-ineligible healthy path", async () => {
    const probes: HealthProbe[] = [{
      id: "probe",
      probe: async () => ({ state: "UP", latencyMs: 1, capacityScore: 100, observedAt: Date.now() }),
    }];

    const controller = new HealthFailoverController(probes);
    const result = await controller.evaluate("primary", [
      { id: "primary", target: "primary", policyEligible: false },
      { id: "blocked", target: "blocked", policyEligible: false },
    ]);

    expect(result.selectedPathId).toBeUndefined();
    expect(result.reason).toBe("NO_ELIGIBLE_PATH");
  });
});
