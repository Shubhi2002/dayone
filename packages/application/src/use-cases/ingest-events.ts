import { asSessionId, ForbiddenError, NotFoundError, parseTraceEvent, ValidationError, type TraceEvent } from "@dayone/core";
import type { AppDeps } from "../deps.js";

export interface IngestEventsInput { sandboxToken: string; events: unknown[]; }

/** Sandbox → control plane. Everything here is untrusted input: token, schema, session state, rate. */
export class IngestEvents {
  constructor(private readonly deps: Pick<AppDeps, "repos" | "stores" | "tokens" | "clock">) {}
  async execute(input: IngestEventsInput): Promise<{ accepted: number }> {
    const claims = await this.deps.tokens.verify(input.sandboxToken);
    if (!claims || claims["kind"] !== "sandbox" || typeof claims["sessionId"] !== "string") throw new ForbiddenError("Bad sandbox token");
    const sessionId = asSessionId(claims["sessionId"]);
    const session = await this.deps.repos.sessions.get(sessionId);
    if (!session) throw new NotFoundError("Session not found");
    if (!["provisioning", "live", "paused"].includes(session.state)) throw new ValidationError("Session not accepting events", { state: session.state });
    if (input.events.length > 500) throw new ValidationError("Too many events in one batch");

    const received = this.deps.clock.now().toISOString();
    const events: TraceEvent[] = [];
    for (const raw of input.events) {
      const e = parseTraceEvent(raw);
      if (e.sessionId !== sessionId) throw new ForbiddenError("Event for another session");
      if (e.source === "control-plane") throw new ForbiddenError("Sandboxes cannot emit control-plane events");
      events.push({ ...e, receivedAt: received } as TraceEvent);
    }
    await this.deps.stores.trace.append(events);
    return { accepted: events.length };
  }
}
