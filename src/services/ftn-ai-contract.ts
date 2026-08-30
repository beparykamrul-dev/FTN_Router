export type FTNContext = {
  billing?: Record<string, unknown>;
  noc?: Record<string, unknown>;
  telemetry?: Record<string, unknown>;
  routing?: Record<string, unknown>;
  policy?: Record<string, unknown>;
};

export type RouteRecommendation = {
  action: "NO_CHANGE" | "REVIEW";
  reason: string;
  requiresApproval: true;
};

export interface ContextProvider {
  getContext(): Promise<FTNContext>;
}

export interface FTNAIEngine {
  analyze(input: { message: string; context: FTNContext }): Promise<RouteRecommendation>;
}

export class FTNInternalAI implements FTNAIEngine {
  async analyze(input: { message: string; context: FTNContext }): Promise<RouteRecommendation> {
    return {
      action: "REVIEW",
      reason: `FTN AI received: ${input.message}`,
      requiresApproval: true,
    };
  }
}
