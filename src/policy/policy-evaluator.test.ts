import assert from "node:assert/strict";
import test from "node:test";
import { ApprovalGate, PolicyEvaluator } from "./policy-evaluator";

test("denies an unauthorized route", () => {
  const decision = new PolicyEvaluator().evaluate({
    authorized: false,
    healthy: true,
    capacityOk: true,
    slaOk: true,
    qosOk: true,
  });
  assert.equal(decision.allowed, false);
  assert.ok(decision.reasons.includes("approval required"));
  assert.equal(new ApprovalGate().canExecute(decision), false);
});

test("denies failed routing constraints", () => {
  const decision = new PolicyEvaluator().evaluate({
    authorized: true,
    healthy: false,
    capacityOk: false,
    slaOk: false,
    qosOk: false,
  });
  assert.equal(decision.allowed, false);
  assert.deepEqual(decision.reasons, [
    "route unhealthy",
    "capacity constraint failed",
    "SLA constraint failed",
    "QoS constraint failed",
  ]);
  assert.equal(new ApprovalGate().canExecute(decision), false);
});

test("allows only a fully validated and authorized route", () => {
  const decision = new PolicyEvaluator().evaluate({
    authorized: true,
    healthy: true,
    capacityOk: true,
    slaOk: true,
    qosOk: true,
  });
  assert.equal(decision.allowed, true);
  assert.equal(new ApprovalGate().canExecute(decision), true);
});
