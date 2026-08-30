import { describe, expect, it } from "vitest";
import { ApprovalGate, PolicyEvaluator } from "./policy-evaluator";

describe("PolicyEvaluator", () => {
  it("denies an unauthorized route", () => {
    const decision = new PolicyEvaluator().evaluate({
      authorized: false,
      healthy: true,
      capacityOk: true,
      slaOk: true,
      qosOk: true,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.reasons).toContain("approval required");
  });

  it("denies failed routing constraints", () => {
    const decision = new PolicyEvaluator().evaluate({
      authorized: true,
      healthy: false,
      capacityOk: false,
      slaOk: false,
      qosOk: false,
    });
    expect(decision.allowed).toBe(false);
    expect(decision.reasons).toHaveLength(4);
  });

  it("allows only a fully validated and authorized route", () => {
    const decision = new PolicyEvaluator().evaluate({
      authorized: true,
      healthy: true,
      capacityOk: true,
      slaOk: true,
      qosOk: true,
    });
    expect(decision.allowed).toBe(true);
    expect(new ApprovalGate().canExecute(decision)).toBe(true);
  });
});
