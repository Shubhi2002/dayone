import type { AgentProviderId, CompanyId, CompanyUserId, LinkId, ProblemId, SessionId } from "./ids.js";
import { ValidationError } from "./errors.js";

/** Single-use, signed interview link. Redeeming it creates exactly one Session. */
export interface InterviewLink {
  id: LinkId;
  companyId: CompanyId;
  createdBy: CompanyUserId;
  problemId: ProblemId;
  problemRef: string;               // pinned git ref at creation time
  variant: string | null;           // chosen at redemption when null
  allowedAgents: AgentProviderId[]; // company-narrowed subset of the problem's default list
  timeBudgetMinutes: number;
  roleProfile: string;
  candidateEmail: string | null;
  expiresAt: Date;
  redeemedBy: SessionId | null;
  createdAt: Date;
}

export function assertAllowedAgents(link: Pick<InterviewLink, "allowedAgents">, candidates: AgentProviderId[]): void {
  if (link.allowedAgents.length === 0) throw new ValidationError("A link must allow at least one agent");
  for (const a of link.allowedAgents) {
    if (!candidates.includes(a)) throw new ValidationError(`Agent ${a} is not allowed by the problem`, { agent: a });
  }
}
