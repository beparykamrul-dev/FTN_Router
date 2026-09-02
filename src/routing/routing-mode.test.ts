import { describe, it, expect } from "vitest";
import { createRoutingModeController } from "./routing-mode";
import type { RouteMutation } from "./routing-control-port";

const mutation: RouteMutation = { target: "203.0.113.0/24", operation: "ADD", payload: { nextHop: "192.0.2.1" } };
const allowed = { allowed: true, reasons: [] };
const denied = { allowed: false, reasons: ["approval required"] };

describe("RoutingModeController", () => {
  it("blocks both modes during emergency stop", async () => {
    let calls = 0;
    const controller = createRoutingModeController({ apply: async () => { calls++; } });
    const result = await controller.execute({ mode: "AUTO", mutation, policy: allowed, emergencyStop: true });
    expect(result.approved).toBe(false);
    expect(calls).toBe(0);
  });

  it("blocks AUTO when policy is denied", async () => {
    let calls = 0;
    const controller = createRoutingModeController({ apply: async () => { calls++; } });
    const result = await controller.execute({ mode: "AUTO", mutation, policy: denied });
    expect(result.approved).toBe(false);
    expect(calls).toBe(0);
  });

  it("allows MANUAL after explicit policy approval", async () => {
    let calls = 0;
    const controller = createRoutingModeController({ apply: async () => { calls++; } });
    const result = await controller.execute({ mode: "MANUAL", mutation, policy: allowed });
    expect(result.approved).toBe(true);
    expect(calls).toBe(1);
  });

  it("allows AUTO only after policy approval", async () => {
    let calls = 0;
    const controller = createRoutingModeController({ apply: async () => { calls++; } });
    const result = await controller.execute({ mode: "AUTO", mutation, policy: allowed });
    expect(result.approved).toBe(true);
    expect(calls).toBe(1);
  });
});
