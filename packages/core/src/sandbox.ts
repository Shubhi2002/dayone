import type { SandboxId, SandboxProviderId } from "./ids.js";
export interface SandboxHandle {
  id: SandboxId;
  provider: SandboxProviderId;
  createdAt: Date;
  /** provider-specific opaque data needed to reconnect (never secrets) */
  meta: Record<string, string>;
}
