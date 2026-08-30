import { ApprovalGate, PolicyDecision } from "../policy/policy-evaluator";

export type RouteMutation = {
  target: string;
  operation: "ADD" | "REMOVE" | "REPLACE";
  payload: Record<string, unknown>;
};

export type RoutingExecution = {
  mutation: RouteMutation;
  policy: PolicyDecision;
  approved: boolean;
};

export interface RoutingBackend {
  apply(mutation: RouteMutation): Promise<void>;
}

/** Provider-neutral routing boundary. Denies by default and requires policy approval. */
export class RoutingControlPort {
  constructor(private readonly backend: RoutingBackend, private readonly gate = new ApprovalGate()) {}

  async execute(mutation: RouteMutation, decision: PolicyDecision): Promise<RoutingExecution> {
    if (!this.gate.canExecute(decision)) {
      return { mutation, policy: decision, approved: false };
    }
    await this.backend.apply(mutation);
    return { mutation, policy: decision, approved: true };
  }
}
