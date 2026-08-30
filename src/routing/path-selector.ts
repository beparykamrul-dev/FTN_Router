import { TransportCapability } from "./transport-registry";

export type PathSelectionPolicy = {
  preferredIds?: string[];
  requireTrafficSupport?: boolean;
  maxLatencyMs?: number;
  maxPacketLossPct?: number;
  minCapacityScore?: number;
};

export type ScoredPath = TransportCapability & { score: number };

export function scorePath(path: TransportCapability, policy: PathSelectionPolicy = {}): number {
  const latency = path.latencyMs ?? 1000;
  const loss = path.packetLossPct ?? 100;
  const capacity = path.capacityScore ?? 0;
  const priority = path.priority ?? 0;
  const preferred = policy.preferredIds?.includes(path.id) ? 1000 : 0;
  return preferred + priority * 10 + Math.max(0, 500 - latency) + Math.max(0, 100 - loss) + capacity;
}

export function selectBestPath(paths: TransportCapability[], policy: PathSelectionPolicy = {}): ScoredPath | undefined {
  const candidates = paths
    .filter((p) => p.healthy)
    .filter((p) => policy.requireTrafficSupport === false || p.supportsTraffic)
    .filter((p) => policy.maxLatencyMs === undefined || (p.latencyMs ?? Infinity) <= policy.maxLatencyMs)
    .filter((p) => policy.maxPacketLossPct === undefined || (p.packetLossPct ?? Infinity) <= policy.maxPacketLossPct)
    .filter((p) => policy.minCapacityScore === undefined || (p.capacityScore ?? -Infinity) >= policy.minCapacityScore)
    .map((p) => ({ ...p, score: scorePath(p, policy) }))
    .sort((a, b) => b.score - a.score);
  return candidates[0];
}
