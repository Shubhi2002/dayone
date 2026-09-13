import type { SessionId } from "@dayone/core";

/** Typed background jobs. Add a job here and a handler in apps/worker. */
export interface JobPayloads {
  "session.provision": { sessionId: SessionId };
  "session.finalize": { sessionId: SessionId };
  "session.grade": { sessionId: SessionId };
  "session.expire-check": { sessionId: SessionId };
}
export type JobName = keyof JobPayloads;
export type JobOf<N extends JobName> = { id: string; name: N; payload: JobPayloads[N]; attempts: number };
/** Discriminated union over job names so handlers narrow on `job.name`. */
export type Job = { [N in JobName]: JobOf<N> }[JobName];

export interface JobQueue {
  enqueue<N extends JobName>(name: N, payload: JobPayloads[N], opts?: { delayMs?: number; dedupeKey?: string }): Promise<string>;
  /** Long-running consumer; resolves when `signal` aborts. */
  consume(handler: (job: Job) => Promise<void>, signal: AbortSignal): Promise<void>;
}
