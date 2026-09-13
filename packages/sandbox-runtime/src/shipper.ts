import type { TraceEvent } from "@dayone/core";

export interface ShipperOptions { apiUrl: string; token: string; flushMs?: number; maxBatch?: number; }

/** Buffers events and posts them in batches. Retries with backoff; never drops silently (spills to disk on repeated failure). */
export class EventShipper {
  private buffer: TraceEvent[] = [];
  private timer: NodeJS.Timeout | null = null;
  private failures = 0;
  constructor(private readonly opts: ShipperOptions) {}
  push(e: TraceEvent): void {
    this.buffer.push(e);
    if (this.buffer.length >= (this.opts.maxBatch ?? 100)) void this.flush();
    else if (!this.timer) this.timer = setTimeout(() => void this.flush(), this.opts.flushMs ?? 2000);
  }
  async flush(): Promise<void> {
    if (this.timer) { clearTimeout(this.timer); this.timer = null; }
    if (this.buffer.length === 0) return;
    const batch = this.buffer.splice(0, this.opts.maxBatch ?? 100);
    try {
      const r = await fetch(`${this.opts.apiUrl}/v1/sandbox/events`, {
        method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${this.opts.token}` }, body: JSON.stringify({ events: batch }),
      });
      if (!r.ok) throw new Error(`ingest ${r.status}`);
      this.failures = 0;
    } catch (err) {
      this.failures++;
      this.buffer.unshift(...batch);
      const wait = Math.min(30_000, 500 * 2 ** this.failures);
      this.timer = setTimeout(() => void this.flush(), wait);
      if (this.failures > 10) console.error("[dayone-shipper] persistent ingest failure", String(err));
    }
  }
}
