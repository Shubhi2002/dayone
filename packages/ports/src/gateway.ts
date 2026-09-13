import type { ModelVendor, SessionId } from "@dayone/core";

/** The agent gateway issues per-session virtual keys and meters traffic. Vendor keys never leave the control plane. */
export interface VirtualKey { id: string; secret: string; sessionId: SessionId; vendors: ModelVendor[]; budgetMinor: number; expiresAt: Date; }

export interface ModelGateway {
  issueKey(sessionId: SessionId, vendors: ModelVendor[], budgetMinor: number, ttlMinutes: number): Promise<VirtualKey>;
  revokeKey(keyId: string): Promise<void>;
  spent(sessionId: SessionId): Promise<{ spentMinor: number; budgetMinor: number }>;
  /** Base URL the sandbox should use for a vendor; the gateway routes and logs. */
  baseUrlFor(vendor: ModelVendor): string;
}
