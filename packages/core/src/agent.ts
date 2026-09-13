import type { AgentProviderId } from "./ids.js";

export type AgentKind = "ide-extension" | "hosted";
export type ModelVendor = "anthropic" | "openai" | "google" | "other";

export interface AgentSelection {
  agent: AgentProviderId;
  model: string | null;      // vendor model id, pinned by the provider's default unless overridden
  gatewayKeyId: string | null;
  selectedAt: Date;
}
