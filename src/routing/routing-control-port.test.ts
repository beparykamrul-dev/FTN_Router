import test from "node:test";
import assert from "node:assert/strict";
import { PolicyEvaluator } from "../policy/policy-evaluator";
import { RoutingControlPort, RouteMutation } from "./routing-control-port";

const mutation: RouteMutation = {
  target: "example-prefix",
  operation: "ADD",
  payload: { nextHop: "192.0.2.1" },
};

const valid = new PolicyEvaluator().evaluate({
  authorized: true,
  healthy: true,
  capacityOk: true,
  slaOk: true,
  qosOk: true,
});

const denied = new PolicyEvaluator().evaluate({
  authorized: false,
  healthy: true,
  capacityOk: true,
  slaOk: true,
  qosOk: true,
});

test("RoutingControlPort blocks unauthorized mutations", async () => {
  let applied = false;
  const port = new RoutingControlPort({ apply: async () => { applied = true; } });
  const result = await port.execute(mutation, denied);
  assert.equal(result.approved, false);
  assert.equal(applied, false);
});

test("RoutingControlPort applies only an approved validated mutation", async () => {
  let applied = false;
  const port = new RoutingControlPort({ apply: async () => { applied = true; } });
  const result = await port.execute(mutation, valid);
  assert.equal(result.approved, true);
  assert.equal(applied, true);
});
