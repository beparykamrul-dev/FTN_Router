import { describe, expect, it } from "vitest";
import { HealthProbeRunner, type HealthProbe } from "./health-probe";

describe("HealthProbeRunner", () => {
  it("runs all registered probes", async () => {
    const probes: HealthProbe[] = [
      { id: "tcp", probe: async () => ({ state: "UP", latencyMs: 10, observedAt: 1 }) },
      { id: "quic", probe: async () => ({ state: "DEGRADED", packetLossPct: 2, observedAt: 1 }) },
    ];
    const results = await new HealthProbeRunner(probes).probe("peer-a");
    expect(results).toHaveLength(2);
    expect(results.map((r) => r.state)).toEqual(["UP", "DEGRADED"]);
  });

  it("converts probe exceptions to UNKNOWN", async () => {
    const probes: HealthProbe[] = [
      { id: "broken", probe: async () => { throw new Error("unreachable"); } },
    ];
    const result = (await new HealthProbeRunner(probes).probe("peer-a"))[0];
    expect(result.state).toBe("UNKNOWN");
    expect(result.observedAt).toEqual(expect.any(Number));
  });
});
