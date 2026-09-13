import type { FastifyInstance } from "fastify";
import type { Container } from "../container.js";

/**
 * Agent gateway: `/gateway/:vendor/*` → vendor API. Authenticates the per-session virtual key, injects the real vendor key,
 * enforces the budget, and records `agent.prompt` / `agent.completion` events.
 * V0 skeleton: auth + routing + accounting hooks; streaming passthrough and token accounting are TODO(CP2).
 */
const VENDOR_BASE: Record<string, string> = { anthropic: "https://api.anthropic.com", openai: "https://api.openai.com" };

export async function registerGatewayRoutes(app: FastifyInstance, c: Container): Promise<void> {
  app.all("/gateway/:vendor/*", async (req, reply) => {
    const vendor = (req.params as { vendor: string }).vendor;
    const upstream = VENDOR_BASE[vendor];
    if (!upstream) return reply.status(404).send({ error: "unknown_vendor" });

    const presented = String(req.headers["x-api-key"] ?? req.headers.authorization ?? "").replace(/^Bearer /, "");
    const key = c.gatewayState.resolve(presented);
    if (!key || !key.vendors.includes(vendor as never)) return reply.status(401).send({ error: "invalid_virtual_key" });
    const { spentMinor, budgetMinor } = await c.gateway.spent(key.sessionId);
    if (budgetMinor > 0 && spentMinor >= budgetMinor) return reply.status(402).send({ error: "budget_exhausted" });

    const vendorKey = vendor === "anthropic" ? c.config.ANTHROPIC_API_KEY : c.config.OPENAI_API_KEY;
    if (!vendorKey) return reply.status(503).send({ error: "vendor_not_configured" });

    const path = req.url.replace(`/gateway/${vendor}`, "");
    const headers = new Headers();
    for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string" && !["host", "authorization", "x-api-key", "content-length"].includes(k)) headers.set(k, v);
    if (vendor === "anthropic") headers.set("x-api-key", vendorKey); else headers.set("authorization", `Bearer ${vendorKey}`);

    const res = await fetch(upstream + path, { method: req.method, headers, body: ["GET", "HEAD"].includes(req.method) ? undefined : JSON.stringify(req.body) });
    // TODO(CP2): stream the body through, parse usage from the response (or SSE tail) and record cost via c.gatewayState.record(...).
    reply.status(res.status);
    res.headers.forEach((v, k) => { if (!["content-encoding", "transfer-encoding"].includes(k)) reply.header(k, v); });
    return reply.send(Buffer.from(await res.arrayBuffer()));
  });
}
