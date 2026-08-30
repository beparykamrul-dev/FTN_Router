export type DataplaneCounterSnapshot = {
  source: string;
  observedAt: number;
  packets: number;
  bytes: number;
  droppedPackets: number;
  rateLimitedPackets: number;
  isolatedPackets: number;
};

export type SecurityTelemetryEvent = {
  type: "DATAPLANE_COUNTERS" | "POLICY_DRIFT" | "PROBE_FAILURE";
  source: string;
  observedAt: number;
  severity: "INFO" | "WARN" | "CRITICAL";
  data: Record<string, unknown>;
};

export function countersToEvent(snapshot: DataplaneCounterSnapshot): SecurityTelemetryEvent {
  const severity = snapshot.droppedPackets > 0 || snapshot.rateLimitedPackets > 0
    ? "WARN"
    : "INFO";
  return {
    type: "DATAPLANE_COUNTERS",
    source: snapshot.source,
    observedAt: snapshot.observedAt,
    severity,
    data: { ...snapshot },
  };
}

export function policyDriftEvent(source: string, observedAt = Date.now()): SecurityTelemetryEvent {
  return {
    type: "POLICY_DRIFT",
    source,
    observedAt,
    severity: "CRITICAL",
    data: { failClosed: true },
  };
}

export function probeFailureEvent(source: string, error?: string, observedAt = Date.now()): SecurityTelemetryEvent {
  return {
    type: "PROBE_FAILURE",
    source,
    observedAt,
    severity: "WARN",
    data: { error },
  };
}

export class SecurityTelemetryBuffer {
  private readonly events: SecurityTelemetryEvent[] = [];

  push(event: SecurityTelemetryEvent): void {
    this.events.push({ ...event, data: { ...event.data } });
  }

  drain(): SecurityTelemetryEvent[] {
    const output = this.events.splice(0);
    return output;
  }
}
