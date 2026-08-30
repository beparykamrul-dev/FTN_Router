import { describe, expect, it } from "vitest";
import { TransportHealthBridge } from "./transport-health-bridge";
import type { TransportAdapter } from "./transport-registry";

const adapter = (id: string, supportsTraffic = true): TransportAdapter => ({
  id,
  capabilities: async () => ({
    id,
    kind: "TUNNEL",
    displayName: id,
    supportsTraffic,
    supportsManagement: true,
    healthy: true,
    priority: 5,
  }),
  health: async () => true,
});

describe("TransportHealthBridge", () => {
  it("turns registered adapter health into failover candidates", async () => {
    const bridge = new TransportHealthBridge(
      new Map([["wg", adapter("wg")]]),
      async () => ({ state: "UP", latencyMs: 8, packetLossPct: 0, capacityScore: 90, observedAt: Date.now() }),
    );

    const candidates = await bridge.buildCandidates([
      { pathId: "primary", adapterId: "wg", target: "peer-a", priority: 10, policyEligible: true },
    ]);

    expect(candidates).toHaveLength(1);
    expect(candidates[0].policyEligible).toBe(true);
    expect(candidates[0].health.state).toBe("UP");
    expect(candidates[0].health.latencyMs).toBe(8);
  });

  it("does not mark a non-traffic adapter eligible", async () => {
    const bridge = new TransportHealthBridge(
      new Map([["mgmt", adapter("mgmt", false)]]),
      async () => ({ state: "UP", observedAt: Date.now() }),
    );

    const candidates = await bridge.buildCandidates([
      { pathId: "management", adapterId: "mgmt", target: "peer-a", policyEligible: true },
    ]);

    expect(candidates[0].policyEligible).toBe(false);
    expect(candidates[0].health.state).toBe("UNKNOWN");
  });

  it("skips bindings whose adapter is unavailable", async () => {
    const bridge = new TransportHealthBridge(new Map(), async () => ({ state: "UP", observedAt: Date.now() }));
    const candidates = await bridge.buildCandidates([
      { pathId: "missing", adapterId: "unknown", target: "peer-a", policyEligible: true },
    ]);
    expect(candidates).toEqual([]);
  });
});
