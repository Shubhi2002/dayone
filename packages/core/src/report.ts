import type { Dimension } from "./problem.js";
import type { EventId, ReportId, SessionId } from "./ids.js";

export interface RubricItemScore { itemId: string; dimension: Dimension; score: number; agreement: number; evidence: EventId[]; humanOverride: number | null; }
export interface DimensionScore { dimension: Dimension; score: number | null; assessed: boolean; }
export interface KeyMoment { at: string; title: string; description: string; evidence: EventId[]; polarity: "positive" | "neutral" | "concern"; }
export interface Report {
  id: ReportId;
  sessionId: SessionId;
  overall: number | null;
  dimensions: DimensionScore[];
  rubric: RubricItemScore[];
  keyMoments: KeyMoment[];
  rationale: string;
  debriefQuestions: string[];
  humanReviewed: boolean;
  candidateVisibleAt: Date | null;
  createdAt: Date;
}
