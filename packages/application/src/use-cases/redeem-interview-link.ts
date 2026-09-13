import { asLinkId, asSessionId, ConflictError, ForbiddenError, NotFoundError, Session } from "@dayone/core";
import type { AppDeps } from "../deps.js";

export interface RedeemInterviewLinkInput { token: string; }
export interface RedeemInterviewLinkOutput { sessionId: string; allowedAgents: string[]; autoSelected: boolean; }

/** Candidate opened the link: verify, create the Session, pick a variant. Idempotent for an already-redeemed link. */
export class RedeemInterviewLink {
  constructor(private readonly deps: Pick<AppDeps, "repos" | "clock" | "ids" | "tokens" | "stores">) {}
  async execute(input: RedeemInterviewLinkInput): Promise<RedeemInterviewLinkOutput> {
    const claims = await this.deps.tokens.verify(input.token);
    if (!claims || typeof claims["linkId"] !== "string") throw new ForbiddenError("Invalid or expired link");
    const link = await this.deps.repos.links.get(asLinkId(claims["linkId"]));
    if (!link) throw new NotFoundError("Link not found");
    const now = this.deps.clock.now();
    if (link.expiresAt < now) throw new ForbiddenError("Link expired");

    if (link.redeemedBy) {
      const existing = await this.deps.repos.sessions.get(link.redeemedBy);
      if (!existing) throw new ConflictError("Link redeemed but session missing");
      const p = existing.snapshot();
      return { sessionId: p.id, allowedAgents: p.allowedAgents, autoSelected: p.allowedAgents.length === 1 };
    }
    const problem = await this.deps.repos.problems.get(link.problemId);
    if (!problem) throw new NotFoundError("Problem not found");
    const variant = link.variant ?? pickVariant(problem.variants, this.deps.ids.next());

    const session = Session.create({
      id: asSessionId(this.deps.ids.next()), linkId: link.id, companyId: link.companyId, problemId: link.problemId,
      problemRef: link.problemRef, variant, allowedAgents: link.allowedAgents, timeBudgetMinutes: link.timeBudgetMinutes, createdAt: now,
    });
    await this.deps.repos.sessions.save(session);
    await this.deps.repos.links.save({ ...link, redeemedBy: session.id, variant });
    await this.deps.stores.trace.append([{
      schemaVersion: 1, id: this.deps.ids.next(), sessionId: session.id, at: now.toISOString(), source: "control-plane",
      type: "session.state_changed", payload: { from: "none", to: "created", actor: "candidate" },
    }]);
    return { sessionId: session.id, allowedAgents: link.allowedAgents, autoSelected: link.allowedAgents.length === 1 };
  }
}

function pickVariant(pool: string[], seed: string): string {
  if (pool.length === 0) return "default";
  let h = 0; for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return pool[h % pool.length] ?? "default";
}
