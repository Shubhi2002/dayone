import type { InterviewLink } from "@dayone/core";
import { asAgentProviderId, asCompanyId, asCompanyUserId, asLinkId, asProblemId, assertAllowedAgents, NotFoundError } from "@dayone/core";
import type { AppDeps } from "../deps.js";

export interface CreateInterviewLinkInput {
  companyId: string; createdBy: string; problemId: string;
  allowedAgents: string[];            // must be a subset of the problem's default list and of enabled providers
  timeBudgetMinutes?: number; roleProfile?: string; candidateEmail?: string; expiresInDays?: number;
}
export interface CreateInterviewLinkOutput { link: InterviewLink; url: string; }

export class CreateInterviewLink {
  constructor(private readonly deps: Pick<AppDeps, "repos" | "providers" | "clock" | "ids" | "tokens" | "defaults">) {}
  async execute(input: CreateInterviewLinkInput): Promise<CreateInterviewLinkOutput> {
    const problem = await this.deps.repos.problems.get(asProblemId(input.problemId));
    if (!problem) throw new NotFoundError("Problem not found", { problemId: input.problemId });

    const allowed = input.allowedAgents.map(asAgentProviderId).filter((a) => this.deps.providers.agents.has(a));
    assertAllowedAgents({ allowedAgents: allowed }, problem.agents.allowedDefault);

    const now = this.deps.clock.now();
    const link: InterviewLink = {
      id: asLinkId(this.deps.ids.next()), companyId: asCompanyId(input.companyId), createdBy: asCompanyUserId(input.createdBy),
      problemId: problem.id, problemRef: problem.repo.ref, variant: null, allowedAgents: allowed,
      timeBudgetMinutes: input.timeBudgetMinutes ?? problem.timeBudgetMinutes, roleProfile: input.roleProfile ?? `${problem.level}-default`,
      candidateEmail: input.candidateEmail ?? null,
      expiresAt: new Date(now.getTime() + (input.expiresInDays ?? 7) * 86_400_000), redeemedBy: null, createdAt: now,
    };
    await this.deps.repos.links.save(link);
    const token = await this.deps.tokens.sign({ linkId: link.id }, (input.expiresInDays ?? 7) * 86_400);
    return { link, url: `${this.deps.defaults.publicBaseUrl}/i/${token}` };
  }
}
