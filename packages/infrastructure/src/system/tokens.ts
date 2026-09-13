import { createHmac, timingSafeEqual } from "node:crypto";
import type { TokenSigner } from "@dayone/ports";

/** Compact HMAC-signed tokens: base64url(payload).base64url(sig). Payload includes exp. Swap for JWT/JWE later if needed. */
export class HmacTokenSigner implements TokenSigner {
  constructor(private readonly secret: string) {}
  async sign(payload: Record<string, unknown>, ttlSeconds: number): Promise<string> {
    const body = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + ttlSeconds })).toString("base64url");
    return `${body}.${this.mac(body)}`;
  }
  async verify(token: string): Promise<Record<string, unknown> | null> {
    const [body, sig] = token.split(".");
    if (!body || !sig) return null;
    const expected = this.mac(body);
    if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Record<string, unknown>;
    if (typeof payload["exp"] === "number" && payload["exp"] < Date.now() / 1000) return null;
    return payload;
  }
  private mac(body: string): string { return createHmac("sha256", this.secret).update(body).digest("base64url"); }
}
