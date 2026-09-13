import type { Job, JobName, JobPayloads, JobQueue } from "@dayone/ports";

/** Single-process queue for development and tests. Replace with the Redis implementation in production. */
export class InMemoryJobQueue implements JobQueue {
  private readonly pending: Job[] = [];
  private readonly seen = new Set<string>();
  private counter = 0;
  async enqueue<N extends JobName>(name: N, payload: JobPayloads[N], opts: { delayMs?: number; dedupeKey?: string } = {}): Promise<string> {
    if (opts.dedupeKey) { if (this.seen.has(opts.dedupeKey)) return `dedup:${opts.dedupeKey}`; this.seen.add(opts.dedupeKey); }
    const id = `job_${++this.counter}`;
    const push = () => this.pending.push({ id, name, payload, attempts: 0 } as Job);
    if (opts.delayMs) setTimeout(push, opts.delayMs); else push();
    return id;
  }
  async consume(handler: (job: Job) => Promise<void>, signal: AbortSignal): Promise<void> {
    while (!signal.aborted) {
      const job = this.pending.shift();
      if (!job) { await new Promise((r) => setTimeout(r, 100)); continue; }
      job.attempts++;
      try { await handler(job); } catch (err) { if (job.attempts < 3) this.pending.push(job); else console.error("job failed", job.name, err); }
    }
  }
}
