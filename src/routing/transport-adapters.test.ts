import { describe, expect, it } from "vitest";
import { createTransportAdapters } from "./transport-adapters";

const probes = Object.fromEntries([
  "wireguard", "amneziawg", "openvpn", "quic", "tls", "websocket",
  "tcp-socket", "udp-socket", "bgp", "api", "ssh",
].map((id) => [id, async () => true]));

describe("FTN transport adapter factory", () => {
  it("creates only adapters with an actual probe", async () => {
    const adapters = createTransportAdapters({ wireguard: async () => true, bgp: async () => false });
    expect(adapters.map((a) => a.id)).toEqual(["wireguard", "bgp"]);
    expect(await adapters[0].health()).toBe(true);
    expect(await adapters[1].health()).toBe(false);
  });

  it("marks traffic capability separately from management capability", async () => {
    const adapters = createTransportAdapters(probes);
    const api = adapters.find((a) => a.id === "api")!;
    const wg = adapters.find((a) => a.id === "wireguard")!;
    expect((await api.capabilities()).supportsTraffic).toBe(false);
    expect((await api.capabilities()).supportsManagement).toBe(true);
    expect((await wg.capabilities()).supportsTraffic).toBe(true);
  });
});
