import { ApprovalGate, PolicyDecision } from "../policy/policy-evaluator";
import { RouteMutation, RoutingBackend, RoutingControlPort } from "./routing-control-port";

export type RoutingMode = "MANUAL" | "AUTO";

export type RoutingRequest = {
  mode: RoutingMode;
  mutation: RouteMutation;
  policy: PolicyDecision;
  emergencyStop?: boolean;
};

export class RoutingModeController {
  constructor(private readonly port: RoutingControlPort, private readonly gate = new ApprovalGate()) {}

  async execute(request: RoutingRequest) {
    if (request.emergencyStop) {
      return { approved: false, reason: "emergency stop enabled" };
    }
    if (request.mode !== "MANUAL" && request.mode !== "AUTO") {
      return { approved: false, reason: "unsupported routing mode" };
    }
    if (!this.gate.canExecute(request.policy)) {
      return { approved: false, reason: "policy denied" };
    }
    return this.port.execute(request.mutation, request.policy);
  }
}

export function createRoutingModeController(backend: RoutingBackend): RoutingModeController {
  return new RoutingModeController(new RoutingControlPort(backend));
}
