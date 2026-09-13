import { asAgentProviderId, asSessionId, NotFoundError } from "@dayone/core";
import type { AppDeps } from "../deps.js";

export interface SelectAgentInput { sessionId: string; agent: string; model?: string; }

/** Candidate chose one of the allowed agents. Enqueues provisioning. */
export class SelectAgent {
  constructor(private readonly deps: Pick<AppDeps, "repos" | "providers" | "clock" | "ids" | "queue" | "stores">) {}
  async execute(input: SelectAgentInput): Promise<{ sessionId: string; state: string }> {
    const session = await this.deps.repos.sessions.get(asSessionId(input.sessionId));
    if (!session) throw new NotFoundError("Session not found");
    const agentId = asAgentProviderId(input.agent);
    const provider = this.deps.providers.agents.get(agentId);
    const model = input.model ?? provider.descriptor.capabilities.models[0] ?? null;
    const now = this.deps.clock.now();

    session.selectAgent({ agent: agentId, model, gatewayKeyId: null, selectedAt: now }, now);
    await this.deps.repos.sessions.save(session);
    await this.deps.stores.trace.append([{
      schemaVersion: 1, id: this.deps.ids.next(), sessionId: session.id, at: now.toISOString(), source: "control-plane",
      type: "session.agent_selected", payload: { agent: agentId, model },
    }]);
    await this.deps.queue.enqueue("session.provision", { sessionId: session.id }, { dedupeKey: `provision:${session.id}` });
    return { sessionId: session.id, state: session.state };
  }
}
