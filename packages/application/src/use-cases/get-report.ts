import type { Report } from "@dayone/core";
import { asSessionId, ForbiddenError, NotFoundError } from "@dayone/core";
import type { AppDeps } from "../deps.js";

export class GetReport {
  constructor(private readonly deps: Pick<AppDeps, "repos">) {}
  /** `audience` controls redaction: candidates see nothing until the company recorded a decision. */
  async execute(input: { sessionId: string; audience: "company" | "candidate" }): Promise<Report> {
    const report = await this.deps.repos.reports.getBySession(asSessionId(input.sessionId));
    if (!report) throw new NotFoundError("Report not ready");
    if (input.audience === "candidate" && !report.candidateVisibleAt) throw new ForbiddenError("Report not yet visible to candidate");
    return report;
  }
}
