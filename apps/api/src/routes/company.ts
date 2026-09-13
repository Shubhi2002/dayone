import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { CreateInterviewLink, GetReport, ListProblems } from "@dayone/application";
import type { Container } from "../container.js";

/** Console routes. TODO(CP4): company auth (magic link) middleware; for now companyId/userId come from headers in dev. */
export async function registerCompanyRoutes(app: FastifyInstance, c: Container): Promise<void> {
  const who = (h: Record<string, unknown>) => ({ companyId: String(h["x-company-id"] ?? "dev-company"), userId: String(h["x-user-id"] ?? "dev-user") });

  app.get("/v1/company/problems", async () => new ListProblems(c).execute());

  app.post("/v1/company/links", async (req) => {
    const body = z.object({
      problemId: z.string(), allowedAgents: z.array(z.string()).min(1), timeBudgetMinutes: z.number().int().optional(),
      roleProfile: z.string().optional(), candidateEmail: z.string().email().optional(), expiresInDays: z.number().int().min(1).max(30).optional(),
    }).parse(req.body);
    const { companyId, userId } = who(req.headers as Record<string, unknown>);
    return new CreateInterviewLink(c).execute({ companyId, createdBy: userId, ...body });
  });

  app.get("/v1/company/sessions", async (req) => {
    const { companyId } = who(req.headers as Record<string, unknown>);
    const sessions = await c.repos.sessions.listByCompany(companyId);
    return { sessions: sessions.map((s) => s.snapshot()) };
  });

  app.get("/v1/company/sessions/:id/report", async (req) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    return new GetReport(c).execute({ sessionId: id, audience: "company" });
  });
}
