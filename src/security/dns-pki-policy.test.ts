import { describe, expect, it } from "vitest";
import { evaluateDnsPkiPolicy } from "./dns-pki-policy";

const policy = {
  enabled: true,
  allowedZones: ["familytimenet.com", "ftndns.net"],
  requireMtlS: true,
  requireValidCertificate: true,
  allowAcmeIssuance: true,
  allowExternalCertificateAuthorities: false,
  certificateRenewalWindowHours: 72,
};

describe("FTN DNS/PKI policy gate", () => {
  it("allows an approved zone with valid certificate and mTLS", () => {
    expect(evaluateDnsPkiPolicy(policy, "ns1.ftndns.net", true, true, false, false).allowed).toBe(true);
  });

  it("rejects an out-of-scope zone", () => {
    expect(evaluateDnsPkiPolicy(policy, "example.org", true, true, false, false).allowed).toBe(false);
  });

  it("rejects invalid identity", () => {
    expect(evaluateDnsPkiPolicy(policy, "ftndns.net", false, true, false, false).allowed).toBe(false);
    expect(evaluateDnsPkiPolicy(policy, "ftndns.net", true, false, false, false).allowed).toBe(false);
  });

  it("allows ACME only when explicitly enabled and blocks external CA", () => {
    expect(evaluateDnsPkiPolicy(policy, "ftndns.net", true, true, true, false).allowed).toBe(true);
    expect(evaluateDnsPkiPolicy(policy, "ftndns.net", true, true, false, true).allowed).toBe(false);
  });
});
