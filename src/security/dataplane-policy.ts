export type TrafficAction = "ALLOW" | "DROP" | "RATE_LIMIT" | "ISOLATE";

export type DataplaneRule = {
  id: string;
  priority: number;
  enabled: boolean;
  action: TrafficAction;
  sourceCidrs?: string[];
  destinationCidrs?: string[];
  protocols?: string[];
  ports?: number[];
  maxPacketsPerSecond?: number;
  maxBytesPerSecond?: number;
  audit: boolean;
};

export type DataplanePolicy = {
  defaultAction: "DROP" | "ALLOW";
  emergencyMode: boolean;
  rules: DataplaneRule[];
};

export type CompiledRule = DataplaneRule & {
  effectiveAction: TrafficAction;
};

/**
 * Produces a deterministic, declarative dataplane policy.
 * It does not execute shell commands, load kernel modules, or mutate routes.
 */
export function compileDataplanePolicy(policy: DataplanePolicy): CompiledRule[] {
  const rules = policy.rules
    .filter((rule) => rule.enabled)
    .map((rule) => ({
      ...rule,
      effectiveAction: policy.emergencyMode && rule.action !== "DROP" ? "DROP" : rule.action,
    }))
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));

  return rules;
}

export function defaultDataplanePolicy(): DataplanePolicy {
  return {
    defaultAction: "DROP",
    emergencyMode: false,
    rules: [],
  };
}
