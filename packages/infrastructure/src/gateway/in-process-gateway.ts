import { randomBytes } from "node:crypto";
import type { ModelVendor, SessionId } from "@dayone/core";
import type { ModelGateway, VirtualKey } from "@dayone/ports";

/**
 * V0 agent gateway state: virtual keys and per-session spend. The HTTP proxy that uses this lives in apps/api (routes/gateway.ts).
 * Vendor keys are read from config there and never returned here.
 */
export class InProcessModelGateway implements ModelGateway {
  private readonly keys = new Map<string, VirtualKey>();
  private readonly spend = new Map<string, number>();
  constructor(private readonly publicBaseUrl: string) {}
  async issueKey(sessionId: SessionId, vendors: ModelVendor[], budgetMinor: number, ttlMinutes: number): Promise<VirtualKey> {
    const key: VirtualKey = {
      id: `vk_${randomBytes(6).toString("hex")}`, secret: `dk_${randomBytes(24).toString("base64url")}`, sessionId, vendors, budgetMinor,
      expiresAt: new Date(Date.now() + ttlMinutes * 60_000),
    };
    this.keys.set(key.secret, key);
    return key;
  }
  async revokeKey(keyId: string): Promise<void> { for (const [secret, k] of this.keys) if (k.id === keyId) this.keys.delete(secret); }
  async spent(sessionId: SessionId): Promise<{ spentMinor: number; budgetMinor: number }> {
    const key = [...this.keys.values()].find((k) => k.sessionId === sessionId);
    return { spentMinor: this.spend.get(sessionId) ?? 0, budgetMinor: key?.budgetMinor ?? 0 };
  }
  baseUrlFor(vendor: ModelVendor): string { return `${this.publicBaseUrl}/gateway/${vendor}`; }

  /** Used by the proxy route. */
  resolve(secret: string): VirtualKey | null { const k = this.keys.get(secret); return k && k.expiresAt > new Date() ? k : null; }
  record(sessionId: SessionId, costMinor: number): void { this.spend.set(sessionId, (this.spend.get(sessionId) ?? 0) + costMinor); }
}
