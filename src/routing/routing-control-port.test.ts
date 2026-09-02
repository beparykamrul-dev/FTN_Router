import { describe, it, expect } from "vitest";
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

describe("RoutingControlPort", () => {
  it("blocks unauthorized mutations", async () => {
    let applied = false;
    const port = new RoutingControlPort({ apply: async () => { applied = true; } });
    const result = await port.execute(mutation, denied);
    expect(result.approved).toBe(false);
    expect(applied).toBe(false);
  });

  it("applies only an approved validated mutation", async () => {
    let applied = false;
    const port = new RoutingControlPort({ apply: async () => { applied = true; } });
    const result = await port.execute(mutation, valid);
    expect(result.approved).toBe(true);
    expect(applied).toBe(true);
  });
});
