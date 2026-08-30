export type DnsPkiPolicy = {
  enabled: boolean;
  allowedZones: string[];
  requireMtlS: boolean;
  requireValidCertificate: boolean;
  allowAcmeIssuance: boolean;
  allowExternalCertificateAuthorities: boolean;
  certificateRenewalWindowHours: number;
};

export type DnsPkiDecision = {
  allowed: boolean;
  reason: string;
};

export function evaluateDnsPkiPolicy(
  policy: DnsPkiPolicy,
  zone: string,
  certificateValid: boolean,
  mtlsVerified: boolean,
  acmeRequested: boolean,
  externalCaRequested: boolean,
): DnsPkiDecision {
  if (!policy.enabled) return { allowed: false, reason: "DNS/PKI policy disabled" };

  const normalizedZone = zone.toLowerCase().replace(/\.$/, "");
  const allowedZone = policy.allowedZones.some((allowed) => {
    const candidate = allowed.toLowerCase().replace(/\.$/, "");
    return normalizedZone === candidate || normalizedZone.endsWith(`.${candidate}`);
  });
  if (!allowedZone) return { allowed: false, reason: "zone is outside policy scope" };
  if (policy.requireValidCertificate && !certificateValid) {
    return { allowed: false, reason: "certificate validation failed" };
  }
  if (policy.requireMtlS && !mtlsVerified) {
    return { allowed: false, reason: "mTLS identity verification failed" };
  }
  if (acmeRequested && !policy.allowAcmeIssuance) {
    return { allowed: false, reason: "ACME issuance is not permitted" };
  }
  if (externalCaRequested && !policy.allowExternalCertificateAuthorities) {
    return { allowed: false, reason: "external certificate authority is not permitted" };
  }
  return { allowed: true, reason: "DNS/PKI policy satisfied" };
}
