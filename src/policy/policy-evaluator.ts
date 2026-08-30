export type PolicyInput = {
  authorized: boolean;
  healthy: boolean;
  capacityOk: boolean;
  slaOk: boolean;
  qosOk: boolean;
};

export type PolicyDecision = {
  allowed: boolean;
  reasons: string[];
};

export class PolicyEvaluator {
  evaluate(input: PolicyInput): PolicyDecision {
    const reasons: string[] = [];
    if (!input.authorized) reasons.push("approval required");
    if (!input.healthy) reasons.push("route unhealthy");
    if (!input.capacityOk) reasons.push("capacity constraint failed");
    if (!input.slaOk) reasons.push("SLA constraint failed");
    if (!input.qosOk) reasons.push("QoS constraint failed");
    return { allowed: reasons.length === 0, reasons };
  }
}

export class ApprovalGate {
  canExecute(decision: PolicyDecision): boolean {
    return decision.allowed;
  }
}
