import { describe, expect, it } from "vitest";
import { compileDataplanePolicy, defaultDataplanePolicy } from "./dataplane-policy";

describe("defensive dataplane policy", () => {
  it("defaults to deny with no rules", () => {
    expect(defaultDataplanePolicy()).toEqual({ defaultAction: "DROP", emergencyMode: false, rules: [] });
  });

  it("removes disabled rules and keeps deterministic priority", () => {
    const compiled = compileDataplanePolicy({
      defaultAction: "DROP",
      emergencyMode: false,
      rules: [
        { id: "b", priority: 20, enabled: true, action: "ALLOW", audit: true },
        { id: "disabled", priority: 1, enabled: false, action: "ALLOW", audit: true },
        { id: "a", priority: 10, enabled: true, action: "RATE_LIMIT", maxPacketsPerSecond: 100, audit: true },
      ],
    });
    expect(compiled.map((r) => r.id)).toEqual(["a", "b"]);
  });

  it("fails closed in emergency mode", () => {
    const compiled = compileDataplanePolicy({
      defaultAction: "DROP",
      emergencyMode: true,
      rules: [
        { id: "allow", priority: 1, enabled: true, action: "ALLOW", audit: true },
        { id: "drop", priority: 2, enabled: true, action: "DROP", audit: true },
      ],
    });
    expect(compiled.map((r) => r.effectiveAction)).toEqual(["DROP", "DROP"]);
  });
});
