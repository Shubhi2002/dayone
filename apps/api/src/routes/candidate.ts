import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { GetReport, RedeemInterviewLink, SelectAgent, SubmitSession } from "@dayone/application";
import { asSessionId } from "@dayone/core";
import type { Container } from "../container.js";

/** Candidate shell routes. TODO(CP1): session cookie issued on redeem; for now the sessionId is passed explicitly. */
export async function registerCandidateRoutes(app: FastifyInstance, c: Container): Promise<void> {
  // Token in the body: signed links are longer than Fastify's default max URL param length.
  app.post("/v1/candidate/links/redeem", async (req) => {
    const { token } = z.object({ token: z.string().min(16) }).parse(req.body);
    const out = await new RedeemInterviewLink(c).execute({ token });
    const agents = out.allowedAgents.map((id) => { const p = c.providers.agents.get(id as never); return { id, displayName: p.descriptor.displayName, models: p.descriptor.capabilities.models }; });
    return { ...out, agents };
  });

  app.post("/v1/candidate/sessions/:id/agent", async (req) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({ agent: z.string(), model: z.string().optional() }).parse(req.body);
    return new SelectAgent(c).execute({ sessionId: id, ...body });
  });

  app.get("/v1/candidate/sessions/:id", async (req) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const s = await c.repos.sessions.get(asSessionId(id));
    if (!s) return { error: "not_found" };
    const p = s.snapshot();
    return { id: p.id, state: p.state, agent: p.agent?.agent ?? null, timeBudgetMinutes: p.timeBudgetMinutes, startedAt: p.startedAt, hardStopAt: s.hardStopAt() };
  });

  app.post("/v1/candidate/sessions/:id/submit", async (req) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    const body = z.object({ answers: z.array(z.object({ questionId: z.string(), text: z.string().max(10_000) })) }).parse(req.body);
    return new SubmitSession(c).execute({ sessionId: id, answers: body.answers });
  });

  app.get("/v1/candidate/sessions/:id/report", async (req) => {
    const { id } = z.object({ id: z.string() }).parse(req.params);
    return new GetReport(c).execute({ sessionId: id, audience: "candidate" });
  });
}
