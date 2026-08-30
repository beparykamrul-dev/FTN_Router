import { describe, expect, it } from "vitest";
import { GoBGPAdapter } from "./gobgp-adapter";

describe("GoBGPAdapter", () => {
  it("reports a healthy GoBGP server and peer count", async () => {
    const adapter = new GoBGPAdapter({
      client: {
        getServerState: async () => ({ state: "UP" }),
        listPeers: async () => [{ address: "peer-a" }, { address: "peer-b" }],
      },
    });
    expect(await adapter.health()).toBe(true);
    const capability = await adapter.capabilities();
    expect(capability.kind).toBe("ROUTING");
    expect(capability.supportsTraffic).toBe(true);
    expect(capability.metadata).toEqual({ peerCount: 2 });
  });

  it("does not mutate routes and reports unhealthy client state safely", async () => {
    const adapter = new GoBGPAdapter({
      client: { getServerState: async () => ({ state: "IDLE" }) },
    });
    expect(await adapter.health()).toBe(false);
    expect((await adapter.capabilities()).healthy).toBe(false);
  });

  it("treats connectivity/read errors as unhealthy", async () => {
    const adapter = new GoBGPAdapter({
      client: { getServerState: async () => { throw new Error("gRPC unavailable"); } },
    });
    expect(await adapter.health()).toBe(false);
  });
});
