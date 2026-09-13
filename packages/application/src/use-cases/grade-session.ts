import type { Report } from "@dayone/core";
import { asReportId, asSessionId, NotFoundError } from "@dayone/core";
import type { AppDeps } from "../deps.js";
import { extractSignals } from "../scoring/signals.js";

/**
 * Grading pipeline skeleton: normalise → signals → rubric agents → reconcile → compose.
 * V0: signals are computed; rubric grading is a stub that leaves scores null for human review (docs/SCORING.md).
 */
export class GradeSession {
  constructor(private readonly deps: Pick<AppDeps, "repos" | "stores" | "clock" | "ids" | "logger">) {}
  async execute(input: { sessionId: string }): Promise<Report> {
    const session = await this.deps.repos.sessions.get(asSessionId(input.sessionId));
    if (!session) throw new NotFoundError("Session not found");
    const events = await this.deps.stores.trace.read(session.id);
    const signals = extractSignals(events);
    this.deps.logger.info("signals extracted", { sessionId: session.id, ...signals });

    // TODO(CP3): rubric agents (5 runs per item, evidence citations), reconciler, composer.
    const report: Report = {
      id: asReportId(this.deps.ids.next()), sessionId: session.id, overall: null,
      dimensions: ["code-quality", "testing", "ai-collaboration", "engineering-judgment"].map((d) => ({ dimension: d as Report["dimensions"][number]["dimension"], score: null, assessed: true })),
      rubric: [], keyMoments: [], rationale: "Pending human review.", debriefQuestions: [], humanReviewed: false,
      candidateVisibleAt: null, createdAt: this.deps.clock.now(),
    };
    await this.deps.repos.reports.save(report);
    session.transition("graded", this.deps.clock.now());
    await this.deps.repos.sessions.save(session);
    return report;
  }
}
