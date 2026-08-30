import { describe, expect, it } from "vitest";
import { FtnCoreRouter, FTN_CORE_CAPABILITIES } from "./ftn-core-router";

const path = (id: string, healthy = true) => ({
  id,
  kind: "TUNNEL" as const,
  displayName: id,
  supportsTraffic: true,
  supportsManagement: false,
  healthy,
  latencyMs: 10,
  packetLossPct: 0,
  capacityScore: 90,
  priority: 50,
});

describe("FtnCoreRouter", () => {
  it("exposes the canonical capability inventory without granting runtime permission", () => {
    const router = new FtnCoreRouter(FTN_CORE_CAPABILITIES);
    expect(router.listCapabilities().some((c) => c.id === "wireguard")).toBe(true);
    expect(router.listCapabilities().some((c) => c.id === "gobgp")).toBe(true);
    expect(router.listCapabilities().some((c) => c.id === "sing-box")).toBe(true);
  });

  it("denies a capability that is absent from the control policy", () => {
    const router = new FtnCoreRouter(FTN_CORE_CAPABILITIES);
    const result = router.decide([path("wireguard")], {
      allowedCapabilityIds: [],
      autoEnabled: true,
      manualApprovalRequired: false,
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("POLICY_DENY");
  });

  it("requires approval in manual mode", () => {
    const router = new FtnCoreRouter(FTN_CORE_CAPABILITIES);
    const result = router.decide([path("wireguard")], {
      allowedCapabilityIds: ["wireguard"],
      autoEnabled: false,
      manualApprovalRequired: true,
    });
    expect(result.allowed).toBe(true);
    expect(result.requiresApproval).toBe(true);
    expect(result.selectedPathId).toBe("wireguard");
  });

  it("selects a healthy allowed path in controlled auto mode", () => {
    const router = new FtnCoreRouter(FTN_CORE_CAPABILITIES);
    const result = router.decide([path("wireguard", false), path("amneziawg", true)], {
      allowedCapabilityIds: ["wireguard", "amneziawg"],
      autoEnabled: true,
      manualApprovalRequired: false,
    });
    expect(result.allowed).toBe(true);
    expect(result.requiresApproval).toBe(false);
    expect(result.selectedPathId).toBe("amneziawg");
  });
});
