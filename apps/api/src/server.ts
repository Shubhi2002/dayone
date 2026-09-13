import Fastify, { type FastifyInstance } from "fastify";
import type { Config } from "@dayone/config";
import { DomainError } from "@dayone/core";
import type { Container } from "./container.js";
import { registerCompanyRoutes } from "./routes/company.js";
import { registerCandidateRoutes } from "./routes/candidate.js";
import { registerSandboxRoutes } from "./routes/sandbox.js";
import { registerGatewayRoutes } from "./routes/gateway.js";

const HTTP_STATUS: Record<string, number> = { not_found: 404, validation: 400, forbidden: 403, conflict: 409, invalid_transition: 409, provider: 502, budget_exceeded: 402 };

export async function buildServer(c: Container, config: Config): Promise<FastifyInstance> {
  const app = Fastify({ logger: config.NODE_ENV !== "test" });
  app.setErrorHandler((raw: unknown, _req, reply) => {
    const err = raw as Error & { code?: string; details?: Record<string, unknown> };
    if (err instanceof DomainError) return reply.status(HTTP_STATUS[err.code] ?? 400).send({ error: err.code, message: err.message, details: err.details });
    if (err.name === "ZodError") return reply.status(400).send({ error: "validation", message: err.message });
    c.logger.error("unhandled", { err: String(err) });
    return reply.status(500).send({ error: "internal" });
  });
  app.get("/health", async () => ({ ok: true, sandbox: c.defaults.sandbox, agents: c.providers.agents.ids() }));
  await registerCompanyRoutes(app, c);
  await registerCandidateRoutes(app, c);
  await registerSandboxRoutes(app, c);
  await registerGatewayRoutes(app, c);
  return app;
}
