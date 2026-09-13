import { asSessionId, NotFoundError } from "@dayone/core";
import type { AppDeps } from "../deps.js";

export interface SubmitSessionInput { sessionId: string; answers: { questionId: string; text: string }[]; }

/** Candidate submitted the wrap-up. Records answers, moves to submitted, enqueues finalize + grade. */
export class SubmitSession {
  constructor(private readonly deps: Pick<AppDeps, "repos" | "stores" | "clock" | "ids" | "queue">) {}
  async execute(input: SubmitSessionInput): Promise<{ state: string }> {
    const session = await this.deps.repos.sessions.get(asSessionId(input.sessionId));
    if (!session) throw new NotFoundError("Session not found");
    const now = this.deps.clock.now();
    await this.deps.stores.trace.append(input.answers.map((a) => ({
      schemaVersion: 1 as const, id: this.deps.ids.next(), sessionId: session.id, at: now.toISOString(), source: "control-plane" as const,
      type: "candidate.answer" as const, payload: { questionId: a.questionId, text: a.text },
    })));
    session.transition("submitted", now);
    await this.deps.repos.sessions.save(session);
    await this.deps.queue.enqueue("session.finalize", { sessionId: session.id }, { dedupeKey: `finalize:${session.id}` });
    return { state: session.state };
  }
}
