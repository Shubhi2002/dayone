import type { Problem } from "@dayone/core";
import type { AppDeps } from "../deps.js";

export interface ListProblemsOutput { problems: Problem[]; agents: { id: string; displayName: string }[]; }

/** Marketplace listing plus the agents this deployment can offer, so the console can build the allowed-agents picker. */
export class ListProblems {
  constructor(private readonly deps: Pick<AppDeps, "repos" | "providers">) {}
  async execute(): Promise<ListProblemsOutput> {
    const problems = await this.deps.repos.problems.list();
    const agents = this.deps.providers.agents.list().map((a) => ({ id: a.descriptor.id, displayName: a.descriptor.displayName }));
    return { problems, agents };
  }
}
