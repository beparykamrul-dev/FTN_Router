import { describe, expect, it } from "vitest";
import { SecurityTelemetryBuffer, countersToEvent, policyDriftEvent, probeFailureEvent } from "./security-telemetry";

describe("FTN security telemetry", () => {
  it("converts dataplane drops and rate limits into an auditable warning", () => {
    const event = countersToEvent({ source: "xdp0", observedAt: 10, packets: 100, bytes: 2000, droppedPackets: 4, rateLimitedPackets: 3, isolatedPackets: 0 });
    expect(event.type).toBe("DATAPLANE_COUNTERS");
    expect(event.severity).toBe("WARN");
    expect(event.data.droppedPackets).toBe(4);
  });

  it("marks policy drift as critical and fail-closed", () => {
    const event = policyDriftEvent("nftables", 20);
    expect(event.severity).toBe("CRITICAL");
    expect(event.data).toEqual({ failClosed: true });
  });

  it("keeps probe failures observable", () => {
    const event = probeFailureEvent("wireguard", "timeout", 30);
    expect(event.type).toBe("PROBE_FAILURE");
    expect(event.data.error).toBe("timeout");
  });

  it("buffers and drains events atomically from the caller's perspective", () => {
    const buffer = new SecurityTelemetryBuffer();
    buffer.push(policyDriftEvent("xdp0", 1));
    buffer.push(probeFailureEvent("bgp", "unavailable", 2));
    expect(buffer.drain()).toHaveLength(2);
    expect(buffer.drain()).toEqual([]);
  });
});
