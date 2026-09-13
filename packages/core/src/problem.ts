import type { AgentProviderId, ProblemId } from "./ids.js";

export type Mode = "build" | "debug" | "review";
export type Level = "junior" | "mid" | "senior" | "staff";
export type Dimension =
  | "debugging" | "code-quality" | "system-design" | "testing"
  | "performance" | "security" | "ai-collaboration" | "engineering-judgment";

/** A problem statement lives in its own repository; this is the platform's view of its manifest. */
export interface Problem {
  id: ProblemId;
  title: string;
  summary: string;
  mode: Mode;
  level: Level;
  stack: string[];
  timeBudgetMinutes: number;
  repo: { url: string; ref: string };
  sandbox: { template: string; vcpu: number; memoryMb: number; ports: number[]; egress: string[] };
  agents: { allowedDefault: AgentProviderId[]; budgetMinor: number };
  variants: string[];
  dimensions: { primary: Dimension[]; secondary: Dimension[] };
}
