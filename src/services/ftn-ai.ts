export interface FTNAIContext {
  telemetry?: unknown;
  routeState?: unknown;
  billing?: unknown;
}

export interface FTNAIRequest {
  message: string;
  history?: unknown[];
  context?: FTNAIContext;
}

export interface FTNAIResponse {
  text: string;
  provider: "ftn-ai";
  actionRequired: false;
}

/**
 * Internal FTN AI boundary.
 * The router never calls an external model directly; a future local model
 * adapter can be attached behind this interface without changing API routes.
 */
export async function runFTNAI(input: FTNAIRequest): Promise<FTNAIResponse> {
  const message = input.message?.trim();
  if (!message) throw new Error("message is required");

  const contextKeys = Object.keys(input.context ?? {});
  const contextNote = contextKeys.length
    ? ` Context available: ${contextKeys.join(", ")}.`
    : " No live context was supplied.";

  return {
    text: `FTN AI: ${message}${contextNote} This is an advisory response; no network action was executed.`,
    provider: "ftn-ai",
    actionRequired: false,
  };
}
